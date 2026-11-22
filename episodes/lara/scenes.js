// Episode: Brian Lara's greatest moments (as attempted by Gary).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const celebrate = t => breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);
// Lara's famous high backlift stance
const highLift = { hip: { x: -4, y: -148 }, lean: 10, head: -10, fF: { x: 26, y: -8 }, fB: { x: -26, y: -8 }, bat: { a: 196 }, grip: { x: -6, y: -300 }, eF: 1, eB: 1, face: { mouth: 'flat', eye: 'open', brow: 0.6, look: 0.6 } };
const drive = { hip: { x: 18, y: -138 }, lean: 22, head: -20, fF: { x: 62, y: -8 }, fB: { x: -28, y: -8 }, bat: { a: 10 }, grip: { x: 48, y: -158 }, face: { mouth: 'flat', eye: 'open', brow: 0.7, look: 0.6, lookY: 0.4 } };
const follow = { hip: { x: 18, y: -142 }, lean: 14, head: -10, fF: { x: 62, y: -8 }, fB: { x: -28, y: -16 }, bat: { a: 168 }, grip: { x: 40, y: -300 }, eF: 1, eB: 1, face: { mouth: 'smile', eye: 'open', brow: 0.2, look: 0.8 } };
const pull = { hip: { x: -10, y: -150 }, lean: -6, head: 2, fF: { x: 30, y: -8 }, fB: { x: -36, y: -8 }, bat: { a: 260 }, grip: { x: -30, y: -250 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', look: -0.6, lookY: -0.6 } };

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'england');
  }
  if (o.under) o.under();
  drawStumps(ctx, STUMP_G, o.stumps || {});
  if (o.batter) drawPerson(ctx, o.batX ?? GARY_X, o.batY ?? GY, o.batDir ?? -1, o.batter, o.batLook, 1, { groundY: GY });
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), o.keepLook || 'ausKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function tree(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#7a5a3a'; rrect(ctx, -22, -260, 44, 270, 10); ctx.fill();
  ctx.fillStyle = '#4f8f3a';
  for (const [dx, dy, r] of [[0, -330, 110], [-90, -280, 80], [90, -280, 80], [-50, -400, 80], [60, -400, 80]]) { ctx.beginPath(); ctx.arc(dx, dy, r, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#5fa648'; ctx.beginPath(); ctx.arc(-30, -360, 50, 0, 7); ctx.fill();
  ctx.restore();
}
function bigNumber(ctx, t, t0, x, y, txt, col, size = 220, sub) {
  const s = Ease.back(prog(t0, t0 + 0.45, t)); if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.textAlign = 'center';
  ctx.font = font(900, size, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillText(txt, 8, 8);
  textOutlined(ctx, txt, 0, 0, col, '#fff', 18);
  if (sub) { ctx.font = font(900, 50, F_TITLE); textOutlined(ctx, sub, 0, 70, COL.ink, '#fff', 10); }
  ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('BRIAN LARA', 8, 48);
  textOutlined(ctx, 'BRIAN LARA', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.prince, T.prince + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 64, F_TITLE); textOutlined(ctx, '👑 THE PRINCE OF TRINIDAD', 0, 24, '#7a1f2b', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  drawPerson(ctx, 1480, GY, -1, breathe(highLift, t, 1.2), 'lara');
  nameTag(ctx, t, T.title + 0.4, T.n5, 1680, GY - 330, 'BRIAN LARA');
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? withBat(cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }), 70) : breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 } }, 1), t, 1.5);
    if (t > T.flair) { const tw = (t - T.flair) * 2; g = mix(P.stand, { bat: { a: 180 + tw * 360 }, grip: { x: 30, y: -260 }, eF: 1, face: { mouth: 'grin', eye: 'open', look: 0.8 } }, 1); if (tw > 1.6) g = mix(P.stand, { bat: null, hF: { x: 30, y: -300 }, eF: 1, face: { mouth: 'o', eye: 'wide', brow: -0.8, lookY: -1 } }, 1); }
    else g.face = { mouth: 'smile', eye: 'open', look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'gary');
    if (t > T.flair + 0.8) { const d = t - T.flair - 0.8; const s0 = skeleton(fullPose({ bat: { a: 0 }, grip: { x: 0, y: 0 } })); ctx.save(); ctx.translate(x + 40 + d * 120, GY - 300 - d * 400 + d * d * 500); ctx.rotate(d * 12); paintBat(ctx, s0); ctx.restore(); }
  }
}

