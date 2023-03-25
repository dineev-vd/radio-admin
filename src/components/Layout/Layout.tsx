import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink, Route, Routes } from "react-router-dom";
import { useLogoutMutation } from "../../store/api/auth/logout";
import { useGetUserQuery } from "../../store/api/user/getUser";
import { setIsAuthenticated } from "../../store/slices/authSlice";
import { ChannelsView } from "../../views/ChannelsView/ChannelsView";
import { NewsView } from "../../views/NewsView/NewsView";
import { TracksView } from "../../views/TracksView/TracksView";
import styles from "./Layout.module.css";

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
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.sidebarLinks}>
              <NavLink to={"tracks"}>Треки</NavLink>
              <NavLink to={"channels"}>Каналы</NavLink>
              <NavLink to={"podcasts"}>Подкасты</NavLink>
              <NavLink to={"news"}>Новости</NavLink>
              <NavLink to={"programs"}>Программы</NavLink>
              <NavLink to={"air"}>Эфир</NavLink>
            </div>
          </div>
          <div className={styles.sidebarFooter}>
            <div>{data?.name}</div>
            <button onClick={onLogout}>Выйти</button>
          </div>
        </div>
        <div className={styles.content}>
          <Routes>
            <Route path={"tracks/*"} element={<TracksView />} />
            <Route path={"channels/*"} element={<ChannelsView />} />
            <Route path={"podcasts/*"} element={"Подкасты"} />
            <Route path={"news/*"} element={<NewsView />} />
            <Route path={"programs/*"} element={"Программы"} />
            <Route path={"air/*"} element={"Эфир"} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Layout;
