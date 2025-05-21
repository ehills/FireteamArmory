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
}

export type UnitType = 'infantry' | 'cavalry' | 'vehicle' | 'monster' | 'hero';

export interface ArmyUnit extends Unit {
  selectedUpgrades: string[];
  totalPointCost: number;
  finalStats: UnitStat;
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
    id: "imperial-guardsman",
    name: "Imperial Guardsman",
    type: "infantry",
    pointCost: 12,
    stats: {
      movement: "4\"",
      armor: "5+",
      attack: 1,
      range: "24\"",
      special: ""
    },
    upgrades: [
      {
        id: "better-armor",
        name: "Better Armor",
        pointCost: 3,
        statModifiers: {
          armor: "4+"
        }
      },
      {
        id: "heavy-weapon",
        name: "Heavy Weapon",
        pointCost: 8,
        statModifiers: {
          attack: 1,
          range: "36\""
        }
      }
    ]
  },
  {
    id: "space-marine",
    name: "Space Marine",
    type: "infantry",
    pointCost: 20,
    stats: {
      movement: "6\"",
      armor: "3+",
      attack: 2,
      range: "24\"",
      special: ""
    },
    upgrades: [
      {
        id: "heavy-armor",
        name: "Heavy Armor",
        pointCost: 5,
        statModifiers: {
          armor: "2+"
        }
      },
      {
        id: "heavy-weapon",
        name: "Heavy Weapon",
        pointCost: 10,
        statModifiers: {
          attack: 1,
          range: "36\""
        }
      }
    ]
  },
  {
    id: "armored-transport",
    name: "Armored Transport",
    type: "vehicle",
    pointCost: 85,
    stats: {
      movement: "12\"",
      armor: "11",
      attack: 4,
      range: "36\"",
      special: "Transport"
    },
    upgrades: [
      {
        id: "reinforced-armor",
        name: "Reinforced Armor",
        pointCost: 15,
        statModifiers: {
          armor: "12"
        }
      },
      {
        id: "missile-launcher",
        name: "Missile Launcher",
        pointCost: 25,
        statModifiers: {
          attack: 2,
          range: "48\""
        }
      }
    ]
  },
  {
    id: "knight-commander",
    name: "Knight Commander",
    type: "hero",
    pointCost: 120,
    stats: {
      movement: "6\"",
      armor: "2+",
      attack: 5,
      range: "12\"",
      special: "Leader"
    },
    upgrades: [
      {
        id: "master-crafted-armor",
        name: "Master-Crafted Armor",
        pointCost: 20,
        statModifiers: {
          armor: "1+"
        }
      },
      {
        id: "relic-blade",
        name: "Relic Blade",
        pointCost: 30,
        statModifiers: {
          attack: 2,
          special: "Leader, Relic"
        }
      }
    ]
  },
  {
    id: "heavy-cavalry",
    name: "Heavy Cavalry",
    type: "cavalry",
    pointCost: 45,
    stats: {
      movement: "10\"",
      armor: "4+",
      attack: 3,
      range: "0\"",
      special: "Charge"
    },
    upgrades: [
      {
        id: "barding",
        name: "Barding",
        pointCost: 10,
        statModifiers: {
          armor: "3+",
          movement: "8\""
        }
      },
      {
        id: "lance",
        name: "Lance",
        pointCost: 12,
        statModifiers: {
          attack: 2,
          special: "Charge, Impact"
        }
      }
    ]
  },
  {
    id: "war-beast",
    name: "War Beast",
    type: "monster",
    pointCost: 90,
    stats: {
      movement: "8\"",
      armor: "3+",
      attack: 6,
      range: "0\"",
      special: "Fear"
    },
    upgrades: [
      {
        id: "armored-plates",
        name: "Armored Plates",
        pointCost: 15,
        statModifiers: {
          armor: "2+"
        }
      },
      {
        id: "frenzy",
        name: "Frenzy",
        pointCost: 25,
        statModifiers: {
          attack: 3,
          special: "Fear, Frenzy"
        }
      }
    ]
  },
  {
    id: "artillery",
    name: "Artillery",
    type: "vehicle",
    pointCost: 65,
    stats: {
      movement: "4\"",
      armor: "7",
      attack: 2,
      range: "60\"",
      special: "Blast"
    },
    upgrades: [
      {
        id: "crew",
        name: "Additional Crew",
        pointCost: 10,
        statModifiers: {
          attack: 1
        }
      },
      {
        id: "siege-shells",
        name: "Siege Shells",
        pointCost: 18,
        statModifiers: {
          range: "48\"",
          special: "Blast, Siege"
        }
      }
    ]
  },
  {
    id: "imperial-guardsman-squad",
    name: "Imperial Guardsman Squad (10)",
    type: "infantry",
    pointCost: 120,
    stats: {
      movement: "4\"",
      armor: "5+",
      attack: 1,
      range: "24\"",
      special: "Squad"
    },
    upgrades: [
      {
        id: "squad-heavy-weapon",
        name: "Squad Heavy Weapon",
        pointCost: 15,
        statModifiers: {
          attack: 1,
          range: "36\""
        }
      },
      {
        id: "veteran-sergeant",
        name: "Veteran Sergeant",
        pointCost: 15,
        statModifiers: {
          attack: 1,
          special: "Squad, Leader"
        }
      }
    ]
  }
];
