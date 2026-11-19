// Episode: Ben Stokes' greatest moments (as attempted by Gary).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const roar = t => breathe(mix(P.stand, { hip: { x: 0, y: -160 }, lean: -6, head: 10, hF: { x: 120, y: -230 }, hB: { x: -110, y: -232 }, eF: -1, eB: -1, bat: null, face: { mouth: 'open', eye: 'open', brow: 0.9, look: 0.4 } }, 1), t, 2);

// o: {bowl, after, bowlerLook, batter, batLook, batX, batDir, batY, keeper, keepLook, ball, stumps, stumpsB, cheer, ump, partner, partnerLook}
function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B, o.stumpsB || {});
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.partner) drawPerson(ctx, o.partner.x ?? 470, GY, o.partner.dir ?? 1, o.partner.pose, o.partner.look);
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'maroon');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  if (o.batter) drawPerson(ctx, o.batX ?? GARY_X, o.batY ?? GY, o.batDir ?? -1, o.batter, o.batLook, 1, { groundY: GY });
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), o.keepLook || 'maroonKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function bowledStumps(t, Tb) {
  return { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] };
}
const big = { hip: { x: -6, y: -148 }, lean: 8, head: -6, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 228 }, grip: { x: -16, y: -232 }, face: { mouth: 'flat', eye: 'open', brow: 0.8, look: 0.6 } };
const loft = { hip: { x: 8, y: -146 }, lean: 6, head: -6, fF: { x: 46, y: -8 }, fB: { x: -26, y: -8 }, bat: { a: 150 }, grip: { x: 30, y: -220 }, face: { mouth: 'flat', brow: 0.8, look: 0.6 } };
const loftFollow = { hip: { x: 8, y: -150 }, lean: -6, head: 6, fF: { x: 46, y: -8 }, fB: { x: -26, y: -16 }, bat: { a: 215 }, grip: { x: 0, y: -330 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', look: 0.6, lookY: -1 } };
function swing(t, Tc) { return t < Tc - 0.4 ? stanceIdle(t) : track(t, [[Tc - 0.4, P.stance], [Tc - 0.12, big, 'out'], [Tc, loft, 'in'], [Tc + 0.3, loftFollow, 'out']]); }

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('BEN STOKES', 8, 48);
  textOutlined(ctx, 'BEN STOKES', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.never, T.never + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'NEVER GIVES UP', 0, 24, COL.navy, '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  // batter, bowler, fielder tags pop above Stokes as they're named
  drawPerson(ctx, 1480, GY, -1, roar(t), 'stokesField');
  const roles = [[T.all, 'BATTER'], [T.all + 0.53, 'BOWLER'], [T.all + 1.07, 'FIELDER'], [T.all + 1.6, 'FINISHER']];
  roles.forEach(([t0, txt], i) => nameTag(ctx, t, t0, T.today, 1480 + (i % 2 ? 210 : -210), GY - 400 + Math.floor(i / 2) * 70, txt, i === 3 ? COL.red : COL.yellow, i === 3 ? '#fff' : COL.ink));
  if (t > T.today - 0.3) {
    const walkEnd = T.today + 1.4;
    const x = lerp(-120, 560, Ease.out(prog(T.today - 0.3, walkEnd, t)));
    let g = t < walkEnd ? withBat(cyclePose(x + 120, { A: 26, lift: 16, lean: 3, hipY: -158, arm: 14 }), 70) : breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 } }, 1), t, 1.5);
    if (t > T.deep) { const k2 = Math.sin(clamp(prog(T.deep, T.deep + 1.4, t)) * Math.PI); g = mix(g, { hip: { x: 0, y: -168 }, lean: -8, head: 10, face: { mouth: 'o', eye: 'closed', brow: 0.3 } }, k2); }
    else g.face = { mouth: 'smile', eye: 'open', brow: 0.2, look: 0.8 };
    drawPerson(ctx, x, GY, 1, g, 'gary');
  }
}

