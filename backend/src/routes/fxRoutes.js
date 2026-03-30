const express = require('express');

const router = express.Router();

let fxCache = {
  rates: null,
  fetchedAt: 0,
};

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

router.get('/fx', async (req, res) => {
  try {
    const now = Date.now();
    if (fxCache.rates && (now - fxCache.fetchedAt) < TWELVE_HOURS_MS) {
      return res.json({ rates: fxCache.rates, cached: true });
    }

    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) {
      return res.status(200).json({ rates: fxCache.rates || null, cached: true });
    }

    const data = await response.json();
    if (data?.rates) {
      fxCache = { rates: data.rates, fetchedAt: now };
    }

    return res.json({ rates: fxCache.rates || data?.rates || null, cached: false });
  } catch (error) {
    return res.status(200).json({ rates: fxCache.rates || null, cached: true });
  }
});

module.exports = router;
