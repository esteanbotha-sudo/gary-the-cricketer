// Scenery, props, HUD and overlay graphics.
'use strict';

const COL = {
  skyTop: '#bfe0f2', skyBot: '#f6f0e2', grassA: '#9cc979', grassB: '#8dbd6a', grassFar: '#a9cf88',
  pitch: '#e2c98f', pitchDark: '#cfb377', red: '#e2283c', yellow: '#f6c531', navy: '#1b2a4a', ink: '#20232b',
};

const R0 = rng(7);
const CLOUDS = Array.from({ length: 7 }, (_, i) => ({ x: R0() * 2400 - 200, y: 70 + R0() * 260, s: 0.6 + R0() * 0.8, v: 6 + R0() * 10 }));
const CROWD = (() => {
  const r = rng(11), out = [];
  const cols = ['#d94a4a', '#f2c230', '#3b6fc4', '#ffffff', '#2f9e5b', '#f08a3c', '#8e5bd0', '#1f3a6e', '#e86aa0'];
  for (let row = 0; row < 5; row++) for (let i = 0; i < 150; i++) out.push({ x: i * 13.2 + (row % 2) * 6 + r() * 4, row, c: cols[Math.floor(r() * cols.length)], ph: r() * 6.28 });
  return out;
})();

// Sky, clouds, stadium stand, outfield. cheer: 0..1 crowd excitement
function drawBackdrop(ctx, t, o = {}) {
  const horizon = o.horizon ?? 700;
  const g = ctx.createLinearGradient(0, 0, 0, horizon);
  g.addColorStop(0, COL.skyTop); g.addColorStop(1, COL.skyBot);
  ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, horizon + 200);
  // sun glow
  const sg = ctx.createRadialGradient(1500, 120, 10, 1500, 120, 420);
  sg.addColorStop(0, 'rgba(255,248,220,0.9)'); sg.addColorStop(1, 'rgba(255,248,220,0)');
  ctx.fillStyle = sg; ctx.fillRect(1000, -300, 1000, 900);
  // clouds
  for (const c of CLOUDS) {
    const x = ((c.x + t * c.v) % 2400) - 250;
    drawCloud(ctx, x, c.y, c.s, 'rgba(255,255,255,0.85)');
  }
  if (o.noStand) { drawGrass(ctx, horizon, o); return; }
  // floodlights
  for (const fx of [140, 1780]) {
    ctx.fillStyle = '#9aa6b2'; ctx.fillRect(fx - 5, horizon - 330, 10, 300);
    ctx.fillStyle = '#7d8996'; rrect(ctx, fx - 46, horizon - 372, 92, 46, 6); ctx.fill();
    ctx.fillStyle = '#fffbe6';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.arc(fx - 33 + i * 22, horizon - 360 + j * 22, 7, 0, 7); ctx.fill(); }
  }
  // stand
  const sTop = horizon - 150;
  ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.moveTo(-50, horizon); ctx.lineTo(-50, sTop + 10); ctx.lineTo(W + 50, sTop + 10); ctx.lineTo(W + 50, horizon); ctx.fill();
  // roof
  ctx.fillStyle = '#e9ecf1'; ctx.beginPath(); ctx.moveTo(-50, sTop - 30); ctx.lineTo(W + 50, sTop - 30); ctx.lineTo(W + 50, sTop + 4); ctx.lineTo(-50, sTop + 4); ctx.fill();
  ctx.fillStyle = '#b5bcc8'; ctx.fillRect(-50, sTop + 4, W + 100, 8);
  for (let x = 60; x < W; x += 260) { ctx.fillStyle = '#aab2bf'; ctx.fillRect(x, sTop + 10, 8, 130); }
  // crowd
  const cheer = o.cheer || 0;
  for (const p of CROWD) {
    const y = sTop + 32 + p.row * 22;
    const jump = cheer * Math.max(0, Math.sin(t * 9 + p.ph)) * 7;
    ctx.fillStyle = p.c; ctx.globalAlpha = 0.5;
    ctx.fillRect(p.x - 4, y + 6 - jump, 9, 11);
    ctx.fillStyle = '#e6b991'; ctx.beginPath(); ctx.arc(p.x + 0.5, y + 2 - jump, 4.2, 0, 7); ctx.fill();
    if (cheer > 0.3 && Math.sin(p.ph * 3) > 0.4) { ctx.strokeStyle = '#e6b991'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x - 3, y + 7 - jump); ctx.lineTo(p.x - 7, y - 6 - jump); ctx.moveTo(p.x + 4, y + 7 - jump); ctx.lineTo(p.x + 8, y - 6 - jump); ctx.stroke(); }
  }
  ctx.globalAlpha = 1;
  // atmospheric haze pushes the stand back
  const hz = ctx.createLinearGradient(0, sTop - 30, 0, horizon);
  hz.addColorStop(0, 'rgba(240,244,248,0.35)'); hz.addColorStop(1, 'rgba(240,244,248,0.15)');
  ctx.fillStyle = hz; ctx.fillRect(-50, sTop - 30, W + 100, horizon - sTop + 30);
  // ad boards
  const boards = ['GARY\'S BATS', 'CRICKET+', 'SIXES & CO', 'WICKET WATER', 'HOWZAT!', 'THE BEST WICKETS'];
  const bc = ['#1f3a6e', '#e2283c', '#2f9e5b', '#f2c230', '#1b2a4a', '#f08a3c'];
  for (let i = 0; i < 9; i++) {
    const x = i * 230 - ((t * (o.boardScroll || 0)) % 230) - 30;
    ctx.fillStyle = bc[i % bc.length]; ctx.fillRect(x, horizon - 34, 226, 34);
    ctx.font = font(900, 20, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = i % bc.length === 3 ? COL.navy : '#fff'; ctx.fillText(boards[i % boards.length], x + 113, horizon - 16);
  }
  ctx.textBaseline = 'alphabetic';
  drawGrass(ctx, horizon, o);
}

