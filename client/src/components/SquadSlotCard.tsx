import { useState } from 'react';
import { useArmy } from '../contexts/ArmyContext';
import { SquadSlot, VeterancyLevel } from '../../../shared/types';
import { getSlotTotalCost } from '../lib/pointsEngine';
import { Button } from '@/components/ui/button';
import { UnitSelectorModal } from './UnitSelectorModal';

interface SquadSlotCardProps {
  slot: SquadSlot;
}

export function SquadSlotCard({ slot }: SquadSlotCardProps) {
  const { state, dispatch } = useArmy();
  const [selectorType, setSelectorType] = useState<'BASE' | 'UPGRADE' | 'ASSET' | 'VEHICLE' | null>(null);

  const slotTotal = state.setup.globalVeterancy ? getSlotTotalCost(slot, state.setup.globalVeterancy) : 0;
  
  const handleRemoveSlot = () => {
    dispatch({ type: 'REMOVE_SQUAD_SLOT', payload: slot.slotIndex });
  };

  const handleSelect = (item: any) => {
    switch (selectorType) {
      case 'BASE':
        dispatch({ type: 'SET_SLOT_BASE_UNIT', payload: { slotIndex: slot.slotIndex, unit: item } });
        break;
      case 'UPGRADE':
        dispatch({ type: 'SET_SLOT_UPGRADE', payload: { slotIndex: slot.slotIndex, upgrade: item } });
        break;
      case 'ASSET':
        dispatch({ type: 'SET_SLOT_ASSET', payload: { slotIndex: slot.slotIndex, asset: item } });
        break;
      case 'VEHICLE':
        dispatch({ type: 'SET_SLOT_VEHICLE', payload: { slotIndex: slot.slotIndex, vehicle: item } });
        break;
    }
    setSelectorType(null);
  };

  const hasBase = !!slot.baseUnit;

  return (
    <div className={`border rounded-lg bg-dark-400 overflow-hidden ${!hasBase ? 'border-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]' : 'border-dark-200'}`}>
      
      {/* Header / Base Unit */}
      <div className="p-3 bg-dark-300 flex justify-between items-center border-b border-dark-200">
        <div className="flex-1">
          {hasBase ? (
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg">{slot.baseUnit!.name}</h4>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setSelectorType('BASE')}>Change</Button>
              </div>
              <p className="text-xs text-muted-foreground whitespace-normal break-words">{slot.baseUnit!.makeUp.join(", ")}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase">Veterancy:</span>
                <select 
                  className="bg-dark-400 border border-dark-200 rounded text-xs px-2 py-1 text-white"
                  value={slot.customVeterancy || ''}
                  onChange={(e) => dispatch({ 
                    type: 'SET_SLOT_VETERANCY', 
                    payload: { slotIndex: slot.slotIndex, veterancy: e.target.value ? e.target.value as VeterancyLevel : null } 
                  })}
                >
                  <option value="">Global ({state.setup.globalVeterancy})</option>
                  {Object.values(VeterancyLevel).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold">Slot {slot.slotIndex + 1}</span>
              <Button size="sm" onClick={() => setSelectorType('BASE')}>Select Core Unit</Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-display text-xl text-primary">{slotTotal} pts</span>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/20" onClick={handleRemoveSlot}>
            Remove
          </Button>
        </div>
      </div>

      {/* Attachments (Only show if base unit exists) */}
      {hasBase && (
        <div className="p-3 pl-8 space-y-2 relative">
          {/* Indent line */}
          <div className="absolute left-4 top-0 bottom-4 w-px bg-dark-200"></div>

          {/* Upgrade */}
          <div className="flex items-center gap-3 relative">
            <div className="absolute -left-4 w-4 h-px bg-dark-200 top-1/2"></div>
            <div className="w-20 text-xs text-muted-foreground uppercase tracking-wider">Upgrade</div>
            <div className="flex-1">
              {slot.attachments.upgrade ? (
                <div className="flex justify-between items-center bg-dark-300 p-2 rounded border border-dark-200">
                  <span className="text-sm">{slot.attachments.upgrade.name}</span>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-primary">+{slot.attachments.upgrade.pointCost} pts</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => dispatch({ type: 'SET_SLOT_UPGRADE', payload: { slotIndex: slot.slotIndex, upgrade: null }})}>×</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs w-full justify-start text-muted-foreground" onClick={() => setSelectorType('UPGRADE')}>
                  + Add Upgrade
                </Button>
              )}
            </div>
          </div>

          {/* Asset Team */}
          <div className="flex items-center gap-3 relative">
            <div className="absolute -left-4 w-4 h-px bg-dark-200 top-1/2"></div>
            <div className="w-20 text-xs text-muted-foreground uppercase tracking-wider">Asset</div>
            <div className="flex-1">
              {slot.attachments.assetTeam ? (
                <div className="flex justify-between items-center bg-dark-300 p-2 rounded border border-dark-200">
                  <span className="text-sm">{slot.attachments.assetTeam.name}</span>
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => dispatch({ type: 'SET_SLOT_ASSET', payload: { slotIndex: slot.slotIndex, asset: null }})}>×</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs w-full justify-start text-muted-foreground" onClick={() => setSelectorType('ASSET')} disabled={slot.baseUnit!.maxAssetTeams === 0}>
                  {slot.baseUnit!.maxAssetTeams > 0 ? '+ Add Asset Team' : 'Assets Not Allowed'}
                </Button>
              )}
            </div>
          </div>

          {/* Vehicle */}
          <div className="flex items-center gap-3 relative">
            <div className="absolute -left-4 w-4 h-px bg-dark-200 top-1/2"></div>
            <div className="w-20 text-xs text-muted-foreground uppercase tracking-wider">Transport</div>
            <div className="flex-1">
              {slot.attachments.vehicle ? (
                <div className="flex justify-between items-center bg-dark-300 p-2 rounded border border-dark-200">
                  <span className="text-sm">{slot.attachments.vehicle.name}</span>
                  <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => dispatch({ type: 'SET_SLOT_VEHICLE', payload: { slotIndex: slot.slotIndex, vehicle: null }})}>×</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="h-8 text-xs w-full justify-start text-muted-foreground" onClick={() => setSelectorType('VEHICLE')} disabled={slot.baseUnit!.maxTransportVehicles === 0}>
                   {slot.baseUnit!.maxTransportVehicles > 0 ? '+ Add Transport' : 'Transports Not Allowed'}
                </Button>
              )}
            </div>
          </div>
          
        </div>
      )}

      {selectorType && (
        <UnitSelectorModal 
          type={selectorType} 
          slot={slot} 
          onClose={() => setSelectorType(null)} 
          onSelect={handleSelect} 
        />
      )}
    </div>
  );
}
