// Episode: Wasim Akram's greatest moments (as attempted by Gary — bowling "left-handed").
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const celebrate = t => breathe(mix(P.celebrate, { face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B, o.stumpsB || {});
  drawPerson(ctx, o.umpX ?? UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = o.restX ?? 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (o.bowlerOverride) { const ov = o.bowlerOverride(t); if (ov) { bx = ov.x; bp = ov.pose; } }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'akram');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, GY, -1, o.batter || stanceIdle(t), 'england');
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), 'ausKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function bowledStumps(t, Tb, midOnly) {
  if (midOnly) return { s: [{}, flyingPart(t, Tb, { x: 300, y: -980 }, 820, 96), {}], b: [flyingPart(t, Tb, { x: 260, y: -760 }, 1400, 30), flyingPart(t, Tb, { x: 360, y: -900 }, -1100, -20)] };
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
function dog(ctx, t, x, ball) {
  const y = GY;
  ctx.save(); ctx.translate(x, y);
  const leg = Math.sin(t * 18) * 10;
  ctx.fillStyle = '#c08a4a'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(0, -46, 50, 22, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(48, -66, 18, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(40, -82, 7, 12, -0.4, 0, 7); ctx.fill(); ctx.stroke();
  ctx.lineWidth = 7; ctx.strokeStyle = '#c08a4a';
  for (const [lx, d] of [[-34, leg], [-20, -leg], [24, -leg], [36, leg]]) { ctx.beginPath(); ctx.moveTo(lx, -34); ctx.lineTo(lx + d, -4); ctx.stroke(); }
  ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-50, -52); ctx.quadraticCurveTo(-70, -80 + Math.sin(t * 20) * 10, -64, -88); ctx.stroke();
  ctx.fillStyle = COL.ink; ctx.beginPath(); ctx.arc(54, -70, 2.5, 0, 7); ctx.fill();
  if (ball) drawBall(ctx, 68, -60, 8, 0);
  ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('WASIM AKRAM', 8, 48);
  textOutlined(ctx, 'WASIM AKRAM', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.sultan, T.sultan + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'THE SULTAN OF SWING', 0, 24, '#0b5a31', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  // Akram faces left so his bowling (front) hand reads as the left hand
  const ap = breathe(mix(P.stand, { ball: 'F', hF: { x: 40, y: -250 }, eF: 1, face: { mouth: 'smile', look: 0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1480, GY, -1, ap, 'akram');
  [[4.57, 'LEFT ARM'], [5.23, 'LIGHTNING FAST']].forEach(([t0, txt], i) => nameTag(ctx, t, t0, T.today, 1480 + (i ? 200 : -200), GY - 420, txt, COL.yellow, COL.ink));
  nameTag(ctx, t, T.title + 0.4, T.n5, 1480, GY - 500, 'WASIM AKRAM');
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }) : breathe(P.stand, t, 1.5);
    // ball in the "wrong" hand, then a confused look at both hands
    g = mix(g, { ball: 'B', face: { mouth: t > T.right ? 'o' : 'smile', eye: t > T.right ? 'wide' : 'open', brow: t > T.right ? -0.8 : 0, look: 0.8 } }, 1);
    if (t > T.right) g = mix(g, { hF: { x: 50, y: -220 }, hB: { x: 40, y: -230 }, eF: 1, eB: 1, head: 20, face: { lookY: 1 } }, 1);
    drawPerson(ctx, x, GY, 1, g, 'garyField');
    if (t > T.right) label(ctx, t, T.right, 999, x, GY + 70, 'RIGHT-HANDED', COL.red, 36);
  }
}

// =============== #5 THE LEFT-ARM ANGLE ===============
const S5 = { Tr: 19.0 }; S5.Ta = S5.Tr + 0.5; S5.bowl = mkBowler(S5.Tr - 0.3, 230, 560);
const angBall = pathOf([[S5.Tr, 299, REL.y], [S5.Tr + 0.3, 1150, GY - 6], [S5.Ta, 1530, GY - 120, 10], [S5.Ta + 0.5, 1460, GY - 8, 20]], true);
const angTop = u => ({ x: 0.3 + 0.32 * u, y: u });
const fendOff = { hip: { x: -14, y: -146 }, lean: -14, head: 14, fF: { x: 30, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 60 }, grip: { x: 10, y: -230 }, face: { mouth: 'o', eye: 'wide', brow: -0.9, look: 0.6 } };
function s5A(ctx, t) {
  const bat = t < S5.Ta - 0.25 ? stanceIdle(t) : track(t, [[S5.Ta - 0.25, P.stance], [S5.Ta, fendOff, 'out']]);
  scene(ctx, t, { bowl: S5.bowl, umpX: UMP_X + 60, batter: bat, ball: angBall, cheer: t > S5.Ta ? 0.5 : 0.1 });
  topView(ctx, t, S5.Tr - 0.2, T.n5gary + 0.1, 960, 150, angTop, tt => clamp((tt - S5.Tr) / (S5.Ta - S5.Tr)), 'ANGLES IN', S5.Ta);
  impactBurst(ctx, t, S5.Ta, 1530, GY - 120, 0.6);
  label(ctx, t, 17.4, 19.0, 300, GY + 70, 'ROUND THE WICKET', COL.yellow, 34);
  const bx = t < S5.bowl.tStride + 0.95 ? bowlerAt(t, S5.bowl).x : 430;
  nameTag(ctx, t, T.n5 + 0.3, 18.6, Math.max(150, bx), GY - 420, 'WASIM AKRAM');
  hud(ctx, t, '#5', 'THE LEFT-ARM ANGLE', T.n5);
}
const G5 = { Th: 25.7 }; G5.bowl = mkBowler(G5.Th - 0.2, 150, 560);
function s5B(ctx, t) {
  // Gary runs a wide arc round the wicket, straight into the umpire
  const ov = t2 => {
    if (t2 < T.n5gary + 0.6) return { x: -200, pose: P.stand };
    if (t2 < G5.Th) { const k = prog(T.n5gary + 0.6, G5.Th, t2); const x = lerp(-150, UMP_X - 20, k); const p = cyclePose(x * 1.5, { A: 42, lift: 38, lean: 16, hipY: -150 }); p.face = { mouth: 'flat', brow: 0.8, look: 0.8 }; return { x, pose: p }; }
    const k = Ease.in(prog(G5.Th, G5.Th + 0.35, t2));
    return { x: UMP_X - 30, pose: mix(P.stand, { hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 }, hF: { x: 40, y: -110 }, hB: { x: -30, y: -90 }, face: { mouth: 'o', eye: 'half', brow: -0.8 } }, k) };
  };
  const ump = t2 => t2 < G5.Th ? breathe(P.umpire, t2) : mix(P.umpire, { rot: Math.min(70, (t2 - G5.Th) * 300), hF: { x: 80, y: -300 }, hB: { x: -60, y: -300 }, face: { mouth: 'open', eye: 'wide', brow: -1 } }, 1);
  scene(ctx, t, { bowl: G5.bowl, bowlerLook: 'garyField', bowlerOverride: ov, ump, batter: t > G5.Th ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  impactBurst(ctx, t, G5.Th, UMP_X, GY - 200, 1.2);
  if (t > G5.Th + 0.3) dizzy(ctx, t, UMP_X - 30, GY - 160, 1);
  bigWord(ctx, t, G5.Th, 999, 760, 380, 'THUD!', COL.red, 110);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE LEFT-ARM ANGLE', T.n5);
}

// =============== #4 REVERSE SWING ===============
const S4 = { Tr: 33.1 }; S4.Tb = S4.Tr + 0.55; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 640);
const revBall = pathOf([[S4.Tr, REL.x, REL.y], [S4.Tr + 0.3, 1150, GY - 6], [S4.Tb, STUMP_G - 6, GY - 70, 10], [S4.Tb + 0.6, 1880, GY - 8, 40]], true);
const revTop = u => ({ x: 0.5 + 0.12 * Math.sin(Math.min(u, 0.6) / 0.6 * Math.PI / 2) - (u > 0.6 ? 0.22 * Math.pow((u - 0.6) / 0.4, 1.6) : 0), y: u });
function s4A(ctx, t) {
  const bat = t < S4.Tb - 0.25 ? stanceIdle(t) : mix(P.block, { bat: { a: -10 }, grip: { x: 50, y: -150 }, face: { mouth: 'o', eye: 'wide', look: -1 } }, 1);
  scene(ctx, t, { bowl: S4.bowl, after: t2 => t2 > S4.Tb + 0.2 ? celebrate(t2) : P.stand, batter: bat, ball: revBall, stumps: bowledStumps(t, S4.Tb), cheer: t > S4.Tb ? 0.9 : 0.1 });
  topView(ctx, t, S4.Tr - 0.2, T.n4gary + 0.1, 960, 150, revTop, tt => clamp((tt - S4.Tr) / (S4.Tb - S4.Tr)), 'THE OTHER WAY!', S4.Tb - 0.1);
  impactBurst(ctx, t, S4.Tb, STUMP_G, GY - 70, 1.2);
  label(ctx, t, 31.5, 33.0, 300, GY + 70, 'OLD BALL', COL.yellow, 34);
  bigWord(ctx, t, S4.Tb + 0.1, T.n4gary + 0.3, 1400, 380, 'BOWLED!');
  const bx = t < S4.bowl.tStride + 0.95 ? bowlerAt(t, S4.bowl).x : 430;
  nameTag(ctx, t, T.n4 + 0.3, 32.6, Math.max(150, bx), GY - 420, 'WASIM AKRAM');
  hud(ctx, t, '#4', 'REVERSE SWING', T.n4);
}
const G4 = { Tr: 38.0 }; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 640);
const sqBall = t => { if (t < G4.Tr) return null; const d = t - G4.Tr; if (d > 1.3) return null; return { x: REL.x + 520 * d, y: REL.y + 460 * d + 120 * d * d }; };
function s4B(ctx, t) {
  scene(ctx, t, { bowl: G4.bowl, bowlerLook: 'garyField', after: t2 => breathe(mix(P.stand, { lean: 8, face: { mouth: 'o', eye: 'wide', look: 0.4, lookY: 0.6 } }, 1), t2), batter: t > G4.Tr + 0.5 ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  const bp = sqBall(t); if (bp) drawBall(ctx, bp.x, bp.y, 9 + (t - G4.Tr) * 30, t * 20);
  if (t > T.n4dog - 0.2) { const k = prog(T.n4dog - 0.2, T.n4dog + 2.2, t); const x = lerp(-120, 1100, Ease.inOut(Math.min(1, k * 1.4))) - (k > 0.7 ? (k - 0.7) * 2000 : 0); dog(ctx, t, x, k > 0.45); }
  label(ctx, t, T.n4square, 999, 960, 300, 'TOWARDS SQUARE LEG', COL.red, 48);
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'REVERSE SWING', T.n4);
}

// =============== #3 THE INSWINGING YORKER ===============
const S3 = { Tr: 49.9 }; S3.Tb = S3.Tr + 0.6; S3.bowl = mkBowler(S3.Tr - 0.3, 290, 640);
const inBall = pathOf([[S3.Tr, REL.x, REL.y], [S3.Tb, STUMP_G, GY - 30], [S3.Tb + 0.6, 1880, GY - 8, 30]], true);
const inTop = u => ({ x: 0.68 - 0.18 * Math.pow(u, 2.2), y: u });
function s3A(ctx, t) {
  const bat = t < S3.Tb - 0.3 ? stanceIdle(t) : mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1);
  scene(ctx, t, { bowl: S3.bowl, after: t2 => t2 > S3.Tb + 0.2 ? celebrate(t2) : P.stand, batter: bat, ball: inBall, stumps: bowledStumps(t, S3.Tb, true), cheer: t > S3.Tb ? 1 : 0.1 });
  topView(ctx, t, S3.Tr - 0.6, T.n3gary + 0.1, 960, 150, inTop, tt => clamp((tt - S3.Tr) / (S3.Tb - S3.Tr)), 'SWINGS IN LATE', S3.Tb - 0.2);
  impactBurst(ctx, t, S3.Tb, STUMP_G, GY - 30, 1.3);
  if (t > 52.29) bigWord(ctx, t, 52.29, T.n3gary + 0.3, 1400, 380, 'MIDDLE STUMP!', COL.red, 80);
  const bx = t < S3.bowl.tStride + 0.95 ? bowlerAt(t, S3.bowl).x : 430;
  nameTag(ctx, t, T.n3 + 0.3, 49.4, Math.max(150, bx), GY - 420, 'WASIM AKRAM');
  hud(ctx, t, '#3', 'THE INSWINGING YORKER', T.n3);
}
const G3 = { Tt: 57.5 };
function s3B(ctx, t) {
  // Gary trips over the stumps at his own end while running in
  const ov = t2 => {
    if (t2 < T.n3gary + 0.6) return { x: -200, pose: P.stand };
    if (t2 < G3.Tt) { const k = prog(T.n3gary + 0.6, G3.Tt, t2); const x = lerp(-150, STUMP_B - 40, k); const p = cyclePose(x * 1.5, { A: 42, lift: 38, lean: 16, hipY: -150 }); p.ball = 'F'; p.face = { mouth: 'flat', brow: 0.9, look: 0.8 }; return { x, pose: p }; }
    const k = Ease.in(prog(G3.Tt, G3.Tt + 0.4, t2));
    return { x: STUMP_B + 40, pose: mix(P.stand, { rot: 80 * k, hip: { x: 0, y: -160 }, head: -20, hF: { x: 80, y: -300 }, hB: { x: 40, y: -320 }, eF: 1, eB: 1, fF: { x: -20, y: -60 }, fB: { x: -40, y: -30 }, face: { mouth: 'o', eye: 'wide', brow: -1 } }, k), dy: 0 };
  };
  const ovPos = t2 => { const o = ov(t2); return o; };
  scene(ctx, t, { bowl: mkBowler(99, 290, 560), bowlerLook: 'garyField', bowlerOverride: t2 => { const o = ovPos(t2); return o; }, stumpsB: bowledStumps(t, G3.Tt + 0.05), batter: t > G3.Tt ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  impactBurst(ctx, t, G3.Tt + 0.05, STUMP_B, GY - 60, 1.2);
  if (t > T.n3own) label(ctx, t, T.n3own, 999, STUMP_B + 40, GY + 70, 'HIS OWN STUMPS', COL.red, 36);
  if (t > T.n3run) bigWord(ctx, t, T.n3run, 999, 900, 380, 'ON THE RUN-UP!', COL.red, 80);
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE INSWINGING YORKER', T.n3);
}

// =============== #2 FIVE HUNDRED ===============
function s2A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.8 });
  drawPerson(ctx, 1450, GY, -1, celebrate(t), 'akram');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 1450, GY - 470, 'WASIM AKRAM');
  const n = Math.round(500 * Ease.out3(prog(T.n2 + 0.6, 69.6, t)));
  ctx.save(); ctx.textAlign = 'center';
  ctx.font = font(900, 220, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillText(String(n), 668, 448);
  textOutlined(ctx, String(n), 660, 440, '#0b5a31', '#fff', 18);
  ctx.font = font(900, 54, F_TITLE); textOutlined(ctx, 'ODI WICKETS', 660, 510, COL.ink, '#fff', 10);
  ctx.restore();
  if (t > 66.0) label(ctx, t, 66.0, T.n2gary + 0.2, 660, 600, 'THE FIRST BOWLER EVER TO 500', COL.red, 44);
  famousCard(ctx, t, 63.8, 65.9, 'WORLD CUP, 2003', 'first bowler to 500 ODI wickets');
  hud(ctx, t, '#2', '500', T.n2);
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  const n = Math.round(500 * Ease.out3(prog(T.n2gary + 0.3, 74.2, t)));
  ctx.save(); ctx.textAlign = 'center';
  ctx.font = font(900, 220, F_TITLE); textOutlined(ctx, String(n), 660, 440, '#1f3a6e', '#fff', 18);
  ctx.restore();
  stamp(ctx, t, T.n2wides, 999, 660, 560, 'WIDES');
  const g = breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1, face: { mouth: t > T.n2wides ? 'flat' : 'grin', eye: t > T.n2wides ? 'half' : 'happy', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'garyField');
  if (t > T.n2wides) { const p = mix(P.umpire, { hF: { x: 120, y: -262 }, hB: { x: -110, y: -264 + Math.sin(t * 6) * 10 }, eF: -1, eB: -1, face: { mouth: 'frown', brow: 0.9 } }, 1); drawPerson(ctx, 1150, GY, 1, p, 'umpire'); }
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', '500', T.n2);
}

