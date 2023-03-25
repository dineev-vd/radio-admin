import radioApi from "..";

export type NewChannel = {
  title: string;
  description: string;
};

const createChannelEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    createChannel: build.mutation<{ id: string }, NewChannel>({
      query: (data) => ({
        url: "channel",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CHANNELS"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateChannelMutation } = createChannelEndpoint;
