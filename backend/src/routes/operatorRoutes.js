const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const { requireAuth, requireOperator } = require('../middleware/authMiddleware');

// Public — any authenticated user can apply or check status
router.post('/apply', requireAuth, operatorController.applyAsOperator);
router.get('/application-status', requireAuth, operatorController.getApplicationStatus);

// Operator-only routes
router.use(requireAuth);
router.use(requireOperator);

router.get('/tours', operatorController.getOperatorTours);
router.post('/tours', operatorController.createTour);
router.put('/tours/:tourId', operatorController.updateTour);
router.delete('/tours/:tourId', operatorController.deleteTour);

router.get('/bookings', operatorController.getOperatorBookings);

router.get('/earnings', operatorController.getOperatorEarnings);
router.get('/stats', operatorController.getOperatorStats);

module.exports = router;
