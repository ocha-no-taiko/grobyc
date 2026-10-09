# GROBYC — 逆サイボーグ

研究プロジェクト「逆サイボーグ」（身体が人間、精神が機械（AI）の存在）の紹介ページ。

本番: https://grobyc.ocha-no-taiko.com/

## 構成

```
index.html          ページの骨組み（中身は main.js が組み立てる）
data/site.json      文言・項目データ（ここだけ編集すれば内容を変えられる）
assets/style.css    デザイン（色は :root のトークンで管理）
assets/main.js      site.json を読み込んで描画
assets/favicon.svg  アイコン
```

ビルド不要の素の HTML/CSS/JS です。

## 内容の編集

`data/site.json` を編集します。

- `**太字**` で強調できます
- 配列（`points`、`items` など）は追加・削除・並べ替えがそのまま反映されます
- 着想の経緯（`origin.chapters[].blocks`）のブロック種別
  - `voice` … 輔のセリフ
  - `points` … 箇条書き
  - `define` … 枠付きの定義・問い
  - `magic` … 「魔術の3要素」の表（中身は `magic`）
  - `conclusion` … 結論の帯
- 逆サイボーグレベルの `parts` は「外側・内側・脳」の順に `bio`（生体）/ `machine`（機械）/ `none`（実体なし）
- `branch: true` が連続する2つは横並び（Lv.3α / 3β）、`final: true` は強調表示

## ローカル確認

```bash
python3 -m http.server 8128
```

`http://localhost:8128` を開きます（`file://` では JSON を読み込めません）。

## 公開

`main` に push すると本番に反映されます。
