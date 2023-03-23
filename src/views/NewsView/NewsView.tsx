import { FC } from "react";
import { Button, Stack, Table } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
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
          <Stack gap={4}>
            <h1>Новости</h1>

            <Stack gap={2}>
              <h2>Список новостей</h2>
              <Button onClick={() => navigate("new")}>Добавить новость</Button>
              {data && (
                <Table striped>
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>title</th>
                      <th>publication_date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.news.map((post) => (
                      <tr key={post.id} onClick={() => navigate(post.id)}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>{post.date}</td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              trigger({ id: post.id });
                            }}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Stack>
          </Stack>
        }
      />
    </Routes>
  );
};
