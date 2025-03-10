const express = require('express');
const {
  createProblem,
  getProblemList,
  getProblemDetails,
  updateProblem,
  deleteProblem
} = require('../controllers/problemController');
const authenticateToken = require('../middlewares/auth');
const { validateProblem } = require('../middlewares/problemValidation'); // Import validation

const router = express.Router();

router.post('/create', authenticateToken, validateProblem, createProblem); // Added validation here
router.get('/list', authenticateToken, getProblemList);
router.put('/update/:id', authenticateToken, validateProblem, updateProblem); // Added validation here
router.get('/detail/:id', authenticateToken, getProblemDetails);
router.delete('/delete/:id', authenticateToken, deleteProblem);

module.exports = router;
