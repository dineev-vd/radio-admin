import {
  BaseQueryFn,
  QueryReturnValue,
} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated } from "../slices/authSlice";

export const API_URL = "http://51.250.73.253:8080";

// const API_URL = "http://localhost:8080";
const baseQuery = fetchBaseQuery({ baseUrl: API_URL });

export const getAccessToken = () => localStorage.getItem("accessToken");
export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};
export const clearAccessToken = () => localStorage.removeItem("accessToken");

const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let response: QueryReturnValue<
    unknown,
    FetchBaseQueryError,
    FetchBaseQueryMeta
  >;

  const authHeader = getAccessToken()
    ? {
        Authorization: `Bearer ${getAccessToken()}`,
      }
    : {};

  console.log(authHeader);

  if (typeof args === "string") {
    response = await baseQuery(
      { headers: authHeader, url: args },
      api,
      extraOptions
    );
  } else {
    response = await baseQuery(
      { ...args, headers: { ...args.headers, ...authHeader } },
      api,
      extraOptions
    );
  }

  if (response.error && response.error.status === 401) {
    api.dispatch(setIsAuthenticated(false));
  }

  return response;
};

const radioApi = createApi({
  reducerPath: "radioApi",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["NEWS", "TRACKS", "CHANNELS", "SCHEDULE"],
});

export default radioApi;
