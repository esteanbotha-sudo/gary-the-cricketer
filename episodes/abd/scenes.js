// Episode: AB de Villiers' greatest shots (as attempted by Gary). Timing comes from T (captions.js).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const OUT_TIMES = [T.n5hit + 0.1, T.n4drop + 0.15, T.n3bowled + 0.05, T.n2miss + 0.35, T.n1gary + 3.0];
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

// ---------- shared pitch scene ----------
function pitch(ctx, t, o) {
  fieldBase(ctx, t, o.cheer || 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    const b = o.bowl;
    let bx = -400, bp = null;
    if (t < b.cfg.tStride + 0.95) { const r = bowlerAt(t, b.cfg); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = b.after ? b.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, b.look || 'maroon');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  if (o.batter) drawPerson(ctx, o.batter.x ?? GARY_X, GY, o.batter.dir ?? -1, o.batter.pose, o.batter.look);
  if (o.keeper) drawPerson(ctx, 1776, GY, -1, o.keeper, o.keeperLook || 'maroonKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const keeperLookUp = { hip: { x: 0, y: -158 }, lean: -6, head: 22, fF: { x: 20, y: -8 }, fB: { x: -16, y: -8 }, hF: { x: 30, y: -300 }, hB: { x: 10, y: -296 }, eF: 1, eB: 1, face: { mouth: 'o', eye: 'wide', brow: -0.6, look: -0.6, lookY: -1 } };
const umpCross = t => mix(P.umpire, { hF: { x: 24, y: -236 }, hB: { x: 30, y: -232 }, head: Math.sin(t * 8) * 6, face: { mouth: 'frown', brow: 0.7 } }, 1);
function swirl(ctx, t, t0, t1, x, y) {
  const a = clamp(prog(t0, t0 + 0.2, t)) * (1 - prog(t1 - 0.2, t1, t)); if (a <= 0 || t > t1) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(t * 7);
  ctx.strokeStyle = COL.yellow; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let i = 0; i < 2; i++) { ctx.rotate(Math.PI); ctx.beginPath(); ctx.arc(0, 0, 40, 0.2, 2.4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(40 * Math.cos(2.4) - 10, 40 * Math.sin(2.4) - 4); ctx.lineTo(40 * Math.cos(2.4), 40 * Math.sin(2.4)); ctx.lineTo(40 * Math.cos(2.4) + 4, 40 * Math.sin(2.4) - 12); ctx.stroke(); }
  ctx.restore();
}
function flyingBat(ctx, x, y, ang) {
  const s0 = skeleton(fullPose({ bat: { a: 0 }, grip: { x: 0, y: 0 } }));
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); paintBat(ctx, s0); ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 72, F_TITLE); textOutlined(ctx, 'AB DE VILLIERS', 0, -110, COL.ink, '#fff', 12);
  const k2 = Ease.back(prog(T.mr360 + 0.7, T.mr360 + 1.2, t));
  if (k2 > 0) {
    ctx.save(); ctx.scale(k2, k2); ctx.rotate((1 - k2) * -0.4);
    ctx.font = font(900, 200, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('MR 360', 8, 70);
    textOutlined(ctx, 'MR 360', 0, 62, COL.red, '#fff', 18);
    ctx.restore();
  }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 54, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest shots, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 300, (tw + 20) * sk, 90); ctx.clip();
    textOutlined(ctx, 'greatest shots, as attempted by Gary', 960, 362, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  // AB: a 360-degree shot montage with radiating shot lines
  const abx = 1520;
  const per = 0.55, u = ((t - T.mr360) / per) % 1;
  let pose = P.stance;
  if (t > T.mr360 && t < T.today - 0.3) {
    const shots = [{ bat: { a: 120 }, grip: { x: 26, y: -190 } }, { bat: { a: 210 }, grip: { x: -10, y: -250 } }, { bat: { a: 60 }, grip: { x: 40, y: -150 } }, { bat: { a: 160 }, grip: { x: 0, y: -270 } }];
    const sh = shots[Math.floor((t - T.mr360) / per) % 4];
    pose = mix(P.stance, mix(P.backlift, sh, Ease.inOut(clamp(u * 2))), 1);
  } else if (t >= T.today - 0.3) pose = mix(P.stance, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, face: { mouth: 'grin', eye: 'happy' } }, Ease.back(prog(T.today - 0.3, T.today + 0.1, t)));
  pose = mix(pose, { face: { mouth: 'grin', eye: 'open', look: 0.6 } }, 1);
  const nLines = Math.floor(clamp((t - T.mr360) / (T.today - T.mr360)) * 16);
  for (let i = 0; i < nLines; i++) {
    const a = i * Math.PI * 2 / 16 + 0.1, born = T.mr360 + i * (T.today - T.mr360) / 16;
    const g = Ease.out3(prog(born, born + 0.4, t)), r0 = 90, r1 = 90 + 220 * g;
    ctx.strokeStyle = 'rgba(226,40,60,0.75)'; ctx.lineWidth = 5; ctx.setLineDash([12, 9]);
    ctx.beginPath(); ctx.moveTo(abx - 20 + Math.cos(a) * r0, GY - 170 + Math.sin(a) * r0 * 0.75); ctx.lineTo(abx - 20 + Math.cos(a) * r1, GY - 170 + Math.sin(a) * r1 * 0.75); ctx.stroke(); ctx.setLineDash([]);
  }
  if (nLines >= 16) { ctx.font = font(900, 60, F_TITLE); ctx.textAlign = 'center'; textOutlined(ctx, '360°', abx - 20, GY - 440, COL.red, '#fff', 10); }
  drawPerson(ctx, abx, GY, -1, breathe(pose, t, 1.2), 'abd');
  nameTag(ctx, t, T.mr360, T.today + 1.5, abx - 20, GY - 470 + (nLines >= 16 ? -80 : 0), 'AB');
  // Gary strolls in, confident
  if (t > T.today) {
    const walkEnd = T.today + 1.6;
    const x = lerp(-120, 640, Ease.out(prog(T.today, walkEnd, t)));
    let g;
    if (t < walkEnd) { g = withBat(cyclePose(x + 120, { A: 28, lift: 16, lean: 4, hipY: -158, arm: 14 }), 70); }
    else {
      const flex = { hip: { x: 0, y: -164 }, lean: -4, head: 6, fF: { x: 16, y: -8 }, fB: { x: -14, y: -8 }, bat: { a: 172 }, grip: { x: 30, y: -330 }, eF: 1, eB: 1 };
      g = track(t, [[walkEnd, mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 } }, 1)], [walkEnd + 0.4, flex, 'back'], [T.wrong - 0.2, flex], [T.wrong + 0.2, mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 }, hF: { x: 40, y: -250 } }, 1), 'back']]);
      g = breathe(g, t, 1.5);
    }
    g.face = { mouth: t > T.wrong ? 'grin' : 'smile', eye: 'open', brow: -0.2, look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'gary');
    speech(ctx, t, T.wrong + 0.1, T.wrong + 1.1, x + 10, GY - 350, 'Easy!', { dx: 40 });
    drawRainCloud(ctx, x + 10, GY - 440 + Math.sin(t * 3) * 6, t, clamp((t - (T.wrong + 1.1)) * 2));
  }
}

