// Episode: Jasprit Bumrah's greatest moments (as attempted by Gary — bowling).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const celebrate = t => breathe(mix(P.celebrate, { face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);
const calm = t => breathe(mix(P.stand, { hF: { x: 40, y: -170 }, face: { mouth: 'smile', look: 0.8 } }, 1), t, 1.5);

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (o.bowlerPose) bp = o.bowlerPose(t, bp);
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'bumrah');
  } else if (o.bowler) drawPerson(ctx, o.bowler.x, GY, 1, o.bowler.pose, o.bowler.look);
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, GY, -1, o.batter || stanceIdle(t), 'maroonBat');
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), 'dhoniKeep');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function bowledStumps(t, Tb) {
  return { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] };
}
function pigeon(ctx, t, x, y, flap) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#8f98a6'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(0, 0, 22, 14, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(18, -12, 9, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f08a3c'; ctx.beginPath(); ctx.moveTo(26, -12); ctx.lineTo(33, -9); ctx.lineTo(26, -7); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(20, -14, 1.8, 0, 7); ctx.fill();
  ctx.fillStyle = '#6f7886'; ctx.beginPath(); ctx.moveTo(-4, -4); ctx.lineTo(-30, -4 - Math.sin(flap) * 26); ctx.lineTo(-14, 6); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#f08a3c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-4, 12); ctx.lineTo(-4, 20); ctx.moveTo(4, 12); ctx.lineTo(4, 20); ctx.stroke();
  ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 170, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('JASPRIT BUMRAH', 8, 48);
  textOutlined(ctx, 'JASPRIT BUMRAH', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.boom, T.boom + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, '💥 BOOM BOOM 💥', 0, 24, '#1f6fd1', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  const bp = mix(calm(t), { ball: 'F', hF: { x: 40, y: -250 }, eF: 1 }, 1);
  drawPerson(ctx, 1480, GY, -1, bp, 'bumrah');
  nameTag(ctx, t, T.title + 0.4, T.n5, 1680, GY - 320, 'JASPRIT BUMRAH');
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }) : breathe(P.stand, t, 1.5);
    if (t > T.stretch) { const s = Math.sin((t - T.stretch) * 3); g = mix(P.stand, { lean: s * 14, hF: { x: 20 + s * 30, y: -390 }, hB: { x: -10 + s * 30, y: -386 }, eF: 1, eB: 1, face: { mouth: 'flat', eye: 'closed', brow: 0.4 } }, 1); }
    else g.face = { mouth: 'smile', eye: 'open', look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'garyField');
  }
}

