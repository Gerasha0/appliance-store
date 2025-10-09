import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  JwtResponse,
  LoginRequest,
  ClientRequestDTO,
  ClientResponseDTO,
  EmployeeRequestDTO,
  EmployeeResponseDTO,
} from '@/types/models';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  prepareHeaders: (headers) => {
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<JwtResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Register Client endpoint
    registerClient: builder.mutation<ClientResponseDTO, ClientRequestDTO>({
      query: (client) => ({
        url: '/auth/register/client',
        method: 'POST',
        body: client,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Register Employee endpoint
    registerEmployee: builder.mutation<EmployeeResponseDTO, EmployeeRequestDTO>({
      query: (employee) => ({
        url: '/auth/register/employee',
        method: 'POST',
        body: employee,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRegisterClientMutation,
  useRegisterEmployeeMutation,
} = authApi;

