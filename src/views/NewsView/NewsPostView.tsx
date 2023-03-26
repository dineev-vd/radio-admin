import { FC, useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
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
    <Stack style={{ flex: "1 1", flexBasis: 0 }} gap={3}>
      {data &&
        (isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)}>Отменить</Button>
            <NewsPostEditor
              onSubmit={(change) => trigger({ id, change })}
              defaultValues={data}
            />
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>Редактировать</Button>
            <NewsPostDisplay {...data} />
          </>
        ))}
    </Stack>
  );
};

const NewsPostView: FC = () => {
  const { id } = useParams();

  return <>{id && <NewsPostViewContent id={id} />}</>;
};

export default NewsPostView;