// =============== #5 THE BACKLIFT ===============
const S5 = { Tc: 19.2 }; S5.Tr = S5.Tc - 0.55; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 560);
const dBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tc - 0.15, 1300, GY - 6], [S5.Tc, 1440, GY - 40], [S5.Tc + 0.9, -120, GY - 10, 10]]);
function s5A(ctx, t) {
  const Tc = S5.Tc;
  let b = t < 15.9 ? stanceIdle(t) : t < Tc - 0.15 ? mix(P.stance, highLift, Ease.out(prog(15.9, 16.6, t))) : track(t, [[Tc - 0.15, highLift], [Tc, drive, 'in'], [Tc + 0.35, follow, 'out']]);
  scene(ctx, t, { bowl: S5.bowl, batter: b, batLook: 'lara', ball: dBall, cheer: t > Tc ? 0.8 : 0.1, ump: t > Tc + 1.4 ? P_UMP_FOUR : null });
  label(ctx, t, 16.6, Tc + 0.2, 1500, GY - 470, 'HIGH BACKLIFT', COL.yellow, 38);
  if (t > Tc) label(ctx, t, Tc, T.n5gary + 0.2, 1500, GY - 420, 'PERFECT TIMING', '#2f9e5b', 38);
  impactBurst(ctx, t, Tc, 1440, GY - 40, 0.7);
  nameTag(ctx, t, T.n5 + 0.3, 16.4, GARY_X - 20, GY - 420, 'BRIAN LARA');
  hud(ctx, t, '#5', 'THE BACKLIFT', T.n5);
}
const G5 = { Ts: 24.4 }; G5.bowl = mkBowler(26.0, 290, 560);
function s5B(ctx, t) {
  const Ts = G5.Ts;
  const lift = mix(highLift, { grip: { x: -6, y: -330 } }, 1);
  let g = t < 22.2 ? stanceIdle(t) : t < Ts ? mix(P.stance, lift, Ease.out(prog(22.2, 23.0, t))) : mix(highLift, { bat: null, hF: { x: 0, y: -380 }, hB: { x: -20, y: -376 }, hip: { x: -4, y: -150 - Math.max(0, Math.sin((t - Ts) * 9)) * 18 }, face: { mouth: 'open', eye: 'wide', brow: -0.8, look: 0, lookY: -1 } }, 1);
  if (t >= Ts) g.bat = null;
  scene(ctx, t, { batter: g, batLook: 'gary', under: () => tree(ctx, GARY_X - 30, GY - 230, 0.9) });
  if (t >= Ts) { const s0 = skeleton(fullPose({ bat: { a: 190 }, grip: { x: 0, y: 0 } })); ctx.save(); ctx.translate(GARY_X - 40, GY - 520 + Math.sin(t * 20) * 2); ctx.rotate(0.3); paintBat(ctx, s0); ctx.restore(); }
  if (t > Ts) label(ctx, t, Ts, 999, 1250, 300, 'STUCK IN A TREE', COL.red, 48);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE BACKLIFT', T.n5);
}

