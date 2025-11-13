// frontend/src/components/StudentTable.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { sendAlert } from '../api/studentApi';

const StudentTable = ({ students, onStudentClick }) => {
  
  const handleSendAlert = async (e, student) => {
    e.stopPropagation();
    
    try {
      const message = `Alert: Your current risk level is ${student.risk_level}. Please meet your academic advisor immediately.`;
      await sendAlert(student.id, message);
      
      toast.success(`Alert sent to ${student.name}!`, {
        duration: 3000,
        icon: '📧',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error('Failed to send alert', {
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#ff4444',
          color: '#fff',
        },
      });
    }
  };

  const getRiskBadgeClass = (level) => {
    switch(level) {
      case 'High': return 'risk-badge high';
      case 'Medium': return 'risk-badge medium';
      case 'Low': return 'risk-badge low';
      default: return 'risk-badge';
    }
  };

  return (
    <motion.div 
      className="table-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        overflowX: 'auto'
      }}
    >
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead>
          <tr style={{
            borderBottom: '2px solid #f0f2f5'
          }}>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#7f8c8d' }}>Roll No</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#7f8c8d' }}>Name</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#7f8c8d' }}>Attendance</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#7f8c8d' }}>Marks</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#7f8c8d' }}>Fee Status</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#7f8c8d' }}>Risk Level</th>
            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#7f8c8d' }}>Risk Score</th>
            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#7f8c8d' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <motion.tr
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                borderBottom: '1px solid #f0f2f5',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '1rem' }}>{student.roll_no}</td>
              <td style={{ padding: '1rem', fontWeight: 500 }}>{student.name}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{
                  color: parseFloat(student.attendance) < 75 ? '#ff4757' : '#2c3e50'
                }}>
                  {student.attendance}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{
                  color: parseFloat(student.avg_marks) < 40 ? '#ff4757' : '#2c3e50'
                }}>
                  {student.avg_marks}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  background: student.fee_status === 'Pending' ? 'rgba(255, 165, 2, 0.1)' : 'rgba(38, 222, 129, 0.1)',
                  color: student.fee_status === 'Pending' ? '#ffa502' : '#26de81'
                }}>
                  {student.fee_status}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span className={getRiskBadgeClass(student.risk_level)}>
                  {student.risk_level}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>{student.risk_score || 'N/A'}</td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button 
                  className="action-btn view"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStudentClick(student);
                  }}
                  style={{ padding: '6px 12px' }}
                >
                  <FiEye /> View
                </button>
                <button 
                  className="action-btn alert"
                  onClick={(e) => handleSendAlert(e, student)}
                  style={{ padding: '6px 12px' }}
                >
                  <FiBell /> Alert
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default StudentTable;