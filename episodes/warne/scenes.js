// Episode: Shane Warne's greatest tricks (as attempted by Gary — who is the bowler this time).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const umpWide = { hip: { x: 0, y: -162 }, lean: 0, fF: { x: 16, y: -8 }, fB: { x: -14, y: -8 }, hF: { x: 120, y: -262 }, hB: { x: -110, y: -264 }, eF: -1, eB: -1, face: { mouth: 'frown', brow: 0.6, look: 0.4 } };

// shared bowling-scene painter (bowler = Warne or Gary, batter = England)
function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B, o.stumpsB || {});
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowler) drawPerson(ctx, o.bowler.x, GY, o.bowler.dir ?? 1, o.bowler.pose, o.bowler.look);
  if (o.under) o.under();
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, GY, -1, o.batter || stanceIdle(t), 'england');
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), 'ausKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
// bowler state from a run-up config; after the stride he settles at x=430
function bowlerState(t, cfg, look, after) {
  if (t < cfg.tStride + 0.95) { const r = bowlerAt(t, cfg); return { x: r.x, pose: r.pose, look }; }
  return { x: 430, pose: after ? after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t), look };
}
// small "from above" panel showing the ball's turn. path(u) gives a point in panel coords (0..1 across, 0 bottom .. 1 top)
function topView(ctx, t, t0, t1, x, y, path, uOf, label, labelT) {
  const s = popScale(t, t0, t1, 0.35, 0.2); if (s <= 0) return;
  const w = 300, h = 380;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; rrect(ctx, -w / 2 + 6, 8, w, h, 18); ctx.fill();
  ctx.fillStyle = '#1d3260'; rrect(ctx, -w / 2, 0, w, h, 18); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.font = font(900, 20, F_TITLE); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.textAlign = 'center'; ctx.fillText('FROM ABOVE', 0, 28);
  ctx.fillStyle = '#d9bf84'; ctx.fillRect(-36, 44, 72, h - 60);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-56, 80); ctx.lineTo(56, 80); ctx.moveTo(-56, h - 40); ctx.lineTo(56, h - 40); ctx.stroke();
  ctx.fillStyle = '#f6e7c4'; for (const dx of [-8, 0, 8]) { ctx.beginPath(); ctx.arc(dx, 62, 4, 0, 7); ctx.fill(); }
  ctx.font = font(900, 18, F_TITLE); ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillText('LEG', -100, h / 2); ctx.fillText('OFF', 100, h / 2);
  const P2 = q => ({ x: (q.x - 0.5) * w, y: h - 30 - q.y * (h - 90) });
  const uNow = uOf(t);
  if (uNow > 0) {
    ctx.strokeStyle = COL.red; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const u = (i / 40) * uNow; const q = P2(path(u)); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }
    ctx.stroke();
    const q = P2(path(uNow)); drawBall(ctx, q.x, q.y, 10, t * 12);
  }
  if (label && t > labelT) { ctx.font = font(900, 34, F_TITLE); textOutlined(ctx, label, 0, h + 44, COL.yellow, COL.ink, 7); }
  ctx.restore();
}
function bowledStumps(t, Tb) {
  return { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] };
}
const beaten = mix(P.block, { face: { mouth: 'o', eye: 'wide', brow: -0.8, look: -1 } }, 1);

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 220); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('SHANE WARNE', 8, 48);
  textOutlined(ctx, 'SHANE WARNE', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.king, T.king + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'THE KING OF SPIN', 0, 24, '#1d4a2b', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest tricks, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest tricks, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  // Warne flicking a ripping leg-break up out of his hand
  const wp = breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1, face: { mouth: 'smirk', look: 0.6, lookY: -0.6 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, wp, 'warne');
  const hp = personPoint(1450, GY, -1, 1, wp, 'hF');
  const by = hp.y - 40 - Math.abs(Math.sin(t * 2.2)) * 90;
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(246,197,49,${0.8 - i * 0.2})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hp.x, by, 22 + i * 10, t * 12 + i, t * 12 + i + 3.6); ctx.stroke(); }
  drawBall(ctx, hp.x, by, 11, t * 25);
  nameTag(ctx, t, T.title + 0.4, T.n5, 1650, GY - 330, 'SHANE WARNE');
  // Gary arrives, ball in hand
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.3;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }) : breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1 }, 1), t, 1.5);
    g.face = { mouth: t > T.warned ? 'grin' : 'smile', eye: 'open', brow: 0.3, look: 0.8 };
    g.ball = 'F';
    drawPerson(ctx, x, GY, 1, g, 'garyField');
    if (t > T.warned) speech(ctx, t, T.warned + 0.1, 99, x + 10, GY - 300, 'Watch this.', { dx: 40, dy: 20 });
  }
}

