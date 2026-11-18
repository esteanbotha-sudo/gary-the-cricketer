// Episode: MS Dhoni's greatest moments (as attempted by Gary).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const celebrate = t => breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);

// generic pitch scene. o: {bowl, after, bowlerLook, batter, batLook, batX, batDir, keeper, keepLook, ball, stumps, cheer, ump, extra}
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
  drawPerson(ctx, o.batX ?? GARY_X, GY, o.batDir ?? -1, o.batter, o.batLook);
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), o.keepLook || 'maroonKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function rotor(ctx, t, x, y, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 5;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x, y, 150 - i * 25, 40 - i * 7, -0.25, t * 18 + i, t * 18 + i + 2.2); ctx.stroke(); }
  ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('MS DHONI', 8, 48);
  textOutlined(ctx, 'MS DHONI', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.cool, T.cool + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'CAPTAIN COOL 😎', 0, 24, '#1f6fd1', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.finisher, T.finisher + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  // Dhoni twirls his bat
  const tw = (t * 1.2) % 1;
  const dp = breathe(mix(P.stand, { bat: { a: 180 + tw * 360 }, grip: { x: 30, y: -260 }, eF: 1, face: { mouth: 'smile', look: 0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1480, GY, -1, dp, 'dhoni');
  nameTag(ctx, t, T.title + 0.4, T.n5, 1680, GY - 320, 'MS DHONI');
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? withBat(cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }), 70) : breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 } }, 1), t, 1.5);
    g.face = { mouth: t > T.busy ? 'open' : 'smile', eye: t > T.busy ? 'wide' : 'open', brow: t > T.busy ? -0.6 : 0.2, look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'garyKeeper');
    // a captain's armband
    if (t > T.today + 0.4) label(ctx, t, T.today + 0.4, 999, x, GY + 70, 'KEEPER · CAPTAIN · FINISHER', COL.ink, 30);
    sweat(ctx, t, x + 10, GY - 360, clamp(prog(T.busy, T.busy + 0.3, t)));
  }
}

