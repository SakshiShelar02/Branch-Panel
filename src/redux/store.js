import { configureStore } from '@reduxjs/toolkit'
import orderReducer from './slices/orderSlice'
import authReducer from './slices/authSlice'
import branchReducer from './slices/branchSlice'

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    auth: authReducer,
    branch: branchReducer,
  },
})