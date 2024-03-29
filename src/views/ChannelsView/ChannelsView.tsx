import { FC } from "react";
import { Button, Stack } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import EntriesTable from "../../components/EntriesTable/EntriesTable";
import { useDeleteChannelMutation } from "../../store/api/channels/deleteChannel";
import { useGetChannelsQuery } from "../../store/api/channels/getChannels";
import ChannelInfoView from "./ChannelInfoView";
import NewChannelView from "./NewChannelView";

export const ChannelsView: FC = () => {
  const navigate = useNavigate();
  const { data } = useGetChannelsQuery();
  const [trigger] = useDeleteChannelMutation();

  return (
    <>
      <Routes>
        <Route path=":id/*" element={<ChannelInfoView />} />
        <Route path="new" element={<NewChannelView />} />
        <Route
          index
          element={
            <Stack gap={2}>
              <h2>Список каналов</h2>
              <Stack direction="horizontal">
                <Button onClick={() => navigate("new")}>Добавить канал</Button>
              </Stack>
              {data && (
                <EntriesTable
                  data={data.channels.map(({ logo, status, ...rest }) => ({
                    ...rest,
                    status: status === 0 ? "Остановлен" : "Играет",
                  }))}
                  onDelete={(id) => trigger({ id })}
                  onEntryClick={(id) => navigate(id)}
                />
              )}
            </Stack>
          }
        />
      </Routes>
    </>
  );
};
