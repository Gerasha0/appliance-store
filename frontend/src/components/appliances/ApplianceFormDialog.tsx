import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Box,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import type { Appliance, ApplianceRequestDTO, Manufacturer } from '@/types/models';
import { Category, PowerType } from '@/types/models';
import { applianceSchema } from '@/types/validation';

interface ApplianceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ApplianceRequestDTO) => Promise<void>;
  appliance?: Appliance | null;
  manufacturers: Manufacturer[];
  isLoading?: boolean;
}

export const ApplianceFormDialog: React.FC<ApplianceFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  appliance,
  manufacturers,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Get default manufacturer ID
  const getDefaultManufacturerId = () => {
    if (appliance?.manufacturerId) {
      return appliance.manufacturerId;
    }
    return manufacturers.length > 0 ? manufacturers[0].id : 1;
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplianceRequestDTO>({
    resolver: yupResolver(applianceSchema) as any,
    defaultValues: {
      name: appliance?.name || '',
      category: appliance?.category || Category.SMALL,
      model: appliance?.model || '',
      powerType: appliance?.powerType || PowerType.AC220,
      price: appliance?.price || 0,
      manufacturerId: getDefaultManufacturerId(),
      characteristic: appliance?.characteristic || '',
      description: appliance?.description || '',
      power: appliance?.power || 0,
    },
  });

  // Update form when dialog opens or appliance changes
  useEffect(() => {
    if (open) {
      const defaultManufacturerId = manufacturers.length > 0 ? manufacturers[0].id : 1;
      
      if (appliance) {
        reset({
          name: appliance.name || '',
          category: appliance.category || Category.SMALL,
          model: appliance.model || '',
          powerType: appliance.powerType || PowerType.AC220,
          price: appliance.price || 0,
          manufacturerId: appliance.manufacturerId || appliance.manufacturer?.id || defaultManufacturerId,
          characteristic: appliance.characteristic || '',
          description: appliance.description || '',
          power: appliance.power || 0,
        });
      } else {
        reset({
          name: '',
          category: Category.SMALL,
          model: '',
          powerType: PowerType.AC220,
          price: 0,
          manufacturerId: defaultManufacturerId,
          characteristic: '',
          description: '',
          power: 0,
        });
      }
    }
  }, [open, appliance, manufacturers, reset]);

  const handleFormSubmit = async (data: ApplianceRequestDTO) => {
    await onSubmit(data);
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {appliance ? t('appliance.editAppliance') : t('appliance.addAppliance')}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('appliance.name')}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Model */}
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('appliance.model')}
                  fullWidth
                  required
                  error={!!errors.model}
                  helperText={errors.model?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            {/* Category and Power Type Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.category} required>
                    <InputLabel>{t('appliance.category')}</InputLabel>
                    <Select {...field} label={t('appliance.category')} disabled={isSubmitting}>
                      {Object.values(Category).map(cat => (
                        <MenuItem key={cat} value={cat}>
                          {t(`appliance.categories.${cat}`)}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category && (
                      <FormHelperText>{errors.category.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name="powerType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.powerType} required>
                    <InputLabel>{t('appliance.powerType')}</InputLabel>
                    <Select {...field} label={t('appliance.powerType')} disabled={isSubmitting}>
                      {Object.values(PowerType).map(pt => (
                        <MenuItem key={pt} value={pt}>
                          {t(`appliance.powerTypes.${pt}`)}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.powerType && (
                      <FormHelperText>{errors.powerType.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Price and Power Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('appliance.price')}
                    type="number"
                    fullWidth
                    required
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    disabled={isSubmitting}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="power"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('appliance.power')}
                    type="number"
                    fullWidth
                    error={!!errors.power}
                    helperText={errors.power?.message}
                    disabled={isSubmitting}
                    slotProps={{
                      input: {
                        endAdornment: <InputAdornment position="end">W</InputAdornment>,
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Manufacturer */}
            <Controller
              name="manufacturerId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.manufacturerId} required>
                  <InputLabel>{t('appliance.manufacturer')}</InputLabel>
                  <Select 
                    {...field} 
                    value={field.value || (manufacturers.length > 0 ? manufacturers[0].id : '')}
                    label={t('appliance.manufacturer')} 
                    disabled={isSubmitting}
                  >
                    {manufacturers.map(m => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.manufacturerId && (
                    <FormHelperText>{errors.manufacturerId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Characteristic */}
            <Controller
              name="characteristic"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('appliance.characteristic')}
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.characteristic}
                  helperText={errors.characteristic?.message}
                  disabled={isSubmitting}
                  placeholder={t('appliance.characteristicPlaceholder')}
                />
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('appliance.description')}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={isSubmitting}
                  placeholder={t('appliance.descriptionPlaceholder')}
                />
              )}
            />

            {/* Info Text */}
            <Typography variant="caption" color="text.secondary">
              * {t('validation.required')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting || isLoading}>
            {isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
