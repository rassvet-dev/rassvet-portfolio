# rassvet-portfolio

RASSVETの作品ポートフォリオ。`rassvet.jp` 用のCloudflare Pagesプロジェクトです。

## Gallery editing

- 作品本体: `public/images/works/`
- 作品・タイトル・説明: `public/index.html` の `.work` と対応する `.thumbnail`
- タイトルモーションと選択操作: `public/gallery.js`
- 作者情報・制作領域・権利情報: `public/index.html` の `#information`

現在は `SPLIT`、`No way out.`、`越冬`、`まばゆ雨`、`Distance`、`Akane` の6作品を掲載しています。展示面はファーストビュー内に収め、縦横どちらの作品も `contain` 表示で作品と顔を切りません。サムネイルも `contain` で全体を表示します。作品画像または「作品を拡大」を選ぶと元画像の実寸表示を開き、顔位置から開始してスクロール、タッチ移動、マウス／ペンのドラッグで全体を確認できます。拡大画面では全体表示との切り替えと作品の前後移動も可能です。`SPLIT` は通常表示のみ、幅700px以下で専用の縦構図 `split-mobile.jpg` へ切り替えます。実寸表示では元の `split.jpg` を使用します。構造化データと、作品へ直接移動できるページ下部の一覧があります。

## Design direction

- ブランドのテーマカラーは紫。展示背景は `#160d26`、操作・選択色は `#c5a3ff`、情報欄は淡いラベンダー。作品の色は変更しません。
- 従来の文字演出（`lyric-rise` と輪郭の遅延残像 `lyric-drift`）は作者が気に入っているため保持します。画像の切り替えは短いぼかし・マスク・方向移動を組み合わせます。
- 作品・タイトル・操作の領域を分け、モバイルの操作ボタンは48pxを基本にします。作品面は左右スワイプ、上下はページスクロール、サムネイルは横スクロールです。
- `prefers-reduced-motion` 時は画像アニメーションを停止し、文字の動きも抑えます。
- ページに制作メモや「ここへ追加」などの仮文言を表示しません。

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

### LAN preview

To open the local build from a phone or another device on the same network:

```bash
npm run build
npm run preview:lan
```

Open the `http://<MacのLANアドレス>:4173/` URL printed by the server. The preview server binds to all local interfaces only in `preview:lan` mode; the normal `npm run preview` remains localhost-only.
