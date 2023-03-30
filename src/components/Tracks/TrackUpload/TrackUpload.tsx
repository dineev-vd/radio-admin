import { FC } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";

type UploadFileForm = {
  track_file: FileList;
};

const TrackUpload: FC<{ onSubmit: (formData: FormData) => void }> = ({
  onSubmit: onSubmitOuter,
}) => {
  const { register, handleSubmit, reset, watch } = useForm<UploadFileForm>();

  const onSubmit = (data: UploadFileForm) => {
    const formData = new FormData();
    formData.append("file", data.track_file[0]);
    onSubmitOuter(formData);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label>
          Выберите файл и загрузите его для добавления трека в список
        </Form.Label>
        <Stack direction="horizontal" gap={2} className="col-md-5">
          <Form.Control type={"file"} {...register("track_file", {})} />
          {!!watch("track_file")?.length && (
            <Button type={"submit"}>Загрузить</Button>
          )}
        </Stack>
      </Form.Group>
    </Form>
  );
};

export default TrackUpload;
