import radioApi from "..";
import { ShortChannelInfo } from "./getChannels";

export type Channel = ShortChannelInfo & {
  description: string;
  status: string;
};

const channelEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getChannel: build.query<Channel, string>({
      query: (id) => ({ url: `channel/${id}` }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetChannelQuery } = channelEndpoint;
