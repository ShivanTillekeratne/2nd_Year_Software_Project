import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

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

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotification(false);
    }
  };

  useEffect(() => {
    if (showNotification) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotification]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="text-white p-3 flex justify-between bg-[#18223b] shadow-md shadow-gray-700 shadow-xl shadow-slate-950/50">
      <div className="flex items-center">
        {/* Placeholder for other navbar content */}
      </div>

      <div className="flex items-center relative">
        {isLoggedIn && (
          <>
            <button
              className="px-4 py-1 bg-[#18223b] text-white border border-gray-600 rounded-full hover:bg-[#131b2e] transition-colors duration-200 text-base"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
