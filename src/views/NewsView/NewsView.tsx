import dayjs from "dayjs";
import { FC } from "react";
import { Button, Stack } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import EntriesTable from "../../components/EntriesTable/EntriesTable";
import { useDeleteNewsPostMutation } from "../../store/api/news/deleteNewsPost";
import { useGetNewsQuery } from "../../store/api/news/getNews";
import NewNewsPostView from "./NewNewsPostView";
import NewsPostView from "./NewsPostView";

export const NewsView: FC = () => {
  const navigate = useNavigate();

  const { data } = useGetNewsQuery();
  const [trigger] = useDeleteNewsPostMutation();

  return (
    <Routes>
      <Route path=":id" element={<NewsPostView />} />
      <Route path="new" element={<NewNewsPostView />} />
      <Route
        index
        element={
          <Stack gap={2}>
            <h2>Список новостей</h2>
            <Stack direction="horizontal">
              <Button onClick={() => navigate("new")}>Добавить новость</Button>
            </Stack>
            {data && (
              <EntriesTable
                data={data.news.map(({ image, date, ...rest }) => ({
                  ...rest,
                  date: dayjs(date).format("hh:mm YYYY-MM-DD"),
                }))}
                onDelete={(id) => trigger({ id })}
                onEntryClick={(id) => navigate(id)}
              />
            )}
          </Stack>
        }
      />
    </Routes>
  );
};
