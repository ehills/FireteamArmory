import { useArmy } from '../contexts/ArmyContext';
import { SetupWizard } from '../components/SetupWizard';
import { RosterView } from '../components/RosterView';

export default function ArmyBuilder() {
  const { state } = useArmy();

  const isSetupComplete = state.setup.nation && state.setup.division && state.setup.globalVeterancy && state.setup.engagementStance;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-dark-500 text-foreground">
      {!isSetupComplete ? (
        <SetupWizard />
      ) : (
        <RosterView />
      )}
    </div>
  );
}
