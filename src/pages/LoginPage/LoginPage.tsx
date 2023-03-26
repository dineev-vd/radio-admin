import classNames from "classnames";
import { FC, useEffect } from "react";
import { Button, Container, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginParams, useLoginMutation } from "../../store/api/auth/login";
import { selectIsAuthenticated } from "../../store/selectors/authSelectors";
import { setIsAuthenticated } from "../../store/slices/authSlice";
import styles from "./LoginPage.module.css";

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
    <div className={styles.container}>
      <Container
        className={classNames("border rounded p-3 shadow", styles.form)}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type={"email"}
                {...register("email")}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type={"password"}
                {...register("password")}
              ></Form.Control>
            </Form.Group>
            <Button type={"submit"}>Войти</Button>
          </Stack>
        </Form>
      </Container>
    </div>
  );
};
