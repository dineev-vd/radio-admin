import radioApi from "..";
import { NewNewsPost } from "./createNewsPost";

const patchNewsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    patchNewsPost: build.mutation<
      void,
      { id: string; change: Partial<NewNewsPost> }
    >({
      query: ({ id, change }) => ({
        url: `news/${id}`,
        method: "PATCH",
        body: change,
      }),
      invalidatesTags: (_, __, { id }) => [{ id, type: "NEWS" }],
    }),
  }),
  overrideExisting: false,
});

export const { usePatchNewsPostMutation } = patchNewsEndpoint;
