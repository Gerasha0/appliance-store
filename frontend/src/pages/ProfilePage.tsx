import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  CreditCard,
  Phone as PhoneIcon,
  Home,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store';
import { showSuccess, showError } from '@/utils';
import { useGetProfileQuery, useUpdateProfileMutation, type ProfileUpdateDTO } from '@/store/api/profileApi';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { email, role } = useAppSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const isClient = role === 'CLIENT';
  const isEmployee = role === 'EMPLOYEE';

  // Fetch user profile
  const { data: userData, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    card: '',
    position: '',
    password: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: 'phone' in userData ? userData.phone || '' : '',
        address: 'address' in userData ? userData.address || '' : '',
        card: 'card' in userData ? userData.card || '' : '',
        position: 'position' in userData ? userData.position || '' : '',
        password: '',
      });
    }
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: 'phone' in userData ? userData.phone || '' : '',
        address: 'address' in userData ? userData.address || '' : '',
        card: 'card' in userData ? userData.card || '' : '',
        position: 'position' in userData ? userData.position || '' : '',
        password: '',
      });
    }
  };

  const handleSave = async () => {
    try {
      const updateData: ProfileUpdateDTO = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      // Add password only if it's not empty
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      // Add client-specific fields
      if (isClient) {
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.address) updateData.address = formData.address;
        if (formData.card) updateData.card = formData.card;
      }

      // Add employee-specific field
      if (isEmployee && formData.position) {
        updateData.position = formData.position;
      }

      await updateProfile(updateData).unwrap();
      showSuccess(t('profile.updateSuccess'));
      setIsEditing(false);
      // Clear password field after successful update
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Failed to update profile:', error);
      showError(t('profile.updateError'));
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t('profile.loadingProfile')}</Typography>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box>
        <Alert severity="error">{t('profile.updateError')}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('profile.title')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left Column - Profile Card */}
        <Box sx={{ flex: '1 1 300px', minWidth: 300, maxWidth: 400 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 16px',
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {formData.firstName?.charAt(0)?.toUpperCase() || email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {formData.firstName && formData.lastName
                  ? `${formData.firstName} ${formData.lastName}`
                  : email?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {email}
              </Typography>
              <Chip
                label={role}
                color={role === 'EMPLOYEE' ? 'primary' : 'secondary'}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Profile Form */}
        <Box sx={{ flex: '2 1 500px' }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {t('profile.personalInfo')}
              </Typography>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  {t('common.edit')}
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={isUpdating}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={isUpdating}
                  >
                    {isUpdating ? t('common.saving') : t('common.save')}
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              {/* First Name and Last Name */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label={t('auth.firstName')}
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label={t('auth.lastName')}
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  disabled={!isEditing}
                />
              </Box>

              {/* Email (read-only) */}
              <TextField
                fullWidth
                label={t('auth.email')}
                value={formData.email}
                disabled
                helperText={t('profile.accountInfo')}
              />

              {/* Client-specific fields */}
              {isClient && (
                <>
                  {/* Phone */}
                  <TextField
                    fullWidth
                    label={t('auth.phone')}
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />

                  {/* Address */}
                  <TextField
                    fullWidth
                    label={t('auth.address')}
                    value={formData.address}
                    onChange={handleChange('address')}
                    disabled={!isEditing}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: <Home sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                  />

                  {/* Card Number */}
                  <TextField
                    fullWidth
                    label={t('auth.card')}
                    value={formData.card}
                    onChange={handleChange('card')}
                    disabled={!isEditing}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    helperText={t('auth.cardOptional')}
                    InputProps={{
                      startAdornment: <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </>
              )}

              {/* Employee-specific fields */}
              {isEmployee && (
                <TextField
                  fullWidth
                  label={t('auth.position')}
                  value={formData.position}
                  onChange={handleChange('position')}
                  disabled={!isEditing}
                />
              )}

              {/* Password (only when editing) */}
              {isEditing && (
                <TextField
                  fullWidth
                  label={t('auth.password')}
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder={t('auth.passwordPlaceholder')}
                  helperText={t('auth.passwordHint')}
                />
              )}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
