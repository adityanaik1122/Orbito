/**
 * Test LangChain Travel Agent
 * Run: node test-langchain.js
 */

require('dotenv').config();
const LangChainTravelAgent = require('./src/services/langchainAgent');

async function test() {
  console.log('🤖 Testing LangChain Agent...\n');
  
  const agent = new LangChainTravelAgent();
  
  try {
    // Test 1: Initial query
    console.log('User: I want to visit London for 3 days');
    const response1 = await agent.chat('user-123', 'I want to visit London for 3 days');
    console.log('Agent:', response1, '\n');
    
    // Test 2: Follow-up with context
    console.log('User: What are the must-see attractions?');
    const response2 = await agent.chat('user-123', 'What are the must-see attractions?');
    console.log('Agent:', response2, '\n');
    
    // Test 3: Budget question
    console.log('User: How much should I budget?');
    const response3 = await agent.chat('user-123', 'How much should I budget?');
    console.log('Agent:', response3, '\n');
    
    // Test 4: Check memory
    console.log('📝 Conversation History:');
    const history = await agent.getHistory();
    console.log(JSON.stringify(history, null, 2));
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

test();
