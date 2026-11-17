// Episode: Sachin Tendulkar's greatest moments (as attempted by Gary).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const umpHop = t => mix(P.umpire, { hip: { x: 0, y: -170 - Math.abs(Math.sin(t * 9)) * 26 }, lean: 10, fF: { x: 20, y: -60 - Math.abs(Math.sin(t * 9)) * 26 }, fB: { x: -14, y: -8 - Math.abs(Math.sin(t * 9)) * 26 }, hF: { x: 40, y: -110 }, hB: { x: 30, y: -100 }, eF: -1, eB: -1, face: { mouth: 'open', eye: 'closed', brow: -1 } }, 1);

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, 'bowler');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, GY, -1, o.batter, o.look);
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), 'greenKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
const straightDrive = { hip: { x: 18, y: -138 }, lean: 22, head: -20, fF: { x: 62, y: -8 }, fB: { x: -28, y: -8 }, bat: { a: 6 }, grip: { x: 48, y: -158 }, face: { mouth: 'flat', eye: 'open', brow: 0.7, look: 0.6, lookY: 0.4 } };
const straightFollow = { hip: { x: 18, y: -142 }, lean: 14, head: -10, fF: { x: 62, y: -8 }, fB: { x: -28, y: -16 }, bat: { a: 168 }, grip: { x: 40, y: -300 }, eF: 1, eB: 1, face: { mouth: 'smile', eye: 'open', brow: 0.2, look: 0.8 } };
const cutUp = { hip: { x: -6, y: -150 }, lean: 0, head: -4, fF: { x: 26, y: -8 }, fB: { x: -36, y: -8 }, bat: { a: 150 }, grip: { x: 30, y: -250 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', brow: 0.4, look: -0.4, lookY: -1 } };
const celebrate = t => breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 160, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('SACHIN TENDULKAR', 8, 48);
  textOutlined(ctx, 'SACHIN TENDULKAR', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.master, T.master + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'THE LITTLE MASTER', 0, 24, '#1f6fd1', '#fff', 12); ctx.restore(); }
  ctx.restore();
  // 100 hundreds badge
  const hb = popScale(t, T.hundreds, T.today + 0.2, 0.4, 0.25);
  if (hb > 0) {
    ctx.save(); ctx.translate(960, 470); ctx.scale(hb, hb);
    const n = Math.round(100 * Ease.out3(prog(T.hundreds, T.hundreds + 1.6, t)));
    ctx.fillStyle = COL.yellow; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 6; ctx.stroke();
    ctx.font = font(900, 96, F_TITLE); ctx.textAlign = 'center'; ctx.fillStyle = COL.ink; ctx.fillText(String(n), 0, 22);
    ctx.font = font(900, 26, F_TITLE); ctx.fillText('INTERNATIONAL', 0, 62); ctx.fillText('HUNDREDS', 0, -56);
    ctx.restore();
  }
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  drawPerson(ctx, 1480, GY, -1, celebrate(t), 'sachin', 0.94);
  nameTag(ctx, t, T.title + 0.4, T.n5, 1680, GY - 320, 'SACHIN TENDULKAR');
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? withBat(cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }), 70) : breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 } }, 1), t, 1.5);
    g.face = { mouth: t > T.how ? 'grin' : 'smile', eye: 'open', brow: 0.2, look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'gary');
    speech(ctx, t, T.how + 0.1, 999, x + 10, GY - 300, 'Easy.', { dx: 40, dy: 20 });
  }
}

