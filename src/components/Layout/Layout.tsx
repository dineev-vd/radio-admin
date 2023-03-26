import classNames from "classnames";
import { FC, useEffect } from "react";
import { Button, Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { NavLink, Route, Routes } from "react-router-dom";
import { useLogoutMutation } from "../../store/api/auth/logout";
import { useGetUserQuery } from "../../store/api/user/getUser";
import { setIsAuthenticated } from "../../store/slices/authSlice";
import { ChannelsView } from "../../views/ChannelsView/ChannelsView";
import { NewsView } from "../../views/NewsView/NewsView";
import { TracksView } from "../../views/TracksView/TracksView";
import styles from "./Layout.module.css";

const links: { path: string; title: string; element: JSX.Element }[] = [
  {
    path: "tracks",
    title: "Треки",
    element: <TracksView />,
  },
  {
    path: "channels",
    title: "Каналы",
    element: <ChannelsView />,
  },
  {
    path: "news",
    title: "Новости",
    element: <NewsView />,
  },
];

const Layout: FC = () => {
  const dispatch = useDispatch();
  const [trigger, { isSuccess }] = useLogoutMutation();
  const { data } = useGetUserQuery();

  const onLogout = () => {
    trigger();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setIsAuthenticated(false));
    }
  }, [dispatch, isSuccess]);

  return (
    <div className={styles.layout}>
      <div className={styles.contentWrapper}>
        <div
          className={classNames(
            "d-flex flex-column flex-shrink-0 p-3 text-white bg-dark",
            styles.sidebar
          )}
        >
          <div className={styles.sidebarContent}>
            <ul
              className={classNames(
                styles.sidebarLinks,
                "nav nav-pills flex-column mb-auto"
              )}
            >
              {links.map((link) => (
                <NavLink
                  className={({ isActive }) =>
                    classNames("nav-link text-white", { active: isActive })
                  }
                  to={link.path}
                >
                  {link.title}
                </NavLink>
              ))}
            </ul>
          </div>
          <hr></hr>
          <div
            className={
              "d-flex flex-row justify-content-between align-items-center"
            }
          >
            {data?.avatar && (
              <img
                style={{ width: 50, height: 50, borderRadius: "50%" }}
                src={`http://localhost:8080/${data.avatar}`}
                alt=""
              ></img>
            )}
            <div>{data?.name}</div>
            <Button onClick={onLogout}>Выйти</Button>
          </div>
        </div>
        <div className={classNames(styles.content, "p-4")}>
          <Stack className="h-100" gap={3}>
            <Routes>
              {links.map(({ path, element, title }) => (
                <>
                  <Route
                    path={`${path}/*`}
                    element={
                      <>
                        <h1>{title}</h1>
                        <hr></hr>
                        {element}
                      </>
                    }
                  />
                </>
              ))}
            </Routes>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default Layout;
