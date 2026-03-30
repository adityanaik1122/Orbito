const express = require('express');

const router = express.Router();

const GEO_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const geoCache = new Map();

router.get('/geo', async (req, res) => {
  try {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded) ? forwarded[0] : (forwarded || '').split(',')[0];
    const clientIp = (ip || req.socket?.remoteAddress || '').replace('::ffff:', '');

    if (!clientIp || clientIp === '127.0.0.1' || clientIp === '::1') {
      return res.json({ country_code: null });
    }

    const cached = geoCache.get(clientIp);
    if (cached && (Date.now() - cached.fetchedAt) < GEO_CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    const response = await fetch(`https://ipapi.co/${clientIp}/json/`);
    if (!response.ok) {
      return res.json({ country_code: null });
    }
    const data = await response.json();
    const payload = {
      country_code: data?.country_code || null,
      country_name: data?.country_name || null,
      currency: data?.currency || null
    };
    geoCache.set(clientIp, { data: payload, fetchedAt: Date.now() });
    return res.json(payload);
  } catch (error) {
    return res.json({ country_code: null });
  }
});

module.exports = router;
