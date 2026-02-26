/**
 * Security Scanner
 * Scans codebase for common security vulnerabilities
 */

const fs = require('fs');
const path = require('path');

// Security patterns to check
const securityPatterns = {
  // Hardcoded secrets
  secrets: [
    { pattern: /password\s*=\s*['"][^'"]{8,}['"]/gi, severity: 'HIGH', name: 'Hardcoded Password' },
    { pattern: /api[_-]?key\s*=\s*['"][^'"]{20,}['"]/gi, severity: 'HIGH', name: 'Hardcoded API Key' },
    { pattern: /secret\s*=\s*['"][^'"]{20,}['"]/gi, severity: 'HIGH', name: 'Hardcoded Secret' },
    { pattern: /token\s*=\s*['"][^'"]{20,}['"]/gi, severity: 'MEDIUM', name: 'Hardcoded Token' },
    { pattern: /Bearer\s+[A-Za-z0-9\-._~+\/]+=*/g, severity: 'HIGH', name: 'Hardcoded Bearer Token' },
  ],

  // SQL Injection risks
  sql: [
    { pattern: /\$\{.*\}.*SELECT/gi, severity: 'HIGH', name: 'SQL Injection Risk (Template Literal)' },
    { pattern: /['"].*\+.*SELECT/gi, severity: 'HIGH', name: 'SQL Injection Risk (String Concat)' },
    { pattern: /query\([^)]*\+[^)]*\)/gi, severity: 'MEDIUM', name: 'Potential SQL Injection' },
  ],

  // XSS risks
  xss: [
    { pattern: /dangerouslySetInnerHTML/g, severity: 'MEDIUM', name: 'XSS Risk (dangerouslySetInnerHTML)' },
    { pattern: /innerHTML\s*=/g, severity: 'MEDIUM', name: 'XSS Risk (innerHTML)' },
    { pattern: /document\.write/g, severity: 'MEDIUM', name: 'XSS Risk (document.write)' },
  ],

  // Insecure practices
  insecure: [
    { pattern: /eval\(/g, severity: 'HIGH', name: 'Dangerous eval() usage' },
    { pattern: /new Function\(/g, severity: 'HIGH', name: 'Dangerous Function() constructor' },
    { pattern: /process\.env\.[A-Z_]+/g, severity: 'INFO', name: 'Environment Variable Usage' },
    { pattern: /console\.log\(/g, severity: 'LOW', name: 'Console.log (remove in production)' },
  ],

  // Authentication issues
  auth: [
    { pattern: /auth.*false/gi, severity: 'HIGH', name: 'Authentication Disabled' },
    { pattern: /verify.*false/gi, severity: 'MEDIUM', name: 'Verification Disabled' },
    { pattern: /ssl.*false/gi, severity: 'HIGH', name: 'SSL Disabled' },
  ],
};

// Files to scan
const filesToScan = [];
const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.vercel'];
const includeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.env.example'];

// Results
const findings = {
  HIGH: [],
  MEDIUM: [],
  LOW: [],
  INFO: []
};

let filesScanned = 0;

/**
 * Recursively scan directory
 */
function scanDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!excludeDirs.includes(item)) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (includeExtensions.includes(ext) || item === '.env.example') {
          filesToScan.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
}

/**
 * Scan file for security issues
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    filesScanned++;

    // Check each pattern category
    for (const [category, patterns] of Object.entries(securityPatterns)) {
      for (const { pattern, severity, name } of patterns) {
        const matches = content.match(pattern);
        
        if (matches) {
          // Filter out false positives
          const filtered = matches.filter(match => {
            // Ignore comments
            const lines = content.split('\n');
            for (const line of lines) {
              if (line.includes(match) && (line.trim().startsWith('//') || line.trim().startsWith('*'))) {
                return false;
              }
            }
            
            // Ignore example/placeholder values
            if (match.includes('your_') || match.includes('YOUR_') || 
                match.includes('example') || match.includes('placeholder')) {
              return false;
            }

            return true;
          });

          if (filtered.length > 0) {
            findings[severity].push({
              file: relativePath,
              issue: name,
              matches: filtered.length,
              category,
              sample: filtered[0].substring(0, 100)
            });
          }
        }
      }
    }
  } catch (error) {
    // Skip files we can't read
  }
}

/**
 * Check for missing security headers
 */
function checkSecurityHeaders() {
  const findings = [];

  // Check if helmet is used (Express security)
  const appJsPath = path.join(process.cwd(), 'backend/src/app.js');
  if (fs.existsSync(appJsPath)) {
    const content = fs.readFileSync(appJsPath, 'utf8');
    if (!content.includes('helmet')) {
      findings.push({
        issue: 'Missing Helmet.js (Security Headers)',
        severity: 'MEDIUM',
        recommendation: 'Install and use helmet: npm install helmet'
      });
    }
  }

  return findings;
}

/**
 * Check for rate limiting
 */
function checkRateLimiting() {
  const findings = [];

  const appJsPath = path.join(process.cwd(), 'backend/src/app.js');
  if (fs.existsSync(appJsPath)) {
    const content = fs.readFileSync(appJsPath, 'utf8');
    if (!content.includes('rate-limit') && !content.includes('rateLimit')) {
      findings.push({
        issue: 'No Rate Limiting Detected',
        severity: 'HIGH',
        recommendation: 'Implement rate limiting to prevent abuse'
      });
    } else {
      findings.push({
        issue: 'Rate Limiting Implemented',
        severity: 'INFO',
        recommendation: 'Good! Rate limiting is in place.'
      });
    }
  }

  return findings;
}

/**
 * Check environment files
 */
function checkEnvironmentFiles() {
  const findings = [];

  // Check .env files are in .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf8');
    if (!content.includes('.env')) {
      findings.push({
        issue: '.env files not in .gitignore',
        severity: 'HIGH',
        recommendation: 'Add .env to .gitignore to prevent committing secrets'
      });
    }
  }

  // Check for .env files in repo
  const envFiles = ['.env', 'backend/.env', 'frontend/.env'];
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      findings.push({
        issue: `.env file exists: ${envFile}`,
        severity: 'INFO',
        recommendation: 'Ensure this file is in .gitignore and not committed'
      });
    }
  }

  return findings;
}

