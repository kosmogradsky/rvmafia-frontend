import * as React from "react";
import { useUserLoadingState } from "./useUserLoadingState";
import { SearchButton } from "./SearchButton";

export function Search() {
  const userState = useUserLoadingState();

  const getSearchButton = () => {
    switch (userState.type) {
      case "LoadedUser": {
        return <SearchButton user={userState.user} />;
      }
      case "LoadingUser": {
        return <div>Загрузка...</div>;
      }
      case "WithoutUser": {
        return <div>Чтобы начать поиск, сначала залогиньтесь.</div>;
      }
    }
  };

  return (
    <div>
      Поиск игры
      {getSearchButton()}
    </div>
  );
}
