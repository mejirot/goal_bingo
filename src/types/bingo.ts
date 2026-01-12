/** マスのインデックス（0-24） */
export type CellIndex = number;

/** ビンゴカードの状態 */
export interface BingoCard {
  /** 各マスの目標テキスト（25要素） */
  goals: string[];
  /** 各マスの達成状態（25要素） */
  completed: boolean[];
}

/** アプリのモード */
export type AppMode = 'input' | 'play';

/** アプリ全体の状態 */
export interface AppState {
  card: BingoCard;
  mode: AppMode;
}

/** ビンゴラインの定義（インデックスの配列） */
export type BingoLine = CellIndex[];

/** 共有用エンコードデータ */
export interface ShareData {
  g: string[];    // goals
  c: boolean[];   // completed
  v: number;      // version
}

/** 空のビンゴカードを作成 */
export function createEmptyCard(): BingoCard {
  return {
    goals: Array(25).fill(''),
    completed: Array(25).fill(false),
  };
}

/** 初期状態を作成 */
export function createInitialState(): AppState {
  return {
    card: createEmptyCard(),
    mode: 'input',
  };
}