// =============== #5 THE HELICOPTER SHOT ===============
const H5 = { Tc: 20.1 }; H5.Tr = H5.Tc - 0.5; H5.bowl = mkBowler(H5.Tr - 0.3, 290, 560);
const heliBall = pathOf([[H5.Tr, REL.x, REL.y], [H5.Tc, 1500, GY - 14, 10], [H5.Tc + 1.4, -150, -150, 520]]);
const heliPre = { hip: { x: 0, y: -144 }, lean: 18, head: -14, fF: { x: 40, y: -8 }, fB: { x: -28, y: -8 }, bat: { a: -40 }, grip: { x: 10, y: -150 }, face: { mouth: 'flat', brow: 0.9, look: 0.6, lookY: 0.6 } };
const heliPost = { hip: { x: -4, y: -150 }, lean: -8, head: 4, fF: { x: 36, y: -8 }, fB: { x: -28, y: -8 }, bat: { a: 245 }, grip: { x: 0, y: -300 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', look: 0.6, lookY: -1 } };
function heliPose(t, Tc) {
  if (t < Tc - 0.3) return stanceIdle(t);
  if (t < Tc) return mix(P.stance, heliPre, Ease.out(prog(Tc - 0.3, Tc, t)));
  const k = Ease.out(prog(Tc, Tc + 0.35, t));
  const p = mix(heliPre, heliPost, k);
  p.bat = { a: lerp(-40, 245 + 360 * (t > Tc + 0.35 ? Math.min(1, (t - Tc - 0.35) * 1.5) : 0), k) };
  return p;
}
function s5A(ctx, t) {
  const Tc = H5.Tc;
  scene(ctx, t, { bowl: H5.bowl, batter: heliPose(t, Tc), batLook: 'dhoni', ball: heliBall, cheer: t > Tc ? 1 : 0.1, ump: t > Tc + 1.5 ? () => P.umpireSix : null });
  rotor(ctx, t, GARY_X - 10, GY - 290, clamp(prog(Tc, Tc + 0.2, t)) * (1 - prog(Tc + 1.2, Tc + 1.6, t)));
  impactBurst(ctx, t, Tc, 1500, GY - 14, 0.9);
  label(ctx, t, T.n5d + 0.3, Tc, 1500, GY + 70, 'RIGHT AT THE TOES', COL.yellow, 34);
  const s6 = popScale(t, 22.6, T.n5gary + 0.3, 0.45, 0.2);
  if (s6 > 0) { ctx.save(); ctx.translate(820, 380); ctx.scale(s6, s6); ctx.font = font(900, 240, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('6', 10, 12); textOutlined(ctx, '6', 0, 0, '#2fa35c', '#fff', 18); ctx.restore(); }
  nameTag(ctx, t, T.n5 + 0.3, T.n5gary + 0.2, GARY_X - 20, GY - 440, 'MS DHONI');
  hud(ctx, t, '#5', 'THE HELICOPTER SHOT', T.n5);
}
const G5 = { Tc: T.n5fly + 0.1 }; G5.Tr = G5.Tc - 0.5; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 560);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tc, 1500, GY - 14, 10], [G5.Tc + 0.5, 1600, GY - 8, 6], [G5.Tc + 2.0, 1640, GY - 8, 2]], true);
function s5B(ctx, t) {
  const Tc = G5.Tc;
  let g = heliPose(t, Tc);
  if (t > Tc) { g = mix(g, { bat: null, hF: { x: 20, y: -330 }, hB: { x: -10, y: -326 }, eF: 1, eB: 1, face: { mouth: 'o', eye: 'wide', brow: -0.8, look: 0, lookY: -1 } }, 1); g.bat = null; }
  scene(ctx, t, { bowl: G5.bowl, batter: g, batLook: 'gary', ball: g5Ball, after: t2 => breathe(mix(P.stand, { head: 20, face: { mouth: 'o', look: 0.6, lookY: -1 } }, 1), t2) });
  if (t > Tc) {
    // the bat spins straight up and away like a rotor
    const d = t - Tc, bx = GARY_X - 20 + Math.sin(d * 2) * 30, by = GY - 300 - d * 260;
    const s0 = skeleton(fullPose({ bat: { a: 90 }, grip: { x: -60, y: 0 } }));
    ctx.save(); ctx.translate(bx, by); ctx.scale(Math.cos(d * 22), 0.5 + 0.5 * Math.abs(Math.cos(d * 22))); paintBat(ctx, s0); ctx.restore();
    rotor(ctx, t, bx, by, clamp(1 - d / 3));
  }
  label(ctx, t, T.n5fly + 1.2, 999, 1600, GY + 70, 'THE BALL', COL.red, 34);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE HELICOPTER SHOT', T.n5);
}

