// Episode: Jacques Kallis's greatest moments (as attempted by Gary).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const slipIdle = t => breathe(mix(P.keeper, { hip: { x: 0, y: -122 }, lean: 30, head: -20, hF: { x: 50, y: -150 }, hB: { x: 44, y: -146 } }, 1), t, 1.2, 1);
const celebrate = t => breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'smile', eye: 'happy' } }, 1), t, 1.5);
const drive = { hip: { x: 22, y: -134 }, lean: 26, head: -24, fF: { x: 70, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 24 }, grip: { x: 54, y: -150 }, face: { mouth: 'flat', eye: 'open', brow: 0.4, look: 0.6, lookY: 0.6 } };
const driveFollow = { hip: { x: 22, y: -138 }, lean: 18, head: -14, fF: { x: 70, y: -8 }, fB: { x: -30, y: -20 }, bat: { a: 200 }, grip: { x: 6, y: -300 }, eF: 1, eB: 1, toeB: 30, face: { mouth: 'flat', eye: 'half', brow: 0.1, look: 0.8 } };

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (o.bowlerOverride) { const ov = o.bowlerOverride(t); if (ov) { bx = ov.x; bp = ov.pose; } }
    if (bx > -200) drawPerson(ctx, bx, ov_y(o, t), 1, bp, o.bowlerLook || 'england', 1, { groundY: GY });
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, o.batY ?? GY, -1, o.batter || stanceIdle(t), o.batLook || 'england', 1, { groundY: GY });
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), o.keepLook || 'saKeeper');
  if (o.slip) drawPerson(ctx, 1872, GY, -1, o.slip, o.slipLook || 'kallisCap');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function ov_y(o, t) { return o.bowlerY ? o.bowlerY(t) : GY; }
function bowledStumps(t, Tb) {
  return { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] };
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('JACQUES KALLIS', 8, 48);
  textOutlined(ctx, 'JACQUES KALLIS', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.king, T.king + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'THE COMPLETE CRICKETER', 0, 24, '#0b5a31', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  drawPerson(ctx, 1480, GY, -1, breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 }, face: { mouth: 'flat', eye: 'half', look: 0.8 } }, 1), t, 1.2), 'kallis');
  [[4.08, 'BAT'], [4.81, 'BOWL'], [5.13, 'CATCH']].forEach(([t0, txt], i) => nameTag(ctx, t, t0, T.today, 1480 + [-200, 0, 200][i], GY - [400, 470, 400][i], txt, COL.yellow, COL.ink));
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 0.9;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? withBat(cyclePose((x + 120) * 1.4, { A: 40, lift: 30, lean: 16, hipY: -152, arm: 30 }), 70) : breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 } }, 1), t, 1.5);
    g.face = { mouth: 'open', eye: 'wide', brow: -0.6, look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'gary');
    if (t > T.panic) sweat(ctx, t, x + 10, GY - 360, 1);
  }
}

