/**
 * 目標ビンゴのMarkdownエクスポート/インポートユーティリティ
 */

/**
 * 日時をフォーマット（YYYY-MM-DD HH:mm形式）
 */
function formatTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * ファイル名用の日時フォーマット（YYYYMMDD-HHmm形式）
 */
function formatDateForFilename(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
}

/**
 * テーブルセル用にエスケープ（改行を<br>に、パイプを\|に）
 */
function escapeTableCell(text: string): string {
  return text
    .replace(/\|/g, '\\|')
    .replace(/\n/g, '<br>');
}

/**
 * テーブルセルのエスケープを元に戻す
 */
function unescapeTableCell(text: string): string {
  return text
    .replace(/<br>/g, '\n')
    .replace(/\\\|/g, '|');
}

/**
 * 5x5テーブルを生成
 */
function generateTable(goals: string[]): string {
  const header = '| 列1 | 列2 | 列3 | 列4 | 列5 |';
  const separator = '|-----|-----|-----|-----|-----|';

  const rows: string[] = [];
  for (let row = 0; row < 5; row++) {
    const cells: string[] = [];
    for (let col = 0; col < 5; col++) {
      const index = row * 5 + col;
      const goal = goals[index] || '';
      cells.push(escapeTableCell(goal) || '(未入力)');
    }
    rows.push(`| ${cells.join(' | ')} |`);
  }

  return [header, separator, ...rows].join('\n');
}

/**
 * 番号付きリストを生成
 */
function generateNumberedList(goals: string[]): string {
  return goals
    .map((goal, index) => {
      const text = goal.trim() || '(未入力)';
      // 複数行の場合はインデント
      const indented = text.replace(/\n/g, '\n   ');
      return `${index + 1}. ${indented}`;
    })
    .join('\n');
}

/**
 * 目標配列をMarkdown形式に変換
 */
export function goalsToMarkdown(goals: string[]): string {
  const now = new Date();
  const timestamp = formatTimestamp(now);
  const filledCount = goals.filter(g => g.trim() !== '').length;

  const table = generateTable(goals);
  const list = generateNumberedList(goals);

  return `# 目標ビンゴ

作成日時: ${timestamp}

## 目標一覧

${table}

## 番号付きリスト

${list}

---
入力済み: ${filledCount}/25
`;
}

/**
 * Markdownファイルをダウンロード
 */
export function downloadMarkdown(content: string, filename?: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `goal-bingo-${formatDateForFilename(new Date())}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Markdownから目標配列をパース
 * 番号付きリスト形式（`1. 目標`）を優先的にパース
 */
export function parseMarkdownToGoals(markdown: string): string[] | null {
  const goals: string[] = Array(25).fill('');

  // 番号付きリストを探す
  // パターン: "数字. テキスト"（次の番号か空行まで）
  const lines = markdown.split('\n');
  let currentIndex = -1;
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 番号付きリストの開始を検出
    const listMatch = line.match(/^(\d+)\.\s+(.*)$/);

    if (listMatch) {
      // 前の項目を保存
      if (currentIndex >= 0 && currentIndex < 25) {
        goals[currentIndex] = currentContent.join('\n').trim();
      }

      // 新しい項目を開始
      const num = parseInt(listMatch[1], 10);
      currentIndex = num - 1; // 0-indexed
      const text = listMatch[2];

      // (未入力)の場合は空文字に
      if (text === '(未入力)') {
        currentContent = [''];
      } else {
        currentContent = [unescapeTableCell(text)];
      }
    } else if (currentIndex >= 0) {
      // インデントされた継続行（3スペース）
      if (line.startsWith('   ')) {
        currentContent.push(unescapeTableCell(line.substring(3)));
      } else if (line.trim() === '' || line.startsWith('#') || line.startsWith('---')) {
        // 区切り行：現在の項目を保存して終了
        if (currentIndex >= 0 && currentIndex < 25) {
          goals[currentIndex] = currentContent.join('\n').trim();
        }
        currentIndex = -1;
        currentContent = [];
      }
    }
  }

  // 最後の項目を保存
  if (currentIndex >= 0 && currentIndex < 25) {
    goals[currentIndex] = currentContent.join('\n').trim();
  }

  // 少なくとも1つの目標が読み込まれたかチェック
  const hasAnyGoal = goals.some(g => g.trim() !== '');
  if (!hasAnyGoal) {
    return null;
  }

  return goals;
}

/**
 * ファイルをテキストとして読み込む
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