// =============== #4 THE LIGHTNING STUMPING ===============
const S4 = { Tb: 36.55 }; S4.Ta = S4.Tb - 0.08; S4.Tr = S4.Ta - 0.85; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 330);
const stBall = pathOf([[S4.Tr, REL.x, REL.y], [S4.Tr + 0.55, 1260, GY - 6, 160], [S4.Ta, 1716, GY - 110, 20]]);
const outPose = { hip: { x: 10, y: -150 }, lean: -6, head: 2, fF: { x: 46, y: -8 }, fB: { x: -24, y: -8 }, bat: { a: 196 }, grip: { x: -30, y: -296 }, eF: 1, eB: 1, face: { mouth: 'o', eye: 'wide', brow: -0.4, look: 0.8 } };
const kWhip = mix(P.keeper, { hip: { x: 30, y: -108 }, lean: 52, head: -40, fF: { x: 50, y: -8 }, hF: { x: 108, y: -124 }, hB: { x: 100, y: -118 }, face: { mouth: 'flat', eye: 'open', brow: 0.6, look: 0.8 } }, 1);
const kHold = mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 } }, 1);
function s4A(ctx, t) {
  const Tb = S4.Tb;
  // batter lifts his back foot as he lunges forward and misses
  let b = stanceIdle(t);
  if (t > S4.Tr + 0.2) b = mix(P.stance, mix(P.block, { fF: { x: 80, y: -8 }, fB: { x: -6, y: -40 }, toeB: 40, hip: { x: 26, y: -134 }, face: { mouth: 'o', eye: 'wide' } }, 1), Ease.out(prog(S4.Tr + 0.2, S4.Ta - 0.1, t)));
  let kp = t < S4.Ta - 0.25 ? keeperIdle(t) : track(t, [[S4.Ta - 0.25, P.keeper], [S4.Ta, kHold, 'out'], [Tb, kWhip, 'in'], [Tb + 0.6, kWhip], [Tb + 0.9, mix(P.celebrate, { face: { mouth: 'smile', eye: 'open' } }, 1), 'out']]);
  if (t > S4.Ta && t < Tb + 1.6) kp = mix(kp, {}, 1), kp.ball = 'F';
  const st = { b: [flyingPart(t, Tb, { x: 140, y: -760 }, 1200, 20), flyingPart(t, Tb, { x: 260, y: -620 }, -900, -15)] };
  scene(ctx, t, { bowl: S4.bowl, bowlerLook: 'indiaMate', batter: b, batLook: 'maroonBat', keeper: kp, keepLook: 'dhoniKeep', ball: stBall, stumps: st, cheer: t > Tb ? 0.9 : 0.1, ump: t > Tb + 0.6 ? () => P.umpireOut : null });
  if (t > S4.Tr + 0.5 && t < Tb + 2) { const fb = personPoint(GARY_X, GY, -1, 1, b, 'fB'); label(ctx, t, S4.Tr + 0.5, Tb + 2, fb.x, GY + 70, 'FOOT UP!', COL.red, 34); }
  impactBurst(ctx, t, Tb, STUMP_G, GY - STUMP_H, 1);
  if (t > Tb) { ctx.save(); ctx.globalAlpha = 1 - prog(Tb, Tb + 0.3, t); ctx.strokeStyle = COL.yellow; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(1700, GY - 300); ctx.lineTo(1660, GY - 210); ctx.lineTo(1700, GY - 200); ctx.lineTo(1650, GY - 110); ctx.stroke(); ctx.restore(); }
  bigWord(ctx, t, Tb + 0.15, T.n4gary + 0.3, 880, 380, 'STUMPED!');
  nameTag(ctx, t, T.n4 + 0.3, T.n4gary + 0.2, 1776, GY - 330, 'MS DHONI');
  hud(ctx, t, '#4', 'THE LIGHTNING STUMPING', T.n4);
}
const G4 = { Tb: 41.6, Ta: 43.3 }; G4.Tr = G4.Ta - 0.85; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 330);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tr + 0.55, 1260, GY - 6, 160], [G4.Ta, 1716, GY - 110, 20], [G4.Ta + 1.0, 2060, GY - 30, 20]]);
function s4B(ctx, t) {
  const Tb = G4.Tb;
  let kp = t < Tb - 0.3 ? keeperIdle(t) : track(t, [[Tb - 0.3, P.keeper], [Tb, kWhip, 'in'], [G4.Ta - 0.2, mix(kWhip, { face: { mouth: 'grin', eye: 'happy' } }, 1)], [G4.Ta + 0.1, mix(kWhip, { head: 10, face: { mouth: 'o', eye: 'wide', look: -1 } }, 1), 'out']]);
  const st = { b: [flyingPart(t, Tb, { x: 140, y: -760 }, 1200, 20), flyingPart(t, Tb, { x: 260, y: -620 }, -900, -15)] };
  scene(ctx, t, { bowl: G4.bowl, bowlerLook: 'garyMate', batter: t > G4.Ta ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t), batLook: 'maroonBat', keeper: kp, keepLook: 'garyKeeper', ball: g4Ball, stumps: st, ump: t > T.n4byes ? P_UMP_FOUR : null });
  label(ctx, t, Tb + 0.2, G4.Ta, 1100, GY + 70, 'BALL STILL COMING...', COL.red, 34);
  bigWord(ctx, t, T.n4byes, 999, 880, 380, '4 BYES', COL.red, 110);
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE LIGHTNING STUMPING', T.n4);
}

