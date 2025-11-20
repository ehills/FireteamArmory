import { useArmy } from '@/contexts/ArmyContext';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function ArmyHeader() {
  const { currentArmy, savedArmies, pointExceeded, setArmyName, setArmyFaction, setPointCap, loadArmy } = useArmy();

  const handleArmyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArmyName(e.target.value);
  };

  const handlePointCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCap = parseInt(e.target.value);
    if (!isNaN(newCap) && newCap >= 500) {
      setPointCap(newCap);
    }
  };

  const handleFactionChange = (value: string) => {
    setArmyFaction(value === 'none' ? '' : value);
  };

  const handleArmyChange = (armyId: string) => {
    // If selecting current army, do nothing
    if (armyId === currentArmy.id) return;

    // If selecting "new", create a new army (handled by loadArmy)
    loadArmy(armyId);
  };

  // Calculate progress bar percentage (capped at 100%)
  const progressPercentage = Math.min(
    (currentArmy.totalPoints / currentArmy.pointCap) * 100,
    100
  );

  // Determine color based on points
  const getPointsTextClass = () => {
    if (pointExceeded) return "text-danger";
    if (currentArmy.totalPoints > currentArmy.pointCap * 0.9) return "text-accent";
    return "text-success";
  };

  // Determine progress bar color
  const getProgressBarClass = () => {
    if (pointExceeded) return "bg-danger";
    if (currentArmy.totalPoints > currentArmy.pointCap * 0.9) return "bg-accent";
    return "bg-success";
  };

  return (
    <div className="bg-dark-300 rounded-lg p-4 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Army Selector */}
            <div className="w-full md:w-64">
              <Select value={currentArmy.id} onValueChange={handleArmyChange}>
                <SelectTrigger className="bg-dark-400 border-dark-100">
                  <SelectValue placeholder="Select army" />
                </SelectTrigger>
                <SelectContent className="bg-dark-400 border-dark-100">
                  <SelectGroup>
                    {/* Current (unsaved) army */}
                    {!savedArmies.some(army => army.id === currentArmy.id) && (
                      <SelectItem value={currentArmy.id} className="text-primary">
                        {currentArmy.name || "Unnamed Army"} (Current)
                      </SelectItem>
                    )}
                    
                    {/* Saved armies */}
                    {savedArmies.map(army => (
                      <SelectItem key={army.id} value={army.id}>
                        {army.name} ({army.totalPoints} pts)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Army Name Input */}
            <div className="flex-grow">
              <input
                type="text"
                value={currentArmy.name}
                placeholder="Army Name"
                className="bg-dark-400 border border-dark-100 rounded p-2 text-xl font-display w-full focus:ring-1 focus:ring-primary focus:outline-none"
                onChange={handleArmyNameChange}
              />
            </div>
          </div>
          
          <div className="flex mt-2 items-center gap-4 flex-wrap">
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">Faction:</span>
              <Select value={currentArmy.faction || 'none'} onValueChange={handleFactionChange}>
                <SelectTrigger className="bg-dark-400 border-dark-100 w-32 h-8 text-sm">
                  <SelectValue placeholder="Select faction" />
                </SelectTrigger>
                <SelectContent className="bg-dark-400 border-dark-100">
                  <SelectGroup>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Allies">Allies</SelectItem>
                    <SelectItem value="Axis">Axis</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">Point Cap:</span>
              <input
                type="number"
                value={currentArmy.pointCap}
                min="500"
                step="100"
                className="bg-dark-400 border border-dark-100 rounded p-1 w-20 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                onChange={handlePointCapChange}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold flex items-center">
            <span className={getPointsTextClass()}>{currentArmy.totalPoints}</span>
            <span className="text-gray-400">/</span>
            <span>{currentArmy.pointCap}</span>
            <span className="ml-1 text-sm text-gray-400">pts</span>
          </div>
          
          <div className="bg-dark-400 rounded-full h-2 w-48 mt-2 overflow-hidden">
            <div 
              className={`${getProgressBarClass()} h-full`} 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
