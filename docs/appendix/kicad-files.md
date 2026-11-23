# 付録：KiCad データの一覧

すべて `kicad/` の下にあります。KiCad 10 で開けます（KiCad 7 形式で保存してあり、保存すると KiCad 10 形式になります）。

| フォルダ | 基板 | 大きさ | 層 | 主な部品 | 章 |
|---|---|---|---|---|---|
| [`h1-led`](https://github.com/Asg1223/rcj-circuit/tree/main/kicad/h1-led) | LED 基板 | 45 × 25 mm | 2 | SS14、LED × 2、スライドスイッチ | [2-7](../part2-kicad/2-7-practice.md) |
| [`power`](https://github.com/Asg1223/rcj-circuit/tree/main/kicad/power) | 電源基板 | 70 × 50 mm | 2 | XT30、P-MOSFET、R-78E5.0-1.0、AP2112K-3.3 | [3-7](../part3-power/3-7-power-board.md) |
| [`main`](https://github.com/Asg1223/rcj-circuit/tree/main/kicad/main) | メイン基板 | 102 × 60 mm | 2 | Arduino Nano 形、BSS138 × 2 | [4-6](../part4-mcu/4-6-main-board.md) |
| [`ir-ring`](https://github.com/Asg1223/rcj-circuit/tree/main/kicad/ir-ring) | IR リング基板 | 直径 90 mm | 2 | IR 受光モジュール × 8、74HC165 | [5-3](../part5-sensors/5-3-ir-ring.md) |
| [`motor`](https://github.com/Asg1223/rcj-circuit/tree/main/kicad/motor) | モータドライバ基板 | 102 × 46 mm | 2 | DRV8871DDA × 4 | [6-5](../part6-motors/6-5-motor-board.md) |
| [`kicker`](https://github.com/Asg1223/rcj-circuit/tree/main/kicad/kicker) | キッカー基板 | 64 × 52 mm | 2 | P/N-MOSFET、1000 µF 63 V、ES3D | [7-5](../part7-kicker/7-5-kicker-board.md) |

## 基板どうしのつながり

| から | コネクタ | へ | コネクタ | 線 |
|---|---|---|---|---|
| 電源基板 | J3（XT30 メス） | モータドライバ基板 | J1（XT30 オス） | VBAT・GND |
| 電源基板 | J4（XH 4P） | メイン基板 | J1（XH 4P） | +5V・VBAT_SENSE・+3V3・GND |
| 電源基板 | J5（XH 2P） | キッカー基板 | J1（XH 2P） | VBAT・GND |
| メイン基板 | J2（XH 5P） | IR リング基板 | J1（XH 5P） | IR_LOAD・IR_CLK・+5V・IR_DATA・GND |
| メイン基板 | J3（XH 5P） | モータドライバ基板 | J2（XH 5P） | M1_DIR・M1_PWM・M2_DIR・M2_PWM・GND |
| メイン基板 | J4（XH 5P） | モータドライバ基板 | J3（XH 5P） | M3_PWM・M3_DIR・M4_PWM・M4_DIR・GND |
| メイン基板 | J5（XH 4P） | キッカー基板 | J2（XH 4P） | CHG_EN・HV_SENSE・KICK・GND |

すべて 1 番どうしをつなぐ、まっすぐのケーブルです。

## 自動チェック（GitHub Actions）

`.github/workflows/kicad.yml` が、`kicad/projects.txt` に書かれたプロジェクトについて次を行います。

1. `kicad-cli sch erc`（エラーがあると失敗）
2. `kicad-cli pcb drc --schematic-parity`（エラーがあると失敗）
3. ガーバー・ドリル・回路図 PDF・部品表を作り、Artifacts（`kicad-outputs`）に置く

自分のプロジェクトを足すときは、`kicad/<名前>/<名前>.kicad_pro` の形で置き、`kicad/projects.txt` に名前を書きます。
