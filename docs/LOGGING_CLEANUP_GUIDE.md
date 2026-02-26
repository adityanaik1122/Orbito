# 🧹 Logging Cleanup Guide

## ✅ Logger Utility Created

**File:** `backend/src/utils/logger.js`

A simple, production-ready logger that:
- ✅ Only logs in development by default
- ✅ Supports different log levels (ERROR, WARN, INFO, DEBUG)
- ✅ Formats messages with timestamps
- ✅ Can be configured via environment variables
- ✅ Minimal code changes required

---

## 📋 Already Updated Files

These files have been updated to use the new logger:

- ✅ `backend/src/config/supabase.js`
- ✅ `backend/src/config/groq.js`
- ✅ `backend/src/services/langchainAgent.js`

---

## 🔄 How to Use the Logger

### Import the logger:
```javascript
const logger = require('../utils/logger');
```

### Replace console.log statements:

**Before:**
```javascript
console.log('User logged in');
console.log('✅ Service initialized');
console.error('Database error:', error);
console.warn('⚠️  Missing API key');
```

**After:**
```javascript
logger.info('User logged in');
logger.success('Service initialized');
logger.error('Database error', error);
logger.warn('Missing API key');
```

---

## 📊 Log Levels

| Method | When to Use | Production |
|--------|-------------|------------|
| `logger.error()` | Errors that need attention | ✅ Always logged |
| `logger.warn()` | Warnings, non-critical issues | ✅ Logged |
| `logger.info()` | General application flow | ✅ Logged |
| `logger.debug()` | Detailed debugging info | ❌ Only in dev |
| `logger.success()` | Important successful operations | ✅ Logged |

---

## 🎯 Files to Update (30+ console.log statements)

### High Priority (User-facing features)

1. **`backend/src/controllers/itineraryController.js`**
   ```javascript
   // Line 17, 172-173, 190
   const logger = require('../utils/logger');
   
   // Replace:
   console.log(`🚀 Generating itinerary with tours for ${destination}`);
   // With:
   logger.info(`Generating itinerary with tours for ${destination}`);
   ```

2. **`backend/src/controllers/tourController.js`**
   ```javascript
   // Lines 29, 35, 121, 127, 194
   const logger = require('../utils/logger');
   
   // Replace:
   console.log('Database not available, using mock data:', dbError.message);
   // With:
   logger.warn('Database not available, using mock data', { error: dbError.message });
   ```

3. **`backend/src/services/aiTourMatchingService.js`**
   ```javascript
   // Lines 27, 29, 32, 43, 162, 164, 185
   const logger = require('../utils/logger');
   
   // Replace:
   console.log(`🔍 Fetching tours for ${destination}...`);
   // With:
   logger.debug(`Fetching tours for ${destination}`);
   ```

### Medium Priority (Background services)

4. **`backend/src/services/emailService.js`**
   ```javascript
   // Lines 41, 77, 141, 211, 250
   const logger = require('../utils/logger');
   
   // Replace:
   console.log('✅ Booking confirmation email sent:', result.id);
   // With:
   logger.success('Booking confirmation email sent', { emailId: result.id });
   ```

5. **`backend/src/services/viatorService.js`**
   ```javascript
   // Lines 31, 56
   const logger = require('../utils/logger');
   
   // Replace:
   console.log(`[Viator] Searching tours for destination:`, params.destinationId);
   // With:
   logger.debug(`Viator: Searching tours for destination`, { destinationId: params.destinationId });
   ```

6. **`backend/src/controllers/aiController.js`**
   ```javascript
   // Lines 15, 17
   const logger = require('../utils/logger');
   
   // Replace:
   console.log(`🤖 Suggest: Trying ${modelName}`);
   // With:
   logger.debug(`AI Suggest: Trying ${modelName}`);
   ```

### Low Priority (Config/Init)

7. **`backend/src/config/resend.js`**
   ```javascript
   // Line 15
   const logger = require('../utils/logger');
   
   // Replace:
   console.log('✅ Resend email service initialized');
   // With:
   logger.success('Resend email service initialized');
   ```

8. **`backend/src/config/gemini.js`**
   ```javascript
   // Line 10
   const logger = require('../utils/logger');
   
   // Replace:
   console.log('✅ Gemini AI initialized');
   // With:
   logger.success('Gemini AI initialized');
   ```

