import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type {
  ClientResponseDTO,
  ClientRequestDTO,
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

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery,
  tagTypes: ['Client'],
  endpoints: (builder) => ({
    // Get all clients with pagination [EMPLOYEE ONLY]
    getAllClients: builder.query<PageResponse<ClientResponseDTO>, {
      page?: number;
      size?: number;
      sort?: string;
    }>({
      query: ({ page = 0, size = 10, sort = 'id,asc' }) => ({
        url: '/clients',
        params: { page, size, sort },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Client' as const, id })),
              { type: 'Client', id: 'LIST' },
            ]
          : [{ type: 'Client', id: 'LIST' }],
    }),

    // Search clients [EMPLOYEE ONLY]
    searchClients: builder.query<PageResponse<ClientResponseDTO>, {
      query: string;
      page?: number;
      size?: number;
    }>({
      query: ({ query, page = 0, size = 10 }) => ({
        url: '/clients/search',
        params: { query, page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Client' as const, id })),
              { type: 'Client', id: 'SEARCH' },
            ]
          : [{ type: 'Client', id: 'SEARCH' }],
    }),

    // Get client by ID [EMPLOYEE ONLY]
    getClientById: builder.query<ClientResponseDTO, number>({
      query: (id) => `/clients/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Client', id }],
    }),

    // Create client [EMPLOYEE ONLY]
    createClient: builder.mutation<ClientResponseDTO, ClientRequestDTO>({
      query: (client) => ({
        url: '/clients',
        method: 'POST',
        body: client,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),

    // Update client [EMPLOYEE ONLY]
    updateClient: builder.mutation<ClientResponseDTO, {
      id: number;
      client: ClientRequestDTO;
    }>({
      query: ({ id, client }) => ({
        url: `/clients/${id}`,
        method: 'PUT',
        body: client,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' },
      ],
    }),

    // Delete client [EMPLOYEE ONLY]
    deleteClient: builder.mutation<void, number>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetAllClientsQuery,
  useSearchClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;

