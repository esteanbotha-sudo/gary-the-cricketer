// Episode: Dale Steyn's greatest moments (as attempted by Gary — bowling again).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const slipIdle = t => breathe(mix(P.keeper, { hip: { x: 0, y: -122 }, lean: 30, head: -20, hF: { x: 50, y: -150 }, hB: { x: 44, y: -146 } }, 1), t, 1.2, 1);
const umpNoBall = { hip: { x: 0, y: -162 }, lean: 0, fF: { x: 16, y: -8 }, fB: { x: -14, y: -8 }, hF: { x: 120, y: -262 }, hB: { x: 20, y: -168 }, eF: -1, eB: -1, face: { mouth: 'flat', brow: 0.8, look: 0.4 } };
const roarPose = t => breathe({ hip: { x: 0, y: -156 }, lean: -10, head: 16, fF: { x: 30, y: -8 }, fB: { x: -26, y: -8 }, hF: { x: 40, y: -210 }, hB: { x: -36, y: -206 }, eF: -1, eB: -1, face: { mouth: 'open', eye: 'wide', brow: 1, look: 0.4 } }, t, 2.5);
const celebrate = t => breathe(mix(P.celebrate, { face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);

// o: {bowl, after, bowlerLook, batter, keeper, slip, ball, stumps, cheer, ump}
function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'steyn');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, GY, -1, o.batter || stanceIdle(t), 'england');
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), 'saKeeper');
  drawPerson(ctx, 1872, GY, -1, o.slip || slipIdle(t), 'saField');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function bowledStumps(t, Tb) {
  return { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] };
}
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
function speedDial(ctx, t, x, y, k, label, col) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#14223f'; rrect(ctx, -220, -170, 440, 260, 20); ctx.fill(); ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = font(900, 26, F_TITLE); ctx.fillStyle = COL.yellow; ctx.textAlign = 'center'; ctx.fillText('SPEED GUN', 0, -130);
  const segs = [['#4ade80', 0, 0.45], ['#f6c531', 0.45, 0.75], ['#e2283c', 0.75, 1]];
  for (const [c, a, b] of segs) { ctx.strokeStyle = c; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(0, 20, 130, Math.PI + a * Math.PI, Math.PI + b * Math.PI); ctx.stroke(); }
  const ang = Math.PI + clamp(k) * Math.PI;
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(Math.cos(ang) * 115, 20 + Math.sin(ang) * 115); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 20, 12, 0, 7); ctx.fill();
  if (label) { ctx.font = font(900, 34, F_TITLE); ctx.fillStyle = col; ctx.fillText(label, 0, 76); }
  ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('DALE STEYN', 8, 48);
  textOutlined(ctx, 'DALE STEYN', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.gun, T.gun + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'THE STEYN GUN', 0, 24, '#0b5a31', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  drawPerson(ctx, 1480, GY, -1, roarPose(t), 'steyn');
  [[T.fast, 'FAST'], [T.fast + 0.38, 'FIERCE'], [T.fast + 1.0, 'FRIGHTENING']].forEach(([t0, txt], i) => nameTag(ctx, t, t0, T.today, 1480 + [-200, 200, 0][i], GY - [400, 400, 470][i], txt, COL.red, '#fff'));
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }) : breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1 }, 1), t, 1.5);
    g.ball = 'F'; g.face = { mouth: t > T.ish ? 'smirk' : 'smile', eye: 'open', brow: 0.2, look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'garyField');
    if (t > T.ish) label(ctx, t, T.ish, 999, x, GY + 70, 'FAST-ISH', COL.ink, 36);
  }
}

