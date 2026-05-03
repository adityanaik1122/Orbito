const express = require('express');
const { createReview, getTourReviews, getMyReviews } = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/tours/:tourId/reviews', getTourReviews);
router.post('/reviews', requireAuth, createReview);
router.get('/my-reviews', requireAuth, getMyReviews);

module.exports = router;
