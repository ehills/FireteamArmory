import {
  VeterancyLevel,
  BaseUnit,
  UpgradeOption,
  SquadSlot,
  SpecialForcesModel,
  RosterState,
  DefenceSlot,
  SF_BUDGETS,
  DEFENCE_COSTS,
} from "../../../shared/types";
import { usaDefences } from "../data/usa-units";

export function getUnitCost(unit: BaseUnit, veterancy: VeterancyLevel): number {
  if (typeof unit.pointsCost === "number") {
    return unit.pointsCost;
  }
  return unit.pointsCost[veterancy] || 0;
}

export function getUpgradeCost(upgrade: UpgradeOption, veterancy: VeterancyLevel): number {
  // If we had variable cost upgrades, we'd handle it here. 
  // Currently upgrades just use a flat number pointCost.
  return upgrade.pointCost;
}

export function getSlotTotalCost(slot: SquadSlot, globalVeterancy: VeterancyLevel): number {
  const veterancy = slot.customVeterancy || globalVeterancy;
  let total = 0;
  if (slot.baseUnit) {
    total += getUnitCost(slot.baseUnit, veterancy);
  }
  if (slot.attachments.upgrade) {
    total += getUpgradeCost(slot.attachments.upgrade, veterancy);
  }
  if (slot.attachments.assetTeam) {
    total += getUnitCost(slot.attachments.assetTeam, veterancy);
  }
  if (slot.attachments.vehicle) {
    total += getUnitCost(slot.attachments.vehicle, veterancy);
  }
  return total;
}

export function getSpecialForcesBudget(_veterancy: VeterancyLevel): number {
  return SF_BUDGETS[VeterancyLevel.VETERAN] || 0;
}

export function getSpecialForcesSpent(models: SpecialForcesModel[], _veterancy: VeterancyLevel): number {
  return models.reduce((sum, model) => {
    return sum + (model.pointsCost[VeterancyLevel.VETERAN] || 0);
  }, 0);
}

export function getDefencesTotalCost(defences: DefenceSlot[]): number {
  return defences.reduce((sum, def) => {
    const baseCost = DEFENCE_COSTS[def.defenceId] || 0;
    return sum + (baseCost * def.quantity);
  }, 0);
}

export function getRosterTotalCost(roster: RosterState, veterancy: VeterancyLevel): number {
  let total = 0;

  if (roster.commander) {
    total += roster.commander.pointsCost;
  }

  roster.squadSlots.forEach(slot => {
    total += getSlotTotalCost(slot, veterancy);
  });

  roster.specialForces.forEach(sfSlot => {
    total += getSpecialForcesSpent(sfSlot.models, veterancy);
  });

  total += getDefencesTotalCost(roster.defences);

  return total;
}
