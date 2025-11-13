// frontend/src/components/Navbar.jsx
import React from 'react';
import { FiSearch, FiGrid, FiList, FiUploadCloud } from 'react-icons/fi';
import { IoSchoolOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Navbar = ({ searchTerm, setSearchTerm, activeView, setActiveView, showNewUpload, hasData }) => {
  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="navbar-content">
        <div className="navbar-brand">
          <IoSchoolOutline />
          <span>Student Risk Analyzer</span>
        </div>

        <div className="navbar-controls">
          {hasData && (
            <>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search students by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch />
              </div>

              <div className="view-toggle">
                <button
                  className={activeView === 'sections' ? 'active' : ''}
                  onClick={() => setActiveView('sections')}
                >
                  <FiGrid size={16} />
                  Sections
                </button>
                <button
                  className={activeView === 'table' ? 'active' : ''}
                  onClick={() => setActiveView('table')}
                >
                  <FiList size={16} />
                  Table
                </button>
              </div>

              <button className="new-upload-btn" onClick={showNewUpload}>
                <FiUploadCloud />
                New Upload
              </button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;