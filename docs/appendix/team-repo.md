# 付録：チーム用リポジトリ

自分のチームの実際の回路図・基板・ガーバー・部品表は、**公開しない**チーム用のリポジトリに置きます。センサの型番や基板の工夫は、チームの大事な情報です。

## 作り方

1. GitHub で **Private** のリポジトリ `rcj-circuit-team` を作ります（無料プランでも作れます）。
2. このリポジトリの `templates/team/` の中身をコピーします。
3. `.github/workflows/kicad.yml` もコピーすると、チーム用リポジトリでも ERC・DRC・ガーバーの作成が自動で動きます。

```
rcj-circuit-team/
├─ kicad/
│  ├─ projects.txt        # チームの KiCad プロジェクトの一覧
│  └─ （チームの基板）
├─ records/
│  ├─ handson.md          # ハンズオンの記録シート
│  ├─ orders.md           # 発注の記録
│  └─ inspection.md       # 車検チェックリスト
└─ .github/workflows/kicad.yml
```

## うっかり公開を防ぐ

公開リポジトリ（`rcj-circuit`）には、次のチェックが入っています（`tools/check_public.py`）。

| 止めるもの | 理由 |
|---|---|
| `kicad/projects.txt` に書いていない KiCad のファイル | チームの基板をまちがえて置かないため |
| ガーバー・ドリルなどの製造データ | Actions で作るので入れない |
| 決められた場所以外の画像・PDF | 写真に情報が写りこむのを防ぐ |
| 1 MB をこえるファイル | |
| `.private-words` に書いた言葉を含むファイル | センサの型番など、公開したくない言葉 |

`.private-words` は公開リポジトリの一番上に自分で作り、1 行に 1 語ずつ書きます（このファイル自体は `.gitignore` で公開されません）。

```
# 公開したくない言葉（例）
（自分のチームのセンサの型番）
（自分のチームの基板の名前）
```

コミットの前にチェックを動かすには：

```bash
pip install pre-commit
pre-commit install
```
