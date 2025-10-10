import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import type {
  ClientResponseDTO,
  EmployeeResponseDTO,
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

export interface ProfileUpdateDTO {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  // Client-specific fields
  phone?: string;
  address?: string;
  card?: string;
  // Employee-specific field
  position?: string;
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery,
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // Get current user profile
    getProfile: builder.query<ClientResponseDTO | EmployeeResponseDTO, void>({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),

    // Update current user profile
    updateProfile: builder.mutation<ClientResponseDTO | EmployeeResponseDTO, ProfileUpdateDTO>({
      query: (profile) => ({
        url: '/profile',
        method: 'PUT',
        body: profile,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = profileApi;
