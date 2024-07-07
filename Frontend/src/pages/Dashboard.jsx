import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Select from 'react-select';
import { FaExchangeAlt } from 'react-icons/fa'; // Importing a different icon for override

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
  const [overriddenResults, setOverriddenResults] = useState({});
  const [validityChecked, setValidityChecked] = useState(false);
  const [reversedResults, setReversedResults] = useState({});
  const [expandedClaimId, setExpandedClaimId] = useState(null);
  const [explainabilityData, setExplainabilityData] = useState({});
  const validityRefs = useRef({});

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('dashboardState'));
    if (savedState) {
      setSearchTerm(savedState.searchTerm);
      setClaims(savedState.claims);
      setError(savedState.error);
      setShowFilters(savedState.showFilters);
      setClaimDateStart(savedState.claimDateStart);
      setClaimDateEnd(savedState.claimDateEnd);
      setSelectedClaimTypes(savedState.selectedClaimTypes);
      setMinAge(savedState.minAge);
      setMaxAge(savedState.maxAge);
      setSelectedGenders(savedState.selectedGenders);
      setServiceDateStart(savedState.serviceDateStart);
      setServiceDateEnd(savedState.serviceDateEnd);
      setMinBilledAmount(savedState.minBilledAmount);
      setMaxBilledAmount(savedState.maxBilledAmount);
      setMinAllowedAmount(savedState.minAllowedAmount);
      setMaxAllowedAmount(savedState.maxAllowedAmount);
      setMinPaidAmount(savedState.minPaidAmount);
      setMaxPaidAmount(savedState.maxPaidAmount);
      setSelectedPlanTypes(savedState.selectedPlanTypes);
      setValidityResults(savedState.validityResults);
      setValidityError(savedState.validityError);
      setOverriddenResults(savedState.overriddenResults);
      setValidityChecked(savedState.validityChecked);
      setReversedResults(savedState.reversedResults);
      setExpandedClaimId(savedState.expandedClaimId);
      setExplainabilityData(savedState.explainabilityData);
    }
  }, []);

  useEffect(() => {
    const state = {
      searchTerm,
      claims,
      error,
      showFilters,
      claimDateStart,
      claimDateEnd,
      selectedClaimTypes,
      minAge,
      maxAge,
      selectedGenders,
      serviceDateStart,
      serviceDateEnd,
      minBilledAmount,
      maxBilledAmount,
      minAllowedAmount,
      maxAllowedAmount,
      minPaidAmount,
      maxPaidAmount,
      selectedPlanTypes,
      validityResults,
      validityError,
      overriddenResults,
      validityChecked,
      reversedResults,
      expandedClaimId,
      explainabilityData
    };
    localStorage.setItem('dashboardState', JSON.stringify(state));
  }, [
    searchTerm,
    claims,
    error,
    showFilters,
    claimDateStart,
    claimDateEnd,
    selectedClaimTypes,
    minAge,
    maxAge,
    selectedGenders,
    serviceDateStart,
    serviceDateEnd,
    minBilledAmount,
    maxBilledAmount,
    minAllowedAmount,
    maxAllowedAmount,
    minPaidAmount,
    maxPaidAmount,
    selectedPlanTypes,
    validityResults,
    validityError,
    overriddenResults,
    validityChecked,
    reversedResults,
    expandedClaimId,
    explainabilityData
  ]);

  const toggleExpandClaim = async (claimId) => {
    setExpandedClaimId(expandedClaimId === claimId ? null : claimId);

    if (!explainabilityData[claimId]) {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/explain/${claimId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setExplainabilityData(prevState => ({
                ...prevState,
                [claimId]: response.data
            }));
        } catch (err) {
            console.error('Error fetching explainability data:', err);
        }
    }
  };

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
          claim_date_start: claimDateStart ? new Date(claimDateStart).toISOString() : undefined,
          claim_date_end: claimDateEnd ? new Date(claimDateEnd).toISOString() : undefined,
          claim_type: claimTypeParams.length ? claimTypeParams : undefined,
          min_age: minAge,
          max_age: maxAge,
          gender: genderParams.length ? genderParams : undefined,
          service_date_start: serviceDateStart ? new Date(serviceDateStart).toISOString() : undefined,
          service_date_end: serviceDateEnd ? new Date(serviceDateEnd).toISOString() : undefined,
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
      setValidityChecked(false); // Reset validity checked state
      setValidityResults([]); // Reset validity results
      setExplainabilityData({}); // Reset explainability data
      setExpandedClaimId(null); // Reset expanded claim
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
      setError('No claims to check validity.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const claimIds = claims.map(claim => claim.claim_id);

      const params = new URLSearchParams();
      claimIds.forEach(id => params.append('claim_ids', id));

      const response = await axios.get(`http://127.0.0.1:8000/api/check_claim_validity/?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const newValidityResults = response.data.results;
      setValidityResults(newValidityResults);
      setValidityChecked(true);
      setError('');
    } catch (err) {
      console.error('Error checking claim validity:', err);
      setError('Error checking claim validity.');
    }
  };

  const handleOverrideResult = (claimId) => {
    setOverriddenResults((prevState) => ({
      ...prevState,
      [claimId]: !prevState[claimId]
    }));
  };

  const handleFinalizeResults = async () => {
    const finalResults = validityResults.map(result => ({
      ...result,
      is_reversed: overriddenResults[result.claim_id] !== undefined ? overriddenResults[result.claim_id] : false
    }));

    // Call the backend API to save the final results
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://127.0.0.1:8000/api/save_final_results/', finalResults, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Reset state
      setValidityResults([]);
      setOverriddenResults({});
      setValidityChecked(false);
    } catch (err) {
      console.error('Error finalizing results:', err);
    }
  };

  const scrollToValidityResult = (claimId) => {
    const element = validityRefs.current[claimId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleRowClick = (e, claimId) => {
    if (e.target.closest('.reverse-column')) {
      // Do nothing if the click is within the Reverse column
      return;
    }
    scrollToValidityResult(claimId);
  };

  const handleReset = () => {
    setSearchTerm('');
    setClaims([]);
    setError('');
    setShowFilters(false);
    setClaimDateStart('');
    setClaimDateEnd('');
    setSelectedClaimTypes([]);
    setMinAge('');
    setMaxAge('');
    setSelectedGenders([]);
    setServiceDateStart('');
    setServiceDateEnd('');
    setMinBilledAmount('');
    setMaxBilledAmount('');
    setMinAllowedAmount('');
    setMaxAllowedAmount('');
    setMinPaidAmount('');
    setMaxPaidAmount('');
    setSelectedPlanTypes([]);
    setValidityResults([]);
    setValidityError('');
    setOverriddenResults({});
    setValidityChecked(false);
    setReversedResults({});
    setExpandedClaimId(null);
    setExplainabilityData({});
    localStorage.removeItem('dashboardState');
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-slate-900">
          <h1 className="text-2xl font-semibold text-white mb-4">Dashboard Overview</h1>
          <div className="mb-4 flex flex-col" style={{ width: '65%' }}>
            <div className="flex gap-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Claim ID"
                  className="px-4 py-2 w-full bg-gray-800 text-white border border-gray-700 rounded-l-md focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 bg-blue-700 text-white rounded-r-md hover:bg-blue-800 transition-colors duration-300"
                >
                  Search
                </button>
              </form>
              <button
                onClick={toggleFilters}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
              >
                Filter
              </button>
              <button
                onClick={handleReset}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Reset
            </button>
              <button
                onClick={handleCheckValidity}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                Check Validity
              </button>
              <button
                onClick={handleFinalizeResults}
                className={`py-2 px-4 rounded ${validityChecked ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-500 text-gray-400 cursor-not-allowed'}`}
                disabled={!validityChecked}
              >
                Finalize Results
            </button>
            </div>
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-800 border border-gray-600 rounded-md">
                <div className="flex flex-wrap gap-4">
                  <div className="w-full md:w-1/5">
                    <label className="block text-white mb-2">Claim Date Start</label>
                    <input
                      type="date"
                      value={claimDateStart}
                      onChange={(e) => setClaimDateStart(e.target.value)}
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <label className="block text-white mb-2">Claim Date End</label>
                    <input
                      type="date"
                      value={claimDateEnd}
                      onChange={(e) => setClaimDateEnd(e.target.value)}
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <label className="block text-white mb-2">Service Date Start</label>
                    <input
                      type="date"
                      value={serviceDateStart}
                      onChange={(e) => setServiceDateStart(e.target.value)}
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <label className="block text-white mb-2">Service Date End</label>
                    <input
                      type="date"
                      value={serviceDateEnd}
                      onChange={(e) => setServiceDateEnd(e.target.value)}
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <input
                      type="number"
                      value={minAge}
                      onChange={(e) => setMinAge(e.target.value)}
                      placeholder="Min Age"
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <input
                      type="number"
                      value={maxAge}
                      onChange={(e) => setMaxAge(e.target.value)}
                      placeholder="Max Age"
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <input
                      type="number"
                      value={minBilledAmount}
                      onChange={(e) => setMinBilledAmount(e.target.value)}
                      placeholder="Min Billed Amount"
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <input
                      type="number"
                      value={maxBilledAmount}
                      onChange={(e) => setMaxBilledAmount(e.target.value)}
                      placeholder="Max Billed Amount"
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <input
                      type="number"
                      value={minAllowedAmount}
                      onChange={(e) => setMinAllowedAmount(e.target.value)}
                      placeholder="Min Allowed Amount"
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <input
                      type="number"
                      value={maxAllowedAmount}
                      onChange={(e) => setMaxAllowedAmount(e.target.value)}
                      placeholder="Max Allowed Amount"
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <input
                      type="number"
                      value={minPaidAmount}
                      onChange={(e) => setMinPaidAmount(e.target.value)}
                      placeholder="Min Paid Amount"
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <input
                      type="number"
                      value={maxPaidAmount}
                      onChange={(e) => setMaxPaidAmount(e.target.value)}
                      placeholder="Max Paid Amount"
                      className="px-4 py-2 w-full bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <Select
                      isMulti
                      options={claimTypeOptions}
                      value={selectedClaimTypes}
                      onChange={setSelectedClaimTypes}
                      placeholder="Claim Type"
                      className="w-full text-black"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <Select
                      isMulti
                      options={genderOptions}
                      value={selectedGenders}
                      onChange={setSelectedGenders}
                      placeholder="Gender"
                      className="w-full text-black"
                    />
                  </div>
                  <div className="w-full md:w-1/5">
                    <Select
                      isMulti
                      options={planTypeOptions}
                      value={selectedPlanTypes}
                      onChange={setSelectedPlanTypes}
                      placeholder="Plan Type"
                      className="w-full text-black"
                    />
                  </div>
                </div>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            {claims.length > 0 && (
              <div className="mt-4">
                <p className="text-white">Total Results: {claims.length}</p>
              </div>
            )}
          </div>
          <div className="relative flex flex-col bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4" style={{ width: '90%', height: '50vh', overflowY: 'auto' }}>
            {claims.length > 0 ? (
              <table className="w-full bg-gray-800 text-white">
                <thead>
                  <tr>
                    {validityChecked && (
                      <>
                        <th className="py-2 px-4 border-b border-r border-gray-600 reverse-column">Reverse</th>
                        <th className="py-2 px-4 border-b border-r border-gray-600">Probability</th>
                      </>
                    )}
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Claim ID</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Claim Date</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Claim Type</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Claimant ID</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Date of Birth</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Age</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Gender</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Provider ID</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Provider Name</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Service Date</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Service Code</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Billed Amount</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Allowed Amount</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Paid Amount</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Primary Diagnosis Code</th>
                    <th className="py-2 px-4 border-b border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Plan Type</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => {
                    let rowColor = '';
                    let glowColor = '';
                    let probability = 'N/A';

                    if (validityResults.length > 0) {
                      const result = validityResults.find(res => res.claim_id === claim.claim_id);
                      if (result) {
                        const isValid = result.status === 'Valid' && !result.is_fraud;
                        rowColor = isValid ? 'bg-green-200' : 'bg-red-200';
                        glowColor = isValid ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
                        probability = result.probability !== null ? result.probability.toFixed(2) : 'N/A';
                      }
                    }

                    return (
                      <tr
                        key={claim.claim_id}
                        className={`py-2 px-4 border-b border-gray-600 ${rowColor}`}
                        style={validityResults.length > 0 ? {
                          boxShadow: `0 0 15px 2px ${glowColor}`,
                          background: `linear-gradient(90deg, ${glowColor} 70%, transparent 50%, ${glowColor} 70%)`,
                        } : {}}
                        onClick={(e) => handleRowClick(e, claim.claim_id)}
                      >
                        {validityChecked && (
                          <>
                            <td className="py-2 px-4 border-b border-r border-gray-600 text-center reverse-column">
                              <button onClick={() => handleOverrideResult(claim.claim_id)}>
                                <FaExchangeAlt className={`text-${overriddenResults[claim.claim_id] ? 'green' : 'red'}-500`} />
                              </button>
                            </td>
                            <td className="py-2 px-4 border-b border-r border-gray-600 text-center">
                              {probability}
                            </td>
                          </>
                        )}
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.claim_id}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{new Date(claim.claim_date).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.claim_type}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.claimant_id}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{new Date(claim.date_of_birth).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.age}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.gender}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.provider_id}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.provider_name}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{new Date(claim.service_date).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.service_code}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">${claim.billed_amount?.toFixed(2)}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">${claim.allowed_amount?.toFixed(2)}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">${claim.paid_amount?.toFixed(2)}</td>
                        <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.primary_diagnosis_code}</td>
                        <td className="py-2 px-4 border-b border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{claim.plan_type}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-white">No claims found</p>
            )}
          </div>
          <div className="relative flex flex-col bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4" style={{ width: '90%', height: '50vh', overflowY: 'auto' }}>
            {validityChecked && validityResults.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-white mb-4">Validity Results</h2>
                {validityResults.map(result => (
                  <div
                    key={result.claim_id}
                    ref={el => validityRefs.current[result.claim_id] = el}
                    className="mb-4 p-4 border border-gray-600 rounded-lg text-white"
                  >
                    <div onClick={() => toggleExpandClaim(result.claim_id)} className="cursor-pointer">
                      <p><strong>Claim ID:</strong> {result.claim_id}</p>
                      <p><strong>Claimant ID:</strong> {result.claimant_id}</p>
                      <p><strong>Provider ID:</strong> {result.provider_id}</p>
                      <p><strong>Status:</strong> {result.status}</p>
                      {result.status === 'Invalid' && (
                        <div>
                          <strong>Reasons:</strong>
                          <ul className="list-disc list-inside text-white">
                            {result.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p><strong>Fraud Probability:</strong> {result.probability !== null ? result.probability.toFixed(2) : 'N/A'}</p>
                      {result.is_fraud !== null && (
                        <p><strong>Is Fraud:</strong> {result.is_fraud.toString()}</p>
                      )}
                      {overriddenResults[result.claim_id] && (
                        <p><strong>Reversed:</strong> Yes</p>
                      )}
                    </div>
                    {expandedClaimId === result.claim_id && explainabilityData[result.claim_id] && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-white">Explainability Details</h3>
                        <p><strong>Expected Value:</strong> {explainabilityData[result.claim_id].expected_value.toFixed(2)}</p>
                        <h4 className="text-md font-semibold text-white">SHAP Values:</h4>
                        <ul className="list-disc list-inside text-white">
                          {explainabilityData[result.claim_id].shap_values.map((value, index) => (
                            <li key={index}>
                              <strong>{explainabilityData[result.claim_id].features[index]}:</strong> {value.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
