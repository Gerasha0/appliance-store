import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Appliance, Manufacturer } from '@/types/models';
import { Category } from '@/types/models';

interface ApplianceDetailDialogProps {
  open: boolean;
  onClose: () => void;
  appliance: Appliance | null;
  manufacturers: Manufacturer[];
  onEdit?: (appliance: Appliance) => void;
  showEditButton?: boolean;
}

export const ApplianceDetailDialog: React.FC<ApplianceDetailDialogProps> = ({
  open,
  onClose,
  appliance,
  manufacturers,
  onEdit,
  showEditButton = false,
}) => {
  const { t } = useTranslation();

  if (!appliance) {
    return null;
  }

  const manufacturer = manufacturers.find(m => m.id === appliance.manufacturerId);

  const handleEdit = () => {
    if (onEdit && appliance) {
      onClose();
      onEdit(appliance);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('appliance.applianceDetails')}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={t(`appliance.categories.${appliance.category}`)}
              color={appliance.category === Category.BIG ? 'primary' : 'secondary'}
              size="small"
            />
            <Chip
              label={t(`appliance.powerTypes.${appliance.powerType}`)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Basic Information */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {t('appliance.basicInfo')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  ID
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  #{appliance.id}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('appliance.name')}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {appliance.name}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('appliance.model')}
                </Typography>
                <Typography variant="body1">
                  {appliance.model || t('common.notSpecified')}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('appliance.manufacturer')}
                </Typography>
                <Typography variant="body1">{manufacturer?.name || 'N/A'}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Technical Specifications */}
          <Box>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              {t('appliance.technicalSpecs')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('appliance.category')}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={t(`appliance.categories.${appliance.category}`)}
                    color={appliance.category === Category.BIG ? 'primary' : 'secondary'}
                    size="small"
                  />
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('appliance.powerType')}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={t(`appliance.powerTypes.${appliance.powerType}`)}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('appliance.power')}
                </Typography>
                <Typography variant="body1">
                  {appliance.power ? `${appliance.power} W` : t('common.notSpecified')}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('appliance.price')}
                </Typography>
                <Typography variant="h6" color="primary.main">
                  ${appliance.price.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Characteristics */}
          {appliance.characteristic && (
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                {t('appliance.characteristic')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                {appliance.characteristic}
              </Typography>
            </Box>
          )}

          {/* Description */}
          {appliance.description && (
            <Box>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                {t('appliance.description')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                }}
              >
                {appliance.description}
              </Typography>
            </Box>
          )}

          {/* Empty state if no characteristic and description */}
          {!appliance.characteristic && !appliance.description && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('appliance.noAdditionalInfo')}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        {showEditButton && onEdit && (
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
            {t('common.edit')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
