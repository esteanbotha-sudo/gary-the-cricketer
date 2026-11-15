// Frame compositor: scenes + transitions + captions. Exposes window.renderFrame(t).
'use strict';
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const bufA = document.createElement('canvas'); bufA.width = W; bufA.height = H;
const bufB = document.createElement('canvas'); bufB.width = W; bufB.height = H;

function drawScene(c, sc, t) {
  c.save(); c.clearRect(0, 0, W, H); sc.fn(c, t); c.restore();
}

function renderFrame(t) {
  let i = SCENES.findIndex(s => t >= s.t0 && t < s.t1);
  if (i < 0) i = SCENES.length - 1;
  const sc = SCENES[i];
  const fadeIn = sc.fade && i > 0 && t < sc.t0 + sc.fade / 2;
  const next = SCENES[i + 1];
  const fadeOut = next && next.fade && t >= next.t0 - next.fade / 2;
  ctx.save();
  if (fadeIn || fadeOut) {
    const a = fadeIn ? SCENES[i - 1] : sc, b = fadeIn ? sc : next, T = b.t0, f = b.fade;
    const k = Ease.inOut(prog(T - f / 2, T + f / 2, t));
    drawScene(bufA.getContext('2d'), a, t); drawScene(bufB.getContext('2d'), b, t);
    ctx.drawImage(bufA, 0, 0); ctx.globalAlpha = k; ctx.drawImage(bufB, 0, 0); ctx.globalAlpha = 1;
  } else {
    drawScene(ctx, sc, t);
  }
  for (const s of SCENES) if (s.wipe) drawWipe(ctx, t, s.t0, s.wipe);
  drawCaptions(ctx, t);
  vignette(ctx, 0.18);
  const fo = Math.max(1 - prog(0, 0.35, t), prog(DURATION - 0.45, DURATION, t));
  if (fo > 0) { ctx.fillStyle = `rgba(10,14,24,${fo})`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
}
window.renderFrame = renderFrame;
window.DURATION = DURATION;

window.ready = Promise.all([
  document.fonts.load("900 40px 'Fira Sans Condensed'"), document.fonts.load("700 40px 'Fira Sans Condensed'"),
  document.fonts.load("800 40px 'Baloo 2'"), document.fonts.load("400 40px 'Patrick Hand'"),
  document.fonts.load("400 40px 'Permanent Marker'"),
]).then(() => { renderFrame(0); return true; });