// =============== #5 THE STRAIGHT DRIVE ===============
const S5 = { Tr: T.n5s + 1.6 }; S5.Tc = S5.Tr + 0.55; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 560);
const sdBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tc - 0.15, 1300, GY - 6], [S5.Tc, 1440, GY - 40], [S5.Tc + 0.9, -120, GY - 10, 10]]);
function s5A(ctx, t) {
  const Tc = S5.Tc;
  const bat = t < Tc - 0.3 ? stanceIdle(t) : track(t, [[Tc - 0.3, P.stance], [Tc, straightDrive, 'out'], [Tc + 0.35, straightFollow, 'out']]);
  const after = t2 => t2 < Tc + 0.6 ? mix(P.stand, { hip: { x: 0, y: -150 }, fF: { x: 40, y: -60 }, lean: -14, face: { mouth: 'o', eye: 'wide' } }, Math.sin(prog(Tc + 0.1, Tc + 0.6, t2) * Math.PI)) : breathe(mix(P.handsOnHead, {}, 1), t2);
  scene(ctx, t, { bowl: S5.bowl, after, batter: bat, look: 'sachin', ball: sdBall, cheer: t > Tc ? 0.8 : 0.1, ump: t > Tc + 1.5 ? P_UMP_FOUR : null });
  label(ctx, t, T.n5s - 0.1, Tc + 0.8, 1520, GY - 470, 'HEAD STILL', COL.yellow, 34);
  label(ctx, t, T.n5s + 0.8, Tc + 0.8, 1520, GY - 430, 'BAT STRAIGHT', COL.yellow, 34);
  impactBurst(ctx, t, Tc, 1440, GY - 40, 0.7);
  bigWord(ctx, t, Tc + 1.0, T.n5gary + 0.3, 900, 380, 'FOUR!', '#2f9e5b');
  nameTag(ctx, t, T.n5 + 0.3, T.n5gary + 0.2, GARY_X - 20, GY - 420, 'SACHIN TENDULKAR');
  hud(ctx, t, '#5', 'THE STRAIGHT DRIVE', T.n5);
}
const G5 = { Tc: T.n5hit + 0.35 }; G5.Tr = G5.Tc - 0.55; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 560);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tc - 0.15, 1300, GY - 6], [G5.Tc, 1440, GY - 40], [G5.Tc + 0.7, UMP_X + 26, GY - 90, 30], [G5.Tc + 1.3, 420, GY - 8, 60]], true);
function s5B(ctx, t) {
  const Tc = G5.Tc, Th = Tc + 0.7;
  const bat = t < Tc - 0.3 ? stanceIdle(t) : track(t, [[Tc - 0.3, P.stance], [Tc, straightDrive, 'out'], [Tc + 0.35, mix(straightFollow, { face: { mouth: 'o', eye: 'wide', brow: -0.6 } }, 1), 'out']]);
  scene(ctx, t, { bowl: G5.bowl, after: t2 => breathe(mix(P.stand, { face: { mouth: 'grin', look: -1 } }, 1), t2), batter: bat, look: 'gary', ball: g5Ball, ump: t > Th ? umpHop : null });
  impactBurst(ctx, t, Th, UMP_X + 26, GY - 90, 1);
  bigWord(ctx, t, Th, 999, 620, 380, 'OUCH!', COL.yellow, 110);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE STRAIGHT DRIVE', T.n5);
}

