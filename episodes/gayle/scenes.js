// Episode: Chris Gayle's greatest moments (as attempted by Gary).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const tall = { hip: { x: -2, y: -156 }, lean: 6, head: -6, fF: { x: 22, y: -8 }, fB: { x: -22, y: -8 }, bat: { a: -6 }, grip: { x: 18, y: -146 }, face: { mouth: 'flat', eye: 'half', brow: 0.2, look: 0.6 } };
const big = { hip: { x: -4, y: -152 }, lean: 6, head: -6, fF: { x: 22, y: -8 }, fB: { x: -22, y: -8 }, bat: { a: 228 }, grip: { x: -16, y: -240 }, face: { mouth: 'flat', eye: 'open', brow: 0.6, look: 0.6 } };
const loft = { hip: { x: 0, y: -152 }, lean: 4, head: -4, fF: { x: 22, y: -8 }, fB: { x: -22, y: -8 }, bat: { a: 150 }, grip: { x: 30, y: -220 }, face: { mouth: 'flat', brow: 0.6, look: 0.6 } };
const loftFollow = { hip: { x: 0, y: -156 }, lean: -8, head: 8, fF: { x: 22, y: -8 }, fB: { x: -22, y: -8 }, bat: { a: 215 }, grip: { x: 0, y: -330 }, eF: 1, eB: 1, face: { mouth: 'smile', eye: 'half', look: 0.6, lookY: -1 } };
function standSwing(t, Tc) { return t < Tc - 0.4 ? breathe(tall, t, 1) : track(t, [[Tc - 0.4, tall], [Tc - 0.12, big, 'out'], [Tc, loft, 'in'], [Tc + 0.3, loftFollow, 'out']]); }
const dance = (t, slip = 0) => {
  const s = Math.sin(t * 7), c = Math.cos(t * 7);
  return { hip: { x: s * 12, y: -158 + Math.abs(c) * 6 }, lean: s * 8, head: -s * 10, fF: { x: 26 + s * 10, y: -8 }, fB: { x: -24 + s * 10, y: -8 }, hF: { x: 110, y: -250 + c * 30 }, hB: { x: -100, y: -250 - c * 30 }, eF: -1, eB: -1, face: { mouth: 'grin', eye: 'happy', brow: -0.2 } };
};

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'bowler');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  if (o.batter) drawPerson(ctx, o.batX ?? GARY_X, o.batY ?? GY, -1, o.batter, o.batLook, 1, { groundY: GY });
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), o.keepLook || 'greenKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function bowledStumps(t, Tb) {
  return { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] };
}
function six(ctx, t, t0, x, y) {
  const s = Ease.back(prog(t0, t0 + 0.4, t)); if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.font = font(900, 220, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('6', 10, 12); textOutlined(ctx, '6', 0, 0, '#2fa35c', '#fff', 18); ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.5 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('CHRIS GAYLE', 8, 48);
  textOutlined(ctx, 'CHRIS GAYLE', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.boss, T.boss + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, '🌌 THE UNIVERSE BOSS', 0, 24, '#7a1f2b', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  // Gayle, bat on shoulder, cool
  const gp = breathe(mix(P.stand, { bat: { a: 200 }, grip: { x: 26, y: -270 }, eF: 1, face: { mouth: 'smile', eye: 'half', look: 0.8 } }, 1), t, 1.2);
  drawPerson(ctx, 1480, GY, -1, gp, 'gayle');
  const hd = personPoint(1480, GY, -1, 1, gp, 'head');
  nameTag(ctx, t, T.title + 0.4, T.n5, 1680, GY - 330, 'CHRIS GAYLE');
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? withBat(cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }), 70) : breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 } }, 1), t, 1.5);
    g.face = { mouth: 'grin', eye: 'open', look: 0.8 };
    // Gary is shown at 80% size: "starting small"
    drawPerson(ctx, x, GY, 1, g, 'gary', t > T.small ? lerp(1, 0.75, Ease.out(prog(T.small, T.small + 0.5, t))) : 1);
  }
}

