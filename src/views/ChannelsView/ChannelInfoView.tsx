import { FC, useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { Link, Route, Routes, useParams } from "react-router-dom";
import ChannelEditor from "../../components/Channels/ChannelEdit/ChannelEdit";
import ChannelForm from "../../components/Channels/ChannelForm/ChannelForm";
import { useGetChannelQuery } from "../../store/api/channels/getChannel";
import { usePatchChannelMutation } from "../../store/api/channels/patchChannel";
import ScheduleView from "./ScheduleView";

const ChannelInfoContent: FC<{ id: string }> = ({ id }) => {
  const { data: channelInfo } = useGetChannelQuery(id);
  const [isEditing, setIsEditing] = useState(false);
  const [trigger, { isSuccess }] = usePatchChannelMutation();

  useEffect(() => {
    if (isSuccess) {
      setIsEditing(false);
    }
  }, [isSuccess]);

  return (
    <>
      <Link to={"schedule"}>Расписание</Link>

      <Routes>
        <Route
          index
          element={
            channelInfo &&
            (isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)}>Отменить</button>
                <ChannelEditor
                  onSubmit={(change) => trigger({ change, id })}
                  defaultValues={channelInfo}
                />
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)}>
                  Редактировать
                </button>
                <ChannelForm {...channelInfo} />
              </>
            ))
          }
        />
        <Route
          path={"schedule"}
          element={
            <Stack>
              <h2>{channelInfo?.title}</h2>
              <ScheduleView id={id} />
            </Stack>
          }
        />
      </Routes>
    </>
  );
};

const ChannelInfoView: FC = () => {
  const { id } = useParams();

  return <>{id && <ChannelInfoContent id={id} />}</>;
};

export default ChannelInfoView;
