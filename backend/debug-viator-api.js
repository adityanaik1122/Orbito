/**
 * Debug script to check Viator API configuration
 */

require('dotenv').config();

console.log('🔍 Viator API Configuration Debug\n');
console.log('Environment Variables:');
console.log('  VIATOR_API_URL:', process.env.VIATOR_API_URL);
console.log('  VIATOR_API_KEY:', process.env.VIATOR_API_KEY ? `${process.env.VIATOR_API_KEY.substring(0, 8)}...` : 'NOT SET');
console.log('  API Key Length:', process.env.VIATOR_API_KEY?.length || 0);
console.log('  API Key (full):', process.env.VIATOR_API_KEY);

console.log('\n📡 Testing API Connection...\n');

async function testConnection() {
  const url = `${process.env.VIATOR_API_URL}/products/search`;
  
  console.log('Request Details:');
  console.log('  URL:', url);
  console.log('  Method: POST');
  console.log('  Headers:');
  console.log('    Accept: application/json;version=2.0');
  console.log('    Accept-Language: en-US');
  console.log('    Content-Type: application/json');
  console.log('    exp-api-key:', process.env.VIATOR_API_KEY);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'Content-Type': 'application/json',
        'exp-api-key': process.env.VIATOR_API_KEY
      },
      body: JSON.stringify({
        destId: 684,
        topX: '1-5',
        sortOrder: 'REVIEW_AVG_RATING_D',
        currency: 'USD'
      })
    });
    
    console.log('\n📥 Response:');
    console.log('  Status:', response.status, response.statusText);
    console.log('  Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('  Body:', text);
    
    if (response.ok) {
      console.log('\n✅ API Connection Successful!');
    } else {
      console.log('\n❌ API Connection Failed');
      console.log('\nPossible Issues:');
      console.log('  1. API key is invalid or expired');
      console.log('  2. API key is for production, not sandbox (or vice versa)');
      console.log('  3. API key doesn\'t have proper permissions');
      console.log('  4. Sandbox environment might be down');
    }
  } catch (error) {
    console.error('\n❌ Connection Error:', error.message);
  }
}

testConnection();