// =============== #5 THE LEG BREAK ===============
const W5 = { Tr: T.n5w + 1.4 }; W5.Tp = W5.Tr + 0.75; W5.Tk = W5.Tp + 0.3; W5.bowl = mkBowler(W5.Tr - 0.3, 290, 330);
const legBreak = pathOf([[W5.Tr, REL.x, REL.y], [W5.Tp, 1320, GY - 6, 170], [W5.Tk, 1716, GY - 120, 30]]);
const lbTop = u => ({ x: 0.5 - 0.12 * Math.sin(Math.min(u, 0.7) / 0.7 * Math.PI / 2) + (u > 0.7 ? (u - 0.7) / 0.3 * 0.2 : 0), y: u });
function s5A(ctx, t) {
  const b = bowlerState(t, W5.bowl, 'warne', t2 => breathe(mix(P.stand, { face: { mouth: 'smirk', look: 0.8 } }, 1), t2));
  const bat = t < W5.Tp - 0.2 ? stanceIdle(t) : track(t, [[W5.Tp - 0.2, P.stance], [W5.Tp + 0.05, beaten, 'out']]);
  const kp = t < W5.Tk - 0.2 ? keeperIdle(t) : mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 }, ball: t > W5.Tk ? 'F' : false, face: { mouth: 'grin', look: 0.8 } }, 1);
  scene(ctx, t, { bowler: b, batter: bat, keeper: kp, ball: legBreak, cheer: t > W5.Tk ? 0.6 : 0.1 });
  topView(ctx, t, W5.Tr, T.n5gary + 0.1, 960, 150, lbTop, tt => clamp((tt - W5.Tr) / (W5.Tk - W5.Tr)), 'BIG TURN!', W5.Tp);
  if (t > W5.Tk) bigWord(ctx, t, W5.Tk + 0.1, T.n5gary + 0.3, 1450, 360, 'BEATEN!', COL.red, 80);
  nameTag(ctx, t, T.n5 + 0.3, T.n5gary + 0.2, b.x, GY - 420, 'SHANE WARNE');
  hud(ctx, t, '#5', 'THE LEG BREAK', T.n5);
}
const G5 = { Tr: T.n5wide - 0.2 }; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 330);
// the ball heads off sideways — toward the camera — and out of shot
const g5Ball = t => { if (t < G5.Tr) return null; const d = t - G5.Tr; if (d > 1.2) return null; return { x: REL.x + 380 * d, y: REL.y + 520 * d + 300 * d * d }; };
const sqTop = u => ({ x: 0.5 - 0.45 * Math.sin(u * Math.PI / 2), y: 0.25 * u });
function s5B(ctx, t) {
  const b = bowlerState(t, G5.bowl, 'garyField', t2 => breathe(mix(P.stand, { head: 10, face: { mouth: 'o', eye: 'wide', brow: -0.8, look: -0.4, lookY: 0.6 } }, 1), t2));
  scene(ctx, t, { bowler: b, batter: t > G5.Tr + 0.6 ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  const bp = g5Ball(t);
  if (bp) drawBall(ctx, bp.x, bp.y, 9 + (t - G5.Tr) * 40, t * 20);
  topView(ctx, t, G5.Tr, T.n4 + 0.1, 960, 150, sqTop, tt => clamp((tt - G5.Tr) / 0.9), 'SQUARE LEG?!', G5.Tr + 0.6);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE LEG BREAK', T.n5);
}

// =============== #4 THE FLIPPER ===============
const W4 = { Tr: T.n4w + 0.9 }; W4.Ta = W4.Tr + 0.55; W4.bowl = mkBowler(W4.Tr - 0.3, 290, 330);
const flipper = pathOf([[W4.Tr, REL.x, REL.y], [W4.Tr + 0.35, 1180, GY - 6, 20], [W4.Ta, 1500, GY - 40], [W4.Ta + 0.5, 1440, GY - 8, 10]], true);
function s4A(ctx, t) {
  const b = bowlerState(t, W4.bowl, 'warne', t2 => t2 > W4.Ta + 0.1 ? mix(P.celebrate, { hF: { x: 40, y: -390 }, hB: { x: -40, y: -200 }, eB: -1, face: { mouth: 'open', eye: 'open', brow: 0.9 } }, 1) : P.stand);
  const bat = t < W4.Ta - 0.2 ? stanceIdle(t) : track(t, [[W4.Ta - 0.2, P.stance], [W4.Ta, mix(P.backlift, { face: { mouth: 'o', eye: 'wide' } }, 1), 'out']]);
  scene(ctx, t, { bowler: b, batter: bat, ball: flipper, cheer: t > W4.Ta ? 0.8 : 0.1, ump: t > W4.Ta + 0.7 ? () => P.umpireOut : null });
  label(ctx, t, W4.Tr + 0.3, W4.Ta + 1.0, 900, GY + 70, 'SKIDS ON LOW', COL.yellow, 36);
  impactBurst(ctx, t, W4.Ta, 1500, GY - 40, 0.8);
  bigWord(ctx, t, W4.Ta + 0.6, T.n4gary + 0.3, 900, 380, 'LBW!');
  nameTag(ctx, t, T.n4 + 0.3, T.n4gary + 0.2, b.x, GY - 420, 'SHANE WARNE');
  hud(ctx, t, '#4', 'THE FLIPPER', T.n4);
}
const G4 = { Tr: T.n4back - 0.25 }; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 330);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tr + 1.1, -120, 60, 220]]);
function s4B(ctx, t) {
  const b = bowlerState(t, G4.bowl, 'garyField', t2 => breathe(mix(P.stand, { dir: 1, head: 30, face: { mouth: 'o', eye: 'wide', brow: -0.8, look: -1, lookY: -1 } }, 1), t2));
  const ump = t > G4.Tr && t < G4.Tr + 1.2 ? mix(P.umpire, { hip: { x: 0, y: -110 }, lean: 30, hF: { x: 20, y: -250 }, hB: { x: 0, y: -246 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'wide', brow: -0.8 } }, 1) : null;
  scene(ctx, t, { bowler: b, ball: g4Ball, ump: ump ? () => ump : null, batter: t > G4.Tr + 0.5 ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  label(ctx, t, G4.Tr + 0.7, T.n3 + 0.1, 360, 300, 'OVER THE SIGHT SCREEN', COL.red, 38);
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE FLIPPER', T.n4);
}

// =============== #3 THE HAT-TRICK ===============
const H3 = { r: [T.n3w + 3.2, T.n3w + 4.15, T.n3w + 5.1] };
function hatBall(i) { const tr = H3.r[i]; return pathOf([[tr, 399, REL.y], [tr + 0.33, 1320, GY - 6, 120], [tr + 0.5, STUMP_G - 6, GY - 70]]); }
function s3A(ctx, t) {
  // quick-fire montage: three balls bowled from the crease
  let pose = breathe(mix(P.stand, { face: { mouth: 'smirk', look: 0.8 } }, 1), t), bx = 330;
  let n = 0, lastHit = -9;
  for (let i = 0; i < 3; i++) {
    const tr = H3.r[i], hit = tr + 0.5;
    if (t >= tr - 0.3 && t < tr + 0.65) pose = bowlerAt(t, { tStride: tr - 0.3, xStride: 296, speed: 0, xStart0: 0 }).pose;
    if (t >= hit) { n++; lastHit = hit; }
  }
  if (t > H3.r[2] + 0.8) pose = breathe(mix(P.celebrate, { face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);
  const st = lastHit > 0 && t - lastHit < 0.75 ? bowledStumps(t, lastHit) : {};
  const ballFn = tt => { for (let i = 0; i < 3; i++) { const p = hatBall(i)(tt); if (p) return p; } return null; };
  scene(ctx, t, { bowler: { x: bx, pose, look: 'warne' }, stumps: st, ball: ballFn, cheer: n > 0 ? 0.7 + n * 0.1 : 0.2, batter: t > lastHit && t - lastHit < 0.75 ? beaten : stanceIdle(t) });
  for (let i = 0; i < 3; i++) impactBurst(ctx, t, H3.r[i] + 0.5, STUMP_G, GY - 70, 1);
  if (n > 0) { ctx.save(); ctx.font = font(900, 70, F_TITLE); ctx.textAlign = 'center'; for (let i = 0; i < n; i++) { const s = Ease.back(prog(H3.r[i] + 0.5, H3.r[i] + 0.8, t)); ctx.save(); ctx.translate(780 + i * 180, 380); ctx.scale(s, s); textOutlined(ctx, ['ONE', 'TWO', 'THREE'][i], 0, 0, COL.red, '#fff', 12); ctx.restore(); } ctx.restore(); }
  stamp(ctx, t, H3.r[2] + 0.9, T.n3gary + 0.1, 960, 560, 'HAT-TRICK!');
  famousCard(ctx, t, T.n3w - 0.1, T.n3w + 3.0, 'MCG, BOXING DAY 1994', 'hat-trick against England in the Ashes');
  nameTag(ctx, t, T.n3 + 0.3, T.n3gary + 0.2, bx, GY - 420, 'SHANE WARNE');
  hud(ctx, t, '#3', 'THE HAT-TRICK', T.n3);
}
const G3 = { r: [T.n3wides - 0.45, T.n3wides + 0.14, T.n3wides + 0.73] };
function wideBall(i) { const tr = G3.r[i]; return pathOf([[tr, 399, REL.y], [tr + 0.33, 1320, GY - 6, 120], [tr + 0.75, 2050, GY - 90, 40]]); }
function s3B(ctx, t) {
  let pose = breathe(mix(P.stand, { face: { mouth: 'flat', brow: 0.6, look: 0.8 } }, 1), t), n = 0;
  for (let i = 0; i < 3; i++) {
    const tr = G3.r[i];
    if (t >= tr - 0.3 && t < tr + 0.55) pose = bowlerAt(t, { tStride: tr - 0.3, xStride: 296, speed: 0, xStart0: 0 }).pose;
    if (t >= tr + 0.45) n++;
  }
  if (t > G3.r[2] + 0.8) pose = breathe(mix(P.handsOnHead, {}, 1), t, 1.5);
  const ballFn = tt => { for (let i = 0; i < 3; i++) { const p = wideBall(i)(tt); if (p) return p; } return null; };
  const umpSig = n > 0 ? () => umpWide : null;
  scene(ctx, t, { bowler: { x: 330, pose, look: 'garyField' }, ball: ballFn, ump: umpSig, keeper: n > 0 ? mix(P.keeper, { lean: 10, hip: { x: 0, y: -140 }, hF: { x: -10, y: -200 }, hB: { x: -20, y: -190 }, face: { mouth: 'o', eye: 'wide', look: -1 } }, 1) : keeperIdle(t) });
  if (n > 0) { ctx.save(); for (let i = 0; i < n; i++) { const s = Ease.back(prog(G3.r[i] + 0.45, G3.r[i] + 0.75, t)); ctx.save(); ctx.translate(780 + i * 180, 380); ctx.scale(s, s); ctx.font = font(900, 70, F_TITLE); ctx.textAlign = 'center'; textOutlined(ctx, 'WIDE', 0, 0, COL.red, '#fff', 12); ctx.restore(); } ctx.restore(); }
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE HAT-TRICK', T.n3);
}

// =============== #2 SEVEN HUNDRED AND EIGHT ===============
function s2A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.8 });
  const wp = breathe(mix(P.celebrate, { face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);
  drawPerson(ctx, 1450, GY, -1, wp, 'warne');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 1450, GY - 470, 'SHANE WARNE');
  const n = Math.round(708 * Ease.out3(prog(T.n2 + 0.6, T.n2w - 0.2, t)));
  ctx.save(); ctx.textAlign = 'center';
  ctx.font = font(900, 220, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillText(String(n), 668, 448);
  textOutlined(ctx, String(n), 660, 440, '#1d4a2b', '#fff', 18);
  ctx.font = font(900, 54, F_TITLE); textOutlined(ctx, 'TEST WICKETS', 660, 510, COL.ink, '#fff', 10);
  ctx.restore();
  if (t > T.n2w + 2.2) {
    const k = Ease.out3(prog(T.n2w + 2.2, T.n2w + 3.2, t));
    [['MUTTIAH MURALITHARAN', 800, '#3b6fc4'], ['SHANE WARNE', 708, '#1d4a2b']].forEach(([nm, v, c], i) => {
      const y = 600 + i * 96, w = 560 * (v / 800) * k;
      ctx.font = font(900, 30, F_TITLE); ctx.textAlign = 'left'; textOutlined(ctx, nm, 300, y - 10, COL.ink, '#fff', 7);
      ctx.fillStyle = c; rrect(ctx, 300, y, Math.max(10, w), 44, 10); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = font(900, 38, F_TITLE); textOutlined(ctx, String(Math.round(v * k)), 310 + w + 10, y + 36, c, '#fff', 7);
    });
  }
  hud(ctx, t, '#2', '708 TEST WICKETS', T.n2);
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  let g = breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1, face: { mouth: 'grin', look: 0.8 } }, 1), t, 1.5);
  if (t > T.n2own + 0.3) g = breathe(mix(P.stand, { head: 16, hF: { x: 36, y: -200 }, eF: 1, face: { mouth: 'flat', eye: 'half', brow: -0.7, look: -0.6 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'garyField');
  if (t > T.n2own + 0.3) { const hp = personPoint(1450, GY, -1, 1, g, 'hF'); ctx.save(); ctx.translate(hp.x, hp.y); ctx.rotate(-0.3); outlined(ctx, () => rrect(ctx, -5, -110, 10, 120, 4), '#efdcb3', OUT, 2.2); ctx.restore(); }
  const rows = [['vs a tail-ender', 1], ['vs his nan (garden)', 1]];
  if (t > T.n2own) rows.push(['HIS OWN STUMPS', 1, COL.red]);
  scoreboard(ctx, t, T.n2gary + 0.2, 99, 640, 170, "GARY'S WICKETS: " + (t > T.n2gary + 1.0 ? 3 : '...'), rows, { w: 640 });
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', '708 TEST WICKETS', T.n2);
}

// =============== #1 THE BALL OF THE CENTURY ===============
const W1 = { Tr: T.n1spin - 0.25 }; W1.Tp = W1.Tr + 0.75; W1.Th = W1.Tp + 0.35; W1.bowl = mkBowler(W1.Tr - 0.3, 290, 330);
const botc = pathOf([[W1.Tr, REL.x, REL.y], [W1.Tp, 1360, GY - 6, 170], [W1.Th, STUMP_G + 9, GY - STUMP_H + 10, 30], [W1.Th + 0.6, 1880, GY - 8, 40]], true);
const botcTop = u => u < 0.6 ? { x: 0.5 - 0.3 * Math.sin(u / 0.6 * Math.PI / 2), y: u * 0.95 } : { x: 0.2 + 0.36 * Ease.out((u - 0.6) / 0.4), y: 0.57 + 0.38 * ((u - 0.6) / 0.4) };
function s1A(ctx, t) {
  const b = bowlerState(t, W1.bowl, 'warne', t2 => mix(P.stand, mix(P.celebrate, { face: { mouth: 'grin', eye: 'open' } }, 1), Ease.back(prog(W1.Th + 0.1, W1.Th + 0.5, t2))));
  const bat = t < W1.Tp - 0.25 ? stanceIdle(t) : track(t, [[W1.Tp - 0.25, P.stance], [W1.Tp, beaten, 'out']]);
  const st = { s: [{}, {}, flyingPart(t, W1.Th, { x: 260, y: -500 }, 600, 92)], b: [flyingPart(t, W1.Th, { x: 200, y: -900 }, 1500, 20), flyingPart(t, W1.Th, { x: 400, y: -800 }, -1300, -30)] };
  scene(ctx, t, { bowler: b, batter: bat, stumps: st, ball: botc, cheer: t > W1.Th ? 1 : 0.1 });
  impactBurst(ctx, t, W1.Th, STUMP_G + 9, GY - STUMP_H, 1.2);
  topView(ctx, t, W1.Tr, T.n1gary + 0.1, 1340, 150, botcTop, tt => clamp((tt - W1.Tr) / (W1.Th - W1.Tr)), 'OUTSIDE LEG → OFF STUMP', W1.Th);
  famousCard(ctx, t, T.n1w - 0.1, T.n1spin - 0.3, 'OLD TRAFFORD, 1993', 'first ball in Ashes cricket · to Mike Gatting');
  bigWord(ctx, t, W1.Th + 0.1, T.n1gary + 0.3, 760, 380, 'BOWLED!');
  nameTag(ctx, t, T.n1 + 0.3, T.n1gary + 0.2, b.x, GY - 420, 'SHANE WARNE');
  hud(ctx, t, '#1', 'THE BALL OF THE CENTURY', T.n1);
}
const G1 = { Tr: T.n1hit + 0.6 }; G1.Tp = G1.Tr + 0.7; G1.Tb = T.n1hit + 3.3; G1.bowl = mkBowler(G1.Tr - 0.3, 290, 330);
// pitches, then spins all the way back down the pitch into the bowler's own stumps
const g1Ball = pathOf([[G1.Tr, REL.x, REL.y], [G1.Tp, 1320, GY - 6, 170], [G1.Tb, STUMP_B + 6, GY - 40, 60], [G1.Tb + 0.6, 120, GY - 8, 30]], true);
function s1B(ctx, t) {
  const Tb = G1.Tb;
  const after = t2 => {
    if (t2 < Tb - 0.5) return breathe(mix(P.stand, { face: { mouth: 'grin', look: 0.8 } }, 1), t2);
    return mix(P.stand, { head: 10, face: { mouth: 'o', eye: 'wide', brow: -0.9, look: -1, lookY: 0.5 } }, 1);
  };
  const b = bowlerState(t, G1.bowl, 'garyField', after);
  const bat = t > G1.Tp + 0.3 ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t);
  scene(ctx, t, { bowler: b, batter: bat, stumpsB: bowledStumps(t, Tb), ball: g1Ball, cheer: t > Tb ? 0.6 : 0.1 });
  impactBurst(ctx, t, Tb, STUMP_B, GY - 40, 1.3);
  bigWord(ctx, t, Tb + 0.1, 99, 900, 380, 'BOWLED... HIMSELF?');
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', 'THE BALL OF THE CENTURY', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.2 });
  const wp = breathe(mix(P.stand, { hF: { x: 30, y: -300 }, eF: 1, face: { mouth: 'smirk', look: 0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 560, GY, 1, wp, 'warne');
  const hd = personPoint(560, GY, 1, 1, wp, 'head');
  ctx.fillStyle = '#111'; rrect(ctx, hd.x + 2, hd.y - 12, 30, 12, 5); ctx.fill();
  const hp = personPoint(560, GY, 1, 1, wp, 'hF');
  drawBall(ctx, hp.x + 4, hp.y - 22, 11, t * 30);
  for (let i = 0; i < 2; i++) { ctx.strokeStyle = 'rgba(246,197,49,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hp.x + 4, hp.y - 22, 22 + i * 10, t * 14 + i, t * 14 + i + 4); ctx.stroke(); }
  nameTag(ctx, t, T.outro + 0.2, 99, 560, GY - 470, 'SHANE WARNE');
  label(ctx, t, T.outro + 0.4, T.dizzy, 960, 300, 'COOLEST THING IN CRICKET', '#1d4a2b', 54);
  // Gary spins and spins, then flops down dizzy
  const spinStart = T.dizzy + 0.9, spinEnd = spinStart + 1.3;
  let dir = -1, g = breathe(mix(P.stand, { face: { mouth: 'smile', look: 0.8 } }, 1), t, 1.5), gy = GY;
  if (t > spinStart && t < spinEnd) { dir = Math.floor((t - spinStart) / 0.09) % 2 ? 1 : -1; g = mix(P.stand, { hF: { x: 80, y: -250 }, hB: { x: -80, y: -250 }, eF: -1, eB: -1, face: { mouth: 'open', eye: 'closed' } }, 1); }
  else if (t >= spinEnd) g = mix({ hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 }, hF: { x: 40, y: -110 }, hB: { x: -30, y: -90 }, face: { mouth: 'o', eye: 'half', brow: -0.8 } }, {}, 1);
  drawPerson(ctx, 1400, gy, dir, g, 'garyField');
  if (t > spinStart) { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(1400, GY - 200, 120 + i * 20, 30 + i * 6, 0, t * 9 + i, t * 9 + i + 2); ctx.stroke(); } }
  if (t >= spinEnd) { const hp2 = personPoint(1400, GY, -1, 1, g, 'head'); dizzy(ctx, t, hp2.x, hp2.y - 40); }
  bigWord(ctx, t, spinStart, 99, 1400, 360, 'DIZZY', '#8e5bd0', 100);
}

const OUT_TIMES = [T.n5wide + 0.3, T.n4back + 0.2, T.n3wides + 1.25, T.n2own + 0.3, G1.Tb];
const SCENES = [
  { t0: 0, t1: T.n5, fn: sTitle },
  { t0: T.n5, t1: T.n5gary, fn: s5A, wipe: '#5' },
  { t0: T.n5gary, t1: T.n4, fn: s5B, fade: 0.3 },
  { t0: T.n4, t1: T.n4gary, fn: s4A, wipe: '#4' },
  { t0: T.n4gary, t1: T.n3, fn: s4B, fade: 0.3 },
  { t0: T.n3, t1: T.n3gary, fn: s3A, wipe: '#3' },
  { t0: T.n3gary, t1: T.n2, fn: s3B, fade: 0.3 },
  { t0: T.n2, t1: T.n2gary, fn: s2A, wipe: '#2' },
  { t0: T.n2gary, t1: T.n1, fn: s2B, fade: 0.3 },
  { t0: T.n1, t1: T.n1gary, fn: s1A, wipe: '#1' },
  { t0: T.n1gary, t1: T.outro, fn: s1B, fade: 0.3 },
  { t0: T.outro, t1: 999, fn: sOutro, fade: 0.4 },
];
