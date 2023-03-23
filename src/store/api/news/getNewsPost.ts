import radioApi from "..";

export type NewsPost = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type GetNewsPostParams = {
  id: string;
};

const getNewsPostEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getNewsPost: build.query<NewsPost, GetNewsPostParams>({
      query: ({ id }) => ({
        url: `news/${id}`,
      }),
      providesTags: (post) => (post ? [{ id: post.id, type: "NEWS" }] : []),
    }),
  }),
  overrideExisting: false,
});

export const { useGetNewsPostQuery } = getNewsPostEndpoint;