// =============== #4 THE UPPER CUT ===============
const S4 = { Tc: T.n4s + 2.7 }; S4.Tr = S4.Tc - 0.45; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 620);
const ucBall = pathOf([[S4.Tr, REL.x, REL.y], [S4.Tc - 0.2, 1000, GY - 6], [S4.Tc, 1480, GY - 250, 10], [S4.Tc + 0.9, 2060, 60, 160]]);
function s4A(ctx, t) {
  const Tc = S4.Tc;
  const bat = t < Tc - 0.25 ? stanceIdle(t) : track(t, [[Tc - 0.25, P.stance], [Tc - 0.05, mix(P.backlift, { lean: 0 }, 1), 'out'], [Tc + 0.2, cutUp, 'out']]);
  const kp = t < Tc ? keeperIdle(t) : mix(P.keeper, { hip: { x: 0, y: -158 }, lean: -6, head: 22, hF: { x: 30, y: -300 }, hB: { x: 10, y: -296 }, eF: 1, eB: 1, face: { mouth: 'o', eye: 'wide', look: -0.6, lookY: -1 } }, 1);
  scene(ctx, t, { bowl: S4.bowl, batter: bat, look: 'sachin', keeper: kp, ball: ucBall, cheer: t > Tc ? 1 : 0.1, ump: t > Tc + 1.2 ? () => P.umpireSix : null });
  impactBurst(ctx, t, Tc, 1480, GY - 250, 0.9);
  const s6 = popScale(t, Tc + 0.9, T.n4gary + 0.3, 0.45, 0.2);
  if (s6 > 0) { ctx.save(); ctx.translate(1180, 380); ctx.scale(s6, s6); ctx.font = font(900, 240, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('6', 10, 12); textOutlined(ctx, '6', 0, 0, '#2fa35c', '#fff', 18); ctx.restore(); }
  famousCard(ctx, t, T.n4where - 0.1, T.n4s + 2.4, 'CENTURION, 2003', 'World Cup · India vs Pakistan · 98 off 75');
  nameTag(ctx, t, T.n4 + 0.3, T.n4gary + 0.2, GARY_X - 20, GY - 420, 'SACHIN TENDULKAR');
  hud(ctx, t, '#4', 'THE UPPER CUT', T.n4);
}
const G4 = { Tc: T.n4caught - 0.3 }; G4.Tr = G4.Tc - 0.45; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 620);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tc - 0.2, 1000, GY - 6], [G4.Tc, 1480, GY - 250, 10], [G4.Tc + 0.3, 1716, GY - 150, 10]]);
function s4B(ctx, t) {
  const Tc = G4.Tc, Tk = Tc + 0.3;
  const bat = t < Tc - 0.25 ? stanceIdle(t) : track(t, [[Tc - 0.25, P.stance], [Tc - 0.05, mix(P.backlift, { lean: 0 }, 1), 'out'], [Tc + 0.2, mix(cutUp, { face: { mouth: 'o', eye: 'wide', brow: -0.8, look: -1 } }, 1), 'out']]);
  const kp = mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 }, ball: t > Tk ? 'F' : false, face: { mouth: t > Tk ? 'smirk' : 'flat', look: 0.8 } }, 1);
  scene(ctx, t, { bowl: G4.bowl, after: t2 => mix(P.stand, P.celebrate, Ease.back(prog(Tk, Tk + 0.4, t2))), batter: bat, look: 'gary', keeper: kp, ball: g4Ball, ump: t > Tk + 0.4 ? () => P.umpireOut : null });
  impactBurst(ctx, t, Tc, 1480, GY - 250, 0.6);
  stamp(ctx, t, T.n4caught, 999, 900, 380, 'CAUGHT BEHIND');
  label(ctx, t, T.n4still + 0.2, 999, 1776, GY + 70, "DIDN'T MOVE", COL.red, 34);
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE UPPER CUT', T.n4);
}

