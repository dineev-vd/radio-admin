import { FC } from "react";
import { useForm } from "react-hook-form";
import { NewChannel } from "../../../store/api/channels/createChannel";

const ChannelEditor: FC<{
  onSubmit: (data: NewChannel) => void;
  defaultValues?: Partial<NewChannel>;
}> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit } = useForm<NewChannel>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")}></input>

      <input {...register("description")}></input>

      <button type={"submit"}>Сохранить</button>
    </form>
  );
};

export default ChannelEditor;