/**
 * Check dependencies for known vulnerabilities
 */
function checkDependencies() {
  const findings = [];

  const packageJsonPaths = [
    'package.json',
    'backend/package.json',
    'frontend/package.json'
  ];

  for (const pkgPath of packageJsonPaths) {
    const fullPath = path.join(process.cwd(), pkgPath);
    if (fs.existsSync(fullPath)) {
      const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      
      // Check for outdated critical packages
      const criticalPackages = {
        'express': '4.18.0',
        'react': '18.0.0',
        '@supabase/supabase-js': '2.0.0'
      };

      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      for (const [pkgName, minVersion] of Object.entries(criticalPackages)) {
        if (allDeps[pkgName]) {
          findings.push({
            issue: `${pkgName} found in ${pkgPath}`,
            severity: 'INFO',
            recommendation: `Current: ${allDeps[pkgName]}, Minimum recommended: ${minVersion}`
          });
        }
      }
    }
  }

  return findings;
}

/**
 * Main scan function
 */
function runSecurityScan() {
  console.log('🔒 Security Scanner');
  console.log('='.repeat(60));
  console.log('Scanning codebase for security vulnerabilities...\n');

  // Scan all files
  console.log('📁 Scanning files...');
  scanDirectory(process.cwd());
  
  console.log(`Found ${filesToScan.length} files to scan\n`);

  for (const file of filesToScan) {
    scanFile(file);
  }

  console.log(`✅ Scanned ${filesScanned} files\n`);

  // Additional checks
  console.log('🔍 Running additional security checks...\n');
  
  const headerFindings = checkSecurityHeaders();
  const rateLimitFindings = checkRateLimiting();
  const envFindings = checkEnvironmentFiles();
  const depFindings = checkDependencies();

  // Print results
  console.log('='.repeat(60));
  console.log('📊 SECURITY SCAN RESULTS');
  console.log('='.repeat(60));

  // High severity
  if (findings.HIGH.length > 0) {
    console.log('\n🔴 HIGH SEVERITY ISSUES:');
    console.log('-'.repeat(60));
    findings.HIGH.forEach((finding, i) => {
      console.log(`${i + 1}. ${finding.issue}`);
      console.log(`   File: ${finding.file}`);
      console.log(`   Matches: ${finding.matches}`);
      console.log(`   Sample: ${finding.sample}`);
      console.log('');
    });
  }

  // Medium severity
  if (findings.MEDIUM.length > 0) {
    console.log('\n🟡 MEDIUM SEVERITY ISSUES:');
    console.log('-'.repeat(60));
    findings.MEDIUM.forEach((finding, i) => {
      console.log(`${i + 1}. ${finding.issue}`);
      console.log(`   File: ${finding.file}`);
      console.log(`   Matches: ${finding.matches}`);
      console.log('');
    });
  }

  // Low severity
  if (findings.LOW.length > 0) {
    console.log('\n🔵 LOW SEVERITY ISSUES:');
    console.log('-'.repeat(60));
    console.log(`Found ${findings.LOW.length} console.log statements`);
    console.log('Recommendation: Remove or replace with proper logging in production');
    console.log('');
  }

  // Additional findings
  console.log('\n📋 ADDITIONAL CHECKS:');
  console.log('-'.repeat(60));
  
  [...headerFindings, ...rateLimitFindings, ...envFindings].forEach(finding => {
    const icon = finding.severity === 'HIGH' ? '🔴' : 
                 finding.severity === 'MEDIUM' ? '🟡' : 
                 finding.severity === 'INFO' ? '✅' : '🔵';
    console.log(`${icon} ${finding.issue}`);
    console.log(`   ${finding.recommendation}`);
    console.log('');
  });

  // Summary
  console.log('='.repeat(60));
  console.log('📈 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files Scanned: ${filesScanned}`);
  console.log(`🔴 High Severity: ${findings.HIGH.length}`);
  console.log(`🟡 Medium Severity: ${findings.MEDIUM.length}`);
  console.log(`🔵 Low Severity: ${findings.LOW.length}`);
  console.log(`ℹ️  Info: ${findings.INFO.length}`);

  const totalIssues = findings.HIGH.length + findings.MEDIUM.length + findings.LOW.length;
  
  console.log('\n' + '='.repeat(60));
  if (findings.HIGH.length === 0 && findings.MEDIUM.length === 0) {
    console.log('✅ No critical security issues found!');
    console.log('🎉 Your codebase passes the security scan.');
  } else if (findings.HIGH.length === 0) {
    console.log('⚠️  Some medium/low severity issues found.');
    console.log('💡 Review and fix the issues above before deployment.');
  } else {
    console.log('❌ Critical security issues found!');
    console.log('🚨 Fix HIGH severity issues before deployment.');
  }
  console.log('='.repeat(60));

  // Dependency check summary
  if (depFindings.length > 0) {
    console.log('\n📦 DEPENDENCIES:');
    console.log('-'.repeat(60));
    depFindings.forEach(finding => {
      console.log(`✅ ${finding.issue}`);
      console.log(`   ${finding.recommendation}`);
    });
  }

  process.exit(findings.HIGH.length > 0 ? 1 : 0);
}

// Run scan
runSecurityScan();
