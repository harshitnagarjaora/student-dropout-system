// frontend/src/components/StudentModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUser, FiCalendar, FiBookOpen, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';

const StudentModal = ({ student, onClose, getRiskColor }) => {
  if (!student) return null;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{
          background: student.risk_level === 'High' 
            ? 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)'
            : student.risk_level === 'Medium'
            ? 'linear-gradient(135deg, #ffd93d 0%, #ffa502 100%)'
            : 'linear-gradient(135deg, #6bcf7f 0%, #26de81 100%)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              <FiUser style={{ marginRight: '10px' }} />
              {student.name}
            </h2>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>
              {student.roll_no} • Risk Level: {student.risk_level}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {/* Student Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <FiCalendar style={{ fontSize: '2rem', color: '#667eea', marginBottom: '0.5rem' }} />
              <h4 style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Attendance</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: parseFloat(student.attendance) < 75 ? '#ff4757' : '#2c3e50' }}>
                {student.attendance}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <FiBookOpen style={{ fontSize: '2rem', color: '#667eea', marginBottom: '0.5rem' }} />
              <h4 style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Average Marks</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: parseFloat(student.avg_marks) < 40 ? '#ff4757' : '#2c3e50' }}>
                {student.avg_marks}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <FiDollarSign style={{ fontSize: '2rem', color: '#667eea', marginBottom: '0.5rem' }} />
              <h4 style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Fee Status</h4>
              <p style={{ 
                fontSize: '1rem', 
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '50px',
                background: student.fee_status === 'Pending' ? 'rgba(255, 165, 2, 0.1)' : 'rgba(38, 222, 129, 0.1)',
                color: student.fee_status === 'Pending' ? '#ffa502' : '#26de81',
                display: 'inline-block'
              }}>
                {student.fee_status}
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: '#f8f9fa',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <FiAlertTriangle style={{ fontSize: '2rem', color: getRiskColor(student.risk_level), marginBottom: '0.5rem' }} />
              <h4 style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Risk Score</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: getRiskColor(student.risk_level) }}>
                {student.risk_score || 'N/A'}
              </p>
            </div>
          </div>

          {/* Risk Reasons */}
          {student.reason && (
            <div style={{
              padding: '1.5rem',
              background: '#fff5f5',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#ff4757' }}>
                <FiAlertTriangle style={{ marginRight: '8px' }} />
                Risk Factors
              </h3>
              <p style={{ color: '#7f8c8d', lineHeight: 1.6 }}>{student.reason}</p>
            </div>
          )}

          {/* Counseling Message */}
          {student.counseling_msg && (
            <div style={{
              padding: '1.5rem',
              background: '#f0f9ff',
              borderRadius: '12px',
              border: '1px solid #e0f2fe'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#0369a1' }}>
                💡 AI Counseling Recommendations
              </h3>
              <div style={{ 
                color: '#475569', 
                lineHeight: 1.8,
                whiteSpace: 'pre-line'
              }}>
                {student.counseling_msg.split('\n').map((line, idx) => (
                  <p key={idx} style={{ marginBottom: '0.5rem' }}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            <button style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Send Alert to Student
            </button>
            <button style={{
              flex: 1,
              padding: '12px',
              background: '#f0f2f5',
              color: '#2c3e50',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Download Report
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentModal;