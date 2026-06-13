import { useArmy } from '../contexts/ArmyContext';
import { AlertTriangle, Info } from 'lucide-react';

export function ValidationPanel() {
  const { validationErrors } = useArmy();

  if (validationErrors.length === 0) return null;

  return (
    <div className="bg-dark-300 rounded-lg p-4 border border-dark-100">
      <h3 className="font-display text-lg mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-accent" />
        Roster Validation
      </h3>
      
      <div className="space-y-2">
        {validationErrors.map((error, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 p-3 rounded-md border ${
              error.type === 'compulsory' 
                ? 'bg-success/10 border-success/30 text-success' 
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}
          >
            {error.type === 'compulsory' ? (
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium">{error.message}</p>
              <p className="text-xs opacity-70 uppercase tracking-wider mt-1">{error.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