// =============== #4 THE PULL ===============
const S4 = { Tc: 31.0 }; S4.Tr = S4.Tc - 0.5; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 620);
const pBall = pathOf([[S4.Tr, REL.x, REL.y], [S4.Tr + 0.27, 1000, GY - 6], [S4.Tc, 1470, GY - 230, 10], [S4.Tc + 1.1, 2060, 160, 200]]);
function s4A(ctx, t) {
  const Tc = S4.Tc;
  const b = t < Tc - 0.25 ? stanceIdle(t) : track(t, [[Tc - 0.25, P.stance], [Tc - 0.05, mix(P.backlift, { lean: 0 }, 1), 'out'], [Tc + 0.2, pull, 'out']]);
  scene(ctx, t, { bowl: S4.bowl, batter: b, batLook: 'lara', ball: pBall, cheer: t > Tc ? 1 : 0.1, ump: t > Tc + 1.3 ? () => P.umpireSix : null });
  impactBurst(ctx, t, Tc, 1470, GY - 230, 0.9);
  label(ctx, t, 30.55, Tc + 0.6, 1500, GY + 70, 'QUICK SWIVEL', COL.yellow, 36);
  bigNumber(ctx, t, Tc + 0.8, 900, 420, '6', '#2fa35c', 220);
  nameTag(ctx, t, T.n4 + 0.3, 30.4, GARY_X - 20, GY - 420, 'BRIAN LARA');
  hud(ctx, t, '#4', 'THE PULL SHOT', T.n4);
}
const G4 = { Tc: 36.3 }; G4.Tr = G4.Tc - 0.5; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 620);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tr + 0.27, 1000, GY - 6], [G4.Tc + 0.1, 1716, GY - 230, 10]]);
function s4B(ctx, t) {
  let g = stanceIdle(t), dir = -1;
  if (t > G4.Tc - 0.2 && t < 39.4) { const ph = (t - (G4.Tc - 0.2)) / 1.4; dir = Math.floor(ph * 4) % 2 ? 1 : -1; g = mix(pull, { face: { mouth: 'open', eye: 'closed', brow: -0.6 } }, 1); }
  if (t >= 39.4) { g = mix(P.stand, { hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 }, bat: { a: 70 }, grip: { x: 26, y: -92 }, face: { mouth: 'o', eye: 'half', brow: -0.8 } }, Ease.in(prog(39.4, 39.8, t))); dir = -1; }
  scene(ctx, t, { bowl: G4.bowl, batter: g, batDir: dir, batLook: 'gary', ball: g4Ball, keeper: t > G4.Tc + 0.1 ? mix(P.keeper, { hip: { x: 0, y: -158 }, lean: -6, head: 22, hF: { x: 30, y: -300 }, hB: { x: 10, y: -296 }, eF: 1, eB: 1, ball: 'F', face: { mouth: 'grin', look: -0.6 } }, 1) : null });
  if (t > G4.Tc && t < 39.5) { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(GARY_X, GY - 200, 120 + i * 20, 30 + i * 6, 0, t * 9 + i, t * 9 + i + 2); ctx.stroke(); } }
  if (t > 38.29 && t < 39.5) label(ctx, t, 38.29, 39.5, 1300, 300, 'x2', COL.red, 70);
  if (t >= 39.8) { const hp = personPoint(GARY_X, GY, -1, 1, g, 'head'); dizzy(ctx, t, hp.x, hp.y - 40); }
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE PULL SHOT', T.n4);
}

// =============== #3 THREE SEVEN FIVE ===============
function montage(ctx, t, s, e, n, look, keepLook, bowlerLook) {
  const per = (e - s) / n, inM = t > s && t < e;
  let b = stanceIdle(t);
  if (inM) {
    const u = ((t - s) / per) % 1, i = Math.floor((t - s) / per), t0 = s + i * per;
    b = track(u, [[0, P.stance], [0.3, highLift, 'out'], [0.45, drive, 'in'], [0.7, follow, 'out'], [1, P.stance]]);
    const bp = pathOf([[t0 - per * 0.2, 300, GY - 300], [t0 + 0.45 * per, 1440, GY - 40, 40], [t0 + 1.2 * per, i % 2 ? -100 : 700, i % 2 ? GY - 10 : -150, i % 2 ? 10 : 260]]);
    drawBallPath(ctx, t, bp, { trail: 8 });
  } else if (t >= e) b = celebrate(t);
  drawPerson(ctx, GARY_X, GY, -1, b, look);
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), keepLook);
  if (inM) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
}
function s3A(ctx, t) {
  const s = 46.2, e = 51.2;
  fieldBase(ctx, t, t > s ? 1 : 0.5);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  montage(ctx, t, s, e, 14, 'lara', 'england');
  const n = Math.round(375 * Ease.inOut(clamp(prog(s, e, t))));
  scoreboard(ctx, t, T.n3 + 0.4, T.n3gary + 0.1, 1590, 150, 'LARA', [['RUNS', n, n >= 375 ? COL.yellow : '#fff']], { w: 380 });
  if (t > 51.2) label(ctx, t, 51.2, T.n3gary + 0.2, 760, 400, 'NEW TEST RECORD!', COL.red, 66);
  famousCard(ctx, t, 44.9, 46.4, 'ANTIGUA, 1994', '375 vs England · a new Test record');
  nameTag(ctx, t, T.n3 + 0.3, 44.9, GARY_X - 20, GY - 420, 'BRIAN LARA');
  hud(ctx, t, '#3', '375', T.n3);
}
function s3B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  const items = [[52.92, '3'], [54.13, '7'], [54.68, '5']];
  items.forEach(([t0, v], i) => {
    const s = Ease.back(prog(t0, t0 + 0.35, t)); if (s <= 0) return;
    ctx.save(); ctx.translate(360 + i * 280, 330); ctx.scale(s, s);
    ctx.fillStyle = '#14223f'; rrect(ctx, -110, -110, 220, 260, 20); ctx.fill(); ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.stroke();
    ctx.font = font(900, 26, F_TITLE); ctx.fillStyle = COL.yellow; ctx.textAlign = 'center'; ctx.fillText(`INNINGS ${i + 1}`, 0, -70);
    ctx.font = font(900, 150, F_TITLE); ctx.fillStyle = '#fff'; ctx.fillText(v, 0, 90);
    ctx.restore();
  });
  if (t > T.n3innings) label(ctx, t, T.n3innings, 999, 640, 560, 'IN THREE DIFFERENT INNINGS', COL.red, 46);
  const g = breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, face: { mouth: t > T.n3innings ? 'flat' : 'grin', eye: t > T.n3innings ? 'half' : 'happy' } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'gary');
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', '375', T.n3);
}

