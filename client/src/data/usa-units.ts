import { 
  UnitCategory, 
  VeterancyLevel, 
  SquadUnit, 
  AssetTeam, 
  VehicleUnit, 
  SpecialForcesModel,
  DefenceUnit
} from "../../../shared/types";

export const usaInfantrySquads: SquadUnit[] = [
  {
    id: "usa_rifle_squad",
    name: "Rifle Squad",
    unitCategory: UnitCategory.INFANTRY_SQUAD,
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 70,
      [VeterancyLevel.TRAINED]: 100,
      [VeterancyLevel.EXPERIENCED]: 130,
      [VeterancyLevel.VETERAN]: 160,
    },
    makeUp: ["SL", "SMG", "LMG", "LMG", "Rifleman", "Rifleman", "Rifleman", "Rifleman", "Rifleman"],
    maxAssetTeams: 1,
    maxTransportVehicles: 1,
    maxUpgrades: 2,
    upgrades: [
      { id: "usa_bar", name: "Browning Automatic Rifle (BAR)", pointCost: 15 },
      { id: "usa_grenades", name: "Frag Grenades", pointCost: 10 }
    ],
    stats: { movement: "6\"", armor: "6+", attack: 1, range: "24\"" }
  },
  {
    id: "usa_engineer_squad",
    name: "Engineer Squad",
    unitCategory: UnitCategory.INFANTRY_SQUAD,
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 85,
      [VeterancyLevel.TRAINED]: 115,
      [VeterancyLevel.EXPERIENCED]: 145,
      [VeterancyLevel.VETERAN]: 175,
    },
    makeUp: ["Sergeant (SMG)", "Engineer", "Engineer", "Engineer", "Engineer", "Engineer", "Engineer"],
    maxAssetTeams: 1,
    maxTransportVehicles: 1,
    maxUpgrades: 3,
    upgrades: [
      { id: "usa_flamethrower", name: "Flamethrower", pointCost: 20 },
      { id: "usa_demo_charges", name: "Demolition Charges", pointCost: 15 },
      { id: "usa_mine_clearance", name: "Mine Clearance Gear", pointCost: 10 }
    ],
    stats: { movement: "6\"", armor: "6+", attack: 1, range: "24\"", special: "Engineers" }
  }
];

export const usaAssetTeams: AssetTeam[] = [
  {
    id: "usa_mortar_team",
    name: "60mm Mortar Team",
    unitCategory: UnitCategory.ASSET_SQUAD,
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 40,
      [VeterancyLevel.TRAINED]: 65,
      [VeterancyLevel.EXPERIENCED]: 85,
      [VeterancyLevel.VETERAN]: 105,
    },
    makeUp: ["Gunner", "Loader", "Ammo Bearer"],
    upgrades: [],
    stats: { movement: "4\"", armor: "6+", attack: 2, range: "48\"", special: "Indirect Fire, Blast" }
  },
  {
    id: "usa_mg_team",
    name: ".30 Cal MG Team",
    unitCategory: UnitCategory.ASSET_SQUAD,
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 45,
      [VeterancyLevel.TRAINED]: 70,
      [VeterancyLevel.EXPERIENCED]: 95,
      [VeterancyLevel.VETERAN]: 120,
    },
    makeUp: ["Gunner", "Loader", "Ammo Bearer"],
    upgrades: [],
    stats: { movement: "4\"", armor: "6+", attack: 5, range: "36\"", special: "Suppressive Fire" }
  },
  {
    id: "usa_bazooka_team",
    name: "Bazooka Team",
    unitCategory: UnitCategory.ASSET_SQUAD,
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 35,
      [VeterancyLevel.TRAINED]: 60,
      [VeterancyLevel.EXPERIENCED]: 80,
      [VeterancyLevel.VETERAN]: 100,
    },
    makeUp: ["Gunner", "Loader"],
    upgrades: [],
    stats: { movement: "6\"", armor: "6+", attack: 1, range: "18\"", special: "Anti-Tank" }
  }
];

export const usaVehicles: VehicleUnit[] = [
  {
    id: "usa_sherman",
    name: "M4 Sherman",
    unitCategory: UnitCategory.VEHICLE,
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 160,
      [VeterancyLevel.TRAINED]: 200,
      [VeterancyLevel.EXPERIENCED]: 240,
      [VeterancyLevel.VETERAN]: 280,
    },
    armourFront: 9,
    armourSide: 8,
    armourRear: 8,
    openTopped: false,
    fixedTurret: false,
    transportCapacity: 0,
    upgrades: [
      { id: "usa_50cal", name: ".50 Cal Pintle MG", pointCost: 25 }
    ],
    stats: { movement: "10\"", armor: "9", attack: 3, range: "48\"", special: "Armoured" }
  },
  {
    id: "usa_halftrack",
    name: "M3 Half-track",
    unitCategory: UnitCategory.VEHICLE,
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 70,
      [VeterancyLevel.TRAINED]: 90,
      [VeterancyLevel.EXPERIENCED]: 110,
      [VeterancyLevel.VETERAN]: 130,
    },
    armourFront: 7,
    armourSide: 7,
    armourRear: 7,
    openTopped: true,
    fixedTurret: false,
    transportCapacity: 12,
    upgrades: [
      { id: "usa_50cal", name: ".50 Cal HMG", pointCost: 25 }
    ],
    stats: { movement: "12\"", armor: "7", attack: 1, range: "36\"", special: "Transport (12), Open-topped" }
  }
];

