import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { FC, useEffect, useRef } from "react";
import { Track } from "../../../store/api/tracks/getTracks";

dayjs.extend(duration);

const TrackDisplay: FC<Track> = ({
  title,
  audio,
  duration,
  id,
  performancer,
  year,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    audioRef.current?.load();
  }, [audio]);

  return (
    <div>
      <h2>{title}</h2>
      <p>Год: {year}</p>
      <p>Исполнитель: {performancer}</p>
      {/* <p>
        Продолжительность:{" "}
        {dayjs
          .duration(
            (+duration || Math.floor(Math.random() * 100 + 100) * 1000000) /
              1000000
          )
          .format("m:ss")}
      </p> */}
      <audio ref={audioRef} controls>
        <source src={audio} type="audio/ogg"></source>
      </audio>
    </div>
  );
};

export default TrackDisplay;
