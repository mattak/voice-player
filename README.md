# Voice Player

音声ファイルの再生と文字起こしを行うWebアプリケーションです。

## デモ

[デモサイト](https://v0-m4a-to-text-i-os-app.vercel.app/)

## 機能

- 音声ファイルのアップロード（m4a, mp3, wav形式に対応）
- 音声の再生制御（再生、一時停止、スキップ）
- 文字起こしテキストの表示と時間軸との連動
- ダークモード対応

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
