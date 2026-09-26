import { configureStore } from '@reduxjs/toolkit'
import authReduce from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReduce,
  },
})