function drawGrass(ctx, horizon, o) {
  ctx.fillStyle = COL.grassFar; ctx.fillRect(-200, horizon, W + 400, H - horizon + 200);
  // perspective mowing stripes (vanishing point high above centre)
  const vx = W / 2, vy = horizon - 900;
  for (let i = -14; i < 16; i++) {
    if (i % 2) continue;
    const x0 = W / 2 + i * 140, x1 = W / 2 + (i + 1) * 140;
    const f = (y) => (y - vy) / (H - vy);
    ctx.fillStyle = COL.grassB; ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(vx + (x0 - vx) * f(horizon), horizon); ctx.lineTo(vx + (x1 - vx) * f(horizon), horizon);
    ctx.lineTo(x1, H + 10); ctx.lineTo(x0, H + 10); ctx.fill();
  }
  ctx.globalAlpha = 1;
  const gg = ctx.createLinearGradient(0, horizon, 0, horizon + 60);
  gg.addColorStop(0, 'rgba(60,90,40,0.18)'); gg.addColorStop(1, 'rgba(60,90,40,0)');
  ctx.fillStyle = gg; ctx.fillRect(-200, horizon, W + 400, 60);
}

function drawPitch(ctx, x0 = 150, x1 = 1800) {
  // pitch strip seen low-angle: trapezoid band around feet line
  ctx.fillStyle = COL.pitch;
  ctx.beginPath(); ctx.moveTo(x0 + 20, GY - 26); ctx.lineTo(x1 - 20, GY - 26); ctx.lineTo(x1 + 10, GY + 22); ctx.lineTo(x0 - 10, GY + 22); ctx.closePath(); ctx.fill();
  ctx.fillStyle = COL.pitchDark; ctx.fillRect(x0 - 10, GY + 16, x1 - x0 + 20, 6);
  // wear patches
  ctx.fillStyle = 'rgba(160,120,60,0.18)';
  for (const px of [380, 520, 1430, 1560]) { ctx.beginPath(); ctx.ellipse(px, GY - 2, 70, 12, 0, 0, 7); ctx.fill(); }
  // creases
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4;
  for (const cx of [CREASE_B, CREASE_G]) { ctx.beginPath(); ctx.moveTo(cx - 8, GY - 26); ctx.lineTo(cx + 6, GY + 22); ctx.stroke(); }
  for (const cx of [STUMP_B, STUMP_G]) { ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(cx - 6, GY - 26); ctx.lineTo(cx + 4, GY + 22); ctx.stroke(); ctx.globalAlpha = 1; }
}

