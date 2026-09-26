import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("userDetails");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

const initialState = {
  user: parsedUser,
  isAuthenticated: parsedUser ? true : false
} 

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem("userDetails", JSON.stringify(action.payload))
    },
    logout: (state, action) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem("userDetails")
    }
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
