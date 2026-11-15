// Shared choreography helpers used by every episode.
'use strict';

// ---------- shared pose presets (local coords: +x = the way the character faces) ----------
const P = {
  stand: { hip: { x: 0, y: -162 }, lean: 3, fF: { x: 14, y: -8 }, fB: { x: -12, y: -8 }, hF: { x: 12, y: -152 }, hB: { x: -8, y: -154 } },
  umpire: { hip: { x: 0, y: -160 }, lean: 2, fF: { x: 16, y: -8 }, fB: { x: -14, y: -8 }, hF: { x: 30, y: -168 }, hB: { x: 26, y: -172 }, eF: -1, eB: -1, face: { mouth: 'flat', look: 0.4 } },
  umpireOut: { hip: { x: 0, y: -162 }, lean: 0, fF: { x: 16, y: -8 }, fB: { x: -14, y: -8 }, hF: { x: 26, y: -392 }, hB: { x: 22, y: -172 }, eF: 1, eB: -1, finger: true, face: { mouth: 'flat', brow: 0.6, look: 0.4 } },
  umpireSix: { hip: { x: 0, y: -162 }, lean: 0, fF: { x: 16, y: -8 }, fB: { x: -14, y: -8 }, hF: { x: 16, y: -395 }, hB: { x: -8, y: -395 }, eF: 1, eB: 1, face: { mouth: 'smile', look: 0.4 } },
  stance: { hip: { x: -4, y: -146 }, lean: 16, head: -12, fF: { x: 24, y: -8 }, fB: { x: -26, y: -8 }, bat: { a: -10 }, grip: { x: 14, y: -138 }, face: { mouth: 'flat', eye: 'open', brow: 0.4, look: 0.6 } },
  backlift: { hip: { x: -2, y: -148 }, lean: 12, head: -10, fF: { x: 30, y: -8 }, fB: { x: -26, y: -8 }, bat: { a: 212 }, grip: { x: -6, y: -186 }, face: { mouth: 'flat', eye: 'open', brow: 0.6, look: 0.6 } },
  downLate: { hip: { x: 2, y: -144 }, lean: 18, head: -12, fF: { x: 30, y: -8 }, fB: { x: -26, y: -8 }, bat: { a: 8 }, grip: { x: 24, y: -150 }, face: { mouth: 'o', eye: 'wide', brow: -0.5, look: 0.2 } },
  block: { hip: { x: 8, y: -138 }, lean: 26, head: -16, fF: { x: 50, y: -8 }, fB: { x: -28, y: -8 }, bat: { a: 12 }, grip: { x: 44, y: -150 }, face: { mouth: 'flat', eye: 'open', brow: 0.5, look: 0.6 } },
  partner: { hip: { x: 0, y: -158 }, lean: 6, head: -2, fF: { x: 18, y: -8 }, fB: { x: -14, y: -8 }, bat: { a: 8 }, grip: { x: 26, y: -150 }, face: { mouth: 'smile', look: 0.6 } },
  partnerNo: { hip: { x: -4, y: -160 }, lean: -6, head: 4, fF: { x: 20, y: -8 }, fB: { x: -16, y: -8 }, hF: { x: 88, y: -262 }, hB: { x: -10, y: -150 }, eF: 1, eB: -1, face: { mouth: 'open', eye: 'wide', brow: 0.9, look: 0.8 } },
  celebrate: { hip: { x: 0, y: -166 }, lean: -4, head: 8, fF: { x: 14, y: -8 }, fB: { x: -12, y: -8 }, hF: { x: 70, y: -370 }, hB: { x: -58, y: -366 }, eF: 1, eB: -1, face: { mouth: 'grin', eye: 'happy', brow: -0.2 } },
  handsOnHead: { hip: { x: 0, y: -162 }, lean: -2, head: 6, fF: { x: 14, y: -8 }, fB: { x: -12, y: -8 }, hF: { x: 6, y: -318 }, hB: { x: -14, y: -320 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'wide', brow: -0.8, look: 0.2, lookY: -0.8 } },
  keeper: { hip: { x: 2, y: -98 }, lean: 42, head: -34, fF: { x: 30, y: -8 }, fB: { x: -26, y: -8 }, hF: { x: 60, y: -116 }, hB: { x: 54, y: -108 }, eF: -1, eB: -1, face: { mouth: 'flat', brow: 0.5, look: 0.8 } },
};

