import { DivisionType, DivisionConstraints, UnitCategory } from "../../../shared/types";

export const divisionRules: Record<DivisionType, DivisionConstraints> = {
  [DivisionType.INFANTRY]: {
    maxSquadSlots: 5,
    maxSpecialForcesSlots: 2,
    allowedCategories: [
      UnitCategory.INFANTRY_SQUAD,
      UnitCategory.ASSET_SQUAD,
      UnitCategory.FIELD_GUN,
      UnitCategory.VEHICLE, // Light vehicles only enforced by unit definitions
      UnitCategory.DEFENCE,
      UnitCategory.SPECIAL_FORCES,
    ],
  },
  [DivisionType.MECHANISED]: {
    maxSquadSlots: 4,
    maxSpecialForcesSlots: 1,
    allowedCategories: [
      UnitCategory.INFANTRY_SQUAD,
      UnitCategory.ASSET_SQUAD,
      UnitCategory.VEHICLE,
      UnitCategory.FIELD_GUN,
      UnitCategory.DEFENCE,
      UnitCategory.SPECIAL_FORCES,
    ],
  },
  [DivisionType.ARMOUR]: {
    maxSquadSlots: 3,
    maxSpecialForcesSlots: 0,
    allowedCategories: [
      UnitCategory.VEHICLE, // primarily
      UnitCategory.INFANTRY_SQUAD, // Limited
      UnitCategory.ASSET_SQUAD,
      UnitCategory.DEFENCE,
    ],
  },
  [DivisionType.PARATROOPERS]: {
    maxSquadSlots: 5,
    maxSpecialForcesSlots: 3,
    allowedCategories: [
      UnitCategory.INFANTRY_SQUAD,
      UnitCategory.ASSET_SQUAD,
      UnitCategory.FIELD_GUN,
      UnitCategory.DEFENCE,
      UnitCategory.SPECIAL_FORCES,
    ],
  },
};
