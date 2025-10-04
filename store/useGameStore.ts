import { create } from 'zustand';
import { GameState, SimulationScenario } from '@/types';

interface GameStore extends GameState {
  // Actions
  startGame: (scenario: SimulationScenario) => void;
  updateTime: (time: number) => void;
  setInterventionTime: (time: number) => void;
  calculateScore: () => void;
  endGame: (outcome: GameState['outcome']) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  scenario: null as any,
  timeRemaining: 0,
  score: 0,
  interventionTime: null,
  damageAvoided: 0,
  isComplete: false,
  outcome: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: (scenario) =>
    set({
      scenario,
      timeRemaining: scenario.daysUntilImpact * 24 * 60 * 60,
      score: 0,
      interventionTime: null,
      damageAvoided: 0,
      isComplete: false,
      outcome: null,
    }),

  updateTime: (time) => {
    const state = get();
    const newTime = state.timeRemaining - time;
    
    if (newTime <= 0 && !state.isComplete) {
      get().endGame('failure');
    } else {
      set({ timeRemaining: Math.max(0, newTime) });
    }
  },

  setInterventionTime: (time) => set({ interventionTime: time }),

  calculateScore: () => {
    const state = get();
    if (!state.interventionTime) return;

    const timeBonus = (state.interventionTime / (state.scenario.daysUntilImpact * 24 * 60 * 60)) * 1000;
    const successBonus = state.scenario.successRate * 5000;
    const damageBonus = state.damageAvoided * 100;

    const totalScore = Math.round(timeBonus + successBonus + damageBonus);
    set({ score: totalScore });
  },

  endGame: (outcome) => {
    get().calculateScore();
    set({ isComplete: true, outcome });
  },

  resetGame: () => set(initialState),
}));
