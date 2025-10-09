import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';
import type { UserRole } from '@/types/models';
import { LoadingSpinner } from './LoadingSpinner';
import { Box, Typography, Button } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
  showAccessDenied?: boolean;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  allowedRoles,
  redirectTo = '/unauthorized',
  showAccessDenied = false,
}) => {
  const { isAuthenticated, role, token } = useAppSelector(state => state.auth);
  const location = useLocation();

  // Check if we're still loading authentication state
  if (token === null && !isAuthenticated) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (role && allowedRoles.includes(role)) {
    return <Outlet />;
  }

  // User doesn't have permission
  if (showAccessDenied) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
          p: 3,
        }}
      >
        <LockIcon sx={{ fontSize: 80, color: 'error.main' }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth="500px">
          You don't have permission to access this page. Your role ({role}) is not authorized.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Redirect to unauthorized page or dashboard
  return <Navigate to={redirectTo} replace />;
};

export default RoleBasedRoute;
