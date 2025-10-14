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
import { useTranslation } from 'react-i18next';
import type { Employee, EmployeeRequestDTO } from '@/types/models';

interface EmployeeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeRequestDTO) => Promise<void>;
  employee?: Employee | null;
  isLoading?: boolean;
}

export const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  employee,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeRequestDTO>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      position: '',
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        email: employee.email,
        password: '',
        firstName: employee.firstName,
        lastName: employee.lastName,
        position: employee.position,
      });
    } else {
      reset({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        position: '',
      });
    }
  }, [employee, reset]);

  const handleFormSubmit = async (data: EmployeeRequestDTO) => {
    const submitData = { ...data };
    if (employee && (!submitData.password || submitData.password.trim() === '')) {
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
        {employee ? t('employee.editEmployee') : t('employee.addEmployee')}
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
                  label={t('employee.firstName')}
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
                  label={t('employee.lastName')}
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
                  required={!employee} // Required only when creating new employee
                  placeholder={employee ? t('auth.passwordPlaceholder') : ''}
                  error={!!errors.password}
                  helperText={errors.password?.message || (employee ? t('auth.passwordHint') : '')}
                  disabled={isSubmitting || isLoading}
                />
              )}
            />

            {/* Position */}
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('employee.position')}
                  fullWidth
                  required
                  error={!!errors.position}
                  helperText={errors.position?.message}
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
