import React, { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { 
  ArmyState, 
  NationCode, 
  DivisionType, 
  VeterancyLevel, 
  EngagementStance,
  SquadUnit,
  AssetTeam,
  VehicleUnit,
  UpgradeOption,
  SpecialForcesModel,
  ValidationResult,
  DivisionConstraints
} from '../../../shared/types';
import { getRosterTotalCost } from '../lib/pointsEngine';
import { validateArmySetup, validateRoster, getDivisionConstraints } from '../lib/validationEngine';

type Action = 
  | { type: 'SET_NATION'; payload: NationCode }
  | { type: 'SET_DIVISION'; payload: DivisionType }
  | { type: 'SET_VETERANCY'; payload: VeterancyLevel }
  | { type: 'SET_STANCE'; payload: EngagementStance }
  | { type: 'SET_POINT_LIMIT'; payload: number | null }
  | { type: 'ADD_SQUAD_SLOT' }
  | { type: 'REMOVE_SQUAD_SLOT'; payload: number }
  | { type: 'SET_SLOT_VETERANCY'; payload: { slotIndex: number, veterancy: VeterancyLevel | null } }
  | { type: 'SET_SLOT_BASE_UNIT'; payload: { slotIndex: number, unit: SquadUnit | null } }
  | { type: 'SET_SLOT_ASSET'; payload: { slotIndex: number, asset: AssetTeam | null } }
  | { type: 'SET_SLOT_VEHICLE'; payload: { slotIndex: number, vehicle: VehicleUnit | null } }
  | { type: 'SET_SLOT_UPGRADE'; payload: { slotIndex: number, upgrade: UpgradeOption | null } }
  | { type: 'SET_BGC'; payload: { name: string, cost: number } }
  | { type: 'ADD_DEFENCE'; payload: string }
  | { type: 'REMOVE_DEFENCE'; payload: string }
  | { type: 'SET_DEFENCE_QTY'; payload: { id: string, qty: number } }
  | { type: 'ADD_SF_SLOT' }
  | { type: 'REMOVE_SF_SLOT'; payload: number }
  | { type: 'ADD_SF_MODEL'; payload: { slotIndex: number, model: SpecialForcesModel } }
  | { type: 'REMOVE_SF_MODEL'; payload: { slotIndex: number, modelIndex: number } }
  | { type: 'CLEAR_ARMY' }
  | { type: 'LOAD_ARMY'; payload: ArmyState };

const defaultState: ArmyState = {
  setup: {
    nation: null,
    division: null,
    globalVeterancy: null,
    engagementStance: null,
    pointLimit: null,
  },
  roster: {
    commander: null,
    squadSlots: [],
    defences: [],
    specialForces: [],
  },
  totalPoints: 0,
};

function armyReducer(state: ArmyState, action: Action): ArmyState {
  switch (action.type) {
    case 'SET_NATION':
      return { ...state, setup: { ...state.setup, nation: action.payload, division: null } }; // Reset division on nation change
    case 'SET_DIVISION':
      return { ...state, setup: { ...state.setup, division: action.payload } };
    case 'SET_VETERANCY':
      return { ...state, setup: { ...state.setup, globalVeterancy: action.payload } };
    case 'SET_STANCE':
      return { ...state, setup: { ...state.setup, engagementStance: action.payload } };
    case 'SET_POINT_LIMIT':
      return { ...state, setup: { ...state.setup, pointLimit: action.payload } };
    
    case 'ADD_SQUAD_SLOT':
      return {
        ...state,
        roster: {
          ...state.roster,
          squadSlots: [
            ...state.roster.squadSlots,
            { slotIndex: state.roster.squadSlots.length, baseUnit: null, attachments: { upgrade: null, assetTeam: null, vehicle: null } }
          ]
        }
      };
    case 'REMOVE_SQUAD_SLOT':
      return {
        ...state,
        roster: {
          ...state.roster,
          squadSlots: state.roster.squadSlots.filter((_, i) => i !== action.payload).map((slot, i) => ({ ...slot, slotIndex: i }))
        }
      };
    case 'SET_SLOT_VETERANCY':
      return {
        ...state,
        roster: {
          ...state.roster,
          squadSlots: state.roster.squadSlots.map((slot, i) => i === action.payload.slotIndex ? { ...slot, customVeterancy: action.payload.veterancy || undefined } : slot)
        }
      };
      
    case 'SET_SLOT_BASE_UNIT':
      return {
        ...state,
        roster: {
          ...state.roster,
          squadSlots: state.roster.squadSlots.map((slot, i) => i === action.payload.slotIndex ? { ...slot, baseUnit: action.payload.unit, attachments: { upgrade: null, assetTeam: null, vehicle: null } } : slot)
        }
      };
    case 'SET_SLOT_ASSET':
      return {
        ...state,
        roster: {
          ...state.roster,
          squadSlots: state.roster.squadSlots.map((slot, i) => i === action.payload.slotIndex ? { ...slot, attachments: { ...slot.attachments, assetTeam: action.payload.asset } } : slot)
        }
      };
    case 'SET_SLOT_VEHICLE':
      return {
        ...state,
        roster: {
          ...state.roster,
          squadSlots: state.roster.squadSlots.map((slot, i) => i === action.payload.slotIndex ? { ...slot, attachments: { ...slot.attachments, vehicle: action.payload.vehicle } } : slot)
        }
      };
    case 'SET_SLOT_UPGRADE':
      return {
        ...state,
        roster: {
          ...state.roster,
          squadSlots: state.roster.squadSlots.map((slot, i) => i === action.payload.slotIndex ? { ...slot, attachments: { ...slot.attachments, upgrade: action.payload.upgrade } } : slot)
        }
      };
    
    case 'SET_BGC':
      return { ...state, roster: { ...state.roster, commander: { name: action.payload.name, pointsCost: action.payload.cost } } };
      
    case 'ADD_DEFENCE':
      if (state.roster.defences.some(d => d.defenceId === action.payload)) return state;
      return {
        ...state,
        roster: { ...state.roster, defences: [...state.roster.defences, { defenceId: action.payload, quantity: 1 }] }
      };
    case 'REMOVE_DEFENCE':
      return {
        ...state,
        roster: { ...state.roster, defences: state.roster.defences.filter(d => d.defenceId !== action.payload) }
      };
    case 'SET_DEFENCE_QTY':
      return {
        ...state,
        roster: {
          ...state.roster,
          defences: state.roster.defences.map(d => d.defenceId === action.payload.id ? { ...d, quantity: action.payload.qty } : d)
        }
      };

    case 'ADD_SF_SLOT':
      return {
        ...state,
        roster: {
          ...state.roster,
          specialForces: [
            ...state.roster.specialForces,
            { slotIndex: state.roster.specialForces.length, models: [] }
          ]
        }
      };
    case 'REMOVE_SF_SLOT':
      return {
        ...state,
        roster: {
          ...state.roster,
          specialForces: state.roster.specialForces.filter((_, i) => i !== action.payload).map((slot, i) => ({ ...slot, slotIndex: i }))
        }
      };
    case 'ADD_SF_MODEL':
      return {
        ...state,
        roster: {
          ...state.roster,
          specialForces: state.roster.specialForces.map((slot, i) => i === action.payload.slotIndex ? { ...slot, models: [...slot.models, action.payload.model] } : slot)
        }
      };
    case 'REMOVE_SF_MODEL':
      return {
        ...state,
        roster: {
          ...state.roster,
          specialForces: state.roster.specialForces.map((slot, i) => i === action.payload.slotIndex ? { ...slot, models: slot.models.filter((_, mi) => mi !== action.payload.modelIndex) } : slot)
        }
      };

    case 'CLEAR_ARMY':
      return defaultState;
    case 'LOAD_ARMY':
      return action.payload;

    default:
      return state;
  }
}

export interface ArmyContextType {
  state: ArmyState;
  dispatch: React.Dispatch<Action>;
  totalPoints: number;
  validationErrors: ValidationResult[];
  divisionConstraints: DivisionConstraints | null;
  savedArmies: { id: string, name: string, state: ArmyState }[];
  saveArmy: (name: string) => void;
  loadArmy: (id: string) => void;
  deleteArmy: (id: string) => void;
}

const ArmyContext = createContext<ArmyContextType | undefined>(undefined);

export function ArmyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(armyReducer, defaultState);
  const [savedArmies, setSavedArmies] = useState<{ id: string, name: string, state: ArmyState }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ft1942_saved_armies');
    if (saved) {
      try {
        setSavedArmies(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved armies", e);
      }
    }
  }, []);

  const totalPoints = useMemo(() => {
    if (state.setup.globalVeterancy) {
      return getRosterTotalCost(state.roster, state.setup.globalVeterancy);
    }
    return 0;
  }, [state.roster, state.setup.globalVeterancy]);

  const divisionConstraints = useMemo(() => {
    return getDivisionConstraints(state.setup.nation, state.setup.division);
  }, [state.setup.nation, state.setup.division]);

  const validationErrors = useMemo(() => {
    const setupErrors = validateArmySetup(state.setup);
    const rosterErrors = validateRoster(state.roster, state.setup, divisionConstraints, totalPoints);
    return [...setupErrors, ...rosterErrors];
  }, [state.setup, state.roster, divisionConstraints]);

  const saveArmy = (name: string) => {
    const newSaved = [...savedArmies, { id: crypto.randomUUID(), name, state }];
    setSavedArmies(newSaved);
    localStorage.setItem('ft1942_saved_armies', JSON.stringify(newSaved));
  };

  const loadArmy = (id: string) => {
    const army = savedArmies.find(a => a.id === id);
    if (army) {
      dispatch({ type: 'LOAD_ARMY', payload: army.state });
    }
  };

  const deleteArmy = (id: string) => {
    const newSaved = savedArmies.filter(a => a.id !== id);
    setSavedArmies(newSaved);
    localStorage.setItem('ft1942_saved_armies', JSON.stringify(newSaved));
  };

  return (
    <ArmyContext.Provider value={{
      state,
      dispatch,
      totalPoints,
      validationErrors,
      divisionConstraints,
      savedArmies,
      saveArmy,
      loadArmy,
      deleteArmy
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
