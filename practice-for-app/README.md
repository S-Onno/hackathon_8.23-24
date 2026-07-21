# practice-for-app

Next.js、Prisma、SQLiteで構成した学習支援アプリです。認証セッション、単語カード、学習記録は1つのPrisma schemaとDBで管理します。

## ローカルセットアップ

Node.js 22以上を使用してください（`.nvmrc`とCIも22で統一しています）。

```powershell
Copy-Item .env.example .env
$secret = node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
(Get-Content .env) -replace 'SESSION_SECRET=""', "SESSION_SECRET=`"$secret`"" | Set-Content -Encoding utf8 .env
npm install
npm run db:migrate
npm run dev
```

`.env`の`DATABASE_URL="file:./app.db"`は`prisma/app.db`を使用します。DBファイルはGitで管理せず、`prisma/migrations`と必要に応じたseedから再作成します。

## 環境変数

- `DATABASE_URL`: Prismaの接続先。ローカル既定値は`file:./app.db`です。
- `SESSION_SECRET`: cookie署名用の秘密値。本番では32文字以上のランダム値が必須です。

秘密値は次のように生成できます。

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

開発・テストで`SESSION_SECRET`を空または未設定にした場合だけ、固定の開発専用値を使用して警告を出します。本番で未設定または32文字未満の場合、認証処理は`SERVER_CONFIGURATION_ERROR`として明示的に失敗します。秘密値をGitへコミットしないでください。

## DBコマンド

```powershell
npm run prisma:generate
npm run db:migrate
npm run db:deploy
```

- `db:migrate`: ローカル開発DBを用意し、migrationを適用します。
- `db:deploy`: 配備先DBを用意し、コミット済みmigrationを適用します。
- `postinstall`: `@prisma/client`を自動生成します。

移行前に使われていた5件のカードをローカルデモアカウントへ再現する場合は、平文パスワードをファイルへ書かず、一時的な環境変数でseedを実行します。3変数のいずれかが欠ける場合、seedは失敗します。すべて未設定なら安全にスキップします。

```powershell
$env:SEED_EMAIL="demo@example.com"
$env:SEED_USERNAME="Demo User"
$env:SEED_PASSWORD="local-only-password"
npm run db:seed
Remove-Item Env:SEED_EMAIL,Env:SEED_USERNAME,Env:SEED_PASSWORD
```

## 認証とAPI

- `POST /api/auth/signup`: アカウント作成とログイン
- `POST /api/auth/login`: ログイン
- `POST /api/auth/logout`: 現在のセッションを破棄
- `GET /api/auth/me`: 現在の公開アカウント情報
- `/api/cards`: ログイン中の本人が所有するカードのみをCRUD
- `GET /api/study-logs`: 本人の記録とJST基準の当日・週・月・日別・科目別集計
- `POST /api/study-logs`: 本人の学習記録を冪等に保存（`clientSessionId`にUUID v4が必須）

セッショントークンは`HttpOnly`、`SameSite=Lax`、本番では`Secure`のcookieに保存し、DBにはSHA-256ハッシュだけを保持します。保護対象ページは署名とcookie期限をmiddlewareで確認し、APIはさらにDBのセッションと所有者を照合します。

状態を変更するAPIは同一オリジンかつ`application/json`のリクエストだけを受け付け、本文サイズを制限します。ログインと登録には試行回数・同時パスワード計算の上限も設けています。複数インスタンスで配備する場合は、外部の共有rate-limitストアへ置き換えてください。

## 品質確認

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

同じ検査は`.github/workflows/ci.yml`でもpushとpull requestごとに実行されます。
