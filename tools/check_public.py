#!/usr/bin/env python3
"""うっかり公開チェック（rcj-circuit 用）

公開リポジトリに入れてはいけないものが混ざっていないかを調べる。

  python tools/check_public.py              # git に追加予定（staged）のファイルを調べる
  python tools/check_public.py --all        # 追跡中のファイルをすべて調べる（CI 用）
  python tools/check_public.py a.txt b.txt  # 指定したファイルを調べる（pre-commit 用）

止めるもの
  1. KiCad のファイル（.kicad_sch など）が、kicad/projects.txt に書かれた
     教材用プロジェクト以外の場所にある
  2. 製造データ（ガーバー、ドリル、部品座標）。GitHub Actions で作るので入れない
  3. 決められた場所（docs/assets/ と kicad/ の中）以外の画像・PDF
  4. 1 MB をこえるファイル
  5. .private-words に書いた言葉（自チームの部品の型番など）を含むファイル
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAX_BYTES = 1_000_000

KICAD_EXT = {".kicad_sch", ".kicad_pcb", ".kicad_pro", ".kicad_sym", ".kicad_mod", ".kicad_dru"}
FAB_EXT = {".gbr", ".gbrjob", ".drl", ".gtl", ".gbl", ".gto", ".gbo", ".gts", ".gbs", ".gm1", ".pos"}
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".svg", ".pdf"}
IMAGE_OK_DIRS = ("docs/assets/", "kicad/")
FORBIDDEN_DIRS = ("team/", "private/")


def tracked_files(all_files: bool) -> list[str]:
    cmd = ["git", "ls-files"] if all_files else ["git", "diff", "--cached", "--name-only", "--diff-filter=ACMR"]
    out = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, check=True).stdout
    return [line for line in out.splitlines() if line]


def allowed_kicad_dirs() -> list[str]:
    path = ROOT / "kicad" / "projects.txt"
    dirs = ["kicad/lib/"]
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.split("#", 1)[0].strip()
            if line:
                dirs.append(f"kicad/{line.strip('/')}/")
    return dirs


def private_words() -> list[str]:
    path = ROOT / ".private-words"
    if not path.exists():
        return []
    words = []
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            words.append(line.lower())
    return words


def check(files: list[str]) -> list[str]:
    problems = []
    kicad_dirs = allowed_kicad_dirs()
    words = private_words()
    for name in files:
        p = ROOT / name
        if not p.is_file():
            continue
        ext = p.suffix.lower()
        rel = name.replace("\\", "/")

        if rel.startswith(FORBIDDEN_DIRS):
            problems.append(f"{rel}: team/ や private/ の中のファイルは公開リポジトリに入れません")
        if ext in KICAD_EXT and not rel.startswith(tuple(kicad_dirs)):
            problems.append(
                f"{rel}: 教材用の KiCad プロジェクト以外の KiCad ファイルです。"
                "自チームの基板は非公開リポジトリ（rcj-circuit-team）に置いてください。"
                "教材用なら kicad/projects.txt に追加します"
            )
        if ext in FAB_EXT or rel.endswith("-gerbers.zip"):
            problems.append(f"{rel}: 製造データ（ガーバーなど）は GitHub Actions で作るので入れません")
        if ext in IMAGE_EXT and not rel.startswith(IMAGE_OK_DIRS):
            problems.append(f"{rel}: 画像・PDF は docs/assets/ か kicad/ の中にだけ置けます")
        size = p.stat().st_size
        if size > MAX_BYTES:
            problems.append(f"{rel}: {size / 1e6:.1f} MB あります（1 MB まで）")
        if words and rel != ".private-words" and size <= 20 * MAX_BYTES:
            try:
                text = p.read_text(encoding="utf-8", errors="ignore").lower()
            except OSError:
                continue
            for w in words:
                if w in text:
                    problems.append(f"{rel}: .private-words の言葉が入っています（言葉はここには表示しません）")
                    break
    return problems


def main(argv: list[str]) -> int:
    if argv and argv[0] == "--all":
        files = tracked_files(True)
    elif argv:
        files = argv
    else:
        files = tracked_files(False)
    problems = check(files)
    if problems:
        print("うっかり公開チェックで止めました：")
        for line in problems:
            print("  - " + line)
        return 1
    print(f"うっかり公開チェック OK（{len(files)} ファイル）")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
