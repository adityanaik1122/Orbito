const { Resend } = require('resend');

let resendClient = null;

try {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  WARNING: RESEND_API_KEY missing - email functionality disabled');
  } else {
    resendClient = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend email service initialized');
  }
} catch (error) {
  console.error('❌ Error initializing Resend:', error.message);
}

module.exports = {
  resendClient
};
