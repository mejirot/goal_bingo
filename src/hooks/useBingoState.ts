import { useState, useCallback, useMemo } from 'react';
import type { AppMode, AppState } from '../types/bingo';
import { createInitialState } from '../types/bingo';
import {
  isBingo,
  getCompletedLineCount,
  getCompletedCellCount,
  getCompletedLinesCells,
} from '../utils/bingoLogic';

export interface UseBingoStateReturn {
  state: AppState;
  actions: {
    setGoal: (index: number, text: string) => void;
    setGoals: (goals: string[]) => void;
    toggleComplete: (index: number) => void;
    setMode: (mode: AppMode) => void;
    reset: () => void;
    loadState: (state: AppState) => void;
  };
  computed: {
    isBingo: boolean;
    completedLineCount: number;
    completedCellCount: number;
    highlightedCells: number[];
    canStartPlay: boolean;
  };
}

export function useBingoState(initialState?: AppState): UseBingoStateReturn {
  const [state, setState] = useState<AppState>(
    initialState ?? createInitialState()
  );

  const setGoal = useCallback((index: number, text: string) => {
    setState((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        goals: prev.card.goals.map((g, i) => (i === index ? text : g)),
      },
    }));
  }, []);

  const setGoals = useCallback((goals: string[]) => {
    setState((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        goals,
      },
    }));
  }, []);

  const toggleComplete = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      card: {
        ...prev.card,
        completed: prev.card.completed.map((c, i) => (i === index ? !c : c)),
      },
    }));
  }, []);

  const setMode = useCallback((mode: AppMode) => {
    setState((prev) => ({
      ...prev,
      mode,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(createInitialState());
  }, []);

  const loadState = useCallback((newState: AppState) => {
    setState(newState);
  }, []);

  const computed = useMemo(
    () => ({
      isBingo: isBingo(state.card.completed),
      completedLineCount: getCompletedLineCount(state.card.completed),
      completedCellCount: getCompletedCellCount(state.card.completed),
      highlightedCells: getCompletedLinesCells(state.card.completed),
      canStartPlay: state.card.goals.every((g) => g.trim() !== ''),
    }),
    [state.card.completed, state.card.goals]
  );

  return {
    state,
    actions: {
      setGoal,
      setGoals,
      toggleComplete,
      setMode,
      reset,
      loadState,
    },
    computed,
  };
}
