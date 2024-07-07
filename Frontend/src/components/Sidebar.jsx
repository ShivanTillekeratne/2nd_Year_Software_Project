import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import profilePic from '../resources/profile-pic.jpg';

const Sidebar = () => {
  const [activePage, setActivePage] = useState('');
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://127.0.0.1:8000/api/user/current_user/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const getButtonColor = (path) => {
    return path === activePage ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-transparent' : 'bg-slate-900';
  };
  

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Never';
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleString()
      : 'Invalid Date';
  };

  return (
    <div className="h-full w-52 text-white bg-[#131b2e] fixed left-0 top-0 bottom-0 flex flex-col shadow-xl shadow-slate-950/50 z-50">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-bold ml-4">MyApp</h1>
        </div>
        <Link to="/" className={`block py-3 px-3 mb-2 rounded transition-all duration-300 ${getButtonColor('/')}`}>
          Dashboard
        </Link>
        <Link to="/customerdata" className={`block py-3 px-3 mb-2 rounded transition-all duration-300 ${getButtonColor('/customerdata')}`}>
          Customer Data
        </Link>
        <Link to="/addinvestigators" className={`block py-3 px-3 mb-2 rounded transition-all duration-300 ${getButtonColor('/addinvestigators')}`}>
          Add Investigators
        </Link>
        <Link to="/results" className={`block py-3 px-3 mb-2 rounded transition-all duration-300 ${getButtonColor('/results')}`}>
          Results
        </Link>
        <Link to="/reports" className={`block py-3 px-3 mb-2 rounded transition-all duration-300 ${getButtonColor('/reports')}`}>
          Reports
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center mt-auto mb-2 p-2 bg-[#131b2e] rounded-t-lg">
        <img src={profilePic} alt="Profile" className="h-24 w-24 rounded-full mb-2 border-2 border-gray-700" />
        {userData ? (
          <>
            <p className="text-xl font-semibold">{userData.username}</p>
            <p className="text-xs text-gray-400">Last login: {formatDate(userData.last_login)}</p>
          </>
        ) : (
          <>
            <p className="text-xl font-semibold">Loading...</p>
            <p className="text-xs text-gray-400">Last login: Loading...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
