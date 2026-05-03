const { supabase } = require('../config/supabase');
const { sendReviewRequest } = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * POST /api/jobs/review-requests
 * Finds bookings where the tour date was yesterday, booking is confirmed,
 * and no review has been submitted yet — then sends a review request email.
 *
 * Protected by CRON_SECRET env var. Trigger daily at 9am UTC via:
 *   - Vercel Cron: add to vercel.json
 *   - GitHub Actions: workflow with schedule: cron
 *   - Any external cron service
 */
async function sendReviewRequests(req, res) {
  // Verify cron secret to prevent unauthorised calls
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorised' });
  }

  try {
    // Find confirmed bookings where tour_date = yesterday and no review exists
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const dateStr = yesterday.toISOString().slice(0, 10); // YYYY-MM-DD

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id, tour_id, tour_title, booking_reference,
        customer_name, customer_email, customer_contact,
        tour_date, booking_status,
        reviews!left(id)
      `)
      .eq('tour_date', dateStr)
      .eq('booking_status', 'confirmed')
      .is('reviews.id', null); // no review yet

    if (error) throw error;

    if (!bookings || bookings.length === 0) {
      logger.info(`Review request job: no qualifying bookings for ${dateStr}`);
      return res.json({ sent: 0, date: dateStr });
    }

    let sent = 0;
    let failed = 0;

    for (const booking of bookings) {
      // Fetch minimal tour data (title already on booking row)
      const tourData = { title: booking.tour_title };

      const result = await sendReviewRequest(booking, tourData);
      if (result.success) {
        sent++;
        logger.info(`Review request sent to ${booking.customer_email} for booking ${booking.id}`);
      } else {
        failed++;
        logger.error(`Failed review request for booking ${booking.id}:`, result.error);
      }
    }

    logger.info(`Review request job complete: ${sent} sent, ${failed} failed`);
    return res.json({ sent, failed, date: dateStr, total: bookings.length });
  } catch (err) {
    logger.error('Review request job error:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { sendReviewRequests };
