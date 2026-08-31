# rassvet-portfolio

RASSVETの作品ポートフォリオ。`rassvet.jp` 用のCloudflare Pagesプロジェクトです。

## Gallery editing

- 作品本体: `public/images/works/`
- 作品・タイトル・説明: `public/index.html` の `.work` と対応する `.thumbnail`
- タイトルモーションと選択操作: `public/gallery.js`
- 作者情報・依頼条件・権利・連絡先・AXO文言: `public/index.html` の `#information`

現在は `SPLIT`、`No way out.`、`越冬`、`まばゆ雨`、`Distance`、`Akane` の6作品を掲載しています。すべての作品は画面サイズに応じて比率を維持したまま表示し、`SPLIT` のみ幅700px以下で専用の縦構図 `split-mobile.jpg` へ切り替えます。各作品には一覧用サムネイルと、検索・エージェント参照用の構造化データ／ページ下部の作品一覧があります。正式公開前に仮ポリシー、受付状況、連絡先を確定してください。

各作品は `#work-01` から `#work-06` のURL断片で直接表示できます。

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
