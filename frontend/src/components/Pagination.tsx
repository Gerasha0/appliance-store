import React from 'react';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';

export interface PaginationProps {
  /**
   * Current page number (0-indexed)
   */
  page: number;
  /**
   * Number of items per page
   */
  size: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Total number of elements
   */
  totalElements: number;
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Callback when page size changes
   */
  onSizeChange: (size: number) => void;
  /**
   * Available page size options
   * @default [10, 25, 50, 100]
   */
  sizeOptions?: number[];
  /**
   * Whether pagination is disabled
   */
  disabled?: boolean;
  /**
   * Maximum number of page buttons to show
   * @default 5
   */
  maxPageButtons?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  size,
  totalPages,
  totalElements,
  onPageChange,
  onSizeChange,
  sizeOptions = [10, 25, 50, 100],
  disabled = false,
  maxPageButtons = 5,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSizeChange = (event: SelectChangeEvent<number>) => {
    const newSize = Number(event.target.value);
    onSizeChange(newSize);
    // Reset to first page when changing size
    onPageChange(0);
  };

  const handleFirstPage = () => {
    onPageChange(0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      onPageChange(page + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(totalPages - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  /**
   * Generate array of page numbers to display
   */
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= maxPageButtons) {
      // Show all pages if total is less than max
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pages: (number | string)[] = [];
    const halfMax = Math.floor(maxPageButtons / 2);

    let startPage = Math.max(0, page - halfMax);
    let endPage = Math.min(totalPages - 1, page + halfMax);

    // Adjust if we're at the start or end
    if (page - halfMax < 0) {
      endPage = Math.min(totalPages - 1, maxPageButtons - 1);
    }
    if (page + halfMax >= totalPages) {
      startPage = Math.max(0, totalPages - maxPageButtons);
    }

    // Always show first page
    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) {
        pages.push('...');
      }
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = totalElements > 0 ? page * size + 1 : 0;
  const endItem = Math.min((page + 1) * size, totalElements);

  // Don't render if there's no data
  if (totalElements === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        padding: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Items per page selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <Select
          value={size}
          onChange={handleSizeChange}
          disabled={disabled}
          size="small"
          sx={{ minWidth: 70 }}
        >
          {sizeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Page info */}
      <Typography variant="body2" color="text.secondary">
        {startItem}-{endItem} of {totalElements}
      </Typography>

      {/* Page navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {/* First page button */}
        {!isMobile && (
          <IconButton
            onClick={handleFirstPage}
            disabled={disabled || page === 0}
            size="small"
            aria-label="First page"
          >
            <FirstPage />
          </IconButton>
        )}

        {/* Previous page button */}
        <IconButton
          onClick={handlePreviousPage}
          disabled={disabled || page === 0}
          size="small"
          aria-label="Previous page"
        >
          <NavigateBefore />
        </IconButton>

        {/* Page number buttons */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <Typography
                    key={`ellipsis-${pageNum}-${index}`}
                    sx={{
                      px: 1,
                      py: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    ...
                  </Typography>
                );
              }

              const pageNumber = pageNum as number;
              const isActive = pageNumber === page;

              return (
                <Button
                  key={`page-${pageNumber}`}
                  onClick={() => handlePageClick(pageNumber)}
                  disabled={disabled}
                  variant={isActive ? 'contained' : 'text'}
                  size="small"
                  sx={{
                    minWidth: 32,
                    height: 32,
                    px: 1,
                  }}
                >
                  {pageNumber + 1}
                </Button>
              );
            })}
          </Box>
        )}

        {/* Current page indicator for mobile */}
        {isMobile && (
          <Typography variant="body2" sx={{ mx: 1 }}>
            {page + 1} / {totalPages}
          </Typography>
        )}

        {/* Next page button */}
        <IconButton
          onClick={handleNextPage}
          disabled={disabled || page >= totalPages - 1}
          size="small"
          aria-label="Next page"
        >
          <NavigateNext />
        </IconButton>

        {/* Last page button */}
        {!isMobile && (
          <IconButton
            onClick={handleLastPage}
            disabled={disabled || page >= totalPages - 1}
            size="small"
            aria-label="Last page"
          >
            <LastPage />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Pagination;
