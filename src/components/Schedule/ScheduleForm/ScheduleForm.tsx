import dayjs from "dayjs";
import { FC, useCallback, useEffect, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { ScheduleTrack } from "../../../store/api/channels/getSchedule";
import { Track, useGetTracksQuery } from "../../../store/api/tracks/getTracks";
import EntriesTable from "../../EntriesTable/EntriesTable";
import TrackDisplay from "../../Tracks/Track/TrackDisplay";

type TrackSelectProps = {
  onChange: (track: Track) => void;
  value?: Track;
};

const TrackSelect: FC<TrackSelectProps> = ({ onChange, value: trackData }) => {
  const [query, setQuery] = useState("");
  const { data } = useGetTracksQuery({ query });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
                  onEntryClick={(id, entry) => {
                    onChange(entry);
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
  Partial<ScheduleTrack> & {
    onChange: (change: Partial<ScheduleTrack>) => void;
  }
> = ({ onChange, ...defaultValues }) => {
  const { enddate, startdate, track } = defaultValues;

  const parsedStartDate = dayjs(startdate).format("YYYY-MM-DDTHH:mm:ss");
  const parsedEndDate = dayjs(enddate).format("YYYY-MM-DDTHH:mm:ss");

  const [isEndFromDuration, setIsEndFromDuration] = useState(false);

  useEffect(() => {
    const duration = dayjs(defaultValues.enddate).diff(
      dayjs(defaultValues.startdate),
      "seconds"
    );

    if (track && duration === +track.duration / 1000000000) {
      setIsEndFromDuration(true);
    } else {
      setIsEndFromDuration(false);
    }
  }, [defaultValues.enddate, defaultValues.startdate, track]);

  const handleCheck = useCallback(() => {
    const duration = dayjs(defaultValues.enddate).diff(
      dayjs(defaultValues.startdate),
      "seconds"
    );

    if (
      !isEndFromDuration &&
      track &&
      duration !== +track.duration / 1000000000
    ) {
      console.log("check");
      onChange({
        ...defaultValues,
        enddate: dayjs(defaultValues.startdate)
          .add(+track.duration / 1000000000, "seconds")
          .format(),
      });
    }

    setIsEndFromDuration((p) => !p);
  }, [defaultValues, isEndFromDuration, onChange, track]);

  const onTrackSelect = (value: Track) => {
    if (value) {
      onChange({
        ...defaultValues,
        track: value,
        enddate: dayjs(defaultValues.startdate)
          .add(+value.duration / 1000000000, "seconds")
          .format(),
      });
    }
  };

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
              startdate: dayjs(e.target.value).format(),
            })
          }
        />
      </Form.Group>
      {!isEndFromDuration && (
        <Form.Group>
          <Form.Label>Время конца</Form.Label>
          <Form.Control
            type="datetime-local"
            step={1}
            value={parsedEndDate}
            onChange={(e) =>
              onChange({
                ...defaultValues,
                enddate: dayjs(e.target.value).format(),
              })
            }
          />
        </Form.Group>
      )}
      <Form.Group>
        <Form.Label>Время конца</Form.Label>
        <Form.Check checked={isEndFromDuration} onChange={handleCheck} />
      </Form.Group>

      <TrackSelect
        value={track}
        onChange={(track) => {
          onTrackSelect(track);
        }}
      />
    </Stack>
  );
};

export default ScheduleForm;
