import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { europeanFunctions } from "./europeanFunctions";

export const matchStart = europeanFunctions.https.onCall((data, context) => {
  const { matchId } = data;
  const db = admin.firestore();

  return db.runTransaction(async (transaction) => {
    const matchRef = db.collection("matches").doc(matchId);
    const matchSnapshot = await transaction.get(matchRef);
    const match = matchSnapshot.data();

    if (match === undefined) {
      throw new functions.https.HttpsError(
        "not-found",
        "This match does not exist in our database."
      );
    }

    if (match.judge.playerId !== context.auth?.uid) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only the judge can start this match."
      );
    }

    setPlayerPicksCard(transaction, matchId, "first");
  });
});
