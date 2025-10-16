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
import { clientSchema, clientRegistrationSchema } from '@/types/validation';

interface ClientFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClientRequestDTO) => Promise<void>;
  client?: Client | null;
  isLoading?: boolean;
}

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
    resolver: yupResolver(client ? clientSchema : clientRegistrationSchema) as any,
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

  useEffect(() => {
    if (client) {
      reset({
        email: client.email,
        password: '',
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
    console.log('Submitting client data:', { isUpdate: !!client, data: submitData });
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