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
}

export type UnitType = 'infantry' | 'vehicle';
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
  units: ArmyUnit[];
  pointCap: number;
  totalPoints: number;
}

export const units: Unit[] = [
  {
    id: "infantry-rifleman",
    name: "Infantry Rifleman",
    type: "infantry",
    pointCost: 10,
    stats: {
      movement: "4\"",
      armor: "6+",
      attack: 1,
      range: "24\"",
      special: ""
    },
    upgrades: [
      {
        id: "field-gear",
        name: "Field Gear",
        pointCost: 3,
        statModifiers: {
          armor: "5+"
        }
      },
      {
        id: "grenade-launcher",
        name: "Grenade Launcher",
        pointCost: 8,
        statModifiers: {
          attack: 1,
          range: "18\"",
          special: "Blast"
        }
      }
    ],
    veterancy: "Trained"
  },
  {
    id: "infantry-squad",
    name: "Infantry Squad (10)",
    type: "infantry",
    pointCost: 80,
    stats: {
      movement: "4\"",
      armor: "6+",
      attack: 1,
      range: "24\"",
      special: "Squad"
    },
    upgrades: [
      {
        id: "machine-gun",
        name: "Machine Gun",
        pointCost: 15,
        statModifiers: {
          attack: 2,
          range: "36\""
        }
      },
      {
        id: "sergeant",
        name: "Sergeant",
        pointCost: 10,
        statModifiers: {
          attack: 1,
          special: "Squad, Leader"
        }
      }
    ],
    veterancy: "Trained"
  },
  {
    id: "sherman-tank",
    name: "M4 Sherman Tank",
    type: "vehicle",
    pointCost: 120,
    stats: {
      movement: "8\"",
      armor: "8",
      attack: 3,
      range: "36\"",
      special: "Armored"
    },
    upgrades: [
      {
        id: "improved-armor",
        name: "Improved Armor",
        pointCost: 15,
        statModifiers: {
          armor: "9"
        }
      },
      {
        id: "76mm-gun",
        name: "76mm Gun Upgrade",
        pointCost: 25,
        statModifiers: {
          attack: 1,
          range: "42\"",
          special: "Armored, Anti-Tank"
        }
      }
    ],
    veterancy: "Trained"
  },
  {
    id: "veteran-officer",
    name: "Veteran Officer",
    type: "infantry",
    pointCost: 85,
    stats: {
      movement: "5\"",
      armor: "5+",
      attack: 2,
      range: "12\"",
      special: "Leader, Inspire"
    },
    upgrades: [
      {
        id: "field-promotion",
        name: "Field Promotion",
        pointCost: 20,
        statModifiers: {
          armor: "4+",
          special: "Leader, Inspire, Command"
        }
      },
      {
        id: "sidearm",
        name: "Officer Sidearm",
        pointCost: 10,
        statModifiers: {
          attack: 1,
          range: "8\"",
          special: "Leader, Pistol"
        }
      }
    ],
    veterancy: "Veteran"
  },
  {
    id: "motorcycle-scout",
    name: "Motorcycle Scout",
    type: "vehicle",
    pointCost: 35,
    stats: {
      movement: "12\"",
      armor: "6+",
      attack: 1,
      range: "16\"",
      special: "Fast, Scout"
    },
    upgrades: [
      {
        id: "sidecar",
        name: "Sidecar MG",
        pointCost: 15,
        statModifiers: {
          attack: 2,
          movement: "10\"",
          special: "Fast, Scout"
        }
      },
      {
        id: "recon-gear",
        name: "Recon Gear",
        pointCost: 8,
        statModifiers: {
          special: "Fast, Scout, Spotter"
        }
      }
    ],
    veterancy: "Experienced"
  },
  {
    id: "flamethrower-team",
    name: "Flamethrower Team",
    type: "infantry",
    pointCost: 45,
    stats: {
      movement: "4\"",
      armor: "6+",
      attack: 3,
      range: "8\"",
      special: "Burn"
    },
    upgrades: [
      {
        id: "improved-fuel",
        name: "Improved Fuel",
        pointCost: 15,
        statModifiers: {
          attack: 1,
          range: "10\"",
          special: "Burn, Persistent"
        }
      },
      {
        id: "fire-team",
        name: "Fire Team",
        pointCost: 12,
        statModifiers: {
          armor: "5+",
          special: "Burn, Team"
        }
      }
    ],
    veterancy: "Trained"
  },
  {
    id: "artillery-howitzer",
    name: "105mm Howitzer",
    type: "vehicle",
    pointCost: 75,
    stats: {
      movement: "0\"",
      armor: "5",
      attack: 2,
      range: "60\"",
      special: "Blast, Indirect"
    },
    upgrades: [
      {
        id: "veteran-crew",
        name: "Veteran Crew",
        pointCost: 15,
        statModifiers: {
          attack: 1,
          special: "Blast, Indirect, Accurate"
        }
      },
      {
        id: "heavy-shells",
        name: "Heavy Shells",
        pointCost: 18,
        statModifiers: {
          attack: 1,
          range: "48\"",
          special: "Blast, Indirect, Devastating"
        }
      }
    ],
    veterancy: "Trained"
  },
  {
    id: "paratroopers",
    name: "Paratroopers",
    type: "infantry",
    pointCost: 65,
    stats: {
      movement: "5\"",
      armor: "5+",
      attack: 2,
      range: "24\"",
      special: "Deep Strike"
    },
    upgrades: [
      {
        id: "combat-drop",
        name: "Combat Drop Training",
        pointCost: 10,
        statModifiers: {
          movement: "6\"",
          special: "Deep Strike, Rapid Deployment"
        }
      },
      {
        id: "smg-equipped",
        name: "SMG Equipped",
        pointCost: 15,
        statModifiers: {
          attack: 1,
          range: "16\"",
          special: "Deep Strike, Rapid Fire"
        }
      }
    ],
    veterancy: "Experienced"
  }
];

