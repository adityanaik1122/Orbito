const express = require('express');
const { suggestActivities } = require('../controllers/aiController');

const router = express.Router();

router.post('/ai-suggest', suggestActivities);

module.exports = router;
