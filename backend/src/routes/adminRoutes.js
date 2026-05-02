const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const {
  getApplications,
  approveApplication,
  rejectApplication,
  getPendingTours,
  approveTour,
  rejectTour,
} = require('../controllers/adminController');

router.use(requireAuth);
router.use(requireAdmin);

// Operator applications
router.get('/applications', getApplications);
router.post('/applications/:id/approve', approveApplication);
router.post('/applications/:id/reject', rejectApplication);

// Tour listing approvals
router.get('/pending-tours', getPendingTours);
router.post('/tours/:id/approve', approveTour);
router.post('/tours/:id/reject', rejectTour);

module.exports = router;
