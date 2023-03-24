import radioApi from "..";

// Title       string `json:"title"`
// 	Perfomancer string `json:"description"`
// 	Year        int    `json:"year"`

export type NewTrack = {
  title: string;
  performancer: string;
  year: number;
};

const createTrackEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    createTrack: build.mutation<{ id: string }, NewTrack>({
      query: (body) => ({
        url: "track",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TRACKS"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateTrackMutation } = createTrackEndpoint;