// =============== #2 FIVE OH ONE ===============
function s2A(ctx, t) {
  const s = 64.0, e = 70.6;
  fieldBase(ctx, t, t > s ? 1 : 0.5);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  montage(ctx, t, s, e, 18, 'laraWarks', 'maroonKeeper');
  const n = Math.round(501 * Ease.inOut(clamp(prog(s, e, t))));
  scoreboard(ctx, t, T.n2 + 0.4, T.n2gary + 0.1, 1590, 150, 'LARA', [['RUNS', n + (n >= 501 ? '*' : ''), n >= 501 ? COL.yellow : '#fff'], ['TO BEAT', 499]], { w: 380 });
  if (t > 72.1) label(ctx, t, 72.1, T.n2gary + 0.2, 760, 400, 'HIGHEST FIRST-CLASS SCORE EVER', COL.red, 54);
  famousCard(ctx, t, 61.9, 64.2, 'EDGBASTON, 1994', 'Warwickshire vs Durham · 501*');
  nameTag(ctx, t, T.n2 + 0.3, 63.9, GARY_X - 20, GY - 420, 'BRIAN LARA');
  hud(ctx, t, '#2', '501', T.n2);
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  scoreboard(ctx, t, T.n2gary + 0.2, 999, 640, 170, "GARY'S HIGHEST SCORE", [['', t > T.n2one ? '501' : '...', COL.yellow]], { w: 520, rh: 110 });
  if (t > T.n2dec) {
    // split the 501 into 5, 0, 1 runs
    [['5', 79.51], ['0', 80.09], ['1', 80.44]].forEach(([v, t0], i) => {
      const s = Ease.back(prog(t0, t0 + 0.3, t)); if (s <= 0) return;
      ctx.save(); ctx.translate(430 + i * 210, 520); ctx.scale(s, s);
      ctx.fillStyle = COL.red; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.stroke();
      ctx.font = font(900, 90, F_TITLE); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(v, 0, 32);
      ctx.font = font(900, 24, F_TITLE); ctx.fillStyle = COL.ink; ctx.fillText('RUNS', 0, 110);
      ctx.restore();
    });
  }
  const g = breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 }, face: { mouth: t > T.n2dec ? 'flat' : 'grin', eye: 'open', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'gary');
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', '501', T.n2);
}

