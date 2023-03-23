import { FC } from "react";
import ReactMarkdown from "react-markdown";
import { NewsPost } from "../../../store/api/news/getNews";

const NewsPostDisplay: FC<NewsPost> = ({ content, date, id, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{date}</p>
      <p>id: {id}</p>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default NewsPostDisplay;