9. **`backend/src/models/itineraryModel.js`**
   ```javascript
   // Line 25
   const logger = require('../utils/logger');
   
   // Replace:
   console.log('RPC not available, using regular insert without activities');
   // With:
   logger.warn('RPC not available, using regular insert without activities');
   ```

---

## 🚀 Quick Replacement Script

You can use this regex find/replace in your IDE:

### Find:
```regex
console\.log\(['"`](.*?)['"`]\)
```

### Replace with:
```javascript
logger.info('$1')
```

**Note:** This is a basic pattern. You'll need to manually adjust:
- `console.error` → `logger.error`
- `console.warn` → `logger.warn`
- Success messages (✅) → `logger.success`
- Debug messages (🔍, 🤖) → `logger.debug`

---

## ⚙️ Configuration

### Environment Variables

Control logging level in production:

```env
# .env
LOG_LEVEL=INFO  # Options: ERROR, WARN, INFO, DEBUG
NODE_ENV=production
```

**Recommended settings:**

| Environment | LOG_LEVEL | What's Logged |
|-------------|-----------|---------------|
| Development | DEBUG | Everything |
| Staging | INFO | Info, Warn, Error |
| Production | INFO | Info, Warn, Error |

---

## 📈 Benefits

### Before (console.log):
```javascript
console.log('User logged in');
console.log('✅ Service started');
console.error('Error:', error);
```

**Issues:**
- ❌ Logs in production (performance impact)
- ❌ No timestamps
- ❌ No log levels
- ❌ Hard to filter
- ❌ Clutters production logs

### After (logger):
```javascript
logger.info('User logged in');
logger.success('Service started');
logger.error('Error occurred', error);
```

**Benefits:**
- ✅ Controlled logging in production
- ✅ Timestamps included
- ✅ Proper log levels
- ✅ Easy to filter
- ✅ Clean production logs
- ✅ Can integrate with monitoring tools later

---

## 🎯 Migration Strategy

### Phase 1: Critical Files (30 min)
- ✅ Config files (supabase, groq, gemini, resend)
- ✅ Main services (langchainAgent)
- Controllers (itinerary, tour, ai)

### Phase 2: Services (1 hour)
- Email service
- AI matching service
- Viator service

### Phase 3: Models & Utilities (30 min)
- Itinerary model
- Other models

### Total Time: ~2 hours

---

## 🔮 Future Enhancements

Once basic logging is in place, you can:

1. **Add File Logging**
   ```javascript
   // Save logs to files
   const fs = require('fs');
   const logStream = fs.createWriteStream('app.log', { flags: 'a' });
   ```

2. **Integrate with Monitoring**
   - Sentry for error tracking
   - Datadog for log aggregation
   - CloudWatch for AWS deployments

3. **Add Request ID Tracking**
   ```javascript
   logger.info('User action', { requestId: req.id, userId: user.id });
   ```

4. **Structured Logging**
   ```javascript
   logger.info('Payment processed', {
     userId: user.id,
     amount: 99.99,
     currency: 'USD',
     timestamp: Date.now()
   });
   ```

---

## ✅ Verification

After updating files, verify logging works:

```bash
# Development (should see all logs)
NODE_ENV=development npm start

# Production (should see only INFO and above)
NODE_ENV=production npm start

# Debug mode (see everything)
LOG_LEVEL=DEBUG npm start

# Quiet mode (errors only)
LOG_LEVEL=ERROR npm start
```

---

## 📝 Summary

**Status:** Logger utility created and partially implemented

**Completed:**
- ✅ Logger utility created
- ✅ 3 config files updated
- ✅ Documentation created

**Remaining:**
- ⏳ ~27 console.log statements in 9 files
- ⏳ Estimated time: 2 hours

**Priority:** LOW - Can be done post-deployment

**Impact:** Cleaner logs, better debugging, production-ready

---

## 🚀 Deployment Note

**You can deploy without completing this cleanup!**

The console.log statements won't break anything, they just:
- Add minor performance overhead
- Clutter production logs
- Make debugging harder

This is a code quality improvement, not a blocker.

---

**Created:** February 26, 2026  
**Status:** In Progress (3/30 files updated)  
**Priority:** LOW (Post-deployment cleanup)
