import radioApi from "..";

export type GetChennelsReponse = {
  count: number;
  channels: ShortChannelInfo[];
};

export type ShortChannelInfo = {
  id: string;
  title: string;
  logo: string;
  status: number;
};

const channelsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getChannels: build.query<GetChennelsReponse, void>({
      query: () => ({ url: "channel" }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetChannelsQuery } = channelsEndpoint;
