import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewsPostDisplay from "../../components/News/NewsPost/NewsPost";
import NewsPostEditor from "../../components/News/NewsPostEditor/NewsPostEditor";
import { useGetNewsPostQuery } from "../../store/api/news/getNewsPost";
import { usePatchNewsPostMutation } from "../../store/api/news/patchNews";

const NewsPostViewContent: FC<{ id: string }> = ({ id }) => {
  const { data } = useGetNewsPostQuery({ id });
  const [isEditing, setIsEditing] = useState(false);
  const [trigger, { isSuccess }] = usePatchNewsPostMutation();

  useEffect(() => {
    if (isSuccess) {
      setIsEditing(false);
    }
  }, [isSuccess]);

  return (
    <div>
      {data &&
        (isEditing ? (
          <>
            <button onClick={() => setIsEditing(false)}>Отменить</button>
            <NewsPostEditor
              onSubmit={(change) => trigger({ id, change })}
              defaultValues={data}
            />
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Редактировать</button>
            <NewsPostDisplay {...data} />
          </>
        ))}
    </div>
  );
};

const NewsPostView: FC = () => {
  const { id } = useParams();

  return <>{id && <NewsPostViewContent id={id} />}</>;
};

export default NewsPostView;
