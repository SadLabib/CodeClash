// services/pdfService.js
const PDFDocument = require('pdfkit');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');

// Configure chart rendering
const width = 600;
const height = 400;
const chartCallback = (ChartJS) => {
  // Global chart configuration goes here
  ChartJS.defaults.font.family = 'Arial';
  ChartJS.defaults.color = '#666';
};

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

/**
 * Generate a pie chart image for the given data
 * @param {Object} data - Object with labels as keys and values as values
 * @param {string} title - Chart title
 * @returns {Buffer} - PNG image buffer
 */
const generatePieChart = async (data, title) => {
  try {
    const labels = Object.keys(data);
    const values = Object.values(data);
    
    const configuration = {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
            'rgba(40, 159, 64, 0.8)',
            'rgba(210, 199, 199, 0.8)',
          ],
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: title
          }
        }
      }
    };
    
    // Handle case with too many items by limiting to top 10
    if (labels.length > 10) {
      const sortedEntries = Object.entries(data).sort((a, b) => b[1] - a[1]);
      const top10 = sortedEntries.slice(0, 9);
      const others = sortedEntries.slice(9);
      
      const othersSum = others.reduce((sum, [_, value]) => sum + value, 0);
      const newLabels = [...top10.map(([label]) => label), 'Others'];
      const newValues = [...top10.map(([_, value]) => value), othersSum];
      
      configuration.data.labels = newLabels;
      configuration.data.datasets[0].data = newValues;
    }
    
    return await chartJSNodeCanvas.renderToBuffer(configuration);
  } catch (error) {
    console.error('Error generating pie chart:', error);
    throw error;
  }
};

/**
 * Generate a bar chart image for the given data
 * @param {Object} data - Object with labels as keys and values as values
 * @param {string} title - Chart title
 * @returns {Buffer} - PNG image buffer
 */
const generateBarChart = async (data, title) => {
  try {
    // Sort data by rating (numeric keys)
    const sortedEntries = Object.entries(data).sort((a, b) => {
      return parseInt(a[0]) - parseInt(b[0]);
    });
    
    const labels = sortedEntries.map(([label]) => label);
    const values = sortedEntries.map(([_, value]) => value);
    
    const configuration = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: title,
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Problems'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Problem Rating'
            }
          }
        }
      }
    };
    
    return await chartJSNodeCanvas.renderToBuffer(configuration);
  } catch (error) {
    console.error('Error generating bar chart:', error);
    throw error;
  }
};

/**
 * Generate a PDF report for the user's problem statistics
 * @param {Object} statistics - User statistics object
 * @returns {Buffer} - PDF document buffer
 */
const generateProblemReport = async (statistics) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      
      // Collect PDF data chunks
      doc.on('data', buffer => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', err => reject(err));
      
      // Create header
      doc.fontSize(25)
         .font('Helvetica-Bold')
         .text('Problem Solving Statistics Report', { align: 'center' })
         .moveDown();
      
      // Add user information
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('User Profile')
         .moveDown(0.5);
      
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Username: ${statistics.user.username}`)
         .text(`Email: ${statistics.user.email}`)
         .moveDown();
      
      // Add summary section
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('Problem Summary')
         .moveDown(0.5);
      
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Total Problems: ${statistics.summary.totalProblems}`)
         .text(`Problems Solved: ${statistics.summary.solvedProblems}`)
         .text(`Problems In Progress: ${statistics.summary.startedProblems}`)
         .text(`Problems Pending: ${statistics.summary.pendingProblems}`)
         .text(`Completion Rate: ${statistics.summary.completionRate}%`)
         .moveDown(1);
      
      // Generate status distribution chart
      const statusData = {
        'Solved': statistics.summary.solvedProblems,
        'In Progress': statistics.summary.startedProblems,
        'Pending': statistics.summary.pendingProblems
      };
      
      if (Object.values(statusData).some(v => v > 0)) {
        const statusChartBuffer = await generatePieChart(statusData, 'Problem Status Distribution');
        doc.image(statusChartBuffer, {
          fit: [500, 300],
          align: 'center'
        });
        doc.moveDown(1);
      }
      
      // Add problem ratings section if there are any
      if (Object.keys(statistics.distributions.ratings).length > 0) {
        doc.addPage();
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('Problem Ratings Distribution')
           .moveDown(0.5);
        
        const ratingChartBuffer = await generateBarChart(
          statistics.distributions.ratings, 
          'Problems by Difficulty Rating'
        );
        
        doc.image(ratingChartBuffer, {
          fit: [500, 300],
          align: 'center'
        });
        doc.moveDown(1);
      }
      
      // Add problem tags section if there are any
      if (Object.keys(statistics.distributions.tags).length > 0) {
        doc.addPage();
        doc.fontSize(16)
           .font('Helvetica-Bold')
           .text('Problem Tags Distribution')
           .moveDown(0.5);
        
        const tagsChartBuffer = await generatePieChart(
          statistics.distributions.tags, 
          'Problems by Topic/Tag'
        );
        
        doc.image(tagsChartBuffer, {
          fit: [500, 300],
          align: 'center'
        });
        
        // Add table of tag counts
        doc.moveDown(1);
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Tag Breakdown', { align: 'center' })
           .moveDown(0.5);
        
        // Sort tags by count (descending)
        const sortedTags = Object.entries(statistics.distributions.tags)
          .sort((a, b) => b[1] - a[1]);
        
        let yPos = doc.y;
        const pageHeight = doc.page.height - 100; // Leave margin at bottom
        
        sortedTags.forEach(([tag, count], index) => {
          // Add a new page if we're getting close to the bottom
          if (yPos > pageHeight) {
            doc.addPage();
            yPos = 100; // Reset Y position on new page
          }
          
          doc.fontSize(10)
             .font('Helvetica')
             .text(`${tag}: ${count}`, 100, yPos);
          
          yPos += 20; // Move down for next tag
        });
      }
      
      // Add footer with date
      const date = new Date().toLocaleDateString();
      doc.fontSize(10)
         .text(`Report generated on ${date}`, {
           align: 'center',
           bottom: 50
         });
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};

module.exports = { generateProblemReport };