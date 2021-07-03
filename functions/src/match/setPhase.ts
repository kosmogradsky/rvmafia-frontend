import * as admin from "firebase-admin";
import { MatchPhase } from "./MatchPhase";

export const setPhase = (
  transaction: admin.firestore.Transaction,
  matchId: string,
  matchPhase: MatchPhase
) => {
  const db = admin.firestore();

  transaction.set(
    db.collection("matchPhases").doc(matchId),
    matchPhase.toDocument()
  );

  transaction.set(db.collection("timers").doc(), {
    matchId,
    durationInMs: matchPhase.durationInMs,
  });
};
