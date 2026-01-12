# 実験場サイト（mejilab.com）デプロイ計画

## 概要
複数のWebツールを公開する実験場サイトを構築し、広告収入を得られる形で運用する。

## 決定事項

| 項目 | 決定 |
|------|------|
| **独自ドメイン** | mejilab.com（Cloudflare Registrar で取得） |
| **goal_bingo** | bingo.mejilab.com → Cloudflare Pages |
| **board_game_review** | games.mejilab.com → Vercel |
| **ポータル** | mejilab.com → Cloudflare Pages |

### 選定理由
- **Cloudflare Registrar**: 原価販売で最安、DNS/Pages管理が同一画面で完結
- **Cloudflare Pages**: 静的SPA向き、帯域無制限、広告OK
- **Vercel**: Next.js + DB構成に最適（board_game_review用）
- **独自ドメイン**: AdSense審査に有利、ブランド統一

---

## 実装手順

### Phase 1: ドメイン取得（手動作業）
1. Cloudflare アカウント作成（未作成の場合）
2. Cloudflare Registrar で `mejilab.com` の空き確認・購入
3. DNS設定画面を確認

### Phase 2: goal_bingo デプロイ準備（コード変更）

#### 2-1. Cloudflare Pages 設定ファイル作成
**新規作成**: `wrangler.toml`（プロジェクトルート）

```toml
name = "goal-bingo"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"
```

#### 2-2. SPA用リダイレクト設定
**新規作成**: `public/_redirects`

```
/*    /index.html   200
```

#### 2-3. index.html メタ情報更新
**修正**: `index.html`

- タイトルを「目標ビンゴ | mejilab」に変更
- OGPメタタグ追加
- description 追加

### Phase 3: Cloudflare Pages デプロイ（手動作業）
1. Cloudflare Dashboard → Pages → Create a project
2. GitHub リポジトリを連携
3. ビルド設定:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. デプロイ実行
5. カスタムドメイン設定: `bingo.mejilab.com`

### Phase 4: ポータルサイト作成（別リポジトリ）
- 各ツールへのリンク一覧
- プライバシーポリシー
- 運営者情報（AdSense審査用）

---

## 修正対象ファイル（goal_bingo）

| ファイル | 操作 | 内容 |
|----------|------|------|
| `wrangler.toml` | 新規作成 | Cloudflare Pages設定 |
| `public/_redirects` | 新規作成 | SPAリダイレクト設定 |
| `index.html` | 修正 | メタ情報更新 |

---

## 検証方法

1. `npm run build` でビルド成功を確認
2. `npm run preview` でローカル動作確認
3. Cloudflare Pages デプロイ後:
   - `[プロジェクト名].pages.dev` で動作確認
   - `bingo.mejilab.com` でカスタムドメイン動作確認
   - SPAルーティング（直接URLアクセス）が正常に動作することを確認

---

## 今後の予定（本計画の範囲外）

1. **ポータルサイト作成**: mejilab.com のランディングページ
2. **board_game_review デプロイ**: games.mejilab.com へ Vercel デプロイ
3. **AdSense 申請**: コンテンツが揃ってから申請
