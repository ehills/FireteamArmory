import { useState } from 'react';
import { ArmyUnit, Veterancy } from '@/data/units';

interface ArmyUnitCardProps {
  unit: ArmyUnit;
  index: number;
  onRemove: (index: number) => void;
  onToggleUpgrade: (unitIndex: number, upgradeId: string) => void;
  onVeterancyChange: (unitIndex: number, veterancy: Veterancy) => void;
}

export default function ArmyUnitCard({ unit, index, onRemove, onToggleUpgrade, onVeterancyChange }: ArmyUnitCardProps) {
  const [upgradesVisible, setUpgradesVisible] = useState(false);

  const toggleUpgradesVisibility = () => {
    setUpgradesVisible(!upgradesVisible);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  const handleUpgradeChange = (upgradeId: string) => {
    onToggleUpgrade(index, upgradeId);
  };

  const handleVeterancyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onVeterancyChange(index, e.target.value as Veterancy);
  };

  return (
    <div className="mb-4 bg-dark-400 rounded-lg border border-dark-200 overflow-hidden">
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="font-semibold text-white text-lg">{unit.name}</h3>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-dark-500 text-xs text-accent">
              {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">{unit.totalPointCost} pts</span>
            <button 
              className="text-gray-400 hover:text-danger transition-colors"
              onClick={handleRemove}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-3">
          <select value={unit.veterancy} onChange={handleVeterancyChange} className="bg-dark-300 text-white text-xs rounded p-1.5">
            <option value="Conscript">Conscript</option>
            <option value="Trained">Trained</option>
            <option value="Experienced">Experienced</option>
            <option value="Veteran">Veteran</option>
          </select>
        </div>
        
        <div className="mt-2 grid grid-cols-5 gap-2 text-xs text-gray-300">
          <div className="bg-dark-300 rounded p-1.5 text-center">
            <div className="text-gray-400 mb-1">Movement</div>
            <div className="text-white font-semibold">{unit.finalStats.movement}</div>
          </div>
          <div className="bg-dark-300 rounded p-1.5 text-center">
            <div className="text-gray-400 mb-1">Armor</div>
            <div className="text-white font-semibold">{unit.finalStats.armor}</div>
          </div>
          <div className="bg-dark-300 rounded p-1.5 text-center">
            <div className="text-gray-400 mb-1">Attack</div>
            <div className="text-white font-semibold">{unit.finalStats.attack}</div>
          </div>
          <div className="bg-dark-300 rounded p-1.5 text-center">
            <div className="text-gray-400 mb-1">Range</div>
            <div className="text-white font-semibold">{unit.finalStats.range}</div>
          </div>
          <div className="bg-dark-300 rounded p-1.5 text-center">
            <div className="text-gray-400 mb-1">Special</div>
            <div className="text-white font-semibold">
              {unit.finalStats.special || "-"}
            </div>
          </div>
        </div>
        
        {unit.upgrades.length > 0 && (
          <div className="mt-3">
            <button 
              className="flex items-center text-xs text-primary hover:text-blue-400 transition-colors"
              onClick={toggleUpgradesVisibility}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 mr-1 transition-transform ${upgradesVisible ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              Upgrades & Equipment
            </button>
            
            {upgradesVisible && (
              <div className="mt-2 pl-4 border-l-2 border-dark-200 space-y-2">
                {unit.upgrades.map((upgrade) => (
                  <div key={upgrade.id} className="flex items-center justify-between text-xs">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox rounded bg-dark-300 border-dark-100 text-primary focus:ring-primary"
                        checked={unit.selectedUpgrades.includes(upgrade.id)}
                        onChange={() => handleUpgradeChange(upgrade.id)}
                      />
                      <span className="ml-2">{upgrade.name} (+{upgrade.pointCost} pts)</span>
                    </label>
                    <span className="text-gray-400 text-xs">
                      {Object.entries(upgrade.statModifiers).map(([stat, value], i, arr) => {
                        const formattedStat = stat.charAt(0).toUpperCase() + stat.slice(1);
                        const prefix = typeof value === 'string' && !value.startsWith('-') ? '+' : '';
                        return `${formattedStat}: ${prefix}${value}${i < arr.length - 1 ? ', ' : ''}`;
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
