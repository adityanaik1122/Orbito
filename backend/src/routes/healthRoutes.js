const express = require('express');
const { getHealth, getReadiness, getLiveness } = require('../controllers/healthController');

const router = express.Router();

// Detailed health check with service status
router.get('/health', getHealth);

// Simple readiness check (for load balancers)
router.get('/ready', getReadiness);

// Simple liveness check (for Kubernetes/Docker)
router.get('/live', getLiveness);

module.exports = router;
