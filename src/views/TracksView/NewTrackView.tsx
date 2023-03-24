import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrackEditor from "../../components/Tracks/TrackEditor/TrackEditor";
import { useCreateTrackMutation } from "../../store/api/tracks/createTrack";

const NewTrackView: FC = () => {
  const [trigger, { data }] = useCreateTrackMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate(`../${data.id}`);
    }
  }, [data, navigate]);

  return <TrackEditor onSubmit={(newTrack) => trigger(newTrack)} />;
};

export default NewTrackView;
