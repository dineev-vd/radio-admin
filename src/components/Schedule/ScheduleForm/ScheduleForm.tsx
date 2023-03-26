import dayjs from "dayjs";
import { FC, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { ScheduleChange } from "../../../store/api/channels/patchSchedule";
import { useGetTrackQuery } from "../../../store/api/tracks/getTrack";
import { useGetTracksQuery } from "../../../store/api/tracks/getTracks";
import EntriesTable from "../../EntriesTable/EntriesTable";
import TrackDisplay from "../../Tracks/Track/TrackDisplay";

type TrackSelectProps = {
  onChange: (trackId: string) => void;
  value: string;
};

const TrackSelect: FC<TrackSelectProps> = ({ onChange, value }) => {
  const [query, setQuery] = useState("");
  const { data } = useGetTracksQuery({ query });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { data: trackData } = useGetTrackQuery({ id: value });

  return (
    <>
      {trackData && <TrackDisplay {...trackData} />}
      <Button variant="primary" onClick={handleShow}>
        Выбрать трек
      </Button>

      <Modal size="xl" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Выберите трек</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              onChange={(e) => setQuery(e.target.value)}
              placeholder={"Поиск трека..."}
            ></Form.Control>
            {data &&
              (data.tracks.length ? (
                <EntriesTable
                  data={data.tracks}
                  onEntryClick={(id) => {
                    onChange(id);
                    setShow(false);
                  }}
                />
              ) : (
                <div>Нет результатов</div>
              ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const ScheduleForm: FC<
  Partial<ScheduleChange> & {
    onSubmit: (change: ScheduleChange) => void;
  }
> = ({ onSubmit, startdate, enddate, ...defaultValues }) => {
  const { register, handleSubmit, control } = useForm<ScheduleChange>({
    defaultValues: {
      ...defaultValues,
      startdate: dayjs(startdate).format("YYYY-MM-DDTHH:mm:ss"),
      enddate: dayjs(enddate).format("YYYY-MM-DDTHH:mm:ss"),
    },
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <Form.Group>
          <Form.Label>Время начала</Form.Label>
          <Form.Control
            type="datetime-local"
            step={1}
            {...register("startdate", {
              setValueAs: (value) => dayjs(value).utc().format(),
            })}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Время конца</Form.Label>
          <Form.Control
            type="datetime-local"
            step={1}
            {...register("enddate", {
              setValueAs: (value) => dayjs(value).utc().format(),
            })}
          ></Form.Control>
        </Form.Group>
        <Controller
          name="trackid"
          control={control}
          render={({ field }) => <TrackSelect {...field} />}
        />
        <Button type="submit">Сохранить</Button>
      </Stack>
    </Form>
  );
};

export default ScheduleForm;
