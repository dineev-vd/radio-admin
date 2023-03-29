import radioApi from "..";
import { ScheduleResponse } from "./getSchedule";

export type NewSchedule = {
  channelid: string;
  tracks: ({ trackid: string } & Pick<
    ScheduleResponse["tracks"][number],
    "enddate" | "startdate"
  >)[];
};

const addTrackToChannelEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    addTrackToChannel: build.mutation<void, NewSchedule>({
      query: ({ channelid, tracks }) => ({
        url: `channel/${channelid}/add-track`,
        method: "POST",
        body: { tracks },
      }),
      invalidatesTags: ["SCHEDULE"],
    }),
  }),
  overrideExisting: false,
});

export const { useAddTrackToChannelMutation } = addTrackToChannelEndpoint;
