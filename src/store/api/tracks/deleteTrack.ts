import radioApi from "..";

const deleteTrackEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    deleteTrack: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `track/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { id }) => [{ id, type: "TRACKS" }],
    }),
  }),
  overrideExisting: false,
});

export const { useDeleteTrackMutation } = deleteTrackEndpoint;
