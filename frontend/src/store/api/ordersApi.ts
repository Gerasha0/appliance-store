import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import type {
  OrderResponseDTO,
  OrderRequestDTO,
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

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery,
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getAllOrders: builder.query<PageResponse<OrderResponseDTO>, {
      page?: number;
      size?: number;
      sort?: string;
    }>({
      query: ({ page = 0, size = 10, sort = 'id,asc' }) => ({
        url: '/orders',
        params: { page, size, sort },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrdersByClient: builder.query<PageResponse<OrderResponseDTO>, {
      clientId: number;
      page?: number;
      size?: number;
    }>({
      query: ({ clientId, page = 0, size = 10 }) => ({
        url: `/orders/client/${clientId}`,
        params: { page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'CLIENT_LIST' },
            ]
          : [{ type: 'Order', id: 'CLIENT_LIST' }],
    }),

    getOrdersByEmployee: builder.query<PageResponse<OrderResponseDTO>, {
      employeeId: number;
      page?: number;
      size?: number;
    }>({
      query: ({ employeeId, page = 0, size = 10 }) => ({
        url: `/orders/employee/${employeeId}`,
        params: { page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'EMPLOYEE_LIST' },
            ]
          : [{ type: 'Order', id: 'EMPLOYEE_LIST' }],
    }),

    getOrdersByStatus: builder.query<PageResponse<OrderResponseDTO>, {
      approved: boolean;
      page?: number;
      size?: number;
    }>({
      query: ({ approved, page = 0, size = 10 }) => ({
        url: `/orders/status/${approved}`,
        params: { page, size },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'STATUS_LIST' },
            ]
          : [{ type: 'Order', id: 'STATUS_LIST' }],
    }),

    getOrderById: builder.query<OrderResponseDTO, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<OrderResponseDTO, OrderRequestDTO>({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: [
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: 'CLIENT_LIST' },
        { type: 'Order', id: 'STATUS_LIST' },
      ],
    }),

    updateOrder: builder.mutation<OrderResponseDTO, {
      id: number;
      order: OrderRequestDTO;
    }>({
      query: ({ id, order }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: order,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: 'CLIENT_LIST' },
        { type: 'Order', id: 'STATUS_LIST' },
      ],
    }),

    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: 'CLIENT_LIST' },
        { type: 'Order', id: 'STATUS_LIST' },
      ],
    }),

    approveOrder: builder.mutation<OrderResponseDTO, number>({
      query: (id) => ({
        url: `/orders/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: 'CLIENT_LIST' },
        { type: 'Order', id: 'EMPLOYEE_LIST' },
        { type: 'Order', id: 'STATUS_LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrdersByClientQuery,
  useGetOrdersByEmployeeQuery,
  useGetOrdersByStatusQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useApproveOrderMutation,
} = ordersApi;