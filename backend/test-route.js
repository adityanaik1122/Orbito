// Quick test to verify the route exists
const serverContent = require('fs').readFileSync('server.js', 'utf8');

console.log('Checking server.js for ai-suggest route...');
console.log('Route exists:', serverContent.includes("app.post('/api/ai-suggest"));
console.log('Total routes found:', (serverContent.match(/app\.(get|post|put|delete)\('/g) || []).length);

// Check if route is before app.listen
const routeIndex = serverContent.indexOf("app.post('/api/ai-suggest");
const listenIndex = serverContent.indexOf('app.listen(');

if (routeIndex !== -1 && listenIndex !== -1) {
  console.log('Route is defined BEFORE app.listen:', routeIndex < listenIndex ? '✅ YES' : '❌ NO');
} else {
  console.log('Could not verify route position');
}
