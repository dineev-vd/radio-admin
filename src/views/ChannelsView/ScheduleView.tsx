import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { FC, useEffect, useMemo, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import Schedule from "../../components/Schedule/Schedule";
import ScheduleForm from "../../components/Schedule/ScheduleForm/ScheduleForm";
import { useAddTrackToChannelMutation } from "../../store/api/channels/addTrackToChannel";
import { useGetScheduleQuery } from "../../store/api/channels/getSchedule";
import {
  ScheduleChange,
  usePatchScheduleMutation,
} from "../../store/api/channels/patchSchedule";

dayjs.extend(weekday);
dayjs.extend(utc);

const ScheduleView: FC<{ id: string }> = ({ id }) => {
  const [changes, setChanges] = useState<Record<string, ScheduleChange>>({});

  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isAddingTrack, setIsAddingTrack] = useState(false);

  const [from, to] = useMemo(() => {
    const curDate = dayjs(date).locale(ru);

    return [
      curDate.weekday(0).hour(0).minute(0).second(0),
      curDate.weekday(7).hour(0).minute(0).second(0),
    ];
  }, [date]);

  const { data } = useGetScheduleQuery({
    id,
    from: from.format(),
    to: to.format(),
  });

  const [trigger, { isSuccess }] = usePatchScheduleMutation();
  const [triggerAddTrack] = useAddTrackToChannelMutation();

  useEffect(() => {
    if (isSuccess) {
      setChanges({});
    }
  }, [isSuccess]);

  const parsedData = useMemo(() => {
    return data?.tracks.map((track) => {
      if (track.id in changes) {
        return { ...track, ...changes };
      }

      return track;
    });
  }, [changes, data?.tracks]);

  return (
    <Stack gap={3}>
      <Button onClick={() => setIsAddingTrack(true)}>
        Добавить трек в расписание
      </Button>
      <Form.Control
        onChange={(e) => setDate(e.target.value)}
        type={"date"}
        value={date}
      />
      {!!Object.keys(changes).length && (
        <Button onClick={() => trigger(Object.values(changes))}>
          Сохранить изменения
        </Button>
      )}
      <Stack
        direction="horizontal"
        className="align-items-stretch h-100"
        gap={3}
      >
        {parsedData && (
          <Schedule
            date={date}
            data={parsedData}
            onClick={(index) => {
              setSelectedIndex(index);
              setIsAddingTrack(false);
            }}
            onChange={
              (index, start, duration) =>
                setChanges((prev) => ({
                  ...prev,
                  [parsedData[index].id]: {
                    id: parsedData[index].id,
                    startdate: dayjs(start).utc().format(),
                    enddate: dayjs(start + duration)
                      .utc()
                      .format(),
                    trackid: parsedData[index].track.id.toString(),
                    channelid: id,
                  },
                }))
              // trigger([
              //   {
              //     id: parsedData[index].id,
              //     startdate: dayjs(start).utc().format(),
              //     enddate: dayjs(start + duration)
              //       .utc()
              //       .format(),
              //     trackid: parsedData[index].track.id.toString(),
              //     channelid: id,
              //   },
              // ])
            }
          />
        )}
        {isAddingTrack ? (
          <>
            <ScheduleForm
              onSubmit={(change) =>
                triggerAddTrack({ ...change, channelid: id })
              }
            />
          </>
        ) : (
          <>
            {data && selectedIndex !== -1 && (
              <ScheduleForm
                onSubmit={(change) => {
                  setChanges((prev) => ({ ...prev, [change.id]: change }));
                  setSelectedIndex(-1);
                }}
                {...data.tracks[selectedIndex]}
                trackid={data.tracks[selectedIndex].track.id.toString()}
                channelid={id}
              />
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default ScheduleView;