// =============== #3 THE EARLY START ===============
const S3 = { Tr: T.n3s + 3.6 }; S3.Ta = S3.Tr + 0.45; S3.bowl = mkBowler(S3.Tr - 0.3, 290, 640);
const debBall = pathOf([[S3.Tr, REL.x, REL.y], [S3.Ta - 0.15, 1300, GY - 6], [S3.Ta, 1500, GY - 50], [S3.Ta + 0.4, 1460, GY - 8, 10]], true);
function s3A(ctx, t) {
  const bat = t < S3.Ta - 0.3 ? stanceIdle(t) : track(t, [[S3.Ta - 0.3, P.stance], [S3.Ta, P.block, 'out']]);
  fieldBase(ctx, t, 0.3);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  let bx = -400, bp = null;
  if (t < S3.bowl.tStride + 0.95) { const r = bowlerAt(t, S3.bowl); bx = r.x; bp = r.pose; } else { bx = 430; bp = breathe(mix(P.stand, { face: { mouth: 'flat', brow: 0.8, look: 0.8 } }, 1), t); }
  if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, 'bowler', 1.08);
  drawStumps(ctx, STUMP_G);
  drawPerson(ctx, GARY_X, GY, -1, mix(bat, { face: { mouth: 'flat', brow: 0.9, look: 0.6 } }, 1), 'sachin', 0.82);
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'greenKeeper');
  drawBallPath(ctx, t, debBall, { trail: 10 });
  const s16 = popScale(t, T.n3s + 0.6, T.n3gary + 0.3, 0.45, 0.2);
  if (s16 > 0) { ctx.save(); ctx.translate(820, 400); ctx.scale(s16, s16); ctx.textAlign = 'center'; ctx.font = font(900, 200, F_TITLE); textOutlined(ctx, '16', 0, 40, COL.red, '#fff', 16); ctx.font = font(900, 40, F_TITLE); textOutlined(ctx, 'YEARS OLD', 0, 100, COL.ink, '#fff', 8); ctx.restore(); }
  famousCard(ctx, t, T.n3s + 1.6, T.n3gary + 0.1, 'KARACHI, 1989', 'Test debut, aged 16, against Pakistan');
  nameTag(ctx, t, T.n3 + 0.3, T.n3gary + 0.2, GARY_X - 20, GY - 380, 'SACHIN, AGED 16');
  hud(ctx, t, '#3', 'THE EARLY START', T.n3);
}
function s3B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  // a bench by the boundary, years flying past
  ctx.fillStyle = '#7a5a3a'; rrect(ctx, 740, GY - 110, 480, 22, 8); ctx.fill();
  ctx.fillRect(770, GY - 90, 16, 92); ctx.fillRect(1170, GY - 90, 16, 92); ctx.fillStyle = '#8a6a48'; rrect(ctx, 740, GY - 210, 480, 18, 8); ctx.fill();
  const sit = { hip: { x: 0, y: -118 }, lean: 0, head: 10, fF: { x: 60, y: -8 }, fB: { x: 48, y: -8 }, bat: { a: 30 }, grip: { x: 50, y: -150 }, face: { mouth: 'flat', eye: t > T.n3wait ? 'half' : 'open', brow: -0.4, look: 0.8 } };
  drawPerson(ctx, 960, GY, 1, breathe(sit, t, 1), 'gary');
  const yr = 2010 + Math.floor(clamp(prog(T.n3gary + 0.3, T.n3wait + 1.6, t)) * 16);
  ctx.save(); ctx.translate(1480, 220);
  ctx.fillStyle = '#fff'; rrect(ctx, -130, 0, 260, 200, 16); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = COL.red; rrect(ctx, -130, 0, 260, 56, 16); ctx.fill(); ctx.fillRect(-130, 36, 260, 20);
  ctx.font = font(900, 30, F_TITLE); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('STILL WAITING', 0, 40);
  ctx.font = font(900, 96, F_TITLE); ctx.fillStyle = COL.ink; ctx.fillText(String(yr), 0, 160);
  ctx.restore();
  if (t > T.n3wait) {
    // cobweb on the helmet
    const hp = personPoint(960, GY, 1, 1, sit, 'head');
    ctx.save(); ctx.globalAlpha = clamp(prog(T.n3wait, T.n3wait + 0.6, t)); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) { const a = -Math.PI + i * Math.PI / 5; ctx.beginPath(); ctx.moveTo(hp.x - 10, hp.y - 50); ctx.lineTo(hp.x - 10 + Math.cos(a) * 46, hp.y - 50 + Math.sin(a) * 46); ctx.stroke(); }
    for (const r of [16, 30, 44]) { ctx.beginPath(); ctx.arc(hp.x - 10, hp.y - 50, r, -Math.PI, 0); ctx.stroke(); }
    ctx.restore();
  }
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE EARLY START', T.n3);
}

