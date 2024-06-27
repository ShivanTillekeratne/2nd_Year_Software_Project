import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Results = () => {
  const [validityChecks, setValidityChecks] = useState([]);
  const [filterVisibility, setFilterVisibility] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get_all_results');
        if (response.data) {
          setValidityChecks(response.data);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);

  const toggleFilters = (index) => {
    setFilterVisibility((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="flex h-screen bg-blue-700">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-slate-900 text-white">
          <h1 className="text-2xl font-semibold text-white mb-4">Validity Results</h1>
          {validityChecks.length > 0 ? (
            <div className="mt-4">
              {validityChecks
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((check, index) => (
                  <div key={index} className="mb-4 p-4 border-2 border-gray-200 rounded-md bg-gray-800">
                    <div className="flex justify-between items-center">
                      <p><strong>Check Timestamp:</strong> {new Date(check.timestamp).toLocaleString()}</p>
                      <button
                        onClick={() => toggleFilters(index)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
                      >
                        Show Filters
                      </button>
                    </div>
                    {filterVisibility[index] && (
                      <div className="mt-2 p-2 bg-gray-800 border border-gray-600 rounded-md">
                        <p><strong>Filters:</strong></p>
                        <pre>{JSON.stringify(check.filters, null, 2)}</pre>
                      </div>
                    )}
                    <div className="mt-4" style={{ height: '350px', overflowY: 'auto' }}>
                      {Array.isArray(check.results) ? (
                        check.results.map(result => (
                          <div key={result.claim_id} className="mb-4 p-4 border-2 border-gray-600 rounded-md">
                            <p><strong>Claim ID:</strong> {result.claim_id}</p>
                            <p><strong>Status:</strong> {result.status}</p>
                            {result.status === 'Invalid' && (
                              <div>
                                <strong>Reasons:</strong>
                                <ul className="list-disc list-inside">
                                  {result.reasons.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {result.is_fraud !== undefined && (
                              <p><strong>Is Fraud:</strong> {result.is_fraud !== null ? result.is_fraud.toString() : 'N/A'}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p>No results found for this check.</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p>No validity results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
