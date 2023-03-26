import { FC } from "react";
import { Button, Stack } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
import EntriesTable from "../../components/EntriesTable/EntriesTable";
import { useDeleteTrackMutation } from "../../store/api/tracks/deleteTrack";
import { useGetTracksQuery } from "../../store/api/tracks/getTracks";
import NewTrackView from "./NewTrackView";
import TrackView from "./TrackView";

export const TracksView: FC = () => {
  const { data } = useGetTracksQuery();
  const navigate = useNavigate();
  const [deleteTrigger] = useDeleteTrackMutation();

  return (
    <Routes>
      <Route path={"new"} element={<NewTrackView />} />
      <Route path={":id"} element={<TrackView />} />
      <Route
        index
        element={
          <Stack gap={2}>
            <h2>Список треков</h2>
            <Button onClick={() => navigate("new")}>Добавить трек</Button>
            {data && (
              <EntriesTable
                data={data.tracks}
                onDelete={(id) => deleteTrigger({ id })}
                onEntryClick={(id) => navigate(id)}
              />
            )}
          </Stack>
        }
      />
    </Routes>
  );
};
