import Pusher, { Channel, AuthorizerCallback } from "pusher-js";
import { getFunctions, httpsCallable } from "firebase/functions";
import { AuthData } from "pusher-js/types/src/core/auth/options";

let pusher: Pusher | undefined = undefined;

export const getPusher = (): Pusher => {
  const functions = getFunctions(undefined, "europe-central2");
  const authorizePusher = httpsCallable(functions, "authorizePusher");

  if (pusher === undefined) {
    pusher = new Pusher("e653a5e7be4cca671bb7", {
      cluster: "eu",
      authorizer(channel: Channel) {
        return {
          authorize(socketId: string, callback: AuthorizerCallback) {
            authorizePusher({
              channelName: channel.name,
              socketId,
            }).then((response) => {
              callback(null, response.data as AuthData);
            });
          },
        };
      },
    });
  }

  return pusher;
};