// =============== #5 THE BOUNCER ===============
const S5 = { Tr: T.n5s + 1.6 }; S5.Th = S5.Tr + 0.55; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 620);
const bouncer = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tr + 0.28, 1000, GY - 6], [S5.Th, 1530, GY - 300, 20], [S5.Th + 0.15, 1716, GY - 300, 4]]);
const duck = { hip: { x: -30, y: -130 }, lean: -26, head: 20, fF: { x: 26, y: -8 }, fB: { x: -40, y: -8 }, bat: { a: -40 }, grip: { x: -30, y: -150 }, face: { mouth: 'o', eye: 'wide', brow: -0.9, look: 0.4, lookY: -1 } };
function s5A(ctx, t) {
  const Th = S5.Th;
  const bat = t < Th - 0.25 ? stanceIdle(t) : track(t, [[Th - 0.25, P.stance], [Th - 0.05, duck, 'out']]);
  const kp = t < Th ? keeperIdle(t) : mix(P.keeper, { hip: { x: 0, y: -150 }, lean: 0, hF: { x: 40, y: -300 }, hB: { x: 30, y: -296 }, eF: 1, eB: 1, ball: t > Th + 0.15 ? 'F' : false, face: { mouth: 'o', eye: 'wide' } }, 1);
  scene(ctx, t, { bowl: S5.bowl, bowlerLook: 'stokesField', after: t2 => breathe(mix(P.stand, { lean: 10, hF: { x: 60, y: -150 }, face: { mouth: 'flat', brow: 1, look: 0.8 } }, 1), t2), batter: bat, batLook: 'maroonBat', keeper: kp, ball: bouncer, cheer: t > Th ? 0.6 : 0.1 });
  if (t > Th - 0.1 && t < Th + 1.6) label(ctx, t, Th - 0.1, Th + 1.6, 1500, GY - 400, 'WHOOSH!', COL.red, 54);
  nameTag(ctx, t, T.n5 + 0.3, T.n5gary + 0.2, Math.max(150, (t < S5.bowl.tStride + 0.95 ? bowlerAt(t, S5.bowl).x : 430)), GY - 420, 'BEN STOKES');
  hud(ctx, t, '#5', 'THE BOUNCER', T.n5);
}
const G5 = { Tr: T.n5bounce - 0.55 }; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 620);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [T.n5bounce, 640, GY - 6], [T.n5bounce + 0.75, 860, GY - 6, 90], [T.n5bounce + 1.15, 980, GY - 6, 36], [T.n5bounce + 1.5, 1040, GY - 6, 12], [T.n5bounce + 1.9, 1070, GY - 8, 2]], true);
function s5B(ctx, t) {
  const bat = t > T.n5bounce + 1.9 ? mix(P.stance, { face: { mouth: 'grin', eye: 'happy' } }, 1) : stanceIdle(t);
  scene(ctx, t, { bowl: G5.bowl, bowlerLook: 'garyField', after: t2 => breathe(mix(P.stand, { lean: 10, face: { mouth: 'o', eye: 'wide', brow: -0.6, look: 0.8, lookY: 0.6 } }, 1), t2), batter: bat, batLook: 'maroonBat', ball: g5Ball });
  const bounces = [T.n5bounce, T.n5bounce + 0.75, T.n5bounce + 1.15];
  bounces.forEach((bt, i) => { if (t > bt) label(ctx, t, bt, 999, [640, 860, 980][i], GY + 60, String(i + 1), COL.red, 46); });
  if (t > T.n5bounce + 1.9) label(ctx, t, T.n5bounce + 1.9, 999, 1070, GY - 80, 'STOPPED.', COL.ink, 40);
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE BOUNCER', T.n5);
}

