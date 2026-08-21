# data/

サイトが利用するデータの置き場。

| パス | 内容 | Git 管理 |
| --- | --- | --- |
| `*.ts` | 手で編集するデータ。`as const` を付けて型を効かせる。 | ✅ |
| `accounts.yaml` | アカウント一覧 (`pages/accounts.tsx` が読む)。 | ✅ |
| `geo/` | `tasks/` が読む重い GeoJSON 素材。`import` はしない。 | ✅ |
| `generated/` | `pnpm scrape` が書き出すスクレイピング結果。 | ❌ (gitignore) |

`generated/` は各ページから `import` される。クローン直後は存在しないので、
`pnpm scrape` (または `pnpm build`) を先に実行すること。
環境変数が無い場合は各タスクがサンプルデータを書き出すため、CI でも動く。