// =============== #5 THE RAMP ===============
const R5 = { Tr: T.n5ab + 2.6 };
R5.Tc = R5.Tr + 0.55;
R5.bowl = mkBowler(R5.Tr - 0.3, 290, 560);
const rampBall = pathOf([[R5.Tr, REL.x, REL.y], [R5.Tc - 0.15, 1380, GY - 6], [R5.Tc, 1500, GY - 150, 30], [R5.Tc + 0.9, 2060, 160, 90]]);
function s5A(ctx, t) {
  const Tc = R5.Tc;
  const setup = kneel({ bat: { a: 110 }, grip: { x: 44, y: -168 }, face: { mouth: 'flat', brow: 0.7, look: 0.6 } });
  const flick = kneel({ bat: { a: 158 }, grip: { x: 26, y: -200 }, head: 20, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', look: -0.6, lookY: -1 } });
  let ab = t < Tc - 0.5 ? stanceIdle(t) : track(t, [[Tc - 0.5, P.stance], [Tc - 0.12, setup, 'out'], [Tc + 0.05, flick, 'out']]);
  const kp = t < Tc + 0.1 ? keeperIdle(t) : track(t, [[Tc + 0.1, P.keeper], [Tc + 0.4, keeperLookUp, 'out']]);
  const four = Tc + 1.3;
  pitch(ctx, t, {
    cheer: t > Tc ? 0.9 : 0.1, bowl: { cfg: R5.bowl }, batter: { pose: ab, look: 'abd' }, keeper: kp, ball: rampBall,
    ump: t > four + 0.1 ? P_UMP_FOUR : null,
  });
  impactBurst(ctx, t, Tc, 1500, GY - 150, 0.8);
  nameTag(ctx, t, T.n5 + 0.3, T.n5gary + 0.2, GARY_X - 20, GY - 420, 'AB DE VILLIERS');
  bigWord(ctx, t, four, T.n5gary + 0.3, 1060, 380, 'FOUR!', '#2f9e5b');
  hud(ctx, t, '#5', 'THE RAMP', T.n5);
}
const G5 = { Tr: T.n5hit - 0.45 };
G5.Th = T.n5hit + 0.1;
G5.bowl = mkBowler(G5.Tr - 0.3, 290, 560);
const gRamp = kneel({ bat: { a: 110 }, grip: { x: 44, y: -168 }, head: 16, face: { mouth: 'grin', eye: 'open', look: -0.4, lookY: -1 } });
const gSit = { hip: { x: -30, y: -62 }, lean: -26, head: 14, fF: { x: 70, y: -8 }, fB: { x: 50, y: -8 }, bat: { a: 70 }, grip: { x: 26, y: -92 }, face: { mouth: 'o', eye: 'half', brow: -0.8, look: 0.2 } };
const headAt = personPoint(GARY_X, GY, -1, 1, fullPose(gRamp), 'head');
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tr + 0.42, 1300, GY - 6], [G5.Th, headAt.x - 22, headAt.y - 6, 20], [G5.Th + 0.6, 1300, GY - 520, 160], [G5.Th + 1.2, 1180, GY - 8], [G5.Th + 1.7, 1080, GY - 8, 50]], true);
function s5B(ctx, t) {
  const Th = G5.Th;
  let g = t < Th - 0.6 ? stanceIdle(t) : track(t, [[Th - 0.6, P.stance], [Th - 0.2, gRamp, 'out'], [Th + 0.15, mix(gRamp, { head: 40, lean: -10 }, 1), 'out'], [Th + 0.55, gSit, 'in']]);
  if (t > Th + 0.55) g = breathe(gSit, t, 1);
  pitch(ctx, t, { cheer: 0.15, bowl: { cfg: G5.bowl }, batter: { pose: g, look: 'gary' }, keeper: t > Th ? mix(P.keeper, { face: { mouth: 'grin', eye: 'happy' } }, 1) : keeperIdle(t), ball: g5Ball, ump: t > T.n5not ? umpCross : null });
  impactBurst(ctx, t, Th, headAt.x - 20, headAt.y, 1);
  const hp = personPoint(GARY_X, GY, -1, 1, g, 'head');
  dizzy(ctx, t, hp.x, hp.y - 40, clamp(prog(Th + 0.4, Th + 0.7, t)));
  bigWord(ctx, t, Th, Th + 1.6, hp.x - 60, hp.y - 140, 'BONK!', COL.yellow, 90, 6);
  bigWord(ctx, t, T.n5not, 99, 760, 360, 'NOT FOUR', COL.red, 100);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE RAMP', T.n5);
}

