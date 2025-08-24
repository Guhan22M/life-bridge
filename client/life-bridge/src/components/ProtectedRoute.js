import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
