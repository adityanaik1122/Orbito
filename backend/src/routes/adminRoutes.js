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
const { fetchAndStoreBlogPosts, getBlogPosts } = require('../controllers/blogController');

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

// Blog management
router.post('/fetch-blog', fetchAndStoreBlogPosts);
router.get('/blog-stats', async (req, res) => {
  // Delegate to getBlogPosts with limit=1 just to get the total count
  req.query = { page: 1, limit: 1 };
  return getBlogPosts(req, res);
});

module.exports = router;
