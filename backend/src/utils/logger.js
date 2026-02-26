/**
 * Simple Logger Utility
 * 
 * Usage:
 *   const logger = require('./utils/logger');
 *   logger.info('User logged in', { userId: 123 });
 *   logger.error('Database error', error);
 *   logger.debug('Debug info', data);
 */

const isDevelopment = process.env.NODE_ENV !== 'production';
const isTest = process.env.NODE_ENV === 'test';

// Log levels
const LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level (can be configured via env var)
const currentLevel = LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? 
  (isDevelopment ? LEVELS.DEBUG : LEVELS.INFO);

/**
 * Format log message with timestamp and level
 */
function formatMessage(level, message, data) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (data) {
    return `${prefix} ${message} ${JSON.stringify(data)}`;
  }
  return `${prefix} ${message}`;
}

/**
 * Logger object with different log levels
 */
const logger = {
  /**
   * Log error messages (always logged)
   */
  error: (message, error) => {
    if (currentLevel >= LEVELS.ERROR && !isTest) {
      if (error instanceof Error) {
        console.error(formatMessage('ERROR', message), error);
      } else {
        console.error(formatMessage('ERROR', message, error));
      }
    }
  },

  /**
   * Log warning messages
   */
  warn: (message, data) => {
    if (currentLevel >= LEVELS.WARN && !isTest) {
      console.warn(formatMessage('WARN', message, data));
    }
  },

  /**
   * Log info messages (general application flow)
   */
  info: (message, data) => {
    if (currentLevel >= LEVELS.INFO && !isTest) {
      console.log(formatMessage('INFO', message, data));
    }
  },

  /**
   * Log debug messages (detailed debugging info)
   * Only logged in development by default
   */
  debug: (message, data) => {
    if (currentLevel >= LEVELS.DEBUG && !isTest) {
      console.log(formatMessage('DEBUG', message, data));
    }
  },

  /**
   * Log success messages (for important operations)
   */
  success: (message, data) => {
    if (currentLevel >= LEVELS.INFO && !isTest) {
      console.log(formatMessage('✅', message, data));
    }
  }
};

module.exports = logger;
