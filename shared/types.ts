export enum VeterancyLevel {
  CONSCRIPT = "CONSCRIPT",
  TRAINED = "TRAINED",
  EXPERIENCED = "EXPERIENCED",
  VETERAN = "VETERAN",
}

export enum DivisionType {
  INFANTRY = "INFANTRY",
  MECHANISED = "MECHANISED",
  ARMOUR = "ARMOUR",
  PARATROOPERS = "PARATROOPERS",
}

export enum NationCode {
  USA = "USA",
  GERMANY = "GERMANY",
  GB = "GB",
  RUS = "RUS",
  JAPAN = "JAPAN",
}

export enum EngagementStance {
  ATTACK = "ATTACK",
  NEUTRAL = "NEUTRAL",
  DEFEND = "DEFEND",
}

export enum UnitCategory {
  INFANTRY_SQUAD = "INFANTRY_SQUAD",
  ASSET_SQUAD = "ASSET_SQUAD",
  VEHICLE = "VEHICLE",
  FIELD_GUN = "FIELD_GUN",
  DEFENCE = "DEFENCE",
  SPECIAL_FORCES = "SPECIAL_FORCES",
}

export type PointsByVeterancy = Record<VeterancyLevel, number>;

export interface StatModifier {
  movement?: string;
  armor?: string;
  attack?: number;
  range?: string;
  special?: string;
}

export interface UnitStat {
  movement: string;
  armor: string;
  attack: number;
  range: string;
  special?: string;
}

export interface UpgradeOption {
  id: string;
  name: string;
  pointCost: number; // For upgrades, point costs are typically static or we might need PointsByVeterancy. The spec says "BaseUnitCost + UpgradeCost... fetching cost using roster's selected veterancy". Let's make it PointsByVeterancy | number.
  costIsStatic?: boolean; // explicit flag if needed
  statModifiers?: StatModifier;
}

export interface BaseUnit {
  id: string;
  name: string;
  unitCategory: UnitCategory;
  pointsCost: PointsByVeterancy | number; // Number if static
  stats?: UnitStat;
  upgrades: UpgradeOption[];
}

export interface SquadUnit extends BaseUnit {
  unitCategory: UnitCategory.INFANTRY_SQUAD;
  makeUp: string[];
  munitionsPool?: number;
  maxAssetTeams: number;
  maxTransportVehicles: number;
  maxUpgrades: number;
}

export interface AssetTeam extends BaseUnit {
  unitCategory: UnitCategory.ASSET_SQUAD;
  makeUp: string[];
}

export interface VehicleUnit extends BaseUnit {
  unitCategory: UnitCategory.VEHICLE | UnitCategory.FIELD_GUN;
  armourFront: number;
  armourSide: number;
  armourRear: number;
  openTopped: boolean;
  fixedTurret: boolean;
  transportCapacity: number;
}

export interface DefenceUnit extends BaseUnit {
  unitCategory: UnitCategory.DEFENCE;
  pointsCost: number; // Always static
}

export interface SpecialForcesModel {
  id: string;
  name: string;
  pointsCost: PointsByVeterancy;
  stats?: UnitStat;
  isLeader?: boolean;
}

export interface ArmySetup {
  nation: NationCode | null;
  division: DivisionType | null;
  globalVeterancy: VeterancyLevel | null;
  engagementStance: EngagementStance | null;
  pointLimit: number | null;
}

export interface SquadSlot {
  slotIndex: number;
  baseUnit: SquadUnit | null;
  customVeterancy?: VeterancyLevel;
  attachments: {
    upgrade: UpgradeOption | null;
    assetTeam: AssetTeam | null;
    vehicle: VehicleUnit | null;
  };
}

export interface BGC {
  name: string;
  pointsCost: number;
}

export interface DefenceSlot {
  defenceId: string;
  quantity: number;
}

export interface SpecialForcesSlot {
  slotIndex: number;
  models: SpecialForcesModel[];
}

export interface RosterState {
  commander: BGC | null;
  squadSlots: SquadSlot[];
  defences: DefenceSlot[];
  specialForces: SpecialForcesSlot[];
}

export interface ArmyState {
  setup: ArmySetup;
  roster: RosterState;
  totalPoints: number;
}

// Static cost constants
export const DEFENCE_COSTS: Record<string, number> = {
  sandbags: 5,
  barbed_wire: 10,
  tank_traps: 15,
  mines: 50,
};

export const TRANSPORT_COSTS: Record<string, number> = {
  jeep: 16,
  truck: 34,
};

export const SF_BUDGETS: PointsByVeterancy = {
  [VeterancyLevel.CONSCRIPT]: 200,
  [VeterancyLevel.TRAINED]: 250,
  [VeterancyLevel.EXPERIENCED]: 300,
  [VeterancyLevel.VETERAN]: 350,
};

export interface DivisionConstraints {
  maxSquadSlots: number;
  maxSpecialForcesSlots: number;
  allowedCategories: UnitCategory[];
}

export interface ValidationResult {
  type: 'compulsory' | 'error' | 'warning';
  message: string;
  field: string;
}
