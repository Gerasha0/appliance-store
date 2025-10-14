import React, { useState } from 'react';
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
  MenuItem,
  Divider,
  InputAdornment,
  Menu,
} from '@mui/material';
import { ArrowBack, ArrowDropDown } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useRegisterClientMutation } from '@/store/api/apiSlice';
import { clientRegistrationSchema } from '@/types/validation';
import { LanguageSwitcher, ThemeToggle } from '@/components';
import { showSuccess, showError } from '@/utils';
import type { ClientRegistrationDTO } from '@/types/models';
import { useAppSelector } from '@/store';

// Country codes for phone numbers
const countryCodes = [
  { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
];

export const RegisterClientPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerClient, { isLoading, error }] = useRegisterClientMutation();
  const [countryCode, setCountryCode] = useState('+380');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const themeMode = useAppSelector((state) => state.ui.theme);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ClientRegistrationDTO>({
    resolver: yupResolver(clientRegistrationSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      card: '',
    },
  });

  const onSubmit = async (data: ClientRegistrationDTO) => {
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

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const cleaned = value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    setValue('phone', countryCode + cleaned, { shouldValidate: true });
  };

  const handleCountryCodeChange = (code: string) => {
    setCountryCode(code);
    setValue('phone', code + phoneNumber, { shouldValidate: true });
    setAnchorEl(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
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

                {/* Phone with integrated Country Code Selector */}
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
                      value={phoneNumber}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      placeholder="123 456 7890"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box
                              onClick={handleOpenMenu}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                cursor: 'pointer',
                                userSelect: 'none',
                                '&:hover': {
                                  opacity: 0.7,
                                },
                              }}
                            >
                              <span style={{ fontSize: '1.2em' }}>
                                {countryCodes.find((c) => c.code === countryCode)?.flag}
                              </span>
                              <span style={{ fontWeight: 500 }}>{countryCode}</span>
                              <ArrowDropDown fontSize="small" />
                            </Box>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleCloseMenu}
                              PaperProps={{
                                sx: {
                                  maxHeight: 300,
                                },
                              }}
                            >
                              {countryCodes.map((item) => (
                                <MenuItem
                                  key={item.code}
                                  value={item.code}
                                  onClick={() => handleCountryCodeChange(item.code)}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                    <span style={{ fontSize: '1.2em' }}>{item.flag}</span>
                                    <span style={{ fontWeight: 500 }}>{item.code}</span>
                                    <span style={{ color: 'text.secondary', fontSize: '0.9em' }}>
                                      {item.country}
                                    </span>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Menu>
                          </InputAdornment>
                        ),
                      }}
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
                      helperText={errors.card?.message || t('auth.cardOptional')}
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
    </Box>
  );
};
