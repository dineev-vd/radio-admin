import MarkdownEditor from "@uiw/react-markdown-editor";
import { FC } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { NewNewsPost } from "../../../store/api/news/createNewsPost";
import styles from "./NewsPostEditor.module.css";

const NewsPostEditor: FC<{
  onSubmit: (data: NewNewsPost) => void;
  defaultValues?: Partial<NewNewsPost>;
}> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit, control } = useForm<NewNewsPost>({
    defaultValues,
  });

  return (
    <Form
      className="d-flex"
      style={{ flex: "1 1", flexBasis: 0 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack gap={2} style={{ flex: "1 1", flexBasis: 0 }}>
        <Form.Group>
          <Form.Label>Заголовок</Form.Label>
          <Form.Control {...register("title")}></Form.Control>
        </Form.Group>
        <Form.Group
          style={{
            flex: "1 1",
            flexBasis: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Form.Label>Контент</Form.Label>
          <div
            style={{
              flex: "1 1",
              flexBasis: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              control={control}
              name={"content"}
              render={({ field }) => (
                <MarkdownEditor
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  className={styles.editor}
                />
              )}
            />
          </div>
        </Form.Group>
        <Stack direction="horizontal">
          <Button type="submit">Сохранить</Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export default NewsPostEditor;
