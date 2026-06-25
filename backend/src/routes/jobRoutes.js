const express = require('express');
const { sendReviewRequests } = require('../controllers/jobController');
const { fetchAndStoreVlogs, getVlogs } = require('../controllers/vlogController');

const router = express.Router();

router.post('/jobs/review-requests', sendReviewRequests);
router.post('/jobs/fetch-vlogs', fetchAndStoreVlogs);
router.get('/vlogs', getVlogs);

module.exports = router;
