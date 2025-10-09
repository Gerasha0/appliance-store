import React from 'react';
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
} from '@mui/material';
import {
  Person,
  Email,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store';
import { showSuccess, showError } from '@/utils';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { email, role } = useAppSelector(state => state.auth);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
    });
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call to update profile
      showSuccess(t('profile.updateSuccess') || 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      showError(t('profile.updateError') || 'Failed to update profile');
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('profile.title') || 'Profile'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left Column - Profile Cards */}
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
                {email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {formData.firstName || formData.lastName
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

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('profile.accountInfo') || 'Account Information'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2">{email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body2">{role}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Profile Form */}
        <Box sx={{ flex: '2 1 500px' }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {t('profile.personalInfo') || 'Personal Information'}
              </Typography>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  {t('common.edit') || 'Edit'}
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    {t('common.save') || 'Save'}
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label={t('auth.firstName') || 'First Name'}
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  disabled={!isEditing}
                  placeholder="John"
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label={t('auth.lastName') || 'Last Name'}
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  disabled={!isEditing}
                  placeholder="Doe"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label={t('auth.phone') || 'Phone'}
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  disabled={!isEditing}
                  placeholder="+1 (234) 567-8900"
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label={t('auth.email') || 'Email'}
                  value={email || ''}
                  disabled
                />
              </Box>

              <TextField
                fullWidth
                label={t('auth.address') || 'Address'}
                value={formData.address}
                onChange={handleChange('address')}
                disabled={!isEditing}
                multiline
                rows={3}
                placeholder="123 Main St, City, State 12345"
              />
            </Stack>

            {!isEditing && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('profile.editHint') || 'Click the Edit button to update your profile information.'}
                </Typography>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('profile.settings') || 'Settings'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {t('profile.settingsHint') || 'Additional settings and preferences will be available here.'}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
