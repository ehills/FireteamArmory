export interface UnitStat {
  movement: string;
  armor: string;
  attack: number;
  range: string;
  special?: string;
}

export interface StatModifier {
  movement?: string;
  armor?: string;
  attack?: number;
  range?: string;
  special?: string;
}

export interface Upgrade {
  id: string;
  name: string;
  pointCost: number;
  statModifiers: StatModifier;
}

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  pointCost: number;
  stats: UnitStat;
  upgrades: Upgrade[];
  veterancy: Veterancy;
  faction?: string;
  division?: string;
}

export type UnitType = 'infantry' | 'vehicle' | 'tank' | 'asset';
export type Veterancy = 'Conscript' | 'Trained' | 'Experienced' | 'Veteran';

export interface ArmyUnit extends Unit {
  selectedUpgrades: string[];
  totalPointCost: number;
  finalStats: UnitStat;
  veterancy: Veterancy;
}

export interface Army {
  id: string;
  name: string;
  faction?: string;
  units: ArmyUnit[];
  pointCap: number;
  totalPoints: number;
}

export const units: Unit[] = [
  {
    id: "usa-rifle-squad",
    name: "Rifle Squad",
    type: "infantry",
    pointCost: 250,
    stats: {
      movement: "5\"",
      armor: "5+",
      attack: 1,
      range: "24\"",
      special: ""
    },
    upgrades: [],
    veterancy: "Trained",
    faction: "USA",
    division: "Infantry"
  },
  {
    id: "usa-assault-squad",
    name: "Assault Squad",
    type: "infantry",
    pointCost: 205,
    stats: {
      movement: "6\"",
      armor: "5+",
      attack: 2,
      range: "12\"",
      special: "CQB"
    },
    upgrades: [],
    veterancy: "Trained",
    faction: "USA",
    division: "Infantry"
  },
  {
    id: "usa-m4-sherman",
    name: "M4A2 Sherman",
    type: "tank",
    pointCost: 375,
    stats: {
      movement: "8\"",
      armor: "8",
      attack: 3,
      range: "36\"",
      special: "Armored"
    },
    upgrades: [],
    veterancy: "Trained",
    faction: "USA",
    division: "Armour"
  },
  {
    id: "usa-m24-chaffee",
    name: "M24 Chaffee",
    type: "tank",
    pointCost: 220,
    stats: {
      movement: "10\"",
      armor: "6",
      attack: 2,
      range: "30\"",
      special: "Light Tank"
    },
    upgrades: [],
    veterancy: "Trained",
    faction: "USA",
    division: "Armour"
  },
  {
    id: "germany-panzer-iv",
    name: "Panzer IV F2",
    type: "tank",
    pointCost: 470,
    stats: {
      movement: "8\"",
      armor: "8",
      attack: 4,
      range: "42\"",
      special: "Main Battle Tank"
    },
    upgrades: [],
    veterancy: "Trained",
    faction: "Germany",
    division: "Armour"
  },
  {
    id: "germany-tiger",
    name: "Tiger I",
    type: "tank",
    pointCost: 870,
    stats: {
      movement: "6\"",
      armor: "10",
      attack: 5,
      range: "48\"",
      special: "Heavy Tank"
    },
    upgrades: [],
    veterancy: "Trained",
    faction: "Germany",
    division: "Armour"
  },
  {
    id: "russia-t34-85",
    name: "T34-85",
    type: "tank",
    pointCost: 305,
    stats: {
      movement: "9\"",
      armor: "8",
      attack: 3,
      range: "36\"",
      special: "Medium Tank"
    },
    upgrades: [],
    veterancy: "Trained",
    faction: "Russia",
    division: "Armour"
  },
  {
    id: "russia-is2",
    name: "IS-2",
    type: "tank",
    pointCost: 970,
    stats: {
      movement: "6\"",
      armor: "11",
      attack: 6,
      range: "48\"",
      special: "Heavy Tank"
    },
    upgrades: [],
    veterancy: "Trained",
    faction: "Russia",
    division: "Armour"
  }
];