// =============== #5 THE ACTION ===============
const S5 = { Tr: 20.05 }; S5.Ta = S5.Tr + 0.45; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 300);
const actBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tr + 0.27, 1150, GY - 6], [S5.Ta, 1716, GY - 140, 10]]);
// a straighter, stiffer bowling arm at the moment of release
const stiff = (t, p) => (t > S5.Tr - 0.15 && t < S5.Tr + 0.1) ? mix(p, { hB: { x: 46, y: -378 }, eB: 1 }, 1) : p;
function s5A(ctx, t) {
  const bat = t < S5.Ta - 0.2 ? stanceIdle(t) : mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1);
  scene(ctx, t, { bowl: S5.bowl, bowlerPose: stiff, batter: bat, ball: actBall, keeper: t > S5.Ta ? mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 }, ball: 'F' }, 1) : null, cheer: t > S5.Ta ? 0.5 : 0.1 });
  const bx = t < S5.bowl.tStride + 0.95 ? bowlerAt(t, S5.bowl).x : 430;
  label(ctx, t, 16.97, 21.5, 760, GY + 70, 'SHORT RUN-UP', COL.yellow, 36);
  label(ctx, t, 17.54, 21.5, 1060, GY + 70, '· SKIPPY', COL.yellow, 36);
  label(ctx, t, 19.14, 21.5, 760, 300, 'STRAIGHT, STIFF ARM', COL.yellow, 40);
  if (t > S5.Tr) label(ctx, t, S5.Tr, 22.3, 1200, 380, 'OUT OF NOWHERE!', COL.red, 54);
  nameTag(ctx, t, T.n5 + 0.3, 19.0, Math.max(150, bx), GY - 420, 'JASPRIT BUMRAH');
  hud(ctx, t, '#5', 'THE ACTION', T.n5);
}
const G5 = { Tr: T.n5knot - 0.05 }; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 300);
const knotted = { hip: { x: 10, y: -150 }, lean: 10, head: 20, fF: { x: 50, y: -8 }, fB: { x: -30, y: -8 }, hF: { x: -40, y: -290 }, hB: { x: 30, y: -300 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'wide', brow: -0.9, look: 0.2, lookY: -0.6 } };
const dropBall = pathOf([[G5.Tr, 400, GY - 330], [G5.Tr + 0.4, 450, GY - 8], [G5.Tr + 0.9, 520, GY - 8, 30], [G5.Tr + 1.4, 560, GY - 8, 8]], true);
function s5B(ctx, t) {
  const after = t2 => breathe(mix(knotted, { hip: { x: 10, y: -150 + Math.sin(t2 * 10) * 4 } }, 1), t2, 1);
  scene(ctx, t, { bowl: G5.bowl, bowlerLook: 'garyField', bowlerPose: (t2, p) => t2 > G5.Tr - 0.1 ? knotted : p, after, ball: dropBall, batter: t > G5.Tr + 0.6 ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  if (t > G5.Tr) {
    // a twisted knot drawn over his shoulder
    const bx = 430 + 30; const by = GY - 260;
    ctx.strokeStyle = '#1f3a6e'; ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 5; const r = 10 + i * 0.6; const px = bx + Math.cos(a + t * 3) * r, py = by + Math.sin(a + t * 3) * r * 0.7; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
    label(ctx, t, G5.Tr + 0.1, 999, 460, GY - 470, 'KNOT!', COL.red, 54);
  }
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE ACTION', T.n5);
}

// =============== #4 THE YORKER ===============
const S4 = { Tr: 31.0 }; S4.Ta = 31.5; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 560);
const yBall = pathOf([[S4.Tr, REL.x, REL.y], [S4.Ta, 1570, GY - 6], [33.9, 1590, GY - 6, 2], [34.5, 1350, GY - 8, 10]], true);
const dig = mix(P.stance, { hip: { x: 0, y: -132 }, lean: 30, head: -24, bat: { a: 6 }, grip: { x: 30, y: -116 }, face: { mouth: 'open', eye: 'wide', brow: -0.8, look: 0.6, lookY: 1 } }, 1);
function s4A(ctx, t) {
  const bat = t < S4.Ta - 0.2 ? stanceIdle(t) : track(t, [[S4.Ta - 0.2, P.stance], [S4.Ta, dig, 'out']]);
  scene(ctx, t, { bowl: S4.bowl, batter: bat, ball: yBall, cheer: 0.4 });
  glowRing(ctx, t, S4.Ta - 0.1, 33.5, 1575, GY - 10, 60);
  label(ctx, t, 31.53, 33.6, 1575, GY + 70, 'BASE OF THE STUMPS', COL.yellow, 32);
  if (t > 33.9) label(ctx, t, 33.9, T.n4gary + 0.2, 1500, GY - 400, 'DUG OUT!', '#2f9e5b', 46);
  if (t > 35.2) label(ctx, t, 35.2, T.n4gary + 0.2, 1500, GY - 350, '(JUST)', COL.ink, 34);
  nameTag(ctx, t, T.n4 + 0.3, 32.0, 430, GY - 420, 'JASPRIT BUMRAH');
  hud(ctx, t, '#4', 'THE YORKER', T.n4);
}
const G4 = { Tr: 39.0 }; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 560);
const toeBall = pathOf([[G4.Tr, 400, GY - 340], [G4.Tr + 0.32, 470, GY - 14], [G4.Tr + 0.9, 540, GY - 8, 40]], true);
function s4B(ctx, t) {
  const hop = t2 => { const h = Math.abs(Math.sin(t2 * 9)) * 26; return mix(P.stand, { hip: { x: 0, y: -170 - h }, fF: { x: 30, y: -70 - h }, fB: { x: -10, y: -8 - h }, hF: { x: 40, y: -110 - h }, hB: { x: 30, y: -100 - h }, lean: 16, face: { mouth: 'open', eye: 'closed', brow: -1 } }, 1); };
  scene(ctx, t, { bowl: G4.bowl, bowlerLook: 'garyField', after: t2 => t2 > G4.Tr + 0.35 ? hop(t2) : P.stand, ball: toeBall, batter: t > G4.Tr + 0.5 ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  impactBurst(ctx, t, G4.Tr + 0.32, 470, GY - 14, 0.8);
  bigWord(ctx, t, G4.Tr + 0.35, 999, 620, 380, 'MY TOES!', COL.yellow, 100);
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE YORKER', T.n4);
}

// =============== #3 THE SLOWER BALL ===============
const S3 = { Tr: 47.2, Tb: 48.95 }; S3.bowl = mkBowler(S3.Tr - 0.3, 290, 560);
const floatBall = pathOf([[S3.Tr, REL.x, REL.y], [48.2, 1100, GY - 180, 120], [48.7, 1400, GY - 6, 20], [S3.Tb, STUMP_G - 6, GY - 70, 30], [S3.Tb + 0.6, 1880, GY - 8, 30]], true);
const early = { hip: { x: -6, y: -152 }, lean: -10, head: 4, fF: { x: 34, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 200 }, grip: { x: -26, y: -300 }, eF: 1, eB: 1, face: { mouth: 'o', eye: 'wide', brow: -0.4, look: 0.8 } };
function s3A(ctx, t) {
  const bat = t < 48.1 ? stanceIdle(t) : track(t, [[48.1, P.stance], [48.3, P.backlift, 'out'], [48.55, early, 'in']]);
  scene(ctx, t, { bowl: S3.bowl, after: t2 => t2 > S3.Tb + 0.2 ? celebrate(t2) : P.stand, batter: bat, ball: floatBall, stumps: bowledStumps(t, S3.Tb), cheer: t > S3.Tb ? 0.9 : 0.1 });
  impactBurst(ctx, t, S3.Tb, STUMP_G, GY - 70, 1.2);
  if (t > 48.6 && t < S3.Tb + 0.3) label(ctx, t, 48.6, S3.Tb + 0.4, 1500, GY - 420, 'TOO EARLY!', COL.red, 44);
  bigWord(ctx, t, S3.Tb + 0.1, T.n3gary + 0.3, 860, 380, 'BOWLED!');
  nameTag(ctx, t, T.n3 + 0.3, 47.0, 300, GY - 420, 'JASPRIT BUMRAH');
  hud(ctx, t, '#3', 'THE SLOWER BALL', T.n3);
}
const G3 = { Tr: 52.6, Ts: 53.9 }; G3.bowl = mkBowler(G3.Tr - 0.3, 290, 560);
const crawl = pathOf([[G3.Tr, REL.x, REL.y], [G3.Tr + 0.5, 700, GY - 8, 60], [G3.Ts, 1000, GY - 8, 10]], true);
function s3B(ctx, t) {
  scene(ctx, t, { bowl: G3.bowl, bowlerLook: 'garyField', after: t2 => breathe(mix(P.stand, { lean: 8, face: { mouth: 'smile', look: 0.8 } }, 1), t2), ball: crawl, batter: t > G3.Ts ? mix(P.stance, { face: { mouth: 'flat', eye: 'half', brow: -0.2 } }, 1) : stanceIdle(t) });
  if (t > 54.0) {
    const k = Ease.out(prog(54.0, 54.6, t));
    const px = lerp(1300, 1004, k), py = lerp(300, GY - 30, k);
    pigeon(ctx, t, px, py, k < 1 ? t * 30 : 0.2 + Math.sin(t * 2) * 0.1);
    if (k >= 1) label(ctx, t, 54.6, 999, 1004, GY - 90, 'COO.', COL.ink, 34);
  }
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE SLOWER BALL', T.n3);
}

// =============== #2 THE HAT-TRICK ===============
const H2 = { r: [62.3, 63.3, 64.3] };
function hatBall(i) { const tr = H2.r[i]; return pathOf([[tr, 399, REL.y], [tr + 0.25, 1180, GY - 6], [tr + 0.45, STUMP_G - 6, GY - 70]]); }
function s2A(ctx, t) {
  let pose = breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t), n = 0, lastHit = -9;
  for (let i = 0; i < 3; i++) {
    const tr = H2.r[i], hit = tr + 0.45;
    if (t >= tr - 0.3 && t < tr + 0.65) pose = bowlerAt(t, { tStride: tr - 0.3, xStride: 296, speed: 0, xStart0: 0 }).pose;
    if (t >= hit) { n++; lastHit = hit; }
  }
  if (t > H2.r[2] + 0.8) pose = celebrate(t);
  const st = lastHit > 0 && t - lastHit < 0.7 ? bowledStumps(t, lastHit) : {};
  const ballFn = tt => { for (let i = 0; i < 3; i++) { const p = hatBall(i)(tt); if (p) return p; } return null; };
  scene(ctx, t, { bowler: { x: 330, pose, look: 'bumrah' }, stumps: st, ball: ballFn, cheer: n > 0 ? 0.8 : 0.2, batter: t > lastHit && t - lastHit < 0.7 ? mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1) : stanceIdle(t) });
  for (let i = 0; i < 3; i++) impactBurst(ctx, t, H2.r[i] + 0.45, STUMP_G, GY - 70, 1);
  if (n > 0) { ctx.save(); ctx.font = font(900, 70, F_TITLE); ctx.textAlign = 'center'; for (let i = 0; i < n; i++) { const s = Ease.back(prog(H2.r[i] + 0.45, H2.r[i] + 0.75, t)); ctx.save(); ctx.translate(780 + i * 180, 380); ctx.scale(s, s); textOutlined(ctx, ['ONE', 'TWO', 'THREE'][i], 0, 0, COL.red, '#fff', 12); ctx.restore(); } ctx.restore(); }
  if (t > 65.4) label(ctx, t, 65.4, T.n2gary + 0.2, 960, 520, '3RD INDIAN EVER TO DO IT', '#1f6fd1', 46);
  famousCard(ctx, t, 59.9, 62.1, 'KINGSTON, 2019', 'Test hat-trick vs West Indies');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 330, GY - 420, 'JASPRIT BUMRAH');
  hud(ctx, t, '#2', 'THE HAT-TRICK', T.n2);
}
const G2 = { hits: [72.3, 72.78, 73.27] };
function s2B(ctx, t) {
  let pose = breathe(mix(P.stand, { face: { mouth: 'flat', brow: 0.6, look: 0.8 } }, 1), t), n = 0;
  for (let i = 0; i < 3; i++) { const h = G2.hits[i], tr = h - 0.45; if (t >= tr - 0.3 && t < tr + 0.4) pose = bowlerAt(t, { tStride: tr - 0.3, xStride: 296, speed: 0, xStart0: 0 }).pose; if (t >= h) n++; }
  if (t > G2.hits[2] + 0.4) pose = breathe(mix(P.handsOnHead, {}, 1), t, 1.5);
  let bat = stanceIdle(t);
  for (const h of G2.hits) { const k = prog(h - 0.15, h + 0.2, t); if (k > 0 && k < 1) bat = mix(P.backlift, { bat: { a: 200 }, grip: { x: -26, y: -300 }, eF: 1, eB: 1, face: { mouth: 'grin' } }, k); }
  if (t > G2.hits[2] + 0.3) bat = mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1);
  const ballFn = tt => { for (const h of G2.hits) { const tr = h - 0.45; const p = pathOf([[tr, 399, REL.y], [tr + 0.27, 1200, GY - 6], [h, 1480, GY - 120], [h + 1.0, -100, -100, 300]])(tt); if (p) return p; } return null; };
  scene(ctx, t, { bowler: { x: 330, pose, look: 'garyField' }, ball: ballFn, batter: bat, ump: n > 0 ? () => P.umpireSix : null, cheer: n * 0.3 });
  if (n > 0) { ctx.save(); for (let i = 0; i < n; i++) { const s = Ease.back(prog(G2.hits[i], G2.hits[i] + 0.3, t)); ctx.save(); ctx.translate(780 + i * 180, 380); ctx.scale(s, s); ctx.font = font(900, 110, F_TITLE); ctx.textAlign = 'center'; textOutlined(ctx, '6', 0, 0, '#2f9e5b', '#fff', 14); ctx.restore(); } ctx.restore(); }
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE HAT-TRICK', T.n2);
}