const STUMP_B = 300, STUMP_G = 1662, CREASE_B = 380, CREASE_G = 1582, UMP_X = 190, GARY_X = 1556;
const STUMP_H = 118;

// stumps with optional per-part transforms: st = {s:[{dx,dy,r}...3], b:[{dx,dy,r}...2], glow}
function drawStumps(ctx, x, st = {}) {
  const parts = st.s || [{}, {}, {}];
  const offs = [-9, 0, 9];
  ctx.fillStyle = 'rgba(30,50,20,0.25)'; ctx.beginPath(); ctx.ellipse(x, GY + 2, 26, 6, 0, 0, 7); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const p = parts[i] || {};
    ctx.save();
    ctx.translate(x + offs[i] + (p.dx || 0), GY + (p.dy || 0));
    ctx.rotate((p.r || 0) * DEG);
    outlined(ctx, () => { rrect(ctx, -4.5, -STUMP_H, 9, STUMP_H + 4, 4); }, i === 1 ? '#f6e7c4' : '#efdcb3', OUT, 2.2);
    ctx.fillStyle = '#c99b55'; ctx.fillRect(-4.5, -STUMP_H + 4, 3, STUMP_H - 6);
    ctx.restore();
  }
  const bails = st.b || [{}, {}];
  for (let i = 0; i < 2; i++) {
    const p = bails[i] || {};
    ctx.save();
    ctx.translate(x - 4.5 + i * 9 + (p.dx || 0), GY - STUMP_H - 4 + (p.dy || 0));
    ctx.rotate((p.r || 0) * DEG);
    outlined(ctx, () => { rrect(ctx, -6, -3.5, 12, 7, 3.5); }, '#f6e7c4', OUT, 2);
    ctx.restore();
  }
}

// Projectile helper: position at time t after t0 from p0 with velocity v and gravity g
function proj(t, t0, p0, v, g = 1800) {
  const d = Math.max(0, t - t0);
  return { x: p0.x + v.x * d, y: p0.y + v.y * d + 0.5 * g * d * d };
}
// A part (stump/bail) knocked flying: arcs under gravity, then lies on the ground.
function flyingPart(t, t0, v, spin, landR = 90, g = 1800) {
  if (t < t0) return { dx: 0, dy: 0, r: 0 };
  const d = t - t0, tl = Math.max(0.05, -2 * v.y / g);
  if (d < tl) return { dx: v.x * d, dy: v.y * d + 0.5 * g * d * d, r: spin * d };
  const e = Math.min(d - tl, 0.35);
  return { dx: v.x * tl + v.x * 0.25 * e * (1 - e), dy: -2, r: landR };
}

function drawBall(ctx, x, y, r = 9, spin = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
  outlined(ctx, () => { circlePath(ctx, 0, 0, r); }, '#d42a2a', OUT, 2.2);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.35, 0, 7); ctx.fill();
  ctx.strokeStyle = '#fbe3c8'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]);
  ctx.beginPath(); ctx.arc(-r * 0.9, 0, r, -0.9, 0.9); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}

// Ball with motion trail; path(t) -> {x,y} or null
function drawBallPath(ctx, t, path, opts = {}) {
  const p = path(t); if (!p) return null;
  const n = opts.trail ?? 8, dt = opts.dt ?? 0.012;
  for (let i = n; i >= 1; i--) {
    const q = path(t - i * dt); if (!q) continue;
    ctx.fillStyle = `rgba(226,40,60,${0.32 * (1 - i / (n + 1))})`;
    ctx.beginPath(); ctx.arc(q.x, q.y, 8 * (1 - i / (n + 2)), 0, 7); ctx.fill();
  }
  if (opts.shadow !== false && p.y < GY + 30) {
    const h = clamp((GY - p.y) / 500);
    ctx.fillStyle = `rgba(30,50,20,${0.25 * (1 - h)})`; ctx.beginPath(); ctx.ellipse(p.x, GY + 4, 10 * (1 - h * 0.5), 3, 0, 0, 7); ctx.fill();
  }
  drawBall(ctx, p.x, p.y, opts.r || 9, t * 20);
  return p;
}

