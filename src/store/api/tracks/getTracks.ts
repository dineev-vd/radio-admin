import radioApi from "..";

// ID          int           `json:"id"`
// 	Title       string        `json:"title"`
// 	Perfomancer string        `json:"perfomancer"`
// 	Year        int           `json:"year"`
// 	Audio       string        `json:"audio"`
// 	Duration    time.Duration `json:"duration"`

export type Track = {
  id: string;
  title: string;
  performancer: string;
  year: number;
  audio: string;
  duration: string;
};

export type TrackResponse = {
  count: number;
  tracks: Track[];
};

const tracksEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getTracks: build.query<TrackResponse, void>({
      query: () => ({ url: "track", params: { offset: 0, limit: 10 } }),
      providesTags: (result) =>
        result
          ? result.tracks.map((track) => ({ id: track.id, type: "TRACKS" }))
          : [],
    }),
  }),
  overrideExisting: false,
});

export const { useGetTracksQuery } = tracksEndpoint;
