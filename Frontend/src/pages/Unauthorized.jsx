import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl" style={{ width: '400px' }}>
          <h1 className="text-white text-3xl mb-6">Unauthorized</h1>
          <p className="text-gray-400 mb-6">You do not have permission to view this page.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
