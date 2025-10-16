export {
  useLoginMutation,
  useRegisterClientMutation,
  useRegisterEmployeeMutation,
} from './authApi';

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

export {
  useGetAllManufacturersQuery,
  useSearchManufacturersQuery,
  useGetManufacturerByIdQuery,
  useCreateManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
} from './manufacturersApi';

export {
  useGetAllEmployeesQuery,
  useSearchEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from './employeesApi';

export {
  useGetAllClientsQuery,
  useSearchClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from './clientsApi';

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

export {
  useChangeLocaleMutation,
  useGetCurrentLocaleQuery,
  useGetTranslationsQuery,
  useGetLanguagesQuery,
} from './localeApi';

export { useGetAllClientsQuery as useGetClientsPageQuery } from './clientsApi';
export { useGetAllEmployeesQuery as useGetEmployeesPageQuery } from './employeesApi';
export { useGetAllManufacturersQuery as useGetManufacturersPageQuery } from './manufacturersApi';