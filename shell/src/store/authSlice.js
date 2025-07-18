// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    page: 'my-requests',
    availableScreens: []
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setAvailableScreens: (state, action) => {
      state.availableScreens = action.payload;    
    },
  }
});

export const { setToken, clearToken,setPage,setAvailableScreens } = authSlice.actions;
export default authSlice.reducer;