// =============== #5 STAND AND DELIVER ===============
const S5 = { Tc: 19.0 }; S5.Tr = S5.Tc - 0.5; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 560);
const sBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tc - 0.15, 1320, GY - 6], [S5.Tc, 1480, GY - 110], [S5.Tc + 1.4, -150, 320, 500]]);
function s5A(ctx, t) {
  scene(ctx, t, { bowl: S5.bowl, batter: standSwing(t, S5.Tc), batLook: 'gayle', ball: sBall, cheer: t > S5.Tc ? 1 : 0.2, ump: t > S5.Tc + 1.4 ? () => P.umpireSix : null });
  impactBurst(ctx, t, S5.Tc, 1480, GY - 110, 1);
  label(ctx, t, 15.2, S5.Tc, 1520, GY + 70, "FEET DON'T MOVE", COL.yellow, 36);
  six(ctx, t, 19.8, 820, 380);
  nameTag(ctx, t, T.n5 + 0.3, 17.0, GARY_X - 20, GY - 440, 'CHRIS GAYLE');
  hud(ctx, t, '#5', 'STAND AND DELIVER', T.n5);
}
const G5 = { Tb: 23.75 }; G5.Tr = G5.Tb - 0.6; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 560);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tb - 0.15, 1360, GY - 6], [G5.Tb, STUMP_G - 6, GY - 70], [G5.Tb + 0.6, 1880, GY - 8, 40]], true);
function s5B(ctx, t) {
  const g = mix(tall, { face: { mouth: 'flat', eye: t > G5.Tb ? 'open' : 'half', brow: 0, look: t > G5.Tb ? -1 : 0.6 } }, 1);
  scene(ctx, t, { bowl: G5.bowl, after: t2 => t2 > G5.Tb + 0.2 ? mix(P.celebrate, {}, 1) : P.stand, batter: g, batLook: 'gary', ball: g5Ball, stumps: bowledStumps(t, G5.Tb), keeper: t > G5.Tb ? P.celebrate : null, ump: t > G5.Tb + 0.4 ? () => P.umpireOut : null });
  impactBurst(ctx, t, G5.Tb, STUMP_G, GY - 70, 1.2);
  bigWord(ctx, t, G5.Tb + 0.05, 999, 860, 380, 'BOWLED!');
  if (t > T.n5still) label(ctx, t, T.n5still, 999, GARY_X - 30, GY + 70, 'STILL STANDING STILL', COL.ink, 34);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'STAND AND DELIVER', T.n5);
}

// =============== #4 THE DANCE ===============
function s4A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 1 });
  const p = t < 32.4 ? breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2) : dance(t);
  drawPerson(ctx, 960, GY, 1, p, 'gayleCap', 1.1);
  if (t < 32.4) label(ctx, t, 30.6, 32.4, 960, 330, '100!', '#2f9e5b', 120);
  label(ctx, t, 33.4, T.n4gary + 0.2, 640, 380, 'ARMS OUT', COL.yellow, 46);
  label(ctx, t, 34.05, T.n4gary + 0.2, 1280, 380, 'HIPS MOVING', COL.yellow, 46);
  if (t > 34.95) { for (let i = 0; i < 6; i++) { const x = 220 + i * 300 + (i > 2 ? 200 : 0); drawPerson(ctx, x, GY + 40, i < 3 ? 1 : -1, dance(t + i * 0.3), 'garyMate', 0.6, { noShadow: true }); } }
  nameTag(ctx, t, T.n4 + 0.3, T.n4gary + 0.2, 960, GY - 560, 'CHRIS GAYLE');
  hud(ctx, t, '#4', 'THE DANCE', T.n4);
}
function s4B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.1 });
  let p = t < T.n4slip ? dance(t) : null, y = GY;
  if (t >= T.n4slip) {
    const k = Ease.in(prog(T.n4slip, T.n4slip + 0.35, t));
    p = mix(dance(T.n4slip), { rot: -80, lean: 0, head: 30, hip: { x: 0, y: -160 }, fF: { x: 60, y: -110 }, fB: { x: 40, y: -60 }, hF: { x: 80, y: -320 }, hB: { x: -60, y: -300 }, face: { mouth: 'o', eye: 'wide', brow: -1 } }, k);
    y = GY + 118 * k;
  }
  // banana peel
  if (t > T.n4gary + 0.5) { ctx.fillStyle = '#f6d64a'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(1010, GY + 6); ctx.quadraticCurveTo(1030, GY - 20, 1050, GY + 4); ctx.quadraticCurveTo(1060, GY - 14, 1074, GY + 6); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  drawPerson(ctx, 960, y, 1, p, 'garyField', 1.1, { groundY: GY });
  if (t > T.n4slip + 0.4) { dust(ctx, t, T.n4slip + 0.35, 960, GY, 8, 90); bigWord(ctx, t, T.n4slip + 0.35, 999, 960, 380, 'SPLAT!', COL.red, 110); }
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE DANCE', T.n4);
}

