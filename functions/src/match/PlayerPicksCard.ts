import { getNextPlayerPosition, PlayerPosition } from "./PlayerPosition";
import { MatchPhase } from "./MatchPhase";

export class PlayerPicksCard implements MatchPhase {
  readonly durationInMs = 5000;

  constructor(readonly whoPicks: PlayerPosition) {}

  toNextPhase(): MatchPhase {
    return new PlayerPicksCard(getNextPlayerPosition(this.whoPicks));
  }

  toDocument(): any {
    return {
      type: "playerPicksCard",
      whoPicks: this.whoPicks,
    };
  }
}
