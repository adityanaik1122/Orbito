const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');

// Stripe webhook — must use raw body (registered before express.json in app.js)
router.post('/webhook', handleWebhook);

// Create payment intent for a pending booking
router.post('/create-intent', requireAuth, createPaymentIntent);

module.exports = router;
