import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import { PersonAdd, Work } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '@/store/api/apiSlice';
import { useAppDispatch, setCredentials, useAppSelector } from '@/store';
import { loginSchema } from '@/types/validation';
import { LanguageSwitcher, ThemeToggle } from '@/components';
import { showSuccess, showError } from '@/utils';
import type { LoginRequest } from '@/types/models';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const themeMode = useAppSelector((state) => state.ui.theme);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await login(data).unwrap();
      console.log('Login response:', response); // Debug: check userId
      dispatch(setCredentials(response));
      showSuccess(t('auth.loginSuccess') || 'Successfully logged in!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Login failed:', err);
      showError(t('auth.loginError') || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: themeMode === 'dark'
          ? 'url(/dark_theme.png)'
          : 'url(/light_theme.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ position: 'relative' }}>
          {/* Language Switcher and Theme Toggle - positioned at top right */}
          <Box
            sx={{
              position: 'absolute',
              top: -80,
              right: 0,
              display: 'flex',
              gap: 1,
            }}
          >
            <ThemeToggle size="medium" />
            <LanguageSwitcher color="primary" />
          </Box>

          <Card sx={{ width: '100%', backgroundColor: 'background.paper', backdropFilter: 'blur(10px)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
                {t('auth.loginTitle')}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {t('auth.loginError')}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('auth.email')}
                      type="email"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('auth.password')}
                      type="password"
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isLoading ? t('common.loading') : t('auth.login')}
                </Button>
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.noAccount')}
                </Typography>
              </Divider>

              <Stack spacing={2}>
                <Button
                  component={Link}
                  to="/register/client"
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<PersonAdd />}
                  sx={{
                    textTransform: 'none',
                    py: 1.5,
                  }}
                >
                  {t('auth.registerClient')}
                </Button>

                <Button
                  component={Link}
                  to="/register/employee"
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<Work />}
                  sx={{
                    textTransform: 'none',
                    py: 1.5,
                  }}
                >
                  {t('auth.registerEmployee')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};
