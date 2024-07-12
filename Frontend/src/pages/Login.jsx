import React, { useState } from 'react';
import axios from 'axios';
import NavbarLogin from '../components/NavbarLogin'; // Adjust the import path as needed
// import Footer from '../components/Footer'; // Ensure the path is correct
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from react-router-dom

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });
      // Assuming you get the access token in the response
      const { access } = response.data;
      localStorage.setItem('accessToken', access); // Store the token in local storage
      console.log('Login successful', response.data);
      navigate('/'); // Redirect to the root URL after login
    } catch (error) {
      setError('Login failed. Please check your username and password.');
      console.error('There was an error logging in!', error);
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
            <Link to="/register" className="text-sm text-blue-500 hover:text-blue-600">Register</Link>
            <a href="#forgot-password" className="text-sm text-blue-500 hover:text-blue-600">Forgot password?</a>
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors duration-300">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
