import React from 'react';
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
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useRegisterEmployeeMutation } from '@/store/api/apiSlice';
import { employeeSchema } from '@/types/validation';
import { LanguageSwitcher, ThemeToggle } from '@/components';
import { showSuccess, showError } from '@/utils';
import type { EmployeeRegistrationDTO } from '@/types/models';

export const RegisterEmployeePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerEmployee, { isLoading, error }] = useRegisterEmployeeMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeRegistrationDTO>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      position: '',
    },
  });

  const onSubmit = async (data: EmployeeRegistrationDTO) => {
    try {
      await registerEmployee(data).unwrap();
      showSuccess(t('auth.registerSuccess') || 'Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (err) {
      console.error('Registration failed:', err);
      showError(t('auth.registerError') || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          position: 'relative',
        }}
      >
        {/* Language Switcher and Theme Toggle - positioned at top right */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
          }}
        >
          <ThemeToggle size="medium" />
          <LanguageSwitcher color="primary" />
        </Box>

        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button
                component={Link}
                to="/login"
                startIcon={<ArrowBack />}
                sx={{ mr: 2 }}
              >
                {t('common.back')}
              </Button>
            </Box>

            <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
              {t('auth.registerEmployee')}
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              {t('auth.registerTitle')}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {t('auth.registerError')}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* First Name and Last Name in a row */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('auth.firstName')}
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />

                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('auth.lastName')}
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Box>

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

              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('auth.position')}
                    fullWidth
                    margin="normal"
                    error={!!errors.position}
                    helperText={errors.position?.message}
                    placeholder={t('employee.position') || 'Manager, Developer, etc.'}
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
                {isLoading ? t('common.loading') : t('auth.register')}
              </Button>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.haveAccount')}{' '}
                  <Button
                    component={Link}
                    to="/login"
                    variant="text"
                    size="small"
                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                  >
                    {t('auth.signIn')}
                  </Button>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
