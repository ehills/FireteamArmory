import { Unit } from '@/data/units';

interface UnitCardProps {
  unit: Unit;
  onAdd: (unit: Unit) => void;
}

export default function UnitCard({ unit, onAdd }: UnitCardProps) {
  const handleAddUnit = () => {
    onAdd(unit);
  };

  return (
    <div 
      className="bg-dark-400 rounded p-3 hover:shadow-card-hover transition duration-150 ease-in-out cursor-pointer border border-dark-200 hover:border-primary"
      onClick={handleAddUnit}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white">{unit.name}</h3>
        <span className="text-xs font-semibold px-2 py-1 bg-dark-300 rounded">{unit.pointCost} pts</span>
      </div>
      <div className="text-xs text-gray-400 mt-1 flex items-center">
        <span className="px-2 py-0.5 rounded-full bg-dark-500 text-accent mr-2">
          {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}
        </span>
        <div className="flex space-x-2 text-gray-400">
          <span title="Movement">M:{unit.stats.movement}</span>
          <span title="Armor">A:{unit.stats.armor}</span>
          <span title="Attack">AT:{unit.stats.attack}</span>
          <span title="Range">R:{unit.stats.range}</span>
        </div>
      </div>
    </div>
  );
}
