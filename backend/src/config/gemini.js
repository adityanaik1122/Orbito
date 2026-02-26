const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

let genAI = null;

try {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY missing');
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    logger.success(' Gemini AI initialized');
  }
} catch (error) {
  console.error('❌ Error initializing Gemini:', error.message);
}

function getGenerativeModel(name) {
  if (!genAI) {
    throw new Error('Gemini AI is not initialized. Set GEMINI_API_KEY.');
  }
  return genAI.getGenerativeModel({ model: name });
}

module.exports = {
  getGenerativeModel,
};
