// src/pages/Reports.jsx

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import html2pdf from 'html2pdf.js';

const Reports = () => {
  const [summaryData, setSummaryData] = useState({
    total_claims: 0,
    total_analyzed_claims: 0,
    approved_claims: 0,
    rejected_by_rules: 0,
    rejected_by_ml: 0,
    reversed_claims: 0,
    claims_by_type: {},
    claims_by_age_group: {}
  });

  const [comment, setComment] = useState('');
  const [timePeriod, setTimePeriod] = useState('all');

  useEffect(() => {
    fetchSummaryData();
    fetchMonthlyData();
  }, [timePeriod]);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/fetch_summary_data/?time_period=${timePeriod}`);
      setSummaryData(response.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/fetch_monthly_data/');
      setMonthlyData(response.data);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  };

  const pieData = {
    labels: ['Approved Claims', 'Rejected Claims'],
    datasets: [
      {
        label: '# of Claims',
        data: [
          summaryData.approved_claims,
          summaryData.rejected_by_rules + summaryData.rejected_by_ml
        ],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const lineData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Total Claims',
        data: monthlyData.map(data => data.total_claims),
        borderColor: '#4caf50',
        fill: false,
      },
      {
        label: 'Approved Claims',
        data: monthlyData.map(data => data.approved_claims),
        borderColor: '#2196f3',
        fill: false,
      },
      {
        label: 'Rejected Claims',
        data: monthlyData.map(data => data.rejected_claims),
        borderColor: '#f44336',
        fill: false,
      },
    ],
  };

  const barData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        label: 'Reversed Claims',
        data: monthlyData.map(data => data.reversed_claims),
        backgroundColor: '#ff9800',
      },
    ],
  };

  const claimsByTypeData = {
    labels: Object.keys(summaryData.claims_by_type),
    datasets: [
      {
        label: 'Claims by Type',
        data: Object.values(summaryData.claims_by_type),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const claimsByAgeGroupData = {
    labels: Object.keys(summaryData.claims_by_age_group),
    datasets: [
      {
        label: 'Claims by Age Group',
        data: Object.values(summaryData.claims_by_age_group),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const handleExportCSV = () => {
    const data = [
      ["Metric", "Count"],
      ["Total Claims", summaryData.total_claims],
      ["Total Analyzed Claims", summaryData.total_analyzed_claims],
      ["Approved Claims", summaryData.approved_claims],
      ["Rejected by Rules Engine", summaryData.rejected_by_rules],
      ["Rejected by ML Model", summaryData.rejected_by_ml],
      ["Reversed Claims", summaryData.reversed_claims],
      ["Comments", comment.replace(/<[^>]*>/g, '')] // Remove HTML tags from comments for CSV
    ];
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'claims_summary.csv');
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('report-content');
    const options = {
      margin: 1,
      filename: 'claims_summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-slate-900">
          <div className="space-y-4" style={{ width: '98%', overflowY: 'auto' }} id="report-content">
            {/* Summary Section */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Claims Overview</h2>
                <div className="flex space-x-2">
                  <button className={`px-4 py-2 rounded ${timePeriod === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`} onClick={() => setTimePeriod('all')}>All</button>
                  <button className={`px-4 py-2 rounded ${timePeriod === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`} onClick={() => setTimePeriod('weekly')}>Weekly</button>
                  <button className={`px-4 py-2 rounded ${timePeriod === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`} onClick={() => setTimePeriod('monthly')}>Monthly</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                  <div className="flex items-center">
                    <h3 className="text-lg text-white font-medium">Total Claims</h3>
                    <FaInfoCircle
                      className="text-white ml-2"
                      data-tooltip-id="total-claims"
                    />
                    <Tooltip id="total-claims" place="top" effect="solid">
                      Total number of claims made by customers
                    </Tooltip>
                  </div>
                  <p className="text-2xl text-white font-semibold">{summaryData.total_claims}</p>
                </div>
                <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                  <div className="flex items-center">
                    <h3 className="text-lg text-white font-medium">Total Analyzed Claims</h3>
                    <FaInfoCircle
                      className="text-white ml-2"
                      data-tooltip-id="total-analyzed-claims"
                    />
                    <Tooltip id="total-analyzed-claims" place="top" effect="solid">
                      Total number of claims analyzed by the system
                    </Tooltip>
                  </div>
                  <p className="text-2xl text-white font-semibold">{summaryData.total_analyzed_claims}</p>
                </div>
                <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                  <div className="flex items-center">
                    <h3 className="text-lg text-white font-medium">Approved Claims</h3>
                    <FaInfoCircle
                      className="text-white ml-2"
                      data-tooltip-id="approved-claims"
                    />
                    <Tooltip id="approved-claims" place="top" effect="solid">
                      Number of claims approved by the system and the users
                    </Tooltip>
                  </div>
                  <p className="text-2xl text-white font-semibold">{summaryData.approved_claims}</p>
                </div>
                <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                  <div className="flex items-center">
                    <h3 className="text-lg text-white font-medium">Rejected by Rules</h3>
                    <FaInfoCircle
                      className="text-white ml-2"
                      data-tooltip-id="rejected-by-rules"
                    />
                    <Tooltip id="rejected-by-rules" place="top" effect="solid">
                      Number of claims rejected by the rules engine
                    </Tooltip>
                    </div>
                    <p className="text-2xl text-white font-semibold">{summaryData.rejected_by_rules}</p>
                    </div>
                    <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                      <div className="flex items-center">
                        <h3 className="text-lg text-white font-medium">Rejected by ML Model</h3>
                        <FaInfoCircle
                          className="text-white ml-2"
                          data-tooltip-id="rejected-by-ml"
                        />
                        <Tooltip id="rejected-by-ml" place="top" effect="solid">
                          Number of claims identified as fraud by the ML model
                        </Tooltip>
                      </div>
                      <p className="text-2xl text-white font-semibold">{summaryData.rejected_by_ml}</p>
                    </div>
                    <div className="bg-gray-800 border border-gray-600 p-4 rounded">
                      <div className="flex items-center">
                        <h3 className="text-lg text-white font-medium">Reversed Claims</h3>
                        <FaInfoCircle
                          className="text-white ml-2"
                          data-tooltip-id="reversed-claims"
                        />
                        <Tooltip id="reversed-claims" place="top" effect="solid">
                          Number of claims where the decision was reversed by the users
                        </Tooltip>
                      </div>
                      <p className="text-2xl text-white font-semibold">{summaryData.reversed_claims}</p>
                    </div>
                  </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {/* Detailed Analysis Section */}
                    <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                      <h2 className="text-xl text-white font-semibold mb-4">Detailed Analysis</h2>
                      <div id="pie-chart">
                        <Pie data={pieData} />
                      </div>
                    </div>

                    {/* Monthly Claims Trend */}
                    <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                      <h2 className="text-xl text-white font-semibold mb-4">Monthly Claims Trend</h2>
                      <div id="line-chart">
                        <Line data={lineData} />
                      </div>
                    </div>

                    {/* Reversed Claims Over Time */}
                    <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                      <h2 className="text-xl text-white font-semibold mb-4">Reversed Claims Over Time</h2>
                      <div id="bar-chart">
                        <Bar data={barData} />
                      </div>
                    </div>

                    {/* Claims by Type */}
                    <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                      <h2 className="text-xl text-white font-semibold mb-4">Claims by Type</h2>
                      <div id="doughnut-chart">
                        <Doughnut data={claimsByTypeData} />
                      </div>
                    </div>

                    {/* Claims by Age Group */}
                    <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                      <h2 className="text-xl text-white font-semibold mb-4">Claims by Age Group</h2>
                      <div id="doughnut-chart">
                        <Doughnut data={claimsByAgeGroupData} />
                      </div>
                    </div>

                    {/* Comments and Notes Section */}
                    <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                      <h2 className="text-xl text-white font-semibold mb-4">Comments and Notes</h2>
                      <div id="comments">
                        <ReactQuill 
                          value={comment} 
                          onChange={setComment} 
                          className="bg-white text-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                    <h2 className="text-xl text-white font-semibold mb-4">Export Options</h2>
                    <button 
                      className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                      onClick={handleExportPDF}
                    >
                      Export as PDF
                    </button>
                    <button 
                      className="bg-green-500 text-white py-2 px-4 rounded"
                      onClick={handleExportCSV}
                    >
                      Export as CSV
                    </button>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="total-claims" />
      <Tooltip id="total-analyzed-claims" />
      <Tooltip id="approved-claims" />
      <Tooltip id="rejected-by-rules" />
      <Tooltip id="rejected-by-ml" />
      <Tooltip id="reversed-claims" />
    </div>
  );
};

export default Reports;

