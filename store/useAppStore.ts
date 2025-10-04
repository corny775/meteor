import { create } from 'zustand';
import { NASAAsteroid, ImpactResults, ImpactParameters, DashboardState, DeflectionStrategy } from '@/types';

interface AppStore extends DashboardState {
  // Actions
  setSelectedAsteroid: (asteroid: NASAAsteroid | null) => void;
  setSimulationResults: (results: ImpactResults | null) => void;
  setActiveView: (view: DashboardState['activeView']) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  toggleOverlay: (overlay: keyof DashboardState['showEnvironmentalOverlays']) => void;
  
  // Additional state
  asteroidList: NASAAsteroid[];
  setAsteroidList: (asteroids: NASAAsteroid[]) => void;
  
  impactParameters: ImpactParameters;
  setImpactParameters: (params: Partial<ImpactParameters>) => void;
  
  selectedDeflectionStrategy: DeflectionStrategy | null;
  setSelectedDeflectionStrategy: (strategy: DeflectionStrategy | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  selectedAsteroid: null,
  simulationResults: null,
  activeView: 'dashboard',
  isSimulating: false,
  showEnvironmentalOverlays: {
    seismic: true,
    tsunami: true,
    population: true,
  },
  asteroidList: [],
  impactParameters: {
    size: 500,
    density: 3000,
    velocity: 20,
    angle: 45,
    impactLocation: {
      lat: 40.7128,
      lng: -74.006,
    },
    isWaterImpact: false,
  },
  selectedDeflectionStrategy: null,

  // Actions
  setSelectedAsteroid: (asteroid) => set({ selectedAsteroid: asteroid }),
  setSimulationResults: (results) => set({ simulationResults: results }),
  setActiveView: (view) => set({ activeView: view }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  toggleOverlay: (overlay) =>
    set((state) => ({
      showEnvironmentalOverlays: {
        ...state.showEnvironmentalOverlays,
        [overlay]: !state.showEnvironmentalOverlays[overlay],
      },
    })),
  setAsteroidList: (asteroids) => set({ asteroidList: asteroids }),
  setImpactParameters: (params) =>
    set((state) => ({
      impactParameters: { ...state.impactParameters, ...params },
    })),
  setSelectedDeflectionStrategy: (strategy) => set({ selectedDeflectionStrategy: strategy }),
}));
