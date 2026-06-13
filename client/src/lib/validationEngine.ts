import {
  ArmySetup,
  SquadSlot,
  SpecialForcesSlot,
  RosterState,
  DivisionConstraints,
  ValidationResult,
  VeterancyLevel,
  DivisionType,
  NationCode,
} from "../../../shared/types";
import { divisionRules } from "../data/divisions";
import { getSpecialForcesSpent, getSpecialForcesBudget } from "./pointsEngine";

export function getDivisionConstraints(nation: NationCode | null, division: DivisionType | null): DivisionConstraints | null {
  if (!division) return null;
  return divisionRules[division] || null;
}

export function validateArmySetup(setup: ArmySetup): ValidationResult[] {
  const errors: ValidationResult[] = [];
  if (!setup.nation) {
    errors.push({ type: 'compulsory', message: 'Nation must be selected', field: 'nation' });
  }
  if (!setup.division) {
    errors.push({ type: 'compulsory', message: 'Division must be selected', field: 'division' });
  }
  if (!setup.globalVeterancy) {
    errors.push({ type: 'compulsory', message: 'Army Veterancy must be selected', field: 'globalVeterancy' });
  }
  return errors;
}

export function validateSlot(slot: SquadSlot, divisionRules: DivisionConstraints | null): ValidationResult[] {
  const errors: ValidationResult[] = [];
  if (!slot.baseUnit) {
    errors.push({ type: 'compulsory', message: `Squad Slot ${slot.slotIndex + 1} is empty`, field: `slot_${slot.slotIndex}` });
    return errors;
  }

  // Check if attachments exceed max limits of base unit
  let assetCount = slot.attachments.assetTeam ? 1 : 0;
  if (assetCount > slot.baseUnit.maxAssetTeams) {
    errors.push({ type: 'error', message: `Squad Slot ${slot.slotIndex + 1} exceeds max asset teams`, field: `slot_${slot.slotIndex}_assets` });
  }

  let vehicleCount = slot.attachments.vehicle ? 1 : 0;
  if (vehicleCount > slot.baseUnit.maxTransportVehicles) {
    errors.push({ type: 'error', message: `Squad Slot ${slot.slotIndex + 1} exceeds max vehicles`, field: `slot_${slot.slotIndex}_vehicles` });
  }

  let upgradeCount = slot.attachments.upgrade ? 1 : 0; // Currently UI supports 1 per slot
  if (upgradeCount > slot.baseUnit.maxUpgrades) {
    errors.push({ type: 'error', message: `Squad Slot ${slot.slotIndex + 1} exceeds max upgrades`, field: `slot_${slot.slotIndex}_upgrades` });
  }

  return errors;
}

export function validateSpecialForces(sfSlot: SpecialForcesSlot, veterancy: VeterancyLevel | null): ValidationResult[] {
  const errors: ValidationResult[] = [];
  
  if (sfSlot.models.length === 0) {
    errors.push({ type: 'compulsory', message: `Special Forces Slot ${sfSlot.slotIndex + 1} is empty`, field: `sf_${sfSlot.slotIndex}` });
    return errors;
  }

  const hasLeader = sfSlot.models.some(m => m.isLeader);
  if (!hasLeader) {
    errors.push({ type: 'compulsory', message: `Special Forces Slot ${sfSlot.slotIndex + 1} requires a Squad Leader`, field: `sf_${sfSlot.slotIndex}_leader` });
  }

  if (veterancy) {
    const budget = getSpecialForcesBudget(veterancy);
    const spent = getSpecialForcesSpent(sfSlot.models, veterancy);
    if (spent > budget) {
      errors.push({ type: 'error', message: `Special Forces Slot ${sfSlot.slotIndex + 1} exceeds budget (${spent}/${budget})`, field: `sf_${sfSlot.slotIndex}_budget` });
    }
  }

  return errors;
}

export function validateRoster(roster: RosterState, setup: ArmySetup, constraints: DivisionConstraints | null, totalPoints: number): ValidationResult[] {
  let errors: ValidationResult[] = [];

  if (setup.pointLimit && totalPoints > setup.pointLimit) {
    errors.push({ type: 'error', message: `Army exceeds points limit (${totalPoints}/${setup.pointLimit})`, field: 'totalPoints' });
  }

  if (!roster.commander) {
    errors.push({ type: 'compulsory', message: 'Battle Group Commander must be assigned', field: 'commander' });
  }

  if (constraints) {
    if (roster.squadSlots.length > constraints.maxSquadSlots) {
      errors.push({ type: 'error', message: `Army exceeds max squad slots for division (${roster.squadSlots.length}/${constraints.maxSquadSlots})`, field: 'squadSlots' });
    }
    if (roster.specialForces.length > constraints.maxSpecialForcesSlots) {
      errors.push({ type: 'error', message: `Army exceeds max special forces slots for division (${roster.specialForces.length}/${constraints.maxSpecialForcesSlots})`, field: 'specialForces' });
    }
  }

  roster.squadSlots.forEach(slot => {
    errors.push(...validateSlot(slot, constraints));
  });

  roster.specialForces.forEach(sfSlot => {
    errors.push(...validateSpecialForces(sfSlot, setup.globalVeterancy));
  });

  return errors;
}
