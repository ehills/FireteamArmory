import { ArmyUnit, StatModifier, UnitStat, Veterancy } from "@/data/units";

const veterancyCostMultiplier: Record<Veterancy, number> = {
  'Conscript': 0.8,
  'Trained': 1,
  'Experienced': 1.2,
  'Veteran': 1.5,
};

// Calculate the total cost of a unit including all selected upgrades
export function calculateUnitTotalCost(unit: ArmyUnit): number {
  const baseCost = unit.pointCost;
  
  // Sum up costs of all selected upgrades
  const upgradeCost = unit.selectedUpgrades.reduce((total, upgradeId) => {
    const upgrade = unit.upgrades.find(u => u.id === upgradeId);
    return total + (upgrade ? upgrade.pointCost : 0);
  }, 0);

  const totalCost = (baseCost + upgradeCost) * veterancyCostMultiplier[unit.veterancy];
  
  return Math.round(totalCost);
}

// Apply a stat modifier to the base stat
function applyStatModifier(baseStat: string | number | undefined, modifier: string | number | undefined): string | number | undefined {
  if (modifier === undefined) return baseStat;
  
  // If the modifier is a replacement value (not a delta), return it directly
  if (typeof modifier === 'string' && !modifier.startsWith('+') && !modifier.startsWith('-')) {
    return modifier;
  }
  
  // For numeric values
  if (typeof baseStat === 'number' && typeof modifier === 'number') {
    return baseStat + modifier;
  }
  
  // For string modifiers that are deltas (e.g., "+1")
  if (typeof baseStat === 'string' && typeof modifier === 'string') {
    if (modifier.startsWith('+') || modifier.startsWith('-')) {
      const baseValue = parseFloat(baseStat);
      const modValue = parseFloat(modifier);
      if (!isNaN(baseValue) && !isNaN(modValue)) {
        return (baseValue + modValue).toString() + baseStat.replace(/[\d.-]+/, '');
      }
    }
  }
  
  return baseStat;
}

// Apply stat modifiers to all stats
function applyStatModifiers(baseStats: UnitStat, modifiers: StatModifier): UnitStat {
  return {
    movement: applyStatModifier(baseStats.movement, modifiers.movement) as string,
    armor: applyStatModifier(baseStats.armor, modifiers.armor) as string,
    attack: applyStatModifier(baseStats.attack, modifiers.attack) as number,
    range: applyStatModifier(baseStats.range, modifiers.range) as string,
    special: modifiers.special || baseStats.special
  };
}

// Calculate the final stats for a unit after applying all selected upgrades
export function calculateUnitFinalStats(unit: ArmyUnit): UnitStat {
  let finalStats = { ...unit.stats };
  
  // Apply all selected upgrade modifiers
  for (const upgradeId of unit.selectedUpgrades) {
    const upgrade = unit.upgrades.find(u => u.id === upgradeId);
    if (upgrade) {
      finalStats = applyStatModifiers(finalStats, upgrade.statModifiers);
    }
  }
  
  return finalStats;
}
