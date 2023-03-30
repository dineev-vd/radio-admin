import { FC, useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useParams } from "react-router-dom";
import TrackDisplay from "../../components/Tracks/Track/TrackDisplay";
import TrackEditor from "../../components/Tracks/TrackEditor/TrackEditor";
import TrackUpload from "../../components/Tracks/TrackUpload/TrackUpload";
import { useGetTrackQuery } from "../../store/api/tracks/getTrack";
import { usePatchTrackMutation } from "../../store/api/tracks/patchTrack";
import { useUploadTrackMutation } from "../../store/api/tracks/uploadTrack";

const TrackViewContent: FC<{ id: string }> = ({ id }) => {
  const { data } = useGetTrackQuery({ id });
  const [isEditing, setIsEditing] = useState(false);
  const [trigger, { isSuccess }] = usePatchTrackMutation();
  const [uploadTrigger] = useUploadTrackMutation();

  useEffect(() => {
    if (isSuccess) {
      setIsEditing(false);
    }
  }, [isSuccess]);

  //   useEffect(() => {
  //     if (isUploadSuccess) {
  //       setIsEditing(false);
  //     }
  //   }, [isUploadSuccess]);

  return (
    <>
      {data &&
        (isEditing ? (
          <>
            <Stack direction="horizontal">
              <Button onClick={() => setIsEditing(false)}>Отменить</Button>
            </Stack>
            <TrackEditor
              defaultValues={data}
              onSubmit={(change) => trigger({ change, id })}
            />
          </>
        ) : (
          <>
            <Stack direction="horizontal">
              <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
            </Stack>
            <TrackDisplay {...data} />
            <TrackUpload
              onSubmit={(formData) => uploadTrigger({ formData, id })}
            />
          </>
        ))}
    </>
  );
};

const TrackView: FC = () => {
  const { id } = useParams();

  return <>{id && <TrackViewContent id={id} />}</>;
};

export default TrackView;
