// controllers/reportController.js
const { generateUserStatistics } = require('../services/statisticsService');
const { generateProblemReport } = require('../services/pdfService');
const fs = require('fs');
const path = require('path');

/**
 * Generate and return a statistical report for the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateReport = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Generate statistics from user's problems
    const statistics = await generateUserStatistics(userId);
    
    // Create a PDF report from the statistics
    const pdfBuffer = await generateProblemReport(statistics);
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=problem-report-${userId}.pdf`);
    
    // Send the PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      message: 'Error generating report', 
      error: error.message 
    });
  }
};

/**
 * Get just the statistics data as JSON
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Generate statistics from user's problems
    const statistics = await generateUserStatistics(userId);
    
    // Return the statistics as JSON
    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    console.error('Statistics generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating statistics', 
      error: error.message 
    });
  }
};

// Add this to reportController.js
const testPDF = async (req, res) => {
  try {
    // Create a simple PDF document
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffer => buffers.push(buffer));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Send the PDF
      res.send(pdfBuffer);
    });
    
    // Add content to PDF
    doc.fontSize(25)
       .text('Test PDF Document', 100, 100);
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Test PDF error:', error);
    res.status(500).json({ message: 'Error generating test PDF' });
  }
};

// Export the new function
module.exports = { generateReport, getStatistics, testPDF };
//module.exports = { generateReport, getStatistics };