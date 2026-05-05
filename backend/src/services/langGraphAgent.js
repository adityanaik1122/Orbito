const { StateGraph, START, END, Annotation } = require('@langchain/langgraph');
const { ChatGroq } = require('@langchain/groq');
const { HumanMessage, AIMessage, SystemMessage } = require('@langchain/core/messages');

// ── State schema ─────────────────────────────────────────────────────────────
const AgentState = Annotation.Root({
  input:       Annotation({ reducer: (_, x) => x }),
  history:     Annotation({ reducer: (_, x) => x, default: () => [] }),
  intent:      Annotation({ reducer: (_, x) => x, default: () => 'chat' }),
  response:    Annotation({ reducer: (_, x) => x, default: () => '' }),
  messageType: Annotation({ reducer: (_, x) => x, default: () => 'chat' }),
});

// ── System prompts per intent ────────────────────────────────────────────────
const SYSTEM_PROMPTS = {
  chat: `You are Orbi, a friendly and knowledgeable AI travel expert for Orbito — an AI-powered trip planning platform.

Help travelers with:
- Destination recommendations and comparisons
- Best time to visit, weather, visa/entry requirements
- Local culture, food, customs, tipping etiquette
- Budget advice, cost breakdowns, money-saving tips
- Safety guidance, packing tips, transportation
- Answering follow-up questions conversationally

Be warm, enthusiastic, and specific. Use real place names. Keep replies concise but useful.
If the user wants a full itinerary, suggest: "Want me to build you a full day-by-day plan? Just say 'plan my trip to [destination]'"`,

  plan: `You are Orbi, an AI itinerary builder for Orbito.

When a user asks to plan a trip, create a detailed, practical day-by-day itinerary.

FORMAT (strictly follow this):
**[N]-Day [Destination] Itinerary**
*[One-line trip summary]*

**Day 1 — [Theme/Title]**
- 🕘 09:00 — [Activity name] *(~Xh)* — [one helpful tip]
- 🍽️ 12:30 — Lunch at [Place] — [cuisine / dish to try]
- 🕝 14:00 — [Activity name] *(~Xh)* — [tip]
- 🌆 19:00 — [Dinner / Evening activity]

*(repeat for each day)*

**Essential Tips**
- 💰 Budget: [rough daily estimate]
- 📅 Best time to visit: [months]
- 🎟️ Book in advance: [specific things]
- 🚌 Getting around: [transport tip]

After the itinerary always end with:
---
✨ **Want to book activities from this plan?** Click **"Open in Planner"** to load this trip into Orbito's AI planner and book each experience directly via Viator!

Use real attraction names. Be specific and practical. Show genuine enthusiasm.`,

  tours: `You are Orbi, a tours and experiences specialist for Orbito.

Help users find the best tours, activities and experiences for their destination.

When recommending tours:
1. Use **bold** for tour/activity names
2. Include price range (e.g. ~$25–$40/person)
3. Explain briefly what makes it special
4. Group by category when there are many: Walking Tours, Food & Drink, Day Trips, Adventure, etc.
5. Mention booking tips (book early, skip-the-line worth it, etc.)

Always end with:
---
🎟️ All these experiences can be found and booked on **Viator** directly from your Orbito trip plan. Build your itinerary and every activity gets a Book on Viator link automatically!`,
};

// ── Models ───────────────────────────────────────────────────────────────────
let classifyModel = null;
let chatModel = null;

function getModels() {
  if (!classifyModel) {
    classifyModel = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.1-8b-instant',
      temperature: 0,
      maxTokens: 10,
    });
  }
  if (!chatModel) {
    chatModel = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      maxTokens: 2048,
    });
  }
  return { classifyModel, chatModel };
}

// ── Graph nodes ───────────────────────────────────────────────────────────────
async function classifyNode(state) {
  const { classifyModel } = getModels();
  try {
    const res = await classifyModel.invoke([
      new SystemMessage(
        'Classify the travel message. Reply with EXACTLY one word — "plan", "tours", or "chat".\n' +
        '- plan: user wants to create/build a trip itinerary, day-by-day schedule, what to do each day\n' +
        '- tours: user asks about specific tours, activities, things to do, booking experiences\n' +
        '- chat: general travel questions, destination info, tips, advice, comparisons\n' +
        'Reply only: plan, tours, or chat'
      ),
      new HumanMessage(state.input),
    ]);
    const raw = res.content.trim().toLowerCase().replace(/[^a-z]/g, '');
    const intent = ['plan', 'tours', 'chat'].includes(raw) ? raw : 'chat';
    return { intent };
  } catch {
    return { intent: 'chat' };
  }
}

function buildMessagesForNode(state) {
  const { chatModel } = getModels();
  const systemPrompt = SYSTEM_PROMPTS[state.intent] || SYSTEM_PROMPTS.chat;

  const history = (state.history || []).slice(-12).map((m) =>
    m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
  );

  return { chatModel, messages: [new SystemMessage(systemPrompt), ...history] };
}