// =============== #5 THE COVER DRIVE ===============
const S5 = { Tc: 18.6 }; S5.Tr = S5.Tc - 0.55; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 560);
const cdBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tc - 0.15, 1300, GY - 6], [S5.Tc, 1440, GY - 40], [S5.Tc + 1.2, -120, GY - 4, 6]]);
function s5A(ctx, t) {
  const Tc = S5.Tc;
  const b = t < Tc - 0.35 ? stanceIdle(t) : track(t, [[Tc - 0.35, P.stance], [Tc, drive, 'out'], [Tc + 0.4, driveFollow, 'out']]);
  scene(ctx, t, { bowl: S5.bowl, batter: b, batLook: 'kallis', ball: cdBall, cheer: t > Tc + 0.3 ? 0.8 : 0.1, ump: t > Tc + 1.8 ? P_UMP_FOUR : null });
  label(ctx, t, 17.03, Tc + 0.6, 1520, GY + 70, 'FRONT FOOT', COL.yellow, 34);
  label(ctx, t, 17.68, Tc + 0.6, 1520, GY - 470, 'HIGH ELBOW', COL.yellow, 34);
  bigWord(ctx, t, 20.0, T.n5gary + 0.3, 900, 380, 'FOUR!', '#2f9e5b');
  nameTag(ctx, t, T.n5 + 0.3, 16.8, GARY_X - 20, GY - 420, 'JACQUES KALLIS');
  hud(ctx, t, '#5', 'THE COVER DRIVE', T.n5);
}
const G5 = { Tc: 23.4 }; G5.Tr = G5.Tc - 0.55; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 560);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tc - 0.15, 1300, GY - 6], [G5.Tc + 0.3, 1716, GY - 60, 10]]);
const splits = { hip: { x: 0, y: -60 }, lean: 6, head: -6, fF: { x: 120, y: -8 }, fB: { x: -120, y: -8 }, bat: { a: 40 }, grip: { x: 30, y: -86 }, toeF: -10, toeB: 10, face: { mouth: 'open', eye: 'wide', brow: -1, look: 0.4 } };
function s5B(ctx, t) {
  let b = t < G5.Tc - 0.35 ? stanceIdle(t) : track(t, [[G5.Tc - 0.35, P.stance], [G5.Tc, drive, 'out'], [T.n5split, mix(drive, { fF: { x: 90, y: -8 } }, 1)], [T.n5split + 0.3, splits, 'in']]);
  if (t > T.n5stuck) { const w = Math.sin(t * 14) * 6; b = mix(splits, { hip: { x: 0, y: -60 + Math.abs(w) }, hF: { x: 30, y: -86 + w }, face: { mouth: 'frown', eye: 'closed', brow: -1 } }, 1); }
  scene(ctx, t, { bowl: G5.bowl, batter: b, batLook: 'gary', ball: g5Ball, keeper: t > G5.Tc + 0.3 ? mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 }, ball: 'F', face: { mouth: 'grin', look: -0.8 } }, 1) : null });
  if (t > T.n5split + 0.3) bigWord(ctx, t, T.n5split + 0.3, 999, 900, 380, 'RRRIP!', COL.red, 100);
  if (t > T.n5stuck) sweat(ctx, t, GARY_X - 20, GY - 230, 1);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE COVER DRIVE', T.n5);
}

// =============== #4 THE SLIP CATCH ===============
const S4 = { Tr: 30.8 }; S4.Te = S4.Tr + 0.5; S4.Tk = S4.Te + 0.35; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 620);
const edgeBall = pathOf([[S4.Tr, REL.x, REL.y], [S4.Tr + 0.3, 1100, GY - 6], [S4.Te, 1490, GY - 120, 10], [S4.Tk, 1880, GY - 190, 20]]);
const edge = mix(P.block, { bat: { a: 22 }, face: { mouth: 'o', eye: 'wide', brow: -0.6 } }, 1);
const slipCatch = t => mix(P.stand, { hip: { x: 0, y: -150 }, hF: { x: 40, y: -230 }, hB: { x: 30, y: -226 }, eF: 1, eB: 1, ball: 'F', face: { mouth: 'flat', eye: 'half', look: 0.2 } }, 1);
function s4A(ctx, t) {
  const bat = t < S4.Te - 0.25 ? stanceIdle(t) : track(t, [[S4.Te - 0.25, P.stance], [S4.Te, edge, 'out']]);
  scene(ctx, t, { bowl: S4.bowl, after: t2 => t2 > S4.Tk + 0.2 ? mix(P.celebrate, {}, 1) : P.stand, batter: bat, ball: edgeBall, slip: t > S4.Tk ? slipCatch(t) : slipIdle(t), cheer: t > S4.Tk ? 0.9 : 0.1, ump: t > S4.Tk + 0.6 ? () => P.umpireOut : null, keepLook: 'saKeeper' });
  if (t > S4.Tk) bigWord(ctx, t, S4.Tk, T.n4gary + 0.3, 900, 380, 'CAUGHT!', COL.red, 100);
  const cnt = Math.round(200 * Ease.out3(prog(31.0, 33.4, t)));
  if (t > 30.5) scoreboard(ctx, t, 30.5, T.n4gary + 0.1, 640, 150, 'TEST CATCHES', [['', cnt, COL.yellow]], { w: 360, rh: 100 });
  if (t > 35.0) label(ctx, t, 35.0, T.n4gary + 0.2, 1872, GY - 400, "DIDN'T BLINK", '#0b5a31', 34);
  nameTag(ctx, t, T.n4 + 0.3, 30.4, 1872, GY - 330, 'JACQUES KALLIS');
  hud(ctx, t, '#4', 'THE SLIP CATCH', T.n4);
}
const G4 = { Tr: 40.6 }; G4.Te = G4.Tr + 0.5; G4.Tk = 41.6; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 620);
const g4Edge = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tr + 0.3, 1100, GY - 6], [G4.Te, 1490, GY - 120, 10], [G4.Tk, 1872 - 30, GY - 300, 10]]);
function s4B(ctx, t) {
  const bat = t < G4.Te - 0.25 ? stanceIdle(t) : track(t, [[G4.Te - 0.25, P.stance], [G4.Te, edge, 'out']]);
  let slip = slipIdle(t);
  if (t > T.n4yawn) slip = mix(P.stand, { hip: { x: 0, y: -160 }, lean: -10, head: 24, hF: { x: 60, y: -320 }, hB: { x: -60, y: -320 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'closed', brow: -0.3 } }, 1);
  if (t > G4.Tk) slip = mix(slip, { head: 10, hF: { x: 20, y: -250 }, hB: { x: 10, y: -250 }, face: { mouth: 'o', eye: 'wide', brow: -1 } }, 1);
  scene(ctx, t, { bowl: G4.bowl, batter: bat, ball: t < G4.Tk ? g4Edge : null, slip, slipLook: 'garyField' });
  if (t > G4.Tk) { const hp = personPoint(1872, GY, -1, 1, slip, 'head'); impactBurst(ctx, t, G4.Tk, hp.x - 20, hp.y + 10, 0.7); bigWord(ctx, t, G4.Tk, 999, 1300, 380, 'GULP.', COL.red, 100); }
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE SLIP CATCH', T.n4);
}

