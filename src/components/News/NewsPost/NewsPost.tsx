import classNames from "classnames";
import { FC } from "react";
import { Stack } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { NewsPost } from "../../../store/api/news/getNews";
import styles from "./NewsPost.module.css";

const NewsPostDisplay: FC<NewsPost> = ({ content, date, id, title }) => {
  return (
    <Stack gap={2}>
      <h2>
        {title} <span className={"badge text-bg-secondary"}>id: {id}</span>{" "}
      </h2>
      <p>{date}</p>
      {/* <p>id: {id}</p> */}
      <div className={classNames("border rounded p-3", styles.scroll)}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </Stack>
  );
};

export default NewsPostDisplay;