function breathe(pose, t, amp = 1.5, ph = 0) {
  const b = Math.sin(t * 2.4 + ph) * amp;
  const p = mix(pose, {}, 1);
  p.hip = { x: (pose.hip || { x: 0 }).x, y: (pose.hip || { y: -162 }).y + b };
  return p;
}

function withBat(p, a = 50) { const q = mix(p, {}, 1); q.bat = { a }; q.grip = { x: p.hB.x, y: p.hB.y }; return q; }

// World position of a skeleton point (supports whole-body rotation)
function personPoint(X, Y, dir, S, pose, key) {
  const p = fullPose(pose), s = skeleton(p);
  let q = key === 'hF' ? s.hF : key === 'hB' ? s.hB : key === 'head' ? s.headC : key === 'fB' ? s.legB.end : key === 'fF' ? s.legF.end : key === 'batTip' ? add(s.batTop, s.batDir, L.bat) : s.hip;
  if (p.rot) {
    const c = Math.cos(p.rot * DEG), sn = Math.sin(p.rot * DEG), dx = q.x - s.hip.x, dy = q.y - s.hip.y;
    q = { x: s.hip.x + dx * c - dy * sn, y: s.hip.y + dx * sn + dy * c };
  }
  return { x: X + q.x * dir * S, y: Y + q.y * S };
}

// Bowler: run-up then delivery stride. Returns {x, pose, release:{x,y}}
function bowlerAt(t, o) {
  // o: {tRun, tStride, xStride, speed, A}
  const A = o.A || 42;
  const tRel = o.tStride + 0.3;
  if (t < o.tStride) {
    const x = o.xStride - (o.tStride - t) * o.speed;
    return { x, pose: cyclePose(x - o.xStart0, { A, lift: 40, lean: 16, hipY: -150 }) };
  }
  const tl = t - o.tStride;
  const keys = [
    [0, { hip: { x: 4, y: -162 }, lean: 6, head: -4, fF: { x: 34, y: -64 }, fB: { x: -4, y: -8 }, hF: { x: 34, y: -282 }, hB: { x: 14, y: -272 }, eF: 1, eB: 1, face: { mouth: 'flat', brow: 0.7, look: 0.8 } }],
    [0.17, { hip: { x: 0, y: -158 }, lean: -14, head: 10, fF: { x: 62, y: -8 }, fB: { x: -40, y: -8 }, hF: { x: 58, y: -330 }, hB: { x: -84, y: -196 }, eF: 1, eB: -1, face: { mouth: 'flat', brow: 0.8, look: 0.8 } }, 'out'],
    [0.3, { hip: { x: 14, y: -150 }, lean: 22, head: -16, fF: { x: 62, y: -8 }, fB: { x: -30, y: -26 }, hF: { x: -40, y: -192 }, hB: { x: 34, y: -372 }, eF: -1, eB: 1, face: { mouth: 'open', brow: 0.9, look: 0.8 } }, 'in'],
    [0.55, { hip: { x: 40, y: -134 }, lean: 40, head: -30, fF: { x: 68, y: -8 }, fB: { x: 10, y: -52 }, hF: { x: -50, y: -160 }, hB: { x: 72, y: -108 }, eF: -1, eB: 1, face: { mouth: 'open', brow: 0.6, look: 0.8 } }, 'out'],
    [0.95, { hip: { x: 42, y: -156 }, lean: 10, head: -6, fF: { x: 58, y: -8 }, fB: { x: 30, y: -8 }, hF: { x: 52, y: -152 }, hB: { x: 30, y: -150 }, eF: -1, eB: -1, face: { mouth: 'flat', brow: 0.3, look: 0.8 } }],
  ];
  const pose = track(tl, keys);
  const x = o.xStride + 70 * Ease.out(clamp(tl / 0.95));
  const xRel = o.xStride + 70 * Ease.out(clamp(0.3 / 0.95));
  return { x, pose, release: { x: xRel + 34, y: GY - 372 }, tRel };
}
function mkBowler(tStride, xStride, speed) { return { tStride, xStride, speed, xStart0: xStride - 2000 }; }

