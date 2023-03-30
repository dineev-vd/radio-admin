import radioApi from "..";

const deleteScheduleEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    deleteSchedule: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `schedule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SCHEDULE"],
    }),
  }),
  overrideExisting: false,
});

export const { useDeleteScheduleMutation } = deleteScheduleEndpoint;
