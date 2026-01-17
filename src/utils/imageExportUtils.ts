import { toPng } from 'html-to-image';

export interface ImageExportOptions {
  /** デバイスピクセル比（デフォルト: 2 for Retina） */
  pixelRatio?: number;
  /** 背景色（backdrop-filter対策） */
  backgroundColor?: string;
}

/**
 * DOM要素をPNG画像としてエクスポート
 */
export async function exportElementAsPng(
  element: HTMLElement,
  options: ImageExportOptions = {}
): Promise<string> {
  const { pixelRatio = 2, backgroundColor = '#e0f2fe' } = options;

  const dataUrl = await toPng(element, {
    pixelRatio,
    backgroundColor,
    skipFonts: false,
    cacheBust: true,
  });

  return dataUrl;
}

/**
 * Data URLをファイルとしてダウンロード
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * ファイル名用の日時フォーマット
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
 * デフォルトのファイル名を生成
 */
export function generateDefaultFilename(): string {
  return `goal-bingo-${formatDateForFilename(new Date())}.png`;
}
