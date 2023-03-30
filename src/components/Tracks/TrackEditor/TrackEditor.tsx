import { FC } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NewTrack } from "../../../store/api/tracks/createTrack";

const TrackEditor: FC<{
  onSubmit: (data: NewTrack) => void;
  defaultValues?: Partial<NewTrack>;
}> = ({ onSubmit, defaultValues }) => {
  const { register, handleSubmit } = useForm<NewTrack>({ defaultValues });

  return (
    <Form className="gap" onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={3} className="col-md-4">
        <Form.Group>
          <Form.Label>Название</Form.Label>
          <Form.Control {...register("title")}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Исполнитель</Form.Label>
          <Form.Control {...register("performancer")}></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Год</Form.Label>
          <Form.Control
            {...register("year", { valueAsNumber: true })}
          ></Form.Control>
        </Form.Group>
        <Stack direction="horizontal">
          <Button type={"submit"}>Сохранить</Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export default TrackEditor;