// =============== #4 THE REVERSE SWEEP ===============
const R4 = { Tr: T.n4ab + 1.4 }; R4.Tc = R4.Tr + 0.85; R4.bowl = mkBowler(R4.Tr - 0.3, 290, 330);
const rsBall = pathOf([[R4.Tr, REL.x, REL.y], [R4.Tc - 0.2, 1330, GY - 6, 150], [R4.Tc, 1470, GY - 60, 10], [R4.Tc + 0.7, 2050, GY - 20, 20]]);
const rsSet = kneel({ bat: { a: 80 }, grip: { x: 50, y: -130 }, face: { mouth: 'flat', brow: 0.6, look: 0.7 } });
const rsHit = kneel({ bat: { a: -70 }, grip: { x: 10, y: -150 }, lean: 6, face: { mouth: 'grin', look: -0.8 } });
function s4A(ctx, t) {
  const Tc = R4.Tc;
  let ab = t < T.n4ab + 0.5 ? stanceIdle(t) : track(t, [[T.n4ab + 0.5, P.stance], [T.n4ab + 1.0, rsSet, 'out'], [Tc - 0.06, rsSet], [Tc + 0.15, rsHit, 'out']]);
  pitch(ctx, t, { cheer: t > Tc ? 0.8 : 0.1, bowl: { cfg: R4.bowl, look: 'maroon' }, batter: { pose: ab, look: 'abd' }, keeper: t > Tc ? mix(P.keeper, { head: 0, face: { mouth: 'o', eye: 'wide', look: -1 } }, 1) : keeperIdle(t), ball: rsBall });
  const hp = personPoint(GARY_X, GY, -1, 1, ab, 'hB');
  swirl(ctx, t, T.n4ab + 0.4, T.n4ab + 1.6, hp.x, hp.y);
  label(ctx, t, T.n4ab + 0.4, T.n4ab + 1.8, hp.x, hp.y - 70, 'HANDS SWAPPED', COL.ink, 28);
  impactBurst(ctx, t, Tc, 1470, GY - 60, 0.7);
  fieldInset(ctx, t, Tc + 0.3, T.n4gary + 0.1, 1200, 380, 150, [[3.4, 0.9], [3.9, 0.8], [2.6, 0.85], [2.2, 0.6], [4.4, 0.7], [3.1, 0.45], [2.9, 0.95], [4.0, 0.5]], -0.6, Tc + 0.6, 'NOBODY!');
  nameTag(ctx, t, T.n4 + 0.3, T.n4gary + 0.2, GARY_X - 20, GY - 420, 'AB DE VILLIERS');
  hud(ctx, t, '#4', 'THE REVERSE SWEEP', T.n4);
}
const G4 = { Tr: T.n4drop - 0.2 }; G4.Ta = G4.Tr + 0.75; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 330);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Ta - 0.2, 1330, GY - 6, 150], [G4.Ta, 1500, GY - 40, 10], [G4.Ta + 0.8, 1440, GY - 8, 20]], true);
function s4B(ctx, t) {
  const Td = T.n4drop;
  const empty = kneel({ hF: { x: 40, y: -230 }, hB: { x: 20, y: -236 }, eF: 1, eB: 1, face: { mouth: 'o', eye: 'wide', brow: -0.8, look: -0.6, lookY: -1 } });
  let g = t < T.n4gary + 0.3 ? stanceIdle(t) : t < Td ? track(t, [[T.n4gary + 0.3, P.stance], [T.n4gary + 0.8, rsSet, 'out']]) : track(t, [[Td, mix(rsSet, { bat: null }, 1)], [Td + 0.25, empty, 'out']]);
  if (t >= Td) g.bat = null;
  pitch(ctx, t, { cheer: 0.1, bowl: { cfg: G4.bowl, look: 'maroon' }, batter: { pose: g, look: 'gary' }, keeper: t > Td ? mix(P.keeper, { face: { mouth: 'grin', eye: 'happy' } }, 1) : keeperIdle(t), ball: g4Ball });
  const hp = personPoint(GARY_X, GY, -1, 1, rsSet, 'hB');
  swirl(ctx, t, T.n4gary + 0.4, Td, hp.x, hp.y);
  if (t >= Td) {
    const d = t - Td, land = 1.1;
    if (d < land) flyingBat(ctx, lerp(hp.x, 1860, d / land), hp.y - 520 * d + 900 * d * d * 0.85, d * 14);
    else flyingBat(ctx, 1860, GY - 12, Math.PI / 2 - 0.1);
  }
  speech(ctx, t, Td + 0.9, 99, GARY_X - 20, GY - 300, '...oops.', { dx: -40 });
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE REVERSE SWEEP', T.n4);
}

