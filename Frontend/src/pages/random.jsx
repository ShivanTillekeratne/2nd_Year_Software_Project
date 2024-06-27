import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import Select from 'react-select';

const claimTypeOptions = [
  { value: 'Medical', label: 'Medical' },
  { value: 'Dental', label: 'Dental' },
  { value: 'Vision', label: 'Vision' },
  { value: 'Pharmacy', label: 'Pharmacy' },
  { value: 'Behavioral Health', label: 'Behavioral Health' },
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const planTypeOptions = [
  { value: 'HMO', label: 'HMO' },
  { value: 'PPO', label: 'PPO' },
  { value: 'EPO', label: 'EPO' },
  { value: 'POS', label: 'POS' },
  { value: 'HDHP', label: 'HDHP' },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [claimDateStart, setClaimDateStart] = useState('');
  const [claimDateEnd, setClaimDateEnd] = useState('');
  const [selectedClaimTypes, setSelectedClaimTypes] = useState([]);
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [serviceDateStart, setServiceDateStart] = useState('');
  const [serviceDateEnd, setServiceDateEnd] = useState('');
  const [minBilledAmount, setMinBilledAmount] = useState('');
  const [maxBilledAmount, setMaxBilledAmount] = useState('');
  const [minAllowedAmount, setMinAllowedAmount] = useState('');
  const [maxAllowedAmount, setMaxAllowedAmount] = useState('');
  const [minPaidAmount, setMinPaidAmount] = useState('');
  const [maxPaidAmount, setMaxPaidAmount] = useState('');
  const [selectedPlanTypes, setSelectedPlanTypes] = useState([]);
  const [validityResults, setValidityResults] = useState([]);
  const [validityError, setValidityError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const claimTypeParams = selectedClaimTypes.map(ct => ct.value);
      const genderParams = selectedGenders.map(g => g.value);
      const planTypeParams = selectedPlanTypes.map(pt => pt.value);

      const response = await axios.get('http://127.0.0.1:8000/api/claims_claimid/', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          claim_id: searchTerm,
          claim_date_start: claimDateStart,
          claim_date_end: claimDateEnd,
          claim_type: claimTypeParams.length ? claimTypeParams : undefined,
          min_age: minAge,
          max_age: maxAge,
          gender: genderParams.length ? genderParams : undefined,
          service_date_start: serviceDateStart,
          service_date_end: serviceDateEnd,
          min_billed_amount: minBilledAmount,
          max_billed_amount: maxBilledAmount,
          min_allowed_amount: minAllowedAmount,
          max_allowed_amount: maxAllowedAmount,
          min_paid_amount: minPaidAmount,
          max_paid_amount: maxPaidAmount,
          plan_type: planTypeParams.length ? planTypeParams : undefined,
        },
        paramsSerializer: params => {
          return Object.entries(params)
            .filter(([key, value]) => value !== undefined && value !== '')
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map(val => `${key}=${encodeURIComponent(val)}`).join('&');
              }
              return `${key}=${encodeURIComponent(value)}`;
            })
            .join('&');
        }
      });
      setClaims(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError('Error fetching claims. Please check the filters.');
      setClaims([]);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCheckValidity = async () => {
    if (!claims.length) {
      setValidityError('No claims to check validity.');
      return;
    }
  
    try {
      const token = localStorage.getItem('accessToken');
      const claimIds = claims.map(claim => claim.claim_id);
  
      // Construct the query parameters correctly
      const params = new URLSearchParams();
      claimIds.forEach(id => params.append('claim_ids', id));
  
      const response = await axios.get(`http://127.0.0.1:8000/api/check_claim_validity/?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setValidityResults(response.data);
      setValidityError('');
    } catch (err) {
      console.error('Error checking claim validity:', err);
      setValidityError('Error checking claim validity.');
    }
  };

  return (
    <div className="flex h-screen bg-blue-700">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-white">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard Overview</h1>
          <div className="mb-4 flex flex-col">
            <div className="flex gap-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Claim ID"
                  className="px-4 py-2 w-full border-2 border-gray-200 rounded-l-md focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                  Search
                </button>
              </form>
              <button
                onClick={toggleFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Filter
              </button>
              <button
                onClick={handleCheckValidity}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Check Validity
              </button>
            </div>
            {showFilters && (
              <div className="mt-4 p-4 border-2 border-gray-200 rounded-md">
                <div className="flex flex-wrap gap-4">
                  <div className="w-full md:w-1/4">
                    <label className="block text-gray-700 mb-2">Claim Date Start</label>
                    <input
                      type="date"
                      value={claimDateStart}
                      onChange={(e) => setClaimDateStart(e.target.value)}
                      className="px-4 py-2 w-full border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="block text-gray-700 mb-2">Claim Date End</label>
                    <input
                      type="date"
                      value={claimDateEnd}
                      onChange={(e) => setClaimDateEnd(e.target.value)}
                      className="px-4 py-2 w-full border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <Select
                    isMulti
                    options={claimTypeOptions}
                    value={selectedClaimTypes}
                    onChange={setSelectedClaimTypes}
                    placeholder="Claim Type"
                    className="w-full md:w-1/4"
                  />
                  <div className="w-full md:w-1/4">
                    <label className="block text-gray-700 mb-2">Service Date Start</label>
                    <input
                      type="date"
                      value={serviceDateStart}
                      onChange={(e) => setServiceDateStart(e.target.value)}
                      className="px-4 py-2 w-full border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="block text-gray-700 mb-2">Service Date End</label>
                    <input
                      type="date"
                      value={serviceDateEnd}
                      onChange={(e) => setServiceDateEnd(e.target.value)}
                      className="px-4 py-2 w-full border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <input
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    placeholder="Min Age"
                    className="px-4 py-2 w-full md:w-1/4 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    placeholder="Max Age"
                    className="px-4 py-2 w-full md:w-1/4 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <Select
                    isMulti
                    options={genderOptions}
                    value={selectedGenders}
                    onChange={setSelectedGenders}
                    placeholder="Gender"
                    className="w-full md:w-1/4"
                  />
                  <input
                    type="number"
                    value={minBilledAmount}
                    onChange={(e) => setMinBilledAmount(e.target.value)}
                    placeholder="Min Billed Amount"
                    className="px-4 py-2 w-full md:w-1/4 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxBilledAmount}
                    onChange={(e) => setMaxBilledAmount(e.target.value)}
                    placeholder="Max Billed Amount"
                    className="px-4 py-2 w-full md:w-1/4 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={minAllowedAmount}
                    onChange={(e) => setMinAllowedAmount(e.target.value)}
                    placeholder="Min Allowed Amount"
                    className="px-4 py-2 w-full md:w-1/4 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxAllowedAmount}
                    onChange={(e) => setMaxAllowedAmount(e.target.value)}
                    placeholder="Max Allowed Amount"
                    className="px-4 py-2 w-full md:w-1/4 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={minPaidAmount}
                    onChange={(e) => setMinPaidAmount(e.target.value)}
                    placeholder="Min Paid Amount"
                    className="px-4 py-2 w-full md:w-1/4 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxPaidAmount}
                    onChange={(e) => setMaxPaidAmount(e.target.value)}
                    placeholder="Max Paid Amount"
                    className="px-4 py-2 w-full md:w-1/4 border-2 border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <Select
                    isMulti
                    options={planTypeOptions}
                    value={selectedPlanTypes}
                    onChange={setSelectedPlanTypes}
                    placeholder="Plan Type"
                    className="w-full md:w-1/4"
                  />
                </div>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {claims.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-700">Total Results: {claims.length}</p>
              </div>
            )}
          </div>
          <div className="relative flex flex-col bg-blue-50 border border-gray-200 rounded-lg p-4 mb-4" style={{ width: '90%', height: '50vh', overflowY: 'auto', padding: '12px' }}>
            {claims.length > 0 ? (
              <table className="w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Claim ID</th>
                    <th className="py-2 px-4 border-b">Claim Date</th>
                    <th className="py-2 px-4 border-b">Claim Type</th>
                    <th className="py-2 px-4 border-b">Claimant ID</th>
                    <th className="py-2 px-4 border-b">Date of Birth</th>
                    <th className="py-2 px-4 border-b">Age</th>
                    <th className="py-2 px-4 border-b">Gender</th>
                    <th className="py-2 px-4 border-b">Provider ID</th>
                    <th className="py-2 px-4 border-b">Provider Name</th>
                    <th className="py-2 px-4 border-b">Service Date</th>
                    <th className="py-2 px-4 border-b">Service Code</th>
                    <th className="py-2 px-4 border-b">Billed Amount</th>
                    <th className="py-2 px-4 border-b">Allowed Amount</th>
                    <th className="py-2 px-4 border-b">Paid Amount</th>
                    <th className="py-2 px-4 border-b">Primary Diagnosis Code</th>
                    <th className="py-2 px-4 border-b">Plan Type</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.claim_id}>
                      <td className="py-2 px-4 border-b">{claim.claim_id}</td>
                      <td className="py-2 px-4 border-b">{new Date(claim.claim_date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{claim.claim_type}</td>
                      <td className="py-2 px-4 border-b">{claim.claimant_id}</td>
                      <td className="py-2 px-4 border-b">{new Date(claim.date_of_birth).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{claim.age}</td>
                      <td className="py-2 px-4 border-b">{claim.gender}</td>
                      <td className="py-2 px-4 border-b">{claim.provider_id}</td>
                      <td className="py-2 px-4 border-b">{claim.provider_name}</td>
                      <td className="py-2 px-4 border-b">{new Date(claim.service_date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{claim.service_code}</td>
                      <td className="py-2 px-4 border-b">${claim.billed_amount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">${claim.allowed_amount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">${claim.paid_amount.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">{claim.primary_diagnosis_code}</td>
                      <td className="py-2 px-4 border-b">{claim.plan_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No claims found</p>
            )}
          </div>
          <div className="relative flex flex-col bg-blue-50 border border-gray-200 rounded-lg p-4 mb-4" style={{ width: '90%', height: '50vh', overflowY: 'auto', padding: '12px' }}>
            {validityResults.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Validity Results</h2>
                {validityResults.map(result => (
                  <div key={result.claim_id} className="mb-4 p-4 border-2 border-gray-200 rounded-md">
                    <p><strong>Claim ID:</strong> {result.claim_id}</p>
                    <p><strong>Claimant ID:</strong> {result.claimant_id}</p>
                    <p><strong>Provider ID:</strong> {result.provider_id}</p>
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
                    {result.is_fraud !== null && (
                      <p><strong>Is Fraud:</strong> {result.is_fraud.toString()}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {validityError && <p className="text-red-500">{validityError}</p>}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
