import dayjs from "dayjs";
import { FC, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { ScheduleChange } from "../../../store/api/channels/patchSchedule";
import { useGetTrackQuery } from "../../../store/api/tracks/getTrack";
import { useGetTracksQuery } from "../../../store/api/tracks/getTracks";
import EntriesTable from "../../EntriesTable/EntriesTable";
import TrackDisplay from "../../Tracks/Track/TrackDisplay";

type TrackSelectProps = {
  onChange: (trackId: string) => void;
  value?: string;
};

const TrackSelect: FC<TrackSelectProps> = ({ onChange, value }) => {
  const [query, setQuery] = useState("");
  const { data } = useGetTracksQuery({ query });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { data: trackData } = useGetTrackQuery(
    { id: value ?? "" },
    { skip: !value }
  );

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
    onChange: (change: Partial<ScheduleChange>) => void;
  }
> = ({ onChange, ...defaultValues }) => {
  const { enddate, startdate, trackid } = defaultValues;

  const parsedStartDate = dayjs(startdate).format("YYYY-MM-DDTHH:mm:ss");
  const parsedEndDate = dayjs(enddate).format("YYYY-MM-DDTHH:mm:ss");

  return (
    <Stack gap={2}>
      <Form.Group>
        <Form.Label>Время начала</Form.Label>
        <Form.Control
          type="datetime-local"
          step={1}
          value={parsedStartDate}
          onChange={(e) =>
            onChange({
              ...defaultValues,
              startdate: dayjs(e.target.value).utc().format(),
            })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Время конца</Form.Label>
        <Form.Control
          type="datetime-local"
          step={1}
          value={parsedEndDate}
          onChange={(e) =>
            onChange({
              ...defaultValues,
              enddate: dayjs(e.target.value).utc().format(),
            })
          }
        />
      </Form.Group>

      <TrackSelect
        value={trackid}
        onChange={(id) => onChange({ ...defaultValues, trackid: id })}
      />

      <Button type="submit">Сохранить</Button>
    </Stack>
  );
};

export default ScheduleForm;
