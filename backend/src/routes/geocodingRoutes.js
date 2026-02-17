const express = require('express');
const router = express.Router();
const { geocodeLocation } = require('../controllers/geocodingController');

router.get('/geocode', geocodeLocation);

module.exports = router;
