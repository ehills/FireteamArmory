import { useArmy } from '../contexts/ArmyContext';
import { usaDefences } from '../data/usa-units';
import { Button } from '@/components/ui/button';

export function DefencesPicker() {
  const { state, dispatch } = useArmy();
  
  // Create a map for easy lookup of current quantities
  const currentDefences = state.roster.defences.reduce((acc, def) => {
    acc[def.defenceId] = def.quantity;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-dark-300 rounded-lg p-4 border border-dark-100">
      <h3 className="font-display text-lg mb-4">Static Defences</h3>
      
      <div className="space-y-3">
        {usaDefences.map((def) => {
          const qty = currentDefences[def.id] || 0;
          
          return (
            <div key={def.id} className="flex justify-between items-center bg-dark-400 p-3 rounded-lg border border-dark-200">
              <div>
                <p className="font-semibold text-sm">{def.name}</p>
                <p className="text-xs text-primary">{def.pointsCost} pts each</p>
              </div>
              
              <div className="flex items-center gap-3 bg-dark-300 rounded-md border border-dark-100 p-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
                  onClick={() => {
                    if (qty > 1) {
                      dispatch({ type: 'SET_DEFENCE_QTY', payload: { id: def.id, qty: qty - 1 }});
                    } else if (qty === 1) {
                      dispatch({ type: 'REMOVE_DEFENCE', payload: def.id });
                    }
                  }}
                  disabled={qty === 0}
                >
                  -
                </Button>
                
                <span className="w-4 text-center text-sm font-bold">{qty}</span>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-white"
                  onClick={() => {
                    if (qty === 0) {
                      dispatch({ type: 'ADD_DEFENCE', payload: def.id });
                    } else {
                      dispatch({ type: 'SET_DEFENCE_QTY', payload: { id: def.id, qty: qty + 1 }});
                    }
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
