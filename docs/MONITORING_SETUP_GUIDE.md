# 📊 Monitoring & Error Tracking Setup Guide

## Overview

This guide helps you set up production monitoring and error tracking for your Orbito platform.

---

## 🎯 Recommended: Sentry (Free Tier Available)

Sentry provides excellent error tracking, performance monitoring, and is easy to integrate.

### Why Sentry?

- ✅ Free tier: 5,000 errors/month
- ✅ Real-time error alerts
- ✅ Stack traces and context
- ✅ Performance monitoring
- ✅ Release tracking
- ✅ Easy integration

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Create Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up (free tier)
3. Create a new project
4. Select "Node.js" for backend
5. Select "React" for frontend
6. Copy your DSN (looks like: `https://xxx@xxx.ingest.sentry.io/xxx`)

### Step 2: Install Sentry

**Backend:**
```bash
cd backend
npm install @sentry/node
```

**Frontend:**
```bash
cd frontend
npm install @sentry/react
```

### Step 3: Configure Backend

Create `backend/src/config/sentry.js`:

```javascript
const Sentry = require('@sentry/node');
const logger = require('../utils/logger');

let sentryInitialized = false;

function initSentry(app) {
  if (!process.env.SENTRY_DSN) {
    logger.warn('SENTRY_DSN not configured - error tracking disabled');
    return;
  }

  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Only send errors in production
      enabled: process.env.NODE_ENV === 'production',
      
      // Release tracking
      release: process.env.npm_package_version,
      
      // Integrations
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
      ],
    });

    sentryInitialized = true;
    logger.success('Sentry error tracking initialized');
  } catch (error) {
    logger.error('Failed to initialize Sentry', error);
  }
}

function getSentryMiddleware() {
  if (!sentryInitialized) {
    return {
      requestHandler: (req, res, next) => next(),
      errorHandler: (err, req, res, next) => next(err)
    };
  }

  return {
    requestHandler: Sentry.Handlers.requestHandler(),
    errorHandler: Sentry.Handlers.errorHandler()
  };
}

module.exports = {
  initSentry,
  getSentryMiddleware,
  Sentry
};
```

Update `backend/src/app.js`:

```javascript
const { initSentry, getSentryMiddleware } = require('./config/sentry');

const app = express();

// Initialize Sentry FIRST
initSentry(app);
const sentry = getSentryMiddleware();

// Sentry request handler MUST be first middleware
app.use(sentry.requestHandler);

// ... your other middleware ...

// Sentry error handler MUST be before other error handlers
app.use(sentry.errorHandler);

// Your error handler
app.use((err, req, res, next) => {
  // ...
});
```

### Step 4: Configure Frontend

Update `frontend/src/main.jsx` (or `index.jsx`):

```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  
  // Performance Monitoring
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Performance
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Only in production
  enabled: import.meta.env.MODE === 'production',
});
```

Update `frontend/src/components/ErrorBoundary.jsx`:

```javascript
import * as Sentry from '@sentry/react';

componentDidCatch(error, errorInfo) {
  // Log to Sentry
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack,
      },
    },
  });
  
  // ... rest of your code
}
```

### Step 5: Add Environment Variables

**Backend `.env`:**
```env
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Frontend `.env`:**
```env
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Production (Vercel/Render):**
Add the same variables in your deployment platform's environment settings.

---

## 📊 Alternative: Simple Logging to File

If you don't want external services, you can log to files:

### Backend File Logging

Update `backend/src/utils/logger.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log streams
const errorLog = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

const combinedLog = fs.createWriteStream(
  path.join(logsDir, 'combined.log'),
  { flags: 'a' }
);

// Update logger methods to write to files
logger.error = (message, error) => {
  const logEntry = formatMessage('ERROR', message, error);
  console.error(logEntry);
  errorLog.write(logEntry + '\n');
  combinedLog.write(logEntry + '\n');
};

// ... similar for other methods
```

---

## 🔔 Alert Setup

### Sentry Alerts

1. Go to Sentry Dashboard
2. Project Settings → Alerts
3. Create alert rules:
   - **High Error Rate**: Alert when error rate > 10/minute
   - **New Issue**: Alert on first occurrence of new error
   - **Regression**: Alert when resolved issue reoccurs

### Email Notifications

Configure in Sentry:
- Settings → Notifications
- Enable email for critical errors
- Set up Slack/Discord webhooks (optional)

