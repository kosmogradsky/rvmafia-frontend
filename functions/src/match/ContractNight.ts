export interface ContractNight {
  type: "contractNight";
}

export class ContractNightFactory {
  static initialState: ContractNight = {
    type: "contractNight",
  };
}
