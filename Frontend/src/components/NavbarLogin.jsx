// src/components/NavbarLogin.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const NavbarLogin = () => {
  const navigate = useNavigate(); // Create navigate function using useNavigate hook

  // Function to navigate to the last page
  const handleBack = () => {
    navigate(-1); // Use navigate function to go back
  };

  return (
    <div className="bg-slate-300 text-white p-4 flex justify-between items-center w-full">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="px-6 py-2 bg-slate-300 text-white border border-slate-400 rounded-full hover:bg-slate-400 transition-colors duration-300 text-base"
      >
        Back
      </button>

      {/* Spacer for centering the login button on the opposite end */}
      <div></div>
      
    </div>
  );
};

export default NavbarLogin;
