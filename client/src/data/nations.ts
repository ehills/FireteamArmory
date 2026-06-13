import { NationCode, DivisionType } from "../../../shared/types";

export interface Nation {
  code: NationCode;
  name: string;
  flag: string;
  availableDivisions: DivisionType[];
}

export const nations: Record<NationCode, Nation> = {
  [NationCode.USA]: {
    code: NationCode.USA,
    name: "United States",
    flag: "🇺🇸",
    availableDivisions: [
      DivisionType.INFANTRY,
      DivisionType.ARMOUR,
      DivisionType.PARATROOPERS,
    ],
  },
  [NationCode.GERMANY]: {
    code: NationCode.GERMANY,
    name: "Germany",
    flag: "🇩🇪",
    availableDivisions: [
      DivisionType.INFANTRY,
      DivisionType.MECHANISED,
      DivisionType.ARMOUR,
    ],
  },
  [NationCode.GB]: {
    code: NationCode.GB,
    name: "Great Britain",
    flag: "🇬🇧",
    availableDivisions: [
      DivisionType.INFANTRY,
      DivisionType.ARMOUR,
      DivisionType.PARATROOPERS,
    ],
  },
  [NationCode.RUS]: {
    code: NationCode.RUS,
    name: "Soviet Union",
    flag: "🇷🇺",
    availableDivisions: [
      DivisionType.INFANTRY,
      DivisionType.MECHANISED,
      DivisionType.ARMOUR,
    ],
  },
  [NationCode.JAPAN]: {
    code: NationCode.JAPAN,
    name: "Japan",
    flag: "🇯🇵",
    availableDivisions: [
      DivisionType.INFANTRY,
      DivisionType.MECHANISED,
    ],
  },
};
