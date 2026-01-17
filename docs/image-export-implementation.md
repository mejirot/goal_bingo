# ビンゴカード画像エクスポート機能 実装計画

## 概要
完成したビンゴカードをPNG画像としてダウンロードできる機能を追加する。

## ライブラリ選定
**html-to-image** を採用

| 理由 |
|------|
| TypeScriptネイティブ対応（@types不要） |
| CSS再現度が高い（グラデーション、box-shadow対応） |
| 軽量（約10KB） |
| 活発にメンテナンスされている |

## UI配置
「目標を編集する」ボタンの横に「画像として保存」ボタンを配置

```
┌──────────────────────────────────────┐
│           ビンゴカード                │
├──────────────────────────────────────┤
│           達成状況表示                │
├──────────────────────────────────────┤
│ [目標を編集する] [画像として保存]     │  ← ここに追加
├──────────────────────────────────────┤
│         共有パネル                    │
└──────────────────────────────────────┘
```

## 変更ファイル一覧

### 1. package.json
- `html-to-image` の依存関係追加

### 2. src/utils/imageExportUtils.ts（新規）
- `exportElementAsPng()`: DOM要素をPNG画像に変換
- `downloadImage()`: Data URLをファイルとしてダウンロード
- `generateDefaultFilename()`: `goal-bingo-YYYYMMDD-HHmm.png` 形式のファイル名生成

### 3. src/components/BingoBoard/BingoBoard.tsx
- `forwardRef` に変更してrefを外部から受け取れるようにする

### 4. src/components/ImageExportButton/（新規）
- `ImageExportButton.tsx`: エクスポートボタンコンポーネント
- `index.ts`: バレルエクスポート
- 状態管理: idle → exporting → success/error → idle

### 5. src/App.tsx
- `useRef` でBingoBoardへの参照を作成
- `ImageExportButton` をボタン群に追加

## 画像エクスポート仕様

| 項目 | 値 |
|------|-----|
| 形式 | PNG |
| 解像度 | pixelRatio: 2（Retina対応） |
| 背景色 | #e0f2fe（sky-100相当、backdrop-filter対策） |
| ファイル名 | goal-bingo-YYYYMMDD-HHmm.png |

## 実装順序

1. `npm install html-to-image`
2. `src/utils/imageExportUtils.ts` 作成
3. `src/components/BingoBoard/BingoBoard.tsx` を forwardRef に変更
4. `src/components/ImageExportButton/` 作成
5. `src/App.tsx` に ref と ImageExportButton を追加
6. 動作確認

## 検証方法

1. プレイモードで「画像として保存」ボタンをクリック
2. PNGファイルがダウンロードされることを確認
3. 画像内容を確認:
   - 5x5グリッドが正しく表示されている
   - 達成済みセル（緑）と未達成セル（青）の色が正しい
   - 改行を含む目標テキストが正しく表示されている
   - ビンゴラインのハイライトが反映されている
