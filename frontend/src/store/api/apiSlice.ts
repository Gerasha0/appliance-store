// Re-export all API hooks from individual API modules
// This file serves as a central point for importing all API hooks

// Auth API
export {
  useLoginMutation,
  useRegisterClientMutation,
  useRegisterEmployeeMutation,
} from './authApi';

// Appliances API
export {
  useGetAllAppliancesQuery,
  useSearchAppliancesQuery,
  useGetAppliancesByCategoryQuery,
  useGetAppliancesByPowerTypeQuery,
  useGetApplianceByIdQuery,
  useCreateApplianceMutation,
  useUpdateApplianceMutation,
  useDeleteApplianceMutation,
} from './appliancesApi';

// Manufacturers API
export {
  useGetAllManufacturersQuery,
  useSearchManufacturersQuery,
  useGetManufacturerByIdQuery,
  useCreateManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
} from './manufacturersApi';

// Employees API
export {
  useGetAllEmployeesQuery,
  useSearchEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from './employeesApi';

// Clients API
export {
  useGetAllClientsQuery,
  useSearchClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from './clientsApi';

// Orders API
export {
  useGetAllOrdersQuery,
  useGetOrdersByClientQuery,
  useGetOrdersByEmployeeQuery,
  useGetOrdersByStatusQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useApproveOrderMutation,
} from './ordersApi';

// Locale API
export {
  useChangeLocaleMutation,
  useGetCurrentLocaleQuery,
  useGetTranslationsQuery,
  useGetLanguagesQuery,
} from './localeApi';

// Aliases for backward compatibility with "Page" naming convention
export { useGetAllClientsQuery as useGetClientsPageQuery } from './clientsApi';
export { useGetAllEmployeesQuery as useGetEmployeesPageQuery } from './employeesApi';
export { useGetAllManufacturersQuery as useGetManufacturersPageQuery } from './manufacturersApi';