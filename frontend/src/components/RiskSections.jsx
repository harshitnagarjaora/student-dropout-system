// frontend/src/components/RiskSections.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAlertTriangle, 
  FiAlertCircle, 
  FiCheckCircle,
  FiUser,
  FiCalendar,
  FiBookOpen,
  FiDollarSign,
  FiEye,
  FiBell,
  FiTrendingDown,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import StudentTable from './StudentTable';
import { sendAlert } from '../api/studentApi';

const RiskSections = ({ 
  highRiskStudents, 
  mediumRiskStudents, 
  lowRiskStudents, 
  onStudentClick,
  getRiskColor,
  activeView 
}) => {

  // Handle Send Alert
  const handleSendAlert = async (e, student) => {
    e.stopPropagation(); // Prevent card click
    
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

  // If table view is selected, show table instead
  if (activeView === 'table') {
    const allStudents = [...highRiskStudents, ...mediumRiskStudents, ...lowRiskStudents];
    return <StudentTable students={allStudents} onStudentClick={onStudentClick} onSendAlert={handleSendAlert} />;
  }

  const RiskSection = ({ title, students, riskLevel, icon, color, gradientBg }) => {
    const getRiskIcon = (level) => {
      switch(level) {
        case 'high': return <FiTrendingDown />;
        case 'medium': return <FiActivity />;
        case 'low': return <FiTrendingUp />;
        default: return null;
      }
    };

    return (
      <motion.div 
        className="risk-section"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="risk-section-header">
          <div className="risk-section-title">
            <div className={`risk-icon ${riskLevel}`}>
              {icon}
            </div>
            <h2>{title}</h2>
          </div>
          <div className="student-count">
            {students.length} {students.length === 1 ? 'Student' : 'Students'}
          </div>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <FiUser />
            <p>No students in this category</p>
          </div>
        ) : (
          <div className="students-grid">
            <AnimatePresence>
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  className={`student-card ${riskLevel}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  layout
                  style={{ position: 'relative' }} // Ensure proper stacking
                >
                  <div className="student-card-inner">
                    <div className="student-header">
                      <div className="student-info">
                        <h3>{student.name}</h3>
                        <p>{student.roll_no}</p>
                      </div>
                      <span className={`risk-badge ${riskLevel}`}>
                        {getRiskIcon(riskLevel)} {student.risk_score || 'N/A'}
                      </span>
                    </div>

                    <div className="student-metrics">
                      <div className="metric">
                        <FiCalendar className="metric-icon" />
                        <span className="metric-value">{student.attendance}</span>
                      </div>
                      <div className="metric">
                        <FiBookOpen className="metric-icon" />
                        <span className="metric-value">{student.avg_marks}</span>
                      </div>
                      <div className="metric">
                        <FiDollarSign className="metric-icon" />
                        <span className="metric-value">{student.fee_status}</span>
                      </div>
                      <div className="metric">
                        <FiActivity className="metric-icon" />
                        <span className="metric-value">{student.risk_level}</span>
                      </div>
                    </div>

                    <div className="student-actions">
                      <button 
                        className="action-btn view"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStudentClick(student);
                        }}
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <FiEye /> View Details
                      </button>
                      <button 
                        className="action-btn alert"
                        onClick={(e) => handleSendAlert(e, student)}
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <FiBell /> Send Alert
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="risk-sections-container">
      <RiskSection
        title="High Risk Students"
        students={highRiskStudents}
        riskLevel="high"
        icon={<FiAlertTriangle />}
        color="#ff4757"
        gradientBg="linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)"
      />
      
      <RiskSection
        title="Medium Risk Students"
        students={mediumRiskStudents}
        riskLevel="medium"
        icon={<FiAlertCircle />}
        color="#ffa502"
        gradientBg="linear-gradient(135deg, #ffd93d 0%, #ffa502 100%)"
      />
      
      <RiskSection
        title="Low Risk Students"
        students={lowRiskStudents}
        riskLevel="low"
        icon={<FiCheckCircle />}
        color="#26de81"
        gradientBg="linear-gradient(135deg, #6bcf7f 0%, #26de81 100%)"
      />
    </div>
  );
};

export default RiskSections;