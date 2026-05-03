const express = require('express');
const { sendReviewRequests } = require('../controllers/jobController');

const router = express.Router();

router.post('/jobs/review-requests', sendReviewRequests);

module.exports = router;
