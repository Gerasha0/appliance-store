import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export interface LocaleChangeResponse {
  success: string;
  locale: string;
  language: string;
  message: string;
}

export interface LocaleCurrentResponse {
  locale: string;
  language: string;
  displayName: string;
}

export interface LocaleTranslationsResponse {
  [key: string]: string;
}

export interface LocaleLanguagesResponse {
  languages: {
    en: string;
    uk: string;
  };
  current: string;
}

export type LocaleCategory = 'menu' | 'button' | 'appliance' | 'order' | 'client' | 'employee' | 'manufacturer';

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

export const localeApi = createApi({
  reducerPath: 'localeApi',
  baseQuery,
  tagTypes: ['Locale'],
  endpoints: (builder) => ({
    changeLocale: builder.mutation<LocaleChangeResponse, string>({
      query: (lang) => ({
        url: '/locale/change',
        method: 'POST',
        params: { lang },
      }),
      invalidatesTags: ['Locale'],
    }),

    getCurrentLocale: builder.query<LocaleCurrentResponse, void>({
      query: () => '/locale/current',
      providesTags: ['Locale'],
    }),

    getTranslations: builder.query<LocaleTranslationsResponse, LocaleCategory>({
      query: (category) => `/locale/translations/${category}`,
      providesTags: (_result, _error, category) => [{ type: 'Locale', id: category }],
    }),

    getLanguages: builder.query<LocaleLanguagesResponse, void>({
      query: () => '/locale/languages',
      providesTags: ['Locale'],
    }),
  }),
});

export const {
  useChangeLocaleMutation,
  useGetCurrentLocaleQuery,
  useGetTranslationsQuery,
  useGetLanguagesQuery,
} = localeApi;