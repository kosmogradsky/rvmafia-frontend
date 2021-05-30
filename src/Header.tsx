import { getAuth } from "firebase/auth";
import * as React from "react";
import { Link } from "react-router-dom";
import { Presence } from "./Presence";
import { useUserLoadingState } from "./useUserLoadingState";

const styles = require("./Header.css").default;

export function Header() {
  const userState = useUserLoadingState();

  const signOut = React.useCallback(async () => {
    getAuth().signOut();
  }, []);

  const getUserView = () => {
    switch (userState.type) {
      case "LoadedUser": {
        return (
          <>
            <span>Привет снова, {userState.user.email}.</span>
            <button type="button" onClick={signOut}>
              Выйти
            </button>

            <Presence playerId={userState.user.uid} />
          </>
        );
      }
      case "LoadingUser": {
        return <>Загрузка...</>;
      }
      case "WithoutUser": {
        return (
          <>
            <Link to="/login" className={styles.loginLink}>
              Залогиниться
            </Link>
            <Link to="/register">Зарегистрироваться</Link>
          </>
        );
      }
    }
  };

  return <div className={styles.container}>{getUserView()}</div>;
}
