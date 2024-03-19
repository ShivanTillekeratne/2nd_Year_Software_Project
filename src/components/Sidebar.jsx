import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../resources/logo.png';
import profilePic from '../resources/profile-pic.jpg';

const Sidebar = () => {
  const [activePage, setActivePage] = useState('');
  const location = useLocation();

  // Set the active page based on the current location
  React.useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  // Function to determine the button color based on active page
  const getButtonColor = (path) => {
    return path === activePage ? 'bg-blue-950' : 'bg-blue-900';
  };

  return (
    <div className="h-full w-52 bg-blue-900 text-white fixed left-0 top-0 bottom-0 flex flex-col shadow-md shadow-blue-950">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-bold ml-4">Medical Claims Fraud Detection</h1>
          {/* <img src={logo} alt="Logo" className="h-8 w-8 mr-2 ml-3.5" /> */}
        </div>
        <Link to="/" className={`block py-4 px-4 mb-2 rounded hover:bg-blue-950 hover:border-blue-600 ${getButtonColor('/')}`}>
          Dashboard
        </Link>
        <Link to="/anomalies" className={`block py-4 px-4 mb-2 rounded hover:bg-blue-950 hover:border-blue-600 ${getButtonColor('/anomalies')}`}>
          Anomalies
        </Link>
        <Link to="/reports" className={`block py-4 px-4 mb-2 rounded hover:bg-blue-950 hover:border-blue-600 ${getButtonColor('/reports')}`}>
          Reports
        </Link>
      </div>
      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center mt-auto p-4">
        <img src={profilePic} alt="Profile" className="h-24 w-24 rounded-full mb-2" />
        <p className="text-xl font-semibold">John Doe</p>
        <p className="text-xs text-gray-400">Last login: 2024-02-12</p>
      </div>
    </div>
  );
};

export default Sidebar;
