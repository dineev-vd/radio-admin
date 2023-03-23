import radioApi, { setAccessToken } from "..";

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResponse = {
  error: string;
  accessToken: string;
};

const loginEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginParams>({
      query: (credentials) => ({
        url: "login",
        body: credentials,
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        const response = await queryFulfilled;

        setAccessToken(response.data.accessToken);
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = loginEndpoint;
