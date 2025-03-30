import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://blog-platform.kata.academy/api',
    prepareHeaders: (headers) => {
     
        const token=localStorage.getItem('token')
        if (token) {
            headers.set('Authorization', `Token ${token}`);
          }
          return headers;
        },
        timeout:10000,
  }),
  tagTypes: ['Article'],
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
      }),
    }),
    getArticle: builder.query({
      query: (slug) => ({
        url: `/articles/${slug}`,
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
          localStorage.setItem('user',JSON.stringify(response.user))
          return response.user;
        },
        transformErrorResponse: (response) => {
          return response.data.errors || 'Login failed';
        },
        invalidatesTags: ['Article'],
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

      editUser: builder.mutation({
        query:(userData)=>({
            url:`/user`,
            method:'PUT',
            body:userData,
        }),
        transformResponse:(response)=>{
            localStorage.setItem('user',JSON.stringify(response.user))
            localStorage.setItem('token',response.user.token)
            return response.user}
      }),

      createPost:builder.mutation({
        query:(postData)=>({
          url:`/articles`,
          method:'POST',
          body:{
            article:postData
          },
        }),
        invalidatesTags: ['Article'],
      }),

      editPost: builder.mutation({
        query: ({ slug, ...postData }) => ({  // Изменено на объект параметров
          url: `/articles/${slug}`,
          method: 'PUT',
          body: { article: postData }  // Убедитесь, что структура соответствует API
        }),
        invalidatesTags: ['Article'],
      }),

      deletePost:builder.mutation({
        query:(slug)=>({
          url:`/articles/${slug}`,
          method:"DELETE"
        }),
        invalidatesTags: ['Article'],
      })

  })
});

export const { 
  useGetArticlesQuery,
  useGetArticleQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
  useEditUserMutation,
  useCreatePostMutation,
  useDeletePostMutation,
  useEditPostMutation,
} = api;