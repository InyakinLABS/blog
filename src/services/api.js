import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://blog-platform.kata.academy/api',
    prepareHeaders: (headers, { getState }) => {
        // Получаем токен из хранилища Redux
        const { isLoggedIn, token } = getState().auth;
        
        // Если токен есть, добавляем его в заголовки
        if (isLoggedIn && token) {
            headers.set('Authorization', `Token ${token}`);
          }
          return headers;
        }
  }),
  tagTypes: ['Article'], // Убедитесь что это есть
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ limit = 5, offset = 0 }) => ({
        url: '/articles',
        params: { limit, offset }
      }),
      providesTags: (result) => 
        result?.articles 
          ? [
              ...result.articles.map(({ slug }) => ({ type: 'Article', id: slug })),
              { type: 'Article', id: 'LIST' }
            ]
          : [{ type: 'Article', id: 'LIST' }],
      transformResponse: (response) => ({
        articles: response.articles,
        articlesCount: response.articlesCount
      })
    }),
    getArticle: builder.query({
      query: (slug) => ({
        url: `/articles/${slug}`,
        // Параметр slug уже в URL, поэтому params не нужен
      }),
      transformResponse: (response) => response.article
    }),
    registerUser: builder.mutation({
        query: (userData) => ({
          url: `/users`,
          method:'POST',
          body:{user:userData},
          
        }),
        transformResponse: (response) => response.user
      }),
      loginUser: builder.mutation({
        query: (userData) => ({
          url: '/users/login',
          method: 'POST',
          body: { user: userData }
        }),
        transformResponse: (response) => {
          localStorage.setItem('token', response.user.token);
          return response.user;
        },
        transformErrorResponse: (response) => {
          return response.data.errors || 'Login failed';
        }
      }),
      favoriteArticle: builder.mutation({
        query: (slug) => ({
          url: `/articles/${slug}/favorite`,
          method: 'POST',
        }),
        transformResponse: (response) => response.article,
        invalidatesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
      }),
      unfavoriteArticle: builder.mutation({
        query: (slug) => ({
          url: `/articles/${slug}/favorite`,
          method: 'DELETE'
        }),
        transformResponse: (response) => response.article,
        invalidatesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
    }),
  })
});

// Экспортируем все автоматически сгенерированные хуки
export const { 
  useGetArticlesQuery,
  useGetArticleQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
  // Другие хуки будут здесь по мере добавления endpoints
} = api;