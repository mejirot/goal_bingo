# 目標ビンゴ Webアプリ 実装計画

## 概要
5x5マスの目標ビンゴカードを作成・管理できるWebアプリケーション

### 参考
- 目標ビンゴ（人生ビンゴ）の概念: https://note.com/keitauehara/n/n7fe6e2945be2
- 年間目標を25個設定し、達成状況をビンゴ形式で可視化・管理するツール

## 要件
- **マス目サイズ**: 5x5（25マス、フリーマスなし）
- **技術スタック**: React + TypeScript + Vite
- **機能**:
  - ビンゴカード作成（25個の目標入力）
  - 達成マーク機能（クリックでチェックをトグル）
  - ビンゴ判定（縦5本・横5本・斜め2本 = 計12ライン）
  - ローカル保存・読込（localStorage）
  - 共有機能（URLエンコード + QRコード）

---

## プロジェクト構造

```
o:/goal_bingo/
├── src/
│   ├── components/
│   │   ├── BingoBoard/          # 5x5グリッド
│   │   ├── BingoCell/           # 個別マス
│   │   ├── GoalInput/           # 目標入力フォーム
│   │   ├── SharePanel/          # 共有パネル（URL/QR）
│   │   └── BingoResult/         # ビンゴ達成表示
│   ├── hooks/
│   │   ├── useBingoState.ts     # 状態管理
│   │   └── useLocalStorage.ts   # ローカル保存
│   ├── utils/
│   │   ├── bingoLogic.ts        # ビンゴ判定ロジック
│   │   └── shareUtils.ts        # URL共有ユーティリティ
│   ├── types/
│   │   └── bingo.ts             # 型定義
│   ├── App.tsx
│   └── index.tsx
├── docs/                        # 設計ドキュメント
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 主要な型定義

```typescript
// マスのインデックス: 0-24（フリーマスなし、全25マスに目標を設定）
//  0  1  2  3  4
//  5  6  7  8  9
// 10 11 12 13 14
// 15 16 17 18 19
// 20 21 22 23 24

interface BingoCard {
  goals: string[];      // 25要素（すべてユーザー入力）
  completed: boolean[]; // 25要素（ユーザーがチェックした状態）
}

interface AppState {
  card: BingoCard;
  mode: 'input' | 'play';
}
```

---

## 実装ステップ

### Phase 1: プロジェクト初期化 ✅ 完了
- [x] Vite + React + TypeScript でプロジェクト作成
- [x] 基本ディレクトリ構造作成
- [x] 開発サーバー起動確認

**テスト**: `npm run dev` で画面表示 → 確認済み

### Phase 2: 型定義とビンゴロジック ✅ 完了
- [x] `src/types/bingo.ts` - 型定義
- [x] `src/utils/bingoLogic.ts` - ビンゴ判定ロジック
- [x] ユニットテスト作成（20テスト全パス）

**テスト**: `npm test` でビンゴ判定テストがパス → 確認済み

### Phase 3: 基本UIコンポーネント ✅ 完了
- [x] `BingoCell` - 単一マス表示
- [x] `BingoBoard` - 5x5グリッド表示
- [x] 仮データで表示確認

**テスト**: 5x5グリッドが表示される → 確認済み（ビルド成功）

### Phase 4: 状態管理 ✅ 完了
- [x] `useBingoState` - カスタムフック実装
- [x] App.tsxへの統合（入力モード/プレイモード切替）

**テスト**: マスクリックで色が変わり、ビンゴ達成が検出される → 確認済み

### Phase 5: 目標入力機能 ✅ 完了
- [x] `GoalInput` - 25個の入力フォーム（コンポーネント作成済み）
- [x] App.tsxへの統合

**テスト**: 目標入力→完了→プレイモードで遊べる → 確認済み

### Phase 6: ローカル保存 ✅ 完了
- [x] `useLocalStorage` - 保存/読込フック
- [x] 自動保存機能
- [x] ユニットテスト（10テスト追加、計30テスト）

**テスト**: ページリロード後も状態維持 → 確認済み

### Phase 7: 共有機能 ✅ 完了
- [x] `shareUtils.ts` - URLエンコード/デコード（pako圧縮）
- [x] URLパラメータからの復元
- [x] `SharePanel` - URL表示、コピーボタン
- [x] QRコード表示（qrcode.react）
- [x] ユニットテスト（10テスト追加、計40テスト）

**テスト**: URLコピー→別タブで開く→同じカード表示 → 確認済み

### Phase 8: UI仕上げ ✅ 完了
- [x] ビンゴ達成演出（BingoResultコンポーネント）
- [x] 達成ラインのハイライト強化
- [x] レスポンシブ対応（モバイル最適化）
- [x] アクセシビリティ改善（aria属性追加）

**テスト**: モバイル表示、ビンゴ時の演出確認 → 確認済み

---

## 使用ライブラリ

| ライブラリ | 用途 |
|-----------|------|
| react ^18 | UIフレームワーク |
| typescript ^5 | 型安全性 |
| vite ^5 | ビルドツール |
| qrcode.react ^3 | QRコード生成 |
| pako ^2 | gzip圧縮（URL短縮） |
| vitest ^1 | テスト |

---

## 検証方法

1. **単体テスト**: `npm test` でビンゴロジックのテスト実行
2. **手動テスト**:
   - 目標25個入力 → プレイモード → マスクリック → ビンゴ判定
   - ページリロード → 状態維持確認
   - 共有URL生成 → 別タブで開く → 同じカード表示
   - QRコード読み取り → 正しいURLか確認
3. **レスポンシブ**: ブラウザ開発者ツールでモバイル表示確認

---

## 注意事項

- フリーマスなし。25マスすべてにユーザーが目標を入力
- URL長制限のため目標テキストは適度な長さを推奨
- 各Phaseごとにテスト可能な状態で完了させる

---

## 作成済みファイル一覧

### 完了済み
- `src/types/bingo.ts` - 型定義
- `src/utils/bingoLogic.ts` - ビンゴ判定ロジック
- `src/utils/bingoLogic.test.ts` - ユニットテスト（20テスト）
- `src/components/BingoCell/` - 単一マスコンポーネント
- `src/components/BingoBoard/` - 5x5グリッドコンポーネント
- `src/hooks/useBingoState.ts` - 状態管理フック
- `src/components/GoalInput/` - 目標入力フォーム
- `src/hooks/useLocalStorage.ts` - ローカル保存フック
- `src/hooks/useLocalStorage.test.ts` - ユニットテスト（10テスト）
- `src/utils/shareUtils.ts` - URL共有ユーティリティ
- `src/utils/shareUtils.test.ts` - ユニットテスト（10テスト）
- `src/components/SharePanel/` - 共有パネルコンポーネント
- `src/components/BingoResult/` - ビンゴ達成演出コンポーネント

### 完了
全Phase（1-8）完了。40テスト全パス。
