// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import Navbar from './components/Navbar';
import UploadSection from './components/UploadSection';
import StatsOverview from './components/StatsOverview';
import RiskSections from './components/RiskSections';
import StudentModal from './components/StudentModal';
import LoadingScreen from './components/LoadingScreen';
import DownloadReport from './components/DownloadReport';
import { uploadAndPredict, getAllStudents } from './api/studentApi';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('sections'); // 'sections' or 'table'
  const [showUpload, setShowUpload] = useState(true);

  useEffect(() => {
    // Load existing students on mount
    loadExistingStudents();
  }, []);

  useEffect(() => {
    // Filter students based on search
    if (searchTerm) {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const loadExistingStudents = async () => {
    try {
      const data = await getAllStudents();
      if (data.data && data.data.length > 0) {
        setStudents(data.data);
        setFilteredStudents(data.data);
        calculateSummary(data.data);
        setShowUpload(false);
      }
    } catch (error) {
      console.log('No existing data found');
    }
  };

  const calculateSummary = (studentData) => {
    const summary = {
      total_students: studentData.length,
      high_risk: studentData.filter(s => s.risk_level === 'High').length,
      medium_risk: studentData.filter(s => s.risk_level === 'Medium').length,
      low_risk: studentData.filter(s => s.risk_level === 'Low').length
    };
    setSummary(summary);
  };

  const handleFileUpload = async (files) => {
    setLoading(true);
    try {
      const response = await uploadAndPredict(
        files.attendance,
        files.marks,
        files.fees
      );
      
      if (response.success) {
        setStudents(response.data);
        setFilteredStudents(response.data);
        setSummary(response.summary);
        setShowUpload(false);
        toast.success('Files processed successfully!', {
          duration: 4000,
          icon: '🎉',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      toast.error(error.message || 'Error processing files', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#ff4444',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'High': return '#ff4757';
      case 'Medium': return '#ffa502';
      case 'Low': return '#26de81';
      default: return '#718093';
    }
  };

  // Separate students by risk level
  const highRiskStudents = filteredStudents.filter(s => s.risk_level === 'High');
  const mediumRiskStudents = filteredStudents.filter(s => s.risk_level === 'Medium');
  const lowRiskStudents = filteredStudents.filter(s => s.risk_level === 'Low');

  return (
    <div className="App">
      <Toaster position="top-right" />
      
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeView={activeView}
        setActiveView={setActiveView}
        showNewUpload={() => setShowUpload(true)}
        hasData={students.length > 0}
      />

      <AnimatePresence mode="wait">
        {loading && <LoadingScreen />}
      </AnimatePresence>

      <div className="main-content">
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <UploadSection onUpload={handleFileUpload} />
            </motion.div>
          )}
        </AnimatePresence>

        {summary && !showUpload && (
          <>
            <StatsOverview summary={summary} />
            <AnalyticsDashboard students={students} summary={summary} />
            <RiskSections
              highRiskStudents={highRiskStudents}
              mediumRiskStudents={mediumRiskStudents}
              lowRiskStudents={lowRiskStudents}
              onStudentClick={handleStudentClick}
              getRiskColor={getRiskColor}
              activeView={activeView}
            />
          </>
        )}
      </div>

      {/* Download Report Button - Shows only when we have data */}
      {students.length > 0 && !showUpload && (
        <DownloadReport 
          students={students} 
          summary={summary} 
        />
      )}

      <AnimatePresence>
        {selectedStudent && (
          <StudentModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            getRiskColor={getRiskColor}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;