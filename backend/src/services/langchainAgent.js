/**
 * LangChain Travel Agent - Quick Start Implementation
 * 
 * This is a ready-to-use conversational AI agent using LangChain + Groq
 * 
 * Installation required:
 * npm install langchain @langchain/groq @langchain/core
 */

const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');

class LangChainTravelAgent {
  constructor() {
    // Initialize Groq model
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile', // Updated to current model
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Store conversation history per user
    this.conversations = new Map();

    // Create prompt template
    this.prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are an expert travel advisor for Orbito, a travel planning platform. 
You help users plan trips, suggest destinations, recommend tours, and answer travel questions.

Be friendly, helpful, and concise. Provide specific recommendations when possible.`],
      ['human', '{input}']
    ]);

    // Create chain
    this.chain = this.prompt.pipe(this.model);

    const logger = require('../utils/logger');
    logger.success('LangChain Travel Agent initialized');
  }

  /**
   * Chat with the agent
   * @param {string} userId - User identifier for session management
   * @param {string} message - User message
   * @returns {Promise<string>} Agent response
   */
  async chat(userId, message) {
    try {
      // Get or create conversation history for this user
      if (!this.conversations.has(userId)) {
        this.conversations.set(userId, []);
      }

      const history = this.conversations.get(userId);
      
      // Build context from history
      let contextMessage = message;
      if (history.length > 0) {
        const recentHistory = history.slice(-3); // Last 3 exchanges
        const context = recentHistory.map(h => `${h.role}: ${h.content}`).join('\n');
        contextMessage = `Previous conversation:\n${context}\n\nCurrent question: ${message}`;
      }

      // Get response
      const response = await this.chain.invoke({ input: contextMessage });
      
      // Store in history
      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: response.content });

      // Keep only last 10 exchanges
      if (history.length > 20) {
        this.conversations.set(userId, history.slice(-20));
      }

      return response.content;
    } catch (error) {
      console.error('LangChain chat error:', error);
      throw new Error('Failed to get response from AI agent');
    }
  }

  /**
   * Clear conversation memory for a user
   */
  clearMemory(userId = null) {
    if (userId) {
      this.conversations.delete(userId);
    } else {
      this.conversations.clear();
    }
  }

  /**
   * Get conversation history for a user
   */
  getHistory(userId) {
    return this.conversations.get(userId) || [];
  }
}

module.exports = LangChainTravelAgent;
