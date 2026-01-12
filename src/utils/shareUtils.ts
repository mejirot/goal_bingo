import pako from 'pako';
import type { ShareData, BingoCard } from '../types/bingo';

const SHARE_VERSION = 1;

/**
 * BingoCardをShareData形式に変換
 */
function cardToShareData(card: BingoCard): ShareData {
  return {
    g: card.goals,
    c: card.completed,
    v: SHARE_VERSION,
  };
}

/**
 * ShareDataをBingoCardに変換
 */
function shareDataToCard(data: ShareData): BingoCard | null {
  // バリデーション
  if (
    data.v !== SHARE_VERSION ||
    !Array.isArray(data.g) ||
    data.g.length !== 25 ||
    !Array.isArray(data.c) ||
    data.c.length !== 25
  ) {
    return null;
  }

  return {
    goals: data.g,
    completed: data.c,
  };
}

/**
 * BingoCardをURLセーフな文字列にエンコード
 */
export function encodeCard(card: BingoCard): string {
  const shareData = cardToShareData(card);
  const json = JSON.stringify(shareData);

  // gzip圧縮
  const compressed = pako.deflate(json);

  // Uint8ArrayをBase64に変換（URLセーフ）
  const base64 = btoa(String.fromCharCode(...compressed))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64;
}

/**
 * エンコードされた文字列をBingoCardにデコード
 */
export function decodeCard(encoded: string): BingoCard | null {
  try {
    // URLセーフBase64を標準Base64に戻す
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // パディングを追加
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    // Base64をUint8Arrayに変換
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // gzip解凍
    const decompressed = pako.inflate(bytes, { to: 'string' });

    // JSONパース
    const shareData: ShareData = JSON.parse(decompressed);

    return shareDataToCard(shareData);
  } catch {
    return null;
  }
}

/**
 * 現在のURLに共有パラメータを追加したURLを生成
 */
export function generateShareUrl(card: BingoCard): string {
  const encoded = encodeCard(card);
  const url = new URL(window.location.href);
  url.searchParams.set('d', encoded);
  return url.toString();
}

/**
 * URLから共有データを取得
 */
export function getCardFromUrl(): BingoCard | null {
  const url = new URL(window.location.href);
  const encoded = url.searchParams.get('d');

  if (!encoded) {
    return null;
  }

  return decodeCard(encoded);
}

/**
 * URLの共有パラメータをクリア
 */
export function clearShareParam(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('d');
  window.history.replaceState({}, '', url.toString());
}
