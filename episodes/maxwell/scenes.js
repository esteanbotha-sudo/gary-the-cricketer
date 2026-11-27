// Episode: Glenn Maxwell's greatest moments (as attempted by Gary).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const celebrate = t => breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);
const big = { hip: { x: -6, y: -148 }, lean: 8, head: -6, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 228 }, grip: { x: -16, y: -232 }, face: { mouth: 'flat', eye: 'open', brow: 0.8, look: 0.6 } };
const loft = { hip: { x: 8, y: -146 }, lean: 6, head: -6, fF: { x: 46, y: -8 }, fB: { x: -26, y: -8 }, bat: { a: 150 }, grip: { x: 30, y: -220 }, face: { mouth: 'flat', brow: 0.8, look: 0.6 } };
const loftFollow = { hip: { x: 8, y: -150 }, lean: -6, head: 6, fF: { x: 46, y: -8 }, fB: { x: -26, y: -16 }, bat: { a: 215 }, grip: { x: 0, y: -330 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', look: 0.6, lookY: -1 } };
const kneelSet = kneel({ bat: { a: 80 }, grip: { x: 50, y: -130 }, face: { mouth: 'flat', brow: 0.6, look: 0.7 } });
const kneelHit = kneel({ bat: { a: -70 }, grip: { x: 10, y: -150 }, lean: 6, face: { mouth: 'grin', look: -0.8 } });

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'maroon');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, o.batY ?? GY, o.batDir ?? -1, o.batter || stanceIdle(t), o.batLook || 'maxwell', 1, { groundY: GY });
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), o.keepLook || 'maroonKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function six(ctx, t, t0, x, y, txt = '6', col = '#2fa35c') {
  const s = Ease.back(prog(t0, t0 + 0.4, t)); if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.font = font(900, 220, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText(txt, 10, 12); textOutlined(ctx, txt, 0, 0, col, '#fff', 18); ctx.restore();
}
function boundaryBase(ctx, t, cheer) {
  drawBackdrop(ctx, t, { cheer });
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(1730, H + 20); ctx.quadraticCurveTo(1790, GY + 40, 1840, 700); ctx.stroke();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(1724, H + 20); ctx.quadraticCurveTo(1784, GY + 34, 1834, 700); ctx.stroke();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.5 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('GLENN MAXWELL', 8, 48);
  textOutlined(ctx, 'GLENN MAXWELL', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.show, T.show + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, '🎪 THE BIG SHOW', 0, 24, '#0b5a31', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  // Maxwell flips between a normal and a switched stance
  const flip = Math.floor(t / 0.7) % 2;
  drawPerson(ctx, 1480, GY, flip ? 1 : -1, breathe(mix(P.stance, { face: { mouth: 'grin', look: 0.6 } }, 1), t, 1.2), 'maxwell');
  [[3.85, 'SWITCH HITS'], [4.49, 'REVERSE SWEEPS'], [5.61, 'CHAOS']].forEach(([t0, txt], i) => nameTag(ctx, t, t0, T.today, 1480 + [-230, 230, 0][i], GY - [400, 400, 470][i], txt, i === 2 ? COL.red : COL.yellow, i === 2 ? '#fff' : COL.ink));
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? withBat(cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }), 70) : breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 } }, 1), t, 1.5);
    g.face = { mouth: 'grin', eye: 'open', look: 0.8 };
    let dir = 1;
    if (t > T.nobody) { dir = Math.floor(t / 0.35) % 2 ? 1 : -1; g.face = { mouth: 'o', eye: 'wide', brow: -0.6, look: 0.4 }; }
    drawPerson(ctx, x, GY, dir, g, 'gary');
    if (t > 14.83) label(ctx, t, 14.83, 999, x, GY + 70, '(NOT EVEN GARY)', COL.ink, 34);
  }
}

