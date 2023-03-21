import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../store/api/auth/logout";
import { setIsAuthenticated } from "../../store/slices/authSlice";
import styles from "./Layout.module.css";

const Layout: FC = () => {
  const dispatch = useDispatch();
  const [trigger, { isSuccess }] = useLogoutMutation();

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
      <header className={styles.header}></header>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <ul>
            <li>Треки</li>
            <li>Каналы</li>
            <li>Подкасты</li>
            <li>Новости</li>
            <li>Программы</li>
            <li>Эфир</li>
            <button onClick={onLogout}>Выйти</button>
          </ul>
        </div>
        <div className={styles.content}></div>
      </div>
    </div>
  );
};

export default Layout;
