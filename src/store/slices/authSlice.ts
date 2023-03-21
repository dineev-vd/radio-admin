import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { isAuthenticated?: boolean } = {};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, { payload }: PayloadAction<boolean>) => {
      state.isAuthenticated = payload;
    },
  },
});

export const { setIsAuthenticated } = authSlice.actions;
