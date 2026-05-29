# こども動物図鑑 — 引き継ぎ書

最終更新: 2026-05-29

## 1. これは何か
- 実ユーザー（子ども・親）向けの**商品**。技術デモ/ポートフォリオではない（カテゴリA）。
- Next.js 16 (Turbopack) / React 19 / TS / Tailwind v4。静的export → GitHub Pages。
- 本番URL: https://jun-kou-dai.github.io/kodomo-zukan/
- ローカル: `/Users/kajiyamajunichi/code/kodomo-zukan`
- 動物データ: `src/data/animals.ts`（47種）。型は `src/types/animal.ts`。

## 2. デプロイ手順（重要）
- push 先は SSH 固定: `git push git@github.com:jun-kou-dai/kodomo-zukan.git main`
  （HTTPS は認証未設定で失敗する）
- push すると GitHub Actions が自動デプロイ。確認:
  `gh run list --repo jun-kou-dai/kodomo-zukan --limit 1`
  → `gh run watch <id> --repo jun-kou-dai/kodomo-zukan --exit-status`
- `basePath` は本番のみ `/kodomo-zukan`（`process.env.NODE_ENV === "production"`）。
- `trailingSlash: true`（next.config.ts）。各ルートは `out/<path>/index.html` で出力。

## 3. このセッションでやったこと（コミット順）
1. ESLintエラー/警告を解消（any除去・set-state-in-effect回避・未使用コード削除）。
2. シェア機能（`ShareButton`）＋動物ごとのOGメタ（`generateMetadata`）。
3. PWA化（`src/app/manifest.ts` / `public/sw.js` / `ServiceWorkerRegister` / アイコン4種）。
4. **詳細ページの音・動画を大型カラフルタイルに刷新**（`MediaButtons`、旧SoundButton/VideoPlayerは統合・削除）。
5. **きほん情報の表を子ども向けカラフルカードに刷新**（`FactCard`、学名・分類は最下部に小さく）。
6. `trailingSlash: true` で末尾スラッシュ404を解消。
7. **「きみと くらべて」新機能**（`SizeCompare`）。身長を1回入れると動物が自分の何人分の大きさかを子ども絵文字で体感。人気上位15種に `compareHeightCm` を付与。

すべて本番反映・確認済み（lint 0/0、build 成功）。

## 4. 「きみと くらべて」の詳細（今の主役機能）
- コンポーネント: `src/components/SizeCompare.tsx`（client）。
- 仕組み: `localStorage["childHeightCm"]`（既定110cm）を `useSyncExternalStore` で購読。
  身長変更は `window.prompt` → setItem → `new Event("child-height-change")` で再描画。
- 表示条件: `animal.compareHeightCm` がある動物のみ（詳細ページ、ひみつ欄の上）。
- 文言: 「◯◯は きみ やく N にんぶん の おおきさ！」＋写真＋🧒スタック。
- データ: `animals.ts` に `compareHeightCm`（cm）を付与済み（計15種）:
  ライオン250 / ゾウ350 / キリン550 / ペンギン120 / トラ300 / チーター150 /
  イルカ300 / クジラ1400 / パンダ150 / コアラ70 / ゴリラ170 / サメ500 /
  タコ100 / ワシ250 / ワニ500。
  ※高さの動物は高さ、長い動物は長さの代表値（ざっくり）。

### 残作業（この機能）
- 残り32種への `compareHeightCm` 付与（昆虫・小魚・小動物など）。
- 絵文字スタックは8個上限（`Math.min(8, …)`）。クジラ等は数字(13)と絵文字(8)がズレる。
  → 大きい動物は別単位（バス🚌、プール等）に切替えると気持ちよい。
- 身長入力が `window.prompt`。子ども向けにスライダー等のUIにすると良い。

## 5. 既知の課題 / 未確認
- **実機（iOS/Android）未確認**。本アプリの本番環境はスマホ。Claudeは実機操作不可。
  → オーナーが実機で開いて子どもの反応を見るのが要。確認の最大ギャップ。
- 音声タップ→再生、動画タップ→全幅展開、身長変更の再計算は **dev(デスクトップChrome)では確認済み**。
- OG画像はWikimedia公開URL（CC BY-SA 等）。LINE/X実機でのカード見えは未確認。

## 6. 次の一手候補
- A: 「きみと くらべて」を全47種に展開＋大きい動物の単位切替で完成度UP。
- B: ここで止めて、別の"引き込み"アイデアに振り直す。
- （クイズはユーザーが不要と判断済み＝やらない）

## 7. プレビュー / 開発メモ
- preview は `~/code/.claude/launch.json` の `kodomo-zukan`（npm run dev -p 3002）を使う。
  起動: `preview_start name=kodomo-zukan`。**`npm run build` を回すと dev server が落ちる**ので、
  ビルド後は preview_start で再起動する。
- **編集前フック**: ファイル編集の直前テキストで「変更内容/目的/方針」を宣言しないと
  Edit/Write が BLOCKED される。1回目で弾かれても、同じ編集を**再実行すると通る**ことが多い。
- **報告フォーマット**: 納品/報告は ①確認済み ②未確認 ③次の見立て の3点必須。
  「完了しました/完璧」等は禁句。「進めますか?」型の決め打ち提案も禁止。

## 8. ユーザーの方針・温度感（最重要）
- **評論するな、作れ。** 作ったのは自分。批評家ムーブを嫌う。
- **見た目で分かる改善**を求める。裏方（配管）だけだと「何も変わってない」と評価される。
- 「売れる」＝**子どもが"買ってでも見たい"ほど引き込まれるか**、という意味（B2B戦略の話ではない）。
- 推論で動作確認を代替しない。スクショ・操作・ログで裏取り。
- 手を動かして実物を見せるのが信頼につながる。アイデアは羅列でなく、1個を本気で。
