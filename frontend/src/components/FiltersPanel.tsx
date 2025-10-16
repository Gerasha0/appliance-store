import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

export type FilterValue = string | number | boolean | string[] | number[] | null | undefined;

export interface Filter {
  id: string;
  label: string;
  value: FilterValue;
  render: (value: FilterValue, onChange: (value: FilterValue) => void) => React.ReactNode;
  isActive?: boolean;
}

export interface FiltersPanelProps {
  filters: Filter[];
  onApply: (filters: Record<string, FilterValue>) => void;
  onClear?: () => void;
  title?: string;
  showApplyButton?: boolean;
  showClearButton?: boolean;
  autoApply?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showActiveCount?: boolean;
  elevation?: number;
  sx?: object;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onApply,
  onClear,
  title = 'Filters',
  showApplyButton = true,
  showClearButton = true,
  autoApply = false,
  collapsible = true,
  defaultCollapsed = false,
  showActiveCount = true,
  elevation = 1,
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [internalFilters, setInternalFilters] = useState<Record<string, FilterValue>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const initialFilters: Record<string, FilterValue> = {};
    filters.forEach((filter) => {
      initialFilters[filter.id] = filter.value;
    });
    setInternalFilters(initialFilters);
  }, [filters]);

  const activeFiltersCount = filters.filter((filter) => {
    const value = internalFilters[filter.id];
    return (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true)
    );
  }).length;

  const handleFilterChange = (id: string, value: FilterValue) => {
    const newFilters = {
      ...internalFilters,
      [id]: value,
    };
    setInternalFilters(newFilters);
    setHasChanges(true);

    if (autoApply) {
      onApply(newFilters);
      setHasChanges(false);
    }
  };

  const handleApply = () => {
    onApply(internalFilters);
    setHasChanges(false);
  };

  const handleClear = () => {
    const clearedFilters: Record<string, FilterValue> = {};
    filters.forEach((filter) => {
      clearedFilters[filter.id] = Array.isArray(filter.value) ? [] : '';
    });
    setInternalFilters(clearedFilters);
    setHasChanges(false);
    
    if (autoApply) {
      onApply(clearedFilters);
    }
    
    if (onClear) {
      onClear();
    }
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Paper
      elevation={elevation}
      sx={{
        ...sx,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: collapsible ? 'pointer' : 'default',
        }}
        onClick={collapsible ? handleToggleCollapse : undefined}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="action" />
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {showActiveCount && hasActiveFilters && (
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              {activeFiltersCount}
            </Box>
          )}
        </Box>
        {collapsible && (
          <IconButton
            size="small"
            sx={{
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Filters Content */}
      <Collapse in={!collapsed} timeout="auto">
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {filters.map((filter) => (
              <Box key={filter.id}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: 'text.secondary',
                  }}
                >
                  {filter.label}
                </Typography>
                {filter.render(
                  internalFilters[filter.id],
                  (value) => handleFilterChange(filter.id, value)
                )}
              </Box>
            ))}
          </Stack>

          {/* Action Buttons */}
          {!autoApply && (showApplyButton || showClearButton) && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexDirection: isMobile ? 'column' : 'row',
                }}
              >
                {showApplyButton && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApply}
                    disabled={!hasChanges}
                    startIcon={<CheckIcon />}
                    fullWidth={isMobile}
                  >
                    Apply
                  </Button>
                )}
                {showClearButton && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClear}
                    disabled={!hasActiveFilters}
                    startIcon={<ClearIcon />}
                    fullWidth={isMobile}
                  >
                    Clear All
                  </Button>
                )}
              </Box>
            </>
          )}

          {/* Auto-apply mode with clear button */}
          {autoApply && showClearButton && hasActiveFilters && (
            <>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClear}
                startIcon={<ClearIcon />}
                fullWidth={isMobile}
              >
                Clear All Filters
              </Button>
            </>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FiltersPanel;