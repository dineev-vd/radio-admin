import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChannelEditor from "../../components/Channels/ChannelEdit/ChannelEdit";
import {
  NewChannel,
  useCreateChannelMutation,
} from "../../store/api/channels/createChannel";

const NewChannelView: FC = () => {
  const [trigger, { data }] = useCreateChannelMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate(`../${data.id}`);
    }
  }, [data, navigate]);

  const onSubmit = (data: NewChannel) => {
    trigger(data);
  };

  return (
    <div>
      <h2>Создайте канал</h2>
      <ChannelEditor onSubmit={onSubmit} />
    </div>
  );
};

export default NewChannelView;
