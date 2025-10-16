import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  Box,
  TextField,
  InputAdornment,
  TableSortLabel,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import { LoadingSpinner } from './LoadingSpinner';

export interface Column<T> {
  id: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalPages: number;
  currentPage: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onSearch?: (query: string) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  showSearch?: boolean;
  showActions?: boolean;
  sx?: SxProps<Theme>;
  getRowId?: (item: T) => string | number;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  totalPages,
  currentPage,
  totalElements = 0,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  onSearch,
  onSort,
  isLoading = false,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No data available',
  rowsPerPage = 10,
  onRowsPerPageChange,
  showSearch = true,
  showActions = true,
  sx,
  getRowId = (item) => item.id,
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSort = (columnId: string) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    const newDirection = isAsc ? 'desc' : 'asc';
    setSortColumn(columnId);
    setSortDirection(newDirection);
    if (onSort) {
      onSort(columnId, newDirection);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newRowsPerPage);
    }
  };

  const hasActions = showActions && (onEdit || onDelete || onView);

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {/* Search Field */}
      {showSearch && onSearch && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        {isLoading ? (
          <LoadingSpinner message="Loading data..." />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id as string}
                    align={column.align || 'left'}
                    style={{ width: column.width }}
                  >
                    {column.sortable && onSort ? (
                      <TableSortLabel
                        active={sortColumn === column.id}
                        direction={sortColumn === column.id ? sortDirection : 'asc'}
                        onClick={() => handleSort(column.id as string)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell align="right" style={{ width: 150 }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (hasActions ? 1 : 0)}
                    align="center"
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => {
                  const rowId = getRowId(item);
                  return (
                    <TableRow key={rowId} hover>
                      {columns.map((column) => (
                        <TableCell key={`${rowId}-${column.id as string}`} align={column.align || 'left'}>
                          {column.render
                            ? column.render(item)
                            : String(item[column.id] ?? '')}
                        </TableCell>
                      ))}
                      {hasActions && (
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            {onView && (
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => onView(item)}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onEdit && (
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => onEdit(item)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => onDelete(item)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <TablePagination
          component="div"
          count={totalElements || totalPages * rowsPerPage}
          page={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange ? handleRowsPerPageChange : undefined}
          rowsPerPageOptions={onRowsPerPageChange ? [5, 10, 25, 50] : []}
        />
      )}
    </Box>
  );
};

export default DataTable;