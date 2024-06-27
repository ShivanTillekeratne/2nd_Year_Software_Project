import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CustomerData from './pages/CustomerData';
import Login from './pages/Login';
import Register from './pages/Register';
import AddInvestigators from './pages/AddInvestigators';
import Results from './pages/Results'; // Import the new page
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/customerdata" 
          element={
            <PrivateRoute>
              <CustomerData />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/addinvestigators" 
          element={
            <PrivateRoute>
              <AddInvestigators />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <PrivateRoute>
              <Results />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
