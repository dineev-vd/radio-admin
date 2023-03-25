import radioApi from "..";
import { NewChannel } from "./createChannel";

const patchChannelEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    patchChannel: build.mutation<
      void,
      { id: string; change: Partial<NewChannel> }
    >({
      query: ({ id, change }) => ({
        url: `channel/${id}`,
        method: "PATCH",
        body: change,
      }),
      invalidatesTags: (_, __, { id }) => [{ id, type: "CHANNELS" }],
    }),
  }),
  overrideExisting: false,
});

export const { usePatchChannelMutation } = patchChannelEndpoint;
