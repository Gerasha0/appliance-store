import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';

export interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isSubmitting?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  disableSubmit?: boolean;
  showCloseButton?: boolean;
  sx?: SxProps<Theme>;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isSubmitting = false,
  maxWidth = 'sm',
  fullWidth = true,
  disableSubmit = false,
  showCloseButton = true,
  sx,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={sx}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {title}
        {showCloseButton && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            disabled={isSubmitting}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent dividers>
          {children}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            color="inherit"
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || disableSubmit}
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default FormDialog;

