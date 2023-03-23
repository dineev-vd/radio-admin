import { FC } from "react";
import { useParams } from "react-router-dom";
import ChannelForm from "../../components/ChannelForm/ChannelForm";
import { useGetChannelQuery } from "../../store/api/channels/getChannel";

const ChannelInfoContent: FC<{ id: string }> = ({ id }) => {
  const { data: channelInfo } = useGetChannelQuery(id);

  return <>{channelInfo && <ChannelForm {...channelInfo} />}</>;
};

const ChannelInfoView: FC = () => {
  const { id } = useParams();

  return <>{id && <ChannelInfoContent id={id} />}</>;
};

export default ChannelInfoView;