// =============== #4 THE BIG SIX ===============
const S4 = { Tc: T.n4s + 0.35 }; S4.Tr = S4.Tc - 0.5; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 560);
const sixBall = pathOf([[S4.Tr, REL.x, REL.y], [S4.Tc - 0.15, 1320, GY - 6], [S4.Tc, 1480, GY - 100], [S4.Tc + 1.6, -150, 380, 520]]);
function s4A(ctx, t) {
  const Tc = S4.Tc;
  scene(ctx, t, { bowl: S4.bowl, batter: swing(t, Tc), batLook: 'stokes', ball: sixBall, cheer: t > Tc ? 1 : 0.2, ump: t > Tc + 1.6 ? () => P.umpireSix : null });
  impactBurst(ctx, t, Tc, 1480, GY - 100, 1);
  const s6 = popScale(t, 32.6, T.n4gary + 0.3, 0.45, 0.2);
  if (s6 > 0) { ctx.save(); ctx.translate(820, 380); ctx.scale(s6, s6); ctx.font = font(900, 240, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('6', 10, 12); textOutlined(ctx, '6', 0, 0, '#2fa35c', '#fff', 18); ctx.restore(); }
  nameTag(ctx, t, T.n4 + 0.3, T.n4gary + 0.2, GARY_X - 20, GY - 440, 'BEN STOKES');
  hud(ctx, t, '#4', 'THE BIG SIX', T.n4);
}
const G4 = { Tc: T.n4up - 0.1 }; G4.Tr = G4.Tc - 0.5; G4.Tb = 39.15; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 560);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tc - 0.15, 1320, GY - 6], [G4.Tc, 1480, GY - 100], [G4.Tc + 1.0, 1520, -60], [G4.Tb, STUMP_G, GY - 100], [G4.Tb + 0.6, 1780, GY - 8, 40]], true);
function s4B(ctx, t) {
  const Tc = G4.Tc;
  let g = swing(t, Tc);
  if (t > Tc + 0.5) g = mix(loftFollow, { head: 30, face: { mouth: 'o', eye: 'wide', look: 0, lookY: -1 } }, 1);
  if (t > G4.Tb) g = mix(loftFollow, { head: -10, face: { mouth: 'frown', eye: 'wide', brow: -0.9, look: -1, lookY: 0.4 } }, 1);
  scene(ctx, t, { bowl: G4.bowl, after: t2 => t2 > G4.Tb ? mix(P.celebrate, {}, 1) : breathe(mix(P.stand, { head: 20, face: { look: 0.6, lookY: -1 } }, 1), t2), batter: g, batLook: 'gary', ball: g4Ball, stumps: bowledStumps(t, G4.Tb), cheer: 0.2 });
  impactBurst(ctx, t, G4.Tb, STUMP_G, GY - 100, 1.2);
  if (t > T.n4up && t < 38.2) label(ctx, t, T.n4up, 38.2, 1700, 300, '↑ UP...', COL.red, 50);
  if (t > 38.13 && t < G4.Tb) label(ctx, t, 38.13, G4.Tb + 0.1, 1700, 300, '↓ DOWN...', COL.red, 50);
  bigWord(ctx, t, G4.Tb + 0.05, 999, 860, 380, 'BOWLED!?');
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE BIG SIX', T.n4);
}

