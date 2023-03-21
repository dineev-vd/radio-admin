import radioApi from "..";

export type LoginParams = {
  email: string;
  password: string;
};

const loginEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<void, LoginParams>({
      query: (credentials) => ({
        url: "login",
        body: credentials,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = loginEndpoint;