// =============== #3 THE SCOOP ===============
const R3 = { Tr: T.n3ab + 2.6 }; R3.Tc = R3.Tr + 0.45; R3.bowl = mkBowler(R3.Tr - 0.3, 290, 600);
const scoopBall = pathOf([[R3.Tr, REL.x, REL.y], [R3.Tc - 0.12, 1360, GY - 6], [R3.Tc, 1500, GY - 170, 20], [R3.Tc + 0.8, 2060, 120, 100]]);
const scSet = kneel({ bat: { a: 95 }, grip: { x: 30, y: -176 }, face: { mouth: 'flat', brow: 0.8, look: 0.6 } });
const scFlick = kneel({ bat: { a: 196 }, grip: { x: 6, y: -220 }, eF: 1, eB: 1, head: 18, face: { mouth: 'grin', look: -0.8, lookY: -1 } });
function s3A(ctx, t) {
  const Tc = R3.Tc;
  let ab = t < T.n3ab + 0.2 ? stanceIdle(t) : track(t, [[T.n3ab + 0.2, P.stance], [T.n3ab + 0.6, scSet, 'out'], [Tc - 0.05, scSet], [Tc + 0.12, scFlick, 'out']]);
  const kp = t < Tc ? keeperIdle(t) : track(t, [[Tc, P.keeper], [Tc + 0.2, mix(P.keeper, { hip: { x: 0, y: -80 }, head: -10, hF: { x: 10, y: -150 }, hB: { x: 0, y: -146 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'wide', brow: -0.8 } }, 1), 'out']]);
  pitch(ctx, t, { cheer: t > Tc ? 1 : 0.1, bowl: { cfg: R3.bowl }, batter: { pose: ab, look: 'abd' }, keeper: kp, ball: scoopBall, ump: t > Tc + 1.1 ? P_UMP_FOUR : null });
  const bp = scoopBall(t);
  if (bp && t < Tc) pill(ctx, t, R3.Tr + 0.05, Tc + 0.6, bp.x, bp.y - 50, '90 MPH', COL.red, '#fff');
  impactBurst(ctx, t, Tc, 1500, GY - 170, 0.8);
  bigWord(ctx, t, Tc + 1.0, T.n3gary + 0.3, 1060, 380, 'FOUR!', '#2f9e5b');
  nameTag(ctx, t, T.n3 + 0.3, T.n3gary + 0.2, GARY_X - 20, GY - 420, 'AB DE VILLIERS');
  hud(ctx, t, '#3', 'THE SCOOP', T.n3);
}
const G3 = { Tb: T.n3bowled + 0.05 }; G3.Tr = G3.Tb - 0.6; G3.bowl = mkBowler(G3.Tr - 0.3, 290, 600);
const g3Ball = pathOf([[G3.Tr, REL.x, REL.y], [G3.Tb - 0.15, 1380, GY - 6], [G3.Tb, STUMP_G - 6, GY - 60], [G3.Tb + 0.8, 1880, GY - 8, 40]], true);
function s3B(ctx, t) {
  const Tb = G3.Tb;
  let g = t < T.n3gary + 0.3 ? stanceIdle(t) : track(t, [[T.n3gary + 0.3, P.stance], [T.n3gary + 0.7, kneel({ bat: { a: 20 }, grip: { x: 30, y: -110 }, face: { mouth: 'smile', look: 0.6 } }), 'out']]);
  if (t > T.n3stay) {
    const strain = Math.max(0, Math.sin((t - T.n3stay) * 7)) * 12;
    g = kneel({ hip: { x: -8, y: -96 - strain }, bat: { a: 20 }, grip: { x: 30, y: -110 + strain }, hF: { x: 30, y: -110 }, face: { mouth: 'frown', eye: t > Tb ? 'wide' : 'half', brow: -1, look: 0.4 } });
  }
  const st = { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] };
  pitch(ctx, t, { cheer: t > Tb ? 0.8 : 0.1, bowl: { cfg: G3.bowl, after: t2 => mix(P.celebrate, {}, Ease.back(prog(Tb, Tb + 0.4, t2))) }, batter: { pose: g, look: 'gary' }, stumps: st, keeper: t > Tb ? mix(P.celebrate, { hip: { x: 0, y: -160 } }, 1) : keeperIdle(t), ball: g3Ball, ump: t > Tb + 0.4 ? () => P.umpireOut : null });
  sweat(ctx, t, GARY_X - 30, GY - 330, clamp(prog(T.n3stay, T.n3stay + 0.3, t)));
  speech(ctx, t, T.n3stay + 0.3, Tb - 0.1, GARY_X - 20, GY - 300, 'my knee...', { dx: -40 });
  impactBurst(ctx, t, Tb, STUMP_G, GY - 60, 1.3);
  bigWord(ctx, t, Tb + 0.05, 99, 760, 380, 'BOWLED!');
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE SCOOP', T.n3);
}

