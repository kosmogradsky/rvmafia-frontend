import * as admin from "firebase-admin";
import { between } from "./between";
import { europeanFunctions } from "./europeanFunctions";

export const matchCreate = europeanFunctions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const db = admin.firestore();
    let enoughPlayersForNextIteration = true;

    while (enoughPlayersForNextIteration) {
      enoughPlayersForNextIteration = await db.runTransaction(
        async (transaction) => {
          const generalRef = db.collection("general").doc("general");
          const generalSnapshot = await transaction.get(generalRef);
          const general = generalSnapshot.data();

          const currentPlayersInQueueCount: number =
            general?.playersInQueueCount ?? 0;
          const currentJudgesInQueueCount: number =
            general?.judgesInQueueCount ?? 0;

          if (
            currentPlayersInQueueCount >= 10 &&
            currentJudgesInQueueCount >= 1
          ) {
            const playersQueueEntriesRef = db
              .collection("queueEntries")
              .where("queueingAs", "==", "player")
              .orderBy("orderToken")
              .limit(10);
            const judgesQueueEntriesRef = db
              .collection("queueEntries")
              .where("queueingAs", "==", "judge")
              .orderBy("orderToken")
              .limit(1);
            const playersQueueEntries = await transaction.get(
              playersQueueEntriesRef
            );
            const judgesQueueEntries = await transaction.get(
              judgesQueueEntriesRef
            );
            const judgeQueueEntry = judgesQueueEntries.docs[0]!;

            const matchRef = db.collection("matches").doc();
            transaction.set(matchRef, {
              judge: { playerId: judgeQueueEntry.id },
              first: { playerId: playersQueueEntries.docs[0]!.id },
              second: { playerId: playersQueueEntries.docs[1]!.id },
              third: { playerId: playersQueueEntries.docs[2]!.id },
              fourth: { playerId: playersQueueEntries.docs[3]!.id },
              fifth: { playerId: playersQueueEntries.docs[4]!.id },
              sixth: { playerId: playersQueueEntries.docs[5]!.id },
              seventh: { playerId: playersQueueEntries.docs[6]!.id },
              eighth: { playerId: playersQueueEntries.docs[7]!.id },
              ninth: { playerId: playersQueueEntries.docs[8]!.id },
              tenth: { playerId: playersQueueEntries.docs[9]!.id },
            });

            transaction.delete(judgeQueueEntry.ref);
            transaction.set(
              db.collection("players").doc(judgeQueueEntry.id),
              { inMatch: matchRef.id },
              { merge: true }
            );
            for (const playerQueueEntry of playersQueueEntries.docs) {
              transaction.delete(playerQueueEntry.ref);
              transaction.set(
                db.collection("players").doc(playerQueueEntry.id),
                { inMatch: matchRef.id },
                { merge: true }
              );
            }

            transaction.set(
              db.collection("general").doc("general"),
              {
                playersInQueueCount: admin.firestore.FieldValue.increment(-10),
                judgesInQueueCount: admin.firestore.FieldValue.increment(-1),
              },
              { merge: true }
            );

            return true;
          } else {
            const allQueueEntriesRef = db.collection("queueEntries");
            const allQueueEntries = await transaction.get(allQueueEntriesRef);

            for (const queueEntrySnapshot of allQueueEntries.docs) {
              const queueEntry = queueEntrySnapshot.data();
              const nextOrderTokenRange = queueEntry.orderTokenRange / 2;
              const integerOrderTokenRange =
                nextOrderTokenRange >= 1 ? nextOrderTokenRange : 1;

              transaction.set(
                queueEntrySnapshot.ref,
                {
                  orderToken: between(1, integerOrderTokenRange),
                  orderTokenRange: integerOrderTokenRange,
                },
                { merge: true }
              );
            }

            return false;
          }
        }
      );
    }
  });
