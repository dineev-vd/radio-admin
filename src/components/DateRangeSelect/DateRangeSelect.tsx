import dayjs, { Dayjs } from "dayjs";
import ru from "dayjs/locale/ru";
import { FC, useEffect, useState } from "react";
import { Form } from "react-bootstrap";

export type DateRange = {
  from: Dayjs;
  to: Dayjs;
};

type DateRangeSelectProps = {
  onChange: (range: DateRange) => void;
};

const DateRangeSelect: FC<DateRangeSelectProps> = ({ onChange }) => {
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    const curDate = dayjs(date).locale(ru);

    onChange({
      from: curDate.weekday(0).hour(0).minute(0).second(0),
      to: curDate.weekday(7).hour(0).minute(0).second(0),
    });
  }, [date, onChange]);

  return (
    <Form.Control
      onChange={(e) => setDate(e.target.value)}
      type={"date"}
      value={date}
    />
  );
};

export default DateRangeSelect;
