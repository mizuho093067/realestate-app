# CLAUDE.md

このファイルは、Claude Code がこのリポジトリで作業する際のガイドです。

## プロジェクト概要

- **プロジェクト名**: realestate-app
- **内容**: Supabase 認証付きの不動産管理 Web アプリ（ログインしたユーザーが自分の物件を登録・一覧表示・編集・削除する）
- **技術スタック**: React 19 / Vite 8 / React Router 7 / Supabase（`@supabase/supabase-js`）

## GitHubリポジトリ

https://github.com/mizuho093067/realestate-app

## 技術スタック

| 分類 | 使用技術 | 補足 |
| --- | --- | --- |
| UI ライブラリ | React 19（`react` / `react-dom`） | 関数コンポーネント + Hooks、JavaScript（JSX） |
| ビルドツール | Vite 8 + `@vitejs/plugin-react` | 開発サーバーと本番ビルド |
| 画面遷移 | React Router 7（`react-router-dom`） | `BrowserRouter` を使用 |
| 認証 | Supabase Auth（`@supabase/supabase-js`） | メールアドレス + パスワード |
| スタイル | 素の CSS（`src/App.css`） | CSS フレームワークは使っていない |
| データベース | Supabase（PostgreSQL）の `properties` テーブル | RLS で自分の物件だけ操作できる |
| 実行環境 | Node.js 24 | |

- 外部ライブラリは必要になるまで追加しない。追加する場合は理由をユーザーに説明してから入れる。

## コミュニケーション

- 返答は**必ず日本語**で行うこと。
- コード内のコメントも日本語で記述する。

## Git運用ルール

- **コードを変更するたびに、必ずコミットして GitHub にプッシュすること。**
  - 1つの作業（機能追加・修正など）が終わったら、まとめて放置せずにその都度プッシュする。
  - 手順:
    ```
    git add <変更したファイル>
    git commit -m "変更内容の説明"
    git push origin main
    ```
- ブランチは `main` を使用する。
- コミットメッセージは**日本語**で、何を変更したかが分かるように簡潔に書く。
  - 例: `物件一覧の表示を追加`、`家賃の並び替えの不具合を修正`
- プッシュに失敗した場合は、エラー内容を報告し、強制プッシュ（`--force`）は行わないこと。
- 不要なファイル（テスト用の一時ファイルなど）はコミットしない。
- `.env` は**絶対にコミットしない**（`.gitignore` で除外済み）。

## ファイル構成

```
realestate-app/
├── CLAUDE.md                   # このファイル
├── .env.example                # 環境変数のひな形（.env にコピーして使う）
├── .gitignore                  # コミットしないファイル（node_modules/ dist/ .env など）
├── index.html                  # エントリーポイントの HTML
├── package.json                # 依存パッケージとスクリプト
├── vite.config.js              # Vite の設定
├── supabase/
│   └── migrations/
│       └── 20261021000000_create_properties.sql # properties テーブル・RLS ポリシーの作成
└── src/
    ├── main.jsx                # React の起動処理
    ├── App.jsx                 # ルーティング（どの URL でどの画面を出すか）
    ├── App.css                 # スタイル
    ├── supabaseClient.js       # Supabase クライアント（.env の接続情報を読む）
    ├── AuthProvider.jsx        # ログイン状態をアプリ全体に配る + useAuth フック
    ├── authErrors.js           # Supabase 認証のエラーを日本語メッセージに変換
    ├── propertiesApi.js        # 物件の CRUD（一覧・登録・更新・削除）とエラーの日本語化
    ├── components/
    │   ├── ProtectedRoute.jsx  # ログイン必須ページのガード（未ログインなら /login へ）
    │   ├── GuestRoute.jsx      # ログイン済みならログイン・登録画面から /properties へ
    │   ├── PropertyCard.jsx    # 物件1件分のカード（編集・削除ボタン付き）
    │   └── PropertyForm.jsx    # 物件の登録・編集フォーム（入力チェック付き）
    └── pages/
        ├── LoginPage.jsx       # ログイン画面（/login）
        ├── SignupPage.jsx      # 会員登録画面（/signup）
        └── PropertyListPage.jsx # 物件一覧画面（/properties、登録・編集・削除・ログアウト）
```

- ファイルを追加・削除したら、この構成図も更新する。

## 開発・実行方法

- 初回のみ `npm install` で依存パッケージをインストールする。
- `.env.example` を `.env` にコピーし、Supabase の Project URL と Publishable key を設定する。
- `npm run dev` で開発サーバーを起動し、表示された URL（通常 http://localhost:5173）をブラウザで開く。
- `npm run build` で本番用ファイルを `dist/` に出力する。`npm run preview` で確認できる。
- コードを変更したら、プッシュ前に `npm run build` が通ることを確認する。

