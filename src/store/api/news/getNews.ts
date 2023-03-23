import radioApi from "..";

export type NewsResponse = {
  news: NewsPost[];
  count: number;
};

export type NewsPost = {
  id: string;
  title: string;
  content: string;
  date: string;
};

const newsEndpoint = radioApi.injectEndpoints({
  endpoints: (build) => ({
    getNews: build.query<NewsResponse, void>({
      query: () => ({
        url: "news",
      }),
      providesTags: (result) =>
        result
          ? result.news.map((post) => ({ id: post.id, type: "NEWS" }))
          : [],
    }),
  }),
  overrideExisting: false,
});

export const { useGetNewsQuery } = newsEndpoint;