// =============== #5 THE SWITCH HIT ===============
const S5 = { Tc: 25.0 }; S5.Tr = S5.Tc - 0.5; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 560);
// switched batter faces the other way (dir +1) and smashes it back over the bowler's head
const swBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tc - 0.15, 1320, GY - 6], [S5.Tc, 1480, GY - 110], [S5.Tc + 1.4, 2100, 260, 420]]);
function s5A(ctx, t) {
  const Tc = S5.Tc;
  let dir = -1, b = stanceIdle(t);
  if (t > 21.4) { dir = 1; b = mix(P.stance, { face: { mouth: 'grin', look: -0.6 } }, 1); }
  if (t > Tc - 0.4) { dir = 1; b = track(t, [[Tc - 0.4, P.stance], [Tc - 0.12, big, 'out'], [Tc, loft, 'in'], [Tc + 0.3, loftFollow, 'out']]); }
  scene(ctx, t, { bowl: S5.bowl, batter: b, batDir: dir, ball: swBall, cheer: t > Tc ? 1 : 0.2, ump: t > Tc + 1.4 ? () => P.umpireSix : null });
  if (t > 21.4 && t < 24.6) { ctx.strokeStyle = COL.yellow; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(GARY_X, GY - 200, 90, 0.3, 2.8); ctx.stroke(); label(ctx, t, 21.4, 24.6, GARY_X, GY - 420, 'SWITCHED!', COL.yellow, 40); }
  impactBurst(ctx, t, Tc, 1480, GY - 110, 1);
  six(ctx, t, 25.6, 820, 380);
  nameTag(ctx, t, T.n5 + 0.3, 21.2, GARY_X, GY - 440, 'GLENN MAXWELL');
  hud(ctx, t, '#5', 'THE SWITCH HIT', T.n5);
}
function s5B(ctx, t) {
  // Gary flips direction faster and faster until he's spinning, then gets bowled
  const Tb = 31.9, G = mkBowler(Tb - 0.85, 290, 560);
  const ball = pathOf([[Tb - 0.55, REL.x, REL.y], [Tb - 0.15, 1360, GY - 6], [Tb, STUMP_G - 6, GY - 70], [Tb + 0.6, 1880, GY - 8, 40]], true);
  let dir = -1, b = stanceIdle(t);
  if (t > T.n5gary + 0.3 && t < Tb) { const rate = lerp(0.6, 0.07, prog(T.n5gary + 0.3, Tb, t)); dir = Math.floor((t - T.n5gary) / rate) % 2 ? 1 : -1; b = mix(P.stance, { face: { mouth: 'open', eye: 'wide', brow: -0.8, look: 0.2 } }, 1); }
  if (t >= Tb) b = mix(P.stance, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1);
  scene(ctx, t, { bowl: G, after: t2 => t2 > Tb + 0.2 ? mix(P.celebrate, {}, 1) : P.stand, batter: b, batDir: dir, batLook: 'gary', ball, stumps: t > Tb ? { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] } : {}, keeper: t > Tb ? P.celebrate : null });
  impactBurst(ctx, t, Tb, STUMP_G, GY - 70, 1.2);
  if (t > 30.26 && t < Tb) label(ctx, t, 30.26, Tb, GARY_X, GY - 420, 'LEFT? RIGHT?', COL.red, 44);
  bigWord(ctx, t, Tb + 0.05, 999, 860, 380, 'BOWLED!');
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE SWITCH HIT', T.n5);
}

