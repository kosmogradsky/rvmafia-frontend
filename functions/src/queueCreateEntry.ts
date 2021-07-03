import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { europeanFunctions } from "./europeanFunctions";
import { between } from "./between";

export const queueCreateEntry = europeanFunctions.https.onCall((context) => {
  const db = admin.firestore();

  return db.runTransaction(async (transaction) => {
    if (context.auth === undefined) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You need to be authenticated to create a queue entry."
      );
    }

    const queueEntryRef = db.collection("queueEntries").doc(context.auth.uid);
    const queueEntrySnapshot = await transaction.get(queueEntryRef);

    if (queueEntrySnapshot.exists) {
      throw new functions.https.HttpsError(
        "already-exists",
        "A queue entry for this user already exists."
      );
    }

    const generalRef = db.collection("general").doc("general");

    transaction
      .set(
        generalRef,
        {
          [queueAs === "player" ? "playersInQueueCount" : "judgesInQueueCount"]:
            admin.firestore.FieldValue.increment(1),
        },
        { merge: true }
      )
      .set(queueEntryRef, {
        queueingAs: queueAs,
        orderToken: between(1, 1024),
        orderTokenRange: 1024,
      });
  });
});
