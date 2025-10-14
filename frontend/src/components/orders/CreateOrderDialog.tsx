import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
} from '@mui/material';
import { Delete, Search, Add, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGetClientsPageQuery, useGetAllAppliancesQuery } from '@/store/api/apiSlice';
import { QuantityInput } from '@/components';
import type { Client, Appliance, OrderRequestDTO } from '@/types/models';

interface CreateOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OrderRequestDTO) => Promise<void>;
  isLoading?: boolean;
}

interface OrderItem {
  appliance: Appliance;
  quantity: number;
  subtotal: number;
}

export const CreateOrderDialog: React.FC<CreateOrderDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const steps = [t('order.selectClient'), t('order.addItems')];

  // Step 1: Client selection
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  // Only fetch clients when dialog is open to avoid 403 errors for clients
  const { data: clientsData } = useGetClientsPageQuery(
    { page: 0, size: 1000 },
    { skip: !open }
  );
  const clients = clientsData?.content || [];

  // Step 2: Items selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppliance, setSelectedAppliance] = useState<Appliance | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Only fetch appliances when dialog is open
  const { data: appliancesData } = useGetAllAppliancesQuery(
    { page: 0, size: 1000 },
    { skip: !open }
  );
  const appliances = appliancesData?.content || [];

  // Filter appliances based on search
  const filteredAppliances = searchQuery
    ? appliances.filter(
        app =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : appliances;

  // Calculate total amount
  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setSelectedClientId(null);
      setSelectedAppliance(null);
      setQuantity(1);
      setOrderItems([]);
      setSearchQuery('');
    }
  }, [open]);

  const handleNext = () => {
    if (activeStep === 0 && selectedClientId) {
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleAddItem = () => {
    if (selectedAppliance && quantity > 0) {
      const existingItemIndex = orderItems.findIndex(
        item => item.appliance.id === selectedAppliance.id
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...orderItems];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].subtotal =
          updatedItems[existingItemIndex].quantity * selectedAppliance.price;
        setOrderItems(updatedItems);
      } else {
        // Add new item
        const newItem: OrderItem = {
          appliance: selectedAppliance,
          quantity,
          subtotal: quantity * selectedAppliance.price,
        };
        setOrderItems([...orderItems, newItem]);
      }

      // Reset selection
      setSelectedAppliance(null);
      setQuantity(1);
      setSearchQuery('');
    }
  };

  const handleRemoveItem = (applianceId: number) => {
    setOrderItems(orderItems.filter(item => item.appliance.id !== applianceId));
  };

  const handleQuantityChange = (applianceId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      const updatedItems = orderItems.map(item => {
        if (item.appliance.id === applianceId) {
          return {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.appliance.price,
          };
        }
        return item;
      });
      setOrderItems(updatedItems);
    }
  };

  const handleSubmit = async () => {
    if (selectedClientId && orderItems.length > 0) {
      const orderData: OrderRequestDTO = {
        clientId: selectedClientId,
        orderRows: orderItems.map(item => ({
          applianceId: item.appliance.id,
          quantity: item.quantity,
          amount: item.subtotal,  // Add amount field (price * quantity)
        })),
      };

      await onSubmit(orderData);
    }
  };

  const canProceed = activeStep === 0 ? selectedClientId !== null : orderItems.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('order.addOrder')}</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Client Selection */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {t('order.selectClient')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('order.selectClientDescription')}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>{t('order.client')}</InputLabel>
              <Select
                value={selectedClientId || ''}
                onChange={e => setSelectedClientId(Number(e.target.value))}
                label={t('order.client')}
              >
                <MenuItem value="">
                  <em>{t('common.select')}</em>
                </MenuItem>
                {clients.map((client: Client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName} ({client.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Step 2: Add Items */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {t('order.addItems')}
            </Typography>

            {/* Appliance Selection */}
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                options={filteredAppliances}
                getOptionLabel={(option) => `${option.name} - ${option.model} ($${option.price})`}
                value={selectedAppliance}
                onChange={(_, newValue) => setSelectedAppliance(newValue)}
                inputValue={searchQuery}
                onInputChange={(_, newValue) => setSearchQuery(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('order.selectAppliance')}
                    placeholder={t('order.searchAppliances')}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <Search />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  label={t('order.quantity')}
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  slotProps={{
                    htmlInput: { min: 1 },
                  }}
                  sx={{ width: 150 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddItem}
                  disabled={!selectedAppliance}
                  sx={{ height: 56 }}
                >
                  {t('order.addItem')}
                </Button>
              </Box>
            </Box>

            {/* Items List */}
            {orderItems.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                  {t('order.selectedItems')}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('appliance.name')}</TableCell>
                        <TableCell>{t('appliance.model')}</TableCell>
                        <TableCell align="right">{t('appliance.price')}</TableCell>
                        <TableCell align="center" sx={{ width: 120 }}>
                          {t('order.quantity')}
                        </TableCell>
                        <TableCell align="right">{t('order.subtotal')}</TableCell>
                        <TableCell align="center" sx={{ width: 80 }}>
                          {t('common.actions')}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map(item => (
                        <TableRow key={item.appliance.id}>
                          <TableCell>{item.appliance.name}</TableCell>
                          <TableCell>{item.appliance.model}</TableCell>
                          <TableCell align="right">${item.appliance.price.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <QuantityInput
                                value={item.quantity}
                                onChange={(newQty) => handleQuantityChange(item.appliance.id, newQty)}
                                size="small"
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="medium">
                              ${item.subtotal.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(item.appliance.id)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <Typography variant="h6" fontWeight="bold">
                            {t('order.total')}:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            ${totalAmount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {orderItems.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('order.noItemsAdded')}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {t('common.cancel')}
        </Button>
        <Box sx={{ flex: 1 }} />
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={isLoading}>
            {t('common.back')}
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext} disabled={!canProceed || isLoading}>
            {t('common.next')}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canProceed || isLoading}
          >
            {isLoading ? t('common.saving') : t('order.createOrder')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderDialog;
