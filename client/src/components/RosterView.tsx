import { useArmy } from '../contexts/ArmyContext';
import { SquadSlotCard } from './SquadSlotCard';
import { SpecialForcesBuilder } from './SpecialForcesBuilder';
import { DefencesPicker } from './DefencesPicker';
import { ValidationPanel } from './ValidationPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { nations } from '../data/nations';

export function RosterView() {
  const { state, dispatch, totalPoints, divisionConstraints } = useArmy();
  
  if (!state.setup.nation || !state.setup.division || !state.setup.globalVeterancy) {
    return null; // Safety catch
  }

  const nation = nations[state.setup.nation];
  
  return (
    <div className="container mx-auto p-4 max-w-6xl animate-in fade-in duration-500">
      
      {/* Top Bar Summary */}
      <div className="bg-dark-300 rounded-lg p-4 border border-dark-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{nation.flag}</div>
          <div>
            <h2 className="font-display text-xl">{nation.name} - {state.setup.division}</h2>
            <p className="text-sm text-muted-foreground">Veterancy: {state.setup.globalVeterancy} | Stance: {state.setup.engagementStance}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Points</p>
            <p className={`font-display text-3xl ${state.setup.pointLimit && totalPoints > state.setup.pointLimit ? 'text-destructive' : 'text-primary'}`}>
              {totalPoints} {state.setup.pointLimit ? `/ ${state.setup.pointLimit}` : ''}
            </p>
          </div>
          <Button variant="outline" onClick={() => dispatch({ type: 'SET_VETERANCY', payload: null as any })}>
            Edit Setup
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Validation Panel */}
        <ValidationPanel />

        {/* Commander Slot */}
        <div className="bg-dark-300 rounded-lg p-4 border border-dark-100">
          <h3 className="font-display text-lg mb-4 flex items-center gap-2">
            <span className="text-primary">★</span> Battle Group Commander
          </h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Commander Name / Title</label>
              <Input 
                placeholder="e.g. Captain Miller" 
                value={state.roster.commander?.name || ''}
                onChange={(e) => dispatch({ type: 'SET_BGC', payload: { name: e.target.value, cost: state.roster.commander?.pointsCost || 0 } })}
                className="bg-dark-400 border-dark-200"
              />
            </div>
            <div className="w-24">
              <label className="text-xs text-muted-foreground mb-1 block">Cost</label>
              <Input 
                type="number" 
                value={state.roster.commander?.pointsCost || 0}
                onChange={(e) => dispatch({ type: 'SET_BGC', payload: { name: state.roster.commander?.name || '', cost: parseInt(e.target.value) || 0 } })}
                className="bg-dark-400 border-dark-200"
              />
            </div>
          </div>
        </div>

        {/* Squad Slots */}
        <div className="bg-dark-300 rounded-lg p-4 border border-dark-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-lg">Combat Squads</h3>
            <span className="text-sm text-muted-foreground">
              {state.roster.squadSlots.length} / {divisionConstraints?.maxSquadSlots || 0} Slots
            </span>
          </div>
          
          <div className="space-y-4">
            {state.roster.squadSlots.map((slot, index) => (
              <SquadSlotCard key={index} slot={slot} />
            ))}
          </div>
          
          {(divisionConstraints?.maxSquadSlots || 0) > state.roster.squadSlots.length && (
            <Button 
              onClick={() => dispatch({ type: 'ADD_SQUAD_SLOT' })}
              className="w-full mt-4 border-dashed border-2 bg-transparent hover:bg-dark-200 text-muted-foreground"
              variant="outline"
            >
              + Add Squad Slot
            </Button>
          )}
        </div>

        {/* Special Forces (If allowed) */}
        {(divisionConstraints?.maxSpecialForcesSlots || 0) > 0 && (
          <div className="bg-dark-300 rounded-lg p-4 border border-dark-100">
             <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg">Special Forces</h3>
              <span className="text-sm text-muted-foreground">
                {state.roster.specialForces.length} / {divisionConstraints?.maxSpecialForcesSlots || 0} Slots
              </span>
            </div>
            
            <div className="space-y-4">
              {state.roster.specialForces.map((slot, index) => (
                <SpecialForcesBuilder key={index} slot={slot} />
              ))}
            </div>

            {(divisionConstraints?.maxSpecialForcesSlots || 0) > state.roster.specialForces.length && (
              <Button 
                onClick={() => dispatch({ type: 'ADD_SF_SLOT' })}
                className="w-full mt-4 border-dashed border-2 bg-transparent hover:bg-dark-200 text-muted-foreground"
                variant="outline"
              >
                + Add Special Forces Team
              </Button>
            )}
          </div>
        )}

        {/* Static Defences */}
        <DefencesPicker />

      </div>
    </div>
  );
}