// =============== #5 THE OUTSWINGER ===============
const S5 = { Tr: T.n5s + 1.9 }; S5.Te = S5.Tr + 0.45; S5.Tk = 17.95; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 640);
const outBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tr + 0.28, 1080, GY - 6], [S5.Te, 1490, GY - 120, 10], [S5.Tk, 1850, GY - 150, 40]]);
const owTop = u => ({ x: 0.5 + 0.18 * Math.pow(u, 2.5), y: u });
const edgeShot = mix(P.block, { bat: { a: 22 }, face: { mouth: 'o', eye: 'wide', brow: -0.6 } }, 1);
function s5A(ctx, t) {
  const bat = t < S5.Te - 0.25 ? stanceIdle(t) : track(t, [[S5.Te - 0.25, P.stance], [S5.Te, edgeShot, 'out']]);
  const slip = t < S5.Tk - 0.3 ? slipIdle(t) : mix(slipIdle(t), { hF: { x: 40, y: -230 }, hB: { x: 30, y: -226 }, eF: 1, eB: 1, ball: t > S5.Tk ? 'F' : false, face: { mouth: t > S5.Tk ? 'grin' : 'flat', look: 0.8 } }, 1);
  const kp = t > S5.Tk + 0.4 ? mix(P.celebrate, {}, 1) : null;
  scene(ctx, t, { bowl: S5.bowl, after: t2 => t2 > S5.Tk + 0.2 ? roarPose(t2) : breathe(P.stand, t2), batter: bat, slip, keeper: kp, ball: outBall, cheer: t > S5.Tk ? 0.9 : 0.1, ump: t > S5.Tk + 0.6 ? () => P.umpireOut : null });
  topView(ctx, t, S5.Tr - 0.2, S5.Tk, 960, 150, owTop, tt => clamp((tt - S5.Tr) / (S5.Te - S5.Tr)), 'SWINGS AWAY LATE', S5.Te);
  impactBurst(ctx, t, S5.Te, 1490, GY - 120, 0.5);
  if (t > S5.Te) label(ctx, t, S5.Te, S5.Tk + 1.5, 1600, GY - 380, 'EDGE!', COL.red, 44);
  if (t > S5.Tk) bigWord(ctx, t, S5.Tk + 0.1, T.n5gary + 0.3, 700, 380, 'CAUGHT AT SLIP!', COL.red, 80);
  const bx = t < S5.bowl.tStride + 0.95 ? bowlerAt(t, S5.bowl).x : 430;
  nameTag(ctx, t, T.n5 + 0.3, S5.Tk, Math.max(150, bx), GY - 420, 'DALE STEYN');
  hud(ctx, t, '#5', 'THE OUTSWINGER', T.n5);
}
const G5 = { Tr: T.n5back - 1.0 }; G5.Th = 25.0; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 640);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tr + 0.9, 1200, GY - 160, 30], [T.n5back + 1.4, 1100, GY - 240, 80], [G5.Th, 470, GY - 280, 60], [G5.Th + 0.8, 300, GY - 8, 60]], true);
const boomTop = u => u < 0.5 ? { x: 0.5 + 0.35 * Math.sin(u / 0.5 * Math.PI / 2), y: u * 1.6 } : { x: 0.85 - 0.35 * Ease.inOut((u - 0.5) / 0.5), y: 0.8 - 0.8 * ((u - 0.5) / 0.5) };
function s5B(ctx, t) {
  const Th = G5.Th;
  const after = t2 => { if (t2 < Th - 0.4) return breathe(mix(P.stand, { face: { mouth: 'grin', look: 0.8 } }, 1), t2); if (t2 < Th) return mix(P.stand, { face: { mouth: 'o', eye: 'wide', brow: -0.8, look: 0.8 } }, 1); return mix(P.stand, { hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 }, hF: { x: 40, y: -110 }, hB: { x: -30, y: -90 }, face: { mouth: 'o', eye: 'half', brow: -0.8 } }, Ease.in(prog(Th, Th + 0.3, t2))); };
  scene(ctx, t, { bowl: G5.bowl, bowlerLook: 'garyField', after, ball: g5Ball, batter: t > T.n5back ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  impactBurst(ctx, t, Th, 470, GY - 280, 1);
  if (t > Th + 0.4) { const hp = personPoint(430, GY, 1, 1, after(t), 'head'); dizzy(ctx, t, hp.x, hp.y - 40); }
  topView(ctx, t, G5.Tr, T.n4 + 0.1, 1340, 150, boomTop, tt => clamp((tt - G5.Tr) / (Th - G5.Tr)), 'BOOMERANG?!', T.n5back + 1.3);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE OUTSWINGER', T.n5);
}

// =============== #4 THE CELEBRATION ===============
const S4 = { Tb: 30.4 }; S4.Tr = S4.Tb - 0.5; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 640);
const s4Ball = pathOf([[S4.Tr, REL.x, REL.y], [S4.Tr + 0.3, 1200, GY - 6], [S4.Tb, STUMP_G - 6, GY - 80], [S4.Tb + 0.6, 1880, GY - 8, 40]], true);
function s4A(ctx, t) {
  const cam = track(t, [[32.6, { z: 1, x: 960, y: 540 }], [33.2, { z: 1.7, x: 600, y: 600 }, 'inOut'], [36.2, { z: 1.7, x: 600, y: 600 }], [36.6, { z: 1, x: 960, y: 540 }, 'inOut']]);
  ctx.save(); camApply(ctx, cam);
  const bat = t > S4.Tb ? mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1) : t > S4.Tb - 0.2 ? P.block : stanceIdle(t);
  scene(ctx, t, { bowl: S4.bowl, after: t2 => t2 > S4.Tb + 0.3 ? roarPose(t2) : P.stand, batter: bat, ball: s4Ball, stumps: bowledStumps(t, S4.Tb), cheer: t > S4.Tb ? 1 : 0.1 });
  impactBurst(ctx, t, S4.Tb, STUMP_G, GY - 80, 1.2);
  label(ctx, t, 33.13, 36.4, 600, GY - 420, 'FISTS CLENCHED', COL.yellow, 30);
  label(ctx, t, 33.91, 36.4, 600, GY - 380, 'EYES WIDE', COL.yellow, 30);
  ctx.restore();
  if (t > 34.69 && t < 36.4) bigWord(ctx, t, 34.69, 36.4, 1150, 380, 'ROAAAR!', COL.red, 120);
  nameTag(ctx, t, T.n4 + 0.3, 32.5, 430, GY - 420, 'DALE STEYN');
  hud(ctx, t, '#4', 'THE CELEBRATION', T.n4);
}
const G4 = { Tb: 37.5 }; G4.Tr = G4.Tb - 0.5; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 640);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tr + 0.3, 1200, GY - 6], [G4.Tb, STUMP_G - 6, GY - 80], [G4.Tb + 0.6, 1880, GY - 8, 40]], true);
function s4B(ctx, t) {
  const silly = t2 => { const p = mix(P.celebrate, { hip: { x: 0, y: -170 - Math.abs(Math.sin(t2 * 9)) * 30 }, fF: { x: 30, y: -8 - Math.abs(Math.sin(t2 * 9)) * 30 }, fB: { x: -20, y: -40 - Math.abs(Math.sin(t2 * 9)) * 30 }, hF: { x: 60 + Math.sin(t2 * 14) * 40, y: -380 }, hB: { x: -50, y: -370 + Math.cos(t2 * 14) * 30 }, face: { mouth: 'grin', eye: 'happy' } }, 1); return p; };
  const after = t2 => t2 < G4.Tb + 0.2 ? P.stand : t2 < T.n4nb + 1.6 ? silly(t2) : breathe(mix(P.stand, { head: 20, face: { mouth: 'frown', eye: 'half', brow: -1 } }, 1), t2);
  scene(ctx, t, { bowl: G4.bowl, bowlerLook: 'garyField', after, ball: g4Ball, stumps: bowledStumps(t, G4.Tb), batter: t > G4.Tb ? mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1) : stanceIdle(t), ump: t > 40.4 ? () => umpNoBall : null });
  impactBurst(ctx, t, G4.Tb, STUMP_G, GY - 80, 1.2);
  if (t > G4.Tb + 0.2 && t < 40.4) label(ctx, t, G4.Tb + 0.2, 40.4, 430, GY - 470, 'WOOOO!', '#2f9e5b', 50);
  bigWord(ctx, t, 40.5, 999, 900, 380, 'NO BALL!');
  label(ctx, t, 40.7, 999, 460, GY + 70, 'FOOT OVER THE LINE', COL.red, 32);
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE CELEBRATION', T.n4);
}

