// src/components/Navbar.js

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate(); // Create navigate function using useNavigate hook

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  // Navigate to the login page
  const handleLogin = () => {
    navigate('/login'); // Use navigate function with the path to the login page
  };

  // Navigate to the registration page
  const handleRegister = () => {
    navigate('/register'); // Use navigate function with the path to the registration page
  };

  return (
    <div className="bg-slate-300 text-white p-4 flex justify-between">
      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-50" style={{zIndex: 1000}}>
          <div className="bg-slate-300 p-4 rounded shadow-lg relative" style={{width: '50vw', height: '50vh'}}>
            {/* Close button */}
            <button
              className="absolute top-0 right-0 mt-2 mr-2 bg-transparent text-black hover:bg-gray-700 hover:text-white rounded flex items-center justify-center"
              style={{width: '30px', height: '30px', lineHeight: '1'}}
              onClick={toggleNotification}
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center">
        {/* Placeholder for other navbar content */}
      </div>

      {/* Login, Register, and Notification buttons */}
      <div className="flex items-center">
        {/* Register Button */}
        <button
          className="px-6 py-2 bg-slate-300 text-white border border-slate-400 rounded-full hover:bg-slate-400 transition-colors duration-300 text-base"
          onClick={handleRegister} // Use handleRegister for onClick
        >
          Register
        </button>

        {/* Login Button */}
        <button
          className="px-6 py-2 bg-slate-300 text-white border border-slate-400 rounded-full hover:bg-slate-400 transition-colors duration-300 text-base ml-4"
          onClick={handleLogin} // Use handleLogin for onClick
        >
          Login
        </button>

        {/* Notification icon/button */}
        <div className="shadow-md shadow-slate-400 hover:bg-slate-400 inline-flex items-center justify-center p-2 rounded-full cursor-pointer ml-4"
          onClick={toggleNotification}>
          <FontAwesomeIcon icon={faBell} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