// =============== #1 THE WORLD CUP ===============
function confetti(ctx, t, t0) {
  for (let i = 0; i < 70; i++) { const r = rng(i + 3); const y = ((t - t0) * (90 + r() * 140) + r() * 1100) % 1150 - 60; const x = r() * W + Math.sin(t * 2 + i) * 20; ctx.fillStyle = ['#ff9933', '#ffffff', '#138808', '#f6c531', '#2a7de1'][i % 5]; ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3 + i); ctx.fillRect(-6, -3, 12, 6); ctx.restore(); }
}
function s1A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: t > 86.9 ? 1 : 0.6 });
  const wk = Math.round(15 * Ease.out3(prog(81.1, 81.9, t)));
  const ec = (4.17 * Ease.out3(prog(82.4, 84.4, t))).toFixed(2);
  const rows = [['WICKETS', t > 81.1 ? wk : '–', COL.yellow], ['ECONOMY', t > 82.4 ? ec : '–', COL.yellow]];
  if (t > 85.4) rows.push(['AWARD', 'PLAYER OF THE TOURNAMENT', COL.yellow]);
  scoreboard(ctx, t, 77.9, T.n1gary + 0.1, 640, 170, 'T20 WORLD CUP 2024', rows, { w: t > 85.4 ? 760 : 560 });
  drawPerson(ctx, 1450, GY, -1, t > 86.9 ? celebrate(t) : calm(t), 'bumrah');
  if (t > 86.9) { confetti(ctx, t, 86.9); label(ctx, t, 86.9, T.n1gary + 0.2, 640, 560, 'INDIA ARE CHAMPIONS!', '#1f6fd1', 60); }
  nameTag(ctx, t, T.n1 + 0.3, T.n1gary + 0.2, 1450, GY - 470, 'JASPRIT BUMRAH');
  hud(ctx, t, '#1', 'THE WORLD CUP', T.n1);
}
function s1B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  const ec = (36 * Ease.out3(prog(90.3, 91.4, t))).toFixed(2);
  scoreboard(ctx, t, T.n1gary + 0.2, 999, 640, 170, "GARY'S BOWLING", [['ECONOMY', t > 90.3 ? ec : '–', COL.red], ['EVERY OVER', t > 92.8 ? '6 6 6 6 6 6' : '', COL.red]], { w: 620 });
  const g = breathe(mix(P.handsOnHead, { face: { mouth: 'frown', eye: 'closed', brow: -1 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, t > 91.36 ? g : breathe(mix(P.stand, { face: { mouth: 'grin', look: -0.8 } }, 1), t, 1.5), 'garyField');
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', 'THE WORLD CUP', T.n1);
}

// =============== OUTRO ===============
function burst(ctx, t, x, y, s, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  starPath(ctx, 0, 0, 90, 46); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 4; ctx.stroke();
  ctx.restore();
}
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  drawPerson(ctx, 600, GY, 1, celebrate(t), 'bumrah');
  const bs = 0.8 + 0.1 * Math.sin(t * 8);
  burst(ctx, t, 600, GY - 560, bs, COL.yellow);
  ctx.font = font(900, 40, F_TITLE); ctx.textAlign = 'center'; textOutlined(ctx, 'BOOM BOOM', 600, GY - 545, COL.red, '#fff', 8);
  const g = breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1, face: { mouth: t > 98.48 ? 'frown' : 'grin', eye: t > 98.48 ? 'half' : 'open', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1320, GY, -1, g, 'garyField');
  if (t > 97.9) {
    // a damp squib: tiny pop, then a sad puff of smoke
    const k = prog(97.9, 98.5, t);
    if (k < 1) burst(ctx, t, 1320, GY - 520, 0.3 * Ease.back(k), '#ffd28a');
    else { ctx.fillStyle = 'rgba(140,140,150,0.7)'; for (let i = 0; i < 4; i++) { const d = (t - 98.5) * 30; ctx.beginPath(); ctx.arc(1300 + i * 16, GY - 520 - d - i * 8, 18 + i * 3, 0, 7); ctx.fill(); } }
  }
  if (t > 98.48) nameTag(ctx, t, 98.48, 999, 1320, GY - 420, 'BOOM BOOM... BUST', '#cfd6e4');
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [G5.Tr + 0.2, G4.Tr + 0.35, 54.6, G2.hits[2] + 0.2, T.n1rate];
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
