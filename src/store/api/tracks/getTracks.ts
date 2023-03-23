import radioApi from "..";

export type Track = {
  id: string;
  title: string;
  content: string;
  publication_date: string;
};

const tracksEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getTracks: build.query<Track[], void>({
      query: () => ({ url: "tracks", params: { offset: 0, limit: 10 } }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTracksQuery } = tracksEndpoint;