// =============== #3 THE DEFLECTION ===============
const D3 = { run: 46.2, dive: 47.6, Tb: 49.15 };
function diver(t, look, faceHit) {
  // runs right toward the crease, dives with the bat stretched out
  const x0 = 1080, xd = 1360;
  if (t < D3.dive) { const x = lerp(x0, xd, prog(D3.run, D3.dive, t)); const p = withBat(cyclePose((x - x0) * 1.5, { A: 40, lift: 34, lean: 22 }), 60); p.face = { mouth: 'open', eye: 'wide', brow: -0.6, look: 0.8 }; return { x, y: GY, p }; }
  const k = Ease.out(prog(D3.dive, D3.dive + 0.5, t));
  const dive = { hip: { x: 0, y: -160 }, rot: 80, lean: 0, head: -40, fF: { x: -30, y: -10 }, fB: { x: -50, y: -30 }, bat: { a: 180 }, grip: { x: 10, y: -380 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'wide', brow: -0.6, look: 0.8 } };
  const p = mix(withBat(cyclePose(0, { A: 40, lean: 22 }), 60), dive, k);
  return { x: xd + 60 * k, y: GY + 120 * k, p };
}
const throwBall = pathOf([[D3.Tb - 1.1, -60, 260], [D3.Tb, 1546, GY - 30, 160], [D3.Tb + 1.4, 2060, GY - 10, 10]]);
function s3A(ctx, t) {
  let st = t < D3.run ? { x: 1080, y: GY, p: breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 }, face: { look: -0.8 } }, 1), t, 1.5) } : diver(t, 'stokes');
  if (t > 52.5) st = { x: 1440, y: GY, p: mix(P.stand, { hF: { x: 60, y: -330 }, hB: { x: 20, y: -326 }, eF: 1, eB: 1, bat: null, face: { mouth: 'o', eye: 'wide', brow: -0.6, look: 0.8 } }, 1) };
  scene(ctx, t, { batter: st.p, batX: st.x, batY: st.y, batDir: 1, batLook: 'stokes', ball: throwBall, cheer: t > D3.Tb ? 1 : 0.6, keepLook: 'maroonKeeper', keeper: t > D3.Tb ? mix(P.keeper, { head: 0, face: { mouth: 'o', eye: 'wide', look: -1 } }, 1) : keeperIdle(t) });
  impactBurst(ctx, t, D3.Tb, 1546, GY - 30, 0.9);
  if (t > D3.Tb + 0.2) label(ctx, t, D3.Tb + 0.2, 52.5, 1700, GY + 70, 'OFF THE BAT!', COL.red, 38);
  if (t > 51.2) bigWord(ctx, t, 51.2, 52.6, 1500, 380, 'BOUNDARY!', '#2f9e5b', 90);
  speech(ctx, t, 52.8, T.n3gary + 0.2, 1430, GY - 380, 'Sorry!', { dx: -30 });
  famousCard(ctx, t, T.n3s - 0.1, 47.3, "LORD'S, 2019", 'World Cup final · England vs New Zealand');
  nameTag(ctx, t, T.n3 + 0.3, T.n3s - 0.2, 1080, GY - 440, 'BEN STOKES');
  hud(ctx, t, '#3', 'THE DEFLECTION', T.n3);
}
const G3 = { run: T.n3gary + 0.4, dive: T.n3gary + 1.6, Th: 58.35 };
function s3B(ctx, t) {
  const d = { ...D3 }; D3.run = G3.run; D3.dive = G3.dive;
  let st = t < G3.run ? { x: 1080, y: GY, p: breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 }, face: { look: -0.8 } }, 1), t, 1.5) } : diver(t, 'gary');
  Object.assign(D3, d);
  const hp = personPoint(st.x, st.y, 1, 1, st.p, 'head');
  const fb = pathOf([[G3.Th - 1.1, -60, 260], [G3.Th, hp.x + 20, hp.y, 160], [G3.Th + 0.8, hp.x - 200, GY - 8, 160], [G3.Th + 1.4, hp.x - 280, GY - 8, 30]], true);
  if (t > G3.Th) st.p = mix(st.p, { face: { mouth: 'o', eye: 'closed', brow: -1 } }, 1);
  scene(ctx, t, { batter: st.p, batX: st.x, batY: st.y, batDir: 1, batLook: 'gary', ball: fb, cheer: 0.3 });
  impactBurst(ctx, t, G3.Th, hp.x + 20, hp.y, 1);
  dizzy(ctx, t, hp.x, hp.y - 40, clamp(prog(G3.Th + 0.3, G3.Th + 0.6, t)));
  bigWord(ctx, t, G3.Th, 999, hp.x - 100, hp.y - 160, 'BONK!', COL.yellow, 90, 6);
  if (t > T.n3none) label(ctx, t, T.n3none, 999, 960, 300, 'RUNS: 0', COL.red, 60);
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE DEFLECTION', T.n3);
}

