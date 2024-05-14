// src/pages/Registration.jsx

import React, { useState } from 'react';
import NavbarLogin from '../components/NavbarLogin'; // Adjust the import path as needed
import Footer from '../components/Footer'; // Ensure the path is correct

const Register = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { username, firstName, lastName, password });
    // Implement your registration logic here
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
            <label htmlFor="firstName" className="block mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="lastName" className="block mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            />
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
            <a href="/login" className="text-sm text-blue-500 hover:text-blue-700">Have an account? Login</a>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Register
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
