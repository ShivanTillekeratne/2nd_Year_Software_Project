import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Corrected import for named export

const getRoleFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  const decodedToken = jwtDecode(token); // Corrected function name
  return decodedToken.role;
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const role = getRoleFromToken();
  if (role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default ProtectedRoute;
