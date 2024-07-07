import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import axios from 'axios';
import { FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';

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
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [reversedTrendData, setReversedTrendData] = useState([]);
  const [comment, setComment] = useState('');
  const [timePeriod, setTimePeriod] = useState('all');

  useEffect(() => {
    fetchSummaryData();
    fetchMonthlyTrendData();
    fetchReversedTrendData();
    fetchClaimsByTypeData();
    fetchClaimsByAgeGroupData();
  }, [timePeriod]);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/fetch_summary_data/?time_period=${timePeriod}`);
      setSummaryData(response.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  const barData = {
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
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Claims Analysis',
        color: 'white',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
          beginAtZero: true,
        },
      },
    },
  };
  

  const fetchMonthlyTrendData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/monthly_claims_trend/');
      const sortedData = response.data.sort((a, b) => {
        const yearA = a.year;
        const yearB = b.year;
        const monthA = a.month;
        const monthB = b.month;
  
        if (yearA < yearB) {
          return -1;
        }
        if (yearA > yearB) {
          return 1;
        }
        if (monthA < monthB) {
          return -1;
        }
        if (monthA > monthB) {
          return 1;
        }
        return 0;
      });
      setMonthlyTrendData(sortedData);
    } catch (error) {
      console.error("Error fetching monthly claims trend data:", error);
    }
  };
  

  const fetchReversedTrendData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reversed_claims_over_time/');
      const sortedData = response.data.sort((a, b) => {
        const yearA = a.year;
        const yearB = b.year;
        const monthA = a.month;
        const monthB = b.month;
        const dayA = a.day;
        const dayB = b.day;
  
        if (yearA < yearB) {
          return -1;
        }
        if (yearA > yearB) {
          return 1;
        }
        if (monthA < monthB) {
          return -1;
        }
        if (monthA > monthB) {
          return 1;
        }
        if (dayA < dayB) {
          return -1;
        }
        if (dayA > dayB) {
          return 1;
        }
        return 0;
      });
      setReversedTrendData(sortedData);
    } catch (error) {
      console.error("Error fetching reversed claims trend data:", error);
    }
  };
  

  const fetchClaimsByTypeData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/claims_by_type/');
      setSummaryData(prevState => ({
        ...prevState,
        claims_by_type: response.data
      }));
    } catch (error) {
      console.error("Error fetching claims by type data:", error);
    }
  };

  const fetchClaimsByAgeGroupData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/claims_by_age_group/');
      setSummaryData(prevState => ({
        ...prevState,
        claims_by_age_group: response.data
      }));
    } catch (error) {
      console.error("Error fetching claims by age group data:", error);
    }
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
    const doc = new jsPDF('p', 'pt', 'letter');
    const margin = 40;
    const tableTop = 60;
  
    // Set document title
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text('Claims Summary', margin, 40);
  
    // Set table headers and data
    const headers = [['Metric', 'Count']];
    const data = [
      ['Total Claims', summaryData.total_claims],
      ['Total Analyzed Claims', summaryData.total_analyzed_claims],
      ['Approved Claims', summaryData.approved_claims],
      ['Rejected by Rules Engine', summaryData.rejected_by_rules],
      ['Rejected by ML Model', summaryData.rejected_by_ml],
      ['Reversed Claims', summaryData.reversed_claims],
    ];
  
    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: data,
      startY: tableTop,
      margin: { top: tableTop, left: margin, right: margin, bottom: margin },
      theme: 'grid',
      styles: {
        fontSize: 12,
        cellPadding: 6,
        overflow: 'linebreak',
        lineWidth: 1,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [40, 40, 40],
        fontStyle: 'bold',
      },
      alternatingRowStyles: {
        fillColor: [255, 255, 255],
      },
    });
  
    // Add graphs and charts to PDF with adjusted dimensions
    const chartElements = [
      document.getElementById('bar-chart-detanalysis'),
      document.getElementById('line-chart-dailytrend'),
      document.getElementById('bar-chart-revclaims')
    ];
  
    let currentY = doc.autoTable.previous.finalY + 30;
  
    for (const element of chartElements) {
      if (element) {
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/jpeg');
        let width = doc.internal.pageSize.getWidth() - 2 * margin;
        let height = (canvas.height * width) / canvas.width;
  
        // Adjust the height to fit the page
        const maxHeight = doc.internal.pageSize.getHeight() - currentY - margin;
        if (height > maxHeight) {
          const ratio = maxHeight / height;
          height = maxHeight;
          width *= ratio;
        }
  
        doc.addImage(imgData, 'JPEG', margin, currentY, width, height);
        currentY += height + 30;
  
        // Add a new page if needed
        if (currentY > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          currentY = margin;
        }
      }
    }
  
    // Add formatted comments and notes to PDF
    const commentsElement = document.getElementById('comments');
    if (commentsElement) {
      const commentsCanvas = await html2canvas(commentsElement);
      const commentsImgData = commentsCanvas.toDataURL('image/jpeg');
      
      let commentsWidth = doc.internal.pageSize.getWidth() - 2 * margin;
      let commentsHeight = (commentsCanvas.height * commentsWidth) / commentsCanvas.width;
      
      // Check if a new page is needed
      if (currentY + commentsHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        currentY = margin;
      }
      
      doc.addImage(commentsImgData, 'JPEG', margin, currentY, commentsWidth, commentsHeight);
    }
  
    // Save PDF
    doc.save('claims_summary.pdf');
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
                  <button className={`px-4 py-2 rounded ${timePeriod === 'hourly' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`} onClick={() => setTimePeriod('hourly')}>Hourly</button>
                  <button className={`px-4 py-2 rounded ${timePeriod === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`} onClick={() => setTimePeriod('daily')}>Daily</button>
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
                <div id="bar-chart-detanalysis">
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>


              {/* Monthly Claims Trend */}
              <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                <h2 className="text-xl text-white font-semibold mb-4">Daily Claims Trend</h2>
                <div id="line-chart-dailytrend">
                  <Line data={{
                    labels: monthlyTrendData.map(item => `${item.year}-${item.month}-${item.day}`),
                    datasets: [{
                      label: 'Claims',
                      data: monthlyTrendData.map(item => item.count),
                      borderColor: '#4caf50',
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    }]
                  }} />
                </div>
              </div>

              {/* Reversed Claims Over Time */}
              <div className="bg-gray-800 border border-gray-600 shadow rounded p-4">
                <h2 className="text-xl text-white font-semibold mb-4">Reversed Claims Over Time</h2>
                <div id="bar-chart-revclaims">
                  <Bar data={{
                    labels: reversedTrendData.map(item => `${item.year}-${item.month}-${item.day}`),
                    datasets: [{
                      label: 'Reversed Claims',
                      data: reversedTrendData.map(item => item.count),
                      borderColor: '#f44336',
                      backgroundColor: 'rgba(244, 67, 54, 0.2)',
                    }]
                  }} />
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
