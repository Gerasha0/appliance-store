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
import { EmployeeFormDialog } from '@/components/employees';
import {
  useGetEmployeesPageQuery,
  useSearchEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from '@/store/api/apiSlice';
import type { Employee, EmployeeRequestDTO } from '@/types/models';

const EmployeesPage: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Use search query if present, otherwise use regular paginated query
  const shouldSearch = searchQuery.trim().length > 0;
  
  const {
    data: searchData,
    isLoading: searchLoading,
  } = useSearchEmployeesQuery(
    { query: searchQuery, page, size: rowsPerPage },
    { skip: !shouldSearch }
  );

  const {
    data: pageData,
    isLoading: pageLoading,
  } = useGetEmployeesPageQuery(
    { page, size: rowsPerPage },
    { skip: shouldSearch }
  );

  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const data = shouldSearch ? searchData : pageData;
  const isLoading = shouldSearch ? searchLoading : pageLoading;

  const employees = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleOpenDialog = (employee?: Employee) => {
    setEditingEmployee(employee || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleFormSubmit = async (data: EmployeeRequestDTO) => {
    try {
      if (editingEmployee) {
        await updateEmployee({
          id: editingEmployee.id,
          employee: data,
        }).unwrap();
        enqueueSnackbar(t('employee.updateSuccess'), { variant: 'success' });
      } else {
        await createEmployee(data).unwrap();
        enqueueSnackbar(t('employee.createSuccess'), { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Save error:', error);
      enqueueSnackbar(t('common.error'), { variant: 'error' });
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete.id).unwrap();
        enqueueSnackbar(t('employee.deleteSuccess'), { variant: 'success' });
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      } catch (error) {
        console.error('Delete error:', error);
        enqueueSnackbar(t('common.error'), { variant: 'error' });
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(0); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  const columns: Column<Employee>[] = [
    {
      id: 'id',
      label: 'ID',
      sortable: true,
      width: 80,
    },
    {
      id: 'firstName',
      label: t('employee.firstName'),
      sortable: true,
    },
    {
      id: 'lastName',
      label: t('employee.lastName'),
      sortable: true,
    },
    {
      id: 'email',
      label: t('auth.email'),
      sortable: true,
    },
    {
      id: 'position',
      label: t('employee.position'),
      sortable: true,
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('employee.title')}</Typography>
        <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            {t('employee.addEmployee')}
          </Button>
        </Box>

        <DataTable
          data={employees}
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
          searchPlaceholder={t('employee.searchPlaceholder')}
          emptyMessage={t('employee.noEmployees')}
          showSearch={true}
          showActions={true}
        />

        {/* Create/Edit Dialog */}
        <EmployeeFormDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleFormSubmit}
          employee={editingEmployee}
          isLoading={isLoading}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title={t('common.delete')}
          message={t('employee.deleteConfirm')}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialogOpen(false)}
        />
    </Box>
  );
};

export default EmployeesPage;
