import radioApi from "..";

const deleteNewsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    deleteNewsPost: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { id }) => [{ id, type: "NEWS" }],
    }),
  }),
  overrideExisting: false,
});

export const { useDeleteNewsPostMutation } = deleteNewsEndpoint;