function drawCloud(ctx, x, y, s, col) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.ellipse(x, y, 80 * s, 26 * s, 0, 0, 7);
  ctx.ellipse(x - 34 * s, y - 10 * s, 36 * s, 26 * s, 0, 0, 7);
  ctx.ellipse(x + 22 * s, y - 20 * s, 44 * s, 34 * s, 0, 0, 7);
  ctx.fill();
}

function drawRainCloud(ctx, x, y, t, a = 1) {
  ctx.globalAlpha = a;
  const s = 0.85;
  ctx.fillStyle = '#8e98a6';
  ctx.beginPath();
  ctx.ellipse(x, y, 70 * s, 24 * s, 0, 0, 7); ctx.ellipse(x - 30 * s, y - 12 * s, 34 * s, 26 * s, 0, 0, 7); ctx.ellipse(x + 20 * s, y - 22 * s, 40 * s, 32 * s, 0, 0, 7);
  ctx.fill();
  ctx.fillStyle = '#a7b0bc'; ctx.beginPath(); ctx.ellipse(x + 14 * s, y - 30 * s, 22 * s, 12 * s, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = '#6f9fd8'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const px = x - 50 + i * 12.5, ph = ((t * 1.6 + i * 0.37) % 1);
    const py = y + 18 + ph * 110;
    ctx.globalAlpha = a * (1 - ph);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 3, py + 12); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ---------- HUD ----------
function drawHUD(ctx, t, num, title, opts = {}) {
  if (title) {
    const a = opts.titleIn !== undefined ? Ease.out3(prog(opts.titleIn, opts.titleIn + 0.35, t)) : 1;
    ctx.save(); ctx.globalAlpha = a; ctx.translate((1 - a) * -40, 0);
    if (num) {
      ctx.font = font(900, 24, F_TITLE);
      const tw = ctx.measureText(num).width;
      ctx.fillStyle = COL.yellow; rrect(ctx, 34, 26, tw + 24, 34, 8); ctx.fill();
      ctx.strokeStyle = COL.ink; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = COL.ink; ctx.textAlign = 'left'; ctx.fillText(num, 46, 52);
    }
    ctx.font = font(900, 50, F_TITLE); ctx.textAlign = 'left';
    textOutlined(ctx, title, 34, 112, opts.dark ? '#fff' : COL.ink, opts.dark ? COL.ink : '#fff', 8);
    ctx.restore();
  }
}

// Counter of how many times Gary got out (values change at given times)
const OUT_TIMES = [16.4, 36.08, 57.15, 72.45, 82.42];
function drawCounter(ctx, t, alpha = 1) {
  if (alpha <= 0) return;
  let n = 0, last = -10;
  for (const ot of OUT_TIMES) if (t >= ot) { n++; last = ot; }
  const pop = t - last < 0.5 ? 1 + 0.35 * Math.sin(prog(last, last + 0.5, t) * Math.PI) : 1;
  ctx.save(); ctx.globalAlpha = alpha;
  const x = 1600, y = 26, w = 288, h = 96;
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; rrect(ctx, x + 5, y + 6, w, h, 14); ctx.fill();
  ctx.fillStyle = '#fff'; rrect(ctx, x, y, w, h, 14); ctx.fill();
  ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.stroke();
  ctx.font = font(900, 19, F_TITLE); ctx.fillStyle = '#5b6170'; ctx.textAlign = 'center';
  ctx.fillText('TIMES GARY OUT TODAY', x + w / 2, y + 28);
  ctx.save(); ctx.translate(x + w / 2, y + 74); ctx.scale(pop, pop);
  ctx.font = font(900, 54, F_TITLE); ctx.fillStyle = COL.red; ctx.fillText(String(n), 0, 0);
  ctx.restore();
  // little duck icon when out
  if (n > 0) {
    const dx = x + 40, dy = y + 60;
    ctx.fillStyle = '#f6c531'; ctx.beginPath(); ctx.ellipse(dx, dy + 4, 16, 11, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 10, dy - 8, 8, 0, 7); ctx.fill();
    ctx.fillStyle = '#f08a3c'; ctx.beginPath(); ctx.moveTo(dx + 17, dy - 9); ctx.lineTo(dx + 25, dy - 6); ctx.lineTo(dx + 17, dy - 4); ctx.fill();
    ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(dx + 12, dy - 10, 1.8, 0, 7); ctx.fill();
  }
  ctx.restore();
}

// ---------- captions ----------
function drawCaptions(ctx, t) {
  let cur = null, idx = -1;
  for (let i = 0; i < CAPTIONS.length; i++) {
    const c = CAPTIONS[i], end = i + 1 < CAPTIONS.length ? CAPTIONS[i + 1][0] : 114.0;
    if (t >= c[0] && t < end) { cur = c; idx = i; break; }
  }
  if (!cur) return;
  const words = cur[1].split(' '), times = cur[2];
  const appear = Ease.back(prog(cur[0], cur[0] + 0.18, t));
  ctx.save();
  ctx.font = font(800, 66, F_CAP);
  const sp = 18;
  const widths = words.map(w => ctx.measureText(w).width);
  const total = widths.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  let x = W / 2 - total / 2; const y = 1010;
  ctx.translate(W / 2, y); ctx.scale(0.85 + 0.15 * appear, 0.85 + 0.15 * appear); ctx.translate(-W / 2, -y);
  ctx.globalAlpha = clamp(appear * 1.5);
  ctx.textAlign = 'left';
  let active = 0;
  for (let i = 0; i < times.length; i++) if (t >= times[i]) active = i;
  for (let i = 0; i < words.length; i++) {
    const on = i === active;
    const k = on ? Ease.out(prog(times[i], times[i] + 0.12, t)) : 0;
    ctx.save();
    const cx = x + widths[i] / 2;
    ctx.translate(cx, y); ctx.scale(1 + 0.08 * k, 1 + 0.08 * k); ctx.translate(-cx, -y);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillText(words[i], x + 3, y + 5);
    textOutlined(ctx, words[i], x, y, on ? COL.yellow : '#ffffff', COL.ink, 12);
    ctx.restore();
    x += widths[i] + sp;
  }
  ctx.restore();
}

// ---------- overlay widgets ----------
function speech(ctx, t, t0, t1, x, y, text, opts = {}) {
  const s = popScale(t, t0, t1, 0.3, 0.15);
  if (s <= 0) return;
  ctx.save();
  ctx.font = font(400, opts.size || 40, F_HAND);
  const tw = ctx.measureText(text).width;
  const w = tw + 40, h = (opts.size || 40) + 30;
  const bx = x + (opts.dx ?? 30), by = y - h - (opts.dy ?? 40);
  ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y);
  // tail
  ctx.fillStyle = '#fff'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
  ctx.beginPath(); rrect(ctx, bx - w / 2, by, w, h, 18);
  ctx.moveTo(bx - 14, by + h - 2); ctx.lineTo(x, y); ctx.lineTo(bx + 10, by + h - 2);
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.save(); ctx.translate(4, 5); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#fff'; ctx.stroke(); ctx.fill();
  ctx.fillStyle = COL.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, bx, by + h / 2 + 2);
  ctx.restore();
}