## 認証（Supabase）

- 環境変数は `VITE_SUPABASE_URL` と `VITE_SUPABASE_PUBLISHABLE_KEY`。ブラウザで使うため `VITE_` で始める。
- ブラウザに置いてよいのは **Publishable key だけ**。Secret key（`sb_secret_...`）や service_role キーはフロントエンドに絶対に入れない。
- Supabase の呼び出しは `src/supabaseClient.js` の `supabase` を使い、`createClient` を他の場所で呼ばない。
- ログイン状態は `useAuth()`（`session` / `user` / `loading`）で取得する。
- ログインが必要な画面は `ProtectedRoute` で囲む。
- 現在の Supabase 設定はメール確認なし（登録するとすぐログイン状態になる）。メール確認を有効にした場合は、`SignupPage.jsx` が「確認メールを送信しました」と表示する。その場合、Supabase の Authentication > URL Configuration にアプリの URL を登録する。
- 動作確認で Supabase に実際のユーザーを作る場合は、事前にユーザーに確認する。

## データベース（Supabase）

- テーブル定義は `supabase/migrations/` の SQL ファイルで管理する。Supabase ダッシュボードの SQL Editor に貼り付けて実行する。
- テーブルを変更するときは、既存の SQL ファイルを書き換えずに、新しい日時のファイル（`YYYYMMDDHHMMSS_変更内容.sql`）を追加する。

### `properties` テーブル

| 列 | 型 | 内容 |
| --- | --- | --- |
| `id` | uuid | 物件の ID（自動生成） |
| `user_id` | uuid | 登録したユーザー（`auth.users` を参照。省略時は `auth.uid()` が自動で入る） |
| `name` | text | 物件名（1〜100文字） |
| `rent` | integer | 家賃（円 / 月、0以上） |
| `area` | text | エリア名（1〜100文字） |
| `layout` | text | 間取り（例: 1LDK、1〜20文字） |
| `created_at` / `updated_at` | timestamptz | 作成日時 / 更新日時（更新日時はトリガーで自動更新） |

- **RLS を必ず有効にしておく。** ポリシーは「自分の物件（`user_id = auth.uid()`）だけ表示・登録・編集・削除できる」。
- フロントエンドから `user_id` は送らない（データベース側で自動で入り、RLS が他人の ID を拒否する）。
- テーブルを新しく作るときも、同じように RLS を有効にしてポリシーを設定する。
- 物件の読み書きは `src/propertiesApi.js` の関数を使い、画面のコンポーネントから直接 `supabase.from(...)` を呼ばない。

## 画面とルーティング

| パス | 画面 | 未ログイン時 | ログイン済み時 |
| --- | --- | --- | --- |
| `/login` | ログイン | 表示 | `/properties` へ移動 |
| `/signup` | 会員登録 | 表示 | `/properties` へ移動 |
| `/properties` | 物件一覧 | `/login` へ移動 | 表示 |
| それ以外 | — | `/properties` へ移動（→ `/login`） | `/properties` へ移動 |

## コーディング規約

- コンポーネントは関数コンポーネントと Hooks で書く。1ファイル1コンポーネント。
  - 画面全体は `src/pages/`（名前は `〇〇Page`）、部品は `src/components/` に置く。
- イベント用 props は `on` + 動詞、コンポーネント内のイベント処理は `handle` + イベント名（例: `handleSubmit`, `handleLogout`）。
- JavaScript は `const` / `let` を使用し、`var` は使わない。
- 変数名・関数名はキャメルケース。CSS クラス名はケバブケース（例: `property-card`）。
- 金額（家賃）は整数（円単位）で扱い、表示時に `toLocaleString("ja-JP")` で桁区切りにする。

```js
// 物件データの例（propertiesApi.js が返す形）
const property = {
  id: "…",               // uuid
  name: "サンライズ渋谷 301号室",
  rent: 128000,          // 家賃（円 / 月、整数）
  area: "東京都渋谷区",
  layout: "1LDK",
  created_at: "2026-10-21T10:00:00+00:00"
};
```

## 注意事項

- スマートフォンでも見やすいレスポンシブデザインにする。
- 画面に出すエラーメッセージは日本語にする（認証のエラーは `authErrors.js`、物件操作のエラーは `propertiesApi.js` で変換する）。
- 削除の前には必ず確認ダイアログを出す。