// =============== #4 THE FIELDING ===============
function diver(t, c) {
  if (t < c.runEnd) { const x = lerp(c.x0, c.xRun, prog(c.t0, c.runEnd, t)); const p = cyclePose(x - c.x0, { A: 48, lift: 46, lean: 20, hipY: -150, arm: 40 }); p.face = { mouth: 'flat', eye: 'open', brow: 0.8, look: 0.5, lookY: -0.8 }; return { x, y: GY, pose: p }; }
  const fly = { hip: { x: 0, y: -160 }, rot: 74, lean: 0, head: -40, fF: { x: -30, y: -20 }, fB: { x: -60, y: -40 }, hF: { x: 8, y: -392 }, hB: { x: -40, y: -170 }, eF: 1, eB: -1, face: { mouth: 'open', eye: 'wide', brow: 0.6, look: 0.8 } };
  if (t < c.land) { const u = (t - c.runEnd) / (c.land - c.runEnd); const pose = mix(track(u, [[0, mix(fly, { rot: 30 }, 1)], [0.45, fly, 'out']]), {}, 1); if (c.catchT && t > c.catchT) pose.ball = 'F'; return { x: lerp(c.xRun, c.xLand, u), y: GY - Math.sin(u * Math.PI) * 170 + u * 126, pose }; }
  const lie = { hip: { x: 0, y: -160 }, rot: 90, lean: 0, head: -50, fF: { x: -10, y: -10 }, fB: { x: -30, y: -30 }, hF: { x: 8, y: -392 }, hB: { x: -40, y: -170 }, eF: 1, eB: -1, face: c.lieFace };
  let pose = track(t, [[c.land, fly], [c.land + 0.2, lie, 'out']]); if (c.catchT) pose.ball = 'F';
  return { x: c.xLand + Ease.out(prog(c.land, c.land + 0.45, t)) * 80, y: GY + 126, pose };
}
const C4 = { t0: 36.0, runEnd: 36.9, catchT: 37.5, land: 37.8, x0: 700, xRun: 1200, xLand: 1560, lieFace: { mouth: 'grin', eye: 'happy', brow: -0.2 } };
function s4A(ctx, t) {
  boundaryBase(ctx, t, t > C4.land ? 1 : 0.5);
  const f = diver(t, C4);
  drawPerson(ctx, f.x, f.y, 1, f.pose, 'maxwellCap', 1, { groundY: GY });
  if (t > C4.land && t < C4.land + 0.9) dust(ctx, t, C4.land, f.x + 60, GY, 10, 100);
  const cf = diver(C4.catchT, C4), cp = personPoint(cf.x, cf.y, 1, 1, cf.pose, 'hF');
  const ball = pathOf([[35.0, -60, 160], [C4.catchT, cp.x + 4, cp.y - 8, 160]]);
  if (t < C4.catchT) drawBallPath(ctx, t, ball, { trail: 12, dt: 0.015 });
  label(ctx, t, 35.81, 39.2, 520, 300, 'DIVING CATCHES', COL.yellow, 40);
  label(ctx, t, 36.92, 39.2, 520, 360, 'FLYING RUN OUTS', COL.yellow, 40);
  label(ctx, t, 37.79, 39.2, 520, 420, 'BOUNDARY SAVES', COL.yellow, 40);
  stamp(ctx, t, C4.land + 0.4, T.n4gary + 0.1, 1100, 320, 'CAUGHT!');
  nameTag(ctx, t, T.n4 + 0.3, 36.0, 760, GY - 420, 'GLENN MAXWELL');
  hud(ctx, t, '#4', 'THE FIELDING', T.n4);
}
const C4g = { t0: 42.0, runEnd: 42.8, land: 43.6, x0: 700, xRun: 1050, xLand: 1300, lieFace: { mouth: 'o', eye: 'wide', brow: -0.6 } };
function s4B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  const f = t < C4g.t0 ? { x: 700, y: GY, pose: breathe(P.stand, t, 1.5) } : diver(t, C4g);
  // the rope: before landing it's in place; after, it drags along wrapped round Gary
  const tangled = t > C4g.land;
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 16; ctx.lineCap = 'round';
  if (!tangled) { ctx.beginPath(); ctx.moveTo(1730, H + 20); ctx.quadraticCurveTo(1790, GY + 40, 1840, 700); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(1724, H + 20); ctx.quadraticCurveTo(1784, GY + 34, 1834, 700); ctx.stroke(); }
  const slide = tangled ? Ease.out(prog(C4g.land, C4g.land + 2.0, t)) * 120 : 0;
  drawPerson(ctx, f.x + slide, f.y, 1, f.pose, 'garyField', 1, { groundY: GY });
  if (tangled) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(1500, H + 20); ctx.bezierCurveTo(1600, GY + 30, f.x + slide - 60, GY - 20, f.x + slide + 40, GY - 40); ctx.bezierCurveTo(f.x + slide + 140, GY - 70, f.x + slide + 200, GY + 10, 2000, 700); ctx.stroke(); for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(f.x + slide + 30, GY - 30, 70, 22, 0.2, 0, 7); ctx.stroke(); } }
  const ball = pathOf([[41.6, -60, 160], [43.4, 1700, GY - 8, 200], [44.4, 2100, GY - 8, 30]]);
  drawBallPath(ctx, t, ball, { trail: 10 });
  if (tangled) { dust(ctx, t, C4g.land, f.x + 60, GY, 10, 100); bigWord(ctx, t, 44.2, 999, 900, 380, 'FOUR. AND NO ROPE.', COL.red, 80); }
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE FIELDING', T.n4);
}

