import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

// Wraps protected pages — redirects to login if not authenticated
// Uses <Outlet /> so it works with nested routes in React Router v6
export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};