---

## 📈 Monitoring Dashboards

### Sentry Dashboard

Monitor:
- Error frequency and trends
- Most common errors
- Affected users
- Performance metrics
- Release health

### Custom Health Dashboard

Create `frontend/src/pages/StatusPage.jsx`:

```jsx
import { useEffect, useState } from 'react';

function StatusPage() {
  const [health, setHealth] = useState(null);
  
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(setHealth);
  }, []);
  
  return (
    <div>
      <h1>System Status</h1>
      {health && (
        <div>
          <p>Status: {health.status}</p>
          <p>Uptime: {Math.floor(health.uptime / 60)} minutes</p>
          <h2>Services:</h2>
          {Object.entries(health.services).map(([name, service]) => (
            <div key={name}>
              <strong>{name}:</strong> {service.status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 What to Monitor

### Critical Metrics

1. **Error Rate**
   - Target: < 1% of requests
   - Alert: > 5% error rate

2. **Response Time**
   - Target: < 500ms average
   - Alert: > 2s average

3. **Uptime**
   - Target: 99.9%
   - Alert: < 99%

4. **Database Connectivity**
   - Target: 100% available
   - Alert: Connection failures

5. **API Key Validity**
   - Target: All keys valid
   - Alert: Any key expired/invalid

### Performance Metrics

- Request throughput (req/sec)
- Memory usage
- CPU usage
- Database query time
- AI generation time

---

## 🚨 Error Tracking Best Practices

### 1. Add Context to Errors

```javascript
// Backend
Sentry.captureException(error, {
  tags: {
    feature: 'itinerary-generation',
    user_id: req.user?.id
  },
  extra: {
    destination: req.body.destination,
    dates: { start: req.body.startDate, end: req.body.endDate }
  }
});

// Frontend
Sentry.captureException(error, {
  tags: {
    component: 'TourBooking',
    tourId: tour.id
  }
});
```

### 2. Set User Context

```javascript
// When user logs in
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name
});

// When user logs out
Sentry.setUser(null);
```

### 3. Add Breadcrumbs

```javascript
Sentry.addBreadcrumb({
  category: 'booking',
  message: 'User started booking process',
  level: 'info'
});
```

### 4. Filter Sensitive Data

```javascript
// Sentry config
beforeSend(event) {
  // Remove sensitive data
  if (event.request) {
    delete event.request.cookies;
    delete event.request.headers['Authorization'];
  }
  return event;
}
```

---

## 💰 Cost Comparison

| Service | Free Tier | Paid (Starter) | Features |
|---------|-----------|----------------|----------|
| **Sentry** | 5K errors/month | $26/month | Errors, Performance, Replay |
| **LogRocket** | 1K sessions/month | $99/month | Session replay, errors |
| **Datadog** | 14-day trial | $15/host/month | Full observability |
| **New Relic** | 100GB/month | $99/month | APM, logs, metrics |
| **File Logging** | Free | Free | Basic, no alerts |

**Recommendation:** Start with Sentry free tier

---

## ✅ Verification

### Test Error Tracking

**Backend:**
```javascript
// Add test endpoint
router.get('/test-error', (req, res) => {
  throw new Error('Test error for Sentry');
});
```

**Frontend:**
```javascript
// Add test button
<button onClick={() => {
  throw new Error('Test error for Sentry');
}}>
  Test Error
</button>
```

Visit the endpoints and check Sentry dashboard for errors.

---

## 📋 Setup Checklist

- [ ] Create Sentry account
- [ ] Install Sentry packages
- [ ] Configure backend Sentry
- [ ] Configure frontend Sentry
- [ ] Add environment variables
- [ ] Test error tracking
- [ ] Set up alerts
- [ ] Configure notifications
- [ ] Add user context
- [ ] Filter sensitive data
- [ ] Monitor dashboard

---

## 🎯 Summary

**Recommended Setup:**
1. Sentry for error tracking (15 min)
2. Enhanced health check (already done ✅)
3. Alert rules in Sentry (5 min)
4. Email notifications (5 min)

**Total Time:** ~25 minutes

**Cost:** Free (Sentry free tier)

**Benefits:**
- Real-time error alerts
- Stack traces and context
- Performance monitoring
- User impact tracking
- Release health

---

**Created:** February 26, 2026  
**Status:** Ready to implement  
**Priority:** HIGH (recommended before production)
