import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await axios.get('http://127.0.0.1:8000/api/token/verify/', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Token is invalid or server has been restarted', error);
          localStorage.removeItem('accessToken');
          setIsLoggedIn(false);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="text-white p-3 flex justify-between bg-[#18223b] shadow-md shadow-gray-700 shadow-xl shadow-slate-950/50">
      {showNotification && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 1000 }}>
          <div className="bg-gray-800 p-4 rounded shadow-lg relative" style={{ width: '50vw', height: '50vh' }}>
            <button
              className="absolute top-0 right-0 mt-2 mr-2 bg-transparent text-white hover:bg-gray-700 hover:text-white rounded flex items-center justify-center"
              style={{ width: '30px', height: '30px', lineHeight: '1' }}
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

      <div className="flex items-center">
        {isLoggedIn && (
          <>
            <button
              className="px-4 py-1 bg-[#18223b] text-white border border-gray-600 rounded-full hover:bg-[#131b2e] transition-colors duration-200 text-base"
              onClick={handleLogout}
            >
              Logout
            </button>

            <div className="shadow-md shadow-gray-950 hover:bg-[#131b2e] transition-colors duration-200 inline-flex items-center justify-center p-2 rounded-full cursor-pointer ml-4"
              onClick={toggleNotification}>
              <FontAwesomeIcon icon={faBell} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