// =============== #2 THE SUPER OVER ===============
function s2A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: t > 71.4 ? 1 : 0.5 });
  scoreboard(ctx, t, 65.9, 69.5, 640, 160, 'WORLD CUP FINAL 2019', [['STOKES', '84*', COL.yellow], ['ENGLAND', 241], ['NEW ZEALAND', 241]], { w: 600 });
  if (t > 68.4 && t < 69.6) stamp(ctx, t, 68.4, 69.6, 640, 330, 'TIED');
  scoreboard(ctx, t, 69.6, T.n2gary + 0.1, 640, 160, 'SUPER OVER', [['ENGLAND', 15], ['NEW ZEALAND', 15]], { w: 600 });
  if (t > 70.6 && t < 71.4) stamp(ctx, t, 70.6, 71.45, 640, 330, 'TIED AGAIN');
  if (t > 71.4) label(ctx, t, 71.4, T.n2gary + 0.2, 640, 470, 'ENGLAND WIN ON BOUNDARIES', COL.red, 46);
  drawPerson(ctx, 1450, GY, -1, t > 71.4 ? roar(t) : breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 }, face: { mouth: 'flat', brow: 0.6, look: 0.8 } }, 1), t, 1.5), 'stokes');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 1450, GY - 440, 'BEN STOKES');
  hud(ctx, t, '#2', 'THE SUPER OVER', T.n2);
}
function s2B(ctx, t) {
  const s = T.n2dots - 0.2, per = 0.28;
  const n = clamp(Math.floor((t - s) / per) + 1, 0, 6);
  fieldBase(ctx, t, 0.05);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  drawStumps(ctx, STUMP_G);
  let g = stanceIdle(t);
  if (t > s && t < s + 6 * per) { const u = ((t - s) / per) % 1; g = mix(P.stance, P.block, Math.sin(u * Math.PI)); }
  drawPerson(ctx, GARY_X, GY, -1, mix(g, { face: { mouth: 'flat', brow: 0.7, look: 0.6 } }, 1), 'gary');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'maroonKeeper');
  // over tracker
  ctx.save(); ctx.translate(960, 150);
  ctx.fillStyle = '#14223f'; rrect(ctx, -330, 0, 660, 150, 18); ctx.fill(); ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.stroke();
  ctx.font = font(900, 30, F_TITLE); ctx.fillStyle = COL.yellow; ctx.textAlign = 'center'; ctx.fillText("GARY'S SUPER OVER", 0, 42);
  for (let i = 0; i < 6; i++) { ctx.fillStyle = i < n ? '#fff' : 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(-250 + i * 100, 100, 28, 0, 7); ctx.fill(); if (i < n) { ctx.fillStyle = COL.ink; ctx.font = font(900, 34, F_TITLE); ctx.fillText('•', -250 + i * 100, 112); } }
  ctx.restore();
  // a sleepy scoreboard
  if (t > T.n2sleep) {
    const k = Ease.back(prog(T.n2sleep, T.n2sleep + 0.4, t));
    ctx.save(); ctx.translate(1480, 420); ctx.scale(k, k);
    ctx.fillStyle = '#1b2a4a'; rrect(ctx, -170, -90, 340, 180, 16); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 4; ctx.stroke();
    ctx.strokeStyle = '#ffd36b'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (const ex of [-60, 60]) { ctx.beginPath(); ctx.arc(ex, -10, 26, 0.2, Math.PI - 0.2); ctx.stroke(); }
    ctx.font = font(900, 40, F_TITLE); ctx.fillStyle = '#ffd36b'; ctx.textAlign = 'center'; ctx.fillText('0 / 0', 0, 60);
    ctx.font = font(400, 44, F_HAND); textOutlined(ctx, 'z z z', 150 + Math.sin(t * 3) * 6, -100, '#2b4a8a', '#fff', 6);
    ctx.restore();
  }
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE SUPER OVER', T.n2);
}

