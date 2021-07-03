export type PlayerPosition =
  | "first"
  | "second"
  | "third"
  | "fourth"
  | "fifth"
  | "sixth"
  | "seventh"
  | "eighth"
  | "ninth"
  | "tenth";

export const getPrevPlayerPosition = (
  playerPosition: PlayerPosition
): PlayerPosition => {
  switch (playerPosition) {
    case "first":
      return "tenth";
    case "second":
      return "first";
    case "third":
      return "second";
    case "fourth":
      return "third";
    case "fifth":
      return "fourth";
    case "sixth":
      return "fifth";
    case "seventh":
      return "sixth";
    case "eighth":
      return "seventh";
    case "ninth":
      return "eighth";
    case "tenth":
      return "ninth";
  }
};

export const getNextPlayerPosition = (
  playerPosition: PlayerPosition
): PlayerPosition => {
  switch (playerPosition) {
    case "first":
      return "second";
    case "second":
      return "third";
    case "third":
      return "fourth";
    case "fourth":
      return "fifth";
    case "fifth":
      return "sixth";
    case "sixth":
      return "seventh";
    case "seventh":
      return "eighth";
    case "eighth":
      return "ninth";
    case "ninth":
      return "tenth";
    case "tenth":
      return "first";
  }
};
