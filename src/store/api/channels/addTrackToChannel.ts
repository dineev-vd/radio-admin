import radioApi from "..";
import { ScheduleResponse } from "./getSchedule";

export type NewSchedule = {
  trackid: string;
  channelid: string;
} & Pick<ScheduleResponse["tracks"][number], "enddate" | "startdate">;

const addTrackToChannelEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    addTrackToChannel: build.mutation<void, NewSchedule>({
      query: ({ channelid, ...body }) => ({
        url: `channel/${channelid}/add-track`,
        method: "POST",
        body,
      }),
      //   invalidatesTags: (_, __, array) =>
      //     array.map(({ id }) => ({ id, type: "SCHEDULE" })),
    }),
  }),
  overrideExisting: false,
});

export const { useAddTrackToChannelMutation } = addTrackToChannelEndpoint;