// =============== #2 THE FLYING CATCH (boundary) ===============
function diver(t, c) {
  if (t < c.runEnd) {
    const x = lerp(c.x0, c.xRun, prog(c.t0, c.runEnd, t));
    const p = cyclePose(x - c.x0, { A: 48, lift: 46, lean: 20, hipY: -150, arm: 40 });
    p.face = { mouth: 'flat', eye: 'open', brow: 0.8, look: 0.5, lookY: -0.8 };
    return { x, y: GY, pose: p };
  }
  const fly = { hip: { x: 0, y: -160 }, rot: 74, lean: 0, head: -40, fF: { x: -30, y: -20 }, fB: { x: -60, y: -40 }, hF: { x: 8, y: -392 }, hB: { x: -40, y: -170 }, eF: 1, eB: -1, face: { mouth: 'open', eye: 'wide', brow: 0.6, look: 0.8 } };
  if (t < c.land) {
    const u = (t - c.runEnd) / (c.land - c.runEnd);
    const pose = mix(track(u, [[0, mix(fly, { rot: 30 }, 1)], [0.45, fly, 'out']]), {}, 1);
    if (c.catchT && t > c.catchT) pose.ball = 'F';
    return { x: lerp(c.xRun, c.xLand, u), y: GY - Math.sin(u * Math.PI) * 170 + u * 126, pose };
  }
  const lie = { hip: { x: 0, y: -160 }, rot: 90, lean: 0, head: -50, fF: { x: -10, y: -10 }, fB: { x: -30, y: -30 }, hF: { x: 8, y: -392 }, hB: { x: -40, y: -170 }, eF: 1, eB: -1, face: c.lieFace };
  let pose = track(t, [[c.land, fly], [c.land + 0.2, lie, 'out']]);
  if (c.catchT) { pose = track(t, [[c.land, fly], [c.land + 0.2, lie, 'out'], [c.land + 0.7, lie], [c.land + 1.1, mix(lie, { hF: { x: -96, y: -244 }, head: -60 }, 1), 'back']]); pose.ball = 'F'; }
  return { x: c.xLand + Ease.out(prog(c.land, c.land + 0.45, t)) * 80, y: GY + 126, pose };
}
function boundaryBase(ctx, t, cheer) {
  drawBackdrop(ctx, t, { cheer });
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(1730, H + 20); ctx.quadraticCurveTo(1790, GY + 40, 1840, 700); ctx.stroke();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(1724, H + 20); ctx.quadraticCurveTo(1784, GY + 34, 1834, 700); ctx.stroke();
}
const C2 = { t0: T.n2ab + 1.0, runEnd: T.n2ab + 2.2, catchT: T.n2ab + 2.8, land: T.n2ab + 3.1, x0: -180, xRun: 840, xLand: 1440, lieFace: { mouth: 'grin', eye: 'happy', brow: -0.2 } };
function catchBall(t) {
  if (t < T.n2ab) return null;
  if (t < C2.catchT) { const f = diver(C2.catchT, C2); const c = personPoint(f.x, f.y, 1, 1, f.pose, 'hF'); const u = (t - T.n2ab) / (C2.catchT - T.n2ab); return { x: lerp(-60, c.x + 4, u), y: lerp(140, c.y - 8, u) - Math.sin(u * Math.PI) * 160 }; }
  return null;
}
function s2A(ctx, t) {
  boundaryBase(ctx, t, t > C2.land ? 1 : 0.4);
  const f = diver(t, C2);
  drawPerson(ctx, f.x, f.y, 1, f.pose, 'abdField', 1, { groundY: GY });
  if (t > C2.land && t < C2.land + 0.9) dust(ctx, t, C2.land, f.x + 60, GY, 10, 100);
  drawBallPath(ctx, t, catchBall, { trail: 12, dt: 0.015 });
  if (t > C2.catchT && t < C2.catchT + 0.4) { const c = personPoint(f.x, f.y, 1, 1, f.pose, 'hF'); impactBurst(ctx, t, C2.catchT, c.x, c.y, 0.8); }
  const hp = personPoint(f.x, f.y, 1, 1, f.pose, 'head');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, Math.max(140, hp.x), hp.y - 110, 'AB DE VILLIERS');
  stamp(ctx, t, C2.land + 0.4, T.n2gary + 0.1, 960, 380, 'CAUGHT!');
  hud(ctx, t, '#2', 'THE FLYING CATCH', T.n2);
}
const GX = 1050;
const C2g = { t0: T.n2gary, runEnd: T.n2gary + 0.45, land: T.n2gary + 1.2, x0: GX - 40, xRun: GX + 60, xLand: GX + 520, lieFace: { mouth: 'frown', eye: 'closed', brow: -0.6 } };
const g2Ball = pathOf([[T.n2gary - 0.2, -60, 120], [T.n2miss + 0.35, GX, GY - 8, 160], [T.n2miss + 0.75, GX + 40, GY - 8, 40], [T.n2miss + 1.0, GX + 60, GY - 8, 12]], true);
function s2B(ctx, t) {
  boundaryBase(ctx, t, 0.3);
  // X marks the spot
  ctx.strokeStyle = COL.red; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(GX - 20, GY - 8); ctx.lineTo(GX + 20, GY + 8); ctx.moveTo(GX + 20, GY - 8); ctx.lineTo(GX - 20, GY + 8); ctx.stroke();
  let f;
  if (t < T.n2gary + 0.05) f = { x: GX - 40, y: GY, pose: breathe(mix(P.stand, { head: 20, hF: { x: 30, y: -300 }, hB: { x: 10, y: -296 }, eF: 1, eB: 1, face: { mouth: 'smile', look: -0.5, lookY: -1 } }, 1), t) };
  else f = diver(t, C2g);
  if (t > T.n2miss + 0.5) { f = mix(f, {}, 1); f.pose = mix(f.pose, { head: -80, face: { mouth: 'o', eye: 'wide', brow: -0.8, look: -1 } }, 1); }
  drawPerson(ctx, f.x, f.y, 1, f.pose, 'garyField', 1, { groundY: GY });
  if (t > C2g.land && t < C2g.land + 0.9) dust(ctx, t, C2g.land, f.x + 60, GY, 10, 100);
  drawBallPath(ctx, t, g2Ball, { trail: 10, dt: 0.015 });
  dust(ctx, t, T.n2miss + 0.35, GX, GY, 6, 40);
  label(ctx, t, T.n2miss + 0.45, 99, GX, GY + 70, 'WHERE GARY WAS STANDING', COL.red, 32);
  bigWord(ctx, t, T.n2miss + 0.4, 99, 900, 380, 'MISSED!');
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE FLYING CATCH', T.n2);
}

