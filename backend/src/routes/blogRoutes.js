const express = require('express');
const { getBlogPosts, fetchAndStoreBlogPosts, getBlogCategories } = require('../controllers/blogController');

const router = express.Router();

router.get('/blog', getBlogPosts);
router.get('/blog/categories', getBlogCategories);
router.post('/jobs/fetch-blog', fetchAndStoreBlogPosts);

module.exports = router;
