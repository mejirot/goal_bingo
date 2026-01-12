import { useEffect, useCallback } from 'react';
import type { AppState } from '../types/bingo';
import { createInitialState } from '../types/bingo';

const STORAGE_KEY = 'goal-bingo-state';
const STORAGE_VERSION = 1;

interface StoredData {
  version: number;
  state: AppState;
}

/**
 * localStorageから状態を読み込む
 */
export function loadFromStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data: StoredData = JSON.parse(raw);

    // バージョンチェック（将来の互換性のため）
    if (data.version !== STORAGE_VERSION) {
      return null;
    }

    // 基本的なバリデーション
    if (
      !data.state ||
      !data.state.card ||
      !Array.isArray(data.state.card.goals) ||
      data.state.card.goals.length !== 25 ||
      !Array.isArray(data.state.card.completed) ||
      data.state.card.completed.length !== 25
    ) {
      return null;
    }

    return data.state;
  } catch {
    return null;
  }
}

/**
 * localStorageに状態を保存する
 */
export function saveToStorage(state: AppState): void {
  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      state,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 保存に失敗してもアプリは継続
    console.warn('Failed to save to localStorage');
  }
}

/**
 * localStorageから状態をクリアする
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // クリアに失敗してもアプリは継続
  }
}

/**
 * 初期状態を取得する（localStorageから復元、なければ新規作成）
 */
export function getInitialState(): AppState {
  return loadFromStorage() ?? createInitialState();
}

/**
 * 状態の自動保存フック
 */
export function useAutoSave(state: AppState): void {
  useEffect(() => {
    saveToStorage(state);
  }, [state]);
}

/**
 * localStorage操作用のフック
 */
export function useLocalStorage() {
  const save = useCallback((state: AppState) => {
    saveToStorage(state);
  }, []);

  const load = useCallback(() => {
    return loadFromStorage();
  }, []);

  const clear = useCallback(() => {
    clearStorage();
  }, []);

  return { save, load, clear };
}
