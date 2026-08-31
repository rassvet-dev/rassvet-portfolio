# rassvet-portfolio

RASSVETの作品ポートフォリオ。`rassvet.jp` 用のCloudflare Pagesプロジェクトです。

## Gallery editing

- 作品本体: `public/images/works/`
- 作品・タイトル・説明: `public/index.html` の `.work` と対応する `.thumbnail`
- タイトルモーションと選択操作: `public/gallery.js`
- 作者情報・依頼条件・権利・連絡先・AXO文言: `public/index.html` の `#information`

現在は `SPLIT`、`No way out.`、`越冬`、`まばゆ雨`、`Distance`、`Akane` の6作品を掲載しています。デスクトップの展示面はファーストビューより縦へ長くし、黒い余白を含む `contain` 表示で作品と顔を切りません。モバイルでは作品ごとの顔座標を使い、縦方向を確保した `cover` 表示にします。サムネイルも `contain` で全体を表示します。作品画像または `View actual size` を選ぶと元画像の実寸表示を開き、顔位置から開始してスクロール、タッチ移動、マウス／ペンのドラッグで全体を確認できます。タイトルは顔を覆わない大きさに抑えます。`SPLIT` は通常表示のみ、幅700px以下で専用の縦構図 `split-mobile.jpg` へ切り替えます。実寸表示では元の `split.jpg` を使用します。各作品には検索・エージェント参照用の構造化データ／ページ下部の作品一覧があります。正式公開前に仮ポリシー、受付状況、連絡先を確定してください。

各作品は `#work-01` から `#work-06` のURL断片で直接表示できます。

## 顔位置

各 `.work` の `data-face-x` / `data-face-y` が、実寸表示を開いたときの初期位置とモバイル表示の焦点です。`npm run faces:detect` はmacOS Core Imageの顔検出結果をJSONで出力します。ただし、現行の強くデフォルメされたイラスト6点は標準顔検出で0件になるため、現在の座標は作品を確認して補正した値です。顔検出が0件でも切れないよう、デスクトップ本体とサムネイルは常に `contain` 表示にしています。

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js: `22`

```bash
npm run build
npm test
```
