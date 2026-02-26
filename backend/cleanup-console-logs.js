/**
 * Script to replace console.log with logger in backend files
 */

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/services/emailService.js',
  'src/services/aiTourMatchingService.js',
  'src/models/itineraryModel.js',
  'src/controllers/tourController.js',
  'src/controllers/itineraryController.js',
  'src/controllers/aiController.js',
  'src/config/gemini.js',
  'src/config/resend.js',
  'src/services/viatorService.js'
];

const replacements = [
  { from: /console\.log\('✅/g, to: "logger.success('" },
  { from: /console\.log\('🔍/g, to: "logger.info('" },
  { from: /console\.log\('📦/g, to: "logger.info('" },
  { from: /console\.log\('🤖/g, to: "logger.info('" },
  { from: /console\.log\('🔗/g, to: "logger.info('" },
  { from: /console\.log\(`✅/g, to: "logger.success(`" },
  { from: /console\.log\(`🔍/g, to: "logger.info(`" },
  { from: /console\.log\(`📦/g, to: "logger.info(`" },
  { from: /console\.log\(`🤖/g, to: "logger.info(`" },
  { from: /console\.log\(`🔗/g, to: "logger.info(`" },
  { from: /console\.log\(`\[Viator/g, to: "logger.info(`[Viator" },
  { from: /console\.log\('Saving itinerary/g, to: "logger.info('Saving itinerary" },
  { from: /console\.log\('Received data:/g, to: "logger.debug('Received data:" },
  { from: /console\.log\('Itinerary saved/g, to: "logger.success('Itinerary saved" },
  { from: /console\.log\('Booking created/g, to: "logger.success('Booking created" },
  { from: /console\.log\('Database not available/g, to: "logger.warn('Database not available" },
  { from: /console\.log\('No tours in database/g, to: "logger.info('No tours in database" },
  { from: /console\.log\('RPC not available/g, to: "logger.warn('RPC not available" },
  { from: /console\.log\(`Tour \${identifier}/g, to: "logger.info(`Tour ${identifier}" },
  { from: /console\.log\(`🚀 Generating/g, to: "logger.info(`Generating" },
  { from: /console\.log\('Raw response:/g, to: "logger.debug('Raw response:" },
];

function addLoggerImport(content, filePath) {
  // Check if logger is already imported
  if (content.includes("require('../utils/logger')") || content.includes("require('./utils/logger')")) {
    return content;
  }

  // Determine the correct path to logger
  const depth = filePath.split('/').length - 2; // -2 for 'src' and filename
  const loggerPath = '../'.repeat(depth) + 'utils/logger';

  // Find the last require statement
  const requireRegex = /const .+ = require\([^)]+\);/g;
  const matches = content.match(requireRegex);
  
  if (matches && matches.length > 0) {
    const lastRequire = matches[matches.length - 1];
    const loggerImport = `\nconst logger = require('${loggerPath}');`;
    return content.replace(lastRequire, lastRequire + loggerImport);
  }

  // If no requires found, add at the top after comments
  const lines = content.split('\n');
  let insertIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith('*') && !lines[i].trim().startsWith('//') && !lines[i].trim().startsWith('/*') && lines[i].trim() !== '') {
      insertIndex = i;
      break;
    }
  }
  lines.splice(insertIndex, 0, `const logger = require('${loggerPath}');`);
  return lines.join('\n');
}

function updateFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Add logger import if needed
  if (content.includes('console.log')) {
    content = addLoggerImport(content, filePath);
    modified = true;
  }

  // Apply replacements
  for (const { from, to } of replacements) {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`⏭️  No changes: ${filePath}`);
  }
}

console.log('🧹 Cleaning up console.log statements...\n');

for (const file of filesToUpdate) {
  updateFile(file);
}

console.log('\n✅ Cleanup complete!');
console.log('\n📝 Note: Review the changes and test the application.');
