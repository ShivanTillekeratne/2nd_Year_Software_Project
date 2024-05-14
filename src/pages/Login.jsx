// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import NavbarLogin from '../components/NavbarLogin'; // Adjust the import path as needed
import Footer from '../components/Footer'; // Ensure the path is correct
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('admin'); // Default to 'admin'
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { username, role, password });
    // Implement your login logic here
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <NavbarLogin />
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-slate-300 p-8 rounded-2xl" style={{ width: '400px' }}>
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="role" className="block mb-2">Select role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            >
              <option value="admin">Admin</option>
              <option value="investigator">Investigator</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <Link to="/register" className="text-sm text-blue-500 hover:text-blue-700">Register</Link>
            <a href="#forgot-password" className="text-sm text-blue-500 hover:text-blue-700">Forgot password?</a>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Login
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
