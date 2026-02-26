/**
 * Test script for Viator Sandbox API
 * Run: node test-viator-sandbox.js
 */

require('dotenv').config();
const ViatorService = require('./src/services/viatorService');

async function testViatorSandbox() {
  console.log('🧪 Testing Viator Sandbox Integration...\n');
  
  // Test 1: Search Tours in London
  console.log('Test 1: Searching tours in London (destId: 684)');
  try {
    const tours = await ViatorService.searchTours({
      destinationId: '684', // London
      sortOrder: 'REVIEW_AVG_RATING_D'
    });
    
    console.log(`✅ Success! Found ${tours.length} tours`);
    if (tours.length > 0) {
      console.log('\nFirst tour:');
      console.log(`  - Title: ${tours[0].title}`);
      console.log(`  - Price: ${tours[0].currency} ${tours[0].price_adult}`);
      console.log(`  - Rating: ${tours[0].rating} (${tours[0].review_count} reviews)`);
      console.log(`  - Provider: ${tours[0].provider}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 2: Get Product Details (if we have a product code)
  console.log('Test 2: Get Product Details');
  try {
    // Use a sample product code from Viator sandbox docs
    // Replace with actual product code from Test 1 results
    const productCode = '5010SYDNEY'; // Example sandbox product
    const details = await ViatorService.getProductDetails(productCode);
    
    console.log(`✅ Success! Got details for: ${details.title}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('ℹ️  This is expected if product code doesn\'t exist in sandbox');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Test 3: Check Availability
  console.log('Test 3: Check Availability');
  try {
    const productCode = '5010SYDNEY';
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days from now
    const dateStr = date.toISOString().split('T')[0];
    
    const availability = await ViatorService.checkAvailability(productCode, dateStr);
    console.log(`✅ Available: ${availability.available}, Spots: ${availability.spots}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('ℹ️  This is expected if product code doesn\'t exist in sandbox');
  }
  
  console.log('\n✨ Testing complete!\n');
}

// Run the tests
testViatorSandbox().catch(console.error);
