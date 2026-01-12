import { describe, it, expect } from 'vitest';
import { encodeCard, decodeCard } from './shareUtils';
import type { BingoCard } from '../types/bingo';

describe('shareUtils', () => {
  const testCard: BingoCard = {
    goals: Array(25)
      .fill('')
      .map((_, i) => `目標${i + 1}`),
    completed: Array(25)
      .fill(false)
      .map((_, i) => i < 5),
  };

  describe('encodeCard / decodeCard', () => {
    it('エンコードとデコードで元のデータに戻る', () => {
      const encoded = encodeCard(testCard);
      const decoded = decodeCard(encoded);

      expect(decoded).toEqual(testCard);
    });

    it('空の目標でも正しく動作する', () => {
      const emptyCard: BingoCard = {
        goals: Array(25).fill(''),
        completed: Array(25).fill(false),
      };

      const encoded = encodeCard(emptyCard);
      const decoded = decodeCard(encoded);

      expect(decoded).toEqual(emptyCard);
    });

    it('全て達成済みでも正しく動作する', () => {
      const allCompletedCard: BingoCard = {
        goals: testCard.goals,
        completed: Array(25).fill(true),
      };

      const encoded = encodeCard(allCompletedCard);
      const decoded = decodeCard(encoded);

      expect(decoded).toEqual(allCompletedCard);
    });

    it('日本語を含む目標も正しくエンコード/デコードされる', () => {
      const japaneseCard: BingoCard = {
        goals: Array(25)
          .fill('')
          .map((_, i) => `今年の目標${i + 1}を達成する`),
        completed: Array(25).fill(false),
      };

      const encoded = encodeCard(japaneseCard);
      const decoded = decodeCard(encoded);

      expect(decoded).toEqual(japaneseCard);
    });

    it('長い目標テキストも正しく処理される', () => {
      const longTextCard: BingoCard = {
        goals: Array(25)
          .fill('')
          .map((_, i) => `これは非常に長い目標テキストです。目標番号${i + 1}。`),
        completed: Array(25).fill(false),
      };

      const encoded = encodeCard(longTextCard);
      const decoded = decodeCard(encoded);

      expect(decoded).toEqual(longTextCard);
    });
  });

  describe('decodeCard エラーケース', () => {
    it('不正な文字列の場合はnullを返す', () => {
      const result = decodeCard('invalid-data');
      expect(result).toBeNull();
    });

    it('空文字の場合はnullを返す', () => {
      const result = decodeCard('');
      expect(result).toBeNull();
    });

    it('不正なJSONの場合はnullを返す', () => {
      // 有効なBase64だが不正なgzipデータ
      const result = decodeCard('YWJj');
      expect(result).toBeNull();
    });
  });

  describe('encodeCard 出力形式', () => {
    it('URLセーフな文字のみを含む', () => {
      const encoded = encodeCard(testCard);

      // URLセーフ文字: A-Z, a-z, 0-9, -, _
      expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('パディング（=）を含まない', () => {
      const encoded = encodeCard(testCard);
      expect(encoded).not.toContain('=');
    });
  });
});