function hud(ctx, t, num, title, t0, opts = {}) {
  drawHUD(ctx, t, num, title, { titleIn: t0 + 0.15, dark: opts.dark });
  drawCounter(ctx, t, opts.counter ?? 1);
}

function camApply(ctx, cam) {
  if (!cam) return;
  ctx.translate(W / 2 + (cam.sx || 0), H / 2 + (cam.sy || 0));
  ctx.scale(cam.z, cam.z);
  ctx.translate(-cam.x, -cam.y);
}
function shake(t, t0, amt = 14, dur = 0.35) {
  const k = prog(t0, t0 + dur, t);
  if (k <= 0 || k >= 1) return { sx: 0, sy: 0 };
  const a = amt * (1 - k);
  return { sx: Math.sin(t * 90) * a, sy: Math.cos(t * 77) * a };
}
function vignette(ctx, strength = 0.35) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(10,20,40,${strength})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function fieldBase(ctx, t, cheer = 0) {
  drawBackdrop(ctx, t, { cheer });
  drawPitch(ctx);
}


// ---------- extra helpers for the player episodes ----------
// Piecewise ball path: keys = [[t, x, y, arc?], ...] (arc = upward bulge for the segment ending at that key)
function pathOf(keys, hold = false) {
  return t => {
    if (t < keys[0][0]) return null;
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const [t0, x0, y0] = keys[i - 1], [t1, x1, y1, arc = 0] = keys[i];
        const u = (t - t0) / (t1 - t0);
        return { x: lerp(x0, x1, u), y: lerp(y0, y1, u) - Math.sin(u * Math.PI) * arc };
      }
    }
    if (!hold) return null;
    const k = keys[keys.length - 1]; return { x: k[1], y: k[2] };
  };
}

// name tag above a character
function nameTag(ctx, t, t0, t1, x, y, text, bg = COL.yellow, fg = COL.ink) {
  const s = popScale(t, t0, t1, 0.3, 0.2); if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.font = font(900, 26, F_TITLE); const tw = ctx.measureText(text).width + 30;
  ctx.fillStyle = bg; rrect(ctx, -tw / 2, -20, tw, 40, 12); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-9, 19); ctx.lineTo(0, 32); ctx.lineTo(9, 19); ctx.closePath(); ctx.fillStyle = bg; ctx.fill(); ctx.stroke();
  ctx.fillRect(-8, 15, 16, 6);
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2);
  ctx.restore();
}

