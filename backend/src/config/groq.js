const Groq = require('groq-sdk');
const logger = require('../utils/logger');

let groqClient = null;

try {
  if (!process.env.GROQ_API_KEY) {
    logger.warn('GROQ_API_KEY missing');
  } else {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    logger.success('Groq AI initialized');
  }
} catch (error) {
  logger.error('Error initializing Groq', error);
}

/**
 * Generate content using Groq AI
 * @param {string} prompt - The prompt to send to the AI
 * @param {string} model - The model to use (default: llama-3.3-70b-versatile)
 * @param {boolean} jsonMode - Force JSON output (default: true)
 * @returns {Promise<string>} - The generated text
 */
async function generateContent(prompt, model = 'llama-3.3-70b-versatile', jsonMode = true) {
  if (!groqClient) {
    throw new Error('Groq AI is not initialized. Set GROQ_API_KEY in your .env file.');
  }

  try {
    const requestOptions = {
      messages: [
        {
          role: 'system',
          content: 'You are a JSON-only API. You must respond with ONLY valid JSON. Do not include any explanations, greetings, markdown code blocks, or text before or after the JSON. Your entire response must be parseable JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: model,
      temperature: 0.5,
      max_tokens: 4096,
      top_p: 1,
      stream: false
    };

    // Add JSON mode if supported by the model
    if (jsonMode && (model.includes('llama') || model.includes('mixtral'))) {
      requestOptions.response_format = { type: 'json_object' };
    }

    const chatCompletion = await groqClient.chat.completions.create(requestOptions);

    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    logger.error(`Error with Groq model ${model}`, error);
    throw error;
  }
}

/**
 * Available Groq models (sorted by capability)
 * Updated with current supported models as of 2024
 */
const GROQ_MODELS = {
  // Best for complex tasks (updated model)
  LLAMA_70B: 'llama-3.3-70b-versatile',
  LLAMA_8B: 'llama-3.1-8b-instant',
  
  // Alternative models
  MIXTRAL: 'mixtral-8x7b-32768',
  GEMMA_9B: 'gemma2-9b-it',
  LLAMA_3_70B: 'llama3-70b-8192'
};

module.exports = {
  generateContent,
  GROQ_MODELS,
  groqClient
};
