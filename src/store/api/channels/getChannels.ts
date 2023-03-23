import radioApi from "..";

export type ShortChannelInfo = {
  id: string;
  title: string;
  logo: string;
};

const channelsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getChannels: build.query<ShortChannelInfo[], void>({
      query: () => ({ url: "channels" }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetChannelsQuery } = channelsEndpoint;
