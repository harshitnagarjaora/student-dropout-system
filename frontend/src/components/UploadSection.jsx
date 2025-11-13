// frontend/src/components/UploadSection.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCheckCircle } from 'react-icons/fi';
import { BsFiletypeCsv } from 'react-icons/bs';
import { IoCloudUploadOutline } from 'react-icons/io5';

const UploadSection = ({ onUpload }) => {
  const [files, setFiles] = useState({
    attendance: null,
    marks: null,
    fees: null
  });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSubmit = () => {
    if (files.attendance && files.marks && files.fees) {
      onUpload(files);
    }
  };

  const isReady = files.attendance && files.marks && files.fees;

  const fileCards = [
    {
      type: 'attendance',
      title: 'Attendance Data',
      icon: '📊',
      description: 'Upload attendance records',
      color: '#667eea'
    },
    {
      type: 'marks',
      title: 'Marks Data',
      icon: '📝',
      description: 'Upload academic marks',
      color: '#764ba2'
    },
    {
      type: 'fees',
      title: 'Fees Data',
      icon: '💰',
      description: 'Upload fees information',
      color: '#f093fb'
    }
  ];

  return (
    <div className="upload-section">
      <motion.div 
        className="upload-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Upload Student Data</h2>
        <p>Upload CSV files to analyze student dropout risk using AI</p>
      </motion.div>

      <div className="file-upload-grid">
        {fileCards.map((card, index) => (
          <motion.div
            key={card.type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <label 
              className={`file-upload-card ${files[card.type] ? 'uploaded' : ''}`}
              htmlFor={`file-${card.type}`}
            >
              <input
                type="file"
                id={`file-${card.type}`}
                accept=".csv"
                onChange={(e) => handleFileChange(e, card.type)}
              />
              <div className="file-icon" style={{ color: card.color }}>
                {files[card.type] ? <FiCheckCircle size={48} /> : <BsFiletypeCsv size={48} />}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {files[card.type] && (
                <div className="file-name">
                  ✅ {files[card.type].name}
                </div>
              )}
            </label>
          </motion.div>
        ))}
      </div>

      <motion.div 
        style={{ textAlign: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button 
          className="upload-btn"
          onClick={handleSubmit}
          disabled={!isReady}
        >
          <IoCloudUploadOutline size={24} />
          Analyze Students
        </button>
      </motion.div>
    </div>
  );
};

export default UploadSection;