// =============== #1 THE FINAL ===============
const F1 = { r: [83.0, 84.0] };
function finBall(i) { const tr = F1.r[i]; return pathOf([[tr, 399, REL.y], [tr + 0.5, STUMP_G, GY - 40]]); }
function s1A(ctx, t) {
  let pose = breathe(mix(P.stand, { face: { mouth: 'flat', brow: 0.7, look: 0.8 } }, 1), t), n = 0, lastHit = -9;
  for (let i = 0; i < 2; i++) { const tr = F1.r[i], hit = tr + 0.5; if (t >= tr - 0.3 && t < tr + 0.65) pose = bowlerAt(t, { tStride: tr - 0.3, xStride: 296, speed: 0, xStart0: 0 }).pose; if (t >= hit) { n++; lastHit = hit; } }
  if (t > F1.r[1] + 0.8) pose = celebrate(t);
  const st = lastHit > 0 && t - lastHit < 0.7 ? bowledStumps(t, lastHit) : {};
  const ballFn = tt => { for (let i = 0; i < 2; i++) { const p = finBall(i)(tt); if (p) return p; } return null; };
  fieldBase(ctx, t, n > 0 ? 1 : 0.4);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  drawPerson(ctx, 330, GY, 1, pose, 'akram');
  drawStumps(ctx, STUMP_G, st);
  drawPerson(ctx, GARY_X, GY, -1, t > lastHit && t - lastHit < 0.7 ? mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1) : stanceIdle(t), 'england');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'greenKeeper');
  drawBallPath(ctx, t, ballFn, { trail: 10 });
  for (let i = 0; i < 2; i++) impactBurst(ctx, t, F1.r[i] + 0.5, STUMP_G, GY - 40, 1.2);
  [['LAMB', 0], ['LEWIS', 1]].forEach(([nm, i]) => { if (t > F1.r[i] + 0.5) { const s = Ease.back(prog(F1.r[i] + 0.5, F1.r[i] + 0.8, t)); ctx.save(); ctx.translate(820 + i * 260, 380); ctx.scale(s, s); ctx.font = font(900, 70, F_TITLE); ctx.textAlign = 'center'; textOutlined(ctx, nm, 0, 0, COL.red, '#fff', 12); ctx.font = font(900, 30, F_TITLE); textOutlined(ctx, 'BOWLED', 0, 44, COL.ink, '#fff', 7); ctx.restore(); } });
  if (t > 86.1) { label(ctx, t, 86.1, T.n1gary + 0.2, 960, 520, 'PAKISTAN ARE WORLD CHAMPIONS!', '#0b5a31', 54); for (let i = 0; i < 60; i++) { const r = rng(i + 3); const y = ((t - 86.1) * (90 + r() * 140) + r() * 1100) % 1150 - 60; const x = r() * W; ctx.fillStyle = ['#0b5a31', '#ffffff', '#f6c531'][i % 3]; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3 + i); ctx.fillRect(-6, -3, 12, 6); ctx.restore(); } }
  famousCard(ctx, t, 78.9, 82.8, 'MELBOURNE, 1992', 'World Cup final · Pakistan vs England');
  nameTag(ctx, t, T.n1 + 0.3, T.n1gary + 0.2, 330, GY - 420, 'WASIM AKRAM');
  hud(ctx, t, '#1', 'THE FINAL', T.n1);
}
const G1 = { r: [90.2, 91.2] };
function s1B(ctx, t) {
  let pose = breathe(mix(P.stand, { face: { mouth: 'flat', brow: 0.6, look: 0.8 } }, 1), t), hits = 0;
  for (let i = 0; i < 2; i++) { const tr = G1.r[i]; if (t >= tr - 0.3 && t < tr + 0.5) pose = bowlerAt(t, { tStride: tr - 0.3, xStride: 296, speed: 0, xStart0: 0 }).pose; if (t >= tr + 0.7) hits++; }
  // each ball is smashed straight back and hits Gary in the same place
  const ballFn = tt => { for (let i = 0; i < 2; i++) { const tr = G1.r[i]; const p = pathOf([[tr, 399, REL.y], [tr + 0.35, 1460, GY - 100, 20], [tr + 0.7, 400, GY - 250, 40]])(tt); if (p) return p; } return null; };
  if (hits > 0) pose = mix(P.stand, { hip: { x: -10, y: -150 }, lean: -14, head: 20, hF: { x: 20, y: -240 }, hB: { x: 10, y: -236 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'closed', brow: -1 } }, 1);
  if (t > T.n1where) pose = mix(pose, { hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 } }, Ease.in(prog(T.n1where, T.n1where + 0.4, t)));
  let bat = stanceIdle(t);
  for (const tr of G1.r) { const k = prog(tr + 0.2, tr + 0.5, t); if (k > 0 && k < 1) bat = mix(P.backlift, { bat: { a: 150 }, grip: { x: 30, y: -220 }, face: { mouth: 'grin' } }, k); }
  fieldBase(ctx, t, 0.2);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  drawPerson(ctx, 330, GY, 1, pose, 'garyField');
  drawStumps(ctx, STUMP_G);
  drawPerson(ctx, GARY_X, GY, -1, bat, 'england');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'ausKeeper');
  drawBallPath(ctx, t, ballFn, { trail: 10 });
  for (const tr of G1.r) impactBurst(ctx, t, tr + 0.7, 400, GY - 250, 1);
  if (hits > 0) { label(ctx, t, G1.r[0] + 0.7, 999, 760, 380, hits > 1 ? 'OUCH! OUCH!' : 'OUCH!', COL.red, 70); }
  if (t > T.n1where + 0.4) dizzy(ctx, t, 330, GY - 200, 1);
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', 'THE FINAL', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  const ap = breathe(mix(P.stand, { ball: 'F', hF: { x: 40, y: -250 }, eF: 1, face: { mouth: 'smile', look: 0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 600, GY, -1, ap, 'akram');
  // a swinging ball orbiting his hand
  const hp = personPoint(600, GY, -1, 1, ap, 'hF');
  for (let i = 0; i < 3; i++) { const a = t * 3 + i * 2.1; ctx.strokeStyle = `rgba(246,197,49,${0.6 - i * 0.15})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(hp.x, hp.y - 30, 60, 22, 0, a, a + 2); ctx.stroke(); }
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 470, 'THE SULTAN OF SWING');
  // Gary swings, misses, swings, misses
  const sw = Math.sin(t * 5);
  const g = mix(P.stance, { bat: { a: 90 + sw * 120 }, grip: { x: 20 + sw * 20, y: -200 }, face: { mouth: 'open', eye: 'closed', brow: -0.6 } }, 1);
  drawPerson(ctx, 1320, GY, -1, g, 'gary');
  if (t > T.gary2 + 0.7) nameTag(ctx, t, T.gary2 + 0.7, 999, 1320, GY - 440, 'SULTAN OF SWINGS AND MISSES', '#cfd6e4');
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [G5.Th, T.n4dog, G3.Tt + 0.05, T.n2wides, G1.r[1] + 0.7];
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
