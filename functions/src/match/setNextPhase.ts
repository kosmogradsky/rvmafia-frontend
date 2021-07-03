import * as admin from "firebase-admin";
import { MatchPhase } from "./MatchPhase";

export const setNextPhase = async (
  transaction: admin.firestore.Transaction,
  matchId: string,
  matchPhase: MatchPhase
) => {
  const db = admin.firestore();

  const currentMatchPhaseRef = db.collection("matchPhases").doc(matchId);
  const currentMatchPhaseSnapshot = await transaction.get(currentMatchPhaseRef);
  const currentMatchPhaseDoc = currentMatchPhaseSnapshot.data();

  transaction.set(
    db.collection("matchPhases").doc(matchId),
    matchPhase.toDocument()
  );

  transaction.set(db.collection("timers").doc(), {
    matchId,
    durationInMs: matchPhase.durationInMs,
  });
};
