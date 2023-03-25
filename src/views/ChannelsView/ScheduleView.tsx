import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { FC, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import Schedule from "../../components/Schedule/Schedule";
import ScheduleForm from "../../components/Schedule/ScheduleForm/ScheduleForm";
import { useGetScheduleQuery } from "../../store/api/channels/getSchedule";
import { usePatchScheduleMutation } from "../../store/api/channels/patchSchedule";

dayjs.extend(weekday);
dayjs.extend(utc);

const ScheduleView: FC<{ id: string }> = ({ id }) => {
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

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

  const [trigger] = usePatchScheduleMutation();

  return (
    <>
      <Form.Control
        onChange={(e) => setDate(e.target.value)}
        type={"date"}
        value={date}
      />
      {data && (
        <Schedule
          date={date}
          data={data}
          onClick={setSelectedIndex}
          onChange={(index, start, duration) =>
            trigger([
              {
                id: data.tracks[index].id,
                startdate: dayjs(start).utc().format(),
                enddate: dayjs(start + duration)
                  .utc()
                  .format(),
                trackid: data.tracks[index].track.id.toString(),
                channelid: id,
              },
            ])
          }
        />
      )}
      {data && selectedIndex !== -1 && (
        <ScheduleForm
          onSubmit={(change) => trigger([{ ...change }])}
          {...data.tracks[selectedIndex]}
          trackid={data.tracks[selectedIndex].track.id.toString()}
          channelid={id}
        />
      )}
    </>
  );
};

export default ScheduleView;
