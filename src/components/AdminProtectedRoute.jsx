import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (token && user && user.role === 'admin') {
    return <Outlet />; 
  }

  return <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;