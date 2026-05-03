const { supabase } = require('../config/supabase');
const logger = require('../utils/logger');

async function createReview(req, res) {
  try {
    const userId = req.user.id;
    const { booking_id, tour_id, rating, title, comment } = req.body;

    if (!tour_id || !rating || !comment?.trim()) {
      return res.status(400).json({ error: 'tour_id, rating, and comment are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be between 1 and 5' });
    }

    // Verify booking belongs to this user and is in a reviewable state
    if (booking_id) {
      const { data: booking, error: bookingErr } = await supabase
        .from('bookings')
        .select('id, user_id, status')
        .eq('id', booking_id)
        .single();

      if (bookingErr || !booking) return res.status(404).json({ error: 'Booking not found' });
      if (booking.user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });
      if (!['confirmed', 'completed', 'paid'].includes(booking.status)) {
        return res.status(400).json({ error: 'Can only review confirmed or completed bookings' });
      }
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        tour_id,
        booking_id: booking_id || null,
        rating,
        title: title?.trim() || null,
        comment: comment.trim(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'You have already reviewed this booking' });
      }
      throw error;
    }

    // Recalculate tour's aggregate rating
    await _updateTourRating(tour_id);

    logger.success(`Review created for tour ${tour_id} by user ${userId}`);
    res.json({ success: true, review: data });
  } catch (err) {
    logger.error('createReview error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
}

async function getTourReviews(req, res) {
  try {
    const { tourId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const offset = Math.max((parseInt(req.query.page) || 1) - 1, 0) * limit;

    const { data, error, count } = await supabase
      .from('reviews')
      .select('*, profiles:user_id(full_name, avatar_url)', { count: 'exact' })
      .eq('tour_id', tourId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({ success: true, reviews: data || [], total: count || 0 });
  } catch (err) {
    logger.error('getTourReviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

async function getMyReviews(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, reviews: data || [] });
  } catch (err) {
    logger.error('getMyReviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}

async function _updateTourRating(tourId) {
  try {
    const { data } = await supabase
      .from('reviews')
      .select('rating')
      .eq('tour_id', tourId);

    if (!data || data.length === 0) return;

    const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;

    await supabase
      .from('tours')
      .update({
        rating: Math.round(avg * 10) / 10,
        review_count: data.length,
      })
      .eq('id', tourId);
  } catch (err) {
    logger.error('_updateTourRating error:', err);
  }
}

module.exports = { createReview, getTourReviews, getMyReviews };
