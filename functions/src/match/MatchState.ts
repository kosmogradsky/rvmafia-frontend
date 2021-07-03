import { ContractNight, ContractNightFactory } from "./ContractNight";
import {
  nextStateDescriptor,
  NextStateDescriptor,
} from "./NextStateDescriptor";
import { PlayerPicksCard, PlayerPicksCardFactory } from "./PlayerPicksCard";

export type MatchState = PlayerPicksCard | ContractNight;

export class MatchStateFactory {
  static initialState: MatchState = PlayerPicksCardFactory.initialState;

  static createNextState(state: MatchState): NextStateDescriptor<MatchState> {
    switch (state.type) {
      case "playerPicksCard": {
        if (state.whoPicks === "tenth") {
          return nextStateDescriptor.withDefaultDelay(
            ContractNightFactory.initialState
          );
        }

        return PlayerPicksCardFactory.createNextState(state);
      }
      case "contractNight": {
        return nextStateDescriptor.withoutDelay(
          ContractNightFactory.initialState
        );
      }
    }
  }
}