// =============== #3 THE STEYN GUN (pace) ===============
const S3 = { Tr: 46.55 }; S3.Ta = S3.Tr + 0.38; S3.bowl = mkBowler(S3.Tr - 0.3, 290, 720);
const fastBall = pathOf([[S3.Tr, REL.x, REL.y], [S3.Tr + 0.2, 1200, GY - 6], [S3.Ta, 1716, GY - 150, 10]]);
function s3A(ctx, t) {
  const late = t < S3.Ta + 0.3 ? stanceIdle(t) : track(t, [[S3.Ta + 0.3, P.stance], [S3.Ta + 0.6, mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1), 'out']]);
  const kp = t < S3.Ta ? keeperIdle(t) : mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 + (t > S3.Ta + 0.5 ? Math.sin(t * 20) * 14 : 0) }, hB: { x: 54, y: -146 }, ball: true ? 'F' : false, face: { mouth: t > S3.Ta + 0.5 ? 'open' : 'o', eye: 'wide', brow: -0.6 } }, 1);
  scene(ctx, t, { bowl: S3.bowl, batter: late, keeper: kp, ball: fastBall, cheer: t > S3.Ta ? 0.7 : 0.1 });
  if (t > 47.9) label(ctx, t, 47.9, T.n3gary + 0.2, 1500, GY - 400, 'TOO LATE!', COL.red, 40);
  if (t > S3.Ta + 0.5) label(ctx, t, S3.Ta + 0.5, T.n3gary + 0.2, 1776, GY + 70, 'OUCH, MY HANDS', COL.ink, 28);
  const dk = Ease.out(prog(49.9, 50.6, t));
  if (t > 49.6) speedDial(ctx, t, 960, 330, 0.95 * dk, dk > 0.8 ? 'VERY FAST' : '', COL.red);
  const bx = t < S3.bowl.tStride + 0.95 ? bowlerAt(t, S3.bowl).x : 430;
  nameTag(ctx, t, T.n3 + 0.3, 49.6, Math.max(150, bx), GY - 420, 'DALE STEYN');
  hud(ctx, t, '#3', 'THE STEYN GUN', T.n3);
}
const G3 = { Tr: 53.4 }; G3.bowl = mkBowler(G3.Tr - 0.3, 290, 640);
const slowBall = t => { if (t < G3.Tr) return null; const u = clamp((t - G3.Tr) / 6.0); const x = lerp(REL.x, 1500, u); const y = u < 0.25 ? lerp(REL.y, GY - 6, u / 0.25) : GY - 6 - Math.abs(Math.sin((u - 0.25) * 12)) * 30 * (1 - u); return { x, y }; };
function kidOnBike(ctx, t, x) {
  // little rider: wheels + frame + a small person
  ctx.strokeStyle = COL.ink; ctx.lineWidth = 4;
  for (const wx of [x - 50, x + 50]) { ctx.beginPath(); ctx.arc(wx, GY - 30, 30, 0, 7); ctx.stroke(); ctx.save(); ctx.translate(wx, GY - 30); ctx.rotate(t * 12); ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.moveTo(0, -30); ctx.lineTo(0, 30); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = COL.red; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x - 50, GY - 30); ctx.lineTo(x - 10, GY - 80); ctx.lineTo(x + 40, GY - 80); ctx.lineTo(x + 50, GY - 30); ctx.moveTo(x - 10, GY - 80); ctx.lineTo(x, GY - 30); ctx.stroke();
  const ride = { hip: { x: -10, y: -150 }, lean: 20, head: -10, fF: { x: 10 + Math.cos(t * 12) * 18, y: -40 + Math.sin(t * 12) * 18 }, fB: { x: 10 - Math.cos(t * 12) * 18, y: -40 - Math.sin(t * 12) * 18 }, hF: { x: 70, y: -170 }, hB: { x: 64, y: -166 }, face: { mouth: 'grin', eye: 'open', look: 0.8 } };
  drawPerson(ctx, x, GY - 30, 1, ride, 'garyMate', 0.62, { groundY: GY, noShadow: true });
}
function s3B(ctx, t) {
  scene(ctx, t, { bowl: G3.bowl, bowlerLook: 'garyField', after: t2 => breathe(mix(P.stand, { lean: 10, face: { mouth: 'smile', look: 0.8 } }, 1), t2), ball: slowBall, batter: t > 54.5 ? mix(P.stance, { face: { mouth: 'flat', eye: 'half', brow: -0.2 } }, 1) : stanceIdle(t) });
  const dk = Ease.out(prog(G3.Tr + 0.3, G3.Tr + 1.0, t));
  speedDial(ctx, t, 960, 330, 0.06 * dk, t > T.n3walk ? 'WALKING PACE' : '', '#4ade80');
  if (t > T.n3bike - 0.4) { const kx = lerp(-150, 2100, prog(T.n3bike - 0.4, T.n3bike + 2.4, t)); kidOnBike(ctx, t, kx); }
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE STEYN GUN', T.n3);
}

