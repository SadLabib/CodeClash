// controllers/blogController.js
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment');
const { Op } = require('sequelize');

/**
 * Create a new blog post
 */
const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const blog = await Blog.create({
      title,
      content,
      userId
    });

    res.status(201).json({ 
      message: 'Blog post created successfully', 
      blog 
    });
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({ 
      message: 'Error creating blog post',
      error: error.message
    });
  }
};

/**
 * Get all blog posts with author information
 */
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(blogs);
  } catch (error) {
    console.error('Fetch blogs error:', error);
    res.status(500).json({ 
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
};

/**
 * Get a single blog post with comments
 */
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: Comment,
          where: { parentId: null }, // Only get top-level comments
          required: false, // LEFT JOIN to include blog even if no comments
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
          ]
        }
      ]
    });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error('Fetch blog error:', error);
    res.status(500).json({ 
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

/**
 * Update a blog post
 */
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Ensure user can only update their own blogs
    if (blog.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own blog posts' });
    }
    
    // Update blog
    await blog.update({
      title: title || blog.title,
      content: content || blog.content
    });
    
    res.json({ 
      message: 'Blog post updated successfully', 
      blog 
    });
  } catch (error) {
    console.error('Blog update error:', error);
    res.status(500).json({ 
      message: 'Error updating blog post',
      error: error.message
    });
  }
};

/**
 * Delete a blog post
 */
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Ensure user can only delete their own blogs
    if (blog.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own blog posts' });
    }
    
    // Delete blog (will cascade to comments through DB constraints)
    await blog.destroy();
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Blog deletion error:', error);
    res.status(500).json({ 
      message: 'Error deleting blog post',
      error: error.message
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
};