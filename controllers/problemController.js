const Problem = require('../models/problem');
const { Op } = require('sequelize');
const { fetchProblemMetadata } = require('../services/problemService');

// Create a Problem
const createProblem = async (req, res) => {
  try {
    const { link, deadline, status } = req.body;
    const userId = req.user.id;
    // Check if problem with the same link and id already exists
    const existingProblem = await Problem.findOne({
      where: {
        [Op.and]: [
          { link: link },
          { userId: userId }
        ]
      }
    });

    
    if (existingProblem) {
      return res.status(400).json({ message: 'Problem with this link already exists for this user' });
    }
      
    // Validation: Deadline must exist if status is 'pending'
    if (status === 'started' && !deadline) {
      return res.status(400).json({ message: 'Deadline is required for pending problems.' });
    }

      // Fetch problem metadata using service
      console.log("message : Started fetching metadata");
    const metadata = await fetchProblemMetadata(link);
    console.log("message : Finished fetching metadata");
    
    const problem = await Problem.create({
      link,
      startTime: new Date(),
      deadline: deadline || null,
      status,
      metadata,
      userId: req.user.id,
    });

    res.status(201).json({ message: 'Problem created successfully', problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProblemList = async (req, res) => {
  try {
      const userId = req.user.id;
      const problems = await Problem.findAll({
          where: { userId }
      });
      res.json(problems);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};
  

const getProblemDetails = async (req, res) => {
  try {
      const { id } = req.params;
      const userId = req.user.id;
    
      const problem = await Problem.findOne({
        where: {
          [Op.and]: [
            { id:id },
            { userId: userId }
          ]
        }
      });
      
      if (!problem) return res.status(404).json({ message: 'Problem not found' });
    
      res.json(problem);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};
  
// Update Problem
// need to fix it
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { link, deadline, status } = req.body;
    const userId = req.user.id;

    const problem = await Problem.findOne({
      where: {
        [Op.and]: [
          { id:id },
          { userId: userId }
        ]
      }
    });
    
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    if (status === 'started' && !deadline) {
      return res.status(400).json({ message: 'Deadline is required for started problems.' });
    }

    // Only fetch new metadata if link has changed
    let metadata = problem.metadata;
    if (link !== problem.link) {
      metadata = await fetchProblemMetadata(link);
    }

    await problem.update({
      link,
      deadline,
      status,
      metadata,
    });
    
    res.json({ message: 'Problem updated successfully', problem });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};

const deleteProblem = async (req, res) => {
  try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const problem = await Problem.findOne({
        where: {
          [Op.and]: [
            { id:id },
            { userId: userId }
          ]
        }
      });
      
      if (!problem) return res.status(404).json({ message: 'Problem not found' });
    
      await problem.destroy();
      res.json({ message: 'Problem deleted successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProblem, getProblemList, getProblemDetails, updateProblem, deleteProblem };