// =============== #1 HEADINGLEY ===============
function s1A(ctx, t) {
  const s = 90.3, e = 97.5, per = (e - s) / 10;
  const inM = t > s && t < e;
  const k = Ease.inOut(clamp(prog(s, e, t)));
  fieldBase(ctx, t, inM ? 1 : (t > e ? 1 : 0.5));
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  const leachIn = clamp(prog(88.8, 90.0, t));
  if (leachIn > 0) { const lx = lerp(-100, 470, Ease.out(leachIn)); const lp = leachIn < 1 ? withBat(cyclePose(lx + 100, { A: 26, lift: 16, lean: 4, hipY: -158, arm: 12 }), 10) : breathe(P.partner, t, 1.2); drawPerson(ctx, lx, GY, 1, lp, 'leach'); if (leachIn >= 1) nameTag(ctx, t, 90.0, e, lx, GY - 420, 'JACK LEACH', '#cfd6e4'); }
  drawStumps(ctx, STUMP_G);
  let b = stanceIdle(t);
  if (inM) {
    const u = ((t - s) / per) % 1, i = Math.floor((t - s) / per), t0 = s + i * per;
    b = track(u, [[0, P.stance], [0.3, big, 'out'], [0.45, loft, 'in'], [0.7, loftFollow, 'out'], [1, P.stance]]);
    const bp = pathOf([[t0 - per * 0.2, 300, GY - 300], [t0 + 0.45 * per, 1480, GY - 100, 40], [t0 + 1.3 * per, i % 2 ? -100 : 600, i % 2 ? 300 : -150, 300]]);
    drawBallPath(ctx, t, bp, { trail: 8 });
  } else if (t >= e) b = roar(t);
  drawPerson(ctx, GARY_X, GY, -1, b, 'stokes');
  drawPerson(ctx, 1776, GY, -1, t > e ? mix(P.keeper, { head: 20, face: { mouth: 'frown', eye: 'half' } }, 1) : keeperIdle(t), 'ausKeeper');
  if (inM) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
  scoreboard(ctx, t, 86.0, T.n1gary + 0.1, 1590, 150, 'ENGLAND NEED 359', [['STOKES', Math.round(61 + 74 * k) + (k >= 1 ? '*' : ''), COL.yellow], ['LEACH', t > 96 ? '1*' : '0*'], ['LAST WICKET', Math.round(76 * k)]], { w: 420, rh: 56 });
  if (t > e) bigWord(ctx, t, e, T.n1gary + 0.3, 760, 380, 'WON BY 1 WICKET!', COL.red, 90);
  famousCard(ctx, t, T.n1s - 0.1, 88.6, 'HEADINGLEY, 2019', 'the Ashes · England chase 359');
  nameTag(ctx, t, T.n1 + 0.3, T.n1s, GARY_X - 20, GY - 440, 'BEN STOKES');
  hud(ctx, t, '#1', 'HEADINGLEY', T.n1);
}
const G1 = { Tc: T.n1run - 0.3 }; G1.Tr = G1.Tc - 0.5; G1.bowl = mkBowler(G1.Tr - 0.3, 290, 560); G1.Tro = G1.Tc + 1.15;
const g1Ball = pathOf([[G1.Tr, REL.x, REL.y], [G1.Tc - 0.15, 1300, GY - 6], [G1.Tc, 1440, GY - 40], [G1.Tc + 0.6, 1100, GY - 8, 10], [G1.Tc + 0.75, 1090, GY - 30], [G1.Tro, STUMP_B + 6, GY - 70, 60]]);
function s1B(ctx, t) {
  const Tc = G1.Tc, Tro = G1.Tro;
  let g = t < Tc - 0.3 ? stanceIdle(t) : track(t, [[Tc - 0.3, P.stance], [Tc, P.block, 'out']]);
  if (t > Tc + 0.3) g = mix(P.block, { hF: { x: 80, y: -240 }, eF: 1, face: { mouth: 'open', eye: 'wide', brow: 0.4, look: 0.8 } }, 1);
  if (t > Tro + 0.3) g = breathe(mix(P.stand, { hF: { x: 20, y: -300 }, hB: { x: 10, y: -296 }, eF: 1, eB: 1, bat: null, head: 10, face: { mouth: 'frown', eye: 'closed', brow: -1 } }, 1), t, 1.5);
  // last man sets off, then gets sent back far too late
  const mx = t < Tc + 0.2 ? 470 : lerp(470, 780, Ease.out(prog(Tc + 0.2, Tc + 0.8, t))) - lerp(0, 230, Ease.in(prog(Tc + 0.8, Tro + 0.1, t)));
  let mp = breathe(P.partner, t, 1.2), mdir = 1;
  if (t > Tc + 0.2 && t < Tc + 0.8) { mp = withBat(cyclePose((mx - 470) * 1.5, { A: 36, lift: 30, lean: 16 }), 50); }
  else if (t >= Tc + 0.8 && t < Tro + 0.2) { mdir = -1; mp = withBat(cyclePose((780 - mx) * 1.5, { A: 36, lift: 30, lean: 18 }), 50); mp.face = { mouth: 'open', eye: 'wide', brow: -0.8 }; }
  else if (t >= Tro + 0.2) { mdir = -1; mp = mix(P.handsOnHead, {}, 1); }
  scene(ctx, t, { bowl: G1.bowl, after: t2 => t2 > Tro ? mix(P.celebrate, {}, 1) : breathe(P.stand, t2), batter: g, batLook: 'gary', ball: g1Ball, stumpsB: bowledStumps(t, Tro), partner: { x: mx, dir: mdir, pose: mp, look: 'garyMate' }, cheer: 0.2, ump: t > Tro + 0.4 ? () => P.umpireOut : null });
  impactBurst(ctx, t, Tro, STUMP_B, GY - 70, 1.2);
  speech(ctx, t, Tc + 0.15, Tc + 0.8, GARY_X - 20, GY - 330, 'YES!', { dx: -30 });
  speech(ctx, t, Tc + 0.8, Tro + 0.3, GARY_X - 20, GY - 330, 'NO! GO BACK!', { dx: -60 });
  bigWord(ctx, t, Tro + 0.1, 999, 860, 380, 'RUN OUT!');
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', 'HEADINGLEY', T.n1);
}

