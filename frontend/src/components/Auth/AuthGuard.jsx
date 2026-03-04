import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Spinner } from '../common/Button';

export function AuthGuard({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Check if we have a stored token but need to verify
  const token = localStorage.getItem('accessToken');

  if (!isAuthenticated && !token) {
    // Redirect to login, save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function PublicOnly({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
}
