import { useState, useMemo, useEffect } from 'react';
import { useArmy } from '@/contexts/ArmyContext';
import { units as defaultUnits, UnitType, Unit } from '@/data/units';
import UnitCard from './UnitCard';

export default function UnitBrowser() {
  const { addUnitToArmy, currentArmy } = useArmy();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [factionFilter, setFactionFilter] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('name');
  
  // Internal state to store all units (default + custom)
  const [allUnits, setAllUnits] = useState<Unit[]>([...defaultUnits]);
  
  // Compute unique factions from allUnits (filtered by army faction if set)
  const factions = useMemo(() => {
    const set = new Set<string>();
    allUnits.forEach(u => {
      if (u.faction) {
        // Only include factions that match the army faction or if no army faction is set
        if (!currentArmy.faction || u.faction === currentArmy.faction) {
          set.add(u.faction);
        }
      }
    });
    return Array.from(set).sort();
  }, [allUnits, currentArmy.faction]);

  // Function to load custom units
  const loadCustomUnits = () => {
    try {
      const storedCustomUnitsJson = localStorage.getItem('customUnits');
      if (storedCustomUnitsJson) {
        const storedCustomUnits = JSON.parse(storedCustomUnitsJson);
        
        // Combine default units with custom units, avoiding duplicates
        const combinedUnits = [...defaultUnits];
        if (Array.isArray(storedCustomUnits)) {
          storedCustomUnits.forEach((unit: Unit) => {
            if (!combinedUnits.some(existing => existing.id === unit.id)) {
              combinedUnits.push(unit);
            }
          });
        }
        
        setAllUnits(combinedUnits);
      }
    } catch (error) {
      console.error('Error loading custom units:', error);
    }
  };
  
  // Load custom units when component mounts
  useEffect(() => {
    loadCustomUnits();
    
    // Set up storage event listener to reload when custom units change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'customUnits') {
        loadCustomUnits();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty array means this runs once on mount

  // Filter and sort units - recompute when dependencies change
  const filteredUnits = useMemo(() => {
    let filtered = [...allUnits];

    // Apply army faction filter first (if army has a faction selected)
    // Show only units from the same faction OR units with no faction
    if (currentArmy.faction) {
      filtered = filtered.filter(unit =>
        !unit.faction || unit.faction === currentArmy.faction
      );
    }

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

    // Apply manual faction filter (this further filters within army faction)
    if (factionFilter) {
      filtered = filtered.filter(unit => unit.faction === factionFilter);
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
  }, [allUnits, searchTerm, typeFilter, factionFilter, sortOption, currentArmy.faction]);

  // Event handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as UnitType | '');
  };

  const handleFactionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFactionFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="bg-dark-300 rounded-lg p-4 h-full overflow-hidden flex flex-col">
      <h2 className="font-display text-xl mb-4 pb-2 border-b border-dark-100">Unit Browser</h2>

      {/* Army Faction Filter Indicator */}
      {currentArmy.faction && (
        <div className="mb-3 p-2 bg-primary/10 border border-primary/30 rounded text-sm">
          <span className="text-gray-300">Showing units for: </span>
          <span className="font-semibold text-primary">{currentArmy.faction}</span>
          <span className="text-gray-400 ml-1">(and neutral units)</span>
        </div>
      )}

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
            <option value="vehicle">Vehicle</option>
            <option value="tank">Tank</option>
            <option value="asset">Asset</option>
          </select>

          <select
            className="bg-dark-400 border border-dark-100 rounded p-2 text-sm flex-grow focus:ring-1 focus:ring-primary focus:outline-none"
            value={factionFilter}
            onChange={handleFactionFilterChange}
          >
            <option value="">All factions</option>
            {factions.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
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
