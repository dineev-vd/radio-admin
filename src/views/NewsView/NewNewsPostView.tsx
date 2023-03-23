import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewsPostEditor from "../../components/News/NewsPostEditor/NewsPostEditor";
import {
  NewNewsPost,
  useCreateNewsPostMutation,
} from "../../store/api/news/createNewsPost";

const NewNewsPostView: FC = () => {
  const [trigger, { isSuccess }] = useCreateNewsPostMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("../");
    }
  }, [isSuccess, navigate]);

  const onSubmit = (data: NewNewsPost) => {
    trigger(data);
  };

  return (
    <div>
      <h2>Создайте новость</h2>

      <NewsPostEditor onSubmit={onSubmit} />
    </div>
  );
};

export default NewNewsPostView;
