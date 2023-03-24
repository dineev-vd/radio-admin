import { FC } from "react";
import { useForm } from "react-hook-form";
import { NewTrack } from "../../../store/api/tracks/createTrack";

const TrackEditor: FC<{
  onSubmit: (data: NewTrack) => void;
  defaultValues?: Partial<NewTrack>;
}> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit } = useForm<NewTrack>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")}></input>

      <input {...register("performancer")}></input>

      <input {...register("year", { valueAsNumber: true })}></input>

      <button type={"submit"}>Сохранить</button>
    </form>
  );
};

export default TrackEditor;
