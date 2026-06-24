const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const logger = require('../utils/logger');

// ── Provider clients (lazy-init, null if key missing) ─────────────────────────

function makeGroqClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  try { return new Groq({ apiKey: key }); } catch { return null; }
}

function makeGeminiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  try { return new GoogleGenerativeAI(key); } catch { return null; }
}

function makeOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try { return new OpenAI({ apiKey: key }); } catch { return null; }
}

const groqClient   = makeGroqClient();
const geminiClient = makeGeminiClient();
const openaiClient = makeOpenAIClient();

// ── Per-provider generators ───────────────────────────────────────────────────

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
];

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.5-pro',
];

const OPENAI_MODELS = [
  'gpt-4o-mini',
  'gpt-4o',
];

const JSON_SYSTEM = 'You are a JSON-only API. Respond with ONLY valid JSON. No explanations, no markdown, no code blocks — just raw parseable JSON.';

async function tryGroq(prompt, { jsonMode, temperature, maxTokens }) {
  if (!groqClient) throw new Error('Groq not configured');

  for (const model of GROQ_MODELS) {
    try {
      logger.info(`AI chain: trying Groq/${model}`);
      const opts = {
        messages: [
          { role: 'system', content: JSON_SYSTEM },
          { role: 'user',   content: prompt },
        ],
        model,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      };
      if (jsonMode && (model.includes('llama') || model.includes('mixtral'))) {
        opts.response_format = { type: 'json_object' };
      }
      const res = await groqClient.chat.completions.create(opts);
      const text = res.choices[0]?.message?.content || '';
      logger.success(`AI chain: Groq/${model} succeeded`);
      return text;
    } catch (e) {
      logger.warn(`AI chain: Groq/${model} failed — ${e.message}`);
    }
  }
  throw new Error('All Groq models failed');
}

async function tryGemini(prompt, { temperature, maxTokens }) {
  if (!geminiClient) throw new Error('Gemini not configured');

  for (const modelName of GEMINI_MODELS) {
    try {
      logger.info(`AI chain: trying Gemini/${modelName}`);
      const model = geminiClient.getGenerativeModel({
        model: modelName,
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      });
      const result = await model.generateContent(
        `${JSON_SYSTEM}\n\n${prompt}`
      );
      const text = result.response.text();
      logger.success(`AI chain: Gemini/${modelName} succeeded`);
      return text;
    } catch (e) {
      logger.warn(`AI chain: Gemini/${modelName} failed — ${e.message}`);
    }
  }
  throw new Error('All Gemini models failed');
}

async function tryOpenAI(prompt, { jsonMode, temperature, maxTokens }) {
  if (!openaiClient) throw new Error('OpenAI not configured');

  for (const model of OPENAI_MODELS) {
    try {
      logger.info(`AI chain: trying OpenAI/${model}`);
      const opts = {
        model,
        messages: [
          { role: 'system', content: JSON_SYSTEM },
          { role: 'user',   content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
      };
      if (jsonMode) opts.response_format = { type: 'json_object' };
      const res = await openaiClient.chat.completions.create(opts);
      const text = res.choices[0]?.message?.content || '';
      logger.success(`AI chain: OpenAI/${model} succeeded`);
      return text;
    } catch (e) {
      logger.warn(`AI chain: OpenAI/${model} failed — ${e.message}`);
    }
  }
  throw new Error('All OpenAI models failed');
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate content, falling back through Groq → Gemini → OpenAI.
 * Throws only if every configured provider fails.
 *
 * @param {string} prompt
 * @param {{ jsonMode?: boolean, temperature?: number, maxTokens?: number }} [opts]
 * @returns {Promise<string>}
 */
async function generateWithFallback(prompt, opts = {}) {
  const { jsonMode = true, temperature = 0.5, maxTokens = 4096 } = opts;
  const params = { jsonMode, temperature, maxTokens };
  const errors = [];

  for (const [name, fn] of [
    ['Groq',   () => tryGroq(prompt, params)],
    ['Gemini', () => tryGemini(prompt, params)],
    ['OpenAI', () => tryOpenAI(prompt, params)],
  ]) {
    try {
      return await fn();
    } catch (e) {
      errors.push(`${name}: ${e.message}`);
      logger.warn(`AI chain: ${name} exhausted, trying next provider`);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join('\n')}`);
}

module.exports = { generateWithFallback };
