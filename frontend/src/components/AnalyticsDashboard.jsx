// frontend/src/components/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiBarChart2 } from 'react-icons/fi';

const AnalyticsDashboard = ({ students, summary }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Prepare data for charts
  const riskDistributionData = [
    { name: 'High Risk', value: summary?.high_risk || 0, color: '#ff4757' },
    { name: 'Medium Risk', value: summary?.medium_risk || 0, color: '#ffa502' },
    { name: 'Low Risk', value: summary?.low_risk || 0, color: '#26de81' }
  ];

  // Attendance vs Marks correlation
  const attendanceMarksData = students.map(s => ({
    attendance: parseFloat(s.attendance),
    marks: parseFloat(s.avg_marks),
    risk: s.risk_level
  }));

  // Department-wise analysis (mock data - you can replace with real)
  const departmentData = [
    { dept: 'CSE', high: 5, medium: 8, low: 15 },
    { dept: 'ECE', high: 7, medium: 10, low: 12 },
    { dept: 'MECH', high: 4, medium: 6, low: 18 },
    { dept: 'CIVIL', high: 3, medium: 5, low: 20 },
    { dept: 'EEE', high: 6, medium: 7, low: 14 }
  ];

  // Risk factors analysis
  const riskFactorsData = [
    { factor: 'Low Attendance', count: students.filter(s => parseFloat(s.attendance) < 75).length },
    { factor: 'Poor Marks', count: students.filter(s => parseFloat(s.avg_marks) < 40).length },
    { factor: 'Pending Fees', count: students.filter(s => s.fee_status === 'Pending').length },
    { factor: 'Multiple Issues', count: students.filter(s => s.risk_level === 'High').length }
  ];

  // Trend data (mock - replace with real historical data)
  const trendData = [
    { month: 'Jan', high: 8, medium: 12, low: 25 },
    { month: 'Feb', high: 10, medium: 11, low: 24 },
    { month: 'Mar', high: 7, medium: 13, low: 26 },
    { month: 'Apr', high: 9, medium: 10, low: 27 },
    { month: 'May', high: 6, medium: 8, low: 30 },
    { month: 'Jun', high: 5, medium: 7, low: 32 }
  ];

  // Performance metrics for radar chart
  const performanceData = [
    { metric: 'Attendance', A: 85, B: 65, fullMark: 100 },
    { metric: 'Academics', A: 75, B: 55, fullMark: 100 },
    { metric: 'Assignments', A: 90, B: 60, fullMark: 100 },
    { metric: 'Participation', A: 80, B: 50, fullMark: 100 },
    { metric: 'Consistency', A: 88, B: 45, fullMark: 100 }
  ];

  return (
    <motion.div 
      className="analytics-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        marginTop: '2rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '2px solid #f0f2f5',
        paddingBottom: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📊 Advanced Analytics Dashboard
        </h2>
        
        <div className="tab-buttons" style={{ display: 'flex', gap: '1rem' }}>
          {['overview', 'trends', 'factors', 'performance'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                background: activeTab === tab ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f2f5',
                color: activeTab === tab ? 'white' : '#7f8c8d',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="charts-container">
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {/* Risk Distribution Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="chart-card"
              style={{
                padding: '1.5rem',
                background: '#fafbfc',
                borderRadius: '15px'
              }}
            >
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
                <FiBarChart2 style={{ marginRight: '8px' }} />
                Risk Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Department-wise Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="chart-card"
              style={{
                padding: '1.5rem',
                background: '#fafbfc',
                borderRadius: '15px'
              }}
            >
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
                <FiActivity style={{ marginRight: '8px' }} />
                Department-wise Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="high" fill="#ff4757" name="High Risk" />
                  <Bar dataKey="medium" fill="#ffa502" name="Medium Risk" />
                  <Bar dataKey="low" fill="#26de81" name="Low Risk" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '1.5rem',
              background: '#fafbfc',
              borderRadius: '15px'
            }}
          >
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              <FiTrendingUp style={{ marginRight: '8px' }} />
              Risk Level Trends (6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#26de81" fill="#26de81" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#ffa502" fill="#ffa502" />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#ff4757" fill="#ff4757" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {activeTab === 'factors' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '1.5rem',
              background: '#fafbfc',
              borderRadius: '15px'
            }}
          >
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              <FiTrendingDown style={{ marginRight: '8px' }} />
              Risk Factors Analysis
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={riskFactorsData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="factor" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                  <Cell fill="#ff4757" />
                  <Cell fill="#ffa502" />
                  <Cell fill="#667eea" />
                  <Cell fill="#764ba2" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '1.5rem',
              background: '#fafbfc',
              borderRadius: '15px'
            }}
          >
            <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
              Performance Comparison (Low Risk vs High Risk Students)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar name="Low Risk Students" dataKey="A" stroke="#26de81" fill="#26de81" fillOpacity={0.6} />
                <Radar name="High Risk Students" dataKey="B" stroke="#ff4757" fill="#ff4757" fillOpacity={0.6} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>

      {/* Key Insights Section */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: '15px'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
          💡 Key Insights
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '10px' }}>
            <h4 style={{ color: '#ff4757', marginBottom: '0.5rem' }}>Critical Alert</h4>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
              {summary?.high_risk || 0} students need immediate intervention
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '10px' }}>
            <h4 style={{ color: '#ffa502', marginBottom: '0.5rem' }}>Warning Zone</h4>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
              {summary?.medium_risk || 0} students showing early warning signs
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '10px' }}>
            <h4 style={{ color: '#26de81', marginBottom: '0.5rem' }}>Success Rate</h4>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
              {((summary?.low_risk / summary?.total_students) * 100).toFixed(1)}% students performing well
            </p>
          </div>
          <div style={{ padding: '1rem', background: 'white', borderRadius: '10px' }}>
            <h4 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Intervention Needed</h4>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
              Focus on attendance improvement for maximum impact
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;