// =============== #1 FOUR HUNDRED NOT OUT ===============
function s1A(ctx, t) {
  const s = 87.6, e = 92.4;
  fieldBase(ctx, t, t > s ? 1 : 0.5);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  montage(ctx, t, s, e, 14, 'lara', 'england');
  const n = Math.round(400 * Ease.inOut(clamp(prog(s, e, t))));
  scoreboard(ctx, t, T.n1 + 0.4, T.n1gary + 0.1, 1590, 150, 'LARA', [['RUNS', n + (n >= 400 ? '*' : ''), n >= 400 ? COL.yellow : '#fff']], { w: 380 });
  if (t > 93.0) label(ctx, t, 93.0, T.n1gary + 0.2, 760, 400, 'THE ONLY TEST 400 EVER', COL.red, 60);
  famousCard(ctx, t, 85.7, 87.6, 'ANTIGUA, 2004', '400* vs England · the Test record');
  nameTag(ctx, t, T.n1 + 0.3, 85.6, GARY_X - 20, GY - 420, 'BRIAN LARA');
  hud(ctx, t, '#1', '400 NOT OUT', T.n1);
}
function s1B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.1 });
  // Gary trudges off; a step counter climbs to 400
  const x = lerp(1500, 300, prog(T.n1gary, 104.0, t));
  const p = withBat(cyclePose((1500 - x) * 1.2, { A: 24, lift: 14, lean: 8, hipY: -158, arm: 10, bob: 3 }), -60);
  p.head = 20; p.face = { mouth: 'frown', eye: 'half', brow: -1, look: 0.2, lookY: 1 };
  drawPerson(ctx, x, GY, -1, p, 'gary');
  const steps = Math.round(400 * clamp(prog(T.n1gary + 0.3, 99.6, t)));
  ctx.save(); ctx.translate(960, 200);
  ctx.fillStyle = '#14223f'; rrect(ctx, -220, 0, 440, 170, 20); ctx.fill(); ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = font(900, 26, F_TITLE); ctx.fillStyle = COL.yellow; ctx.textAlign = 'center'; ctx.fillText(t > T.n1steps ? '👟 STEPS' : 'GARY REACHES...', 0, 40);
  ctx.font = font(900, 96, F_TITLE); ctx.fillStyle = '#fff'; ctx.fillText(String(steps), 0, 140);
  ctx.restore();
  if (t > T.n1walk) label(ctx, t, T.n1walk, 999, 960, 450, 'BACK TO THE PAVILION', COL.red, 44);
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', '400 NOT OUT', T.n1);
}

// =============== OUTRO ===============
function crown(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-50, 30); ctx.lineTo(-58, -22); ctx.lineTo(-28, 4); ctx.lineTo(0, -36); ctx.lineTo(28, 4); ctx.lineTo(58, -22); ctx.lineTo(50, 30); ctx.closePath();
  ctx.fillStyle = '#f6c531'; ctx.fill(); ctx.strokeStyle = '#8a6a10'; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}
function jesterHat(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#e2283c'; ctx.beginPath(); ctx.moveTo(-34, 6); ctx.quadraticCurveTo(-60, -40, -80, -10); ctx.lineTo(-20, -6); ctx.fill();
  ctx.fillStyle = '#2f9e5b'; ctx.beginPath(); ctx.moveTo(34, 6); ctx.quadraticCurveTo(60, -40, 80, -10); ctx.lineTo(20, -6); ctx.fill();
  ctx.fillStyle = '#f6c531'; ctx.beginPath(); ctx.moveTo(-24, 6); ctx.quadraticCurveTo(0, -70, 24, 6); ctx.fill();
  for (const [bx, by] of [[-80, -10], [80, -10], [0, -60]]) { ctx.fillStyle = '#f6c531'; ctx.beginPath(); ctx.arc(bx, by + Math.sin(t * 8 + bx) * 3, 9, 0, 7); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.restore();
}
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  const lp = celebrate(t);
  drawPerson(ctx, 600, GY, 1, lp, 'laraCap');
  const lh = personPoint(600, GY, 1, 1, lp, 'head');
  crown(ctx, lh.x, lh.y - 56, 0.8);
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 520, 'THE PRINCE');
  const g = breathe(mix(P.stand, { hF: { x: 70, y: -230 }, hB: { x: -60, y: -232 }, eF: -1, eB: -1, face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);
  drawPerson(ctx, 1320, GY, -1, g, 'garyField');
  if (t > T.gary2 + 0.6) { const gh = personPoint(1320, GY, -1, 1, g, 'head'); jesterHat(ctx, gh.x, gh.y - 46, t); nameTag(ctx, t, T.gary2 + 0.7, 999, 1320, GY - 470, 'THE COURT JESTER', '#ffd28a'); }
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [G5.Ts, 39.8, T.n3innings, T.n2dec + 0.9, T.n1walk];
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