// =============== #3 THE SIXES ===============
function s3A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 1 });
  drawPerson(ctx, 1450, GY, -1, standSwing(t, 45.0 + Math.floor(Math.max(0, t - 44.6) / 1.2) * 1.2), 'gayleCap');
  // balls rain out of the sky as the counter flies up to 1000
  const n = Math.round(1000 * Ease.out3(prog(45.0, 48.6, t)));
  for (let i = 0; i < Math.min(60, n / 16); i++) { const r = rng(i + 9); const ph = ((t * (0.6 + r() * 0.5) + r()) % 1); drawBall(ctx, r() * 1100 + 100, -40 + ph * 760, 9, t * 10 + i); }
  ctx.save(); ctx.textAlign = 'center';
  ctx.font = font(900, 200, F_TITLE); textOutlined(ctx, String(n), 640, 470, '#2fa35c', '#fff', 18);
  ctx.font = font(900, 54, F_TITLE); textOutlined(ctx, 'T20 SIXES', 640, 540, COL.ink, '#fff', 10);
  ctx.restore();
  if (t > 44.8) label(ctx, t, 44.8, T.n3gary + 0.2, 640, 270, 'THE FIRST TO 1,000', COL.red, 50);
  nameTag(ctx, t, T.n3 + 0.3, T.n3gary + 0.2, 1450, GY - 470, 'CHRIS GAYLE');
  hud(ctx, t, '#3', 'THE SIXES', T.n3);
}
function car(ctx, x, y, broken, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#3b6fc4'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 4;
  rrect(ctx, -170, -70, 340, 70, 20); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-110, -70); ctx.lineTo(-70, -130); ctx.lineTo(80, -130); ctx.lineTo(120, -70); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#bfe3ff'; ctx.beginPath(); ctx.moveTo(-96, -74); ctx.lineTo(-64, -122); ctx.lineTo(0, -122); ctx.lineTo(0, -74); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, -74); ctx.lineTo(10, -122); ctx.lineTo(74, -122); ctx.lineTo(108, -74); ctx.closePath(); ctx.fill();
  if (broken) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; for (let i = 0; i < 8; i++) { const a = i * 0.8; ctx.beginPath(); ctx.moveTo(56, -98); ctx.lineTo(56 + Math.cos(a) * 40, -98 + Math.sin(a) * 26); ctx.stroke(); } }
  for (const wx of [-100, 100]) { ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(wx, 0, 30, 0, 7); ctx.fill(); ctx.fillStyle = '#999'; ctx.beginPath(); ctx.arc(wx, 0, 12, 0, 7); ctx.fill(); }
  ctx.font = font(900, 22, F_TITLE); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('GARY 1', -40, -26);
  ctx.restore();
}
function s3B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.2 });
  const Tc = 50.9, Th = 52.5;
  drawPerson(ctx, 1450, GY, -1, t > Th + 0.2 ? mix(P.handsOnHead, {}, 1) : standSwing(t, Tc), 'gary');
  car(ctx, 380, GY + 30, t > Th, t);
  const bp = pathOf([[Tc, 1380, GY - 110], [Th, 436, GY - 98, 420]])(t);
  if (bp) drawBall(ctx, bp.x, bp.y, 9, t * 20);
  impactBurst(ctx, t, Th, 436, GY - 98, 1.1);
  if (t > T.n3window) bigWord(ctx, t, T.n3window, 999, 380, 520, 'CRASH!', COL.red, 100);
  six(ctx, t, 51.6, 900, 380);
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE SIXES', T.n3);
}

