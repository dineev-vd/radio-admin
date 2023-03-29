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
import { Button, Form, OverlayTrigger, Popover, Table } from "react-bootstrap";
import { ScheduleTrack } from "../../store/api/channels/getSchedule";
import { SelectedSchedule } from "../../views/ChannelsView/ScheduleView";
import { DateRange } from "../DateRangeSelect/DateRangeSelect";
import styles from "./Schedule.module.css";
import TrackCard from "./TrackCard/TrackCard";

dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(duration);

const DIVIDER_RANGE = [2, 3, 6, 12, 20, 30, 60];
// const snapRangeMilliseconds = 0.5 * 60 * 1000;

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
  onReshuffle: (date: Dayjs) => void;
  onDayCopy: (from: Dayjs, to: Dayjs) => void;
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
  onReshuffle,
  onDayCopy,
}) => {
  const [dividerIndex, setDividerIndex] = useState(3);
  const divider = useMemo(() => DIVIDER_RANGE[dividerIndex], [dividerIndex]);
  const snapRangeMilliseconds = useMemo(
    () => (60 / divider) * 60 * 1000 * 0.2,
    [divider]
  );

  const overlayRef = useRef<HTMLDivElement>(null);

  const weekDays = useMemo(() => {
    const duration = dayjs
      .duration(selectedRange.to.diff(selectedRange.from))
      .asDays();

    return Array(duration)
      .fill(1)
      .map((_, index) => selectedRange.from.add(index, "day"));
  }, [selectedRange.from, selectedRange.to]);

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
              ) < snapRangeMilliseconds
          );
          const snapEnd = snapsRef.current.start.find(
            (v) =>
              Math.abs(
                dayjs(newEnd).add(fakeDayDeltaRef.current, "days").diff(v)
              ) < snapRangeMilliseconds
          );

          if (snapStart) {
            newStart =
              snapStart.subtract(fakeDayDeltaRef.current, "days").unix() * 1000;
          } else if (snapEnd) {
            newStart =
              snapEnd.subtract(fakeDayDeltaRef.current, "days").unix() * 1000 -
              (newEnd - newStart);
          }

          setFakeStart(newStart);
          fakeStartRef.current = newStart;
        }
      }
    },
    [data, snapRangeMilliseconds]
  );

  const handleMouseUp = useCallback(() => {
    if (overlayRef.current) {
      setDragId(undefined);

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

  return (
    <div className={styles.wrapper}>
      <Form.Group>
        <Form.Label>Масштаб</Form.Label>
        <Form.Range
          value={dividerIndex}
          max={DIVIDER_RANGE.length - 1}
          onChange={(e) => setDividerIndex(+e.target.value)}
        />
      </Form.Group>
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
                  variant={dragIndex.type}
                  fake
                />
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
                  variant={"old"}
                />
              ))}
              {Object.entries(data.new).map(([id, track]) => (
                <TrackCard
                  duration={dayjs(track.enddate).diff(dayjs(track.startdate))}
                  onMouseDown={(e) => onMouseDown(e, { id, type: "new" })}
                  start={dayjs(track.startdate).unix() * 1000}
                  title={track.track?.title}
                  key={track.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick({ id, type: "new" });
                  }}
                  variant={"new"}
                />
              ))}
            </div>
            <Table bordered striped>
              <thead>
                <tr className={styles.th}>
                  <th ref={headerRef}></th>
                  {weekDays.map((date, index) => (
                    <th key={index}>
                      <button onClick={() => onReshuffle(date)}>
                        Перемешать
                      </button>
                      <CopyFromDayPopover
                        copy={(from) => onDayCopy(from, date)}
                      />
                      {date.format("DD.MM.YYYY")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array(24 * divider)
                  .fill(0)
                  .map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        {Math.floor(rowIndex / divider)}:
                        {(60 / divider) * (rowIndex % divider)}
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

const CopyFromDayPopover: FC<{ copy: (from: Dayjs) => void }> = ({ copy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(dayjs());

  return (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={isOpen}
      rootClose
      overlay={
        <Popover>
          <Popover.Header>Выберите дату</Popover.Header>
          <Popover.Body>
            <Form.Control
              type="date"
              value={date.format("YYYY-MM-DD")}
              onChange={(e) => setDate(dayjs(e.target.value))}
            />
            <Button
              onClick={() => {
                copy(date);
                setIsOpen(false);
              }}
            >
              Скопировать
            </Button>
          </Popover.Body>
        </Popover>
      }
    >
      <Button variant="success" onClick={() => setIsOpen((p) => !p)}>
        Скопировать из дня
      </Button>
    </OverlayTrigger>
  );
};

export default Schedule;
