import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ClientFormDialog } from '@/components/clients/ClientFormDialog';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import {
  useGetClientsPageQuery,
  useSearchClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from '@/store/api/apiSlice';
import type { Client, ClientRequestDTO } from '@/types/models';

const ClientsPage: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const shouldSearch = searchQuery.trim().length > 0;
  
  const {
    data: searchData,
    isLoading: searchLoading,
  } = useSearchClientsQuery(
    { query: searchQuery, page, size: rowsPerPage },
    { skip: !shouldSearch }
  );

  const {
    data: pageData,
    isLoading: pageLoading,
  } = useGetClientsPageQuery(
    { page, size: rowsPerPage },
    { skip: shouldSearch }
  );

  const [deleteClient] = useDeleteClientMutation();
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();

  const data = shouldSearch ? searchData : pageData;
  const isLoading = shouldSearch ? searchLoading : pageLoading;

  const clients = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;

  const handleAddClick = () => {
    setClientToEdit(null);
    setFormDialogOpen(true);
  };

  const handleEditClick = (client: Client) => {
    setClientToEdit(client);
    setFormDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setClientToEdit(null);
  };

  const handleFormSubmit = async (data: ClientRequestDTO) => {
    try {
      if (clientToEdit) {
        await updateClient({ id: clientToEdit.id, client: data }).unwrap();
        enqueueSnackbar(t('client.updateSuccess'), { variant: 'success' });
      } else {
        await createClient(data).unwrap();
        enqueueSnackbar(t('client.createSuccess'), { variant: 'success' });
      }
      handleFormClose();
    } catch (error) {
      console.error('Form submit error:', error);
      enqueueSnackbar(
        clientToEdit ? t('client.updateError') : t('client.createError'),
        { variant: 'error' }
      );
    }
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (clientToDelete) {
      try {
        await deleteClient(clientToDelete.id).unwrap();
        enqueueSnackbar(t('client.deleteSuccess'), { variant: 'success' });
        setDeleteDialogOpen(false);
        setClientToDelete(null);
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

  const handleViewOrders = (clientId: number) => {
    navigate(`/orders?clientId=${clientId}`);
  };

  const columns: Column<Client>[] = [
    {
      id: 'id',
      label: 'ID',
      sortable: true,
      width: 80,
    },
    {
      id: 'firstName',
      label: t('client.firstName'),
      sortable: true,
    },
    {
      id: 'lastName',
      label: t('client.lastName'),
      sortable: true,
    },
    {
      id: 'email',
      label: t('auth.email'),
      sortable: true,
    },
    {
      id: 'phone',
      label: t('client.phone'),
      sortable: true,
    },
    {
      id: 'address',
      label: t('client.address'),
      sortable: true,
    },
    {
      id: 'orders' as keyof Client,
      label: t('client.orders'),
      sortable: false,
      render: (client: Client) => (
        <Tooltip title={t('client.viewOrders')}>
          <IconButton onClick={() => handleViewOrders(client.id)} size="small">
            <Visibility />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">{t('client.title')}</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            {t('client.addClient')}
          </Button>
        </Box>

        <DataTable
          data={clients}
          columns={columns}
          totalPages={totalPages}
          currentPage={page}
          totalElements={totalElements}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onSearch={handleSearch}
          isLoading={isLoading}
          searchPlaceholder={t('client.searchPlaceholder')}
          emptyMessage={t('client.noClients')}
          showSearch={true}
          showActions={true}
        />

        {/* Create/Edit Dialog */}
        <ClientFormDialog
          open={formDialogOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          client={clientToEdit}
          isLoading={isCreating || isUpdating}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          title={t('common.delete')}
          message={t('client.deleteConfirm')}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialogOpen(false)}
        />
    </Box>
  );
};

export default ClientsPage;