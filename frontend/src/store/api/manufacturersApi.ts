import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type {
  ManufacturerResponseDTO,
  ManufacturerRequestDTO,
  PageResponse,
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

export const manufacturersApi = createApi({
  reducerPath: 'manufacturersApi',
  baseQuery,
  tagTypes: ['Manufacturer'],
  endpoints: (builder) => ({
    // Get all manufacturers with pagination [EMPLOYEE ONLY]
    getAllManufacturers: builder.query<PageResponse<ManufacturerResponseDTO>, {
      page?: number;
      size?: number;
      sort?: string;
    }>({
      query: ({ page = 0, size = 10, sort = 'id,asc' }) => ({
        url: '/manufacturers',
        params: { page, size, sort },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Manufacturer' as const, id })),
              { type: 'Manufacturer', id: 'LIST' },
            ]
          : [{ type: 'Manufacturer', id: 'LIST' }],
    }),

    // Search manufacturers [EMPLOYEE ONLY]
    searchManufacturers: builder.query<PageResponse<ManufacturerResponseDTO>, {
      query: string;
      page?: number;
      size?: number;
    }>({
      query: ({ query, page = 0, size = 10 }) => ({
        url: '/manufacturers/search',
        params: { query, page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Manufacturer' as const, id })),
              { type: 'Manufacturer', id: 'SEARCH' },
            ]
          : [{ type: 'Manufacturer', id: 'SEARCH' }],
    }),

    // Get manufacturer by ID [EMPLOYEE ONLY]
    getManufacturerById: builder.query<ManufacturerResponseDTO, number>({
      query: (id) => `/manufacturers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Manufacturer', id }],
    }),

    // Create manufacturer [EMPLOYEE ONLY]
    createManufacturer: builder.mutation<ManufacturerResponseDTO, ManufacturerRequestDTO>({
      query: (manufacturer) => ({
        url: '/manufacturers',
        method: 'POST',
        body: manufacturer,
      }),
      invalidatesTags: [{ type: 'Manufacturer', id: 'LIST' }],
    }),

    // Update manufacturer [EMPLOYEE ONLY]
    updateManufacturer: builder.mutation<ManufacturerResponseDTO, {
      id: number;
      manufacturer: ManufacturerRequestDTO;
    }>({
      query: ({ id, manufacturer }) => ({
        url: `/manufacturers/${id}`,
        method: 'PUT',
        body: manufacturer,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Manufacturer', id },
        { type: 'Manufacturer', id: 'LIST' },
      ],
    }),

    // Delete manufacturer [EMPLOYEE ONLY]
    deleteManufacturer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/manufacturers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Manufacturer', id },
        { type: 'Manufacturer', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllManufacturersQuery,
  useSearchManufacturersQuery,
  useGetManufacturerByIdQuery,
  useCreateManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
} = manufacturersApi;

