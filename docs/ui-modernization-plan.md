# 目標ビンゴWebアプリ UIモダン化計画

## 概要
現在のシンプルなフラットデザインを、**グラスモーフィズム**スタイルにリデザインし、**Tailwind CSS v4**を導入した。

## 技術選定
- **デザインスタイル**: グラスモーフィズム（透明感のあるガラス風、ぼかし効果、半透明背景）
- **CSSフレームワーク**: Tailwind CSS v4（@tailwindcss/postcssプラグイン使用）
- **既存CSS**: 全て削除・Tailwindに移行完了

## 新配色
| 用途 | 旧配色 | 新配色 |
|------|------|--------|
| プライマリ | #2196f3 | primary-500（#3b82f6） |
| 成功/達成 | #4caf50 | success-500（#22c55e） |
| アクセント | #ff9800 | accent-500（#f97316） |
| 背景 | #ffffff | 透過白（glass-card） |
| テキスト | #333 | white（背景が濃いため） |

## 背景デザイン
紫系グラデーション + 浮遊するBlobアニメーション
```
bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500
```

---

## 実装済みフェーズ

### Phase 1: Tailwind CSS v4導入
- `tailwindcss`, `@tailwindcss/postcss`, `autoprefixer` をインストール
- `postcss.config.js` を作成
- `src/index.css` に `@import "tailwindcss"` と `@theme` ブロックでカスタムカラー定義

### Phase 2: 背景とApp全体レイアウト
- App.tsxに背景グラデーションコンテナを追加
- Blobアニメーション要素を追加（3つの円形がゆっくり動く）
- ヘッダーをglassカードスタイルに変更
- App.css削除

### Phase 3: BingoBoard
- グリッドコンテナをglassカードスタイルに変更
- Tailwindのgrid, gap, paddingユーティリティを使用
- BingoBoard.css削除

### Phase 4: BingoCell（最重要）
- セルをglassスタイルに変更
- 完了状態: 緑グラデーション + グロー効果
- ハイライト状態: 黄色ボーダーグロー + pulse animation
- ホバー・フォーカス効果の実装
- BingoCell.css削除

### Phase 5: BingoResult
- glassカードスタイルに変更
- プログレスバーの新デザイン（グラデーション）
- セレブレーションエフェクト強化（bounce animation）
- BingoResult.css削除

### Phase 6: GoalInput
- glass-input/buttonスタイルに変更
- グリッドレスポンシブ対応（5列→3列）
- GoalInput.css削除

### Phase 7: SharePanel
- glassカードスタイルに変更
- URLコピーボタン・QRコード表示エリアのスタイリング
- QRコードに白背景を追加（視認性向上）
- SharePanel.css削除

### Phase 8: 最終調整
- 全テストパス（40/40）
- ビルド成功

---

## ファイル構成の変更

### 削除されたファイル
- `src/App.css`
- `src/components/BingoBoard/BingoBoard.css`
- `src/components/BingoCell/BingoCell.css`
- `src/components/BingoResult/BingoResult.css`
- `src/components/GoalInput/GoalInput.css`
- `src/components/SharePanel/SharePanel.css`
- `tailwind.config.js`（v4では不要）

### 追加されたファイル
- `postcss.config.js`

### 変更されたファイル
- `package.json`（devDependencies追加）
- `src/index.css`（Tailwind v4形式に変更）
- 全コンポーネントのTSXファイル（CSSクラスをTailwindに置換）

---

## デザイン特徴

### グラスモーフィズムの実装
```css
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
```

### Blobアニメーション
```css
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
```

---

## 実装日
2026-01-12
