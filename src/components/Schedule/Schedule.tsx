import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
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
import { ScheduleResponse } from "../../store/api/channels/getSchedule";
import styles from "./Schedule.module.css";

dayjs.extend(relativeTime);
dayjs.extend(weekday);

const DIVIDER = 6;

type TrackCardProps = {
  title: string;
  start: number;
  duration: number;
  index: number;
  onMouseDown?: (e: RMouseEvent, index: number) => void;
  onClick?: (e: RMouseEvent) => void;
  fake?: boolean;
};

const TrackCard: FC<TrackCardProps> = ({
  duration,
  index,
  start,
  title,
  onMouseDown,
  onClick,
  fake = false,
}) => {
  const array = useMemo(() => {
    let curArray = [start];

    const end = dayjs(duration + start);

    let endOfDay = dayjs(start).second(0).minute(0).hour(0).add(1, "day");

    while (end.diff(endOfDay) > 0) {
      // уходим в конец дня
      curArray.push(endOfDay.unix() * 1000);
      endOfDay = endOfDay.add(1, "day");
    }

    curArray.push(start + duration);

    let finalArray: { startSeconds: number; duration: number }[] = [];
    for (let i = 0; i < curArray.length - 1; i++) {
      finalArray.push({
        startSeconds:
          dayjs(curArray[i]).hour() * 3600 +
          dayjs(curArray[i]).minute() * 60 +
          dayjs(curArray[i]).second(),
        duration: curArray[i + 1] - curArray[i],
      });
    }

    return finalArray;
  }, [duration, start]);

  return (
    <>
      {array.map(({ duration, startSeconds }, dayAddition) => {
        return (
          <div
            onClick={onClick}
            key={dayAddition}
            className={styles.trackCard}
            onMouseDown={(e) => onMouseDown?.(e, index)}
            style={{
              width: `calc(100% / 7)`,
              transform: `translateX(calc(100% * ${
                dayjs(start).locale(ru).weekday() + dayAddition
              }))`,
              height: `calc(100% * ${duration / 1000 / (24 * 60 * 60)})`,
              top: `calc(100% * ${startSeconds / (24 * 60 * 60)})`,
              opacity: fake ? 0.5 : 1,
              zIndex: fake ? 2 : 1,
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            <div className="p-2" style={{ position: "sticky", top: 0 }}>
              {title}
            </div>
          </div>
        );
      })}
    </>
  );
};

const Schedule: FC<{
  date: string;
  data: ScheduleResponse["tracks"];
  onClick: (index: number) => void;
  onChange: (index: number, start: number, duration: number) => void;
}> = ({ date, data, onClick, onChange }) => {
  const tracks = useMemo(() => {
    return data.map((track) => ({
      id: track.id,
      title: track.track.title,
      start: dayjs(track.startdate).unix() * 1000,
      duration: dayjs(track.enddate).diff(dayjs(track.startdate)),
    }));
  }, [data]);

  const overlayRef = useRef<HTMLDivElement>(null);

  const weekDays = useMemo(() => {
    const curDate = dayjs(date).locale(ru);

    return Array(7)
      .fill(1)
      .map((_, index) => curDate.weekday(index));
  }, [date]);

  const processedTracks = useMemo(() => {
    return tracks.map((track) => {
      return {
        weekDay: dayjs(track.start).locale(ru).weekday(),
        startSeconds:
          dayjs(track.start).hour() * 60 * 60 +
          dayjs(track.start).minute() * 60 +
          dayjs(track.start).second(),
        ...track,
      };
    });
  }, [tracks]);

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

  const startOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [dragIndex, setDragIndex] = useState<number>(-1);
  const dragIndexRef = useRef<number>(-1);

  const [fakeStart, setFakeStart] = useState<number>(0);
  const fakeStartRef = useRef<number>(0);

  const [fakeDayDelta, setFakeDayDelta] = useState<number>(0);
  const fakeDayDeltaRef = useRef<number>(0);

  const startDayRef = useRef<number>(0);

  const dragPositionRef = useRef<number>(0);

  const startPositionRef = useRef<number>(0);

  const [dragDay, setDragDay] = useState<number>(0);
  const dragDayRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (overlayRef.current) {
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
        const newStart =
          processedTracks[dragIndexRef.current].start + newStartDelta;

        setFakeStart(newStart);
        fakeStartRef.current = newStart;

        // setDragPosition({ y });
        // dragPositionRef.current = y;
      }
    },
    [processedTracks]
  );

  const handleMouseUp = useCallback(() => {
    if (overlayRef.current) {
      setDragIndex(-1);

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

      onChange(
        dragIndexRef.current,
        dayjs(fakeStartRef.current).add(fakeDayDeltaRef.current, "day").unix() *
          1000,
        processedTracks[dragIndexRef.current].duration
      );

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
  }, [onChange, processedTracks]);

  const onMouseDown = useCallback(
    (e: RMouseEvent, index: number) => {
      const onMouseMove = () => {
        document.removeEventListener("mouseup", reset);
        document.removeEventListener("mousemove", onMouseMove);

        startOffsetRef.current = {
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
        };
        setDragIndex(index);
        dragIndexRef.current = index;
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
    [handleMouseMove, handleMouseUp]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => onClick(-1)}
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
              {dragIndex !== -1 && (
                <TrackCard
                  duration={processedTracks[dragIndex].duration}
                  index={dragIndex}
                  start={
                    dayjs(fakeStart).add(fakeDayDelta, "day").unix() * 1000
                  }
                  title={processedTracks[dragIndex].title}
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
              {processedTracks.map((track, index) => (
                <TrackCard
                  duration={track.duration}
                  index={index}
                  onMouseDown={onMouseDown}
                  start={track.start}
                  title={track.title}
                  key={track.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(index);
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
