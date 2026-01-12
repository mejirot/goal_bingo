import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadFromStorage,
  saveToStorage,
  clearStorage,
  getInitialState,
} from './useLocalStorage';
import type { AppState } from '../types/bingo';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const validState: AppState = {
    card: {
      goals: Array(25).fill('テスト目標'),
      completed: Array(25).fill(false),
    },
    mode: 'input',
  };

  describe('saveToStorage / loadFromStorage', () => {
    it('状態を保存して読み込める', () => {
      saveToStorage(validState);
      const loaded = loadFromStorage();
      expect(loaded).toEqual(validState);
    });

    it('completed状態も正しく保存される', () => {
      const stateWithCompleted: AppState = {
        ...validState,
        card: {
          ...validState.card,
          completed: validState.card.completed.map((_, i) => i < 5),
        },
        mode: 'play',
      };
      saveToStorage(stateWithCompleted);
      const loaded = loadFromStorage();
      expect(loaded?.card.completed.filter(Boolean).length).toBe(5);
      expect(loaded?.mode).toBe('play');
    });
  });

  describe('loadFromStorage', () => {
    it('データがない場合はnullを返す', () => {
      const result = loadFromStorage();
      expect(result).toBeNull();
    });

    it('不正なJSONの場合はnullを返す', () => {
      localStorage.setItem('goal-bingo-state', 'invalid json');
      const result = loadFromStorage();
      expect(result).toBeNull();
    });

    it('バージョンが異なる場合はnullを返す', () => {
      localStorage.setItem(
        'goal-bingo-state',
        JSON.stringify({ version: 999, state: validState })
      );
      const result = loadFromStorage();
      expect(result).toBeNull();
    });

    it('goals配列の長さが25でない場合はnullを返す', () => {
      const invalidState = {
        ...validState,
        card: { ...validState.card, goals: ['短い配列'] },
      };
      localStorage.setItem(
        'goal-bingo-state',
        JSON.stringify({ version: 1, state: invalidState })
      );
      const result = loadFromStorage();
      expect(result).toBeNull();
    });

    it('completed配列の長さが25でない場合はnullを返す', () => {
      const invalidState = {
        ...validState,
        card: { ...validState.card, completed: [true] },
      };
      localStorage.setItem(
        'goal-bingo-state',
        JSON.stringify({ version: 1, state: invalidState })
      );
      const result = loadFromStorage();
      expect(result).toBeNull();
    });
  });

  describe('clearStorage', () => {
    it('保存したデータをクリアできる', () => {
      saveToStorage(validState);
      expect(loadFromStorage()).not.toBeNull();
      clearStorage();
      expect(loadFromStorage()).toBeNull();
    });
  });

  describe('getInitialState', () => {
    it('保存データがある場合はそれを返す', () => {
      saveToStorage(validState);
      const result = getInitialState();
      expect(result).toEqual(validState);
    });

    it('保存データがない場合は初期状態を返す', () => {
      const result = getInitialState();
      expect(result.card.goals).toHaveLength(25);
      expect(result.card.goals.every((g) => g === '')).toBe(true);
      expect(result.card.completed).toHaveLength(25);
      expect(result.card.completed.every((c) => c === false)).toBe(true);
      expect(result.mode).toBe('input');
    });
  });
});