// =============== #2 THE DOUBLE HUNDRED ===============
function smash(u) {
  return track(u, [[0, P.stance], [0.35, P.backlift, 'out'], [0.5, straightDrive, 'in'], [0.75, straightFollow, 'out'], [1, P.stance]]);
}
function s2A(ctx, t) {
  const s = T.n2 + 0.6, e = T.n2s + 5.6, per = (e - s) / 20;
  const inM = t > s && t < e;
  const n = Math.round(200 * Ease.inOut(clamp(prog(s, e, t))));
  fieldBase(ctx, t, inM ? 1 : 0.5);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  drawStumps(ctx, STUMP_G);
  let bat = stanceIdle(t);
  if (inM) {
    const u = ((t - s) / per) % 1, i = Math.floor((t - s) / per), t0 = s + i * per;
    bat = smash(u);
    const bp = pathOf([[t0 - per * 0.2, 300, GY - 300], [t0 + 0.5 * per, 1440, GY - 50, 40], [t0 + 1.2 * per, i % 2 ? -100 : 700, i % 2 ? GY - 10 : -150, i % 2 ? 10 : 260]]);
    drawBallPath(ctx, t, bp, { trail: 8 });
  } else if (t >= e) bat = mix(P.stance, celebrate(t), Ease.back(prog(e, e + 0.4, t)));
  drawPerson(ctx, GARY_X, GY, -1, bat, 'sachin');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'greenKeeper');
  if (inM) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
  scoreboard(ctx, t, T.n2 + 0.4, T.n2gary + 0.1, 1590, 150, 'SACHIN', [['RUNS', n + (n >= 200 ? '*' : ''), n >= 200 ? COL.yellow : '#fff'], ['BALLS', Math.round(147 * clamp(prog(s, e, t)))]], { w: 400 });
  famousCard(ctx, t, T.n2s - 0.1, T.n2gary + 0.1, 'GWALIOR, 2010', 'first ever ODI double hundred · 200* vs South Africa');
  nameTag(ctx, t, T.n2 + 0.3, s + 0.5, GARY_X - 20, GY - 420, 'SACHIN TENDULKAR');
  hud(ctx, t, '#2', 'THE DOUBLE HUNDRED', T.n2);
}
function s2B(ctx, t) {
  const s = T.n2gary + 0.3, e = T.n2balls + 0.2, per = (e - s) / 40;
  const balls = Math.round(200 * clamp(prog(s, e, t)));
  const runs = t > T.n2runs ? 6 : Math.min(6, Math.floor(balls / 34));
  fieldBase(ctx, t, 0.05);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, t > e ? mix(P.umpire, { lean: 0, head: 30, face: { eye: 'closed', mouth: 'o' } }, 1) : breathe(P.umpire, t), 'umpire');
  drawStumps(ctx, STUMP_G);
  for (let i = 0; i < Math.min(40, Math.floor(balls / 5)); i++) { const r = rng(i * 7 + 3); drawBall(ctx, 1450 + (r() - 0.5) * 100, GY - 4 - Math.floor(i / 9) * 13 - r() * 4, 8, i); }
  let g = stanceIdle(t);
  if (t > s && t < e) { const u = ((t - s) / per) % 1; g = mix(P.stance, P.block, Math.sin(u * Math.PI)); }
  g = mix(g, { face: { mouth: 'flat', brow: 0.8, look: 0.6 } }, 1);
  if (t > T.n2runs) g = mix(g, { head: 16, face: { mouth: 'frown', eye: 'half', brow: -0.8 } }, 1);
  drawPerson(ctx, GARY_X, GY, -1, g, 'gary');
  drawPerson(ctx, 1776, GY, -1, t > e ? mix(P.keeper, { head: 20, face: { eye: 'closed', mouth: 'o' } }, 1) : keeperIdle(t), 'greenKeeper');
  if (t > e) { ctx.font = font(400, 44, F_HAND); ctx.textAlign = 'center'; textOutlined(ctx, 'z z z', UMP_X + 40, GY - 420 - Math.sin(t * 3) * 8, '#2b4a8a', '#fff', 6); }
  if (t > s && t < e) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
  scoreboard(ctx, t, T.n2gary + 0.2, 999, 1590, 150, 'GARY', [['BALLS', balls, balls >= 200 ? COL.yellow : '#fff'], ['RUNS', runs, COL.red]], { w: 400 });
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE DOUBLE HUNDRED', T.n2);
}

