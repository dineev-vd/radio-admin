import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
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
dayjs.extend(minMax);
dayjs.extend(isBetween);

function shuffle<T>(array: T[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

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
  const [triggerAddTrack, { isSuccess: isSuccessAdding }] =
    useAddTrackToChannelMutation();

  useEffect(() => {
    if (isSuccess && !isFetching) {
      setChanges({});
    }
  }, [isFetching, isSuccess]);

  useEffect(() => {
    if (isSuccessAdding && !isFetching) {
      setNewTracks({});
    }
  }, [isFetching, isSuccessAdding]);

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

  const lastEnd = useMemo(() => {
    if (data) {
      const lastArray = Object.values(data)
        .map((value) => dayjs(value.enddate))
        .concat(Object.values(newTracks).map((value) => dayjs(value.enddate)));

      if (lastArray.length) {
        return dayjs.max(lastArray);
      }
    }

    return dayjs();
  }, [data, newTracks]);

  const addNewTrack = useCallback(() => {
    const selected =
      selectedIndex &&
      (selectedIndex.type === "new"
        ? newTracks[selectedIndex.id]
        : oldTracks && oldTracks[selectedIndex.id]);

    const insertDate = selected ? dayjs(selected?.enddate) : lastEnd;

    const newTrack: Partial<ScheduleTrack> = {
      startdate: insertDate.format(),
      enddate: insertDate.add(10, "minutes").format(),
    };

    const uuid = uuidv4();
    setNewTracks((prev) => ({ ...prev, [uuid]: newTrack }));
    setSelectedIndex({ type: "new", id: uuid });
  }, [lastEnd, newTracks, oldTracks, selectedIndex]);

  const pushChanges = () => {
    if (Object.keys(newTracks).length) {
      triggerAddTrack({
        channelid: id,
        tracks: Object.values(newTracks).map((t) => ({
          trackid: t.track?.id ?? "0",
          enddate: dayjs(t.enddate).utc().format(),
          startdate: dayjs(t.startdate).utc().format(),
        })),
      });
    }

    if (Object.keys(changes).length) {
      data &&
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
                trackid: track?.id.toString() ?? dataTrack.id.toString(),
              };
            }
          )
        );
    }
  };

  const handleCopyFromDay = (from: Dayjs, to: Dayjs) => {
    const startOfDay = from.hour(0).minute(0).second(0);
    const endOfDay = startOfDay.add(1, "day");

    const oldEntries = Object.entries(oldTracks ?? {}).filter(([id, track]) =>
      dayjs(track.startdate).isBetween(startOfDay, endOfDay)
    );

    const newEntries = Object.entries(newTracks).filter(([id, track]) =>
      dayjs(track.startdate).isBetween(startOfDay, endOfDay)
    );

    const startOfEntries = newEntries
      .concat(oldEntries)
      .reduce(
        (prev, [id, track]) =>
          dayjs(track.startdate).isBefore(prev) ? dayjs(track.startdate) : prev,
        endOfDay
      );

    const typedEntries = newEntries
      .map(
        ([id, track]) => [id, { type: "new" as "new" | "old", track }] as const
      )
      .concat(
        oldEntries.map(([id, track]) => [id, { type: "old", track }] as const)
      )
      .sort(([id, track], [otheId, otherTrack]) =>
        dayjs(track.track.startdate).diff(dayjs(otherTrack.track.startdate))
      );

    let start = startOfEntries.year(to.year()).month(to.month()).day(to.day());
    let finalNewTracks: typeof newTracks = {};
    let finalChanges: typeof changes = {};

    typedEntries.forEach(([id, { type, track }]) => {
      if (track.track?.duration) {
        finalNewTracks[uuidv4()] = {
          startdate: start.format(),
          enddate: start
            .add(+track.track?.duration / 1000000000, "seconds")
            .format(),
          track: track.track,
        };

        start = start.add(+track.track?.duration / 1000000000, "seconds");
      }
    });

    setChanges((prev) => ({ ...prev, ...finalChanges }));
    setNewTracks((prev) => ({ ...prev, ...finalNewTracks }));
  };

  const handleReshuffle = (date: Dayjs) => {
    const startOfDay = date.hour(0).minute(0).second(0);
    const endOfDay = startOfDay.add(1, "day");

    const oldEntries = Object.entries(oldTracks ?? {}).filter(([id, track]) =>
      dayjs(track.startdate).isBetween(startOfDay, endOfDay)
    );

    const newEntries = Object.entries(newTracks).filter(([id, track]) =>
      dayjs(track.startdate).isBetween(startOfDay, endOfDay)
    );

    const startOfEntries = newEntries
      .concat(oldEntries)
      .reduce(
        (prev, [id, track]) =>
          dayjs(track.startdate).isBefore(prev) ? dayjs(track.startdate) : prev,
        endOfDay
      );

    const typedEntries = newEntries
      .map(
        ([id, track]) => [id, { type: "new" as "new" | "old", track }] as const
      )
      .concat(
        oldEntries.map(([id, track]) => [id, { type: "old", track }] as const)
      );

    let start = startOfEntries;
    let finalNewTracks: typeof newTracks = {};
    let finalChanges: typeof changes = {};

    shuffle(typedEntries).forEach(([id, { type, track }]) => {
      if (track.track?.duration) {
        (type === "new" ? finalNewTracks : finalChanges)[id] = {
          startdate: start.format(),
          enddate: start
            .add(+track.track?.duration / 1000000000, "seconds")
            .format(),
          track: track.track,
        };

        start = start.add(+track.track?.duration / 1000000000, "seconds");
      }
    });

    setChanges((prev) => ({ ...prev, ...finalChanges }));
    setNewTracks((prev) => ({ ...prev, ...finalNewTracks }));
  };

  return (
    <Stack gap={3}>
      <Button
        onClick={() => {
          addNewTrack();
        }}
      >
        Добавить трек в расписание
      </Button>
      <DateRangeSelect onChange={setSelectedRange} />
      {(!!Object.keys(changes).length || !!Object.keys(newTracks).length) &&
        data && <Button onClick={pushChanges}>Сохранить изменения</Button>}
      <Stack
        direction="horizontal"
        className="align-items-stretch h-100"
        gap={3}
      >
        {oldTracks && (
          <Schedule
            onDayCopy={handleCopyFromDay}
            onReshuffle={handleReshuffle}
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
        {/* {selectedIndex && data && (
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
        )} */}

        <>
          {oldTracks && selectedIndex && (
            <ScheduleForm
              onChange={(change) => {
                selectedIndex.type === "old"
                  ? setChanges((prev) => ({
                      ...prev,
                      [selectedIndex.id]: change,
                    }))
                  : setNewTracks((prev) => ({
                      ...prev,
                      [selectedIndex.id]: change,
                    }));
                // setSelectedIndex(undefined);
              }}
              {...(selectedIndex.type === "old" ? oldTracks : newTracks)[
                selectedIndex.id
              ]}
            />
          )}
        </>
      </Stack>
    </Stack>
  );
};

export default ScheduleView;
