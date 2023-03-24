import { FC } from "react";
import { Button, Stack, Table } from "react-bootstrap";
import { Route, Routes, useNavigate } from "react-router-dom";
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
          <Stack gap={4}>
            <h1>Треки</h1>
            <Stack gap={2}>
              <h2>Список треков</h2>
              <Button onClick={() => navigate("new")}>Добавить трек</Button>
              {data && (
                <Table striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Performancer</th>
                      <th>Year</th>
                      <th>Duration</th>
                      <th>Audio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tracks.map((track) => (
                      <tr
                        key={track.id}
                        onClick={() => navigate(track.id.toString())}
                      >
                        <td>{track.id}</td>
                        <td>{track.title}</td>
                        <td>{track.performancer}</td>
                        <td>{track.year}</td>
                        <td>{track.duration}</td>
                        <td>{track.audio}</td>
                        <td>
                          <button
                            onClick={() => deleteTrigger({ id: track.id })}
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
