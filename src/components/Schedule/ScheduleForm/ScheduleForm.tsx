import dayjs from "dayjs";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { ScheduleChange } from "../../../store/api/channels/patchSchedule";

const ScheduleForm: FC<
  ScheduleChange & {
    onSubmit: (change: ScheduleChange) => void;
  }
> = ({ onSubmit, startdate, enddate, ...defaultValues }) => {
  const { register, handleSubmit } = useForm<ScheduleChange>({
    defaultValues: {
      ...defaultValues,
      startdate: dayjs(startdate).format("YYYY-MM-DDTHH:mm:ss"),
      enddate: dayjs(enddate).format("YYYY-MM-DDTHH:mm:ss"),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="datetime-local"
        step={1}
        {...register("startdate", {
          setValueAs: (value) => dayjs(value).utc().format(),
        })}
      ></input>
      <input
        type="datetime-local"
        step={1}
        {...register("enddate", {
          setValueAs: (value) => dayjs(value).utc().format(),
        })}
      ></input>
      <input {...register("trackid")}></input>
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default ScheduleForm;
