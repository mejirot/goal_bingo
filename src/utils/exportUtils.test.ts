import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { goalsToMarkdown, parseMarkdownToGoals } from './exportUtils';

describe('exportUtils', () => {
  describe('goalsToMarkdown', () => {
    beforeEach(() => {
      // 固定の日時を使用
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-18T12:34:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('全25個の目標を含むMarkdownを生成する', () => {
      const goals = Array.from({ length: 25 }, (_, i) => `目標${i + 1}`);
      const result = goalsToMarkdown(goals);

      expect(result).toContain('# 目標ビンゴ');
      expect(result).toContain('作成日時: 2026-01-18 12:34');
      expect(result).toContain('入力済み: 25/25');
      expect(result).toContain('| 目標1 | 目標2 | 目標3 | 目標4 | 目標5 |');
      expect(result).toContain('1. 目標1');
      expect(result).toContain('25. 目標25');
    });

    it('空の目標は(未入力)と表示される', () => {
      const goals = Array(25).fill('');
      const result = goalsToMarkdown(goals);

      expect(result).toContain('入力済み: 0/25');
      expect(result).toContain('(未入力)');
    });

    it('一部入力済みの状態を正しく処理する', () => {
      const goals = Array(25).fill('');
      goals[0] = '最初の目標';
      goals[12] = '中央の目標';
      goals[24] = '最後の目標';

      const result = goalsToMarkdown(goals);

      expect(result).toContain('入力済み: 3/25');
      expect(result).toContain('最初の目標');
      expect(result).toContain('中央の目標');
      expect(result).toContain('最後の目標');
    });

    it('改行を含む目標を<br>に変換する', () => {
      const goals = Array(25).fill('');
      goals[0] = '行1\n行2\n行3';

      const result = goalsToMarkdown(goals);

      // テーブル内では<br>に変換される
      expect(result).toContain('行1<br>行2<br>行3');
    });

    it('パイプ文字をエスケープする', () => {
      const goals = Array(25).fill('');
      goals[0] = 'A|B|C';

      const result = goalsToMarkdown(goals);

      // テーブル内では\|にエスケープされる
      expect(result).toContain('A\\|B\\|C');
    });
  });

  describe('parseMarkdownToGoals', () => {
    it('番号付きリストから目標をパースする', () => {
      const markdown = `# 目標ビンゴ

## 番号付きリスト

1. 目標1
2. 目標2
3. 目標3
4. (未入力)
5. 目標5
`;
      const result = parseMarkdownToGoals(markdown);

      expect(result).not.toBeNull();
      expect(result?.[0]).toBe('目標1');
      expect(result?.[1]).toBe('目標2');
      expect(result?.[2]).toBe('目標3');
      expect(result?.[3]).toBe(''); // (未入力)は空文字に
      expect(result?.[4]).toBe('目標5');
    });

    it('複数行の目標を正しくパースする', () => {
      const markdown = `1. 行1
   行2
   行3
2. 単一行
`;
      const result = parseMarkdownToGoals(markdown);

      expect(result?.[0]).toBe('行1\n行2\n行3');
      expect(result?.[1]).toBe('単一行');
    });

    it('<br>を改行に変換する', () => {
      const markdown = `1. 行1<br>行2
2. テスト
`;
      const result = parseMarkdownToGoals(markdown);

      expect(result?.[0]).toBe('行1\n行2');
    });

    it('エスケープされたパイプを元に戻す', () => {
      const markdown = `1. A\\|B\\|C
2. テスト
`;
      const result = parseMarkdownToGoals(markdown);

      expect(result?.[0]).toBe('A|B|C');
    });

    it('空のMarkdownはnullを返す', () => {
      const result = parseMarkdownToGoals('');
      expect(result).toBeNull();
    });

    it('目標がないMarkdownはnullを返す', () => {
      const markdown = `# タイトル

何か別の内容
`;
      const result = parseMarkdownToGoals(markdown);
      expect(result).toBeNull();
    });

    it('25個すべての目標をパースする', () => {
      const goals = Array.from({ length: 25 }, (_, i) => `目標${i + 1}`);
      const markdown = goals.map((g, i) => `${i + 1}. ${g}`).join('\n');

      const result = parseMarkdownToGoals(markdown);

      expect(result).toHaveLength(25);
      for (let i = 0; i < 25; i++) {
        expect(result?.[i]).toBe(`目標${i + 1}`);
      }
    });
  });

  describe('ラウンドトリップ', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-18T12:34:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('エクスポート→インポートで元のデータに戻る', () => {
      const original = Array.from({ length: 25 }, (_, i) => `目標${i + 1}`);
      const markdown = goalsToMarkdown(original);
      const restored = parseMarkdownToGoals(markdown);

      expect(restored).toEqual(original);
    });

    it('改行を含むデータもラウンドトリップで保持される', () => {
      const original = Array(25).fill('');
      original[0] = '行1\n行2\n行3';
      original[5] = '複数\n行の\nテスト';

      const markdown = goalsToMarkdown(original);
      const restored = parseMarkdownToGoals(markdown);

      expect(restored?.[0]).toBe('行1\n行2\n行3');
      expect(restored?.[5]).toBe('複数\n行の\nテスト');
    });

    it('パイプ文字を含むデータもラウンドトリップで保持される', () => {
      const original = Array(25).fill('');
      original[0] = 'A|B|C';
      original[10] = 'X|Y';

      const markdown = goalsToMarkdown(original);
      const restored = parseMarkdownToGoals(markdown);

      expect(restored?.[0]).toBe('A|B|C');
      expect(restored?.[10]).toBe('X|Y');
    });

    it('空の目標もラウンドトリップで保持される', () => {
      const original = Array(25).fill('');
      original[0] = '最初';
      original[24] = '最後';

      const markdown = goalsToMarkdown(original);
      const restored = parseMarkdownToGoals(markdown);

      expect(restored?.[0]).toBe('最初');
      expect(restored?.[1]).toBe('');
      expect(restored?.[23]).toBe('');
      expect(restored?.[24]).toBe('最後');
    });
  });
});
