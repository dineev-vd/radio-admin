import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginParams, useLoginMutation } from "../../store/api/auth/login";
import { selectIsAuthenticated } from "../../store/selectors/authSelectors";
import { setIsAuthenticated } from "../../store/slices/authSlice";

export const LoginPage: FC = () => {
  const { register, handleSubmit } = useForm<LoginParams>();

  const [trigger, { isSuccess }] = useLoginMutation();
  const navigate = useNavigate();
  const onSubmit = (data: LoginParams) => {
    trigger(data);
  };
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setIsAuthenticated(true));
    }
  }, [dispatch, isSuccess, navigate]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type={"email"} {...register("email")}></input>
        <input type={"password"} {...register("password")}></input>
        <button type={"submit"}>Войти</button>
      </form>
    </div>
  );
};
