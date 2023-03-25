import { FC } from "react";
import { Channel } from "../../../store/api/channels/getChannel";

const ChannelForm: FC<Channel> = ({ description, id, logo, status, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{logo}</p>
      <p>{status}</p>
      <p>id: {id}</p>
    </div>
  );
};

export default ChannelForm;