function famousCard(ctx, t, t0, t1, name, sub) {
  const s = popScale(t, t0, t1, 0.4, 0.2);
  if (s <= 0) return;
  const cx = 960, cy = 205, w = 760, h = 132;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.rotate((1 - s) * -0.05);
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; rrect(ctx, -w / 2 + 6, -h / 2 + 8, w, h, 18); ctx.fill();
  ctx.fillStyle = '#fffdf6'; rrect(ctx, -w / 2, -h / 2, w, h, 18); ctx.fill();
  ctx.strokeStyle = '#d9a520'; ctx.lineWidth = 6; ctx.stroke();
  // tag
  ctx.font = font(900, 18, F_TITLE); const tag = 'FAMOUS EXAMPLE'; const tw = ctx.measureText(tag).width + 28;
  ctx.fillStyle = COL.yellow; rrect(ctx, -w / 2 + 40, -h / 2 - 15, tw, 30, 10); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = COL.ink; ctx.textAlign = 'left'; ctx.fillText(tag, -w / 2 + 54, -h / 2 + 6);
  // star (spins in)
  ctx.save(); ctx.translate(-w / 2 + 70, 4); ctx.rotate((1 - Ease.out3(prog(t0, t0 + 0.6, t))) * 3);
  starPath(ctx, 0, 0, 36, 16); ctx.fillStyle = '#f6c531'; ctx.fill(); ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
  ctx.fillStyle = COL.ink; ctx.font = font(900, 46, F_TITLE); ctx.fillText(name, -w / 2 + 128, -6);
  ctx.fillStyle = '#2b4a8a'; ctx.font = font(400, 32, F_HAND); ctx.fillText(sub, -w / 2 + 130, 36);
  ctx.restore();
}

