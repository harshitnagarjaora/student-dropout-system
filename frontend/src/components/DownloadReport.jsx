// frontend/src/components/DownloadReport.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX, FiFileText, FiPrinter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DownloadReport = ({ students, summary }) => {
  const [showModal, setShowModal] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    includeHighRisk: true,
    includeMediumRisk: true,
    includeLowRisk: true,
    includeCounseling: true,
    includeCharts: false,
  });

  const toggleOption = (option) => {
    setReportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const generateCSVReport = () => {
    if (!students || students.length === 0) {
      toast.error('No data to download');
      return;
    }

    // Filter students based on options
    let filteredStudents = students.filter(student => {
      if (!reportOptions.includeHighRisk && student.risk_level === 'High') return false;
      if (!reportOptions.includeMediumRisk && student.risk_level === 'Medium') return false;
      if (!reportOptions.includeLowRisk && student.risk_level === 'Low') return false;
      return true;
    });

    // Prepare CSV content
    let csvContent = 'Student Dropout Risk Analysis Report\n';
    csvContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    // Summary section
    csvContent += 'SUMMARY\n';
    csvContent += `Total Students: ${summary?.total_students || students.length}\n`;
    csvContent += `High Risk: ${summary?.high_risk || 0}\n`;
    csvContent += `Medium Risk: ${summary?.medium_risk || 0}\n`;
    csvContent += `Low Risk: ${summary?.low_risk || 0}\n\n`;

    // Headers
    const headers = [
      'Roll No',
      'Name',
      'Risk Level',
      'Risk Score',
      'Attendance %',
      'Average Marks',
      'Fee Status',
      'Risk Reasons'
    ];
    
    if (reportOptions.includeCounseling) {
      headers.push('Counseling Recommendations');
    }
    
    csvContent += headers.join(',') + '\n';

    // Data rows
    filteredStudents.forEach(student => {
      const row = [
        student.roll_no,
        `"${student.name}"`,
        student.risk_level,
        student.risk_score || 'N/A',
        student.attendance,
        student.avg_marks,
        student.fee_status,
        `"${student.reason || 'N/A'}"`
      ];
      
      if (reportOptions.includeCounseling) {
        // Clean counseling message for CSV
        const counseling = student.counseling_msg ? 
          student.counseling_msg.replace(/\n/g, ' ').replace(/"/g, '""').substring(0, 200) + '...' : 
          'N/A';
        row.push(`"${counseling}"`);
      }
      
      csvContent += row.join(',') + '\n';
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_risk_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success('Report downloaded successfully!', {
      duration: 3000,
      icon: '📊',
    });
    setShowModal(false);
  };

  const generateHTMLReport = () => {
    if (!students || students.length === 0) {
      toast.error('No data to download');
      return;
    }

    // Filter students based on options
    let filteredStudents = students.filter(student => {
      if (!reportOptions.includeHighRisk && student.risk_level === 'High') return false;
      if (!reportOptions.includeMediumRisk && student.risk_level === 'Medium') return false;
      if (!reportOptions.includeLowRisk && student.risk_level === 'Low') return false;
      return true;
    });

    // Generate HTML content
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Student Risk Analysis Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        h1 { color: #667eea; margin-bottom: 10px; font-size: 2.5rem; }
        .subtitle { color: #666; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .summary-card { padding: 20px; border-radius: 8px; text-align: center; }
        .summary-card.total { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
        .summary-card.high { background: #ffebee; color: #d32f2f; }
        .summary-card.medium { background: #fff3e0; color: #f57c00; }
        .summary-card.low { background: #e8f5e9; color: #388e3c; }
        .summary-card h3 { font-size: 0.9rem; margin-bottom: 10px; opacity: 0.9; }
        .summary-card .number { font-size: 2.5rem; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; }
        td { padding: 12px; border-bottom: 1px solid #dee2e6; }
        tr:hover { background: #f8f9fa; }
        .risk-high { color: #d32f2f; font-weight: bold; }
        .risk-medium { color: #f57c00; font-weight: bold; }
        .risk-low { color: #388e3c; font-weight: bold; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #666; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎓 Student Dropout Risk Analysis Report</h1>
        <p class="subtitle">Generated on ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <div class="summary-card total">
            <h3>Total Students</h3>
            <div class="number">${summary?.total_students || students.length}</div>
          </div>
          <div class="summary-card high">
            <h3>High Risk</h3>
            <div class="number">${summary?.high_risk || 0}</div>
          </div>
          <div class="summary-card medium">
            <h3>Medium Risk</h3>
            <div class="number">${summary?.medium_risk || 0}</div>
          </div>
          <div class="summary-card low">
            <h3>Low Risk</h3>
            <div class="number">${summary?.low_risk || 0}</div>
          </div>
        </div>

        <h2 style="margin-bottom: 20px; color: #333;">Student Details</h2>
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Risk Level</th>
              <th>Risk Score</th>
              <th>Attendance</th>
              <th>Marks</th>
              <th>Fee Status</th>
              <th>Risk Reasons</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredStudents.forEach(student => {
      const riskClass = `risk-${student.risk_level.toLowerCase()}`;
      htmlContent += `
        <tr>
          <td>${student.roll_no}</td>
          <td><strong>${student.name}</strong></td>
          <td class="${riskClass}">${student.risk_level}</td>
          <td>${student.risk_score || 'N/A'}</td>
          <td>${student.attendance}</td>
          <td>${student.avg_marks}</td>
          <td>${student.fee_status}</td>
          <td>${student.reason || 'N/A'}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        
        <div class="footer">
          <p>This report is generated by the Student Dropout Prediction System</p>
          <p>For detailed counseling recommendations, please view individual student profiles in the system.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Create and download file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_risk_report_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast.success('HTML Report downloaded successfully!', {
      duration: 3000,
      icon: '📄',
    });
    setShowModal(false);
  };

  return (
    <>
      {/* Download Button */}
      <motion.button
        className="download-report-btn"
        onClick={() => setShowModal(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiDownload />
        Download Report
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="report-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>📊 Generate Report</h3>
              
              <div className="report-options">
                <div className="report-option" onClick={() => toggleOption('includeHighRisk')}>
                  <input
                    type="checkbox"
                    checked={reportOptions.includeHighRisk}
                    onChange={() => {}}
                  />
                  <label>Include High Risk Students</label>
                </div>
                
                <div className="report-option" onClick={() => toggleOption('includeMediumRisk')}>
                  <input
                    type="checkbox"
                    checked={reportOptions.includeMediumRisk}
                    onChange={() => {}}
                  />
                  <label>Include Medium Risk Students</label>
                </div>
                
                <div className="report-option" onClick={() => toggleOption('includeLowRisk')}>
                  <input
                    type="checkbox"
                    checked={reportOptions.includeLowRisk}
                    onChange={() => {}}
                  />
                  <label>Include Low Risk Students</label>
                </div>
                
                <div className="report-option" onClick={() => toggleOption('includeCounseling')}>
                  <input
                    type="checkbox"
                    checked={reportOptions.includeCounseling}
                    onChange={() => {}}
                  />
                  <label>Include Counseling Recommendations</label>
                </div>
              </div>

              <div className="report-buttons">
                <button
                  onClick={generateCSVReport}
                  style={{
                    background: 'linear-gradient(135deg, #26de81, #20bf6b)',
                    color: 'white'
                  }}
                >
                  <FiFileText style={{ marginRight: '8px' }} />
                  Download CSV
                </button>
                
                <button
                  onClick={generateHTMLReport}
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white'
                  }}
                >
                  <FiPrinter style={{ marginRight: '8px' }} />
                  Download HTML
                </button>
                
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#f0f2f5',
                    color: '#2c3e50'
                  }}
                >
                  <FiX style={{ marginRight: '8px' }} />
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DownloadReport;