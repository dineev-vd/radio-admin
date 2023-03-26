import radioApi from "..";

export type StatUnit = {
  count: number;
  time: string;
};

export type StatsReponse = {
  stats: StatUnit[];
};

export type StatsParams = {
  id: string;
  from: string;
  to: string;
};

const channelListenersEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getChannelListeners: build.query<StatsReponse, StatsParams>({
      query: ({ id, ...params }) => ({
        url: `/stats/channel/${id}/listeners`,
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetChannelListenersQuery } = channelListenersEndpoint;
