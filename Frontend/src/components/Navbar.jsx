// src/components/Navbar.js

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <div class="bg-slate-300 text-white p-4 flex justify-between">
      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-300 p-16 rounded shadow-lg">
            {/* Notification content goes here */}
            <button className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded" onClick={toggleNotification}>Close</button>
          </div>
        </div>
      )}

      {/* Other navbar content goes here */}
      <div className="flex items-center">
        {/* Other navbar content goes here */}
      </div>

      {/* Notification icon */}
      <div className="shadow-md shadow-slate-400 hover:bg-slate-400 inline-flex items-center justify-center p-2 rounded-full cursor-pointer" onClick={toggleNotification}>
        <FontAwesomeIcon icon={faBell} />
      </div>


    </div>
  );
};

export default Navbar;
