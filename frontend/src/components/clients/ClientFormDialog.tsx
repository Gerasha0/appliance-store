import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import type { Client, ClientRequestDTO } from '@/types/models';
import { clientSchema } from '@/types/validation';
import * as yup from 'yup';

interface ClientFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClientRequestDTO) => Promise<void>;
  client?: Client | null;
  isLoading?: boolean;
}

// Schema for creating new client - password is required
const createClientSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'First name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .matches(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
      'Last name must contain only letters, spaces, hyphens, and apostrophes'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid')
    .max(255, 'Email must not exceed 255 characters')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email format is invalid'
    ),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/,
      'Password must contain at least one digit, one lowercase, one uppercase letter, one special character, and no whitespace'
    ),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(
      /^[\d\s\-+()]+$/,
      'Phone number must contain only digits, spaces, hyphens, plus signs, and parentheses'
    )
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must not exceed 20 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must not exceed 255 characters'),
  card: yup
    .string()
    .transform((value) => (value === '' ? undefined : value))
    .optional()
    .matches(
      /^(\d{16}|\d{4}-\d{4}-\d{4}-\d{4})$/,
      'Card must be 16 digits or formatted as XXXX-XXXX-XXXX-XXXX'
    ),
});

export const ClientFormDialog: React.FC<ClientFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  client,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientRequestDTO>({
    resolver: yupResolver(client ? clientSchema : createClientSchema) as any,
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

  // Update form when client changes
  useEffect(() => {
    if (client) {
      reset({
        email: client.email,
        password: '', // Never pre-fill password for security
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        address: client.address,
        card: client.card || '',
      });
    } else {
      reset({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        card: '',
      });
    }
  }, [client, reset]);

  const handleFormSubmit = async (data: ClientRequestDTO) => {
    const submitData = { ...data };
    if (client && (!submitData.password || submitData.password.trim() === '')) {
      delete submitData.password;
    }
    await onSubmit(submitData);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {client ? t('client.editClient') : t('client.addClient')}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* First Name */}
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('client.firstName')}
                  fullWidth
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  disabled={isSubmitting || isLoading}
                />
              )}
            />

            {/* Last Name */}
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('client.lastName')}
                  fullWidth
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  disabled={isSubmitting || isLoading}
                />
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('auth.email')}
                  type="email"
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting || isLoading}
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('auth.password')}
                  type="password"
                  fullWidth
                  required={!client} // Required only when creating new client
                  placeholder={client ? t('auth.passwordPlaceholder') : ''}
                  error={!!errors.password}
                  helperText={errors.password?.message || (client ? t('auth.passwordHint') : '')}
                  disabled={isSubmitting || isLoading}
                />
              )}
            />

            {/* Phone */}
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('client.phone')}
                  fullWidth
                  required
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={isSubmitting || isLoading}
                />
              )}
            />

            {/* Address */}
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('client.address')}
                  fullWidth
                  required
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={isSubmitting || isLoading}
                />
              )}
            />

            {/* Card Number (optional) */}
            <Controller
              name="card"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('client.card')}
                  fullWidth
                  placeholder="1234-5678-9012-3456"
                  error={!!errors.card}
                  helperText={errors.card?.message}
                  disabled={isSubmitting || isLoading}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting || isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || isLoading}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
