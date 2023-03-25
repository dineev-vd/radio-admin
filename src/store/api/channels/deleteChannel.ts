import radioApi from "..";

const deleteChannelEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    deleteChannel: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `channel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { id }) => [{ id, type: "CHANNELS" }],
    }),
  }),
  overrideExisting: false,
});

export const { useDeleteChannelMutation } = deleteChannelEndpoint;
