import * as React from "react";
import { getPusher } from "./Pusher";

export interface PresenceProps {
  playerId: string;
}

export function Presence(props: PresenceProps) {
  React.useEffect(() => {
    const pusher = getPusher();
    const channelName = `private-${props.playerId}@presence`;

    pusher.subscribe(channelName);

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [props.playerId]);

  return null;
}