// =============== #3 THE BOWLING ===============
const S3 = { Tr: 49.2 }; S3.Tb = S3.Tr + 0.55; S3.bowl = mkBowler(S3.Tr - 0.3, 290, 640);
const bBall = pathOf([[S3.Tr, REL.x, REL.y], [S3.Tr + 0.3, 1150, GY - 6], [S3.Tb, STUMP_G - 6, GY - 70, 10], [S3.Tb + 0.6, 1880, GY - 8, 40]], true);
function s3A(ctx, t) {
  const bat = t < S3.Tb - 0.25 ? stanceIdle(t) : mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1);
  scene(ctx, t, { bowl: S3.bowl, bowlerLook: 'kallisCap', after: t2 => t2 > S3.Tb + 0.2 ? breathe(mix(P.celebrate, { face: { mouth: 'smile', eye: 'happy' } }, 1), t2, 2) : P.stand, batter: bat, ball: bBall, stumps: bowledStumps(t, S3.Tb), cheer: t > S3.Tb ? 0.9 : 0.1 });
  impactBurst(ctx, t, S3.Tb, STUMP_G, GY - 70, 1.2);
  const n = Math.round(292 * Ease.out3(prog(50.0, 52.4, t)));
  if (t > 50.0) scoreboard(ctx, t, 50.0, T.n3gary + 0.1, 1100, 150, 'TEST WICKETS', [['', n, COL.yellow]], { w: 360, rh: 100 });
  const bx = t < S3.bowl.tStride + 0.95 ? bowlerAt(t, S3.bowl).x : 430;
  nameTag(ctx, t, T.n3 + 0.3, 48.8, Math.max(150, bx), GY - 420, 'JACQUES KALLIS');
  hud(ctx, t, '#3', 'THE BOWLING', T.n3);
}
const G3 = { Tf: 56.4 }; G3.bowl = mkBowler(G3.Tf - 0.1, 290, 560);
function s3B(ctx, t) {
  const Tf = G3.Tf;
  const over = t2 => {
    if (t2 < Tf) return null;
    const k = Ease.in(prog(Tf, Tf + 0.4, t2));
    return { x: 330, pose: mix(P.stand, { rot: 82 * k, hip: { x: 0, y: -160 }, head: -20, hF: { x: 90, y: -300 }, hB: { x: 40, y: -330 }, eF: 1, eB: 1, fF: { x: -10, y: -40 }, fB: { x: -40, y: -20 }, face: { mouth: 'o', eye: 'wide', brow: -1 } }, k) };
  };
  const roll = t2 => t2 < Tf + 0.2 ? null : (() => { const u = clamp((t2 - Tf - 0.2) / 4.2); return { x: lerp(420, 1500, Ease.out(u)), y: GY - 8 }; })();
  scene(ctx, t, { bowl: G3.bowl, bowlerLook: 'garyField', bowlerOverride: over, bowlerY: t2 => t2 < Tf ? GY : GY + 120 * Ease.in(prog(Tf, Tf + 0.4, t2)), ball: roll, batter: t > 60.5 ? mix(P.stance, { face: { mouth: 'flat', eye: 'half' } }, 1) : stanceIdle(t) });
  if (t > Tf + 0.4) dust(ctx, t, Tf + 0.4, 380, GY, 8, 90);
  if (t > T.n3ball) label(ctx, t, T.n3ball, 999, 960, 300, 'ON ITS OWN...', COL.red, 54);
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE BOWLING', T.n3);
}

