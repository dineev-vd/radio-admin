import radioApi from "..";
import { NewTrack } from "./createTrack";

const patchTrackEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    patchTrack: build.mutation<void, { id: string; change: Partial<NewTrack> }>(
      {
        query: ({ id, change }) => ({
          url: `track/${id}`,
          method: "PATCH",
          body: change,
        }),
        invalidatesTags: (_, __, { id }) => [{ id, type: "TRACKS" }],
      }
    ),
  }),
  overrideExisting: false,
});

export const { usePatchTrackMutation } = patchTrackEndpoint;
