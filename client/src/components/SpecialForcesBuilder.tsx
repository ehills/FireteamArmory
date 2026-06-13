import { useArmy } from '../contexts/ArmyContext';
import { SpecialForcesSlot, VeterancyLevel } from '../../../shared/types';
import { getSpecialForcesBudget, getSpecialForcesSpent } from '../lib/pointsEngine';
import { usaSpecialForces } from '../data/usa-units';
import { Button } from '@/components/ui/button';

interface SpecialForcesBuilderProps {
  slot: SpecialForcesSlot;
}

export function SpecialForcesBuilder({ slot }: SpecialForcesBuilderProps) {
  const { state, dispatch } = useArmy();
  const vet = VeterancyLevel.VETERAN;

  const budget = getSpecialForcesBudget(vet);
  const spent = getSpecialForcesSpent(slot.models, vet);
  const remaining = budget - spent;
  
  const hasLeader = slot.models.some(m => m.isLeader);

  return (
    <div className={`border rounded-lg bg-dark-400 overflow-hidden ${!hasLeader ? 'border-success shadow-[0_0_8px_rgba(var(--success),0.3)]' : spent > budget ? 'border-destructive' : 'border-dark-200'}`}>
      
      {/* Header & Budget Bar */}
      <div className="p-3 bg-dark-300 flex justify-between items-center border-b border-dark-200">
        <div>
          <h4 className="font-bold text-lg">Special Forces Team</h4>
          <div className="flex gap-2 items-center text-xs text-muted-foreground">
            <span className="text-primary font-bold">VETERAN</span>
            <span>•</span>
            <span>{slot.models.length} Models</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-muted-foreground uppercase mr-2">Budget</span>
            <span className={`font-display text-xl ${remaining < 0 ? 'text-destructive' : 'text-primary'}`}>
              {spent} / {budget} pts
            </span>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/20" onClick={() => dispatch({ type: 'REMOVE_SF_SLOT', payload: slot.slotIndex })}>
            Remove
          </Button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shopping List (Available Models) */}
        <div>
          <h5 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Available Models</h5>
          <div className="space-y-2">
            {usaSpecialForces.map((model) => {
              const cost = model.pointsCost[vet] || 0;
              const canAfford = remaining >= cost;
              return (
                <div key={model.id} className="flex justify-between items-center bg-dark-300 p-2 rounded border border-dark-200">
                  <div>
                    <p className={`text-sm ${model.isLeader ? 'font-bold text-success' : ''}`}>{model.name}</p>
                    <p className="text-xs text-primary">{cost} pts</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs" 
                    disabled={!canAfford}
                    onClick={() => dispatch({ type: 'ADD_SF_MODEL', payload: { slotIndex: slot.slotIndex, model } })}
                  >
                    + Add
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Models (Cart) */}
        <div>
          <h5 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Team Roster</h5>
          
          {slot.models.length === 0 ? (
            <div className="text-center p-6 bg-dark-300 rounded border border-dark-200 border-dashed text-muted-foreground">
              <p className="text-sm mb-2">No models added yet.</p>
              <p className="text-xs text-success font-bold">A Squad Leader is required.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {slot.models.map((model, index) => (
                <div key={`${model.id}-${index}`} className="flex justify-between items-center bg-dark-200 p-2 rounded border border-dark-100">
                  <span className={`text-sm ${model.isLeader ? 'text-success font-bold' : ''}`}>
                    {model.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{model.pointsCost[vet]} pts</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => dispatch({ type: 'REMOVE_SF_MODEL', payload: { slotIndex: slot.slotIndex, modelIndex: index } })}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