// =============== #3 THE REVERSE SWEEP ===============
const S3 = { Tc: 52.8 }; S3.Tr = S3.Tc - 0.85; S3.bowl = mkBowler(S3.Tr - 0.3, 290, 330);
const rsBall = pathOf([[S3.Tr, REL.x, REL.y], [S3.Tc - 0.2, 1330, GY - 6, 150], [S3.Tc, 1470, GY - 60, 10], [S3.Tc + 0.7, 2050, GY - 20, 20]]);
function s3A(ctx, t) {
  const Tc = S3.Tc;
  const b = t < 49.9 ? stanceIdle(t) : track(t, [[49.9, P.stance], [50.5, kneelSet, 'out'], [Tc - 0.06, kneelSet], [Tc + 0.15, kneelHit, 'out']]);
  scene(ctx, t, { bowl: S3.bowl, bowlerLook: 'spinner', batter: b, ball: rsBall, cheer: t > Tc ? 0.9 : 0.1, keeper: t > Tc ? mix(P.keeper, { head: 0, face: { mouth: 'o', eye: 'wide', look: -1 } }, 1) : null, ump: t > Tc + 1.3 ? P_UMP_FOUR : null });
  label(ctx, t, 49.9, Tc, 1500, GY + 70, 'DOWN ON ONE KNEE', COL.yellow, 34);
  label(ctx, t, 51.25, Tc, 1500, GY - 330, 'BAT TURNED ROUND', COL.yellow, 34);
  impactBurst(ctx, t, Tc, 1470, GY - 60, 0.7);
  bigWord(ctx, t, 54.1, T.n3gary + 0.3, 900, 380, 'FOUR!', '#2f9e5b');
  nameTag(ctx, t, T.n3 + 0.3, 49.7, GARY_X - 20, GY - 420, 'GLENN MAXWELL');
  hud(ctx, t, '#3', 'THE REVERSE SWEEP', T.n3);
}
function s3B(ctx, t) {
  const Tr = 56.4, G = mkBowler(Tr - 0.3, 290, 330);
  const ball = pathOf([[Tr, REL.x, REL.y], [Tr + 0.65, 1330, GY - 6, 150], [Tr + 0.85, 1500, GY - 40, 10], [Tr + 1.4, 1716, GY - 100, 10]]);
  let b = stanceIdle(t), y = GY;
  if (t > 55.6) b = mix(P.stance, kneelSet, Ease.out(prog(55.6, 56.2, t)));
  if (t > 57.45) {
    // keeps sweeping round until he topples onto his back
    const k = Ease.in(prog(57.45, 58.2, t));
    b = mix(kneelHit, { rot: -80 * k, hip: { x: 0, y: -100 }, bat: { a: -70 - 200 * k }, face: { mouth: 'o', eye: 'wide', brow: -1 } }, 1);
    y = GY + 60 * k;
  }
  scene(ctx, t, { bowl: G, bowlerLook: 'spinner', batter: b, batY: y, batLook: 'gary', ball, keeper: t > Tr + 1.4 ? mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 }, ball: 'F', face: { mouth: 'grin', look: -0.8 } }, 1) : null });
  if (t > 58.2) { dust(ctx, t, 58.2, GARY_X, GY, 8, 70); dizzy(ctx, t, GARY_X - 40, GY - 140, 1); bigWord(ctx, t, 58.3, 999, 860, 380, 'SWEPT HIMSELF!', COL.red, 80); }
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE REVERSE SWEEP', T.n3);
}

