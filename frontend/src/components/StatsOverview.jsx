// frontend/src/components/StatsOverview.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAlertTriangle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StatsOverview = ({ summary }) => {
  const stats = [
    {
      title: 'Total Students',
      value: summary.total_students,
      icon: <FiUsers />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      type: 'total'
    },
    {
      title: 'High Risk',
      value: summary.high_risk,
      percentage: (summary.high_risk / summary.total_students * 100).toFixed(1),
      icon: <FiAlertTriangle />,
      color: '#ff4757',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
      type: 'high'
    },
    {
      title: 'Medium Risk',
      value: summary.medium_risk,
      percentage: (summary.medium_risk / summary.total_students * 100).toFixed(1),
      icon: <FiAlertCircle />,
      color: '#ffa502',
      gradient: 'linear-gradient(135deg, #ffd93d 0%, #ffa502 100%)',
      type: 'medium'
    },
    {
      title: 'Low Risk',
      value: summary.low_risk,
      percentage: (summary.low_risk / summary.total_students * 100).toFixed(1),
      icon: <FiCheckCircle />,
      color: '#26de81',
      gradient: 'linear-gradient(135deg, #6bcf7f 0%, #26de81 100%)',
      type: 'low'
    }
  ];

  return (
    <div className="stats-overview">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.type}
          className={`stat-card ${stat.type}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-content">
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <div className="stat-number" style={{ color: stat.color }}>
                {stat.value}
              </div>
              {stat.percentage && (
                <div className="stat-percentage">
                  {stat.percentage}% of total
                </div>
              )}
            </div>
            {stat.percentage ? (
              <div style={{ width: 80, height: 80 }}>
                <CircularProgressbar
                  value={parseFloat(stat.percentage)}
                  text={`${stat.percentage}%`}
                  styles={buildStyles({
                    textSize: '20px',
                    pathColor: stat.color,
                    textColor: stat.color,
                    trailColor: '#f0f2f5',
                  })}
                />
              </div>
            ) : (
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;