import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type {
  EmployeeResponseDTO,
  EmployeeRequestDTO,
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

export const employeesApi = createApi({
  reducerPath: 'employeesApi',
  baseQuery,
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    getAllEmployees: builder.query<PageResponse<EmployeeResponseDTO>, {
      page?: number;
      size?: number;
      sort?: string;
    }>({
      query: ({ page = 0, size = 10, sort = 'id,asc' }) => ({
        url: '/employees',
        params: { page, size, sort },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Employee' as const, id })),
              { type: 'Employee', id: 'LIST' },
            ]
          : [{ type: 'Employee', id: 'LIST' }],
    }),

    searchEmployees: builder.query<PageResponse<EmployeeResponseDTO>, {
      query: string;
      page?: number;
      size?: number;
    }>({
      query: ({ query, page = 0, size = 10 }) => ({
        url: '/employees/search',
        params: { query, page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Employee' as const, id })),
              { type: 'Employee', id: 'SEARCH' },
            ]
          : [{ type: 'Employee', id: 'SEARCH' }],
    }),

    getEmployeeById: builder.query<EmployeeResponseDTO, number>({
      query: (id) => `/employees/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Employee', id }],
    }),

    createEmployee: builder.mutation<EmployeeResponseDTO, EmployeeRequestDTO>({
      query: (employee) => ({
        url: '/employees',
        method: 'POST',
        body: employee,
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }],
    }),

    updateEmployee: builder.mutation<EmployeeResponseDTO, {
      id: number;
      employee: EmployeeRequestDTO;
    }>({
      query: ({ id, employee }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: employee,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
    }),

    deleteEmployee: builder.mutation<void, number>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useSearchEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;