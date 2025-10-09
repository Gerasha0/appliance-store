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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRegisterClientMutation } from '@/store/api/apiSlice';
import { clientRegistrationSchema } from '@/types/validation';
import { LanguageSwitcher } from '@/components';
import { showSuccess, showError } from '@/utils';
import type { ClientRequestDTO } from '@/types/models';

export const RegisterClientPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerClient, { isLoading, error }] = useRegisterClientMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientRequestDTO>({
    resolver: yupResolver(clientRegistrationSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (data: ClientRequestDTO) => {
    try {
      // Remove card field if it's empty (not required for registration)
      const { card, ...registrationData } = data;
      const payload = card ? data : registrationData;
      
      await registerClient(payload).unwrap();
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
        {/* Language Switcher - positioned at top right */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <LanguageSwitcher color="primary" />
        </Box>

        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              {t('auth.registerClient')}
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
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('auth.phone')}
                    type="tel"
                    fullWidth
                    margin="normal"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('auth.address')}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />

              <Controller
                name="card"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('auth.card')}
                    fullWidth
                    margin="normal"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    error={!!errors.card}
                    helperText={errors.card?.message}
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

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('auth.haveAccount')}{' '}
                  <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                    {t('auth.signIn')}
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
