import { FC } from "react";
import { Button, Stack, Table } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useGetChannelsQuery } from "../../store/api/channels/getChannels";
import ChannelInfoView from "./ChannelInfoView";
import NewChannelView from "./NewChannelView";

export const ChannelsView: FC = () => {
  const navigate = useNavigate();
  const { data } = useGetChannelsQuery();

  return (
    <Routes>
      <Route path=":id" element={<ChannelInfoView />} />
      <Route path="new" element={<NewChannelView />} />
      <Route
        index
        element={
          <Stack gap={4}>
            <h1>Каналы</h1>

            <Stack gap={2}>
              <h2>Список каналов</h2>
              <Button onClick={() => navigate("new")}>Добавить канал</Button>
              {data && (
                <Table striped>
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>title</th>
                      <th>publication_date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((post) => (
                      <tr>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
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
