import { RootState } from "..";

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthToken = (state: RootState) => state.auth.accessToken;
