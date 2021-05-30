import { User } from "@firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import * as React from "react";

export interface SearchButtonProps {
  user: User;
}

export function SearchButton(props: SearchButtonProps) {
  const [isInQueue, setIsInQueue] = React.useState<boolean>(false);

  React.useEffect(() => {
    const db = getFirestore();
    const playerRef = doc(db, "players", props.user.uid);

    onSnapshot(playerRef, (doc) => {
      const player = doc.data();

      if (player) {
        setIsInQueue(player.isInQueue);
      }
    });
  }, [props.user.uid]);

  const startSearching = React.useCallback(() => {
    const db = getFirestore();
    const playerRef = doc(db, "players", props.user.uid);
    setDoc(
      playerRef,
      {
        isInQueue: true,
      },
      { merge: true }
    );
  }, [props.user]);

  const stopSearching = React.useCallback(() => {
    const db = getFirestore();
    const playerRef = doc(db, "players", props.user.uid);
    setDoc(
      playerRef,
      {
        isInQueue: false,
      },
      { merge: true }
    );
  }, [props.user]);

  return isInQueue ? (
    <button type="button" onClick={stopSearching}>
      Остановить поиск
    </button>
  ) : (
    <button type="button" onClick={startSearching}>
      Начать поиск
    </button>
  );
}