// =============== OUTRO ===============
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  drawPerson(ctx, 600, GY, 1, roar(t), 'stokesField');
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 470, 'NEVER GIVES UP');
  // Gary flat on his back beside a cone and a skipping rope
  const { pose, Y } = plank(26, { face: { mouth: 'smile', eye: 'closed', brow: -0.3 } });
  pose.hF = { x: 30, y: -300 }; pose.hB = { x: 24, y: -60 }; pose.head = 20;
  drawPerson(ctx, 1200, Y, 1, pose, 'garyField', 1, { groundY: GY });
  ctx.fillStyle = '#f08a3c'; ctx.beginPath(); ctx.moveTo(1500, GY + 10); ctx.lineTo(1524, GY - 50); ctx.lineTo(1548, GY + 10); ctx.fill();
  ctx.strokeStyle = '#e2283c'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(1560, GY); ctx.bezierCurveTo(1600, GY - 30, 1640, GY + 30, 1700, GY); ctx.stroke();
  if (t > T.gary2 + 0.3) nameTag(ctx, t, T.gary2 + 0.3, 999, 1260, GY - 240, 'GAVE UP AT THE WARM-UP', '#cfd6e4');
  if (t > T.gary2) { ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center'; for (let i = 0; i < 3; i++) { const ph = ((t - T.gary2) * 0.7 + i / 3) % 1; ctx.globalAlpha = 1 - ph; textOutlined(ctx, 'z', 1340 + ph * 80 + i * 10, GY - 120 - ph * 140, '#2b4a8a', '#fff', 6); } ctx.globalAlpha = 1; }
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [T.n5bounce + 1.9, G4.Tb, T.n3none, T.n2sleep, G1.Tro];
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
