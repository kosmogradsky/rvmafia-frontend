import * as React from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom";

interface RegisterState {
  email: string;
  password: string;
  repeatPassword: string;
  message: string;
}

export function Register() {
  const [state, setState] = React.useState<RegisterState>({
    email: "",
    password: "",
    repeatPassword: "",
    message: "",
  });
  const history = useHistory();

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (state.password !== state.repeatPassword) {
        setState({
          ...state,
          message:
            "Пароль и повторение пароля не совпадают. Введите их снова, они должны быть одинаковые.",
        });
        return;
      }

      createUserWithEmailAndPassword(getAuth(), state.email, state.password)
        .then(() => {
          history.push("/");
        })
        .catch((err) => {
          if (err.code === "auth/weak-password") {
            setState({
              ...state,
              message:
                "Этот пароль слишком слабый, должно быть не меньше 6 символов.",
            });
            return;
          }

          setState({
            ...state,
            message:
              "Произошла ошибка. Проверьте введённые данные и попробуйте ещё раз.",
          });
        });
    },
    [history, state]
  );

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <label>
          <span>Электронная почта: </span>
          <input
            type="text"
            name="email"
            value={state.email}
            onChange={(event) => {
              setState({ ...state, email: event.target.value });
            }}
          />
        </label>
        <label>
          <span>Придумайте пароль: </span>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={(event) => {
              setState({ ...state, password: event.target.value });
            }}
          />
        </label>
        <label>
          <span>Повторите придуманный пароль: </span>
          <input
            type="password"
            name="repeat-password"
            value={state.repeatPassword}
            onChange={(event) => {
              setState({ ...state, repeatPassword: event.target.value });
            }}
          />
        </label>
        <button type="submit">Войти</button>
      </form>
      {state.message === "" ? null : <div>{state.message}</div>}
    </>
  );
}