// =============== #2 THE HUNDREDS ===============
function s2A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.8 });
  drawPerson(ctx, 1450, GY, -1, celebrate(t), 'kallis');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 1450, GY - 520, 'JACQUES KALLIS');
  const n = Math.min(45, Math.max(0, Math.floor((t - 65.8) / 0.04)));
  for (let i = 0; i < n; i++) {
    const cx = 160 + (i % 9) * 84, cy = 330 + Math.floor(i / 9) * 64;
    ctx.fillStyle = i === 44 && t > 71.2 ? COL.red : COL.yellow; ctx.beginPath(); ctx.arc(cx, cy, 28, 0, 7); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = font(900, 22, F_TITLE); ctx.fillStyle = i === 44 && t > 71.2 ? '#fff' : COL.ink; ctx.textAlign = 'center'; ctx.fillText('100', cx, cy + 8);
  }
  if (n > 0) { ctx.font = font(900, 60, F_TITLE); ctx.textAlign = 'center'; textOutlined(ctx, `${n} TEST HUNDREDS`, 500, 280, COL.red, '#fff', 12); }
  if (t > 67.6) label(ctx, t, 67.6, T.n2gary + 0.2, 500, 800, '13,289 TEST RUNS', '#0b5a31', 56);
  if (t > 71.2) label(ctx, t, 71.2, T.n2gary + 0.2, 1000, 640, '← ONE IN HIS LAST TEST', COL.red, 36);
  hud(ctx, t, '#2', 'THE HUNDREDS', T.n2);
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05, noStand: false });
  // a net cage around Gary
  ctx.strokeStyle = 'rgba(40,40,40,0.35)'; ctx.lineWidth = 2;
  for (let x = 1100; x <= 1800; x += 30) { ctx.beginPath(); ctx.moveTo(x, GY - 420); ctx.lineTo(x, GY + 10); ctx.stroke(); }
  for (let y = GY - 420; y <= GY; y += 30) { ctx.beginPath(); ctx.moveTo(1100, y); ctx.lineTo(1800, y); ctx.stroke(); }
  ctx.strokeStyle = '#555'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1100, GY + 10); ctx.lineTo(1100, GY - 420); ctx.lineTo(1800, GY - 420); ctx.lineTo(1800, GY + 10); ctx.stroke();
  drawStumps(ctx, 1700);
  const per = 0.5, u = ((t - T.n2gary) / per) % 1;
  let g = mix(P.stance, P.backlift, Math.sin(u * Math.PI));
  drawPerson(ctx, 1560, GY, -1, mix(g, { face: { mouth: 'flat', brow: 0.6, look: 0.6 } }, 1), 'gary');
  const n = Math.round(100 * clamp(prog(T.n2gary + 0.3, 76.8, t)));
  scoreboard(ctx, t, T.n2gary + 0.2, 999, 600, 160, "GARY'S HUNDRED", [[t > T.n2tries ? 'TRIES' : 'RUNS?', n, t > T.n2tries ? COL.red : '#fff'], ['RUNS', 0, COL.red]], { w: 460 });
  if (t > T.n2nets) label(ctx, t, T.n2nets, 999, 1450, GY - 460, 'IN THE NETS', COL.red, 48);
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE HUNDREDS', T.n2);
}

