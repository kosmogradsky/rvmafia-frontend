import * as functions from "firebase-functions";
import { europeanFunctions } from "./europeanFunctions";
import { pusher } from "./pusher";

export const pusherAuthorize = europeanFunctions.https.onCall(
  async (data, context) => {
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
  }
);
