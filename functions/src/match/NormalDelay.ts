import { MatchPhase } from "./MatchPhase";

export class NormalDelay implements MatchPhase {
  readonly durationInMs = 3000;

  constructor(readonly nextPhase: MatchPhase) {}

  toNextPhase(): MatchPhase {
    return this.nextPhase;
  }

  toDocument(): any {
    return {
      type: "normalDelay",
      nextPhase: this.nextPhase.toDocument(),
    };
  }
}
