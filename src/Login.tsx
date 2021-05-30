import * as React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router";

interface LoginState {
  email: string;
  password: string;
  message: string;
}

export function Login() {
  const [state, setState] = React.useState<LoginState>({
    email: "",
    password: "",
    message: "",
  });
  const history = useHistory();

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      signInWithEmailAndPassword(getAuth(), state.email, state.password)
        .then(() => {
          history.push("/");
        })
        .catch((err) => {
          if (err.code === "auth/user-not-found") {
            setState({
              ...state,
              message: "Мы не нашли пользователя с такой электронной почтой.",
            });
            return;
          }

          if (err.code === "auth/wrong-password") {
            setState({
              ...state,
              message:
                "Вы ввели неправильный пароль, поэтому мы вас не впустим.",
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
    [state, history]
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
          <span>Пароль: </span>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={(event) => {
              setState({ ...state, password: event.target.value });
            }}
          />
        </label>
        <button type="submit">Войти</button>
      </form>
      {state.message === "" ? null : <div>{state.message}</div>}
    </>
  );
}
