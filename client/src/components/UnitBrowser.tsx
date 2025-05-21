import { useState, useMemo } from 'react';
import { useArmy } from '@/contexts/ArmyContext';
import { units, UnitType } from '@/data/units';
import UnitCard from './UnitCard';

export default function UnitBrowser() {
  const { addUnitToArmy } = useArmy();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('name');

  // Filter and sort units based on search term, type filter, and sort option
  const filteredUnits = useMemo(() => {
    let filtered = [...units];
    
    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(unit => 
        unit.name.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(unit => unit.type === typeFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'pointCost') {
        return a.pointCost - b.pointCost;
      } else if (sortOption === 'type') {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });
    
    return filtered;
  }, [searchTerm, typeFilter, sortOption]);

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as UnitType | '');
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="bg-dark-300 rounded-lg p-4 h-full overflow-hidden flex flex-col">
      <h2 className="font-display text-xl mb-4 pb-2 border-b border-dark-100">Unit Browser</h2>
      
      {/* Search and Filter Controls */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search units..."
            className="w-full bg-dark-400 border border-dark-100 rounded p-2 pl-8 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2 top-2.5 text-dark-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex space-x-2">
          <select 
            className="bg-dark-400 border border-dark-100 rounded p-2 text-sm flex-grow focus:ring-1 focus:ring-primary focus:outline-none"
            value={typeFilter}
            onChange={handleTypeFilterChange}
          >
            <option value="">All types</option>
            <option value="infantry">Infantry</option>
            <option value="cavalry">Cavalry</option>
            <option value="vehicle">Vehicle</option>
            <option value="monster">Monster</option>
            <option value="hero">Hero</option>
          </select>
          
          <select 
            className="bg-dark-400 border border-dark-100 rounded p-2 text-sm flex-grow focus:ring-1 focus:ring-primary focus:outline-none"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="name">Sort by Name</option>
            <option value="pointCost">Sort by Points</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
      </div>
      
      {/* Unit List */}
      <div className="overflow-y-auto scrollbar-thin flex-grow">
        {filteredUnits.length > 0 ? (
          filteredUnits.map(unit => (
            <div key={unit.id} className="mb-3">
              <UnitCard unit={unit} onAdd={addUnitToArmy} />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            No units match your search criteria
          </div>
        )}
      </div>
    </div>
  );
}
