import React, { useState } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/NavbarLogin'; // Adjust the import path as needed
import Footer from '../components/Footer'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/register/', {
        username,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      console.log('Registration successful', response.data);
      navigate('/login'); // Redirect to the login page after successful registration
    } catch (error) {
      setError('Registration failed. Please check your inputs.');
      console.error('There was an error registering!', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <NavbarLogin />
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl" style={{ width: '400px' }}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 text-white">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="firstName" className="block mb-2 text-white">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="lastName" className="block mb-2 text-white">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-white">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex justify-between items-center">
            <a href="/login" className="text-sm text-blue-500 hover:text-blue-600">Have an account? Login</a>
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg">
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
