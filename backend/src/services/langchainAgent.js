/**
 * LangChain Travel Agent - Quick Start Implementation
 * 
 * This is a ready-to-use conversational AI agent using LangChain + Groq
 * 
 * Installation required:
 * npm install langchain @langchain/groq @langchain/core
 */

const { ChatGroq } = require('@langchain/groq');
const { BufferMemory } = require('langchain/memory');
const { ConversationChain } = require('langchain/chains');
const { PromptTemplate } = require('@langchain/core/prompts');

class LangChainTravelAgent {
  constructor() {
    // Initialize Groq model
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Memory to maintain conversation context
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'chat_history',
    });

    // Custom prompt template
    this.prompt = PromptTemplate.fromTemplate(`
You are an expert travel advisor for Orbito, a travel planning platform. 
You help users plan trips, suggest destinations, recommend tours, and answer travel questions.

Be friendly, helpful, and concise. Provide specific recommendations when possible.

Current conversation:
{chat_history}

User: {input}
Assistant:`);

    // Create conversation chain
    this.chain = new ConversationChain({
      llm: this.model,
      memory: this.memory,
      prompt: this.prompt,
    });

    console.log('✅ LangChain Travel Agent initialized');
  }

  /**
   * Chat with the agent
   * @param {string} userId - User identifier for session management
   * @param {string} message - User message
   * @returns {Promise<string>} Agent response
   */
  async chat(userId, message) {
    try {
      const response = await this.chain.call({ input: message });
      return response.response;
    } catch (error) {
      console.error('LangChain chat error:', error);
      throw new Error('Failed to get response from AI agent');
    }
  }

  /**
   * Clear conversation memory
   */
  clearMemory() {
    this.memory.clear();
  }

  /**
   * Get conversation history
   */
  async getHistory() {
    return await this.memory.loadMemoryVariables({});
  }
}

module.exports = LangChainTravelAgent;
