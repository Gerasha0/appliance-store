import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  InputAdornment,
  Chip,
  TableSortLabel,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Search as SearchIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ApplianceFormDialog, ApplianceDetailDialog, ApplianceCard } from '@/components/appliances';
import {
  useGetAllAppliancesQuery,
  useCreateApplianceMutation,
  useUpdateApplianceMutation,
  useDeleteApplianceMutation,
  useGetAllManufacturersQuery,
} from '@/store/api/apiSlice';
import type { Appliance, ApplianceRequestDTO } from '@/types/models';
import { Category, PowerType, UserRole } from '@/types/models';
import { useAppSelector } from '@/store';

type SortOrder = 'asc' | 'desc';
type SortField = 'name' | 'category' | 'powerType' | 'price' | 'manufacturer';

const AppliancesPage: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const role = useAppSelector(state => state.auth.role);
  const isEmployee = role === UserRole.EMPLOYEE;
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: appliancesData, isLoading } = useGetAllAppliancesQuery({ page: 0, size: 1000 });
  // Only fetch manufacturers for employees (for creating/editing appliances)
  const { data: manufacturersData } = useGetAllManufacturersQuery(
    { page: 0, size: 1000 },
    { skip: !isEmployee }
  );
  const [createAppliance] = useCreateApplianceMutation();
  const [updateAppliance] = useUpdateApplianceMutation();
  const [deleteAppliance] = useDeleteApplianceMutation();

  // Extract arrays from paginated responses
  const appliances = appliancesData?.content || [];
  const manufacturers = manufacturersData?.content || [];

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applianceToDelete, setApplianceToDelete] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [viewingAppliance, setViewingAppliance] = useState<Appliance | null>(null);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [powerTypeFilter, setPowerTypeFilter] = useState<string>('ALL');
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('ALL');
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sort states
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // View mode state
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Read category filter from URL on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && (categoryParam === 'BIG' || categoryParam === 'SMALL')) {
      setCategoryFilter(categoryParam);
      // Clear the URL parameter after applying the filter
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Adjust rowsPerPage when switching view modes
  useEffect(() => {
    if (viewMode === 'grid') {
      setRowsPerPage(12); // Better for grid layout
      setPage(0); // Reset to first page
    } else {
      setRowsPerPage(10); // Standard for table
      setPage(0); // Reset to first page
    }
  }, [viewMode]);

  const handleOpenDialog = (appliance?: Appliance) => {
    setEditingAppliance(appliance || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAppliance(null);
  };

  const handleFormSubmit = async (data: ApplianceRequestDTO) => {
    try {
      if (editingAppliance) {
        await updateAppliance({
          id: editingAppliance.id,
          appliance: data,
        }).unwrap();
        enqueueSnackbar(t('appliance.updateSuccess'), { variant: 'success' });
      } else {
        await createAppliance(data).unwrap();
        enqueueSnackbar(t('appliance.createSuccess'), { variant: 'success' });
      }
    } catch (err) {
      console.error('Failed to save appliance:', err);
      enqueueSnackbar(t('common.error'), { variant: 'error' });
      throw err; // Re-throw to let the form handle it
    }
  };

  const handleDeleteClick = (id: number) => {
    setApplianceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (applianceToDelete) {
      try {
        await deleteAppliance(applianceToDelete).unwrap();
        enqueueSnackbar(t('appliance.deleteSuccess'), { variant: 'success' });
        setDeleteDialogOpen(false);
        setApplianceToDelete(null);
      } catch (err) {
        console.error('Failed to delete appliance:', err);
        enqueueSnackbar(t('common.error'), { variant: 'error' });
      }
    }
  };

  const handleViewDetails = (appliance: Appliance) => {
    setViewingAppliance(appliance);
    setDetailDialogOpen(true);
  };

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setPowerTypeFilter('ALL');
    setManufacturerFilter('ALL');
  };

  // Filter, search and sort logic
  const filteredAndSortedAppliances = useMemo(() => {
    if (!appliances.length) return [];

    let filtered = [...appliances];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(appliance =>
        appliance.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(appliance => appliance.category === categoryFilter);
    }

    // PowerType filter
    if (powerTypeFilter !== 'ALL') {
      filtered = filtered.filter(appliance => appliance.powerType === powerTypeFilter);
    }

    // Manufacturer filter
    if (manufacturerFilter !== 'ALL') {
      filtered = filtered.filter(
        appliance => appliance.manufacturerId === parseInt(manufacturerFilter)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === 'manufacturer') {
        aValue =
          manufacturers?.find((m) => m.id === a.manufacturerId)?.name.toLowerCase() || '';
        bValue =
          manufacturers?.find((m) => m.id === b.manufacturerId)?.name.toLowerCase() || '';
      } else {
        const aFieldValue = a[sortField];
        const bFieldValue = b[sortField];
        aValue =
          typeof aFieldValue === 'string'
            ? aFieldValue.toLowerCase()
            : aFieldValue;
        bValue =
          typeof bFieldValue === 'string'
            ? bFieldValue.toLowerCase()
            : bFieldValue;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    appliances,
    searchQuery,
    categoryFilter,
    powerTypeFilter,
    manufacturerFilter,
    sortField,
    sortOrder,
    manufacturers,
  ]);

  const paginatedAppliances = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredAndSortedAppliances.slice(start, end);
  }, [filteredAndSortedAppliances, page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    categoryFilter !== 'ALL' ||
    powerTypeFilter !== 'ALL' ||
    manufacturerFilter !== 'ALL';

  return (
    <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">{t('appliance.title')}</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* View Mode Toggle */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => setViewMode('table')}
                color={viewMode === 'table' ? 'primary' : 'default'}
              >
                <ViewListIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <ViewModuleIcon />
              </IconButton>
            </Box>
            {isEmployee && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                {t('appliance.addAppliance')}
              </Button>
            )}
          </Box>
        </Box>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Search */}
            <TextField
              fullWidth
              placeholder={t('appliance.searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Filters Row */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterIcon fontSize="small" />
                {t('common.filter')}:
              </Typography>

              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel>{t('appliance.category')}</InputLabel>
                <Select
                  value={categoryFilter}
                  label={t('appliance.category')}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="ALL">{t('common.all')}</MenuItem>
                  {Object.values(Category).map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {t(`appliance.categories.${cat}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel>{t('appliance.powerType')}</InputLabel>
                <Select
                  value={powerTypeFilter}
                  label={t('appliance.powerType')}
                  onChange={e => setPowerTypeFilter(e.target.value)}
                >
                  <MenuItem value="ALL">{t('common.all')}</MenuItem>
                  {Object.values(PowerType).map(pt => (
                    <MenuItem key={pt} value={pt}>
                      {t(`appliance.powerTypes.${pt}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>{t('appliance.manufacturer')}</InputLabel>
                <Select
                  value={manufacturerFilter}
                  label={t('appliance.manufacturer')}
                  onChange={e => setManufacturerFilter(e.target.value)}
                >
                  <MenuItem value="ALL">{t('common.all')}</MenuItem>
                  {manufacturers?.map(m => (
                    <MenuItem key={m.id} value={m.id.toString()}>
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {hasActiveFilters && (
                <Button variant="outlined" size="small" onClick={handleClearFilters}>
                  {t('common.clear')}
                </Button>
              )}
            </Box>

            {/* Active Filters Chips */}
            {hasActiveFilters && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {searchQuery && (
                  <Chip
                    label={`${t('common.search')}: ${searchQuery}`}
                    size="small"
                    onDelete={() => setSearchQuery('')}
                  />
                )}
                {categoryFilter !== 'ALL' && (
                  <Chip
                    label={t('appliance.category') + ': ' + t(`appliance.categories.${categoryFilter}`)}
                    size="small"
                    onDelete={() => setCategoryFilter('ALL')}
                  />
                )}
                {powerTypeFilter !== 'ALL' && (
                  <Chip
                    label={t('appliance.powerType') + ': ' + t(`appliance.powerTypes.${powerTypeFilter}`)}
                    size="small"
                    onDelete={() => setPowerTypeFilter('ALL')}
                  />
                )}
                {manufacturerFilter !== 'ALL' && (
                  <Chip
                    label={
                      t('appliance.manufacturer') +
                      ': ' +
                      (manufacturers?.find(m => m.id === parseInt(manufacturerFilter))?.name || '')
                    }
                    size="small"
                    onDelete={() => setManufacturerFilter('ALL')}
                  />
                )}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Results count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('common.showing')} {filteredAndSortedAppliances.length}{' '}
          {filteredAndSortedAppliances.length === 1 ? t('appliance.appliance') : t('appliance.title')}
        </Typography>

        {/* Table View */}
        {viewMode === 'table' ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'name'}
                      direction={sortField === 'name' ? sortOrder : 'asc'}
                      onClick={() => handleSort('name')}
                    >
                      {t('appliance.name')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'category'}
                      direction={sortField === 'category' ? sortOrder : 'asc'}
                      onClick={() => handleSort('category')}
                    >
                      {t('appliance.category')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'powerType'}
                      direction={sortField === 'powerType' ? sortOrder : 'asc'}
                      onClick={() => handleSort('powerType')}
                    >
                      {t('appliance.powerType')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'price'}
                      direction={sortField === 'price' ? sortOrder : 'asc'}
                      onClick={() => handleSort('price')}
                    >
                      {t('appliance.price')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'manufacturer'}
                      direction={sortField === 'manufacturer' ? sortOrder : 'asc'}
                      onClick={() => handleSort('manufacturer')}
                    >
                      {t('appliance.manufacturer')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppliances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        {t('appliance.noAppliances')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAppliances.map(appliance => (
                    <TableRow key={appliance.id} hover>
                      <TableCell>{appliance.id}</TableCell>
                      <TableCell>{appliance.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`appliance.categories.${appliance.category}`)}
                          size="small"
                          color={appliance.category === Category.BIG ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`appliance.powerTypes.${appliance.powerType}`)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>${appliance.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {manufacturers?.find(m => m.id === appliance.manufacturerId)?.name || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleViewDetails(appliance)}>
                          <ViewIcon />
                        </IconButton>
                        {isEmployee && (
                          <>
                            <IconButton size="small" onClick={() => handleOpenDialog(appliance)}>
                              <Edit />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeleteClick(appliance.id)}>
                              <Delete />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredAndSortedAppliances.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage={t('common.rowsPerPage')}
            />
          </TableContainer>
        ) : (
          /* Grid View */
          <Box>
            {paginatedAppliances.length === 0 ? (
              <Paper sx={{ p: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {t('appliance.noAppliances')}
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
                {paginatedAppliances.map(appliance => (
                  <ApplianceCard
                    key={appliance.id}
                    appliance={appliance}
                    onClick={(app) => handleViewDetails(app)}
                  />
                ))}
              </Box>
            )}
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <TablePagination
                component="div"
                count={filteredAndSortedAppliances.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[8, 12, 24, 48]}
                labelRowsPerPage={t('common.rowsPerPage')}
              />
            </Paper>
          </Box>
        )}

        {/* Edit/Create Dialog */}
        <ApplianceFormDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleFormSubmit}
          appliance={editingAppliance}
          manufacturers={manufacturers || []}
        />

        {/* Detail View Dialog */}
        <ApplianceDetailDialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          appliance={viewingAppliance}
          manufacturers={manufacturers || []}
          onEdit={handleOpenDialog}
          showEditButton={isEmployee}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title={t('common.delete')}
          message={t('appliance.deleteConfirm')}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </Box>
  );
};

export default AppliancesPage;
