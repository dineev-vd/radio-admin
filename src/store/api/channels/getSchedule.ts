import radioApi from "..";
import { Track } from "../tracks/getTracks";

export type ScheduleResponse = {
  tracks: ScheduleTrack[];
};

export type ScheduleTrack = {
  enddate: string;
  id: string;
  startdate: string;
  channelid: string;
  track: Track;
};

export type ScheduleParsedResponse = Record<string, ScheduleTrack>;

export type ScheduleRangeParams = {
  from: string;
  to: string;
  id: string;
};

const scheduleEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getSchedule: build.query<ScheduleParsedResponse, ScheduleRangeParams>({
      query: ({ id, ...rest }) => ({
        url: `channel/${id}/schedule-range`,
        params: rest,
      }),
      providesTags: (result) =>
        result
          ? Object.values(result).map((t) => ({ id: t.id, type: "SCHEDULE" }))
          : [],
      transformResponse: (response: ScheduleResponse) => {
        const dict: ScheduleParsedResponse = {};

        response.tracks.forEach((track) => {
          dict[track.id] = track;
        });

        return dict;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetScheduleQuery } = scheduleEndpoint;
