import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Results = () => {
  const [latestResults, setLatestResults] = useState([]);

  useEffect(() => {
    const fetchLatestResults = async () => {
      try {
        const token = localStorage.getItem('accessToken');  // Get the token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/get_latest_result/', {
          headers: {
            Authorization: `Bearer ${token}`  // Include the authorization header
          }
        });
        if (response.data) {
          setLatestResults(response.data);
        }
      } catch (error) {
        console.error('Error fetching the latest results:', error);
      }
    };

    fetchLatestResults();
  }, []);

  const renderClaimDetails = (claim) => (
    <div key={claim.claim_id} className="mb-4 p-4 border border-gray-600 rounded-lg rounded-md">
      <p><strong>Claim ID:</strong> {claim.claim_id}</p>
      <p><strong>Claimant ID:</strong> {claim.claimant_id}</p>
      <p><strong>Provider ID:</strong> {claim.provider_id}</p>
      <p><strong>Status:</strong> {claim.status}</p>
      {claim.status === 'Invalid' && claim.reasons.length > 0 && (
        <div>
          <strong>Reasons:</strong>
          <ul className="list-disc list-inside">
            {claim.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
      <p><strong>Is Fraud:</strong> {claim.is_fraud !== null ? claim.is_fraud.toString() : 'N/A'}</p>
      <p><strong>Probability:</strong> {claim.probability !== null ? claim.probability : 'N/A'}</p>
      <p><strong>Is Reversed:</strong> {claim.is_reversed.toString()}</p>
    </div>
  );

  const renderResult = (result) => (
    <div key={result._id} className="mb-4 p-2 rounded-md">
      <div className="mt-4" style={{ height: '450px', overflowY: 'auto', width: '99%'}}>
        {Array.isArray(result.results) ? (
          result.results.map((claim) => renderClaimDetails(claim))
        ) : (
          <p>No results found for this check.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-blue-700">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-slate-900 text-white">
          <h1 className="text-2xl font-semibold text-white mb-4">Validity Results</h1>
          {latestResults.length > 0 ? (
            <div className="mt-4"  style={{ width: '98%', overflowY: 'auto' }}>
              <div className="mb-4 p-4 border border-gray-600 rounded-lg bg-gray-800">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-xl font-semibold text-white">Latest Result</h2>
                  <div className="text-right">
                    <p className="text-sm"><strong>Check Timestamp:</strong> {new Date(latestResults[0].timestamp).toLocaleString()}</p>
                    <p className="text-sm"><strong>Number of Claims:</strong> {latestResults[0].results.length}</p>
                  </div>
                </div>
                {renderResult(latestResults[0])}
              </div>
              <div className="mb-4 p-4 border border-gray-600 rounded-lg bg-gray-800">
                <Carousel showThumbs={false} showStatus={false} infiniteLoop useKeyboardArrows>
                  {latestResults.slice(1).map((result) => (
                    <div key={result._id} className="text-left">
                      <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-semibold text-white">Previous Result</h2>
                        <div className="text-right">
                          <p className="text-sm"><strong>Check Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
                          <p className="text-sm"><strong>Number of Claims:</strong> {result.results.length}</p>
                        </div>
                      </div>
                      {renderResult(result)}
                    </div>
                  ))}
                </Carousel>
              </div>
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
