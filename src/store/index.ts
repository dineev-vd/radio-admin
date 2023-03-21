import { configureStore } from "@reduxjs/toolkit";
import radioApi from "./api";
import { authSlice } from "./slices/authSlice";

const store = configureStore({
  reducer: {
    [radioApi.reducerPath]: radioApi.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(radioApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