// =============== #3 CAPTAIN COOL ===============
// field map: fielders as normalised (x, y) around a batter at the centre
function fieldMap(ctx, t, x, y, r, fielders, ball, catchAt) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.arc(8, 10, r + 14, 0, 7); ctx.fill();
  ctx.fillStyle = '#7fbf5a'; ctx.beginPath(); ctx.arc(0, 0, r + 14, 0, 7); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
  ctx.setLineDash([10, 10]); ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
  ctx.fillStyle = COL.pitch; ctx.fillRect(-12, -60, 24, 120);
  for (const f of fielders) { ctx.fillStyle = f.c || '#2a7de1'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x * r, f.y * r, 13, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#7a1f2b'; ctx.beginPath(); ctx.arc(0, -46, 11, 0, 7); ctx.fill();
  if (ball) {
    ctx.strokeStyle = COL.red; ctx.lineWidth = 6; ctx.setLineDash([12, 8]);
    ctx.beginPath(); ctx.moveTo(0, -46); ctx.lineTo(ball.x * r, ball.y * r); ctx.stroke(); ctx.setLineDash([]);
    drawBall(ctx, ball.x * r, ball.y * r, 10, t * 10);
  }
  ctx.restore();
}
const FIELD = [[-0.7, -0.6], [0.75, -0.55], [-0.95, 0.1], [0.9, 0.25], [-0.5, 0.75], [0.45, 0.8], [0.0, 0.95], [-0.25, -0.85], [0.3, -0.35]];
function s3A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: t > 57.0 ? 1 : 0.6 });
  // panicking team-mates vs a calm captain
  const panic = t > T.n3d + 0.6 && t < 57;
  for (const [i, px] of [[0, 1100], [1, 1700]].map((v, i) => [i, v])) {
    const p = panic ? mix(P.handsOnHead, { hip: { x: 0, y: -162 - Math.abs(Math.sin(t * 8 + i)) * 10 } }, 1) : breathe(P.stand, t, 1.5, i);
    drawPerson(ctx, px, GY, -1, p, 'indiaMate');
  }
  const calm = breathe(mix(P.stand, { hF: { x: 70, y: -230 }, eF: -1, face: { mouth: 'smile', eye: t > 57 ? 'happy' : 'closed', brow: -0.2 } }, 1), t, 1.2);
  drawPerson(ctx, 1400, GY, -1, calm, 'dhoniKeep');
  label(ctx, t, T.n3d + 1.0, 58.3, 1400, GY - 400, 'CALM', '#2f9e5b', 50);
  const mv = Ease.inOut(prog(54.2, 55.6, t));
  const fl = FIELD.map(([x, y], i) => i === 3 ? { x: x - 0.32 * mv, y: y - 0.05 * mv, c: mv > 0 && mv < 1 ? COL.yellow : '#2a7de1' } : { x, y });
  const bk = Ease.out(prog(56.4, 57.0, t));
  const ball = t > 56.4 ? { x: lerp(0, fl[3].x, bk), y: lerp(-46 / 170, fl[3].y, bk) } : null;
  fieldMap(ctx, t, 520, 520, 300 * 0.75, fl, ball);
  if (mv > 0) label(ctx, t, 54.2, 58.3, 520 + 230, 520 - 10, '← 2 STEPS', COL.yellow, 30);
  stamp(ctx, t, 57.05, T.n3gary + 0.1, 520, 520, 'CAUGHT!');
  nameTag(ctx, t, T.n3 + 0.3, T.n3gary + 0.2, 1400, GY - 470, 'MS DHONI');
  hud(ctx, t, '#3', 'CAPTAIN COOL', T.n3);
}
function s3B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.2 });
  const k = Ease.inOut(prog(T.n3gary + 0.4, T.n3slips + 0.4, t));
  const fl = FIELD.map(([x, y], i) => ({ x: lerp(x, 0.12 + i * 0.075, k), y: lerp(y, -0.7 + i * 0.02, k) }));
  const bk = Ease.out(prog(T.n3four, T.n3four + 0.8, t));
  const ball = t > T.n3four ? { x: lerp(0, -0.92, bk), y: lerp(-46 / 170, 0.35, bk) } : null;
  fieldMap(ctx, t, 520, 520, 225, fl, ball);
  if (t > T.n3slips) label(ctx, t, T.n3slips, 999, 520 + 140, 300, '9 SLIPS', COL.red, 40);
  if (t > T.n3four + 0.8) bigWord(ctx, t, T.n3four + 0.8, 999, 520, 520, 'FOUR!', '#2f9e5b', 100);
  let g = breathe(mix(P.stand, { hF: { x: 120, y: -260 }, eF: -1, face: { mouth: 'open', eye: 'wide', brow: -0.8, look: 0.8 } }, 1), t, 2);
  if (t > T.n3four) g = mix(P.handsOnHead, {}, 1);
  drawPerson(ctx, 1400, GY, -1, g, 'garyKeeper');
  sweat(ctx, t, 1380, GY - 360, 1);
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'CAPTAIN COOL', T.n3);
}

