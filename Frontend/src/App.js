import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CustomerData from './pages/CustomerData';
import Login from './pages/Login';
import Register from './pages/Register';
import AddInvestigators from './pages/AddInvestigators';
import Results from './pages/Results';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Reports from './pages/Reports';
import Unauthorized from './pages/Unauthorized';

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
              <ProtectedRoute requiredRole="AD">
                <AddInvestigators />
              </ProtectedRoute>
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
        <Route 
          path="/reports" 
          element={
            <PrivateRoute>
              <ProtectedRoute requiredRole="AD">
                <Reports />
              </ProtectedRoute>
            </PrivateRoute>
          } 
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