// big banner for the "GARY'S TURN" half of each segment
function turnBanner(ctx, t, t0, text = "GARY'S TURN") {
  const k = prog(t0 - 0.05, t0 + 0.35, t), out = prog(t0 + 1.4, t0 + 1.8, t);
  if (k <= 0 || out >= 1) return;
  const x = lerp(-700, 960, Ease.out3(k)) + lerp(0, 2600, Ease.in(out));
  ctx.save(); ctx.translate(x, 300); ctx.rotate(-4 * DEG);
  ctx.fillStyle = COL.navy; rrect(ctx, -330, -62, 660, 124, 20); ctx.fill();
  ctx.strokeStyle = COL.yellow; ctx.lineWidth = 8; ctx.stroke();
  ctx.font = font(900, 84, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = COL.yellow; ctx.fillText(text, 0, 6);
  ctx.restore();
}

// rounded info panel with rows of [label, value] and optional highlight colour per row
function scoreboard(ctx, t, t0, t1, x, y, title, rows, opts = {}) {
  const s = popScale(t, t0, t1, 0.35, 0.2); if (s <= 0) return;
  const w = opts.w || 520, rh = opts.rh || 64, h = 76 + rows.length * rh;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; rrect(ctx, -w / 2 + 8, 10, w, h, 18); ctx.fill();
  ctx.fillStyle = '#14223f'; rrect(ctx, -w / 2, 0, w, h, 18); ctx.fill();
  ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = font(900, 30, F_TITLE); ctx.textAlign = 'center'; ctx.fillStyle = COL.yellow; ctx.fillText(title, 0, 46);
  rows.forEach(([lab, val, col], i) => {
    const yy = 76 + i * rh + rh * 0.62;
    ctx.textAlign = 'left'; ctx.font = font(700, 30, F_TITLE); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillText(lab, -w / 2 + 34, yy);
    ctx.textAlign = 'right'; ctx.font = font(900, 46, F_TITLE); ctx.fillStyle = col || '#fff'; ctx.fillText(String(val), w / 2 - 34, yy + 4);
  });
  ctx.restore();
}

function dizzy(ctx, t, x, y, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 4; i++) {
    const ang = t * 5 + i * Math.PI / 2;
    starPath(ctx, x + Math.cos(ang) * 46, y + Math.sin(ang) * 14, 11, 5);
    ctx.fillStyle = COL.yellow; ctx.fill(); ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
}

function sweat(ctx, t, x, y, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 3; i++) {
    const ph = (t * 1.8 + i / 3) % 1;
    const sx = x + (i - 1) * 26, sy = y + ph * 40;
    ctx.globalAlpha = a * (1 - ph);
    ctx.fillStyle = '#7cc4ff'; ctx.strokeStyle = '#2a6fb0'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(sx, sy - 12); ctx.quadraticCurveTo(sx + 9, sy + 2, sx, sy + 6); ctx.quadraticCurveTo(sx - 9, sy + 2, sx, sy - 12); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// kneeling batter pose generator (local coords, facing +x)
function kneel(o = {}) {
  return mix({ hip: { x: -8, y: -96 }, lean: 12, head: -10, fF: { x: 52, y: -8 }, fB: { x: -58, y: -14 }, toeB: 70, face: { mouth: 'flat', brow: 0.5, look: 0.6 } }, o, 1);
}

// push-up / lying poses. Returns {pose, Y} where Y is the origin y to draw at (body horizontal, facing +x)
function plank(hipH, o = {}) {
  const pose = mix({
    hip: { x: 0, y: -160 }, rot: 90, lean: 0, head: -10,
    fF: { x: hipH, y: -2 }, fB: { x: hipH - 4, y: -10 },
    hF: { x: hipH + 4, y: -96 }, hB: { x: hipH, y: -88 }, eF: -1, eB: -1, toeF: -90, toeB: -90,
    face: { mouth: 'flat', brow: 0.4, look: 0.8 },
  }, o, 1);
  return { pose, Y: GY - hipH + 160 };
}

// simple top-down field inset showing fielders and a shot line
function fieldInset(ctx, t, t0, t1, x, y, r, fielders, shotAng, shotT, label) {
  const s = popScale(t, t0, t1, 0.35, 0.2); if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.arc(6, 8, r + 10, 0, 7); ctx.fill();
  ctx.fillStyle = '#7fbf5a'; ctx.beginPath(); ctx.arc(0, 0, r + 10, 0, 7); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
  ctx.fillStyle = COL.pitch; ctx.fillRect(-9, -40, 18, 80);
  for (const [a, d] of fielders) { ctx.fillStyle = '#7a1f2b'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(Math.cos(a) * r * d, Math.sin(a) * r * d, 9, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#1f3a6e'; ctx.beginPath(); ctx.arc(0, 30, 8, 0, 7); ctx.fill();
  const k = Ease.out3(prog(shotT, shotT + 0.8, t));
  if (k > 0) {
    ctx.strokeStyle = COL.red; ctx.lineWidth = 6; ctx.setLineDash([12, 8]);
    ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(Math.cos(shotAng) * r * k, 30 + (Math.sin(shotAng) * r - 30) * k); ctx.stroke(); ctx.setLineDash([]);
    drawBall(ctx, Math.cos(shotAng) * r * k, 30 + (Math.sin(shotAng) * r - 30) * k, 9, t * 10);
  }
  if (label && t > shotT + 0.6) { ctx.font = font(900, 34, F_TITLE); ctx.textAlign = 'center'; textOutlined(ctx, label, Math.cos(shotAng) * r * 0.55, Math.sin(shotAng) * r * 0.55 - 10, COL.yellow, COL.ink, 7); }
  ctx.restore();
}

// generic "four" / "six" signal by the umpire
const P_UMP_FOUR = (t) => ({ hip: { x: 0, y: -162 }, lean: 0, fF: { x: 16, y: -8 }, fB: { x: -14, y: -8 }, hF: { x: 90 + Math.sin(t * 9) * 40, y: -250 }, hB: { x: 22, y: -170 }, eF: -1, eB: -1, face: { mouth: 'smile', look: 0.4 } });
