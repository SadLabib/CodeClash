// routes/reportRoutes.js
const express = require('express');
const { generateReport, getStatistics, testPDF } = require('../controllers/reportController');
const authenticateToken = require('../middlewares/auth');

const router = express.Router();

// Route to get statistics data as JSON
router.get('/statistics', authenticateToken, getStatistics);

// Route to generate and download PDF report
router.get('/pdf', authenticateToken, generateReport);
router.get('/test', testPDF);

module.exports = router;