// =============== #2 FORTY BALLS ===============
function montage(ctx, t, s, e, n, look) {
  const per = (e - s) / n, inM = t > s && t < e;
  let b = stanceIdle(t);
  if (inM) {
    const u = ((t - s) / per) % 1, i = Math.floor((t - s) / per), t0 = s + i * per;
    const sw = i % 3 === 1;
    b = sw ? track(u, [[0, kneelSet], [0.45, kneelSet], [0.6, kneelHit, 'out'], [1, kneelSet]]) : track(u, [[0, P.stance], [0.3, big, 'out'], [0.45, loft, 'in'], [0.7, loftFollow, 'out'], [1, P.stance]]);
    const bp = pathOf([[t0 - per * 0.2, 300, GY - 300], [t0 + 0.45 * per, 1480, GY - 100, 40], [t0 + 1.3 * per, i % 2 ? -100 : 2100, i % 2 ? 300 : 200, 300]]);
    drawBallPath(ctx, t, bp, { trail: 8 });
  } else if (t >= e) b = celebrate(t);
  drawPerson(ctx, GARY_X, GY, -1, b, look);
  if (inM) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
}
function s2A(ctx, t) {
  const s = 68.1, e = 71.3;
  fieldBase(ctx, t, t > s ? 1 : 0.5);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, t > s ? { ...P.umpireSix, hF: { x: 16, y: -395 + Math.sin(t * 10) * 10 } } : breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  montage(ctx, t, s, e, 12, 'maxwell');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'maroonKeeper');
  const k = clamp(prog(s, e, t));
  scoreboard(ctx, t, T.n2 + 0.4, T.n2gary + 0.1, 1590, 150, 'MAXWELL', [['RUNS', Math.round(100 * k), k >= 1 ? COL.yellow : '#fff'], ['BALLS', Math.round(40 * k)]], { w: 380 });
  if (t > 71.35) label(ctx, t, 71.35, T.n2gary + 0.2, 760, 400, 'FASTEST WORLD CUP 100 EVER', COL.red, 54);
  famousCard(ctx, t, 63.9, 68.0, 'DELHI, 2023', 'World Cup · 100 off 40 balls vs Netherlands');
  hud(ctx, t, '#2', '40 BALLS', T.n2);
}
function s2B(ctx, t) {
  const s = T.n2gary + 0.3, e = 77.6, per = (e - s) / 20;
  const balls = Math.round(40 * clamp(prog(s, e, t)));
  fieldBase(ctx, t, 0.05);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  let g = stanceIdle(t);
  if (t > s && t < e) { const u = ((t - s) / per) % 1; g = mix(P.stance, { bat: { a: 200 }, grip: { x: -10, y: -290 }, eF: 1, eB: 1, face: { mouth: 'flat', eye: 'half' } }, Math.sin(u * Math.PI)); }
  drawPerson(ctx, GARY_X, GY, -1, g, 'gary');
  drawPerson(ctx, 1776, GY, -1, t > s ? mix(P.keeper, { ball: 'F' }, 1) : keeperIdle(t), 'maroonKeeper');
  if (t > s && t < e) { const u = ((t - s) / per) % 1; const i = Math.floor((t - s) / per), t0 = s + i * per; drawBallPath(ctx, t, pathOf([[t0, 400, GY - 330], [t0 + per * 0.8, 1716, GY - 140, 40]]), { trail: 6 }); pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD'); }
  scoreboard(ctx, t, T.n2gary + 0.2, 999, 1590, 150, 'GARY', [['RUNS', 0, COL.red], ['BALLS', balls]], { w: 380 });
  if (t > T.n2leave) label(ctx, t, T.n2leave, 999, 960, 400, 'LEFT ALL 40', COL.red, 66);
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', '40 BALLS', T.n2);
}

// =============== #1 TWO HUNDRED AND ONE ===============
function s1A(ctx, t) {
  const s = 93.3, e = 96.9;
  fieldBase(ctx, t, t > 93.3 ? 1 : 0.4);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  // the cramped hero: barely moving his feet, swinging from the crease
  const per = (e - s) / 12, inM = t > s && t < e;
  let b = mix(P.stance, { fF: { x: 20, y: -8 }, face: { mouth: 'frown', eye: 'half', brow: -0.8 } }, 1);
  if (t > 90.5 && t < s) { const w = Math.sin(t * 9) * 8; b = mix(P.stand, { hip: { x: 0, y: -130 + Math.abs(w) }, lean: 30, head: -10, bat: { a: 6 }, grip: { x: 40, y: -110 }, hF: { x: 40, y: -110 }, face: { mouth: 'frown', eye: 'closed', brow: -1 } }, 1); }
  if (inM) { const u = ((t - s) / per) % 1, i = Math.floor((t - s) / per), t0 = s + i * per; b = track(u, [[0, P.stance], [0.3, mix(big, { fF: { x: 22, y: -8 } }, 1), 'out'], [0.45, mix(loft, { fF: { x: 22, y: -8 } }, 1), 'in'], [0.7, mix(loftFollow, { fF: { x: 22, y: -8 } }, 1), 'out'], [1, P.stance]]); drawBallPath(ctx, t, pathOf([[t0 - per * 0.2, 300, GY - 300], [t0 + 0.45 * per, 1480, GY - 100, 40], [t0 + 1.3 * per, i % 2 ? -100 : 600, i % 2 ? 300 : -150, 300]]), { trail: 8 }); }
  if (t >= e) b = celebrate(t);
  drawPerson(ctx, GARY_X, GY, -1, b, 'maxwell');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'maroonKeeper');
  if (inM) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
  if (t > 90.5 && t < 93.4) label(ctx, t, 90.5, 93.4, GARY_X - 20, GY + 70, 'CRAMP!', COL.red, 40);
  const k = clamp(prog(s, e, t));
  const rows = [['AUSTRALIA', t > 85.4 ? (t < s ? '91/7' : `${Math.round(91 + 202 * k)}/7`) : '...', '#fff'], ['TARGET', t > 88.2 ? 292 : '...'], ['MAXWELL', `${Math.round(24 + 177 * k)}${k >= 1 ? '*' : ''}`, COL.yellow]];
  scoreboard(ctx, t, 85.3, T.n1gary + 0.1, 1560, 150, 'THE CHASE', rows, { w: 440, rh: 56 });
  if (t > e) label(ctx, t, e, T.n1gary + 0.2, 760, 400, 'AUSTRALIA WIN!', '#0b5a31', 70);
  famousCard(ctx, t, 83.0, 85.2, 'MUMBAI, 2023', 'World Cup · 201* vs Afghanistan');
  nameTag(ctx, t, T.n1 + 0.3, 85.2, GARY_X - 20, GY - 420, 'GLENN MAXWELL');
  hud(ctx, t, '#1', '201 NOT OUT', T.n1);
}
function s1B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.1 });
  const carryT = T.n1physio;
  // Gary stretches, cramps up, then a physio carries him off over the shoulder
  let gx = 900, g = breathe(mix(P.stand, { hF: { x: 30, y: -390 }, hB: { x: 0, y: -386 }, eF: 1, eB: 1, face: { mouth: 'flat', eye: 'closed' } }, 1), t, 1.5);
  if (t > 98.9) g = mix(P.stand, { hip: { x: -10, y: -140 }, lean: 20, fF: { x: 40, y: -60 }, hF: { x: 50, y: -110 }, hB: { x: 30, y: -100 }, face: { mouth: 'open', eye: 'closed', brow: -1 } }, 1);
  if (t < carryT) { drawPerson(ctx, gx, GY, 1, g, 'garyField'); if (t > 98.9) label(ctx, t, 98.9, carryT, gx, GY - 420, 'CRAMP!', COL.red, 50); }
  else {
    const px = lerp(1400, 1000, Ease.out(prog(carryT, carryT + 0.6, t))) - Math.max(0, t - carryT - 0.9) * 260;
    const walking = t > carryT + 0.9;
    const pp = walking ? cyclePose((t - carryT) * 200, { A: 26, lift: 16, lean: 10, hipY: -158, arm: 0 }) : breathe(P.stand, t, 1.5);
    pp.hF = { x: 10, y: -300 }; pp.hB = { x: -10, y: -296 }; pp.eF = 1; pp.eB = 1; pp.face = { mouth: 'flat', brow: 0.4, look: -0.8 };
    drawPerson(ctx, px, GY, -1, pp, 'physio');
    const slump = { hip: { x: 0, y: -160 }, rot: 90, head: 30, fF: { x: -40, y: -60 }, fB: { x: -60, y: -40 }, hF: { x: 60, y: -260 }, hB: { x: 40, y: -250 }, face: { mouth: 'open', eye: 'closed', brow: -1 } };
    drawPerson(ctx, px + 20, GY - 250, -1, slump, 'garyField', 1, { groundY: GY, noShadow: true });
  }
  if (t > 100.39) label(ctx, t, 100.39, 999, 960, 260, '(FROM THE WARM-UP)', COL.ink, 44);
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', '201 NOT OUT', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  // spotlight on the Big Show
  const g0 = ctx.createRadialGradient(600, GY - 250, 10, 600, GY - 250, 360); g0.addColorStop(0, 'rgba(255,240,170,0.55)'); g0.addColorStop(1, 'rgba(255,240,170,0)');
  ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(600, GY - 250, 360, 0, 7); ctx.fill();
  drawPerson(ctx, 600, GY, 1, celebrate(t), 'maxwellCap');
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 520, 'THE BIG SHOW');
  // Gary off to the side juggling (badly)
  const g = breathe(mix(P.stand, { hF: { x: 40, y: -280 + Math.sin(t * 8) * 30 }, hB: { x: -20, y: -280 - Math.sin(t * 8) * 30 }, eF: 1, eB: 1, face: { mouth: 'flat', eye: 'open', look: 0, lookY: -1 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'garyField', 0.85);
  for (let i = 0; i < 3; i++) { const ph = t * 3 + i * 2.1; drawBall(ctx, 1420 + Math.cos(ph) * 50, GY - 330 - Math.abs(Math.sin(ph)) * 90 + (i === 2 && t > T.gary2 + 1 ? (t - T.gary2 - 1) * 400 : 0), 9, ph); }
  if (t > T.gary2 + 0.6) nameTag(ctx, t, T.gary2 + 0.6, 999, 1450, GY - 470, 'THE SIDE SHOW', '#cfd6e4');
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [31.9, 44.2, 58.2, T.n2leave, T.n1physio];
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
