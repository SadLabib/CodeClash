// controllers/commentController.js
const Comment = require('../models/comment');
const Blog = require('../models/blog');
const User = require('../models/user');

/**
 * Create a new comment or reply
 */
const createComment = async (req, res) => {
  try {
    const { blogId, content, parentId } = req.body;
    const userId = req.user.id;

    if (!blogId || !content) {
      return res.status(400).json({ message: 'Blog ID and content are required' });
    }

    // Verify blog exists
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
      
      // Check if parent comment is already a reply (prevent nested replies beyond 1 level)
      if (parentComment.parentId !== null) {
        return res.status(400).json({ 
          message: 'Cannot reply to a reply. You can only reply to top-level comments.'
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      userId,
      blogId,
      parentId: parentId || null
    });

    // Fetch the created comment with user info for response
    const newComment = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });

    res.status(201).json({ 
      message: parentId ? 'Reply added successfully' : 'Comment added successfully', 
      comment: newComment 
    });
  } catch (error) {
    console.error('Comment creation error:', error);
    res.status(500).json({ 
      message: 'Error adding comment',
      error: error.message
    });
  }
};

/**
 * Get all comments for a blog
 */
const getCommentsByBlogId = async (req, res) => {
  try {
    const { blogId } = req.params;
    
    // Check if blog exists
    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Get all top-level comments with their replies
    const comments = await Comment.findAll({
      where: { 
        blogId,
        parentId: null // Only get top-level comments
      },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Comment,
          as: 'replies',
          include: [{
            model: User,
            attributes: ['id', 'username']
          }]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Comment, as: 'replies' }, 'createdAt', 'ASC']
      ]
    });
    
    res.json(comments);
  } catch (error) {
    console.error('Fetch comments error:', error);
    res.status(500).json({ 
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

/**
 * Update a comment
 */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Ensure user can only update their own comments
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own comments' });
    }
    
    // Update comment
    await comment.update({ content });
    
    res.json({ 
      message: 'Comment updated successfully', 
      comment 
    });
  } catch (error) {
    console.error('Comment update error:', error);
    res.status(500).json({ 
      message: 'Error updating comment',
      error: error.message
    });
  }
};

/**
 * Delete a comment
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Ensure user can only delete their own comments
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own comments' });
    }
    
    // Delete comment (will cascade to replies through DB constraints)
    await comment.destroy();
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Comment deletion error:', error);
    res.status(500).json({ 
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  getCommentsByBlogId,
  updateComment,
  deleteComment
};