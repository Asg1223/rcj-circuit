# 計算ツール

数字を入れると、すぐに計算します（ブラウザの中だけで計算し、どこにも送りません）。式は各章を見てください。

## LED の電流制限抵抗 { #led }

[1-4](../part1-basics/1-4-diode-led.md)

<div class="calc" data-calc="led">
<label>電源電圧 [V]</label><input name="vs" type="number" step="0.1" value="5"><br>
<label>LED の電圧 Vf [V]</label><input name="vf" type="number" step="0.1" value="2.0"><br>
<label>流したい電流 [mA]</label><input name="ma" type="number" step="0.5" value="5"><br>
<div class="out"></div>
</div>

## 分圧（電池電圧の測定） { #divider }

[1-2](../part1-basics/1-2-divider.md)、[3-6](../part3-power/3-6-monitor.md)

<div class="calc" data-calc="divider">
<label>入力電圧 [V]</label><input name="vin" type="number" step="0.1" value="12.6"><br>
<label>R1（上）[kΩ]</label><input name="r1" type="number" step="1" value="100"><br>
<label>R2（下）[kΩ]</label><input name="r2" type="number" step="1" value="33"><br>
<label>ADC の上限 [V]</label><input name="vmax" type="number" step="0.1" value="3.3"><br>
<div class="out"></div>
</div>

## LDO の発熱 { #ldo }

[3-4](../part3-power/3-4-regulator.md)

<div class="calc" data-calc="ldo">
<label>入力電圧 [V]</label><input name="vin" type="number" step="0.1" value="12.6"><br>
<label>出力電圧 [V]</label><input name="vout" type="number" step="0.1" value="5"><br>
<label>出力電流 [mA]</label><input name="ma" type="number" step="10" value="300"><br>
<label>熱抵抗 θJA [℃/W]</label><input name="theta" type="number" step="5" value="60"><br>
<div class="out"></div>
</div>

熱抵抗はパッケージと基板で変わります。データシートの値を使ってください（SOT-223 で 60 ℃/W 前後、SOT-23-5 で 200 ℃/W 前後が目安）。

## 配線の幅（IPC-2221） { #trace }

[2-4](../part2-kicad/2-4-layout.md)

<div class="calc" data-calc="trace">
<label>電流 [A]</label><input name="amp" type="number" step="0.1" value="2"><br>
<label>許せる温度上昇 [℃]</label><input name="dt" type="number" step="1" value="10"><br>
<label>銅の厚さ [oz]</label><select name="oz"><option value="1" selected>1 oz（35 µm）</option><option value="2">2 oz（70 µm）</option><option value="0.5">0.5 oz（18 µm）</option></select><br>
<label>層</label><select name="layer"><option value="outer" selected>外層（表・裏）</option><option value="inner">内層</option></select><br>
<div class="out"></div>
</div>

IPC-2221 の式 $I = k\,\Delta T^{0.44} A^{0.725}$（外層 $k = 0.048$、内層 $k = 0.024$、$A$ は断面積 [mil²]）で計算しています。古い規格の近似なので、余裕をもたせてください。

## 電池の持ち時間 { #battery }

[3-1](../part3-power/3-1-battery.md)

<div class="calc" data-calc="battery">
<label>容量 [mAh]</label><input name="mah" type="number" step="100" value="1300"><br>
<label>平均電流 [A]</label><input name="amp" type="number" step="0.1" value="4"><br>
<label>使える割合 [%]</label><input name="use" type="number" step="5" value="80"><br>
<div class="out"></div>
</div>

## キッカーのコンデンサ { #cap }

[7-1](../part7-kicker/7-1-solenoid.md)、[7-2](../part7-kicker/7-2-boost.md)

<div class="calc" data-calc="cap">
<label>容量 [µF]</label><input name="uf" type="number" step="100" value="1000"><br>
<label>電圧 [V]</label><input name="v" type="number" step="1" value="40"><br>
<label>昇圧の出力電力 [W]</label><input name="w" type="number" step="1" value="10"><br>
<label>効率 [%]</label><input name="eff" type="number" step="5" value="80"><br>
<div class="out"></div>
</div>

## DRV8871 の電流制限 { #ilim }

[6-3](../part6-motors/6-3-pwm.md)

<div class="calc" data-calc="ilim">
<label>電流の上限 [A]</label><input name="amp" type="number" step="0.1" value="2"><br>
<div class="out"></div>
</div>

## RC フィルタ { #rc }

[1-3](../part1-basics/1-3-capacitor.md)

<div class="calc" data-calc="rc">
<label>R [Ω]</label><input name="r" type="number" step="10" value="100"><br>
<label>C [µF]</label><input name="uf" type="number" step="0.01" value="0.1"><br>
<div class="out"></div>
</div>
