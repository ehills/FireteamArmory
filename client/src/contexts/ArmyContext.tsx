import React, { createContext, useContext, useState, useEffect } from 'react';
import { Army, ArmyUnit, Unit } from '@/data/units';
import { calculateUnitFinalStats, calculateUnitTotalCost } from '@/lib/armyUtils';
import { useToast } from '@/hooks/use-toast';

interface ArmyContextType {
  currentArmy: Army;
  savedArmies: Army[];
  pointExceeded: boolean;
  setArmyName: (name: string) => void;
  setPointCap: (cap: number) => void;
  addUnitToArmy: (unit: Unit) => void;
  removeUnitFromArmy: (unitIndex: number) => void;
  toggleUpgrade: (unitIndex: number, upgradeId: string) => void;
  saveArmy: () => void;
  loadArmy: (armyId: string) => void;
  deleteArmy: (armyId: string) => void;
  createNewArmy: () => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const defaultArmy: Army = {
  id: crypto.randomUUID(),
  name: "New Army",
  units: [],
  pointCap: 2000,
  totalPoints: 0
};

const ArmyContext = createContext<ArmyContextType | undefined>(undefined);

export function ArmyProvider({ children }: { children: React.ReactNode }) {
  const [currentArmy, setCurrentArmy] = useState<Army>(defaultArmy);
  const [savedArmies, setSavedArmies] = useState<Army[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Load saved armies from localStorage on initial render
  useEffect(() => {
    const savedArmiesData = localStorage.getItem('savedArmies');
    if (savedArmiesData) {
      try {
        const parsedArmies = JSON.parse(savedArmiesData);
        setSavedArmies(parsedArmies);
      } catch (error) {
        console.error('Failed to parse saved armies', error);
      }
    }
  }, []);

  // Calculate if points are exceeded
  const pointExceeded = currentArmy.totalPoints > currentArmy.pointCap;

  const setArmyName = (name: string) => {
    setCurrentArmy(prev => ({ ...prev, name }));
  };

  const setPointCap = (pointCap: number) => {
    setCurrentArmy(prev => ({ ...prev, pointCap }));
  };

  const addUnitToArmy = (unit: Unit) => {
    const armyUnit: ArmyUnit = {
      ...unit,
      selectedUpgrades: [],
      totalPointCost: unit.pointCost,
      finalStats: { ...unit.stats }
    };

    setCurrentArmy(prev => {
      const updatedUnits = [...prev.units, armyUnit];
      const totalPoints = updatedUnits.reduce((sum, unit) => sum + unit.totalPointCost, 0);
      return { ...prev, units: updatedUnits, totalPoints };
    });

    toast({
      title: "Unit Added",
      description: `${unit.name} added to your army.`,
    });
  };

  const removeUnitFromArmy = (unitIndex: number) => {
    setCurrentArmy(prev => {
      const updatedUnits = prev.units.filter((_, index) => index !== unitIndex);
      const totalPoints = updatedUnits.reduce((sum, unit) => sum + unit.totalPointCost, 0);
      return { ...prev, units: updatedUnits, totalPoints };
    });
  };

  const toggleUpgrade = (unitIndex: number, upgradeId: string) => {
    setCurrentArmy(prev => {
      const updatedUnits = [...prev.units];
      const unit = { ...updatedUnits[unitIndex] };
      
      // Toggle upgrade selection
      if (unit.selectedUpgrades.includes(upgradeId)) {
        unit.selectedUpgrades = unit.selectedUpgrades.filter(id => id !== upgradeId);
      } else {
        unit.selectedUpgrades = [...unit.selectedUpgrades, upgradeId];
      }
      
      // Recalculate unit cost and stats
      unit.totalPointCost = calculateUnitTotalCost(unit);
      unit.finalStats = calculateUnitFinalStats(unit);
      
      updatedUnits[unitIndex] = unit;
      const totalPoints = updatedUnits.reduce((sum, unit) => sum + unit.totalPointCost, 0);
      
      return { ...prev, units: updatedUnits, totalPoints };
    });
  };

  const saveArmy = () => {
    if (currentArmy.name.trim() === '') {
      toast({
        title: "Cannot Save Army",
        description: "Please provide a name for your army.",
        variant: "destructive"
      });
      return;
    }

    // Check if army with this ID already exists
    const existingArmyIndex = savedArmies.findIndex(army => army.id === currentArmy.id);
    let updatedSavedArmies: Army[];

    if (existingArmyIndex >= 0) {
      // Update existing army
      updatedSavedArmies = [...savedArmies];
      updatedSavedArmies[existingArmyIndex] = currentArmy;
    } else {
      // Add new army
      updatedSavedArmies = [...savedArmies, currentArmy];
    }

    setSavedArmies(updatedSavedArmies);
    localStorage.setItem('savedArmies', JSON.stringify(updatedSavedArmies));
    
    toast({
      title: "Army Saved",
      description: `${currentArmy.name} has been saved.`
    });
  };

  const loadArmy = (armyId: string) => {
    const armyToLoad = savedArmies.find(army => army.id === armyId);
    if (armyToLoad) {
      setCurrentArmy(armyToLoad);
      setIsModalOpen(false);
      
      toast({
        title: "Army Loaded",
        description: `${armyToLoad.name} has been loaded.`
      });
    }
  };

  const deleteArmy = (armyId: string) => {
    const updatedArmies = savedArmies.filter(army => army.id !== armyId);
    setSavedArmies(updatedArmies);
    localStorage.setItem('savedArmies', JSON.stringify(updatedArmies));
    
    toast({
      title: "Army Deleted",
      description: "The army has been deleted."
    });
  };

  const createNewArmy = () => {
    setCurrentArmy({
      id: crypto.randomUUID(),
      name: "New Army",
      units: [],
      pointCap: 2000,
      totalPoints: 0
    });
    
    toast({
      title: "New Army Created",
      description: "Start adding units to your new army."
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ArmyContext.Provider value={{
      currentArmy,
      savedArmies,
      pointExceeded,
      setArmyName,
      setPointCap,
      addUnitToArmy,
      removeUnitFromArmy,
      toggleUpgrade,
      saveArmy,
      loadArmy,
      deleteArmy,
      createNewArmy,
      isModalOpen,
      openModal,
      closeModal
    }}>
      {children}
    </ArmyContext.Provider>
  );
}

export function useArmy() {
  const context = useContext(ArmyContext);
  if (context === undefined) {
    throw new Error('useArmy must be used within an ArmyProvider');
  }
  return context;
}
