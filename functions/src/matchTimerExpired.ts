import * as admin from "firebase-admin";
import { europeanFunctions } from "./europeanFunctions";

export const matchStart = europeanFunctions.pubsub
  .topic("timerExpired")
  .onPublish((message) => {
    const db = admin.firestore();

    return db.runTransaction(async (transaction) => {
      const timerRef = db.collection("timers").doc(message.json.timerId);
      const timerSnapshot = await transaction.get(timerRef);
      const timer = timerSnapshot.data();

      if (timer === undefined) {
        return;
      }

      const matchRef = db.collection("matches").doc(timer.matchId);
      const matchSnapshot = await transaction.get(matchRef);
      const match = matchSnapshot.data();

      if (match === undefined) {
        transaction.delete(timerRef);
        return;
      }

      switch (timer.action) {
        case "nextPlayerToPickCard": {
          if (match.state.type !== "playerPicksCard") {
            transaction.delete(timerRef);
            return;
          }

          if (match.state.whoPicks !== getPrevPlayerPosition(timer.whosNext)) {
            transaction.delete(timerRef);
            return;
          }
        }
      }

      transaction.delete(timerRef);
    });
  });
