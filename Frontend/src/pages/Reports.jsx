// src/pages/Reports.jsx

import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Reports = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {/* Reports content goes here */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Reports;
