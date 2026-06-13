import { useState } from 'react';
import { useArmy } from '../contexts/ArmyContext';
import { NationCode, DivisionType, VeterancyLevel, EngagementStance } from '../../../shared/types';
import { nations } from '../data/nations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SetupWizard() {
  const { state, dispatch } = useArmy();
  const [step, setStep] = useState(1);

  const selectedNation = state.setup.nation ? nations[state.setup.nation] : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="w-full max-w-3xl bg-dark-300 rounded-lg p-8 shadow-xl border border-dark-100">
        <h1 className="text-3xl font-display text-center mb-2">ARMY SETUP</h1>
        <p className="text-muted-foreground text-center mb-8">Configure your battle group parameters</p>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-dark-200'}`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-dark-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-dark-200'}`}>2</div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-dark-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-dark-200'}`}>3</div>
          </div>
        </div>

        {/* Step 1: Nation */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl mb-4 font-semibold text-center">Select Nation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.values(nations).map((nation) => (
                <button
                  key={nation.code}
                  onClick={() => {
                    dispatch({ type: 'SET_NATION', payload: nation.code });
                    setStep(2);
                  }}
                  className={`p-6 rounded-lg border-2 transition-all hover:border-primary hover:bg-dark-200 flex flex-col items-center justify-center gap-3 ${state.setup.nation === nation.code ? 'border-primary bg-dark-200' : 'border-dark-100 bg-dark-400'}`}
                >
                  <span className="text-4xl">{nation.flag}</span>
                  <span className="font-semibold">{nation.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Division */}
        {step === 2 && selectedNation && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl mb-4 font-semibold text-center">Select Division for {selectedNation.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              {selectedNation.availableDivisions.map((division) => (
                <button
                  key={division}
                  onClick={() => {
                    dispatch({ type: 'SET_DIVISION', payload: division });
                    setStep(3);
                  }}
                  className={`p-6 rounded-lg border-2 transition-all hover:border-primary hover:bg-dark-200 flex flex-col items-center justify-center gap-2 ${state.setup.division === division ? 'border-primary bg-dark-200' : 'border-dark-100 bg-dark-400'}`}
                >
                  <span className="font-display text-lg">{division}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setStep(1)}>Back to Nations</Button>
            </div>
          </div>
        )}

        {/* Step 3: Veterancy & Stance */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl mb-4 font-semibold text-center">Final Parameters</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Global Veterancy</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.values(VeterancyLevel).map((vet) => (
                    <button
                      key={vet}
                      onClick={() => dispatch({ type: 'SET_VETERANCY', payload: vet })}
                      className={`p-3 rounded-md border text-sm font-medium transition-all hover:border-primary ${state.setup.globalVeterancy === vet ? 'border-primary bg-primary/20 text-primary-foreground' : 'border-dark-100 bg-dark-400'}`}
                    >
                      {vet}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Engagement Stance</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(EngagementStance).map((stance) => (
                    <button
                      key={stance}
                      onClick={() => dispatch({ type: 'SET_STANCE', payload: stance })}
                      className={`p-3 rounded-md border text-sm font-medium transition-all hover:border-primary ${state.setup.engagementStance === stance ? 'border-primary bg-primary/20 text-primary-foreground' : 'border-dark-100 bg-dark-400'}`}
                    >
                      {stance}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Points Limit (Optional)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 1000"
                  value={state.setup.pointLimit || ''}
                  onChange={(e) => dispatch({ type: 'SET_POINT_LIMIT', payload: e.target.value ? parseInt(e.target.value) : null })}
                  className="bg-dark-400 border-dark-200"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                disabled={!state.setup.globalVeterancy || !state.setup.engagementStance}
                onClick={() => {
                  // Roster is unlocked! The ArmyBuilder will switch views automatically
                }}
              >
                Assemble Roster
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
