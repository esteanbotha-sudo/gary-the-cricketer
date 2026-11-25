// Episode: Muttiah Muralitharan's greatest moments (as attempted by Gary — bowling spin).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const beaten = mix(P.block, { face: { mouth: 'o', eye: 'wide', brow: -0.8, look: -1 } }, 1);
const smile = t => breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1, ball: 'F', face: { mouth: 'grin', eye: 'happy', brow: -0.2 } }, 1), t, 1.5);
const celebrate = t => breathe(mix(P.celebrate, { face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2);

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B, o.stumpsB || {});
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'muraliTest');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, GY, -1, o.batter || stanceIdle(t), o.batLook || 'england');
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), 'slKeeper');
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
function spinRings(ctx, t, x, y) { for (let i = 0; i < 3; i++) { ctx.strokeStyle = `rgba(246,197,49,${0.8 - i * 0.2})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 22 + i * 10, t * 12 + i, t * 12 + i + 3.6); ctx.stroke(); } }

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 140, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('MUTTIAH MURALITHARAN', 8, 48);
  textOutlined(ctx, 'MUTTIAH MURALITHARAN', 0, 40, COL.red, '#fff', 16);
  const kk = Ease.back(prog(T.murali, T.murali + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, '😁 MURALI', 0, 24, '#1b3f8f', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  const mp = smile(t);
  drawPerson(ctx, 1480, GY, -1, mp, 'murali');
  const hp = personPoint(1480, GY, -1, 1, mp, 'hF');
  spinRings(ctx, t, hp.x, hp.y - 10);
  [[7.59, 'BIG SMILE'], [8.67, 'BENDY WRIST']].forEach(([t0, txt], i) => nameTag(ctx, t, t0, T.today, 1480 + (i ? 200 : -200), GY - 400, txt, COL.yellow, COL.ink));
  nameTag(ctx, t, T.title + 0.4, T.n5, 1480, GY - 480, 'MURALI');
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }) : breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1 }, 1), t, 1.5);
    g.ball = 'F'; g.face = { mouth: 'smile', eye: 'open', look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'garyField');
    if (t > T.dizzy) label(ctx, t, T.dizzy, 999, x, GY + 70, '🤞 GOOD LUCK', COL.ink, 34);
  }
}

// =============== #5 THE BIG TURN ===============
const S5 = { Tr: 20.2 }; S5.Tp = S5.Tr + 0.75; S5.Tb = 22.4; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 330);
const turnBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tp, 1360, GY - 6, 170], [S5.Tb, STUMP_G, GY - 60, 30], [S5.Tb + 0.6, 1880, GY - 8, 40]], true);
const turnTop = u => u < 0.6 ? { x: 0.5 + 0.25 * Math.sin(u / 0.6 * Math.PI / 2), y: u * 0.95 } : { x: 0.75 - 0.25 * Ease.out((u - 0.6) / 0.4), y: 0.57 + 0.38 * ((u - 0.6) / 0.4) };
function s5A(ctx, t) {
  const bat = t < S5.Tp - 0.2 ? stanceIdle(t) : track(t, [[S5.Tp - 0.2, P.stance], [S5.Tp + 0.05, mix(P.block, { bat: { a: 40 }, grip: { x: 54, y: -160 } }, 1), 'out']]);
  scene(ctx, t, { bowl: S5.bowl, after: t2 => t2 > S5.Tb + 0.2 ? celebrate(t2) : P.stand, batter: t > S5.Tb ? beaten : bat, ball: turnBall, stumps: bowledStumps(t, S5.Tb), cheer: t > S5.Tb ? 0.9 : 0.1 });
  topView(ctx, t, S5.Tr - 0.2, T.n5gary + 0.1, 960, 150, turnTop, tt => clamp((tt - S5.Tr) / (S5.Tb - S5.Tr)), 'SPINS BACK A MILE', S5.Tp);
  impactBurst(ctx, t, S5.Tb, STUMP_G, GY - 60, 1.2);
  bigWord(ctx, t, S5.Tb + 0.1, T.n5gary + 0.3, 1450, 380, 'BOWLED!');
  const bx = t < S5.bowl.tStride + 0.95 ? bowlerAt(t, S5.bowl).x : 430;
  nameTag(ctx, t, T.n5 + 0.3, 19.8, Math.max(150, bx), GY - 420, 'MURALI');
  hud(ctx, t, '#5', 'THE BIG TURN', T.n5);
}
const G5 = { Tr: 24.4 }; G5.Tp = G5.Tr + 0.75; G5.Th = 27.6; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 330);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tp, 1300, GY - 6, 170], [G5.Th, 470, GY - 270, 120], [G5.Th + 0.7, 300, GY - 8, 60]], true);
function s5B(ctx, t) {
  const after = t2 => { if (t2 < G5.Th - 0.5) return breathe(mix(P.stand, { face: { mouth: 'grin', look: 0.8 } }, 1), t2); if (t2 < G5.Th) return mix(P.stand, { face: { mouth: 'o', eye: 'wide', brow: -0.8, look: 0.8 } }, 1); return mix(P.stand, { hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 }, hF: { x: 40, y: -110 }, hB: { x: -30, y: -90 }, face: { mouth: 'o', eye: 'half', brow: -0.8 } }, Ease.in(prog(G5.Th, G5.Th + 0.3, t2))); };
  scene(ctx, t, { bowl: G5.bowl, bowlerLook: 'garyField', after, ball: g5Ball, batter: t > G5.Tp + 0.3 ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t) });
  impactBurst(ctx, t, G5.Th, 470, GY - 270, 1);
  if (t > G5.Th + 0.4) { const hp = personPoint(430, GY, 1, 1, after(t), 'head'); dizzy(ctx, t, hp.x, hp.y - 40); }
  bigWord(ctx, t, G5.Th, 999, 860, 380, 'BONK!', COL.yellow, 110);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE BIG TURN', T.n5);
}

// =============== #4 THE DOOSRA ===============
const S4 = { Tr: 33.0 }; S4.Tp = S4.Tr + 0.75; S4.Tk = S4.Tp + 0.35; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 330);
const dBall = pathOf([[S4.Tr, REL.x, REL.y], [S4.Tp, 1360, GY - 6, 170], [S4.Tk, 1716, GY - 120, 30]]);
const dTop = u => u < 0.7 ? { x: 0.5, y: u * 0.9 } : { x: 0.5 + 0.28 * Ease.out((u - 0.7) / 0.3), y: 0.63 + 0.3 * ((u - 0.7) / 0.3) };
function s4A(ctx, t) {
  const bat = t < S4.Tp - 0.2 ? stanceIdle(t) : track(t, [[S4.Tp - 0.2, P.stance], [S4.Tp + 0.05, mix(P.block, { face: { mouth: 'o', eye: 'wide', look: -1 } }, 1), 'out']]);
  const kp = t > S4.Tk ? mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 }, ball: 'F', face: { mouth: 'grin', look: 0.8 } }, 1) : null;
  scene(ctx, t, { bowl: S4.bowl, after: t2 => smile(t2), batter: bat, keeper: kp, ball: dBall, cheer: t > S4.Tk ? 0.6 : 0.1 });
  topView(ctx, t, S4.Tr - 0.2, T.n4gary + 0.1, 960, 150, dTop, tt => clamp((tt - S4.Tr) / (S4.Tk - S4.Tr)), 'THE OTHER WAY!', S4.Tp);
  if (t > 35.2) label(ctx, t, 35.2, T.n4gary + 0.2, GARY_X - 20, GY - 400, '???', COL.red, 70);
  label(ctx, t, 32.07, 33.0, 300, GY + 70, 'SAME ACTION', COL.yellow, 34);
  const bx = t < S4.bowl.tStride + 0.95 ? bowlerAt(t, S4.bowl).x : 430;
  nameTag(ctx, t, T.n4 + 0.3, 32.6, Math.max(150, bx), GY - 420, 'MURALI');
  hud(ctx, t, '#4', 'THE DOOSRA', T.n4);
}
const G4 = { Tr: 38.6 }; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 330);
// the ball wobbles about in random directions before stopping mid-pitch
const g4Ball = t => { if (t < G4.Tr) return null; const d = t - G4.Tr; const u = Math.min(d, 2.4); return { x: REL.x + 420 * Math.min(u, 1.2) + Math.sin(u * 7) * 140, y: Math.min(GY - 8, REL.y + 330 * u + 120 * u * u) - Math.abs(Math.sin(u * 5)) * 60 * (1 - u / 2.4) }; };
function s4B(ctx, t) {
  const huh = { face: { mouth: 'o', eye: 'wide', brow: -0.6, look: 0.4 }, hF: { x: 40, y: -260 }, eF: 1, head: 14 };
  scene(ctx, t, { bowl: G4.bowl, bowlerLook: 'garyField', after: t2 => t2 > 42.4 ? mix(P.stand, huh, 1) : breathe(P.stand, t2), ball: g4Ball, ump: t > 40.0 ? () => mix(P.umpire, huh, 1) : null, batter: t > 40.0 ? mix(P.stance, { face: { mouth: 'o', eye: 'wide', look: 0 } }, 1) : stanceIdle(t) });
  if (t > 40.0) { label(ctx, t, 40.0, 999, UMP_X + 10, GY - 420, '?', COL.red, 90); label(ctx, t, 40.3, 999, GARY_X - 20, GY - 420, '?', COL.red, 90); }
  if (t > 42.48) label(ctx, t, 42.48, 999, 470, GY - 470, '???', COL.red, 90);
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE DOOSRA', T.n4);
}

// =============== #3 THE OVAL ===============
function s3A(ctx, t) {
  const s = 49.4, e = 54.0, n = Math.min(9, Math.max(0, Math.floor((t - s) / ((e - s) / 9)) + (t > s ? 1 : 0)));
  fieldBase(ctx, t, t > s ? 0.9 : 0.4);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  let pose = smile(t);
  const per = (e - s) / 9;
  if (t > s && t < e) { const i = Math.floor((t - s) / per), tr = s + i * per; pose = bowlerAt(t, { tStride: tr - 0.05, xStride: 296, speed: 0, xStart0: 0 }).pose; const bp = pathOf([[tr + 0.25, 399, REL.y], [tr + 0.25 + per * 0.6, STUMP_G, GY - 60, 120]]); drawBallPath(ctx, t, bp, { trail: 8 }); }
  if (t > e) pose = celebrate(t);
  drawPerson(ctx, 330, GY, 1, pose, 'muraliTest');
  const lastHit = s + (n - 1) * per + 0.25 + per * 0.6;
  drawStumps(ctx, STUMP_G, n > 0 && t - lastHit < 0.4 && t > lastHit ? bowledStumps(t, lastHit) : {});
  drawPerson(ctx, GARY_X, GY, -1, n > 0 && t - lastHit < 0.4 ? beaten : stanceIdle(t), 'england');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'slKeeper');
  if (t > s) scoreboard(ctx, t, s, T.n3gary + 0.1, 1590, 150, 'MURALI', [['THIS INNINGS', t > 51.0 ? '9 / 65' : `${n} wkts`, COL.yellow], ['IN THE MATCH', t > 52.2 ? 16 : '...']], { w: 420 });
  if (t > 53.8) label(ctx, t, 53.8, T.n3gary + 0.2, 760, 400, 'SRI LANKA WIN!', '#1b3f8f', 66);
  famousCard(ctx, t, 47.4, 49.3, 'THE OVAL, 1998', '9 for 65 · 16 wickets in the match');
  nameTag(ctx, t, T.n3 + 0.3, 47.3, 330, GY - 420, 'MURALI');
  hud(ctx, t, '#3', 'THE OVAL', T.n3);
}
function s3B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  // nine attempts: balls flying everywhere except the pitch
  const tries = Math.min(9, Math.max(0, Math.floor((t - 55.6) / 0.28)));
  for (let i = 0; i < tries; i++) {
    const r = rng(i * 13 + 5), d = t - (55.6 + i * 0.28);
    const vx = (r() - 0.3) * 1200, vy = -400 - r() * 500;
    const x = 430 + vx * Math.min(d, 2), y = Math.min(GY + 40 + r() * 100, GY - 200 + vy * d + 900 * d * d);
    drawBall(ctx, x, y, 9, d * 20);
  }
  let g = breathe(P.stand, t, 1.5);
  if (tries > 0 && tries < 9) { const ph = ((t - 55.6) / 0.28) % 1; g = mix(P.stand, { hF: { x: 50, y: -380 + ph * 200 }, eF: 1, face: { mouth: 'flat', brow: 0.6 } }, 1); }
  if (tries >= 9) g = breathe(mix(P.handsOnHead, {}, 1), t, 1.5);
  drawPerson(ctx, 430, GY, 1, g, 'garyField');
  ctx.save(); ctx.translate(1400, 260);
  ctx.fillStyle = '#14223f'; rrect(ctx, -200, 0, 400, 170, 20); ctx.fill(); ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = font(900, 26, F_TITLE); ctx.fillStyle = COL.yellow; ctx.textAlign = 'center'; ctx.fillText(t > T.n3att ? 'ATTEMPTS' : 'GARY TOOK', 0, 40);
  ctx.font = font(900, 96, F_TITLE); ctx.fillStyle = '#fff'; ctx.fillText(String(tries), 0, 140);
  ctx.restore();
  if (t > 58.5) label(ctx, t, 58.5, 999, 1400, 500, 'BALLS ON THE PITCH: 0', COL.red, 40);
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE OVAL', T.n3);
}

// =============== #2 THE SMILE ===============
function sun(ctx, t, x, y) { ctx.fillStyle = '#ffd93b'; ctx.beginPath(); ctx.arc(x, y, 70, 0, 7); ctx.fill(); ctx.strokeStyle = '#ffb000'; ctx.lineWidth = 6; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + t * 0.6; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 86, y + Math.sin(a) * 86); ctx.lineTo(x + Math.cos(a) * 116, y + Math.sin(a) * 116); ctx.stroke(); } }
function s2A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  sun(ctx, t, 1620, 200);
  // Murali bowling again and again, smiling every time
  const per = 1.4, u = ((t - T.n2) / per) % 1;
  let p = u < 0.55 ? bowlerAt(T.n2 + u * per, { tStride: T.n2, xStride: 0, speed: 0, xStart0: 0 }).pose : smile(t);
  p = mix(p, { face: { mouth: 'grin', eye: 'happy', brow: -0.2 } }, 1);
  drawPerson(ctx, 900, GY, 1, p, 'muraliTest', 1.1);
  const ov = Math.min(60, Math.floor(clamp(prog(66.9, 68.8, t)) * 60));
  if (t > 66.9) scoreboard(ctx, t, 66.9, T.n2gary + 0.1, 420, 150, 'OVERS BOWLED', [['TODAY', ov, COL.yellow]], { w: 400 });
  label(ctx, t, 64.4, T.n2gary + 0.2, 900, GY + 70, 'STILL SMILING 😁', '#1b3f8f', 46);
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 900, GY - 520, 'MURALI');
  hud(ctx, t, '#2', 'THE SMILE', T.n2);
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  sun(ctx, t, 1620, 200);
  scoreboard(ctx, t, T.n2gary + 0.2, 999, 420, 150, 'OVERS BOWLED', [['TODAY', 1, COL.red]], { w: 400 });
  let p = mix(P.stand, { face: { mouth: 'grin', eye: 'happy' } }, 1), Y = GY;
  if (t > T.n2tired) { const pl = plank(26, { face: { mouth: 'open', eye: 'closed', brow: -1 } }); p = pl.pose; p.hF = { x: 30, y: -300 }; p.hB = { x: 24, y: -60 }; p.head = 20; Y = pl.Y; }
  drawPerson(ctx, 900, Y, 1, p, 'garyField', 1.1, { groundY: GY });
  if (t > T.n2tired) { sweat(ctx, t, 1000, GY - 120, 1); label(ctx, t, 73.85, 999, 900, 400, 'AFTER ONE OVER', COL.red, 52); }
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE SMILE', T.n2);
}

// =============== #1 EIGHT HUNDRED ===============
const W1 = { Tr: 83.2 }; W1.Tc = W1.Tr + 1.2; W1.bowl = mkBowler(W1.Tr - 0.3, 290, 330);
const lastBall = pathOf([[W1.Tr, REL.x, REL.y], [W1.Tr + 0.75, 1360, GY - 6, 170], [W1.Tr + 0.95, 1480, GY - 100, 20], [W1.Tc, 1860, GY - 160, 20]]);
function s1A(ctx, t) {
  const bat = t < W1.Tr + 0.6 ? stanceIdle(t) : mix(P.block, { bat: { a: 30 }, face: { mouth: 'o', eye: 'wide', look: 0.8 } }, 1);
  const slip = t < W1.Tc - 0.3 ? breathe(mix(P.keeper, { hip: { x: 0, y: -122 }, lean: 30, head: -20, hF: { x: 50, y: -150 }, hB: { x: 44, y: -146 } }, 1), t, 1.2) : mix(P.celebrate, { ball: t > W1.Tc ? 'F' : false }, 1);
  fieldBase(ctx, t, t > W1.Tc ? 1 : 0.6);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, t > W1.Tc + 0.4 ? P.umpireOut : breathe(P.umpire, t), 'umpire');
  let bx = -400, bp = null;
  if (t < W1.bowl.tStride + 0.95) { const r = bowlerAt(t, W1.bowl); bx = r.x; bp = r.pose; } else { bx = 430; bp = t > W1.Tc ? celebrate(t) : smile(t); }
  if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, 'muraliTest');
  drawStumps(ctx, STUMP_G);
  drawPerson(ctx, GARY_X, GY, -1, bat, 'sachin');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'slKeeper');
  drawPerson(ctx, 1872, GY, -1, slip, 'muraliTest');
  drawBallPath(ctx, t, lastBall, { trail: 10 });
  const n = Math.round(lerp(792, 800, Ease.out(prog(80.9, W1.Tc, t))));
  scoreboard(ctx, t, T.n1 + 0.4, T.n1gary + 0.1, 640, 150, 'MURALI · TEST WICKETS', [['', t > W1.Tc ? 800 : Math.min(799, n), t > W1.Tc ? COL.yellow : '#fff']], { w: 520, rh: 100 });
  if (t > W1.Tc) { bigWord(ctx, t, W1.Tc, T.n1gary + 0.3, 1300, 360, '800!', COL.red, 150); for (let i = 0; i < 60; i++) { const r = rng(i + 3); const y = ((t - W1.Tc) * (90 + r() * 140) + r() * 1100) % 1150 - 60; ctx.fillStyle = ['#1b3f8f', '#f6c531', '#ffffff', '#e2283c'][i % 4]; ctx.save(); ctx.translate(r() * W, y); ctx.rotate(t * 3 + i); ctx.fillRect(-6, -3, 12, 6); ctx.restore(); } }
  if (t > 86.8) label(ctx, t, 86.8, T.n1gary + 0.2, 640, 470, '+ 534 ODI WICKETS', '#1b3f8f', 48);
  famousCard(ctx, t, 78.8, 82.5, 'GALLE, 2010', 'last Test, last ball · the 800th wicket');
  hud(ctx, t, '#1', '800 TEST WICKETS', T.n1);
}
function s1B(ctx, t) {
  const s = T.n1gary + 0.2, e = 95.6;
  fieldBase(ctx, t, 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, t > s ? { ...P.umpireSix, hF: { x: 16, y: -395 + Math.sin(t * 10) * 10 } } : breathe(P.umpire, t), 'umpire');
  drawPerson(ctx, 430, GY, 1, t > 93.0 ? breathe(mix(P.handsOnHead, {}, 1), t, 1.5) : breathe(P.stand, t, 1.5), 'garyField');
  drawStumps(ctx, STUMP_G);
  const per = 0.42, i = Math.floor((t - s) / per), u = ((t - s) / per) % 1;
  let bat = stanceIdle(t);
  if (t > s && t < e) { bat = track(u, [[0, P.stance], [0.3, P.backlift, 'out'], [0.5, mix(P.backlift, { bat: { a: 150 }, grip: { x: 30, y: -220 } }, 1), 'in'], [1, P.stance]]); const t0 = s + i * per; drawBallPath(ctx, t, pathOf([[t0 + 0.2 * per, 1480, GY - 110], [t0 + 1.2 * per, i % 2 ? -100 : 700, i % 2 ? 300 : -150, 260]]), { trail: 6 }); }
  drawPerson(ctx, GARY_X, GY, -1, bat, 'gayle');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'slKeeper');
  const runs = Math.round(800 * clamp(prog(s, 94.2, t)));
  scoreboard(ctx, t, s, 999, 640, 150, "GARY'S BOWLING", [['RUNS CONCEDED', runs, COL.red], ['OVERS', t > T.n1over ? 1 : '...']], { w: 560 });
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', '800 TEST WICKETS', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  const mp = smile(t);
  drawPerson(ctx, 600, GY, 1, mp, 'murali');
  const hp = personPoint(600, GY, 1, 1, mp, 'hF'); spinRings(ctx, t, hp.x, hp.y - 10);
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 470, 'MURALI');
  // the whole world wobbling + Gary spinning
  const spinStart = T.gary2 + 0.9, spinEnd = spinStart + 1.3;
  let dir = -1, g = breathe(mix(P.stand, { face: { mouth: 'smile', look: 0.8 } }, 1), t, 1.5);
  if (t > spinStart && t < spinEnd) { dir = Math.floor((t - spinStart) / 0.09) % 2 ? 1 : -1; g = mix(P.stand, { hF: { x: 80, y: -250 }, hB: { x: -80, y: -250 }, eF: -1, eB: -1, face: { mouth: 'open', eye: 'closed' } }, 1); }
  else if (t >= spinEnd) g = mix({ hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 }, hF: { x: 40, y: -110 }, hB: { x: -30, y: -90 }, face: { mouth: 'o', eye: 'half', brow: -0.8 } }, {}, 1);
  drawPerson(ctx, 1400, GY, dir, g, 'garyField');
  if (t > spinStart) { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(1400, GY - 200, 120 + i * 20, 30 + i * 6, 0, t * 9 + i, t * 9 + i + 2); ctx.stroke(); } }
  if (t >= spinEnd) { const hp2 = personPoint(1400, GY, -1, 1, g, 'head'); dizzy(ctx, t, hp2.x, hp2.y - 40); }
  if (t > 102.0) bigWord(ctx, t, 102.0, 999, 1400, 360, 'DIZZY', '#8e5bd0', 100);
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [G5.Th, 42.5, 58.5, T.n2tired, T.n1over];
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
