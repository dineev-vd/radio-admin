import radioApi from "..";

export type User = {
  username: string;
};

const userEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<User, void>({
      query: () => "user",
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserQuery } = userEndpoint;
