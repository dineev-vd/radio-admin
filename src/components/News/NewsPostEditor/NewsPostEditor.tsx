import MarkdownEditor from "@uiw/react-markdown-editor";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { NewNewsPost } from "../../../store/api/news/createNewsPost";

const NewsPostEditor: FC<{
  onSubmit: (data: NewNewsPost) => void;
  defaultValues?: Partial<NewNewsPost>;
}> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit, control } = useForm<NewNewsPost>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")}></input>
      <Controller
        control={control}
        name={"content"}
        render={({ field }) => (
          <MarkdownEditor
            minHeight={"300px"}
            value={field.value}
            onChange={(value) => field.onChange(value)}
          />
        )}
      />
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default NewsPostEditor;
