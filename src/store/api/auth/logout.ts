import radioApi from "..";

const logoutEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLogoutMutation } = logoutEndpoint;
