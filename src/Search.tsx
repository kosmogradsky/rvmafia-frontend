import * as React from "react";
import { useUserLoadingState } from "./useUserLoadingState";
import { SearchForm } from "./SearchForm";
import { getNumberWithCase } from "./getNumberWithCase";
import { getFirestore } from "@firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

export function Search() {
  const userState = useUserLoadingState();

  const getSearchForm = () => {
    switch (userState.type) {
      case "LoadedUser": {
        return <SearchForm user={userState.user} />;
      }
      case "LoadingUser": {
        return <div>Загрузка...</div>;
      }
      case "WithoutUser": {
        return <div>Чтобы начать поиск, сначала залогиньтесь.</div>;
      }
    }
  };

  const [usersInQueueCount, setUsersInQueueCount] = React.useState({
    playersInQueueCount: 0,
    judgesInQueueCount: 0,
  });

  React.useEffect(() => {
    const db = getFirestore();
    const generalRef = doc(db, "general", "general");

    const unsubscribe = onSnapshot(generalRef, (doc) => {
      const general = doc.data();

      setUsersInQueueCount({
        playersInQueueCount: general?.playersInQueueCount ?? 0,
        judgesInQueueCount: general?.judgesInQueueCount ?? 0,
      });
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      <div>Поиск игры</div>
      <div>
        {usersInQueueCount.judgesInQueueCount === 0
          ? "Нет судей."
          : capitalizeFirstLetter(
              getNumberWithCase(
                usersInQueueCount.judgesInQueueCount,
                "судья ищет",
                "судьи ищут",
                "судей ищут"
              )
            ) + " игру."}
      </div>
      <div>
        {usersInQueueCount.playersInQueueCount === 0
          ? "Нет игроков."
          : capitalizeFirstLetter(
              getNumberWithCase(
                usersInQueueCount.playersInQueueCount,
                "игрок ищет",
                "игрока ищут",
                "игроков ищут"
              )
            ) + " игру."}
      </div>
      {getSearchForm()}
    </div>
  );
}
