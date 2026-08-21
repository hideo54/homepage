# data/

サイトが利用するデータの置き場。

| パス | 内容 | Git 管理 |
| --- | --- | --- |
| `*.ts` | 手で編集するデータ。`as const` を付けて型を効かせる。 | ✅ |
| `schema/` | `generated/` の JSON の型定義 (スクレイパーごと)。 | ✅ |
| `accounts.yaml` | アカウント一覧 (`pages/accounts.tsx` が読む)。 | ✅ |
| `geo/` | `tasks/` が読む重い GeoJSON 素材。`import` はしない。 | ✅ |
| `generated/` | `pnpm scrape` が書き出すスクレイピング結果。 | ❌ (gitignore) |

`generated/` は各ページから `import` される。クローン直後は存在しないので、
`pnpm scrape` (または `pnpm build`) を先に実行すること。
環境変数が無い場合は各タスクがサンプルデータを書き出すため、CI でも動く。

## generated/ の型づけ

`resolveJsonModule` による推論は「今たまたま生成されている値」の形でしかなく、
実データとサンプルデータとで型が揺れる (例: 経県値が `number` に、
タプルが `(string | number)[]` に潰れる)。そのため:

- 型は [`schema/`](schema) に手で書く (`swarm.ts`, `maimai.ts`, `dam.ts` の 3 つ。
  スクレイパーと 1:1 対応し、それぞれ自己完結している)
- `tasks/` は出力を `satisfies` でこの型に照合する (生成側の保証)
- ページは `as unknown as` でこの型に受け直す (利用側)
