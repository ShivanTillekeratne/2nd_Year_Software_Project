import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Select from 'react-select';

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

const CustomerData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedMaritalStatuses, setSelectedMaritalStatuses] = useState([]);
  const [minChildren, setMinChildren] = useState('');
  const [maxChildren, setMaxChildren] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const genderParams = selectedGenders.map(g => g.value);
      const maritalStatusParams = selectedMaritalStatuses.map(ms => ms.value);

      const response = await axios.get('http://127.0.0.1:8000/api/claims_claimantid/', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          claimant_id: searchTerm,
          gender: genderParams.length ? genderParams : undefined,
          marital_status: maritalStatusParams.length ? maritalStatusParams : undefined,
          min_children: minChildren,
          max_children: maxChildren,
          min_height: minHeight,
          max_height: maxHeight,
          min_weight: minWeight,
          max_weight: maxWeight,
          min_age: minAge,
          max_age: maxAge
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
      setCustomers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Error fetching customer data. Please check the filters.');
      setCustomers([]);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedGenders([]);
    setSelectedMaritalStatuses([]);
    setMinChildren('');
    setMaxChildren('');
    setMinHeight('');
    setMaxHeight('');
    setMinWeight('');
    setMaxWeight('');
    setMinAge('');
    setMaxAge('');
    setCustomers([]);
    setError('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-slate-900">
          <h1 className="text-2xl font-semibold text-white mb-4">Customer Data</h1>
          <div className="mb-4 flex flex-col" style={{ width: '50%' }}>
            <div className="flex gap-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Claimant ID"
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
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Reset
              </button>
            </div>
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-800 border border-gray-600 rounded-md">
                <div className="flex flex-wrap gap-4">
                  <Select
                    isMulti
                    options={genderOptions}
                    value={selectedGenders}
                    onChange={setSelectedGenders}
                    placeholder="Gender"
                    className="w-full md:w-1/4 text-black"
                  />
                  <Select
                    isMulti
                    options={maritalStatusOptions}
                    value={selectedMaritalStatuses}
                    onChange={setSelectedMaritalStatuses}
                    placeholder="Marital Status"
                    className="w-full md:w-1/4 text-black"
                  />
                  <input
                    type="number"
                    value={minChildren}
                    onChange={(e) => setMinChildren(e.target.value)}
                    placeholder="Min Children"
                    className="px-4 py-2 w-full md:w-1/4 bg-gray-700 text-white border border-gray-700 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxChildren}
                    onChange={(e) => setMaxChildren(e.target.value)}
                    placeholder="Max Children"
                    className="px-4 py-2 w-full md:w-1/4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={minHeight}
                    onChange={(e) => setMinHeight(e.target.value)}
                    placeholder="Min Height"
                    className="px-4 py-2 w-full md:w-1/4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(e.target.value)}
                    placeholder="Max Height"
                    className="px-4 py-2 w-full md:w-1/4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={minWeight}
                    onChange={(e) => setMinWeight(e.target.value)}
                    placeholder="Min Weight"
                    className="px-4 py-2 w-full md:w-1/4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxWeight}
                    onChange={(e) => setMaxWeight(e.target.value)}
                    placeholder="Max Weight"
                    className="px-4 py-2 w-full md:w-1/4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    placeholder="Min Age"
                    className="px-4 py-2 w-full md:w-1/4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    placeholder="Max Age"
                    className="px-4 py-2 w-full md:w-1/4 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
            {customers.length > 0 && (
              <div className="mt-4">
                <p className="text-white">Total Results: {customers.length}</p>
              </div>
            )}
          </div>
          <div className="relative flex flex-col bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4" style={{ width: '90%', height: '50vh', overflowY: 'auto' }}>
            {error && <p className="text-red-500">{error}</p>}
            {customers.length > 0 ? (
              <table className="w-full bg-gray-800 text-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Claimant ID</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">First Name</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Last Name</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Date of Birth</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Age</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Gender</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Address</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Phone Number</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Email</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">SSN</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Weight</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Height</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Job</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Company</th>
                    <th className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Marital Status</th>
                    <th className="py-2 px-4 border-b border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">Number of Children</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.claimant_id}>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.claimant_id}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.first_name}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.last_name}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{new Date(customer.date_of_birth).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.age}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.gender}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.address}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.phone_number}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.email}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.ssn}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.weight} kg</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.height} cm</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.job}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.company}</td>
                      <td className="py-2 px-4 border-b border-r border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.marital_status}</td>
                      <td className="py-2 px-4 border-b border-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{customer.number_of_children}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-white">No customers found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );  
};

export default CustomerData;