export const usaFieldGuns: VehicleUnit[] = [
  {
    id: "usa_57mm_at",
    name: "57mm Anti-Tank Gun",
    unitCategory: UnitCategory.FIELD_GUN,
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 60,
      [VeterancyLevel.TRAINED]: 85,
      [VeterancyLevel.EXPERIENCED]: 105,
      [VeterancyLevel.VETERAN]: 125,
    },
    armourFront: 0,
    armourSide: 0,
    armourRear: 0,
    openTopped: true,
    fixedTurret: true,
    transportCapacity: 0,
    upgrades: [],
    stats: { movement: "4\"", armor: "6+", attack: 2, range: "48\"", special: "Anti-Tank, Gun Shield" }
  }
];

// Special Forces Roster Models
export const usaSpecialForces: SpecialForcesModel[] = [
  {
    id: "usa_ranger_nco",
    name: "Ranger NCO (SMG)",
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 0, // Unused
      [VeterancyLevel.TRAINED]: 15,
      [VeterancyLevel.EXPERIENCED]: 20,
      [VeterancyLevel.VETERAN]: 25,
    },
    isLeader: true,
    stats: { movement: "6\"", armor: "5+", attack: 2, range: "12\"" }
  },
  {
    id: "usa_ranger_rifle",
    name: "Ranger (Rifle)",
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 0,
      [VeterancyLevel.TRAINED]: 12,
      [VeterancyLevel.EXPERIENCED]: 16,
      [VeterancyLevel.VETERAN]: 20,
    },
    isLeader: false,
    stats: { movement: "6\"", armor: "5+", attack: 1, range: "24\"" }
  },
  {
    id: "usa_ranger_bar",
    name: "Ranger (BAR)",
    pointsCost: {
      [VeterancyLevel.CONSCRIPT]: 0,
      [VeterancyLevel.TRAINED]: 18,
      [VeterancyLevel.EXPERIENCED]: 24,
      [VeterancyLevel.VETERAN]: 30,
    },
    isLeader: false,
    stats: { movement: "6\"", armor: "5+", attack: 2, range: "30\"" }
  }
];

export const usaDefences: DefenceUnit[] = [
  { id: "sandbags", name: "Sandbags", unitCategory: UnitCategory.DEFENCE, pointsCost: 5, upgrades: [] },
  { id: "barbed_wire", name: "Barbed Wire", unitCategory: UnitCategory.DEFENCE, pointsCost: 10, upgrades: [] },
  { id: "tank_traps", name: "Tank Traps", unitCategory: UnitCategory.DEFENCE, pointsCost: 15, upgrades: [] },
  { id: "mines", name: "Minefield", unitCategory: UnitCategory.DEFENCE, pointsCost: 50, upgrades: [] }
];

export const usaLightTransports: VehicleUnit[] = [
  {
    id: "usa_jeep",
    name: "Jeep",
    unitCategory: UnitCategory.VEHICLE,
    pointsCost: 16, // Static
    armourFront: 6, armourSide: 6, armourRear: 6,
    openTopped: true, fixedTurret: false, transportCapacity: 3,
    upgrades: [{ id: "usa_30cal_jeep", name: ".30 Cal MG", pointCost: 15 }],
    stats: { movement: "16\"", armor: "6", attack: 0, range: "0\"", special: "Transport (3), Fast" }
  },
  {
    id: "usa_truck",
    name: "2.5-ton Truck",
    unitCategory: UnitCategory.VEHICLE,
    pointsCost: 34, // Static
    armourFront: 6, armourSide: 6, armourRear: 6,
    openTopped: true, fixedTurret: false, transportCapacity: 15,
    upgrades: [{ id: "usa_50cal_truck", name: ".50 Cal Ring Mount", pointCost: 25 }],
    stats: { movement: "14\"", armor: "6", attack: 0, range: "0\"", special: "Transport (15)" }
  }
];

export const getAllUSAUnits = () => [
  ...usaInfantrySquads,
  ...usaAssetTeams,
  ...usaVehicles,
  ...usaFieldGuns,
  ...usaDefences,
  ...usaLightTransports
];
