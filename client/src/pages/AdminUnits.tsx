import { useState } from 'react';
import { Unit, UnitType, Upgrade, UnitStat } from '@/data/units';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/AppHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function AdminUnits() {
  // Units stored in local storage
  const [storedUnits, setStoredUnits] = useLocalStorage<Unit[]>('customUnits', []);
  
  // Combined units (default + custom)
  const [allUnits, setAllUnits] = useState<Unit[]>(() => {
    // We'll load the default units from data/units.ts via a separate import 
    // to avoid circular imports with context providers
    const defaultUnits = require('@/data/units').units;
    return [...defaultUnits, ...storedUnits];
  });
  
  // Selected unit for editing or deletion
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  
  // State for the add/edit unit dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // State for form fields
  const [unitForm, setUnitForm] = useState<{
    id: string;
    name: string;
    type: UnitType;
    pointCost: number;
    stats: UnitStat;
    upgrades: Upgrade[];
  }>({
    id: '',
    name: '',
    type: 'infantry',
    pointCost: 10,
    stats: {
      movement: '5"',
      armor: '5+',
      attack: 1,
      range: '12"',
      special: ''
    },
    upgrades: []
  });
  
  // State for the new upgrade form
  const [upgradeForm, setUpgradeForm] = useState<Upgrade>({
    id: '',
    name: '',
    pointCost: 5,
    statModifiers: {
      movement: '',
      armor: '',
      attack: 0,
      range: '',
      special: ''
    }
  });
  
  const [isUpgradeFormOpen, setIsUpgradeFormOpen] = useState(false);
  
  const { toast } = useToast();
  
  // Filter to show only custom units
  const [showOnlyCustom, setShowOnlyCustom] = useState(false);
  const displayedUnits = showOnlyCustom 
    ? allUnits.filter(unit => storedUnits.some(customUnit => customUnit.id === unit.id))
    : allUnits;
  
  // Function to handle opening the add unit dialog
  const handleAddUnit = () => {
    setDialogMode('add');
    setUnitForm({
      id: crypto.randomUUID(),
      name: '',
      type: 'infantry',
      pointCost: 10,
      stats: {
        movement: '5"',
        armor: '5+',
        attack: 1,
        range: '12"',
        special: ''
      },
      upgrades: []
    });
    setIsDialogOpen(true);
  };
  
  // Function to handle opening the edit unit dialog
  const handleEditUnit = (unit: Unit) => {
    setDialogMode('edit');
    setSelectedUnit(unit);
    setUnitForm({
      ...unit,
      // Create a deep copy of the unit
      stats: { ...unit.stats },
      upgrades: unit.upgrades.map(upgrade => ({
        ...upgrade,
        statModifiers: { ...upgrade.statModifiers }
      }))
    });
    setIsDialogOpen(true);
  };
  
  // Function to handle deleting a unit
  const handleDeleteUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsDeleteDialogOpen(true);
  };
  
  // Function to handle form submission
  const handleSubmitUnit = () => {
    // Validate form
    if (!unitForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Unit name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (dialogMode === 'add') {
      // Add new unit to custom units
      const newCustomUnits = [...storedUnits, unitForm];
      setStoredUnits(newCustomUnits);
      setAllUnits([...allUnits, unitForm]);
      
      toast({
        title: "Unit Added",
        description: `${unitForm.name} has been added to your custom units.`
      });
    } else {
      // Update existing unit
      const updatedCustomUnits = storedUnits.map(unit => 
        unit.id === unitForm.id ? unitForm : unit
      );
      
      setStoredUnits(updatedCustomUnits);
      
      // Update all units list
      const updatedAllUnits = allUnits.map(unit => 
        unit.id === unitForm.id ? unitForm : unit
      );
      
      setAllUnits(updatedAllUnits);
      
      toast({
        title: "Unit Updated",
        description: `${unitForm.name} has been updated.`
      });
    }
    
    setIsDialogOpen(false);
  };
  
  // Function to confirm unit deletion
  const confirmDeleteUnit = () => {
    if (!selectedUnit) return;
    
    // Check if it's a custom unit
    const isCustomUnit = storedUnits.some(unit => unit.id === selectedUnit.id);
    
    if (isCustomUnit) {
      // Remove from custom units
      const updatedCustomUnits = storedUnits.filter(unit => unit.id !== selectedUnit.id);
      setStoredUnits(updatedCustomUnits);
      
      // Remove from all units list
      const updatedAllUnits = allUnits.filter(unit => unit.id !== selectedUnit.id);
      setAllUnits(updatedAllUnits);
      
      toast({
        title: "Unit Deleted",
        description: `${selectedUnit.name} has been deleted.`
      });
    } else {
      toast({
        title: "Cannot Delete",
        description: "Default units cannot be deleted.",
        variant: "destructive"
      });
    }
    
    setIsDeleteDialogOpen(false);
  };
  
  // Function to add a new upgrade to the unit
  const handleAddUpgrade = () => {
    if (!upgradeForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Upgrade name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newUpgrade = {
      ...upgradeForm,
      id: upgradeForm.id || crypto.randomUUID()
    };
    
    setUnitForm(prev => ({
      ...prev,
      upgrades: [...prev.upgrades, newUpgrade]
    }));
    
    // Reset upgrade form
    setUpgradeForm({
      id: '',
      name: '',
      pointCost: 5,
      statModifiers: {
        movement: '',
        armor: '',
        attack: 0,
        range: '',
        special: ''
      }
    });
    
    setIsUpgradeFormOpen(false);
  };
  
  // Function to remove an upgrade from the unit
  const handleRemoveUpgrade = (upgradeId: string) => {
    setUnitForm(prev => ({
      ...prev,
      upgrades: prev.upgrades.filter(upgrade => upgrade.id !== upgradeId)
    }));
  };
  
  // Function to open the upgrade form
  const openUpgradeForm = () => {
    setUpgradeForm({
      id: crypto.randomUUID(),
      name: '',
      pointCost: 5,
      statModifiers: {
        movement: '',
        armor: '',
        attack: 0,
        range: '',
        special: ''
      }
    });
    setIsUpgradeFormOpen(true);
  };
  
  return (
    <>
      <AppHeader />
      
      <main className="container mx-auto p-4">
        <div className="bg-dark-300 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-display font-bold">Unit Manager</h1>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowOnlyCustom(!showOnlyCustom)}>
                {showOnlyCustom ? "Show All Units" : "Show Custom Units Only"}
              </Button>
              <Button onClick={handleAddUnit}>
                Add New Unit
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Units</TabsTrigger>
              <TabsTrigger value="infantry">Infantry</TabsTrigger>
              <TabsTrigger value="cavalry">Cavalry</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
              <TabsTrigger value="monster">Monster</TabsTrigger>
              <TabsTrigger value="hero">Hero</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {displayUnitsList(displayedUnits)}
            </TabsContent>
            
            <TabsContent value="infantry" className="space-y-4">
              {displayUnitsList(displayedUnits.filter(unit => unit.type === 'infantry'))}
            </TabsContent>
            
            <TabsContent value="cavalry" className="space-y-4">
              {displayUnitsList(displayedUnits.filter(unit => unit.type === 'cavalry'))}
            </TabsContent>
            
            <TabsContent value="vehicle" className="space-y-4">
              {displayUnitsList(displayedUnits.filter(unit => unit.type === 'vehicle'))}
            </TabsContent>
            
            <TabsContent value="monster" className="space-y-4">
              {displayUnitsList(displayedUnits.filter(unit => unit.type === 'monster'))}
            </TabsContent>
            
            <TabsContent value="hero" className="space-y-4">
              {displayUnitsList(displayedUnits.filter(unit => unit.type === 'hero'))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Add/Edit Unit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark-400 border border-dark-100 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'add' ? 'Add New Unit' : 'Edit Unit'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Unit Name</label>
                <Input 
                  value={unitForm.name} 
                  onChange={e => setUnitForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-dark-300 border-dark-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Unit Type</label>
                  <Select 
                    value={unitForm.type}
                    onValueChange={value => setUnitForm(prev => ({ ...prev, type: value as UnitType }))}
                  >
                    <SelectTrigger className="bg-dark-300 border-dark-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-400 border-dark-200">
                      <SelectItem value="infantry">Infantry</SelectItem>
                      <SelectItem value="cavalry">Cavalry</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="monster">Monster</SelectItem>
                      <SelectItem value="hero">Hero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Point Cost</label>
                  <Input 
                    type="number"
                    min="1"
                    value={unitForm.pointCost} 
                    onChange={e => setUnitForm(prev => ({ ...prev, pointCost: parseInt(e.target.value) || 0 }))}
                    className="bg-dark-300 border-dark-200"
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-2">Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Movement</label>
                  <Input 
                    value={unitForm.stats.movement} 
                    onChange={e => setUnitForm(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, movement: e.target.value }
                    }))}
                    className="bg-dark-300 border-dark-200"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Armor</label>
                  <Input 
                    value={unitForm.stats.armor} 
                    onChange={e => setUnitForm(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, armor: e.target.value }
                    }))}
                    className="bg-dark-300 border-dark-200"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Attack</label>
                  <Input 
                    type="number"
                    min="0"
                    value={unitForm.stats.attack} 
                    onChange={e => setUnitForm(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, attack: parseInt(e.target.value) || 0 }
                    }))}
                    className="bg-dark-300 border-dark-200"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Range</label>
                  <Input 
                    value={unitForm.stats.range} 
                    onChange={e => setUnitForm(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, range: e.target.value }
                    }))}
                    className="bg-dark-300 border-dark-200"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Special</label>
                  <Input 
                    value={unitForm.stats.special || ''} 
                    onChange={e => setUnitForm(prev => ({ 
                      ...prev, 
                      stats: { ...prev.stats, special: e.target.value }
                    }))}
                    className="bg-dark-300 border-dark-200"
                  />
                </div>
              </div>
            </div>
            
            <div className="col-span-2 mt-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Upgrades</h3>
                <Button variant="outline" size="sm" onClick={openUpgradeForm}>
                  Add Upgrade
                </Button>
              </div>
              
              {unitForm.upgrades.length > 0 ? (
                <div className="space-y-3">
                  {unitForm.upgrades.map((upgrade) => (
                    <div key={upgrade.id} className="bg-dark-300 p-3 rounded border border-dark-200 relative">
                      <button
                        onClick={() => handleRemoveUpgrade(upgrade.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-danger"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{upgrade.name}</h4>
                        <span className="text-sm">{upgrade.pointCost} pts</span>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        {Object.entries(upgrade.statModifiers)
                          .filter(([_, value]) => value !== '' && value !== 0)
                          .map(([stat, value], i, arr) => {
                            const formattedStat = stat.charAt(0).toUpperCase() + stat.slice(1);
                            const prefix = typeof value === 'string' && value !== '' && !value.startsWith('-') ? '+' : '';
                            return (
                              <span key={stat}>
                                {formattedStat}: {prefix}{value}
                                {i < arr.length - 1 ? ', ' : ''}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-dark-300 p-4 rounded text-center text-gray-400">
                  No upgrades added yet
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitUnit}>{dialogMode === 'add' ? 'Add Unit' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Upgrade Dialog */}
      <Dialog open={isUpgradeFormOpen} onOpenChange={setIsUpgradeFormOpen}>
        <DialogContent className="bg-dark-400 border border-dark-100 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Unit Upgrade</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Upgrade Name</label>
              <Input 
                value={upgradeForm.name} 
                onChange={e => setUpgradeForm(prev => ({ ...prev, name: e.target.value }))}
                className="bg-dark-300 border-dark-200"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Point Cost</label>
              <Input 
                type="number"
                min="1"
                value={upgradeForm.pointCost} 
                onChange={e => setUpgradeForm(prev => ({ ...prev, pointCost: parseInt(e.target.value) || 0 }))}
                className="bg-dark-300 border-dark-200"
              />
            </div>
            
            <h3 className="text-md font-semibold">Stat Modifiers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Movement (e.g. +1" or 8")</label>
                <Input 
                  value={upgradeForm.statModifiers.movement} 
                  onChange={e => setUpgradeForm(prev => ({ 
                    ...prev, 
                    statModifiers: { ...prev.statModifiers, movement: e.target.value }
                  }))}
                  className="bg-dark-300 border-dark-200"
                  placeholder="Leave empty for no change"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Armor (e.g. +1 or 3+)</label>
                <Input 
                  value={upgradeForm.statModifiers.armor} 
                  onChange={e => setUpgradeForm(prev => ({ 
                    ...prev, 
                    statModifiers: { ...prev.statModifiers, armor: e.target.value }
                  }))}
                  className="bg-dark-300 border-dark-200"
                  placeholder="Leave empty for no change"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Attack (e.g. +1)</label>
                <Input 
                  type="number"
                  value={upgradeForm.statModifiers.attack || ''} 
                  onChange={e => setUpgradeForm(prev => ({ 
                    ...prev, 
                    statModifiers: { ...prev.statModifiers, attack: e.target.value ? parseInt(e.target.value) : 0 }
                  }))}
                  className="bg-dark-300 border-dark-200"
                  placeholder="0 for no change"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Range (e.g. +6" or 24")</label>
                <Input 
                  value={upgradeForm.statModifiers.range} 
                  onChange={e => setUpgradeForm(prev => ({ 
                    ...prev, 
                    statModifiers: { ...prev.statModifiers, range: e.target.value }
                  }))}
                  className="bg-dark-300 border-dark-200"
                  placeholder="Leave empty for no change"
                />
              </div>
              
              <div className="col-span-2">
                <label className="text-sm font-medium mb-1 block">Special Rules</label>
                <Input 
                  value={upgradeForm.statModifiers.special || ''} 
                  onChange={e => setUpgradeForm(prev => ({ 
                    ...prev, 
                    statModifiers: { ...prev.statModifiers, special: e.target.value }
                  }))}
                  className="bg-dark-300 border-dark-200"
                  placeholder="E.g. Charge, Fear, Leader"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeFormOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUpgrade}>Add Upgrade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-dark-400 border border-dark-100 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Unit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedUnit?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-dark-300 hover:bg-dark-200 border-dark-100">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUnit} className="bg-danger hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
  
  // Helper function to display the list of units
  function displayUnitsList(units: Unit[]) {
    if (units.length === 0) {
      return (
        <div className="text-center py-6 text-gray-400">
          No units found
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map(unit => {
          // Check if it's a custom unit or default unit
          const isCustomUnit = storedUnits.some(customUnit => customUnit.id === unit.id);
          
          return (
            <div 
              key={unit.id} 
              className={`bg-dark-400 rounded-lg p-4 border ${isCustomUnit ? 'border-primary/30' : 'border-dark-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{unit.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-dark-500 text-xs text-accent">
                      {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}
                    </span>
                    <span className="text-sm font-medium">{unit.pointCost} pts</span>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button 
                    className="p-1 rounded hover:bg-dark-300 text-primary"
                    onClick={() => handleEditUnit(unit)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {isCustomUnit && (
                    <button 
                      className="p-1 rounded hover:bg-dark-300 text-danger"
                      onClick={() => handleDeleteUnit(unit)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2 text-xs text-gray-300 mt-2">
                <div className="bg-dark-300 rounded p-1.5 text-center">
                  <div className="text-gray-400 mb-1">Movement</div>
                  <div className="text-white font-semibold">{unit.stats.movement}</div>
                </div>
                <div className="bg-dark-300 rounded p-1.5 text-center">
                  <div className="text-gray-400 mb-1">Armor</div>
                  <div className="text-white font-semibold">{unit.stats.armor}</div>
                </div>
                <div className="bg-dark-300 rounded p-1.5 text-center">
                  <div className="text-gray-400 mb-1">Attack</div>
                  <div className="text-white font-semibold">{unit.stats.attack}</div>
                </div>
                <div className="bg-dark-300 rounded p-1.5 text-center">
                  <div className="text-gray-400 mb-1">Range</div>
                  <div className="text-white font-semibold">{unit.stats.range}</div>
                </div>
                <div className="bg-dark-300 rounded p-1.5 text-center">
                  <div className="text-gray-400 mb-1">Special</div>
                  <div className="text-white font-semibold">
                    {unit.stats.special || "-"}
                  </div>
                </div>
              </div>
              
              {unit.upgrades.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-gray-300 mb-1">Upgrades</h4>
                  <div className="text-xs text-gray-400">
                    {unit.upgrades.map((upgrade, index) => (
                      <div key={upgrade.id} className="flex justify-between py-1 border-t border-dark-300">
                        <span>{upgrade.name}</span>
                        <span>{upgrade.pointCost} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {isCustomUnit && (
                <div className="mt-2 pt-2 border-t border-dark-300 text-xs text-primary/70">
                  Custom Unit
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}