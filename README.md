# rcj-circuit — RCJ サッカーの電子回路設計

ロボカップジュニア サッカー（インフラレッド）のロボットの電子回路を、KiCad で回路図から基板の発注まで設計できるようになるための教材です。

- サイト：https://asg1223.github.io/rcj-circuit/
- 読む人：RCJ に出る中高生（大学生向けの「もっと深く」つき）
- 理論 3：実装 7、ハンズオン H1〜H8

## 中身

```
rcj-circuit/
├─ zensical.toml              # サイトの設定（Zensical）
├─ docs/                      # 教材の本文（第0〜9部、ハンズオン、計算ツール、付録）
│  └─ assets/                 # 回路図・基板の SVG（KiCad から書き出したもの）
├─ kicad/                     # 教材用の KiCad プロジェクト（すべて架空の構成）
│  ├─ projects.txt            # 自動チェックの対象（ここに書いたものだけ公開リポジトリに置ける）
│  ├─ h1-led/ power/ main/ ir-ring/ motor/ kicker/
├─ templates/team/            # チーム用（非公開）リポジトリのひな形
├─ tools/check_public.py      # うっかり公開チェック
├─ .pre-commit-config.yaml
└─ .github/workflows/
   ├─ docs.yml                # 公開チェック → サイトを GitHub Pages へ
   └─ kicad.yml               # KiCad 10 で ERC・DRC、ガーバー等を Artifacts へ
```

## サイトを手元で見る

```bash
pip install -r requirements-docs.txt
zensical serve
```

## KiCad データ

KiCad 10 で開けます（KiCad 7 形式で保存しているので、開いて保存すると KiCad 10 形式になります）。
push すると GitHub Actions が KiCad 10 で ERC・DRC を走らせ、ガーバー・ドリル・回路図 PDF・部品表を `kicad-outputs` として置きます。

## 自分のチームの基板

公開リポジトリには置かず、非公開の `rcj-circuit-team` に置きます（`templates/team/` をコピー）。
くわしくは docs の「付録：チーム用リポジトリ」を見てください。

## ライセンス

MIT（本文・コード・KiCad データ）