function starPath(ctx, x, y, r1, r2) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const r = i % 2 ? r2 : r1, a = -Math.PI / 2 + i * Math.PI / 5; ctx[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r); }
  ctx.closePath();
}

function bigWord(ctx, t, t0, t1, x, y, text, color = COL.red, size = 110, rot = -4) {
  const s = popScale(t, t0, t1, 0.4, 0.2);
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * DEG); ctx.scale(s, s);
  ctx.font = font(900, size, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillText(text, 6, 8);
  textOutlined(ctx, text, 0, 0, color, '#fff', 14);
  ctx.restore();
}

function stamp(ctx, t, t0, t1, x, y, text) {
  if (t < t0 || t > t1) return;
  const k = prog(t0, t0 + 0.22, t);
  const s = lerp(2.6, 1, Ease.in(k)) * (k >= 1 ? 1 + 0.06 * Math.sin(prog(t0 + 0.22, t0 + 0.5, t) * Math.PI) : 1);
  const a = clamp(k * 3) * (1 - prog(t1 - 0.2, t1, t));
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(-7 * DEG); ctx.scale(s, s);
  ctx.font = font(900, 120, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width + 80;
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; rrect(ctx, -tw / 2, -85, tw, 170, 22); ctx.fill();
  ctx.strokeStyle = COL.red; ctx.lineWidth = 12; ctx.stroke();
  ctx.lineWidth = 3; rrect(ctx, -tw / 2 + 14, -71, tw - 28, 142, 14); ctx.stroke();
  ctx.fillStyle = COL.red; ctx.fillText(text, 0, 6);
  ctx.restore();
}

function pill(ctx, t, t0, t1, x, y, text, bg = COL.ink, fg = COL.yellow) {
  const s = popScale(t, t0, t1, 0.25, 0.2);
  if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.font = font(900, 26, F_TITLE); const tw = ctx.measureText(text).width + 36;
  ctx.fillStyle = bg; rrect(ctx, -tw / 2, -20, tw, 40, 20); ctx.fill();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2);
  ctx.restore();
}

function label(ctx, t, t0, t1, x, y, text, color = COL.red, size = 26) {
  const a = clamp(prog(t0, t0 + 0.25, t)) * (1 - prog(t1 - 0.2, t1, t));
  if (a <= 0 || t > t1) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = font(900, size, F_TITLE); ctx.textAlign = 'center';
  textOutlined(ctx, text, x, y, color, '#fff', 7);
  ctx.restore();
}