async function chatNode(state) {
  const { chatModel, messages } = buildMessagesForNode(state);
  const res = await chatModel.invoke(messages);
  return { response: res.content, messageType: 'chat' };
}

async function planNode(state) {
  const { chatModel, messages } = buildMessagesForNode(state);
  const res = await chatModel.invoke(messages);
  return { response: res.content, messageType: 'itinerary' };
}

async function toursNode(state) {
  const { chatModel, messages } = buildMessagesForNode(state);
  const res = await chatModel.invoke(messages);
  return { response: res.content, messageType: 'tours' };
}

// ── Build graph ───────────────────────────────────────────────────────────────
function buildGraph() {
  const graph = new StateGraph(AgentState)
    .addNode('classify', classifyNode)
    .addNode('chat',     chatNode)
    .addNode('plan',     planNode)
    .addNode('tours',    toursNode)
    .addEdge(START, 'classify')
    .addConditionalEdges('classify', (state) => state.intent, {
      chat:  'chat',
      plan:  'plan',
      tours: 'tours',
    })
    .addEdge('chat',  END)
    .addEdge('plan',  END)
    .addEdge('tours', END);

  return graph.compile();
}

// ── Agent class ───────────────────────────────────────────────────────────────
class LangGraphTravelAgent {
  constructor() {
    this.app = buildGraph();
    this.conversations = new Map(); // userId → [{role, content}]
    const logger = require('../utils/logger');
    logger.success('LangGraph Travel Agent initialized');
  }

  _ensureHistory(userId) {
    if (!this.conversations.has(userId)) {
      this.conversations.set(userId, []);
    }
    return this.conversations.get(userId);
  }

  _saveHistory(userId, userMsg, assistantMsg, intent) {
    const history = this._ensureHistory(userId);
    history.push({ role: 'user', content: userMsg });
    history.push({ role: 'assistant', content: assistantMsg, intent });
    if (history.length > 20) {
      this.conversations.set(userId, history.slice(-20));
    }
  }

  // ── Non-streaming chat ────────────────────────────────────────────────────
  async chat(userId, message) {
    const history = this._ensureHistory(userId);
    const result = await this.app.invoke({
      input: message,
      history: [...history, { role: 'user', content: message }],
    });

    this._saveHistory(userId, message, result.response, result.intent);
    return { text: result.response, intent: result.intent, type: result.messageType };
  }

  // ── Streaming chat (generator) ────────────────────────────────────────────
  async *streamChat(userId, message) {
    const history = this._ensureHistory(userId);

    // 1. Classify intent first (fast model, non-streaming)
    let intent = 'chat';
    try {
      const { classifyModel } = getModels();
      const res = await classifyModel.invoke([
        new SystemMessage(
          'Classify the travel message. Reply with EXACTLY one word — "plan", "tours", or "chat".\n' +
          '- plan: user wants to create/build a trip itinerary, day-by-day schedule\n' +
          '- tours: user asks about specific tours, activities, things to do, booking\n' +
          '- chat: general travel questions, destination info, tips, advice\n' +
          'Reply only: plan, tours, or chat'
        ),
        new HumanMessage(message),
      ]);
      const raw = res.content.trim().toLowerCase().replace(/[^a-z]/g, '');
      intent = ['plan', 'tours', 'chat'].includes(raw) ? raw : 'chat';
    } catch { /* keep default */ }

    yield { type: 'intent', intent };

    // 2. Build messages with history
    const { chatModel } = getModels();
    const systemPrompt = SYSTEM_PROMPTS[intent] || SYSTEM_PROMPTS.chat;
    const historyWithCurrent = [...history, { role: 'user', content: message }];
    const lcMessages = [
      new SystemMessage(systemPrompt),
      ...historyWithCurrent.slice(-12).map((m) =>
        m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
      ),
    ];

    // 3. Stream tokens
    let fullResponse = '';
    try {
      const stream = await chatModel.stream(lcMessages);
      for await (const chunk of stream) {
        const token = chunk.content || '';
        if (token) {
          fullResponse += token;
          yield { type: 'token', token };
        }
      }
    } catch (err) {
      yield { type: 'error', message: err.message };
      return;
    }

    // 4. Persist history
    this._saveHistory(userId, message, fullResponse, intent);

    const messageType = intent === 'plan' ? 'itinerary' : intent === 'tours' ? 'tours' : 'chat';
    yield { type: 'done', intent, messageType };
  }

  clearMemory(userId = null) {
    if (userId) this.conversations.delete(userId);
    else this.conversations.clear();
  }

  getHistory(userId) {
    return this.conversations.get(userId) || [];
  }
}


module.exports = LangGraphTravelAgent;
