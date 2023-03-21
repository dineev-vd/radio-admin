import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated } from "../slices/authSlice";

const API_URL = "";
const baseQuery = fetchBaseQuery({ baseUrl: API_URL });

const customBaseQuery: typeof baseQuery = async (args, api, extraOptions) => {
  const response = await baseQuery(args, api, extraOptions);

  if (response.error && response.error.status === 401) {
    api.dispatch(setIsAuthenticated(false));
  }

  return response;
};

const radioApi = createApi({
  reducerPath: "radioApi",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
});

export default radioApi;
