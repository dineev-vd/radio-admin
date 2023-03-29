import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
import {
  FC,
  MouseEvent as RMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Table } from "react-bootstrap";
import { ScheduleTrack } from "../../store/api/channels/getSchedule";
import { SelectedSchedule } from "../../views/ChannelsView/ScheduleView";
import { DateRange } from "../DateRangeSelect/DateRangeSelect";
import styles from "./Schedule.module.css";
import TrackCard from "./TrackCard/TrackCard";

dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(duration);

const DIVIDER = 6;
const SNAP_RANGE_MILLISECONDS = 5 * 60 * 1000;

type ScheduleCollection = Record<string, Partial<ScheduleTrack>>;

type ScheduleProps = {
  selectedRange: DateRange;
  data: {
    new: ScheduleCollection;
    old: ScheduleCollection;
  };

  onClick: (params: SelectedSchedule) => void;
  onChange: (params: {
    id: string;
    type: keyof ScheduleProps["data"];
    change: Partial<ScheduleTrack>;
  }) => void;
};

type SnapDict = {
  start: Dayjs[];
  end: Dayjs[];
};

const Schedule: FC<ScheduleProps> = ({
  selectedRange,
  data,
  onClick,
  onChange,
}) => {
  // const tracks = useMemo(() => {
  //   return data.map(({ type, scheduleTrack: track }) => ({
  //     type,
  //     id: track.id,
  //     title: track.track?.title,
  //     start: dayjs(track.startdate).unix() * 1000,
  //     duration: dayjs(track.enddate).diff(dayjs(track.startdate)),
  //   }));
  // }, [data]);

  const overlayRef = useRef<HTMLDivElement>(null);

  const weekDays = useMemo(() => {
    const duration = dayjs
      .duration(selectedRange.to.diff(selectedRange.from))
      .asDays();

    return Array(duration)
      .fill(1)
      .map((_, index) => selectedRange.from.add(index, "day"));
  }, [selectedRange.from, selectedRange.to]);

  // const processedTracks = useMemo(() => {
  //   return tracks.map((track) => {
  //     return {
  //       weekDay: dayjs(track.start).locale(ru).weekday(),
  //       startSeconds:
  //         dayjs(track.start).hour() * 60 * 60 +
  //         dayjs(track.start).minute() * 60 +
  //         dayjs(track.start).second(),
  //       ...track,
  //     };
  //   });
  // }, [tracks]);

  const snapsRef = useRef<SnapDict>({ start: [], end: [] });

  const headerRef = useRef<HTMLTableCellElement>(null);
  const [overlayOffset, setOverlayOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (headerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (headerRef.current) {
          setOverlayOffset({
            x: headerRef.current.clientWidth,
            y: headerRef.current.clientHeight,
          });
        }
      });

      resizeObserver.observe(headerRef.current);

      return () => resizeObserver.disconnect();
    }
  }, []);

  const [shouldDisplayFake, setShouldDisplayFake] = useState(false);
  const startOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [dragIndex, setDragId] = useState<SelectedSchedule>();
  const dragIndexRef = useRef<SelectedSchedule>();

  const [fakeStart, setFakeStart] = useState<number>(0);
  const fakeStartRef = useRef<number>(0);

  const [fakeDayDelta, setFakeDayDelta] = useState<number>(0);
  const fakeDayDeltaRef = useRef<number>(0);

  const startDayRef = useRef<number>(0);

  const startPositionRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (overlayRef.current) {
        setDragId(dragIndexRef.current);

        const rect = overlayRef.current.getBoundingClientRect();

        const dragDay = Math.min(
          Math.max(0, Math.floor(((e.x - rect.x) / rect.width) * 7)),
          6
        );

        setFakeDayDelta(dragDay - startDayRef.current);
        fakeDayDeltaRef.current = dragDay - startDayRef.current;

        // const y = Math.min(
        //   Math.max(0, e.y - rect.y - startOffsetRef.current.y),
        //   rect.height -
        //     (rect.height * processedTracks[dragIndexRef.current].duration) /
        //       1000 /
        //       (24 * 60 * 60)
        // );
        const newStartDelta =
          ((e.y - startPositionRef.current) / rect.height) *
          24 *
          60 *
          60 *
          1000;

        if (dragIndexRef.current) {
          const curTrack =
            data[dragIndexRef.current?.type][dragIndexRef.current?.id];

          let newStart =
            dayjs(curTrack.startdate).unix() * 1000 + newStartDelta;
          const newEnd = dayjs(curTrack.enddate).unix() * 1000 + newStartDelta;

          const snapStart = snapsRef.current.end.find(
            (v) =>
              Math.abs(
                dayjs(newStart).add(fakeDayDeltaRef.current, "days").diff(v)
              ) < SNAP_RANGE_MILLISECONDS
          );
          const snapEnd = snapsRef.current.start.find(
            (v) =>
              Math.abs(
                dayjs(newEnd).add(fakeDayDeltaRef.current, "days").diff(v)
              ) < SNAP_RANGE_MILLISECONDS
          );

          if (snapStart) {
            newStart = snapStart.unix() * 1000 - (newEnd - newStart);
          } else if (snapEnd) {
            newStart = snapEnd.unix() * 1000;
          }

          setFakeStart(newStart);
          fakeStartRef.current = newStart;
        }

        // setDragPosition({ y });
        // dragPositionRef.current = y;
      }
    },
    [data]
  );

  const handleMouseUp = useCallback(() => {
    if (overlayRef.current) {
      setDragId(undefined);

      // const date = weekDays[dragDayRef.current]
      //   .hour(0)
      //   .minute(0)
      //   .second(0)
      //   .second(
      //     (dragPositionRef.current / overlayRef.current.clientHeight) *
      //       24 *
      //       60 *
      //       60
      //   );

      if (dragIndexRef.current) {
        const originalDuration = dayjs(
          data[dragIndexRef.current.type][dragIndexRef.current.id].enddate
        ).diff(
          dayjs(
            data[dragIndexRef.current.type][dragIndexRef.current.id].startdate
          )
        );

        onChange({
          id: dragIndexRef.current.id,
          type: dragIndexRef.current.type,
          change: {
            startdate: dayjs(fakeStartRef.current)
              .add(fakeDayDeltaRef.current, "day")
              .format(),
            enddate: dayjs(
              dayjs(fakeStartRef.current)
                .add(fakeDayDeltaRef.current, "day")
                .unix() *
                1000 +
                originalDuration
            ).format(),
          },
        });
      }

      // setTracks((prev) => {
      //   const newTracks = [...prev];
      //   const draggedTrack = prev[dragIndexRef.current];

      //   newTracks.splice(dragIndexRef.current, 1, {
      //     ...draggedTrack,
      //     start: date.unix() * 1000,
      //   });

      //   return newTracks;
      // });
    }
  }, [data, onChange]);

  const onMouseDown = useCallback(
    (e: RMouseEvent, selectedTrack: SelectedSchedule) => {
      const onMouseMove = () => {
        document.removeEventListener("mouseup", reset);
        document.removeEventListener("mousemove", onMouseMove);

        startOffsetRef.current = {
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
        };

        snapsRef.current = {
          start: Object.values(data.old)
            .map((value) => dayjs(value.startdate))
            .concat(
              Object.values(data.new).map((value) => dayjs(value.startdate))
            ),
          end: Object.values(data.old)
            .map((value) => dayjs(value.enddate))
            .concat(
              Object.values(data.new).map((value) => dayjs(value.enddate))
            ),
        };

        dragIndexRef.current = selectedTrack;
        startPositionRef.current = e.nativeEvent.y;

        if (overlayRef.current) {
          startDayRef.current = Math.floor(
            ((e.nativeEvent.x - overlayRef.current.getBoundingClientRect().x) /
              overlayRef.current.clientWidth) *
              7
          );
        }

        const onSuccess = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", onSuccess);
          handleMouseUp();
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", onSuccess);
      };

      const reset = () => {
        document.removeEventListener("mousemove", onMouseMove);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", reset);
    },
    [data.new, data.old, handleMouseMove, handleMouseUp]
  );

  console.log(snapsRef.current);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => onClick(undefined)}
              className={styles.tracksOverlay}
              style={{
                width: `calc(100% - ${overlayOffset.x}px)`,
                height: `calc(100% - ${overlayOffset.y}px)`,
                transform: `translateX(${overlayOffset.x + 1}px) translateY(${
                  overlayOffset.y + 1
                }px)`,
              }}
              ref={overlayRef}
            >
              {dragIndex && (
                <TrackCard
                  duration={dayjs(
                    data[dragIndex.type][dragIndex.id].enddate
                  ).diff(dayjs(data[dragIndex.type][dragIndex.id].startdate))}
                  start={
                    dayjs(fakeStart).add(fakeDayDelta, "day").unix() * 1000
                  }
                  title={data[dragIndex.type][dragIndex.id].track?.title}
                  fake
                />
                // <div
                //   className={styles.trackCardFake}
                //   style={{
                //     width: `calc(100% / 7)`,
                //     transform: `translateX(calc(100% * ${dragDay}))`,
                //     height: `calc(100% * ${
                //       processedTracks[dragIndex].duration /
                //       1000 /
                //       (24 * 60 * 60)
                //     })`,
                //     top: `calc(${dragPosition.y}px)`,
                //   }}
                // >
                //   {processedTracks[dragIndex].title}
                // </div>
              )}
              {Object.entries(data.old).map(([id, track]) => (
                <TrackCard
                  duration={dayjs(track.enddate).diff(dayjs(track.startdate))}
                  onMouseDown={(e) => onMouseDown(e, { id, type: "old" })}
                  start={dayjs(track.startdate).unix() * 1000}
                  title={track.track?.title}
                  key={track.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick({ id, type: "old" });
                  }}
                />
              ))}
            </div>
            <Table bordered striped>
              <thead>
                <tr className={styles.th}>
                  <th ref={headerRef}></th>
                  {weekDays.map((date, index) => (
                    <th key={index}>{date.format("DD.MM.YYYY")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(24 * DIVIDER)
                  .fill(0)
                  .map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        {Math.floor(rowIndex / DIVIDER)}:
                        {(60 / DIVIDER) * (rowIndex % DIVIDER)}
                      </td>
                      {Array(7)
                        .fill(0)
                        .map((_, index) => (
                          <td key={index}></td>
                        ))}
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
