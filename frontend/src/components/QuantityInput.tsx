import React from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'small' | 'medium';
  showLabel?: boolean;
  label?: string;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  size = 'small',
  showLabel = false,
  label,
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= min && val <= max) {
      onChange(val);
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  const handleBlur = () => {
    if (value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {showLabel && label && (
        <Typography variant="body2" sx={{ mr: 1 }}>
          {label}:
        </Typography>
      )}
      <IconButton
        size={size}
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <RemoveIcon fontSize={size} />
      </IconButton>
      <TextField
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        size={size}
        sx={{
          width: size === 'small' ? 60 : 70,
          '& input': {
            textAlign: 'center',
            fontWeight: 500,
            padding: size === 'small' ? '6px 8px' : '8px 12px',
          },
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
        }}
        slotProps={{
          htmlInput: {
            min,
            max,
            type: 'number',
            style: { textAlign: 'center' },
          },
        }}
      />
      <IconButton
        size={size}
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <AddIcon fontSize={size} />
      </IconButton>
    </Box>
  );
};

export default QuantityInput;