// =============== #2 THE TROPHIES ===============
function trophy(ctx, x, y, s, kind) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#5a3a1a'; rrect(ctx, -60, 0, 120, 40, 8); ctx.fill();
  const g = ctx.createLinearGradient(-60, -200, 60, 0); g.addColorStop(0, '#fff3b0'); g.addColorStop(0.5, '#f2c230'); g.addColorStop(1, '#b8860b');
  ctx.fillStyle = g; ctx.strokeStyle = '#8a6a10'; ctx.lineWidth = 4;
  if (kind === 0) { ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-24, -120); ctx.lineTo(24, -120); ctx.lineTo(14, 0); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -150, 40, 0, 7); ctx.fill(); ctx.stroke(); }
  else if (kind === 1) { ctx.beginPath(); ctx.moveTo(-30, 0); ctx.bezierCurveTo(-70, -80, -20, -140, 0, -200); ctx.bezierCurveTo(20, -140, 70, -80, 30, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -190, 26, 0, 7); ctx.fill(); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-10, -60); ctx.lineTo(-60, -110); ctx.lineTo(-50, -150); ctx.lineTo(50, -150); ctx.lineTo(60, -110); ctx.lineTo(10, -60); ctx.lineTo(20, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
function s2A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.8 });
  const items = [[67.9, 'T20 WORLD CUP', '2007'], [71.3, 'WORLD CUP', '2011'], [74.2, 'CHAMPIONS TROPHY', '2013']];
  items.forEach(([t0, nm, yr], i) => {
    const s = Ease.back(prog(t0, t0 + 0.45, t)); if (s <= 0) return;
    const x = 330 + i * 330;
    trophy(ctx, x, 560, s, i);
    ctx.save(); ctx.globalAlpha = clamp(s); ctx.textAlign = 'center';
    ctx.font = font(900, 34, F_TITLE); textOutlined(ctx, nm, x, 650, COL.ink, '#fff', 8);
    ctx.font = font(900, 46, F_TITLE); textOutlined(ctx, yr, x, 700, COL.red, '#fff', 8);
    ctx.restore();
  });
  label(ctx, t, 77.4, T.n2gary + 0.2, 660, 280, 'THE ONLY CAPTAIN TO WIN ALL THREE', '#1f6fd1', 50);
  drawPerson(ctx, 1500, GY, -1, celebrate(t), 'dhoniCap');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 1500, GY - 470, 'MS DHONI');
  hud(ctx, t, '#2', 'THE TROPHIES', T.n2);
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  // a big, empty glass cabinet
  ctx.fillStyle = '#7a5a3a'; rrect(ctx, 240, 180, 820, 600, 18); ctx.fill();
  ctx.fillStyle = 'rgba(210,235,255,0.55)'; rrect(ctx, 270, 210, 760, 540, 10); ctx.fill();
  ctx.fillStyle = '#8a6a48'; for (const yy of [390, 570]) ctx.fillRect(270, yy, 760, 12);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(320, 260); ctx.lineTo(420, 360); ctx.stroke();
  const rs = Ease.back(prog(T.n2most - 0.1, T.n2most + 0.3, t));
  if (rs > 0) {
    ctx.save(); ctx.translate(650, 470); ctx.scale(rs * 0.8, rs * 0.8);
    ctx.fillStyle = '#3b6fc4'; ctx.beginPath(); ctx.moveTo(-30, 20); ctx.lineTo(-50, 120); ctx.lineTo(-20, 100); ctx.lineTo(0, 130); ctx.lineTo(0, 30); ctx.fill();
    ctx.beginPath(); ctx.moveTo(30, 20); ctx.lineTo(50, 120); ctx.lineTo(20, 100); ctx.lineTo(0, 130); ctx.lineTo(0, 30); ctx.fill();
    ctx.fillStyle = '#c0c6cf'; ctx.beginPath(); ctx.arc(0, 0, 60, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a9099'; ctx.lineWidth = 6; ctx.stroke();
    ctx.font = font(900, 20, F_TITLE); ctx.fillStyle = COL.ink; ctx.textAlign = 'center'; ctx.fillText('MOST', 0, -10); ctx.fillText('IMPROVED', 0, 12); ctx.fillText('U-11', 0, 34);
    ctx.restore();
  }
  stamp(ctx, t, T.n2shared, 999, 650, 300, 'SHARED');
  const g = breathe(mix(P.stand, { hF: { x: 50, y: -250 }, eF: 1, face: { mouth: t > T.n2shared ? 'flat' : 'grin', eye: t > T.n2shared ? 'half' : 'open', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1400, GY, -1, g, 'garyField');
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE TROPHIES', T.n2);
}

// =============== #1 THE FINISH ===============
const F1 = { Tc: 96.95 }; F1.Tr = F1.Tc - 0.5; F1.bowl = mkBowler(F1.Tr - 0.3, 290, 560);
const finBall = pathOf([[F1.Tr, REL.x, REL.y], [F1.Tc - 0.15, 1320, GY - 6], [F1.Tc, 1480, GY - 90], [F1.Tc + 1.3, -150, -120, 420]]);
const loft = { hip: { x: 8, y: -146 }, lean: 6, head: -6, fF: { x: 46, y: -8 }, fB: { x: -26, y: -8 }, bat: { a: 150 }, grip: { x: 30, y: -220 }, face: { mouth: 'flat', brow: 0.8, look: 0.6 } };
const loftFollow = { hip: { x: 8, y: -150 }, lean: -6, head: 6, fF: { x: 46, y: -8 }, fB: { x: -26, y: -16 }, bat: { a: 215 }, grip: { x: 0, y: -330 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', look: 0.6, lookY: -1 } };
function s1A(ctx, t) {
  const Tc = F1.Tc;
  let b = t < Tc - 0.35 ? stanceIdle(t) : track(t, [[Tc - 0.35, P.stance], [Tc - 0.1, P.backlift, 'out'], [Tc, loft, 'in'], [Tc + 0.3, loftFollow, 'out']]);
  if (t > Tc + 0.8) { b = mix(loftFollow, {}, 1); b.bat = { a: 215 + (t - Tc - 0.8) * 720 }; }
  if (t > 98.4) b = celebrate(t);
  scene(ctx, t, { bowl: F1.bowl, bowlerLook: 'bowler', batter: b, batLook: 'dhoni', keepLook: 'greenKeeper', ball: finBall, cheer: t > Tc ? 1 : 0.4, ump: t > Tc + 1.3 ? () => P.umpireSix : null });
  impactBurst(ctx, t, Tc, 1480, GY - 90, 1);
  if (t > Tc + 1.0) {
    for (let i = 0; i < 70; i++) { const r = rng(i + 3); const y = ((t - Tc) * (90 + r() * 140) + r() * 1100) % 1150 - 60; const x = r() * W + Math.sin(t * 2 + i) * 20; ctx.fillStyle = ['#ff9933', '#ffffff', '#138808', '#f6c531', '#2a7de1'][i % 5]; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3 + i); ctx.fillRect(-6, -3, 12, 6); ctx.restore(); }
  }
  const s6 = popScale(t, Tc + 0.9, T.n1gary + 0.3, 0.45, 0.2);
  if (s6 > 0) { ctx.save(); ctx.translate(820, 380); ctx.scale(s6, s6); ctx.font = font(900, 200, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; textOutlined(ctx, '6', 0, 0, '#2fa35c', '#fff', 16); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'INDIA WIN!', 0, 130, COL.red, '#fff', 12); ctx.restore(); }
  famousCard(ctx, t, T.n1d - 0.1, F1.Tc + 0.6, 'MUMBAI, 2011', 'World Cup final · 91* vs Sri Lanka');
  nameTag(ctx, t, T.n1 + 0.3, T.n1d - 0.2, GARY_X - 20, GY - 440, 'MS DHONI');
  hud(ctx, t, '#1', 'THE FINISH', T.n1);
}
const G1 = { Tc: 100.6, Tk: 102.6 }; G1.Tr = G1.Tc - 0.5; G1.bowl = mkBowler(G1.Tr - 0.3, 290, 560);
const g1Ball = pathOf([[G1.Tr, REL.x, REL.y], [G1.Tc - 0.15, 1320, GY - 6], [G1.Tc, 1480, GY - 90], [G1.Tk, 790, GY - 300, 700]]);
function fielderCatch(t) {
  const x = lerp(-150, 770, Ease.out(prog(G1.Tc + 0.3, G1.Tk - 0.2, t)));
  let p;
  if (t < G1.Tk - 0.2) p = cyclePose(x + 150, { A: 44, lift: 40, lean: 16, hipY: -150, arm: 30 });
  else p = breathe(mix(P.stand, { hF: { x: 30, y: -300 }, hB: { x: 14, y: -296 }, eF: 1, eB: 1, ball: t > G1.Tk ? 'F' : false, face: { mouth: 'grin', eye: 'open', look: 0.6, lookY: -1 } }, 1), t, 1.5);
  if (t > G1.Tk + 0.5) p = mix(P.celebrate, { ball: 'F', face: { mouth: 'grin', eye: 'happy' } }, 1);
  return { x, p };
}
function s1B(ctx, t) {
  const Tc = G1.Tc;
  let b = t < Tc - 0.35 ? stanceIdle(t) : track(t, [[Tc - 0.35, P.stance], [Tc - 0.1, P.backlift, 'out'], [Tc, loft, 'in'], [Tc + 0.3, loftFollow, 'out']]);
  if (t > G1.Tk) b = mix(loftFollow, { face: { mouth: 'o', eye: 'wide', brow: -0.9, look: 0.8 } }, 1);
  if (t > T.n1lose) b = breathe(mix(P.stand, { bat: { a: 16 }, grip: { x: 30, y: -142 }, head: 22, face: { mouth: 'frown', eye: 'half', brow: -1 } }, 1), t, 2);
  scene(ctx, t, { bowl: G1.bowl, bowlerLook: 'maroon', batter: b, batLook: 'gary', ball: g1Ball, after: t2 => t2 > T.n1lose ? mix(P.celebrate, {}, 1) : breathe(P.stand, t2), keeper: t > T.n1lose ? P.celebrate : null, cheer: t > G1.Tk ? 0.3 : 0.4 });
  const f = fielderCatch(t);
  if (f.x > -100) drawPerson(ctx, f.x, GY, 1, f.p, 'maroon');
  if (t > G1.Tk) label(ctx, t, G1.Tk, 999, f.x + 10, GY - 420, 'CAUGHT!', COL.red, 44);
  if (t > T.n1lose) { ctx.save(); const s = Ease.back(prog(T.n1lose, T.n1lose + 0.4, t)); ctx.translate(960, 330); ctx.scale(s, s); ctx.font = font(900, 84, F_TITLE); ctx.textAlign = 'center'; textOutlined(ctx, 'MAROON WIN!', 0, 0, '#7a1f2b', '#fff', 14); ctx.restore(); }
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', 'THE FINISH', T.n1);
}

// =============== OUTRO ===============
function thermometer(ctx, x, y, level, col) {
  ctx.fillStyle = '#fff'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 4;
  rrect(ctx, x - 16, y - 200, 32, 210, 16); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y + 20, 30, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y + 20, 22, 0, 7); ctx.fill();
  ctx.fillRect(x - 8, y - 190 * level, 16, 190 * level + 20);
}
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.2 });
  const dp = breathe(mix(P.stand, { hF: { x: 40, y: -160 }, face: { mouth: 'smirk', look: 0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 600, GY, 1, dp, 'dhoniCap');
  const hd = personPoint(600, GY, 1, 1, dp, 'head');
  ctx.fillStyle = '#111'; rrect(ctx, hd.x + 2, hd.y - 12, 30, 12, 5); ctx.fill();
  thermometer(ctx, 380, GY - 260, 0.15, '#4aa8ff');
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 470, 'CAPTAIN COOL');
  const g = breathe(mix(P.stand, { head: 6, hF: { x: 30, y: -250 }, eF: 1, face: { mouth: 'flat', eye: 'open', brow: -0.4, look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1320, GY, -1, g, 'garyField');
  sweat(ctx, t, 1300, GY - 360, clamp(prog(T.gary2, T.gary2 + 0.4, t)));
  if (t > T.gary2 + 0.5) { thermometer(ctx, 1560, GY - 260, 0.55, '#f2c230'); nameTag(ctx, t, T.gary2 + 0.6, 999, 1320, GY - 430, 'CAPTAIN LUKEWARM', '#ffd28a'); }
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [T.n5fly + 1.6, T.n4byes, T.n3four + 0.8, T.n2shared, T.n1lose];
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
