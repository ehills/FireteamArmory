import { useArmy } from '../contexts/ArmyContext';
import { SquadSlot, UnitCategory, NationCode } from '../../../shared/types';
import { getAllUSAUnits } from '../data/usa-units';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getUnitCost } from '../lib/pointsEngine';

interface UnitSelectorModalProps {
  type: 'BASE' | 'UPGRADE' | 'ASSET' | 'VEHICLE';
  slot: SquadSlot;
  onClose: () => void;
  onSelect: (item: any) => void;
}

export function UnitSelectorModal({ type, slot, onClose, onSelect }: UnitSelectorModalProps) {
  const { state, divisionConstraints } = useArmy();
  const vet = state.setup.globalVeterancy;
  
  if (!vet) return null;

  // Ideally we would fetch based on NationCode. For now USA is the only implementation.
  let availableItems: any[] = [];

  if (type === 'BASE') {
    const allUnits = getAllUSAUnits();
    // Filter by division constraints and unit category (Squads, etc.)
    availableItems = allUnits.filter(u => {
      if (!divisionConstraints?.allowedCategories.includes(u.unitCategory)) return false;
      return [UnitCategory.INFANTRY_SQUAD, UnitCategory.VEHICLE].includes(u.unitCategory);
    });
  } else if (type === 'UPGRADE') {
    availableItems = slot.baseUnit?.upgrades || [];
  } else if (type === 'ASSET') {
    const allUnits = getAllUSAUnits();
    availableItems = allUnits.filter(u => u.unitCategory === UnitCategory.ASSET_SQUAD);
  } else if (type === 'VEHICLE') {
    const allUnits = getAllUSAUnits();
    availableItems = allUnits.filter(u => {
      // Must be transport vehicles
      return u.unitCategory === UnitCategory.VEHICLE && (u as any).transportCapacity > 0;
    });
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-dark-400 border-dark-200 max-w-2xl text-foreground">
        <DialogHeader>
          <DialogTitle>Select {type === 'BASE' ? 'Core Unit' : type}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
          {availableItems.map((item) => {
            const cost = type === 'UPGRADE' ? item.pointCost : getUnitCost(item, vet);
            return (
              <div 
                key={item.id} 
                className="bg-dark-300 p-4 rounded-lg border border-dark-200 hover:border-primary cursor-pointer transition-colors flex flex-col justify-between"
                onClick={() => onSelect(item)}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{item.name}</h4>
                    <span className="text-primary font-bold">{cost} pts</span>
                  </div>
                  {item.makeUp && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {item.makeUp.join(", ")}
                    </p>
                  )}
                  {item.stats && (
                    <div className="flex gap-2 text-xs bg-dark-400 p-2 rounded">
                      <span>M: {item.stats.movement}</span>
                      <span>A: {item.stats.armor}</span>
                      <span>Atk: {item.stats.attack}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {availableItems.length === 0 && (
            <div className="col-span-2 text-center p-8 text-muted-foreground">
              No options available for this category based on your current division and slot rules.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
