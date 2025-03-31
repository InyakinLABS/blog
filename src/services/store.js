import { configureStore } from '@reduxjs/toolkit'

import { api } from './api'
import authReducer from './authSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})
