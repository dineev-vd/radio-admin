import { FC } from "react";
import { Stack } from "react-bootstrap";
import { Channel } from "../../../store/api/channels/getChannel";

const ChannelForm: FC<Channel> = ({ description, id, logo, status, title }) => {
  return (
    <Stack gap={2}>
      <Stack direction="horizontal" gap={3}>
        <img
          style={{ width: 75, height: 75, borderRadius: "50%" }}
          alt={""}
          src={logo}
        ></img>
        <h2>{title}</h2>
      </Stack>
      <p>{description}</p>
      {/* <p>{status}</p> */}
      {/* <p>id: {id}</p> */}
    </Stack>
  );
};

export default ChannelForm;
