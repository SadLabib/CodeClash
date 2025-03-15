// routes/blogRoutes.js
const express = require('express');
const { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog 
} = require('../controllers/blogController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// Public routes (no authentication required)
router.get('/list', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes (authentication required)
router.post('/create', authenticateToken, createBlog);
router.put('/:id', authenticateToken, updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);

module.exports = router;