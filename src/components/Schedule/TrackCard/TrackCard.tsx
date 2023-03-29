import dayjs from "dayjs";
import ru from "dayjs/locale/ru";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
import { FC, MouseEvent, useMemo } from "react";
import styles from "../Schedule.module.css";

dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(duration);

type TrackCardProps = {
  title?: string;
  start: number;
  duration: number;
  onMouseDown?: (e: MouseEvent) => void;
  onClick?: (e: MouseEvent) => void;
  fake?: boolean;
};

const TrackCard: FC<TrackCardProps> = ({
  duration,
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
            onMouseDown={(e) => onMouseDown?.(e)}
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

export default TrackCard;
