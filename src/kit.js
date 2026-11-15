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

