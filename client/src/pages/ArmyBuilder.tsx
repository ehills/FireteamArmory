import { useArmy } from '@/contexts/ArmyContext';
import AppHeader from '@/components/AppHeader';
import UnitBrowser from '@/components/UnitBrowser';
import ArmyHeader from '@/components/ArmyHeader';
import ArmyUnitCard from '@/components/ArmyUnitCard';
import SaveLoadModal from '@/components/SaveLoadModal';
import { useState } from 'react';

export default function ArmyBuilder() {
  const { currentArmy, removeUnitFromArmy, toggleUpgrade, isModalOpen } = useArmy();
  const [armySortOption, setArmySortOption] = useState<string>('name');

  // Sort army units based on selected option
  const sortedArmyUnits = [...currentArmy.units].sort((a, b) => {
    if (armySortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (armySortOption === 'pointCost') {
      return b.totalPointCost - a.totalPointCost;
    } else if (armySortOption === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  // Handle sorting change for army units
  const handleArmySortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArmySortOption(e.target.value);
  };

  return (
    <>
      <AppHeader />
      
      <main className="container mx-auto p-4">
        <div className="army-builder-grid gap-6">
          {/* Unit Browser */}
          <UnitBrowser />
          
          {/* Army Builder */}
          <div className="flex flex-col h-full">
            {/* Army Info */}
            <ArmyHeader />
            
            {/* Units in Army */}
            <div className="bg-dark-300 rounded-lg p-4 flex-grow overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-dark-100">
                <h2 className="font-display text-xl">Army Units</h2>
                <div className="flex space-x-2">
                  <select 
                    className="bg-dark-400 border border-dark-100 rounded p-1 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    value={armySortOption}
                    onChange={handleArmySortChange}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="pointCost">Sort by Points</option>
                    <option value="type">Sort by Type</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-y-auto scrollbar-thin flex-grow">
                {sortedArmyUnits.length > 0 ? (
                  sortedArmyUnits.map((unit, index) => (
                    <ArmyUnitCard 
                      key={`${unit.id}-${index}`}
                      unit={unit}
                      index={index}
                      onRemove={removeUnitFromArmy}
                      onToggleUpgrade={toggleUpgrade}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-dark-100 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-gray-400 font-display text-lg">Your army is empty</h3>
                    <p className="text-gray-500 text-sm max-w-xs mt-1">Select units from the browser on the left to start building your army</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save/Load Modal */}
      {isModalOpen && <SaveLoadModal />}
    </>
  );
}
