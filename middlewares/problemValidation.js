const validateProblem = (req, res, next) => {
    const { link, status, deadline } = req.body;
  
    if (!link) return res.status(400).json({ message: 'Problem link is required' });
    if (status === 'started' && !deadline) {
      return res.status(400).json({ message: 'Deadline is required for pending problems' });
    }
  
    next();
  };
  
  module.exports = { validateProblem };
  