// =============== #2 WORLD NUMBER ONE ===============
function rankBoard(ctx, t, x, y, rows, title) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; rrect(ctx, -330 + 8, 10, 660, 90 + rows.length * 70, 18); ctx.fill();
  ctx.fillStyle = '#14223f'; rrect(ctx, -330, 0, 660, 90 + rows.length * 70, 18); ctx.fill(); ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = font(900, 30, F_TITLE); ctx.fillStyle = COL.yellow; ctx.textAlign = 'center'; ctx.fillText(title, 0, 50);
  rows.forEach(([rk, nm, v, hi], i) => {
    const yy = 100 + i * 70;
    if (hi) { ctx.fillStyle = 'rgba(246,197,49,0.18)'; ctx.fillRect(-310, yy - 44, 620, 62); }
    ctx.textAlign = 'left'; ctx.font = font(900, 40, F_TITLE); ctx.fillStyle = hi ? COL.yellow : '#fff'; ctx.fillText(rk, -290, yy); ctx.fillText(nm, -200, yy);
    ctx.textAlign = 'right'; ctx.font = font(700, 32, F_TITLE); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillText(v, 290, yy);
  });
  ctx.restore();
}
function s2A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.6 });
  const wk = Math.round(263 * Ease.out3(prog(65.5, 67.4, t)));
  if (t > T.n2 + 0.3) rankBoard(ctx, t, 620, 150, [['#1', 'DALE STEYN', t > 65.5 ? `${wk} WEEKS` : '', true], ['#2', '...', ''], ['#3', '...', '']], 'TEST BOWLER RANKINGS');
  if (t > 67.7) label(ctx, t, 67.7, T.n2gary + 0.2, 620, 520, 'LONGEST EVER AT No. 1', COL.red, 50);
  drawPerson(ctx, 1450, GY, -1, celebrate(t), 'steyn');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 1450, GY - 470, 'DALE STEYN');
  hud(ctx, t, '#2', 'WORLD NUMBER ONE', T.n2);
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  rankBoard(ctx, t, 620, 150, [['#?', 'GARY', ''], ['', '', '']], 'TEST BOWLER RANKINGS');
  if (t > T.n2still - 0.3) {
    ctx.save(); ctx.translate(620, 330);
    ctx.strokeStyle = COL.yellow; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, 30, t * 6, t * 6 + 4.2); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#ffffff'; rrect(ctx, 360, 400, 520, 34, 17); ctx.fill(); ctx.fillStyle = '#2f9e5b'; rrect(ctx, 364, 404, 512 * 0.99, 26, 13); ctx.fill();
    label(ctx, t, T.n2still, 999, 620, 480, 'LOADING... 99%', COL.ink, 34);
  }
  const g = breathe(mix(P.stand, { head: 10, hF: { x: 30, y: -250 }, eF: 1, face: { mouth: 'flat', eye: 'open', brow: 0.2, look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'garyField');
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'WORLD NUMBER ONE', T.n2);
}

// =============== #1 FOUR HUNDRED AND THIRTY-NINE ===============
function s1A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.8 });
  drawPerson(ctx, 1450, GY, -1, roarPose(t), 'steyn');
  nameTag(ctx, t, T.n1 + 0.3, T.n1gary + 0.2, 1450, GY - 470, 'DALE STEYN');
  const n = Math.round(439 * Ease.out3(prog(T.n1 + 0.5, 78.4, t)));
  ctx.save(); ctx.textAlign = 'center';
  ctx.font = font(900, 220, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillText(String(n), 668, 448);
  textOutlined(ctx, String(n), 660, 440, '#0b5a31', '#fff', 18);
  ctx.font = font(900, 54, F_TITLE); textOutlined(ctx, 'TEST WICKETS', 660, 510, COL.ink, '#fff', 10);
  ctx.restore();
  if (t > 81.2) {
    const k = Ease.out3(prog(81.2, 82.2, t));
    [['DALE STEYN', 439, '#0b5a31'], ['SHAUN POLLOCK', 421, '#3b6fc4']].forEach(([nm, v, c], i) => {
      const y = 600 + i * 96, w = 560 * (v / 439) * k;
      ctx.font = font(900, 30, F_TITLE); ctx.textAlign = 'left'; textOutlined(ctx, nm, 300, y - 10, COL.ink, '#fff', 7);
      ctx.fillStyle = c; rrect(ctx, 300, y, Math.max(10, w), 44, 10); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = font(900, 38, F_TITLE); textOutlined(ctx, String(Math.round(v * k)), 310 + w + 10, y + 36, c, '#fff', 7);
    });
    label(ctx, t, 81.4, T.n1gary + 0.2, 660, 800, 'MOST BY A SOUTH AFRICAN', COL.red, 38);
  }
  hud(ctx, t, '#1', '439 TEST WICKETS', T.n1);
}
function s1B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.1 });
  const n = Math.round(439 * Ease.out3(prog(T.n1gary + 0.3, 86.4, t)));
  ctx.save(); ctx.textAlign = 'center';
  ctx.font = font(900, 220, F_TITLE); textOutlined(ctx, String(n), 660, 440, '#1f3a6e', '#fff', 18);
  ctx.restore();
  stamp(ctx, t, T.n1nb, 999, 660, 560, 'NO BALLS');
  const g = breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1, face: { mouth: t > T.n1nb ? 'flat' : 'grin', eye: t > T.n1nb ? 'half' : 'happy', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'garyField');
  // umpire signalling no-ball again and again
  if (t > T.n1nb) { const p = mix(P.umpire, { hF: { x: 120, y: -262 + Math.sin(t * 6) * 10 }, eF: -1, face: { mouth: 'frown', brow: 0.9 } }, 1); drawPerson(ctx, 1150, GY, 1, p, 'umpire'); }
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', '439 TEST WICKETS', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  drawPerson(ctx, 600, GY, 1, roarPose(t), 'steyn');
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 470, 'THE STEYN GUN');
  const g = breathe(mix(P.stand, { hF: { x: 70, y: -230 }, eF: -1, face: { mouth: 'smirk', look: 0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1320, GY, -1, g, 'garyField');
  const hp = personPoint(1320, GY, -1, 1, g, 'hF');
  // a bright water pistol, dribbling onto Gary's shoes
  ctx.save(); ctx.translate(hp.x, hp.y); ctx.fillStyle = '#4aa8ff'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; rrect(ctx, -46, -14, 46, 20, 6); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#f6c531'; rrect(ctx, -12, 0, 14, 26, 4); ctx.fill(); ctx.stroke(); ctx.restore();
  if (t > T.gary2 + 0.3) {
    for (let i = 0; i < 10; i++) { const ph = ((t * 2 + i / 10) % 1); const x = hp.x - 46 - ph * 40, y = hp.y - 4 + ph * ph * (GY - hp.y); ctx.fillStyle = 'rgba(80,170,255,0.8)'; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); }
    nameTag(ctx, t, T.gary2 + 0.3, 999, 1320, GY - 420, 'THE STEYN WATER PISTOL', '#bfe3ff');
  }
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [G5.Th, 40.5, T.n3bike, T.n2still, T.n1nb];
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
