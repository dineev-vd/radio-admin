import radioApi from "..";

export type NewNewsPost = {
  title: string;
  content: string;
};

const createNewsPostEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    createNewsPost: build.mutation<{ id: string }, NewNewsPost>({
      query: (data) => ({
        url: "news",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["NEWS"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateNewsPostMutation } = createNewsPostEndpoint;