// =============== #2 THE WORLD CUP DOUBLE ===============
function montage(ctx, t, s, e, n, look) {
  const per = (e - s) / n, inM = t > s && t < e;
  let b = breathe(tall, t, 1);
  if (inM) {
    const u = ((t - s) / per) % 1, i = Math.floor((t - s) / per), t0 = s + i * per;
    b = track(u, [[0, tall], [0.3, big, 'out'], [0.45, loft, 'in'], [0.7, loftFollow, 'out'], [1, tall]]);
    const bp = pathOf([[t0 - per * 0.2, 300, GY - 300], [t0 + 0.45 * per, 1480, GY - 110, 40], [t0 + 1.3 * per, i % 2 ? -100 : 600, i % 2 ? 300 : -150, 300]]);
    drawBallPath(ctx, t, bp, { trail: 8 });
  } else if (t >= e) b = breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);
  drawPerson(ctx, GARY_X, GY, -1, b, look);
  if (inM) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
}
function s2A(ctx, t) {
  const s = 62.6, e = 67.2;
  fieldBase(ctx, t, t > s ? 1 : 0.5);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  montage(ctx, t, s, e, 12, 'gayle');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'maroonKeeper');
  const n = Math.round(215 * Ease.inOut(clamp(prog(s, e, t))));
  scoreboard(ctx, t, T.n2 + 0.4, T.n2gary + 0.1, 1590, 150, 'GAYLE', [['RUNS', n, n >= 215 ? COL.yellow : '#fff']], { w: 380 });
  if (t > 66.0) label(ctx, t, 66.0, T.n2gary + 0.2, 760, 400, 'FIRST WORLD CUP 200!', COL.red, 62);
  famousCard(ctx, t, 59.7, 62.4, 'CANBERRA, 2015', 'World Cup · 215 vs Zimbabwe');
  nameTag(ctx, t, T.n2 + 0.3, 59.6, GARY_X - 20, GY - 420, 'CHRIS GAYLE');
  hud(ctx, t, '#2', 'THE WORLD CUP DOUBLE', T.n2);
}
function duckIcon(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#f6c531'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(0, 10, 60, 40, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(40, -36, 30, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f08a3c'; ctx.beginPath(); ctx.moveTo(66, -38); ctx.lineTo(96, -30); ctx.lineTo(66, -22); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(48, -44, 5, 0, 7); ctx.fill();
  ctx.restore();
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  if (t > T.n2duck - 0.2) {
    [0, 1].forEach(i => { const s = Ease.back(prog(T.n2duck + i * 0.3, T.n2duck + i * 0.3 + 0.4, t)); if (s > 0) duckIcon(ctx, 460 + i * 300, 420, s * 1.4); });
    label(ctx, t, T.n2duck + 0.5, 999, 610, 600, '0 AND 0', COL.red, 56);
  } else scoreboard(ctx, t, T.n2gary + 0.2, 999, 640, 200, "GARY'S DOUBLE", [['', '...', COL.yellow]], { w: 500, rh: 100 });
  const g = breathe(mix(P.stand, { bat: { a: 16 }, grip: { x: 30, y: -142 }, head: t > T.n2duck ? 22 : 0, face: { mouth: t > T.n2duck ? 'frown' : 'grin', eye: t > T.n2duck ? 'half' : 'open', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'gary');
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE WORLD CUP DOUBLE', T.n2);
}

// =============== #1 ONE SEVEN FIVE ===============
function s1A(ctx, t) {
  const s = 79.9, e = 87.3;
  fieldBase(ctx, t, t > s ? 1 : 0.5);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, t > s && t < e + 1 ? { ...P.umpireSix, hF: { x: 16, y: -395 + Math.sin(t * 10) * 10 } } : breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  montage(ctx, t, s, e, 20, 'gayleRcb');
  drawPerson(ctx, 1776, GY, -1, t > s ? mix(P.keeper, { hip: { x: 0, y: -150 }, lean: 0, head: 10, hF: { x: 6, y: -318 }, hB: { x: -14, y: -320 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'wide', brow: -0.8 } }, 1) : keeperIdle(t), 'maroonKeeper');
  const k = clamp(prog(s, e, t));
  const balls = Math.round(66 * k), runs = balls <= 30 ? Math.round(balls * 100 / 30) : Math.round(100 + (balls - 30) * 75 / 36), sixes = Math.round(17 * k);
  scoreboard(ctx, t, T.n1 + 0.4, T.n1gary + 0.1, 1590, 150, 'GAYLE', [['RUNS', runs + (k >= 1 ? '*' : ''), k >= 1 ? COL.yellow : '#fff'], ['BALLS', balls], ['SIXES', sixes, '#2fa35c']], { w: 380, rh: 56 });
  const t100 = s + (e - s) * 30 / 66; if (t > t100 && t < t100 + 1.8) label(ctx, t, t100, t100 + 1.8, 760, 400, '100 OFF 30 BALLS!', COL.red, 60);
  famousCard(ctx, t, 77.2, 79.8, 'BANGALORE, 2013', 'IPL · 175* off 66 balls · 17 sixes');
  nameTag(ctx, t, T.n1 + 0.3, 77.1, GARY_X - 20, GY - 420, 'CHRIS GAYLE');
  hud(ctx, t, '#1', '175 NOT OUT', T.n1);
}
function s1B(ctx, t) {
  const s = T.n1gary + 0.3, e = 91.4, per = (e - s) / 33;
  const balls = Math.round(66 * clamp(prog(s, e, t)));
  fieldBase(ctx, t, 0.05);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, t > T.n1bye ? mix(P.umpire, { hF: { x: 40, y: -330 }, eF: 1, face: { mouth: 'flat' } }, 1) : breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  let g = breathe(tall, t, 1);
  if (t > s && t < e) { const u = ((t - s) / per) % 1; g = mix(tall, P.block, Math.sin(u * Math.PI)); }
  drawPerson(ctx, GARY_X, GY, -1, mix(g, { face: { mouth: 'flat', brow: 0.6, look: 0.6 } }, 1), 'gary');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'maroonKeeper');
  for (let i = 0; i < Math.min(30, Math.floor(balls / 2)); i++) { const r = rng(i * 7 + 3); drawBall(ctx, 1450 + (r() - 0.5) * 100, GY - 4 - Math.floor(i / 8) * 13 - r() * 4, 8, i); }
  if (t > s && t < e) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
  const runs = t > T.n1one ? 1 : 0;
  scoreboard(ctx, t, T.n1gary + 0.2, 999, 1590, 150, 'GARY', [['RUNS', runs, runs ? COL.yellow : COL.red], ['BALLS', balls], ['SIXES', 0, COL.red]], { w: 380, rh: 56 });
  if (t > T.n1bye) label(ctx, t, T.n1bye, 999, 960, 400, '(IT WAS A BYE)', COL.ink, 50);
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', '175 NOT OUT', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  // a starry "universe" glow behind Gayle
  const g0 = ctx.createRadialGradient(600, GY - 300, 10, 600, GY - 300, 340); g0.addColorStop(0, 'rgba(60,40,120,0.55)'); g0.addColorStop(1, 'rgba(60,40,120,0)');
  ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(600, GY - 300, 340, 0, 7); ctx.fill();
  for (let i = 0; i < 18; i++) { const r = rng(i + 4); const a = r() * 6.28 + t * 0.3, d = 120 + r() * 200; starPath(ctx, 600 + Math.cos(a) * d, GY - 300 + Math.sin(a) * d * 0.7, 9, 4); ctx.fillStyle = '#fff3b0'; ctx.fill(); }
  drawPerson(ctx, 600, GY, 1, dance(t), 'gayleCap');
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 500, 'THE UNIVERSE BOSS');
  const g = breathe(mix(P.stand, { hF: { x: 40, y: -200 }, hB: { x: 30, y: -196 }, face: { mouth: 'smile', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1320, GY, -1, g, 'garyField');
  // clipboard
  const hp = personPoint(1320, GY, -1, 1, g, 'hF');
  ctx.save(); ctx.translate(hp.x - 10, hp.y - 30); ctx.rotate(-0.15); ctx.fillStyle = '#8a6a48'; rrect(ctx, -30, -40, 60, 80, 6); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-24, -30, 48, 64); ctx.restore();
  if (t > T.gary2 + 0.7) nameTag(ctx, t, T.gary2 + 0.7, 999, 1320, GY - 420, 'THE NEIGHBOURHOOD INTERN', '#cfd6e4');
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [G5.Tb, T.n4slip + 0.35, T.n3window, T.n2duck, T.n1bye];
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
