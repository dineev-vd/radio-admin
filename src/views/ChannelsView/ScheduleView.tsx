import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { FC, useEffect, useMemo, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import DateRangeSelect, {
  DateRange,
} from "../../components/DateRangeSelect/DateRangeSelect";
import Schedule from "../../components/Schedule/Schedule";
import ScheduleForm from "../../components/Schedule/ScheduleForm/ScheduleForm";
import { useAddTrackToChannelMutation } from "../../store/api/channels/addTrackToChannel";
import {
  ScheduleTrack,
  useGetScheduleQuery,
} from "../../store/api/channels/getSchedule";
import { usePatchScheduleMutation } from "../../store/api/channels/patchSchedule";

dayjs.extend(weekday);
dayjs.extend(utc);

export type NewScheduleTrack = Omit<ScheduleTrack, "id">;

export type ScheduleType = "new" | "old";

export type SelectedSchedule =
  | {
      id: string;
      type: ScheduleType;
    }
  | undefined;

const ScheduleView: FC<{ id: string }> = ({ id }) => {
  const [changes, setChanges] = useState<
    Record<string, Partial<ScheduleTrack>>
  >({});
  const [newTracks, setNewTracks] = useState<
    Record<string, Partial<NewScheduleTrack>>
  >({});

  const [selectedIndex, setSelectedIndex] = useState<SelectedSchedule>();

  const [selectedRange, setSelectedRange] = useState<DateRange>({
    from: dayjs(),
    to: dayjs().add(5, "day"),
  });

  const { data, isFetching } = useGetScheduleQuery({
    id,
    from: selectedRange.from.format(),
    to: selectedRange.to.format(),
  });

  const [trigger, { isSuccess }] = usePatchScheduleMutation();
  const [triggerAddTrack] = useAddTrackToChannelMutation();

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setChanges({});
    }
  }, [isFetching, isSuccess]);

  const oldTracks = useMemo(() => {
    return (
      data &&
      Object.fromEntries(
        Object.entries(data).map(([id, track]) => {
          return [id, id in changes ? { ...track, ...changes[id] } : track];
        })
      )
    );
  }, [changes, data]);

  console.log(changes);

  return (
    <Stack gap={3}>
      <Button
        onClick={() => {
          setNewTracks((prev) => ({ ...prev, [uuidv4()]: {} }));
        }}
      >
        Добавить трек в расписание
      </Button>
      <DateRangeSelect onChange={setSelectedRange} />
      {!!Object.keys(changes).length && data && (
        <Button
          onClick={() =>
            trigger(
              Object.entries(changes).map(
                ([id, { track, startdate, enddate, ...change }]) => {
                  const {
                    track: dataTrack,
                    startdate: dataStart,
                    enddate: dataEnd,
                    ...dataEntry
                  } = data[id];

                  return {
                    ...dataEntry,
                    ...change,
                    startdate: dayjs(startdate ?? dataStart)
                      .utc()
                      .format(),
                    enddate: dayjs(enddate ?? dataEnd)
                      .utc()
                      .format(),
                    trackid: track?.id ?? dataTrack.id.toString(),
                  };
                }
              )
            )
          }
        >
          Сохранить изменения
        </Button>
      )}
      <Stack
        direction="horizontal"
        className="align-items-stretch h-100"
        gap={3}
      >
        {oldTracks && (
          <Schedule
            selectedRange={selectedRange}
            data={{ new: newTracks, old: oldTracks }}
            onClick={setSelectedIndex}
            onChange={
              ({ change, id, type }) => {
                type === "old"
                  ? setChanges((prev) => ({
                      ...prev,
                      [id]: Object.assign({}, prev[id], change),
                    }))
                  : setNewTracks((prev) => ({
                      ...prev,
                      [id]: Object.assign({}, prev[id], change),
                    }));
              }

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
        {selectedIndex && data && (
          <ScheduleForm
            {...(selectedIndex.type === "new" ? newTracks : data)[
              selectedIndex.id
            ]}
            onChange={(change) => {
              selectedIndex.type === "old"
                ? setChanges((prev) => ({
                    ...prev,
                    [selectedIndex.id]: Object.assign(
                      {},
                      prev[selectedIndex.id],
                      change
                    ),
                  }))
                : setNewTracks((prev) => ({
                    ...prev,
                    [selectedIndex.id]: Object.assign(
                      {},
                      prev[selectedIndex.id],
                      change
                    ),
                  }));
            }}
          />
        )}
        {/* {isAddingTrack ? (
          <>
            <ScheduleForm
              onChange={(change) =>
                triggerAddTrack({ ...change, channelid: id })
              }
            />
          </>
        ) : (
          <>
            {data && selectedIndex !== -1 && (
              <ScheduleForm
                onChange={(change) => {
                  setChanges((prev) => ({ ...prev, [change.id]: change }));
                  setSelectedIndex(-1);
                }}
                {...data.tracks[selectedIndex]}
                trackid={data.tracks[selectedIndex].track.id.toString()}
                channelid={id}
              />
            )}
          </>
        )} */}
      </Stack>
    </Stack>
  );
};

export default ScheduleView;
