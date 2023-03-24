import { FC } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

type UploadFileForm = {
  track_file: FileList;
};

const TrackUpload: FC<{ onSubmit: (formData: FormData) => void }> = ({
  onSubmit: onSubmitOuter,
}) => {
  const { register, handleSubmit, reset } = useForm<UploadFileForm>();

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
        <Form.Control type={"file"} {...register("track_file", {})} />
      </Form.Group>
      <button type={"submit"}>Загрузить</button>
    </Form>
  );
};

export default TrackUpload;
