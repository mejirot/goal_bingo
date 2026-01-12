import { describe, it, expect } from 'vitest';
import {
  BINGO_LINES,
  isLineCompleted,
  getCompletedLines,
  getCompletedLinesCells,
  isBingo,
  getCompletedLineCount,
  getCompletedCellCount,
  positionToIndex,
  indexToPosition,
} from './bingoLogic';

describe('bingoLogic', () => {
  describe('BINGO_LINES', () => {
    it('12本のラインが定義されている', () => {
      expect(BINGO_LINES).toHaveLength(12);
    });

    it('各ラインは5マスで構成されている', () => {
      BINGO_LINES.forEach((line) => {
        expect(line).toHaveLength(5);
      });
    });

    it('すべてのインデックスは0-24の範囲内', () => {
      BINGO_LINES.forEach((line) => {
        line.forEach((index) => {
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThanOrEqual(24);
        });
      });
    });
  });

  describe('isLineCompleted', () => {
    it('すべてのマスが達成されていたらtrue', () => {
      const completed = Array(25).fill(false);
      completed[0] = true;
      completed[1] = true;
      completed[2] = true;
      completed[3] = true;
      completed[4] = true;

      expect(isLineCompleted(BINGO_LINES[0], completed)).toBe(true);
    });

    it('1マスでも未達成ならfalse', () => {
      const completed = Array(25).fill(false);
      completed[0] = true;
      completed[1] = true;
      completed[2] = true;
      completed[3] = true;
      // completed[4] は false

      expect(isLineCompleted(BINGO_LINES[0], completed)).toBe(false);
    });
  });

  describe('isBingo', () => {
    it('横1列が完成したらビンゴ', () => {
      const completed = Array(25).fill(false);
      // 1行目を完成
      [0, 1, 2, 3, 4].forEach((i) => (completed[i] = true));
      expect(isBingo(completed)).toBe(true);
    });

    it('縦1列が完成したらビンゴ', () => {
      const completed = Array(25).fill(false);
      // 1列目を完成
      [0, 5, 10, 15, 20].forEach((i) => (completed[i] = true));
      expect(isBingo(completed)).toBe(true);
    });

    it('斜め（左上から右下）が完成したらビンゴ', () => {
      const completed = Array(25).fill(false);
      [0, 6, 12, 18, 24].forEach((i) => (completed[i] = true));
      expect(isBingo(completed)).toBe(true);
    });

    it('斜め（右上から左下）が完成したらビンゴ', () => {
      const completed = Array(25).fill(false);
      [4, 8, 12, 16, 20].forEach((i) => (completed[i] = true));
      expect(isBingo(completed)).toBe(true);
    });

    it('ラインが完成していなければビンゴではない', () => {
      const completed = Array(25).fill(false);
      // バラバラに4つだけ達成
      completed[0] = true;
      completed[6] = true;
      completed[12] = true;
      completed[18] = true;
      expect(isBingo(completed)).toBe(false);
    });

    it('全マス未達成はビンゴではない', () => {
      const completed = Array(25).fill(false);
      expect(isBingo(completed)).toBe(false);
    });

    it('全マス達成はビンゴ', () => {
      const completed = Array(25).fill(true);
      expect(isBingo(completed)).toBe(true);
    });
  });

  describe('getCompletedLines', () => {
    it('完成したラインのインデックスを返す', () => {
      const completed = Array(25).fill(false);
      // 1行目を完成（index 0）
      [0, 1, 2, 3, 4].forEach((i) => (completed[i] = true));
      expect(getCompletedLines(completed)).toContain(0);
    });

    it('複数ラインが完成している場合', () => {
      const completed = Array(25).fill(false);
      // 1行目（index 0）と1列目（index 5）を完成
      [0, 1, 2, 3, 4].forEach((i) => (completed[i] = true));
      [5, 10, 15, 20].forEach((i) => (completed[i] = true)); // 0は既に達成済み

      const completedLines = getCompletedLines(completed);
      expect(completedLines).toContain(0); // 1行目
      expect(completedLines).toContain(5); // 1列目
    });
  });

  describe('getCompletedLinesCells', () => {
    it('完成したラインを構成するマスのインデックスを返す', () => {
      const completed = Array(25).fill(false);
      [0, 1, 2, 3, 4].forEach((i) => (completed[i] = true));

      const cells = getCompletedLinesCells(completed);
      expect(cells).toContain(0);
      expect(cells).toContain(1);
      expect(cells).toContain(2);
      expect(cells).toContain(3);
      expect(cells).toContain(4);
    });
  });

  describe('getCompletedLineCount', () => {
    it('完成したライン数を返す', () => {
      const completed = Array(25).fill(false);
      expect(getCompletedLineCount(completed)).toBe(0);

      // 1行目を完成
      [0, 1, 2, 3, 4].forEach((i) => (completed[i] = true));
      expect(getCompletedLineCount(completed)).toBe(1);
    });

    it('全マス達成で12ライン完成', () => {
      const completed = Array(25).fill(true);
      expect(getCompletedLineCount(completed)).toBe(12);
    });
  });

  describe('getCompletedCellCount', () => {
    it('達成したマス数を返す', () => {
      const completed = Array(25).fill(false);
      expect(getCompletedCellCount(completed)).toBe(0);

      completed[0] = true;
      completed[5] = true;
      completed[10] = true;
      expect(getCompletedCellCount(completed)).toBe(3);
    });
  });

  describe('positionToIndex', () => {
    it('行と列からインデックスを計算', () => {
      expect(positionToIndex(0, 0)).toBe(0);
      expect(positionToIndex(0, 4)).toBe(4);
      expect(positionToIndex(2, 2)).toBe(12); // 中央
      expect(positionToIndex(4, 4)).toBe(24);
    });
  });

  describe('indexToPosition', () => {
    it('インデックスから行と列を計算', () => {
      expect(indexToPosition(0)).toEqual({ row: 0, col: 0 });
      expect(indexToPosition(4)).toEqual({ row: 0, col: 4 });
      expect(indexToPosition(12)).toEqual({ row: 2, col: 2 }); // 中央
      expect(indexToPosition(24)).toEqual({ row: 4, col: 4 });
    });
  });
});
