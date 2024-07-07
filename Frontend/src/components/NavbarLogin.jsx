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
    <div className="text-white p-3 flex justify-between bg-[#18223b] shadow-md shadow-gray-700 shadow-xl shadow-slate-950/50">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="px-4 py-1 bg-[#18223b] text-white border border-gray-600 rounded-full hover:bg-[#131b2e] transition-colors duration-200 text-base"
      >
        Back
      </button>

      {/* Spacer for centering the login button on the opposite end */}
      <div></div>
      
    </div>
  );
};

export default NavbarLogin;
