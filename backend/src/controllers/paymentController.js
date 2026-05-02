const stripe = require('../config/stripe');
const { supabase } = require('../config/supabase');
const { sendBookingConfirmation } = require('../services/emailService');
const logger = require('../utils/logger');

async function createPaymentIntent(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment service not configured' });
  }

  try {
    const { bookingId } = req.body;
    const userId = req.user.id;

    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId is required' });
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*, tours(title, main_image, destination)')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (error || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.payment_status === 'paid') {
      return res.status(400).json({ error: 'This booking has already been paid' });
    }

    // Stripe requires the amount in the smallest currency unit (pence / cents)
    const amountInSmallestUnit = Math.round(booking.total_amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: (booking.currency || 'GBP').toLowerCase(),
      metadata: {
        bookingId: booking.id,
        bookingReference: booking.booking_reference || '',
        userId,
      },
      description: `Orbito booking ${booking.booking_reference || booking.id}`,
    });

    // Store the payment intent ID so the webhook can look it up
    await supabase
      .from('bookings')
      .update({ stripe_payment_id: paymentIntent.id })
      .eq('id', bookingId);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    logger.error('Error creating payment intent:', err);
    res.status(500).json({ error: err.message || 'Payment setup failed' });
  }
}

async function handleWebhook(req, res) {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment service not configured' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata?.bookingId;

    if (!bookingId) {
      logger.warn('Webhook: payment_intent.succeeded missing bookingId metadata');
      return res.json({ received: true });
    }

    try {
      const confirmationCode = `ORB-${Date.now()}`;

      const { data: booking, error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          booking_status: 'confirmed',
          payment_date: new Date().toISOString(),
          confirmation_code: confirmationCode,
        })
        .eq('id', bookingId)
        .select('*, tours(title, main_image, destination)')
        .single();

      if (error) {
        logger.error('Webhook: failed to update booking:', error);
      } else if (booking) {
        await sendBookingConfirmation(
          booking,
          booking.tours || { title: 'Your tour' },
          { name: booking.customer_name, email: booking.customer_email }
        );
        logger.success(`Booking ${booking.booking_reference} confirmed and email sent`);
      }
    } catch (err) {
      logger.error('Webhook: error processing payment_intent.succeeded:', err);
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata?.bookingId;

    if (bookingId) {
      await supabase
        .from('bookings')
        .update({ payment_status: 'failed' })
        .eq('id', bookingId);
      logger.warn(`Payment failed for booking ${bookingId}`);
    }
  }

  res.json({ received: true });
}

module.exports = { createPaymentIntent, handleWebhook };
