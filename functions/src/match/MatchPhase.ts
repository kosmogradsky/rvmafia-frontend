export interface MatchPhase {
  readonly durationInMs: number;
  toNextPhase(): MatchPhase;
  toDocument(): any;
}
