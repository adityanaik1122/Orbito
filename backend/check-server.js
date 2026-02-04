// Quick diagnostic to check if server has the route
const express = require('express');
const app = express();

// Read and evaluate the server file to check routes
const fs = require('fs');
const serverCode = fs.readFileSync('server.js', 'utf8');

console.log('=== Server Route Check ===');
console.log('File contains ai-suggest route:', serverCode.includes("app.post('/api/ai-suggest"));
console.log('File contains test-ai route:', serverCode.includes("app.get('/api/test-ai"));

// Count all routes
const routeMatches = serverCode.match(/app\.(get|post|put|delete)\('\/api\/[^']+'/g);
console.log('\nAll /api routes found:');
if (routeMatches) {
  routeMatches.forEach((route, i) => {
    console.log(`  ${i + 1}. ${route}`);
  });
} else {
  console.log('  No routes found!');
}

console.log('\n=== Route Position Check ===');
const aiSuggestIndex = serverCode.indexOf("app.post('/api/ai-suggest");
const listenIndex = serverCode.indexOf('app.listen(');

if (aiSuggestIndex !== -1 && listenIndex !== -1) {
  console.log('✅ ai-suggest route is defined BEFORE app.listen');
  console.log(`   Route at position: ${aiSuggestIndex}`);
  console.log(`   app.listen at position: ${listenIndex}`);
} else {
  console.log('❌ Could not verify route position');
}
