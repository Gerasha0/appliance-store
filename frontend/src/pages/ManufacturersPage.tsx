import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { ManufacturerFormDialog } from '@/components/manufacturers';
import {
  useGetManufacturersPageQuery,
  useSearchManufacturersQuery,
  useCreateManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
} from '@/store/api/apiSlice';
import type { Manufacturer, ManufacturerRequestDTO } from '@/types/models';

const ManufacturersPage: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manufacturerToDelete, setManufacturerToDelete] = useState<Manufacturer | null>(null);

  const shouldSearch = searchQuery.trim().length > 0;
  
  const {
    data: searchData,
    isLoading: searchLoading,
  } = useSearchManufacturersQuery(
    { query: searchQuery, page, size: rowsPerPage },
    { skip: !shouldSearch }
  );

  const {
    data: pageData,
    isLoading: pageLoading,
  } = useGetManufacturersPageQuery(
    { page, size: rowsPerPage },
    { skip: shouldSearch }
  );

  const [createManufacturer] = useCreateManufacturerMutation();
  const [updateManufacturer] = useUpdateManufacturerMutation();
  const [deleteManufacturer] = useDeleteManufacturerMutation();

  const data = shouldSearch ? searchData : pageData;
  const isLoading = shouldSearch ? searchLoading : pageLoading;

  const manufacturers = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleOpenDialog = (manufacturer?: Manufacturer) => {
    setEditingManufacturer(manufacturer || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingManufacturer(null);
  };

  const handleFormSubmit = async (data: ManufacturerRequestDTO) => {
    try {
      if (editingManufacturer) {
        await updateManufacturer({
          id: editingManufacturer.id,
          manufacturer: data,
        }).unwrap();
        enqueueSnackbar(t('manufacturer.updateSuccess'), { variant: 'success' });
      } else {
        await createManufacturer(data).unwrap();
        enqueueSnackbar(t('manufacturer.createSuccess'), { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Save error:', error);
      enqueueSnackbar(t('common.error'), { variant: 'error' });
    }
  };

  const handleDeleteClick = (manufacturer: Manufacturer) => {
    setManufacturerToDelete(manufacturer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (manufacturerToDelete) {
      try {
        await deleteManufacturer(manufacturerToDelete.id).unwrap();
        enqueueSnackbar(t('manufacturer.deleteSuccess'), { variant: 'success' });
        setDeleteDialogOpen(false);
        setManufacturerToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
        enqueueSnackbar(t('common.error'), { variant: 'error' });
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const columns: Column<Manufacturer>[] = [
    {
      id: 'id',
      label: 'ID',
      sortable: true,
      width: 80,
    },
    {
      id: 'name',
      label: t('manufacturer.name'),
      sortable: true,
    },
    {
      id: 'address',
      label: t('manufacturer.address'),
      sortable: true,
    },
    {
      id: 'country',
      label: t('manufacturer.country'),
      sortable: true,
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('manufacturer.title')}</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          {t('manufacturer.addManufacturer')}
        </Button>
      </Box>

        <DataTable
          data={manufacturers}
          columns={columns}
          totalPages={totalPages}
          currentPage={page}
          totalElements={totalElements}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteClick}
          onSearch={handleSearch}
          isLoading={isLoading}
          searchPlaceholder={t('manufacturer.searchPlaceholder')}
          emptyMessage={t('manufacturer.noManufacturers')}
          showSearch={true}
          showActions={true}
        />

        {/* Create/Edit Dialog */}
        <ManufacturerFormDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleFormSubmit}
          manufacturer={editingManufacturer}
          isLoading={isLoading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title={t('common.delete')}
          message={t('manufacturer.deleteConfirm')}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialogOpen(false)}
        />
    </Box>
  );
};

export default ManufacturersPage;