import { User } from "@firebase/auth";
import {
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import * as React from "react";

export interface SearchFormProps {
  user: User;
}

export function SearchForm(props: SearchFormProps) {
  const [queueingAs, setQueueingAs] =
    React.useState<"player" | "judge" | "notQueueing">("notQueueing");
  React.useEffect(() => {
    const db = getFirestore();
    const queueRef = doc(db, "players", props.user.uid, "queue", "queue");

    const unsubscribe = onSnapshot(queueRef, (doc) => {
      if (doc.exists()) {
        setQueueingAs(doc.data().queueingAs);
        return;
      }

      setQueueingAs("notQueueing");
    });

    return unsubscribe;
  }, [props.user.uid]);

  const [wantToQueueAs, setWantToQueueAs] =
    React.useState<"player" | "judge">("player");

  const startSearching = React.useCallback(() => {
    const db = getFirestore();
    const queueRef = doc(db, "players", props.user.uid, "queue", "queue");

    setDoc(queueRef, {
      queueingAs: wantToQueueAs,
      queuedAt: serverTimestamp(),
    });
  }, [props.user.uid, wantToQueueAs]);

  const stopSearching = React.useCallback(() => {
    const db = getFirestore();
    const queueRef = doc(db, "players", props.user.uid, "queue", "queue");

    deleteDoc(queueRef);
  }, [props.user.uid]);

  const setQueueingRole = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (queueingAs !== "notQueueing") {
        const db = getFirestore();
        const queueRef = doc(db, "players", props.user.uid, "queue", "queue");

        setDoc(queueRef, {
          queueingAs: event.target.value,
          queuedAt: serverTimestamp(),
        });
      }

      setWantToQueueAs(event.target.value as "player" | "judge");
    },
    [props.user.uid, queueingAs]
  );

  return (
    <>
      <label>
        <input
          type="radio"
          value="player"
          checked={
            queueingAs === "notQueueing"
              ? wantToQueueAs === "player"
              : queueingAs === "player"
          }
          onChange={setQueueingRole}
        />
        <span>Хочу играть</span>
      </label>
      <label>
        <input
          type="radio"
          value="judge"
          checked={
            queueingAs === "notQueueing"
              ? wantToQueueAs === "judge"
              : queueingAs === "judge"
          }
          onChange={setQueueingRole}
        />
        <span>Хочу судить</span>
      </label>
      {queueingAs === "notQueueing" ? (
        <button type="button" onClick={startSearching}>
          Начать поиск как {wantToQueueAs === "player" ? "игрок" : "судья"}
        </button>
      ) : (
        <>
          <div>
            Вы ищете игру как {queueingAs === "player" ? "игрок" : "судья"}.
          </div>
          <button type="button" onClick={stopSearching}>
            Остановить поиск
          </button>
        </>
      )}
    </>
  );
}
