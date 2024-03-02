// src/pages/Dashboard.jsx

import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  // Function to generate a random number between min and max
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <div className="flex h-screen bg-blue-700">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-white">
          <div className="flex justify-between flex-wrap">


            {/* First Section - Total Policyholders */}
            <div className="flex-1 max-w-xs bg-slate-300 rounded-lg p-4 mr-4 mb-4 shadow-md shadow-slate-400">
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 bg-blue-900 mr-2"></div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Total Policyholders</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{getRandomNumber(100, 500)} <span className="text-sm text-gray-600 ml-2">Providers</span></p>
              <div className="mt-4 flex justify-center">
                <button className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-full w-4/5">
                  View Providers
                </button>
              </div>
            </div>

            {/* Second Section - Reports */}
            <div className="flex-1 max-w-xs bg-slate-300 rounded-lg p-4 mr-4 mb-4 shadow-md shadow-slate-400">
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 bg-blue-900 mr-2"></div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Reports</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{getRandomNumber(10, 50)} <span className="text-sm text-gray-600 ml-2">Reports Available</span></p>
              <div className="mt-4 flex justify-center">
                <button className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-full w-4/5">
                  View Reports
                </button>
              </div>
            </div>

            {/* Third Section - Anomalies */}
            <div className="flex-1 max-w-xs bg-slate-300 rounded-lg p-4 mr-4 mb-4 shadow-md shadow-slate-400">
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 bg-blue-900 mr-2"></div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Anomalies</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{getRandomNumber(5, 20)} <span className="text-sm text-gray-600 ml-2">Anomalies Detected</span></p>
              <div className="mt-4 flex justify-center">
                <button className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-full w-4/5">
                  Show Anomalies
                </button>
              </div>
            </div>
            
            {/* Fourth Section - Total Claims */}
            <div className="flex-1 max-w-xs bg-slate-300 rounded-lg p-4 mb-4 shadow-md shadow-slate-400">
              <div className="flex items-center mb-2">
                <div className="h-6 w-6 bg-blue-900 mr-2"></div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Total Claims</h2>
              </div>
              <p className="text-3xl font-bold mb-2">{getRandomNumber(200, 800)} <span className="text-sm text-gray-600 ml-2">Total Claims</span></p>
              <div className="mt-4 flex justify-center">
                <button className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-full w-4/5">
                  View Claims
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xs flex flex-wrap">
            {/* First new section - 30% width */}
            <div className="w-30p bg-slate-300 rounded-lg p-4 mr-4 mb-4 shadow-md shadow-slate-400">
              {/* Content */}
            </div>
            {/* Second new section - 70% width */}
            <div className="flex-1 bg-slate-300 rounded-lg p-4 mb-4 shadow-md shadow-slate-400">
              {/* Content */}
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