// Measurement line with end ticks, drawing in over time
function dimLine(ctx, t, t0, t1, xa, xb, y, text) {
  const k = Ease.out3(prog(t0, t0 + 0.5, t)) * (1 - prog(t1 - 0.2, t1, t));
  if (k <= 0 || t > t1) return;
  const xe = lerp(xa, xb, Ease.out3(prog(t0, t0 + 0.5, t)));
  ctx.save(); ctx.globalAlpha = clamp(k * 2);
  ctx.strokeStyle = COL.red; ctx.lineWidth = 4; ctx.setLineDash([12, 8]);
  ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xe, y); ctx.stroke(); ctx.setLineDash([]);
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(xa, y - 14); ctx.lineTo(xa, y + 14); ctx.moveTo(xe, y - 14); ctx.lineTo(xe, y + 14); ctx.stroke();
  ctx.font = font(900, 28, F_TITLE); ctx.textAlign = 'center';
  textOutlined(ctx, text, (xa + xb) / 2, y - 18, COL.red, '#fff', 7);
  ctx.restore();
}

function impactBurst(ctx, t, t0, x, y, size = 1, col = '#fff3a0') {
  const k = prog(t0, t0 + 0.4, t);
  if (k <= 0 || k >= 1) return;
  ctx.save(); ctx.globalAlpha = 1 - k;
  ctx.strokeStyle = col; ctx.lineWidth = 6 * size; ctx.lineCap = 'round';
  for (let i = 0; i < 10; i++) {
    const a = i * Math.PI / 5 + 0.3, r0 = 20 * size + 60 * size * k, r1 = r0 + 30 * size * (1 - k);
    ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke();
  }
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 10 + 70 * size * k, 0, 7); ctx.stroke();
  ctx.restore();
}

function dust(ctx, t, t0, x, y, n = 6, spread = 60) {
  const k = prog(t0, t0 + 0.7, t);
  if (k <= 0 || k >= 1) return;
  const r = rng(Math.floor(x * 13 + t0 * 100));
  for (let i = 0; i < n; i++) {
    const dx = (r() - 0.5) * 2 * spread * Ease.out(k), dy = -r() * 30 * Ease.out(k);
    ctx.fillStyle = `rgba(200,170,120,${0.5 * (1 - k)})`;
    ctx.beginPath(); ctx.arc(x + dx, y + dy, (6 + r() * 10) * (0.5 + k), 0, 7); ctx.fill();
  }
}

function glowRing(ctx, t, t0, t1, x, y, r) {
  const a = clamp(prog(t0, t0 + 0.2, t)) * (1 - prog(t1 - 0.2, t1, t));
  if (a <= 0 || t > t1) return;
  const pulse = 1 + 0.12 * Math.sin(t * 14);
  ctx.save(); ctx.globalAlpha = a;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * pulse);
  g.addColorStop(0, 'rgba(255,230,90,0.75)'); g.addColorStop(1, 'rgba(255,230,90,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * pulse, 0, 7); ctx.fill();
  ctx.strokeStyle = COL.yellow; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r * 0.55 * pulse, 0, 7); ctx.stroke();
  ctx.restore();
}

// Diagonal wipe between segments. Returns true once scene should have switched.
function drawWipe(ctx, t, T, label) {
  const d = 0.32;
  if (t < T - d || t > T + d) return;
  let x0, x1;
  if (t < T) { const k = Ease.inOut(prog(T - d, T, t)); x0 = -400; x1 = lerp(-400, W + 400, k); }
  else { const k = Ease.inOut(prog(T, T + d, t)); x0 = lerp(-400, W + 400, k); x1 = W + 400; }
  ctx.save();
  const sk = 300;
  ctx.fillStyle = COL.navy;
  ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x1, 0); ctx.lineTo(x1 - sk, H); ctx.lineTo(x0 - sk, H); ctx.fill();
  ctx.fillStyle = COL.yellow;
  ctx.beginPath(); ctx.moveTo(x1, 0); ctx.lineTo(x1 + 40, 0); ctx.lineTo(x1 + 40 - sk, H); ctx.lineTo(x1 - sk, H); ctx.fill();
  if (label) {
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x1, 0); ctx.lineTo(x1 - sk, H); ctx.lineTo(x0 - sk, H); ctx.clip();
    ctx.font = font(900, 160, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = COL.yellow; ctx.fillText(label, W / 2, H / 2 - 20);
    ctx.restore();
  }
  ctx.restore();
}
