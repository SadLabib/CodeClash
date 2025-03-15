// services/statisticsService.js
const { Op } = require('sequelize');
const Problem = require('../models/problem');
const User = require('../models/user');

/**
 * Generate comprehensive statistics for a user's problems
 * @param {number} userId - The ID of the user
 * @returns {Object} Statistics object containing all metrics
 */
const generateUserStatistics = async (userId) => {
  try {
    // Get user info
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all problems for the user
    const problems = await Problem.findAll({
      where: { userId },
      attributes: ['id', 'status', 'metadata']
    });

    // Basic statistics
    const totalProblems = problems.length;
    const solvedProblems = problems.filter(p => p.status === 'done').length;
    const pendingProblems = problems.filter(p => p.status === 'pending').length;
    const startedProblems = problems.filter(p => p.status === 'started').length;
    
    // Problem ratings distribution (from metadata)
    const ratingDistribution = {};
    problems.forEach(problem => {
      if (problem.metadata && problem.metadata.rating) {
        const rating = problem.metadata.rating.toString();
        ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
      }
    });
    
    // Problem tags distribution (from metadata)
    const tagDistribution = {};
    problems.forEach(problem => {
      if (problem.metadata && problem.metadata.tags) {
        problem.metadata.tags.forEach(tag => {
          tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
        });
      }
    });
    
    // Calculate completion rate
    const completionRate = totalProblems > 0 ? (solvedProblems / totalProblems) * 100 : 0;
    
    // Format the results
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      summary: {
        totalProblems,
        solvedProblems,
        pendingProblems,
        startedProblems,
        completionRate: parseFloat(completionRate.toFixed(2))
      },
      distributions: {
        ratings: ratingDistribution,
        tags: tagDistribution
      },
      // Not implemented yet as mentioned in your requirements
      blogs: {
        count: 0
      }
    };
  } catch (error) {
    console.error('Error generating statistics:', error);
    throw error;
  }
};

module.exports = { generateUserStatistics };