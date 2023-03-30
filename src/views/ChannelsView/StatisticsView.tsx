import dayjs from "dayjs";
import { FC, useState } from "react";
import { Form, Stack, Tooltip } from "react-bootstrap";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useGetChannelListenersQuery } from "../../store/api/channels/getChannelListeners";

const StatisticsView: FC<{ id: string }> = ({ id }) => {
  const [from, setFrom] = useState(
    dayjs().subtract(7, "hours").format("YYYY-MM-DDThh:mm")
  );

  const [to, setTo] = useState(dayjs().format("YYYY-MM-DDThh:mm"));
  const { data } = useGetChannelListenersQuery({
    id,
    from: dayjs(from, "yyyy-MM-ddThh:mm").format(),
    to: dayjs(to, "yyyy-MM-ddThh:mm").format(),
  });

  return (
    <div className="h-100 d-flex" style={{ flex: "1 1 " }}>
      {data && (
        <Stack className="h-100" gap={3} style={{ flex: "1 1 " }}>
          <Form>
            <Stack gap={2}>
              <Form.Group>
                <Form.Label>От</Form.Label>
                <Form.Control
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  type="datetime-local"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>До</Form.Label>
                <Form.Control
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  type="datetime-local"
                />
              </Form.Group>
            </Stack>
          </Form>
          <div style={{ flexBasis: 0, flex: "1 1" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={data.stats.map(({ count, time }) => ({
                  count,
                  time: dayjs(time).format("YYYY-MM-DD"),
                }))}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis dataKey="count" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      )}
    </div>
  );
};

export default StatisticsView;
