import { FC } from "react";
import { Track } from "../../../store/api/tracks/getTracks";

const TrackDisplay: FC<Track> = ({
  title,
  audio,
  duration,
  id,
  performancer,
  year,
}) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>id: {id}</p>
      <p>{year}</p>
      <p>{performancer}</p>
      <p>{duration}</p>
      <p>{audio}</p>
    </div>
  );
};

export default TrackDisplay;
