import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Anomalies = () => {
  // Sample data for the table
  const anomaliesData = [
    { policyHolderID: 1, policyHolderName: 'John Doe', policyHolderAddress: '123 Main St', claimID: 'CLM001', status: 'Fraudulent', date: '2024-02-10' },
    { policyHolderID: 2, policyHolderName: 'Jane Smith', policyHolderAddress: '456 Elm St', claimID: 'CLM002', status: 'Legitimate', date: '2024-02-11' },
    { policyHolderID: 1, policyHolderName: 'John Doe', policyHolderAddress: '123 Main St', claimID: 'CLM001', status: 'Fraudulent', date: '2024-02-10' },
    { policyHolderID: 2, policyHolderName: 'Jane Smith', policyHolderAddress: '456 Elm St', claimID: 'CLM002', status: 'Legitimate', date: '2024-02-11' },
    { policyHolderID: 1, policyHolderName: 'John Doe', policyHolderAddress: '123 Main St', claimID: 'CLM001', status: 'Fraudulent', date: '2024-02-10' },
    { policyHolderID: 2, policyHolderName: 'Jane Smith', policyHolderAddress: '456 Elm St', claimID: 'CLM002', status: 'Legitimate', date: '2024-02-11' },
    { policyHolderID: 1, policyHolderName: 'John Doe', policyHolderAddress: '123 Main St', claimID: 'CLM001', status: 'Fraudulent', date: '2024-02-10' },
    { policyHolderID: 2, policyHolderName: 'Jane Smith', policyHolderAddress: '456 Elm St', claimID: 'CLM002', status: 'Legitimate', date: '2024-02-11' },
    { policyHolderID: 1, policyHolderName: 'John Doe', policyHolderAddress: '123 Main St', claimID: 'CLM001', status: 'Fraudulent', date: '2024-02-10' },
    { policyHolderID: 2, policyHolderName: 'Jane Smith', policyHolderAddress: '456 Elm St', claimID: 'CLM002', status: 'Legitimate', date: '2024-02-11' },
    { policyHolderID: 1, policyHolderName: 'John Doe', policyHolderAddress: '123 Main St', claimID: 'CLM001', status: 'Fraudulent', date: '2024-02-10' },
    { policyHolderID: 2, policyHolderName: 'Jane Smith', policyHolderAddress: '456 Elm St', claimID: 'CLM002', status: 'Legitimate', date: '2024-02-11' },
    { policyHolderID: 1, policyHolderName: 'John Doe', policyHolderAddress: '123 Main St', claimID: 'CLM001', status: 'Fraudulent', date: '2024-02-10' },
    { policyHolderID: 2, policyHolderName: 'Jane Smith', policyHolderAddress: '456 Elm St', claimID: 'CLM002', status: 'Legitimate', date: '2024-02-11' },

    // Add more data as needed
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4 pl-64 bg-white">
          <h2 className="text-xl text-blue-900 font-bold mb-4">Detected Anomalies</h2>
          <div className="overflow-auto max-h-[500px]"> {/* Adjust max height as needed */}
            <div className="table-container">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead className="sticky top-0 bg-blue-900 text-white">
                  <tr>
                    <th className="py-2 px-4 text-left">Policy Holder ID</th>
                    <th className="py-2 px-4 text-left">Policy Holder Name</th>
                    <th className="py-2 px-4 text-left">Policy Holder Address</th>
                    <th className="py-2 px-4 text-left">Claim ID</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {anomaliesData.map((anomaly, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-slate-300' : 'bg-slate-400'} ${index === anomaliesData.length - 1 ? 'rounded-b-lg' : ''}`}>
                      <td className="py-4 px-4">{anomaly.policyHolderID}</td>
                      <td className={`py-4 px-4 ${anomaly.status === 'Fraudulent' ? 'text-red-600' : 'text-black'}`}>{anomaly.policyHolderName}</td>
                      <td className="py-4 px-4">{anomaly.policyHolderAddress}</td>
                      <td className="py-4 px-4">{anomaly.claimID}</td>
                      <td className={`py-4 px-4 ${anomaly.status === 'Fraudulent' ? 'text-red-600' : 'text-black'}`}>{anomaly.status}</td>
                      <td className="py-4 px-4">{anomaly.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Anomalies;
