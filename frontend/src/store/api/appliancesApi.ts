import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type {
  ApplianceResponseDTO,
  ApplianceRequestDTO,
  PageResponse,
  Category,
  PowerType,
} from '@/types/models';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const appliancesApi = createApi({
  reducerPath: 'appliancesApi',
  baseQuery,
  tagTypes: ['Appliance'],
  endpoints: (builder) => ({
    getAllAppliances: builder.query<PageResponse<ApplianceResponseDTO>, {
      page?: number;
      size?: number;
      sort?: string;
    }>({
      query: ({ page = 0, size = 10, sort = 'id,asc' }) => ({
        url: '/appliances',
        params: { page, size, sort },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Appliance' as const, id })),
              { type: 'Appliance', id: 'LIST' },
            ]
          : [{ type: 'Appliance', id: 'LIST' }],
    }),

    searchAppliances: builder.query<PageResponse<ApplianceResponseDTO>, {
      query: string;
      page?: number;
      size?: number;
    }>({
      query: ({ query, page = 0, size = 10 }) => ({
        url: '/appliances/search',
        params: { query, page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Appliance' as const, id })),
              { type: 'Appliance', id: 'SEARCH' },
            ]
          : [{ type: 'Appliance', id: 'SEARCH' }],
    }),

    getAppliancesByCategory: builder.query<PageResponse<ApplianceResponseDTO>, {
      category: Category;
      page?: number;
      size?: number;
    }>({
      query: ({ category, page = 0, size = 10 }) => ({
        url: `/appliances/category/${category}`,
        params: { page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Appliance' as const, id })),
              { type: 'Appliance', id: 'CATEGORY' },
            ]
          : [{ type: 'Appliance', id: 'CATEGORY' }],
    }),

    getAppliancesByPowerType: builder.query<PageResponse<ApplianceResponseDTO>, {
      powerType: PowerType;
      page?: number;
      size?: number;
    }>({
      query: ({ powerType, page = 0, size = 10 }) => ({
        url: `/appliances/power-type/${powerType}`,
        params: { page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Appliance' as const, id })),
              { type: 'Appliance', id: 'POWER_TYPE' },
            ]
          : [{ type: 'Appliance', id: 'POWER_TYPE' }],
    }),

    getApplianceById: builder.query<ApplianceResponseDTO, number>({
      query: (id) => `/appliances/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Appliance', id }],
    }),

    createAppliance: builder.mutation<ApplianceResponseDTO, ApplianceRequestDTO>({
      query: (appliance) => ({
        url: '/appliances',
        method: 'POST',
        body: appliance,
      }),
      invalidatesTags: [{ type: 'Appliance', id: 'LIST' }],
    }),

    updateAppliance: builder.mutation<ApplianceResponseDTO, {
      id: number;
      appliance: ApplianceRequestDTO;
    }>({
      query: ({ id, appliance }) => ({
        url: `/appliances/${id}`,
        method: 'PUT',
        body: appliance,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Appliance', id },
        { type: 'Appliance', id: 'LIST' },
      ],
    }),

    deleteAppliance: builder.mutation<void, number>({
      query: (id) => ({
        url: `/appliances/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Appliance', id },
        { type: 'Appliance', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllAppliancesQuery,
  useSearchAppliancesQuery,
  useGetAppliancesByCategoryQuery,
  useGetAppliancesByPowerTypeQuery,
  useGetApplianceByIdQuery,
  useCreateApplianceMutation,
  useUpdateApplianceMutation,
  useDeleteApplianceMutation,
} = appliancesApi;