// src/pages/Dashboard.jsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  // State for the search term
  const [searchTerm, setSearchTerm] = useState('');

  // Handler for search submission
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    // Implement search functionality here
  };

  return (
    <div className="flex h-screen bg-blue-700">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-white">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard Overview</h1>
          <div className="mb-4">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Claim ID"
                className="px-4 py-2 w-1/3 border-2 border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
              >
                Search
              </button>
            </form>
          </div>
          {/* New content area div */}
          <div className="relative flex flex-col bg-blue-50 border border-gray-200 rounded-lg p-4 mb-4" style={{width: '85%', minHeight: '70vh'}}>
            {/* Content goes here */}

            {/* Button on the bottom-right side */}
            <button className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Check Validity
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
