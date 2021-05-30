import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as Pusher from "pusher";

admin.initializeApp();

const pusher = new Pusher({
  appId: "1152587",
  key: "e653a5e7be4cca671bb7",
  secret: "a5bd95af214e332fde76",
  cluster: "eu",
  useTLS: true,
});

exports.authorizePusher = functions.https.onCall(async (data, context) => {
  const { channelName, socketId } = data as {
    channelName: string;
    socketId: string;
  };

  if (channelName.startsWith("private-") === false) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Can only authorize private channels."
    );
  }

  const channelNameWithoutPrefix = channelName.replace("private-", "");
  const [userId] = channelNameWithoutPrefix.split("@");

  if (context.auth?.uid === userId) {
    return pusher.authenticate(socketId, channelName);
  } else {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You need to be authenticated to get access to this private channel."
    );
  }
});

exports.channelExistence = functions.https.onRequest(async (req, res) => {
  for (const event of req.body.events) {
    const channelName = event.channel;

    if (channelName.startsWith("private-")) {
      const channelNameWithoutPrefix = channelName.replace("private-", "");
      const [userId, channelTopic] = channelNameWithoutPrefix.split("@");

      if (channelTopic === "presence") {
        await admin
          .firestore()
          .collection("players")
          .doc(userId)
          .set(
            { isOnline: event.name === "channel_occupied" },
            { merge: true }
          );
      }
    }
  }

  res.end();
});
