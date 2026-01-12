import type { BingoLine, CellIndex } from '../types/bingo';

/**
 * ビンゴの全ライン定義（12ライン）
 * - 横5本
 * - 縦5本
 * - 斜め2本
 */
export const BINGO_LINES: BingoLine[] = [
  // 横5本
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // 縦5本
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // 斜め2本
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

/**
 * 指定されたラインが完成しているか判定
 */
export function isLineCompleted(
  line: BingoLine,
  completed: boolean[]
): boolean {
  return line.every((index) => completed[index]);
}

/**
 * 完成したラインのインデックス配列を取得
 */
export function getCompletedLines(completed: boolean[]): number[] {
  return BINGO_LINES.map((line, index) => ({
    index,
    isCompleted: isLineCompleted(line, completed),
  }))
    .filter((item) => item.isCompleted)
    .map((item) => item.index);
}

/**
 * 完成したラインを構成するマスのインデックスを取得
 */
export function getCompletedLinesCells(completed: boolean[]): CellIndex[] {
  const completedLineIndexes = getCompletedLines(completed);
  const cells = new Set<CellIndex>();

  completedLineIndexes.forEach((lineIndex) => {
    BINGO_LINES[lineIndex].forEach((cellIndex) => {
      cells.add(cellIndex);
    });
  });

  return Array.from(cells);
}

/**
 * ビンゴが成立しているか判定（1ライン以上完成）
 */
export function isBingo(completed: boolean[]): boolean {
  return BINGO_LINES.some((line) => isLineCompleted(line, completed));
}

/**
 * 完成したライン数を取得
 */
export function getCompletedLineCount(completed: boolean[]): number {
  return getCompletedLines(completed).length;
}

/**
 * 達成したマス数を取得
 */
export function getCompletedCellCount(completed: boolean[]): number {
  return completed.filter(Boolean).length;
}

/**
 * 行と列からインデックスを計算
 */
export function positionToIndex(row: number, col: number): CellIndex {
  return row * 5 + col;
}

/**
 * インデックスから行と列を計算
 */
export function indexToPosition(index: CellIndex): { row: number; col: number } {
  return {
    row: Math.floor(index / 5),
    col: index % 5,
  };
}
