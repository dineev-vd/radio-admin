import radioApi from "..";
import { Track } from "../tracks/getTracks";

export type ScheduleResponse = {
  tracks: {
    enddate: string;
    id: string;
    startdate: string;
    channelid: string;
    track: Track;
  }[];
};

export type ScheduleRangeParams = {
  from: string;
  to: string;
  id: string;
};

const scheduleEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getSchedule: build.query<ScheduleResponse, ScheduleRangeParams>({
      query: ({ id, ...rest }) => ({
        url: `channel/${id}/schedule-range`,
        params: rest,
      }),
      providesTags: (result) =>
        result
          ? result.tracks.map((t) => ({ id: t.id, type: "SCHEDULE" }))
          : [],
    }),
  }),
  overrideExisting: false,
});

export const { useGetScheduleQuery } = scheduleEndpoint;
