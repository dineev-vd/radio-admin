import radioApi, { clearAccessToken } from "..";

const logoutEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;

        clearAccessToken();
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLogoutMutation } = logoutEndpoint;