// =============== #1 THE WORLD CUP ===============
function carry(ctx, t, x, riderLook, mateLook, riderPose, dropK = 0) {
  const ph = t * 6;
  const mate = (dx, i) => {
    const p = cyclePose(t * 160 + i * 30, { A: 22, lift: 14, lean: 2, hipY: -158, arm: 0, bob: 3 });
    p.hF = { x: 10 + dx * 0.2, y: -300 }; p.hB = { x: -4, y: -296 }; p.eF = 1; p.eB = 1; p.head = -4;
    p.face = { mouth: 'grin', eye: 'happy' };
    return p;
  };
  drawPerson(ctx, x + 38, GY, 1, mate(1, 0), mateLook);
  const lift = lerp(250, 0, dropK) + Math.sin(ph) * 4;
  drawPerson(ctx, x, GY - lift, 1, riderPose, riderLook, 1, { groundY: GY });
  drawPerson(ctx, x - 40, GY, 1, mate(-1, 1), mateLook);
}
const ride = { hip: { x: 0, y: -58 }, lean: -4, head: 6, fF: { x: 36, y: 40 }, fB: { x: 22, y: 46 }, hF: { x: 40, y: -330 }, hB: { x: -40, y: -220 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'happy', brow: -0.2 } };
function flag(ctx, t, x, y) {
  ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 140); ctx.stroke();
  const wv = i => Math.sin(t * 8 + i) * 6;
  const cols = ['#ff9933', '#ffffff', '#138808'];
  for (let i = 0; i < 3; i++) { ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.moveTo(x, y - 140 + i * 26); ctx.lineTo(x + 110, y - 140 + i * 26 + wv(1)); ctx.lineTo(x + 110, y - 114 + i * 26 + wv(1)); ctx.lineTo(x, y - 114 + i * 26); ctx.fill(); }
  ctx.strokeStyle = '#000080'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + 55, y - 101 + wv(0.5) / 2, 9, 0, 7); ctx.stroke();
}
function confetti(ctx, t, n = 60, seed = 9) {
  for (let i = 0; i < n; i++) { const r = rng(i + seed); const y = ((t * (80 + r() * 120) + r() * 1100) % 1150) - 60; const x = r() * W + Math.sin(t * 2 + i) * 20; ctx.fillStyle = ['#ff9933', '#ffffff', '#138808', '#f6c531', '#2a7de1'][i % 5]; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3 + i); ctx.fillRect(-6, -3, 12, 6); ctx.restore(); }
}
function s1A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 1 });
  const x = lerp(260, 1500, prog(T.n1, T.n1gary, t));
  carry(ctx, t, x, 'sachinCap', 'indiaMate', breathe(ride, t, 1));
  const hp = personPoint(x, GY - 250, 1, 1, ride, 'hF');
  flag(ctx, t, hp.x, hp.y + 20);
  confetti(ctx, t);
  famousCard(ctx, t, T.n1s - 0.1, T.n1gary + 0.1, 'MUMBAI, 2011', 'World Cup champions, at home');
  nameTag(ctx, t, T.n1 + 0.3, T.n1s - 0.2, x, GY - 680, 'SACHIN TENDULKAR');
  hud(ctx, t, '#1', 'THE WORLD CUP', T.n1);
}
function s1B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  const td = T.n1drop + 1.1;
  const x = lerp(500, 900, prog(T.n1gary, td, t));
  if (t < td) carry(ctx, t, x, 'garyField', 'garyMate', breathe(mix(ride, { hF: { x: 40, y: -330 } }, 1), t, 1));
  else {
    // teammates wander off, Gary drops flat on the grass
    const k = Ease.in(prog(td, td + 0.35, t));
    const walk = d => { const p = cyclePose((t - td) * 200 + d, { A: 24, lift: 14, lean: 3, hipY: -158, arm: 14 }); p.face = { mouth: 'smile', look: 0.8 }; return p; };
    drawPerson(ctx, x + 38 + (t - td) * 200, GY, 1, walk(0), 'garyMate');
    drawPerson(ctx, x - 40 - (t - td) * 180, GY, -1, walk(40), 'garyMate');
    const fall = mix(ride, { hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 }, hF: { x: 40, y: -110 }, hB: { x: -30, y: -90 }, face: { mouth: 'o', eye: 'wide', brow: -0.8 } }, k);
    drawPerson(ctx, x, GY - lerp(250, 0, k), 1, fall, 'garyField', 1, { groundY: GY });
    if (k >= 1) { dust(ctx, t, td + 0.35, x, GY, 10, 90); const hp = personPoint(x, GY, 1, 1, fall, 'head'); dizzy(ctx, t, hp.x, hp.y - 40, clamp(prog(td + 0.4, td + 0.7, t))); }
  }
  bigWord(ctx, t, td + 0.35, 999, 960, 380, 'THUD.', COL.red, 120);
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', 'THE WORLD CUP', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.2 });
  drawPerson(ctx, 640, GY, 1, celebrate(t), 'sachinCap', 0.94);
  nameTag(ctx, t, T.outro + 0.2, 999, 640, GY - 520, 'THE LITTLE MASTER');
  let g = breathe(mix(P.stand, { head: 6, hF: { x: 40, y: -160 }, face: { mouth: 'smile', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1300, GY, -1, g, 'garyField');
  // Gary sweeping up with a broom
  const hp = personPoint(1300, GY, -1, 1, g, 'hF');
  ctx.strokeStyle = '#8a6a48'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(hp.x + 10, hp.y - 60); ctx.lineTo(hp.x - 40 + Math.sin(t * 6) * 12, GY - 20); ctx.stroke();
  ctx.fillStyle = '#d9a35f'; ctx.beginPath(); ctx.ellipse(hp.x - 46 + Math.sin(t * 6) * 12, GY - 12, 34, 14, 0, 0, 7); ctx.fill();
  if (t > T.gary2) nameTag(ctx, t, T.gary2 + 0.8, 999, 1300, GY - 420, 'THE LITTLE APPRENTICE', '#cfd6e4');
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [T.n5hit + 1.05, T.n4caught, T.n3wait + 0.3, T.n2runs + 0.2, T.n1drop + 1.45];
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
