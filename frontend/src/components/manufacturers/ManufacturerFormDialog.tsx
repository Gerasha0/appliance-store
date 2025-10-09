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
import type { Manufacturer, ManufacturerRequestDTO } from '@/types/models';
import { manufacturerSchema } from '@/types/validation';

interface ManufacturerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ManufacturerRequestDTO) => Promise<void>;
  manufacturer?: Manufacturer | null;
  isLoading?: boolean;
}

export const ManufacturerFormDialog: React.FC<ManufacturerFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  manufacturer,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManufacturerRequestDTO>({
    resolver: yupResolver(manufacturerSchema),
    defaultValues: {
      name: '',
      address: '',
      country: '',
    },
  });

  // Update form when manufacturer changes
  useEffect(() => {
    if (manufacturer) {
      reset({
        name: manufacturer.name,
        address: manufacturer.address,
        country: manufacturer.country,
      });
    } else {
      reset({
        name: '',
        address: '',
        country: '',
      });
    }
  }, [manufacturer, reset]);

  const handleFormSubmit = async (data: ManufacturerRequestDTO) => {
    await onSubmit(data);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {manufacturer ? t('manufacturer.editManufacturer') : t('manufacturer.addManufacturer')}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('manufacturer.name')}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
                  label={t('manufacturer.address')}
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

            {/* Country */}
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('manufacturer.country')}
                  fullWidth
                  required
                  error={!!errors.country}
                  helperText={errors.country?.message}
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
