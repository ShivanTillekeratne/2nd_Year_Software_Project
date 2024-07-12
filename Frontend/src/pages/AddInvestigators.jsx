import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // Ensure the import path is correct
import Navbar from '../components/Navbar'; // Ensure the import path is correct

const AddInvestigators = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken'); // Get the JWT token from localStorage
      const response = await axios.post('http://127.0.0.1:8000/api/user/create_investigator/', {
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Include the JWT token in the request headers
        }
      });
      console.log('Investigator created successfully', response.data);
      setSuccess('Investigator created successfully');
      setUsername('');
      setFirstName('');
      setLastName('');
      setPassword('');
    } catch (error) {
      setError('Failed to create investigator. Please check your inputs and ensure you have the necessary permissions.');
      console.error('There was an error creating the investigator!', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-slate-900">
          <h2 className="text-2xl font-semibold text-white mb-6" style={{ marginLeft: 'auto', marginRight: 'auto', width: '500px' }}>Enter Investigator Details</h2>
          <div className="bg-gray-800 p-8 rounded-2xl" style={{ width: '500px', margin: '0 auto' }}> {/* Centered form container */}
            <form onSubmit={handleSubmit}>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">{success}</p>}
              {/* Username */}
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-white">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
              </div>

              {/* First Name */}
              <div className="mb-4">
                <label htmlFor="firstName" className="block mb-2 text-white">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label htmlFor="lastName" className="block mb-2 text-white">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-white">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
                />
              </div>

              {/* Save Details Button */}
              <div className="mt-8">
                <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInvestigators;
