import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { LoginPage, MainPage } from "./pages";
import { useGetUserQuery } from "./store/api/user/getUser";
import { selectIsAuthenticated } from "./store/selectors/authSelectors";
import { setIsAuthenticated } from "./store/slices/authSlice";

export const Router: FC = () => {
  const { data, isSuccess, isLoading } = useGetUserQuery();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated !== undefined && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setIsAuthenticated(true));
    }
  }, [dispatch, isSuccess]);

  console.log(data);

  return (
    <>
      {isAuthenticated !== undefined && (
        <Routes>
          <Route path="/*" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      )}
    </>
  );
};
