import radioApi from "..";
import { ScheduleResponse } from "./getSchedule";

export type ScheduleChange = {
  trackid: string;
  channelid: string;
} & Pick<ScheduleResponse["tracks"][number], "enddate" | "startdate" | "id">;

const patchScheduleEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    patchSchedule: build.mutation<void, ScheduleChange[]>({
      query: (tracks) => ({
        url: `schedule`,
        method: "PUT",
        body: { tracks },
      }),
      invalidatesTags: (_, __, array) =>
        array.map(({ id }) => ({ id, type: "SCHEDULE" })),
    }),
  }),
  overrideExisting: false,
});

export const { usePatchScheduleMutation } = patchScheduleEndpoint;
