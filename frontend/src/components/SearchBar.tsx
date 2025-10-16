import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import type { TextFieldProps } from '@mui/material';

export interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
  debounceDelay?: number;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  textFieldProps?: Partial<TextFieldProps>;
  onChange?: (value: string) => void;
  minLength?: number;
  showClearButton?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value: controlledValue,
  onSearch,
  debounceDelay = 500,
  placeholder = 'Search...',
  loading = false,
  disabled = false,
  fullWidth = false,
  size = 'medium',
  textFieldProps = {},
  onChange,
  minLength = 0,
  showClearButton = true,
  autoFocus = false,
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== internalValue) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    if (!isTyping) return;

    const timer = setTimeout(() => {
      if (internalValue.length >= minLength) {
        onSearch(internalValue);
      } else if (internalValue.length === 0) {
        onSearch('');
      }
      setIsTyping(false);
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [internalValue, debounceDelay, minLength, onSearch, isTyping]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    setIsTyping(true);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleClear = useCallback(() => {
    setInternalValue('');
    setIsTyping(false);
    onSearch('');
    
    if (onChange) {
      onChange('');
    }
  }, [onSearch, onChange]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsTyping(false);
      if (internalValue.length >= minLength) {
        onSearch(internalValue);
      } else if (internalValue.length === 0) {
        onSearch('');
      }
    }
    
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  const showLoading = loading || isTyping;
  const showClear = showClearButton && internalValue.length > 0 && !disabled;

  return (
    <TextField
      value={internalValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      autoFocus={autoFocus}
      {...textFieldProps}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color={disabled ? 'disabled' : 'action'} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {showLoading && (
                <CircularProgress size={20} sx={{ mr: showClear ? 1 : 0 }} />
              )}
              {showClear && (
                <IconButton
                  size="small"
                  onClick={handleClear}
                  edge="end"
                  aria-label="Clear search"
                  disabled={disabled}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
          ...textFieldProps?.slotProps?.input,
        },
      }}
    />
  );
};

export default SearchBar;