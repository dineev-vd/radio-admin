import radioApi from "..";
import { Track } from "./getTracks";

// ID          int           `json:"id"`
// 	Title       string        `json:"title"`
// 	Perfomancer string        `json:"perfomancer"`
// 	Year        int           `json:"year"`
// 	Audio       string        `json:"audio"`
// 	Duration    time.Duration `json:"duration"`

const getTrackEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getTrack: build.query<Track, { id: string }>({
      query: ({ id }) => ({
        url: `track/${id}`,
      }),
      providesTags: (post) => (post ? [{ id: post.id, type: "TRACKS" }] : []),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTrackQuery } = getTrackEndpoint;
