// routes/commentRoutes.js
const express = require('express');
const { 
  createComment, 
  getCommentsByBlogId, 
  updateComment, 
  deleteComment 
} = require('../controllers/commentController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// Public routes (no authentication required)
router.get('/blog/:blogId', getCommentsByBlogId);

// Protected routes (authentication required)
router.post('/create', authenticateToken, createComment);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

module.exports = router;