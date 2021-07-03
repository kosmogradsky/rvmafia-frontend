import { europeanFunctions } from "./europeanFunctions";
import * as admin from "firebase-admin";
import { pusher } from "./pusher";

export const pusherChannelExistence = europeanFunctions.https.onRequest(
  async (req, res) => {
    const webhook = pusher.webhook({
      rawBody: req.rawBody.toString("utf8"),
      headers: req.headers,
    });

    if (webhook.isValid()) {
      for (const event of webhook.getEvents()) {
        const channelName = event.channel;

        if (channelName.startsWith("private-")) {
          const channelNameWithoutPrefix = channelName.replace("private-", "");
          const [userId, channelTopic] = channelNameWithoutPrefix.split("@");

          if (userId === undefined) {
            continue;
          }

          if (channelTopic === "presence") {
            const db = admin.firestore();
            const userRef = db.collection("players").doc(userId);

            if (event.name === "channel_occupied") {
              await userRef.set({ isOnline: true }, { merge: true });
            }

            if (event.name === "channel_vacated") {
              const queueRef = userRef.collection("queue").doc("queue");
              const batch = db.batch();

              batch
                .set(userRef, { isOnline: false }, { merge: true })
                .delete(queueRef);

              await batch.commit();
            }
          }
        }
      }
    }

    res.end();
  }
);
