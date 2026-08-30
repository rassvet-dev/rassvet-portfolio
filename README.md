# rassvet-portfolio

RASSVETの作品ポートフォリオ。`rassvet.jp` 用のCloudflare Pagesプロジェクトです。

## Gallery editing

- 作品本体: `public/images/works/`
- 作品・タイトル・説明: `public/index.html` の `.work` と対応する `.thumbnail`
- タイトルモーションと選択操作: `public/gallery.js`
- 作者情報・依頼条件・権利・連絡先・AXO文言: `public/index.html` の `#information`

現在は `split.jpg` をサンプル作品として使用し、残り3枠は追加位置を示すプレースホルダーです。正式公開前に仮タイトル、仮ポリシー、受付状況、連絡先を確定してください。

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
