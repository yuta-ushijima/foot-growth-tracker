# 足の成長記録アプリケーション

子供の足の成長を記録し、家族で共有できるWebアプリケーションです。
成長の記録をリアルタイムでグラフ化し、視覚的に成長を確認することができます。

## 技術スタック

### バックエンド
- Node.js
- Express
- Socket.IO
- MongoDB
- TypeScript

### フロントエンド
- React
- TypeScript
- Chart.js
- Socket.IO Client
- Tailwind CSS

## 必要要件

- Node.js (v16以上)
- MongoDB
- npm

## セットアップ

1. リポジトリのクローン
```bash
git clone [リポジトリURL]
cd foot-growth-tracker
```

2. 依存関係のインストール
```bash
npm install
```

3. MongoDBの起動
```bash
# MongoDBがローカルにインストールされている場合
mongod

# または、Dockerを使用する場合
docker run --name mongodb -d -p 27017:27017 mongo
```

4. 開発サーバーの起動
```bash
npm run dev
```

これにより以下のサーバーが起動します：
- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:3001

## プロジェクト構成

```
foot-growth-tracker/
├── backend/             # バックエンドのソースコード
│   ├── src/
│   │   ├── models/     # MongoDBモデル
│   │   ├── types/      # 型定義
│   │   └── server.ts   # メインサーバーファイル
│   ├── package.json
│   └── tsconfig.json
├── frontend/           # フロントエンドのソースコード
│   ├── src/
│   │   ├── components/ # Reactコンポーネント
│   │   ├── hooks/      # カスタムフック
│   │   └── types/      # 型定義
│   ├── package.json
│   └── tsconfig.json
├── shared/            # 共有の型定義やユーティリティ
│   └── types/
├── package.json      # ワークスペース設定
└── README.md
```

## 開発

### 新しいパッケージの追加

フロントエンド用のパッケージを追加：
```bash
npm install パッケージ名 -w frontend
```

バックエンド用のパッケージを追加：
```bash
npm install パッケージ名 -w backend
```

### 利用可能なスクリプト

- `npm run dev`: 開発サーバーの起動（フロントエンド・バックエンド両方）
- `npm run build`: プロジェクトのビルド
- `npm test`: テストの実行

## 機能

- 子供の足のサイズを記録
- 成長をグラフで可視化
- リアルタイムでの家族間データ共有
- 履歴の表示と管理

## ライセンス

[ライセンス情報を記載]