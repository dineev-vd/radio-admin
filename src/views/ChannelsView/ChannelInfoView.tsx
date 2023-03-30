import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { NavLink, Route, Routes, useParams } from "react-router-dom";
import ChannelEditor from "../../components/Channels/ChannelEdit/ChannelEdit";
import ChannelForm from "../../components/Channels/ChannelForm/ChannelForm";
import { useGetChannelQuery } from "../../store/api/channels/getChannel";
import { usePatchChannelMutation } from "../../store/api/channels/patchChannel";
import ScheduleView from "./ScheduleView";
import StatisticsView from "./StatisticsView";

const links: { path: string; title: string }[] = [
  {
    path: ".",
    title: "Описание",
  },
  {
    path: "schedule",
    title: "Расписание",
  },
  {
    path: "statistics",
    title: "Статистика",
  },
];

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
      <div className={"d-flex nav nav-pills"}>
        {links.map(({ path, title }) => (
          <NavLink
            className={({ isActive }) =>
              classNames("nav-link", { active: isActive })
            }
            to={path}
            end
          >
            {title}
          </NavLink>
        ))}
      </div>
      <hr></hr>
      <Routes>
        <Route
          index
          element={
            channelInfo &&
            (isEditing ? (
              <>
                <Stack direction="horizontal">
                  <Button onClick={() => setIsEditing(false)}>Отменить</Button>
                </Stack>
                <ChannelEditor
                  onSubmit={(change) => trigger({ change, id })}
                  defaultValues={channelInfo}
                />
              </>
            ) : (
              <>
                <Stack direction="horizontal">
                  <Button onClick={() => setIsEditing(true)}>
                    Редактировать
                  </Button>
                </Stack>
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
        <Route path={"statistics"} element={<StatisticsView id={id} />} />
      </Routes>
    </>
  );
};

const ChannelInfoView: FC = () => {
  const { id } = useParams();

  return <>{id && <ChannelInfoContent id={id} />}</>;
};

export default ChannelInfoView;
