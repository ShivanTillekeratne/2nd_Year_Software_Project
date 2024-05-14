// src/pages/AddInvestigators.jsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Ensure the import path is correct
import Navbar from '../components/Navbar'; // Ensure the import path is correct
import Footer from '../components/Footer'; // Ensure the import path is correct

const AddInvestigators = () => {
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Investigator Details Submitted', { fullName, firstName, lastName, id, password });
    // Here, implement the logic to handle the form submission
  };

  return (
    <div className="flex h-screen bg-blue-700">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-white">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6" style={{ marginLeft: 'auto', marginRight: 'auto', width: '600px' }}>Enter Investigator Details</h2>
          <div className="bg-slate-300 p-8 rounded-2xl" style={{ width: '600px', margin: '0 auto' }}> {/* Centered form container */}
            <form onSubmit={handleSubmit}>
            {/* Full Name */}
                <div className="mb-4">
                <label htmlFor="fullName" className="block mb-2">Full Name</label>
                <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
                </div>

                {/* First Name */}
                <div className="mb-4">
                <label htmlFor="firstName" className="block mb-2">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
                </div>

                {/* Last Name */}
                <div className="mb-4">
                <label htmlFor="lastName" className="block mb-2">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
                </div>

                {/* ID */}
                <div className="mb-4">
                <label htmlFor="id" className="block mb-2">ID</label>
                <input
                    type="text"
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
                </div>

                {/* Password */}
                <div className="mb-4">
                <label htmlFor="password" className="block mb-2">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
                </div>

                {/* Save Details Button */}
                <div className="mt-8">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        Save Details
                    </button>
                </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AddInvestigators;