// =============== #1 THE FASTEST HUNDRED ===============
const H1 = { s: T.n1 + 1.0, e: T.n1six + 1.5 };
H1.per = (H1.e - H1.s) / 31;
function smashPose(u) {
  const big = { hip: { x: -6, y: -148 }, lean: 8, head: -6, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 228 }, grip: { x: -16, y: -232 }, face: { mouth: 'flat', eye: 'open', brow: 0.8, look: 0.6 } };
  const imp = { hip: { x: 2, y: -146 }, lean: 6, head: -4, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 120 }, grip: { x: 26, y: -190 }, face: { mouth: 'grin', eye: 'open', brow: 0.6, look: 0.4 } };
  const fol = { hip: { x: -6, y: -152 }, lean: -10, head: 4, fF: { x: 34, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 200 }, grip: { x: -26, y: -300 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', look: -0.4, lookY: -1 } };
  return track(u, [[0, big], [0.4, imp, 'in'], [0.6, fol, 'out'], [1, big, 'inOut']]);
}
function s1A(ctx, t) {
  const inMont = t > H1.s && t < H1.e;
  const n = clamp(Math.floor((t - H1.s) / H1.per) + 1, 0, 31);
  fieldBase(ctx, t, t > H1.s ? 1 : 0.2);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, t > H1.s && t < H1.e + 2 ? { ...P.umpireSix, hF: { x: 16, y: -395 + Math.sin(t * 10) * 10 } } : breathe(P.umpire, t), 'umpire');
  drawStumps(ctx, STUMP_G);
  let ab = stanceIdle(t);
  if (inMont) {
    const u = ((t - H1.s) / H1.per) % 1;
    ab = smashPose(u);
    // incoming + outgoing ball for this delivery
    const i = Math.floor((t - H1.s) / H1.per), t0 = H1.s + i * H1.per, tc = t0 + 0.4 * H1.per;
    const side = i % 3;
    const bp = pathOf([[t0 - H1.per * 0.6, 300, GY - 300], [tc, 1480, GY - 130, 60], [tc + 0.6, side === 0 ? -100 : side === 1 ? 2050 : 700, side === 2 ? -150 : 60, 260]]);
    drawBallPath(ctx, t, bp, { trail: 8 });
    impactBurst(ctx, t, tc, 1480, GY - 130, 0.6);
  } else if (t >= H1.e) ab = breathe(mix(P.stance, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'grin', eye: 'happy' } }, Ease.back(prog(H1.e, H1.e + 0.4, t))), t, 2);
  drawPerson(ctx, GARY_X, GY, -1, ab, 'abd');
  drawPerson(ctx, 1776, GY, -1, t > H1.s ? mix(P.keeper, { hip: { x: 0, y: -150 }, lean: 0, head: 10, hF: { x: 6, y: -318 }, hB: { x: -14, y: -320 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'wide', brow: -0.8 } }, 1) : keeperIdle(t), 'maroonKeeper');
  if (inMont) pill(ctx, t, H1.s, H1.e, 960, 150, '⏩  FAST FORWARD');
  const runs = Math.min(100, Math.round(n / 31 * 100));
  scoreboard(ctx, t, T.n1 + 0.5, T.n1gary + 0.1, 1430, 150, 'AB DE VILLIERS', [['BALLS', n], ['RUNS', runs + (n >= 31 ? '!' : ''), n >= 31 ? COL.yellow : '#fff']], { w: 440 });
  // sixteen sixes
  if (t > T.n1six) {
    const m = clamp(Math.floor((t - T.n1six) / 0.12) + 1, 0, 16);
    ctx.save(); ctx.font = font(900, 40, F_TITLE); ctx.textAlign = 'center';
    textOutlined(ctx, `${m} SIXES IN ONE INNINGS`, 640, 560, '#2f9e5b', '#fff', 9);
    for (let i = 0; i < m; i++) { ctx.font = font(900, 46, F_TITLE); textOutlined(ctx, '6', 295 + i * 46, 490, '#2f9e5b', '#fff', 8); }
    ctx.restore();
  }
  famousCard(ctx, t, T.n1where - 0.2, T.n1gary - 0.1, 'FASTEST ODI HUNDRED', '31 balls · vs West Indies · Johannesburg, 2015');
  nameTag(ctx, t, T.n1 + 0.3, H1.s + 0.5, GARY_X - 20, GY - 420, 'AB DE VILLIERS');
  hud(ctx, t, '#1', 'THE FASTEST HUNDRED', T.n1);
}
function s1B(ctx, t) {
  const s = T.n1gary + 0.3, e = T.n1gary + 3.0, per = (e - s) / 31;
  const n = clamp(Math.floor((t - s) / per) + 1, 0, 31);
  fieldBase(ctx, t, 0.05);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, t > e && t < T.n1mark + 0.2 ? mix(P.umpire, { lean: 0, head: 30, face: { eye: 'closed', mouth: 'o' } }, 1) : breathe(P.umpire, t), 'umpire');
  drawStumps(ctx, STUMP_G);
  // pile of dead balls at Gary's feet
  for (let i = 0; i < Math.min(n, 31); i++) { const r = rng(i * 7 + 3); drawBall(ctx, 1450 + (r() - 0.5) * 90, GY - 4 - Math.floor(i / 8) * 13 - r() * 4, 8, i); }
  let g = stanceIdle(t);
  if (t > s && t < e) { const u = ((t - s) / per) % 1; g = mix(P.stance, P.block, Math.sin(u * Math.PI)); g.face = { mouth: 'flat', brow: 0.8, look: 0.6 }; }
  let gx = GARY_X, gdir = -1;
  if (t > T.n1mark) {
    const k = prog(T.n1mark + 0.1, T.n1mark + 0.4, t);
    g = track(t, [[T.n1mark, P.stance], [T.n1mark + 0.25, P.block, 'out']]);
    if (t > T.n1mark + 0.5) {
      const rk = prog(T.n1mark + 0.5, T.n1mark + 1.4, t);
      gx = GARY_X - 180 * Ease.out(rk);
      g = rk < 1 ? withBat(cyclePose(180 * Ease.out(rk), { A: 36, lift: 30, lean: 16 }), 46) : breathe(mix(P.celebrate, { bat: { a: 176 }, grip: { x: 18, y: -350 } }, 1), t, 2);
      g.face = { mouth: 'grin', eye: 'happy', brow: -0.2 };
    }
  }
  drawPerson(ctx, gx, GY, gdir, g, 'gary');
  drawPerson(ctx, 1776, GY, -1, t > e ? mix(P.keeper, { head: 20, face: { eye: 'closed', mouth: 'o' } }, 1) : keeperIdle(t), 'maroonKeeper');
  if (t > e && t < T.n1mark) { ctx.font = font(400, 44, F_HAND); ctx.textAlign = 'center'; textOutlined(ctx, 'z z z', UMP_X + 40, GY - 420 - Math.sin(t * 3) * 8, '#2b4a8a', '#fff', 6); }
  if (t > s && t < e) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
  const runs = t > T.n1mark + 0.6 ? 1 : 0;
  scoreboard(ctx, t, T.n1gary + 0.2, 99, 1430, 150, 'GARY', [['BALLS', n], ['RUNS', runs, runs ? COL.yellow : COL.red]], { w: 440 });
  speech(ctx, t, T.n1mark + 1.0, 99, gx - 20, GY - 420, 'OFF THE MARK!', { dx: -40 });
  if (t > T.n1mark + 1.0) for (let i = 0; i < 30; i++) { const r = rng(i + 50); const d = t - T.n1mark - 1.0; const x = gx + (r() - 0.5) * 500, y = GY - 600 + d * 200 * (0.5 + r()) + Math.sin(d * 4 + i) * 10; ctx.fillStyle = ['#e2283c', '#f6c531', '#2f9e5b', '#3b6fc4'][i % 4]; ctx.fillRect(x, y, 10, 6); }
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', 'THE FASTEST HUNDRED', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.2 });
  const abP = breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, face: { mouth: 'smile', look: 0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 520, GY, 1, abP, 'abd');
  nameTag(ctx, t, T.outro + 0.2, 99, 540, GY - 560, 'AB');
  let g = breathe(mix(P.stand, { bat: { a: 6 }, grip: { x: 30, y: -146 }, face: { mouth: 'smile', look: 0.8 } }, 1), t, 1.5);
  if (t > T.yes) g = mix(g, { hF: { x: 50, y: -260 }, eF: 1, face: { mouth: 'grin', eye: 'happy' } }, Ease.back(prog(T.yes, T.yes + 0.3, t)));
  if (t > T.no + 0.6) g = mix(g, { head: 20, face: { mouth: 'frown', eye: 'half', brow: -1 } }, Ease.out(prog(T.no + 0.6, T.no + 1.0, t)));
  drawPerson(ctx, 1400, GY, -1, g, 'gary');
  speech(ctx, t, T.yes + 0.1, T.no + 0.6, 1380, GY - 400, 'YES!', { dx: -40 });
  scoreboard(ctx, t, T.no - 0.1, 99, 960, 160, 'GARY vs AB', [['SHOTS COPIED', '0 / 5', COL.red], ['RUNS', 1], ['TIMES FAILED', 5, COL.red]], { w: 560 });
  stamp(ctx, t, T.no + 0.7, 99, 960, 560, 'NO.');
  drawCounter(ctx, t, 1 - prog(T.no - 0.4, T.no, t));
}

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
