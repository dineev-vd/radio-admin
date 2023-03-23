import radioApi from "..";

export type User = {
  avatar: string;
  email: string;
  id: number;
  name: string;
  role: number;
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