// =============== #1 THE ALL-ROUNDER ===============
function s1A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.8 });
  // three Kallises: batter, bowler, fielder
  const bat = breathe(mix(P.stance, { face: { mouth: 'flat', eye: 'half' } }, 1), t, 1.2);
  const bowl = breathe(mix(P.stand, { ball: 'F', hF: { x: 40, y: -250 }, eF: 1, face: { mouth: 'flat', eye: 'half' } }, 1), t, 1.2);
  const field = slipIdle(t);
  const items = [[88.77, bat, 'kallis', 'BATTER'], [89.44, bowl, 'kallisCap', 'BOWLER'], [90.12, field, 'kallisCap', 'FIELDER']];
  items.forEach(([t0, p, look, tag], i) => { const s = Ease.back(prog(t0, t0 + 0.35, t)); if (s <= 0) return; const x = 1100 + i * 300; ctx.save(); ctx.translate(x, GY); ctx.scale(s, s); ctx.translate(-x, -GY); drawPerson(ctx, x, GY, -1, p, look); ctx.restore(); nameTag(ctx, t, t0, T.n1gary + 0.2, x, GY - 430, tag); });
  const rows = [];
  if (t > 83.16) rows.push(['RUNS (TESTS & ODIs)', '10,000+ EACH', COL.yellow]);
  if (t > 84.72) rows.push(['WICKETS (TESTS & ODIs)', '200+ EACH', COL.yellow]);
  if (rows.length) scoreboard(ctx, t, 83.0, T.n1gary + 0.1, 520, 150, 'JACQUES KALLIS', rows, { w: 820 });
  if (t > 90.79) label(ctx, t, 90.79, T.n1gary + 0.2, 1400, 260, 'ALL WORLD CLASS', COL.red, 54);
  hud(ctx, t, '#1', 'THE ALL-ROUNDER', T.n1);
}
function s1B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  // Gary with a bat, a ball and a slip-catching crouch all at once, ends up in a knot on the floor
  let g = mix(P.stance, { ball: 'B', face: { mouth: 'open', eye: 'wide', brow: -0.6, look: 0.6 } }, 1), y = GY;
  if (t > T.n1all) { const s = Math.sin(t * 9); g = mix(P.stand, { bat: { a: 180 + s * 80 }, grip: { x: 20, y: -260 }, ball: 'B', hB: { x: -40, y: -200 }, lean: s * 20, fF: { x: 40 + s * 30, y: -8 }, fB: { x: -30 - s * 30, y: -8 }, face: { mouth: 'open', eye: 'wide', brow: -0.8 } }, 1); }
  if (t > T.n1tangle) { const k = Ease.in(prog(T.n1tangle, T.n1tangle + 0.4, t)); g = mix(g, { rot: 80, hip: { x: 0, y: -160 }, fF: { x: 40, y: -120 }, fB: { x: 60, y: -60 }, bat: { a: 120 }, grip: { x: 50, y: -200 }, face: { mouth: 'o', eye: 'closed', brow: -1 } }, k); y = GY + 120 * k; }
  drawPerson(ctx, 960, y, 1, g, 'gary', 1.1, { groundY: GY });
  [['BATTER', 92.18], ['BOWLER', 93.95], ['FIELDER', 94.56]].forEach(([tag, t0], i) => nameTag(ctx, t, t0, T.n1tangle, 960 + [-220, 0, 220][i], GY - 500 - (i === 1 ? 60 : 0), tag, '#cfd6e4'));
  if (t > T.n1tangle + 0.4) { bigWord(ctx, t, T.n1tangle + 0.4, 999, 960, 380, 'TANGLED!', COL.red, 100); dizzy(ctx, t, 1060, GY - 120, 1); }
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', 'THE ALL-ROUNDER', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  drawPerson(ctx, 600, GY, 1, celebrate(t), 'kallisCap');
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 520, 'THE COMPLETE CRICKETER');
  const g = breathe(mix(P.stand, { hF: { x: 40, y: -300 }, hB: { x: 10, y: -310 }, eF: 1, eB: 1, head: 14, face: { mouth: 'o', eye: 'wide', brow: -0.8, look: 0 } }, 1), t, 1.5);
  drawPerson(ctx, 1320, GY, -1, g, 'garyField');
  if (t > T.gary2 + 0.5) { ctx.font = font(900, 70, F_TITLE); ctx.textAlign = 'center'; ['?', '?', '?'].forEach((q, i) => textOutlined(ctx, q, 1250 + i * 70, GY - 470 - Math.abs(Math.sin(t * 4 + i)) * 20, COL.red, '#fff', 10)); nameTag(ctx, t, T.gary2 + 0.6, 999, 1320, GY - 380, 'COMPLETELY CONFUSED', '#cfd6e4'); }
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [T.n5split + 0.3, G4.Tk, T.n3ball, T.n2nets, T.n1tangle + 0.4];
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
