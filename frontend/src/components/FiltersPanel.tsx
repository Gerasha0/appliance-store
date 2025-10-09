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
  /**
   * Unique identifier for the filter
   */
  id: string;
  /**
   * Label to display
   */
  label: string;
  /**
   * Current value of the filter
   */
  value: FilterValue;
  /**
   * Render function for the filter control
   */
  render: (value: FilterValue, onChange: (value: FilterValue) => void) => React.ReactNode;
  /**
   * Whether this filter is active
   */
  isActive?: boolean;
}

export interface FiltersPanelProps {
  /**
   * Array of filters to display
   */
  filters: Filter[];
  /**
   * Callback when filters are applied
   */
  onApply: (filters: Record<string, FilterValue>) => void;
  /**
   * Callback when filters are cleared
   */
  onClear?: () => void;
  /**
   * Title of the filters panel
   * @default "Filters"
   */
  title?: string;
  /**
   * Show apply button
   * @default true
   */
  showApplyButton?: boolean;
  /**
   * Show clear all button
   * @default true
   */
  showClearButton?: boolean;
  /**
   * Auto apply filters on change (without Apply button)
   * @default false
   */
  autoApply?: boolean;
  /**
   * Whether the panel is collapsible
   * @default true
   */
  collapsible?: boolean;
  /**
   * Initially collapsed state
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Show filter count badge
   * @default true
   */
  showActiveCount?: boolean;
  /**
   * Elevation of the paper
   * @default 1
   */
  elevation?: number;
  /**
   * Additional styling
   */
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

  // Initialize internal filters from props
  useEffect(() => {
    const initialFilters: Record<string, FilterValue> = {};
    filters.forEach((filter) => {
      initialFilters[filter.id] = filter.value;
    });
    setInternalFilters(initialFilters);
  }, [filters]);

  // Count active filters
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

    // Auto apply if enabled
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
