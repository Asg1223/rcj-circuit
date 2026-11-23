/* 計算ツール（docs/tools/index.md で使う）
 * それぞれの <div class="calc" data-calc="名前"> の中の input を読んで、.out に結果を書く。 */
(function () {
  const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

  function e12Up(r) {
    if (!(r > 0)) return NaN;
    const dec = Math.pow(10, Math.floor(Math.log10(r)));
    for (const m of E12) { if (m * dec >= r * 0.9999) return m * dec; }
    return 10 * dec;
  }
  function fmtR(r) {
    if (!isFinite(r)) return "—";
    if (r >= 1e6) return (r / 1e6).toPrecision(3) + " MΩ";
    if (r >= 1e3) return (r / 1e3).toPrecision(3) + " kΩ";
    return r.toPrecision(3) + " Ω";
  }
  function num(root, name) {
    const el = root.querySelector('[name="' + name + '"]');
    return el ? parseFloat(el.value) : NaN;
  }
  function val(root, name) {
    const el = root.querySelector('[name="' + name + '"]');
    return el ? el.value : "";
  }
  function out(root, html) { root.querySelector(".out").innerHTML = html; }

  const calcs = {
    led(root) {
      const vs = num(root, "vs"), vf = num(root, "vf"), ma = num(root, "ma");
      if (!(vs > vf) || !(ma > 0)) { out(root, '<span class="warn">電源電圧は LED の電圧より大きくしてください</span>'); return; }
      const r = (vs - vf) / (ma / 1000);
      const re = e12Up(r);
      const i = (vs - vf) / re * 1000;
      const p = (vs - vf) * (i / 1000);
      out(root, `計算値 ${fmtR(r)} → E12 で上の値 <b>${fmtR(re)}</b>（電流 ${i.toFixed(1)} mA、抵抗の電力 ${(p * 1000).toFixed(0)} mW）` +
        (p > 0.0625 ? '<br><span class="warn">0.0625 W をこえるので 0603 は避け、0805 以上にする</span>' : ""));
    },
    divider(root) {
      const vin = num(root, "vin"), r1 = num(root, "r1") * 1000, r2 = num(root, "r2") * 1000, vmax = num(root, "vmax");
      if (!(r1 > 0 && r2 > 0)) { out(root, "—"); return; }
      const vout = vin * r2 / (r1 + r2);
      const ua = vin / (r1 + r2) * 1e6;
      out(root, `出力 <b>${vout.toFixed(2)} V</b>（流れる電流 ${ua.toFixed(1)} µA、ADC から見た抵抗 ${fmtR(r1 * r2 / (r1 + r2))}）` +
        (vout > vmax ? `<br><span class="warn">${vmax} V をこえます。R2 を小さく、または R1 を大きくする</span>` : ""));
    },
    ldo(root) {
      const vin = num(root, "vin"), vout = num(root, "vout"), ma = num(root, "ma"), th = num(root, "theta");
      const p = (vin - vout) * ma / 1000;
      const dt = p * th;
      out(root, `熱になる電力 <b>${p.toFixed(2)} W</b>、温度上昇 約 <b>${dt.toFixed(0)} ℃</b>（周りが 25 ℃ なら約 ${(25 + dt).toFixed(0)} ℃）` +
        (25 + dt > 100 ? '<br><span class="warn">熱すぎます。スイッチング（DC-DC）にするか、電流を減らす</span>' : ""));
    },
    trace(root) {
      const i = num(root, "amp"), dt = num(root, "dt"), oz = num(root, "oz");
      const k = val(root, "layer") === "inner" ? 0.024 : 0.048;
      const area = Math.pow(i / (k * Math.pow(dt, 0.44)), 1 / 0.725);  // mil^2
      const thick = 1.378 * oz;                                         // mil
      const wmil = area / thick;
      out(root, `必要な幅 <b>${(wmil * 0.0254).toFixed(2)} mm</b>（${wmil.toFixed(0)} mil）。余裕をみて 1.5 倍くらいにする`);
    },
    battery(root) {
      const mah = num(root, "mah"), a = num(root, "amp"), use = num(root, "use");
      const min = mah / 1000 * (use / 100) / a * 60;
      out(root, `目安 <b>${min.toFixed(0)} 分</b>（実際は温度・電池の古さで短くなる）`);
    },
    cap(root) {
      const c = num(root, "uf") / 1e6, v = num(root, "v"), w = num(root, "w"), eff = num(root, "eff") / 100;
      const e = 0.5 * c * v * v;
      const t = e / (w * eff);
      out(root, `たまるエネルギー <b>${e.toFixed(2)} J</b>、充電時間の目安 <b>${t.toFixed(2)} 秒</b>` +
        (v > 48 ? '<br><span class="warn">48 V をこえています（国際ルールの上限）</span>' : ""));
    },
    ilim(root) {
      const a = num(root, "amp");
      const r = 64 / a;
      out(root, `R_ILIM = 64 ÷ ${a} = <b>${r.toFixed(1)} kΩ</b>` +
        (r < 15 ? '<br><span class="warn">15 kΩ より小さくはできない（約 4.3 A が上限）</span>' : ""));
    },
    rc(root) {
      const r = num(root, "r"), c = num(root, "uf") / 1e6;
      const fc = 1 / (2 * Math.PI * r * c);
      out(root, `カットオフ周波数 <b>${fc >= 1000 ? (fc / 1000).toFixed(2) + " kHz" : fc.toFixed(1) + " Hz"}</b>、時定数 ${(r * c * 1000).toFixed(3)} ms`);
    },
  };

  function setup() {
    document.querySelectorAll(".calc[data-calc]").forEach((root) => {
      const f = calcs[root.dataset.calc];
      if (!f) return;
      const run = () => { try { f(root); } catch (e) { out(root, "—"); } };
      root.querySelectorAll("input,select").forEach((el) => el.addEventListener("input", run));
      run();
    });
  }
  if (typeof document$ !== "undefined") { document$.subscribe(setup); }
  else { document.addEventListener("DOMContentLoaded", setup); }
})();
