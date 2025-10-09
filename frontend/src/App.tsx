import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useAppSelector } from '@/store';
import { PrivateRoute } from '@/components/PrivateRoute';
import { RoleBasedRoute } from '@/components/RoleBasedRoute';
import { AppLayout } from '@/components/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterClientPage } from '@/pages/RegisterClientPage';
import { RegisterEmployeePage } from '@/pages/RegisterEmployeePage';
import { UserRole } from '@/types/models';

// Lazy load pages for better performance
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const AppliancesPage = React.lazy(() => import('@/pages/AppliancesPage'));
const OrdersPage = React.lazy(() => import('@/pages/OrdersPage'));
const ManufacturersPage = React.lazy(() => import('@/pages/ManufacturersPage'));
const EmployeesPage = React.lazy(() => import('@/pages/EmployeesPage'));
const ClientsPage = React.lazy(() => import('@/pages/ClientsPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));

// Better loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
    }}
  >
    <CircularProgress size={60} />
  </Box>
);

const App: React.FC = () => {
  const themeMode = useAppSelector(state => state.ui.theme);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
      >
        <BrowserRouter>
          <React.Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register/client" element={<RegisterClientPage />} />
              <Route path="/register/employee" element={<RegisterEmployeePage />} />

              {/* Private routes with AppLayout */}
              <Route element={<PrivateRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/appliances" element={<AppliancesPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* Employee-only routes */}
                  <Route element={<RoleBasedRoute allowedRoles={[UserRole.EMPLOYEE]} />}>
                    <Route path="/manufacturers" element={<ManufacturersPage />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
