import { FC } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NewChannel } from "../../../store/api/channels/createChannel";

const ChannelEditor: FC<{
  onSubmit: (data: NewChannel) => void;
  defaultValues?: Partial<NewChannel>;
}> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit } = useForm<NewChannel>({ defaultValues });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <Form.Group>
          <Form.Label>Название</Form.Label>
          <Form.Control {...register("title")}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Описание</Form.Label>
          <Form.Control
            {...register("description")}
            as="textarea"
            style={{ minHeight: 200 }}
          ></Form.Control>
        </Form.Group>
        <Stack direction="horizontal">
          <Button type={"submit"}>Сохранить</Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export default ChannelEditor;
