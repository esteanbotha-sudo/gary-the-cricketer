// Episode: The Best Wickets in Cricket (as demonstrated by Gary)
'use strict';
const OUT_TIMES = [16.4, 36.08, 57.15, 72.45, 82.42];

// =============== TITLE (0 – 8.75) ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.15 });
  // flying bats across the sky
  const bats = [[0.1, 2.2, -150, 420, 2100, 120], [1.2, 3.4, 2100, 200, -200, 380], [4.6, 6.8, -150, 160, 2100, 300]];
  for (const [a, b, x0, y0, x1, y1] of bats) {
    const k = prog(a, b, t); if (k <= 0 || k >= 1) continue;
    const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 120;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 9);
    const s = skeleton(fullPose({ bat: { a: 0 }, grip: { x: 0, y: -60 } }));
    ctx.translate(0, 0); paintBat(ctx, s); ctx.restore();
  }
  // title
  const k = prog(0.15, 1.1, t);
  const sc = lerp(0.18, 1, Ease.back(k));
  const tx = lerp(330, 960, Ease.out3(k)), ty = lerp(90, 250, Ease.out3(k));
  ctx.save(); ctx.translate(tx, ty); ctx.scale(sc, sc);
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.font = font(900, 76, F_TITLE); textOutlined(ctx, 'THE BEST', 0, -88, COL.ink, '#fff', 12);
  ctx.font = font(900, 190, F_TITLE);
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('WICKETS', 8, 86);
  textOutlined(ctx, 'WICKETS', 0, 78, COL.red, '#fff', 18);
  ctx.font = font(900, 76, F_TITLE); textOutlined(ctx, 'IN CRICKET', 0, 160, COL.ink, '#fff', 12);
  ctx.restore();
  // subtitle written on
  const sk = prog(2.95, 3.8, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 54, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('as demonstrated by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 440, (tw + 20) * sk, 90); ctx.clip();
    textOutlined(ctx, 'as demonstrated by Gary', 960, 500, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  // Gary trudges in under a rain cloud
  if (t > 2.6) {
    const walkEnd = 7.7;
    const x = lerp(2080, 1340, Ease.out(prog(2.8, walkEnd, t)));
    const dist = 2080 - x;
    let pose;
    if (t < walkEnd - 0.1) {
      pose = cyclePose(dist * 1.0, { A: 26, lift: 14, lean: 8, hipY: -158, arm: 12, bob: 3 });
    } else {
      pose = breathe(mix(P.stand, { lean: 10, head: 14 }, 1), t, 2.5);
    }
    pose.head = 18; pose.lean = 9;
    pose.face = { mouth: 'frown', eye: 'half', brow: -1, look: 0.2, lookY: 1 };
    pose.bat = { a: -62 }; pose.grip = { x: pose.hB.x - 6, y: pose.hB.y + 2 };
    const sigh = t > walkEnd ? Math.sin(prog(walkEnd, walkEnd + 0.8, t) * Math.PI) * 6 : 0;
    pose.hip = { x: pose.hip.x, y: pose.hip.y + sigh };
    drawPerson(ctx, x, GY, -1, pose, 'gary');
    drawRainCloud(ctx, x + 6, GY - 470 + Math.sin(t * 3) * 6, t, clamp((t - 2.8) * 2));
  }
}

// =============== #5 THE PERFECT YORKER (8.75 – 27.25) ===============
const Y5 = { bowl: mkBowler(15.15, 290, 520), toes: 16.2, hit: 16.42 };
function yorkerBall(t) {
  const b = bowlerAt(Y5.bowl.tStride, Y5.bowl);
  const rel = { x: 359, y: GY - 372 }, tr = Y5.bowl.tStride + 0.3;
  if (t < tr) return null;
  if (t < Y5.toes) { const u = (t - tr) / (Y5.toes - tr); return { x: lerp(rel.x, 1530, u), y: lerp(rel.y, GY - 8, Math.pow(u, 1.35)) }; }
  if (t < Y5.hit) { const u = (t - Y5.toes) / (Y5.hit - Y5.toes); return { x: lerp(1530, 1652, u), y: GY - 8 - Math.sin(u * Math.PI) * 18 - u * 16 }; }
  const u = Ease.out(prog(Y5.hit, Y5.hit + 1.6, t));
  return { x: lerp(1652, 1830, u), y: GY - 24 + Math.min(16, (t - Y5.hit) * 80) - Math.abs(Math.sin(u * 7)) * 10 * (1 - u) };
}
function sYorker(ctx, t) {
  const t0 = 8.75;
  const cheer = clamp(1 - prog(16.6, 20, t)) * (t > 16.5 ? 1 : 0);
  const cam = track(t, [[15.55, { z: 1, x: 960, y: 540 }], [16.0, { z: 1.5, x: 1380, y: 640 }, 'inOut'], [17.35, { z: 1.5, x: 1420, y: 640 }], [18.0, { z: 1, x: 960, y: 540 }, 'inOut']]);
  const sh = shake(t, Y5.hit, 10);
  ctx.save(); camApply(ctx, { ...cam, ...sh });
  fieldBase(ctx, t, cheer);
  // umpire + bowler end
  drawStumps(ctx, STUMP_B);
  const ump = t > 17.6 && t < 20.6 ? track(t, [[17.6, P.umpire], [17.85, P.umpireOut, 'out'], [20.3, P.umpireOut], [20.6, P.umpire]]) : breathe(P.umpire, t);
  drawPerson(ctx, UMP_X, GY, 1, ump, 'umpire');
  // bowler
  let bx, bpose;
  if (t < 13.6) { bx = -300; }
  else if (t < Y5.bowl.tStride + 0.95) { const b = bowlerAt(t, Y5.bowl); bx = b.x; bpose = b.pose; }
  else {
    const tc = t - (Y5.bowl.tStride + 0.95);
    const endX = 360 + 70;
    bx = endX + Math.min(tc, 0.8) * 40;
    const jump = t > 17.0 && t < 19.5 ? Math.abs(Math.sin((t - 17) * 7)) * 22 * (1 - prog(18.6, 19.5, t)) : 0;
    bpose = track(t, [[16.1, bowlerAt(Y5.bowl.tStride + 0.95, Y5.bowl).pose], [16.6, P.stand], [17.0, P.celebrate, 'back']]);
    if (t > 17) bpose = breathe(bpose, t, 2);
    bpose = mix(bpose, {}, 1); bpose.hip = { x: bpose.hip.x, y: bpose.hip.y - jump };
    bpose.fF = { x: bpose.fF.x, y: bpose.fF.y - jump }; bpose.fB = { x: bpose.fB.x, y: bpose.fB.y - jump };
  }
  if (bpose) drawPerson(ctx, bx, GY, 1, bpose, 'bowler');
  // Gary's stumps (middle one cartwheels)
  const mid = flyingPart(t, Y5.hit, { x: 150, y: -980 }, 820, 96);
  const st = {
    s: [{ r: t > Y5.hit ? -10 * Ease.out(prog(Y5.hit, Y5.hit + 0.2, t)) : 0 }, mid, { r: t > Y5.hit ? 14 * Ease.out(prog(Y5.hit, Y5.hit + 0.2, t)) : 0 }],
    b: [flyingPart(t, Y5.hit, { x: 260, y: -760 }, 1400, 30), flyingPart(t, Y5.hit, { x: 360, y: -900 }, -1100, -20)],
  };
  // Gary
  const taps = [10.3, 11.7, 13.1, 14.4];
  let g = P.stance;
  for (const tp of taps) { const k = Math.sin(prog(tp, tp + 0.5, t) * Math.PI); if (k > 0) g = mix(P.stance, { grip: { x: 12, y: -150 }, bat: { a: -22 } }, k); }
  g = track(t, [[15.2, g], [15.55, P.backlift, 'out'], [16.08, P.backlift], [16.6, P.downLate, 'in']]);
  if (t < 15.2) g = breathe(g, t, 1.2);
  if (t > 19.9) g = mix(g, { head: -2, face: { mouth: 'flat', eye: 'open', brow: -0.3, look: -1, lookY: 0.3 } }, Ease.out(prog(19.9, 20.3, t)));
  drawStumps(ctx, STUMP_G, st);
  drawPerson(ctx, GARY_X, GY, -1, g, 'gary');
  // toes glow + label
  glowRing(ctx, t, 15.95, 17.0, 1534, GY - 10, 60);
  label(ctx, t, 15.95, 17.6, 1540, GY + 74, 'RIGHT ON THE TOES', COL.ink, 30);
  drawBallPath(ctx, t, yorkerBall, { trail: 10 });
  impactBurst(ctx, t, Y5.hit, 1660, GY - 40, 1.2);
  speech(ctx, t, 17.6, 27.25, bx + 30, GY - 400, 'YESSS!', { dx: 40 });
  speech(ctx, t, 20.0, 27.25, GARY_X - 30, GY - 330, '...did it go?', { dx: -40, size: 36 });
  ctx.restore();
  // slow-mo treatment
  const sm = clamp(prog(15.6, 15.9, t)) * (1 - prog(17.5, 18.0, t));
  if (sm > 0) { vignette(ctx, 0.45 * sm); ctx.fillStyle = `rgba(40,60,110,${0.08 * sm})`; ctx.fillRect(0, 0, W, H); }
  pill(ctx, t, 15.7, 21.5, 960, 150, '◉  SLOW-MO');
  hud(ctx, t, '#5', 'THE PERFECT YORKER', t0);
  famousCard(ctx, t, 23.8, 27.1, 'WAQAR YOUNIS', "Pakistan's master of the toe-crushing yorker");
}

// =============== #4 THE DIRECT HIT (27.25 – 47.0) ===============
const D4 = { bowl: mkBowler(29.62, 290, 520), arrive: 30.42, runL: 31.6, skid: 33.25, turn: 33.95, runR: 34.9, hit: 36.05, throw0: 35.0 };
function directGaryX(t) {
  if (t < D4.runL) return GARY_X;
  if (t < D4.skid) return GARY_X - (t - D4.runL) * 300;
  const xs = GARY_X - (D4.skid - D4.runL) * 300;
  if (t < D4.runR) return xs - 46 * Ease.out(prog(D4.skid, D4.skid + 0.45, t));
  const xr = xs - 46;
  if (t < D4.hit) return xr + (t - D4.runR) * 205;
  return xr + (D4.hit - D4.runR) * 205 + 20 * Ease.out(prog(D4.hit, D4.hit + 0.3, t));
}
function directBall(t) {
  const tr = D4.bowl.tStride + 0.3;
  if (t < tr) return null;
  const rel = { x: 359, y: GY - 372 };
  if (t < 30.2) { const u = (t - tr) / (30.2 - tr); return { x: lerp(rel.x, 1380, u), y: lerp(rel.y, GY - 6, Math.pow(u, 1.6)) }; }
  if (t < D4.arrive) { const u = (t - 30.2) / (D4.arrive - 30.2); return { x: lerp(1380, 1486, u), y: GY - 6 - Math.sin(u * Math.PI * 0.5) * 70 }; }
  if (t < D4.throw0 - 0.6) { const u = Ease.out(prog(D4.arrive, D4.arrive + 1.1, t)); return { x: lerp(1486, 1330, u), y: lerp(GY - 76, GY - 8, Math.min(1, u * 2)) }; }
  return null; // fielder picks it up off-screen; the throw is a new path
}
function throwBall(t) {
  if (t < D4.throw0 || t > D4.hit + 1.2) return null;
  if (t < D4.hit) { const u = (t - D4.throw0) / (D4.hit - D4.throw0); return { x: lerp(2060, 1666, u), y: lerp(240, GY - 80, u) - Math.sin(u * Math.PI) * 120 }; }
  const d = t - D4.hit; return { x: 1666 + d * 260, y: Math.min(GY - 8, GY - 80 - 300 * d + 900 * d * d) };
}
function sDirect(ctx, t) {
  const t0 = 27.25;
  const sh = shake(t, D4.hit, 16);
  ctx.save(); camApply(ctx, { z: 1, x: 960, y: 540, ...sh });
  fieldBase(ctx, t, t > D4.hit ? clamp(1 - prog(D4.hit + 1, D4.hit + 3.5, t)) : 0.1);
  drawStumps(ctx, STUMP_B);
  const ump = t > 37.0 && t < 40.2 ? track(t, [[37.0, P.umpire], [37.25, P.umpireOut, 'out'], [39.9, P.umpireOut], [40.2, P.umpire]]) : breathe(P.umpire, t);
  drawPerson(ctx, UMP_X, GY, 1, ump, 'umpire');
  // bowler: delivers, then stands watching mid-pitch
  let bx = -300, bp = null;
  if (t > 28.3 && t < D4.bowl.tStride + 0.95) { const b = bowlerAt(t, D4.bowl); bx = b.x; bp = b.pose; }
  else if (t >= D4.bowl.tStride + 0.95) { const wk = prog(30.6, 31.9, t); bx = 430 + 260 * Ease.inOut(wk); bp = breathe(mix(P.stand, { face: { mouth: t > D4.hit ? 'grin' : 'flat', eye: t > D4.hit ? 'happy' : 'open', look: 0.8 } }, 1), t); if (wk > 0 && wk < 1) { bp = cyclePose(bx - 430, { A: 24, lift: 14, lean: 4, hipY: -158, arm: 14 }); bp.face = { mouth: 'flat', look: 0.8 }; } if (t > D4.hit) bp = mix(bp, P.celebrate, Ease.back(prog(D4.hit + 0.2, D4.hit + 0.6, t)) * (1 - prog(39, 39.6, t))); }
  // partner (non-striker)
  const partnerX = 470;
  let pp = breathe(P.partner, t, 1.2, 1);
  if (t > D4.runL - 0.2) pp = mix(pp, P.partnerNo, Ease.back(prog(32.6, 32.9, t)));
  const ppHop = t > 32.6 && t < 34.5 ? Math.abs(Math.sin((t - 32.6) * 9)) * 8 : 0;
  pp = mix(pp, {}, 1); pp.hip = { x: pp.hip.x, y: pp.hip.y - ppHop };
  if (pp.bat === undefined || t > 32.6) { pp.bat = null; }
  drawPerson(ctx, partnerX, GY, 1, pp, 'partner');
  if (t > 32.6) { // partner's bat now lies in the other hand, leaning on the ground
    const s0 = skeleton(fullPose({ bat: { a: -25 }, grip: { x: 0, y: -122 } }));
    ctx.save(); ctx.translate(partnerX - 6, GY); paintBat(ctx, s0); ctx.restore();
  }
  if (bp) drawPerson(ctx, bx, GY, 1, bp, 'bowler');
  // Gary's stumps: exploded by the direct hit
  const st = {
    s: [flyingPart(t, D4.hit, { x: 160, y: -620 }, 420, 80), flyingPart(t, D4.hit, { x: 300, y: -860 }, -700, -95), flyingPart(t, D4.hit, { x: 420, y: -560 }, 900, 92)],
    b: [flyingPart(t, D4.hit, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, D4.hit, { x: 450, y: -900 }, -1300, -30)],
  };
  drawStumps(ctx, STUMP_G, st);
  // Gary
  const gx = directGaryX(t);
  let gdir = t < D4.turn ? -1 : 1;
  let g;
  if (t < 30.15) g = breathe(P.stance, t, 1.2);
  else if (t < D4.runL) g = track(t, [[30.15, P.stance], [30.4, P.block, 'out'], [31.1, P.block], [31.45, mix(P.stance, { face: { mouth: 'open', eye: 'wide', brow: 0.6 } }, 1)]]);
  else if (t < D4.skid) {
    g = withBat(cyclePose(gx === GARY_X ? 0 : GARY_X - gx, { A: 40, lift: 34, lean: 18 }), 46);
    g.face = { mouth: 'grin', eye: 'open', brow: 0.3, look: 0.8 };
    if (t > 33.0) g.face = { mouth: 'o', eye: 'wide', brow: -0.6, look: 0.8 };
  } else if (t < D4.runR) {
    const skidPose = { hip: { x: -16, y: -148 }, lean: -18, head: 10, fF: { x: 40, y: -8 }, fB: { x: -40, y: -8 }, bat: { a: 70 }, grip: { x: 20, y: -170 }, face: { mouth: 'open', eye: 'wide', brow: -0.8, look: 0.8 } };
    const scramble = { hip: { x: 6, y: -150 }, lean: 22, head: -8, fF: { x: 36, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 60 }, grip: { x: 20, y: -170 }, face: { mouth: 'open', eye: 'wide', brow: -0.9, look: 0.8 } };
    g = t < D4.turn ? skidPose : track(t, [[D4.turn, mix(skidPose, { lean: 0 }, 1)], [D4.turn + 0.3, scramble, 'out']]);
    if (t > D4.turn + 0.3) { const k = Math.sin((t - D4.turn) * 22); g = mix(scramble, { fF: { x: 36, y: -8 - Math.max(0, k) * 22 }, fB: { x: -30, y: -8 - Math.max(0, -k) * 22 } }, 1); }
  } else if (t < D4.hit - 0.2) {
    g = withBat(cyclePose((t - D4.runR) * 205 * 1.6, { A: 34, lift: 30, lean: 24, hipY: -148 }), 60);
    g.face = { mouth: 'open', eye: 'wide', brow: -0.8, look: 0.8 };
  } else {
    const stretch = { hip: { x: 6, y: -124 }, lean: 44, head: -30, fF: { x: 70, y: -8 }, fB: { x: -66, y: -18 }, bat: { a: 72 }, grip: { x: 70, y: -118 }, face: { mouth: 'open', eye: 'wide', brow: -1, look: 0.8 }, toeB: 20 };
    const slump = { hip: { x: 0, y: -160 }, lean: 10, head: 24, fF: { x: 20, y: -8 }, fB: { x: -16, y: -8 }, bat: { a: 16 }, grip: { x: 30, y: -142 }, face: { mouth: 'frown', eye: 'half', brow: -1, look: 0.2, lookY: 1 } };
    g = track(t, [[D4.hit - 0.2, withBat(cyclePose(0, { A: 34, lean: 24, hipY: -148 }), 60)], [D4.hit, stretch, 'out'], [38.4, stretch], [39.0, slump]]);
    if (t > 39) g = breathe(g, t, 2);
  }
  drawPerson(ctx, gx, GY, gdir, g, 'gary');
  if (t > D4.skid && t < D4.skid + 0.8) dust(ctx, t, D4.skid, gx, GY, 8, 70);
  dust(ctx, t, D4.hit - 0.05, gx + 70, GY, 8, 60);
  // ball(s)
  drawBallPath(ctx, t, directBall, { trail: 6 });
  drawBallPath(ctx, t, throwBall, { trail: 12, dt: 0.015 });
  impactBurst(ctx, t, D4.hit, 1664, GY - 70, 1.5);
  // bubbles + labels
  speech(ctx, t, 31.4, 33.1, gx - 20, GY - 330, 'YES! RUN!', { dx: -40 });
  speech(ctx, t, 32.6, 36.0, partnerX + 30, GY - 330, 'NO!!', { dx: 30 });
  const tipX = gx + 70 + Math.sin(72 * DEG) * (L.bat - 8);
  dimLine(ctx, t, 37.1, 46.9, tipX, CREASE_G, GY - 64, 'MILES SHORT');
  ctx.restore();
  bigWord(ctx, t, 36.1, 41.9, 700, 380, 'RUN OUT!');
  hud(ctx, t, '#4', 'THE DIRECT HIT', t0);
  famousCard(ctx, t, 42.0, 46.9, 'JONTY RHODES', 'runs out Inzamam-ul-Haq, 1992 World Cup');
}

// =============== #3 THE SCREAMER (47.0 – 55.0, then boundary 55.0 – 65.0) ===============
const S3 = { bowl: mkBowler(49.32, 290, 560), bounce: 49.98, hit: 50.16 };
function screamerBall(t) {
  const tr = S3.bowl.tStride + 0.3;
  if (t < tr) return null;
  const rel = { x: 359, y: GY - 372 };
  if (t < S3.bounce) { const u = (t - tr) / (S3.bounce - tr); return { x: lerp(rel.x, 1290, u), y: lerp(rel.y, GY - 6, Math.pow(u, 1.5)) }; }
  if (t < S3.hit) { const u = (t - S3.bounce) / (S3.hit - S3.bounce); return { x: lerp(1290, 1470, u), y: GY - 6 - u * 120 }; }
  const d = t - S3.hit; if (d > 1.2) return null;
  return { x: 1470 + 1100 * d, y: GY - 126 - 1500 * d + 500 * d * d };
}
function sScreamerA(ctx, t) {
  const t0 = 47.0;
  const cheer = t > S3.hit ? clamp(prog(S3.hit, S3.hit + 0.5, t)) : 0.1;
  ctx.save();
  fieldBase(ctx, t, cheer);
  drawStumps(ctx, STUMP_B);
  const ump = t > 51.5 ? track(t, [[51.5, P.umpire], [51.8, P.umpireSix, 'back'], [54.5, P.umpireSix]]) : breathe(P.umpire, t);
  drawPerson(ctx, UMP_X, GY, 1, ump, 'umpire');
  let bx = -300, bp = null;
  if (t > 47.9 && t < S3.bowl.tStride + 0.95) { const b = bowlerAt(t, S3.bowl); bx = b.x; bp = b.pose; }
  else if (t >= S3.bowl.tStride + 0.95) { bx = 430; bp = track(t, [[50.27, bowlerAt(S3.bowl.tStride + 0.95, S3.bowl).pose], [50.7, P.handsOnHead, 'back']]); bp = breathe(bp, t, 1.5); }
  if (bp) drawPerson(ctx, bx, GY, 1, bp, 'bowler');
  drawStumps(ctx, STUMP_G);
  const big = { hip: { x: -6, y: -148 }, lean: 8, head: -6, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 228 }, grip: { x: -16, y: -232 }, face: { mouth: 'flat', eye: 'open', brow: 0.8, look: 0.6 } };
  const impact = { hip: { x: 2, y: -146 }, lean: 6, head: -4, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 120 }, grip: { x: 26, y: -190 }, face: { mouth: 'grin', eye: 'open', brow: 0.6, look: 0.4 } };
  const follow = { hip: { x: -6, y: -152 }, lean: -10, head: 4, fF: { x: 34, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 200 }, grip: { x: -26, y: -300 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', brow: 0.2, look: -0.4, lookY: -1 } };
  const brag = { hip: { x: 0, y: -164 }, lean: -4, head: 8, fF: { x: 16, y: -8 }, fB: { x: -14, y: -8 }, bat: { a: 176 }, grip: { x: 18, y: -358 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'happy', brow: -0.2 } };
  let g = t < 49.55 ? breathe(P.stance, t, 1.2) : track(t, [[49.55, P.stance], [49.95, big, 'out'], [S3.hit, impact, 'in'], [50.45, follow, 'out'], [51.05, follow], [51.4, brag, 'back']]);
  if (t > 51.4) g = breathe(g, t, 2);
  drawPerson(ctx, GARY_X, GY, -1, g, 'gary');
  drawBallPath(ctx, t, screamerBall, { trail: 12 });
  impactBurst(ctx, t, S3.hit, 1470, GY - 126, 1.1);
  // giant six
  const s6 = popScale(t, 51.3, 55.2, 0.45, 0.2);
  if (s6 > 0) {
    ctx.save(); ctx.translate(1180, 360); ctx.scale(s6, s6); ctx.rotate(Math.sin(t * 3) * 0.04);
    ctx.font = font(900, 240, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('6', 10, 12);
    textOutlined(ctx, '6', 0, 0, '#2fa35c', '#fff', 18);
    for (let i = 0; i < 6; i++) { const a = t * 1.5 + i; starPath(ctx, Math.cos(a) * 150, Math.sin(a) * 110, 16, 7); ctx.fillStyle = COL.yellow; ctx.fill(); }
    ctx.restore();
  }
  speech(ctx, t, 51.45, 55.2, GARY_X - 20, GY - 420, 'SIX!! EASY!', { dx: -60 });
  ctx.restore();
  hud(ctx, t, '#3', 'THE SCREAMER', t0);
}

const S3B = { runEnd: 56.25, catchT: 56.85, land: 57.15 };
function fielderAt(t) {
  if (t < S3B.runEnd) {
    const x = lerp(-180, 870, (t - 55.0) / (S3B.runEnd - 55.0));
    const p = cyclePose(x + 180, { A: 48, lift: 46, lean: 20, hipY: -150, arm: 40 });
    p.face = { mouth: 'flat', eye: 'open', brow: 0.8, look: 0.5, lookY: -0.8 };
    return { x, y: GY, pose: p };
  }
  const fly = { hip: { x: 0, y: -160 }, rot: 74, lean: 0, head: -40, fF: { x: -30, y: -20 }, fB: { x: -60, y: -40 }, hF: { x: 8, y: -392 }, hB: { x: -40, y: -170 }, eF: 1, eB: -1, face: { mouth: 'open', eye: 'wide', brow: 0.6, look: 0.8, lookY: 0 } };
  if (t < S3B.land) {
    const u = (t - S3B.runEnd) / (S3B.land - S3B.runEnd);
    const x = lerp(870, 1460, u);
    const y = GY - Math.sin(u * Math.PI) * 170 + u * 126;
    const pose = mix(track(u, [[0, mix(fly, { rot: 30 }, 1)], [0.45, fly, 'out']]), {}, 1);
    if (t > S3B.catchT) pose.ball = 'F';
    return { x, y, pose };
  }
  const slide = Ease.out(prog(S3B.land, S3B.land + 0.45, t));
  const lie = { hip: { x: 0, y: -160 }, rot: 90, lean: 0, head: -50, fF: { x: -10, y: -10 }, fB: { x: -30, y: -30 }, hF: { x: 8, y: -392 }, hB: { x: -40, y: -170 }, eF: 1, eB: -1, ball: 'F', face: { mouth: 'grin', eye: 'happy', brow: -0.2 } };
  const lieUp = mix(lie, { hF: { x: -96, y: -244 }, head: -60 }, 1);
  const pose = track(t, [[S3B.land, fly], [S3B.land + 0.2, lie, 'out'], [57.9, lie], [58.3, lieUp, 'back']]);
  pose.ball = 'F';
  return { x: 1460 + slide * 80, y: GY + 126, pose };
}
function screamerBallB(t) {
  if (t < 55.3) return null;
  if (t < S3B.catchT) {
    const f = fielderAt(S3B.catchT); const c = personPoint(f.x, f.y, 1, 1, f.pose, 'hF');
    const u = (t - 55.3) / (S3B.catchT - 55.3);
    return { x: lerp(-60, c.x + 4, u), y: lerp(160, c.y - 8, u) - Math.sin(u * Math.PI) * 140 };
  }
  return null;
}
function sScreamerB(ctx, t) {
  const t0 = 47.0;
  const cheer = t > S3B.land ? 1 : 0.4;
  drawBackdrop(ctx, t, { cheer, boardScroll: 0 });
  // boundary rope receding into the distance
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(1730, H + 20); ctx.quadraticCurveTo(1790, GY + 40, 1840, 700); ctx.stroke();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 11;
  ctx.beginPath(); ctx.moveTo(1724, H + 20); ctx.quadraticCurveTo(1784, GY + 34, 1834, 700); ctx.stroke();
  ctx.fillStyle = '#1b2a4a'; rrect(ctx, 1690, GY - 220, 220, 60, 10); ctx.fill();
  ctx.font = font(900, 32, F_TITLE); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('BOUNDARY', 1800, GY - 179);
  ctx.strokeStyle = '#9aa6b2'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1700, GY - 160); ctx.lineTo(1700, GY - 20); ctx.moveTo(1900, GY - 160); ctx.lineTo(1900, GY - 20); ctx.stroke();
  const f = fielderAt(t);
  drawPerson(ctx, f.x, f.y, 1, f.pose, 'fielder', 1, { groundY: GY });
  if (t > S3B.land && t < S3B.land + 0.9) dust(ctx, t, S3B.land, f.x + 60, GY, 10, 100);
  drawBallPath(ctx, t, screamerBallB, { trail: 12, dt: 0.015 });
  if (t > S3B.catchT && t < S3B.catchT + 0.4) { const c = personPoint(f.x, f.y, 1, 1, f.pose, 'hF'); impactBurst(ctx, t, S3B.catchT, c.x, c.y, 0.8); }
  // ONE HAND! tag near the hand
  if (t > S3B.land + 0.1) { const c = personPoint(f.x, f.y, 1, 1, f.pose, 'hF'); pill(ctx, t, S3B.land + 0.15, 64.9, c.x + 10, c.y - 50, 'ONE HAND!', COL.yellow, COL.ink); }
  stamp(ctx, t, 57.75, 59.45, 960, 380, 'CAUGHT!');
  hud(ctx, t, '#3', 'THE SCREAMER', t0);
  famousCard(ctx, t, 59.55, 64.9, 'BEN STOKES', 'one-handed screamer, 2019 World Cup opener');
}

// =============== #2 THE LIGHTNING STUMPING (65.0 – 80.25) ===============
const S2 = { bowl: mkBowler(68.85, 290, 330), bounce: 70.0, gloves: 70.45, bails: 72.45, keeperX: 1776 };
function stumpGaryX(t) { return GARY_X - 250 * Ease.inOut(prog(68.3, 69.7, t)); }
function stumpBall(t) {
  const tr = S2.bowl.tStride + 0.3;
  if (t < tr) return null;
  const rel = { x: 359, y: GY - 372 };
  if (t < S2.bounce) { const u = (t - tr) / (S2.bounce - tr); return { x: lerp(rel.x, 1250, u), y: lerp(rel.y, GY - 6, u) - Math.sin(u * Math.PI) * 170 }; }
  if (t < S2.gloves) { const u = (t - S2.bounce) / (S2.gloves - S2.bounce); return { x: lerp(1250, 1716, u), y: GY - 6 - Math.sin(u * Math.PI * 0.6) * 150 }; }
  return null;
}
function sStump(ctx, t) {
  const t0 = 65.0;
  const sh = shake(t, S2.bails, 8);
  ctx.save(); camApply(ctx, { z: 1, x: 960, y: 540, ...sh });
  fieldBase(ctx, t, t > S2.bails ? clamp(1 - prog(74, 77, t)) : 0.1);
  drawStumps(ctx, STUMP_B);
  const ump = t > 73.4 && t < 76.4 ? track(t, [[73.4, P.umpire], [73.65, P.umpireOut, 'out'], [76.1, P.umpireOut], [76.4, P.umpire]]) : breathe(P.umpire, t);
  drawPerson(ctx, UMP_X, GY, 1, ump, 'umpire');
  let bx = -300, bp = null;
  if (t > 66.6 && t < S2.bowl.tStride + 0.95) { const b = bowlerAt(t, S2.bowl); bx = b.x; bp = b.pose; }
  else if (t >= S2.bowl.tStride + 0.95) { bx = 430; bp = breathe(mix(P.stand, { face: { mouth: t > S2.bails ? 'grin' : 'flat', look: 0.8 } }, 1), t); if (t > 72.6) bp = mix(bp, P.celebrate, Ease.back(prog(72.6, 73.0, t)) * (1 - prog(75.5, 76, t))); }
  if (bp) drawPerson(ctx, bx, GY, 1, bp, 'spinner');
  // stumps with bails whipped off
  const st = { b: [flyingPart(t, S2.bails, { x: 140, y: -760 }, 1200, 20), flyingPart(t, S2.bails, { x: 260, y: -620 }, -900, -15)] };
  // Gary dances down, swings, misses, and is stranded
  const gx = stumpGaryX(t);
  const swingBig = { hip: { x: 0, y: -146 }, lean: 10, head: -8, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 228 }, grip: { x: -16, y: -232 }, face: { mouth: 'grin', eye: 'open', brow: 0.8, look: 0.6 } };
  const missed = { hip: { x: 10, y: -150 }, lean: -6, head: 2, fF: { x: 46, y: -8 }, fB: { x: -24, y: -8 }, bat: { a: 196 }, grip: { x: -30, y: -296 }, eF: 1, eB: 1, face: { mouth: 'o', eye: 'wide', brow: -0.4, look: 0.8, lookY: -0.6 } };
  let g;
  if (t < 68.3) g = breathe(P.stance, t, 1.2);
  else if (t < 69.7) {
    const c = cyclePose((GARY_X - gx) * 1.2, { A: 30, lift: 22, lean: 10, hipY: -152, arm: 10 });
    g = mix(c, { bat: { a: 215 }, grip: { x: -8, y: -196 }, face: { mouth: 'grin', eye: 'open', brow: 0.5, look: 0.6 } }, 1);
    g.bat = { a: 215 }; g.grip = { x: -8, y: -196 };
  } else g = track(t, [[69.7, swingBig], [69.95, mix(swingBig, { bat: { a: 120 }, grip: { x: 26, y: -190 } }, 1), 'in'], [70.2, missed, 'out']]);
  if (t > 70.2) g = breathe(missed, t, 1.2);
  let gdir = -1;
  if (t > 74.0) { gdir = 1; g = mix(P.stand, { bat: { a: 20 }, grip: { x: 28, y: -146 }, head: 6, face: { mouth: 'frown', eye: 'wide', brow: -0.9, look: 0.8 } }, 1); g = breathe(g, t, 1.5); }
  else if (t > 73.7) { g = mix(missed, { face: { mouth: 'o', eye: 'wide', brow: -0.9, look: -1, lookY: 0.4 }, head: 10 }, 1); }
  // keeper
  const kHold = mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 }, face: { mouth: 'flat', look: 0.8, brow: 0.6 } }, 1);
  const kWhip = mix(P.keeper, { hip: { x: 30, y: -108 }, lean: 52, head: -40, fF: { x: 50, y: -8 }, hF: { x: 108, y: -124 }, hB: { x: 100, y: -118 }, face: { mouth: 'open', eye: 'wide', brow: 0.9, look: 0.8 } }, 1);
  const kAppeal = { hip: { x: 10, y: -150 }, lean: -8, head: 10, fF: { x: 30, y: -8 }, fB: { x: -18, y: -8 }, hF: { x: 30, y: -380 }, hB: { x: 0, y: -384 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', brow: 0.4 } };
  let kp = track(t, [[69.75, P.keeper], [70.3, kHold, 'out'], [71.9, kHold], [S2.bails, kWhip, 'in'], [72.8, kWhip], [73.15, kAppeal, 'back']]);
  if (t < 69.75 || t > 73.15) kp = breathe(kp, t, 1.4);
  if (t > S2.gloves && t < 76.5) kp = mix(kp, {}, 1), kp.ball = 'F';
  drawPerson(ctx, gx, GY, gdir, g, 'gary');
  drawStumps(ctx, STUMP_G, st);
  drawPerson(ctx, S2.keeperX, GY, -1, kp, 'keeper');
  drawBallPath(ctx, t, stumpBall, { trail: 10 });
  impactBurst(ctx, t, S2.bails, STUMP_G, GY - STUMP_H - 4, 1);
  speech(ctx, t, 73.0, 80.25, gx - (gdir < 0 ? 10 : -10), GY - 340, '...oh.', { dx: gdir < 0 ? -40 : 40 });
  const backFoot = personPoint(gx, GY, gdir, 1, g, gdir < 0 ? 'fB' : 'fF');
  dimLine(ctx, t, 73.25, 80.1, backFoot.x + 18, CREASE_G, GY + 52, 'OUT OF HIS CREASE');
  ctx.restore();
  bigWord(ctx, t, 72.85, 80.0, 720, 380, 'STUMPED!');
  hud(ctx, t, '#2', 'THE LIGHTNING STUMPING', t0);
  famousCard(ctx, t, 76.8, 80.15, 'MS DHONI', "India's lightning-fast wicketkeeper");
}

// =============== #1 THE JAFFA (80.25 – 83.5) ===============
const J1 = { bowl: mkBowler(81.35, 290, 380), bounce: 82.12, hit: 82.42 };
function jaffaBall(t) {
  const tr = J1.bowl.tStride + 0.3;
  if (t < tr) return null;
  const rel = { x: 359, y: GY - 372 };
  if (t < J1.bounce) { const u = (t - tr) / (J1.bounce - tr); return { x: lerp(rel.x, 1440, u), y: lerp(rel.y, GY - 6, u) - Math.sin(u * Math.PI) * 160 }; }
  if (t < J1.hit) { const u = (t - J1.bounce) / (J1.hit - J1.bounce); return { x: lerp(1440, 1668, u), y: lerp(GY - 6, GY - STUMP_H - 6, Ease.out(u)) }; }
  const d = t - J1.hit; if (d > 1) return null;
  return { x: 1668 + 300 * d, y: GY - STUMP_H - 6 - 200 * d + 900 * d * d };
}
function sJaffa(ctx, t) {
  const t0 = 80.25;
  ctx.save();
  fieldBase(ctx, t, t > J1.hit ? 0.8 : 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  let bx = -300, bp = null;
  if (t > 80.3 && t < J1.bowl.tStride + 0.95) { const b = bowlerAt(t, J1.bowl); bx = b.x; bp = b.pose; }
  else if (t >= J1.bowl.tStride + 0.95) { bx = 430; bp = mix(bowlerAt(J1.bowl.tStride + 0.95, J1.bowl).pose, P.celebrate, Ease.back(prog(82.5, 82.9, t))); }
  if (bp) drawPerson(ctx, bx, GY, 1, bp, 'spinner');
  let g = t < 81.9 ? breathe(P.stance, t, 1.2) : track(t, [[81.9, P.stance], [82.2, P.block, 'out']]);
  if (t > 82.55) g = mix(P.block, { head: -4, face: { mouth: 'o', eye: 'wide', brow: -0.8, look: -1, lookY: 0.5 } }, Ease.out(prog(82.55, 82.8, t)));
  const st = { b: [{}, flyingPart(t, J1.hit, { x: 260, y: -700 }, 1300, 25)] };
  drawStumps(ctx, STUMP_G, st);
  drawPerson(ctx, GARY_X, GY, -1, g, 'gary');
  drawBallPath(ctx, t, jaffaBall, { trail: 10 });
  glowRing(ctx, t, J1.hit, J1.hit + 1.0, STUMP_G + 5, GY - STUMP_H - 4, 50);
  impactBurst(ctx, t, J1.hit, STUMP_G + 5, GY - STUMP_H - 4, 0.9);
  ctx.restore();
  pill(ctx, t, 82.9, 83.6, 960, 150, '↺  REPLAY', COL.red, '#fff');
  hud(ctx, t, '#1', 'THE JAFFA', t0);
}

// =============== SPIN CAM (83.5 – 91.25) ===============
function sSpinCam(ctx, t) {
  ctx.fillStyle = '#13213f'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 2;
  for (let x = 0; x < W; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // scanning sweep
  ctx.fillStyle = 'rgba(120,170,255,0.05)'; ctx.fillRect(((t * 300) % (W + 300)) - 300, 0, 120, H);
  // header
  ctx.font = font(900, 50, F_TITLE); ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.fillText('SPIN CAM', 34, 80);
  ctx.fillStyle = COL.red; rrect(ctx, 270, 46, 130, 40, 20); ctx.fill();
  ctx.font = font(900, 24, F_TITLE); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('● REPLAY', 335, 74);
  drawCounter(ctx, t);
  // panels
  const enter = Ease.out3(prog(83.5, 84.0, t));
  const panel = (x, y, w, h, title) => {
    ctx.fillStyle = '#1d3260'; rrect(ctx, x, y, w, h, 20); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = font(900, 24, F_TITLE); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.textAlign = 'center'; ctx.fillText(title, x + w / 2, y + 36);
  };
  ctx.save(); ctx.globalAlpha = enter; ctx.translate(0, (1 - enter) * 60);
  panel(170, 150, 700, 720, 'FROM ABOVE');
  panel(930, 150, 820, 720, 'WICKET VIEW');
  // ---- top view ----
  const cx = 520, pitchW = 150, py0 = 210, py1 = 840;
  ctx.fillStyle = '#d9bf84'; ctx.fillRect(cx - pitchW / 2, py0, pitchW, py1 - py0);
  ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(cx - pitchW / 2, py0, 18, py1 - py0);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4;
  for (const yy of [290, 760]) { ctx.beginPath(); ctx.moveTo(cx - pitchW / 2 - 30, yy); ctx.lineTo(cx + pitchW / 2 + 30, yy); ctx.stroke(); }
  ctx.fillStyle = '#f6e7c4'; for (const dx of [-12, 0, 12]) { ctx.beginPath(); ctx.arc(cx + dx, 262, 5, 0, 7); ctx.fill(); }
  // Gary from above
  ctx.fillStyle = '#1b3160'; ctx.beginPath(); ctx.arc(cx - 30, 300, 22, 0, 7); ctx.fill();
  ctx.strokeStyle = '#c7ccd4'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx - 30, 300, 26, 0.3, 1.8); ctx.stroke();
  ctx.fillStyle = '#e3b46e'; ctx.fillRect(cx - 24, 318, 8, 40);
  ctx.font = font(900, 20, F_TITLE); ctx.fillStyle = '#fff'; ctx.fillText('GARY', cx - 30, 254);
  ctx.font = font(900, 28, F_TITLE); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText('LEG', 270, 700); ctx.fillText('OFF', 770, 700);
  const P0 = { x: cx + 6, y: 850 }, PP = { x: 372, y: 500 }, C1 = { x: 380, y: 330 }, PT = { x: cx + 13, y: 262 };
  const tPitch = 84.65, tTurn0 = 86.9, tHit = 89.55;
  const topBall = (tt) => {
    if (tt < 83.7) return null;
    if (tt < tPitch) { const u = Ease.inOut(prog(83.7, tPitch, tt)); return { x: lerp(P0.x, PP.x, u), y: lerp(P0.y, PP.y, u) }; }
    if (tt < tTurn0) return PP;
    const u = Ease.inOut(prog(tTurn0, tHit, tt));
    return { x: (1 - u) * (1 - u) * PP.x + 2 * u * (1 - u) * C1.x + u * u * PT.x, y: (1 - u) * (1 - u) * PP.y + 2 * u * (1 - u) * C1.y + u * u * PT.y };
  };
  // trail line
  ctx.strokeStyle = COL.red; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); let first = true;
  for (let tt = 83.7; tt <= Math.min(t, 91); tt += 0.02) { const q = topBall(tt); if (!q) continue; if (first) { ctx.moveTo(q.x, q.y); first = false; } else ctx.lineTo(q.x, q.y); }
  ctx.stroke();
  if (t > tPitch) {
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(PP.x, PP.y, 14 + Math.sin(t * 8) * 3, 0, 7); ctx.stroke();
    const a = clamp(prog(tPitch, tPitch + 0.3, t));
    ctx.globalAlpha = enter * a; ctx.font = font(400, 36, F_HAND); ctx.fillStyle = COL.yellow; ctx.textAlign = 'right'; ctx.fillText('pitched here!', PP.x - 24, PP.y + 46); ctx.globalAlpha = enter; ctx.textAlign = 'center';
  }
  const tb = topBall(t);
  if (tb) drawBall(ctx, tb.x, tb.y, 12, t * 12);
  if (t > 86.8) { const s = popScale(t, 86.8, 92, 0.3, 0.1); ctx.save(); ctx.translate(680, 390); ctx.scale(s, s); ctx.rotate(-0.1); ctx.font = font(900, 54, F_TITLE); textOutlined(ctx, 'TURN!', 0, 0, COL.yellow, '#13213f', 8); ctx.restore(); }
  if (t > tHit) { const k = prog(tHit, tHit + 0.5, t); ctx.strokeStyle = `rgba(246,197,49,${1 - k})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(PT.x, PT.y, 12 + 50 * k, 0, 7); ctx.stroke(); }
  // ---- wicket view ----
  const wx = 1340, gy2 = 790, sH = 380, sp = 64;
  ctx.fillStyle = '#c9ad72'; ctx.fillRect(960, gy2, 760, 50);
  ctx.fillStyle = '#b39a64'; ctx.fillRect(960, gy2, 760, 8);
  const offS = { x: wx + sp, top: gy2 - sH };
  for (const dx of [-sp, 0, sp]) {
    outlined(ctx, () => { rrect(ctx, wx + dx - 13, gy2 - sH, 26, sH + 6, 12); }, '#f3e2b8', OUT, 3);
    ctx.fillStyle = '#d6b47a'; ctx.fillRect(wx + dx - 13, gy2 - sH + 12, 7, sH - 14);
  }
  // bails
  const bailOff = t > tHit ? flyingPart(t, tHit, { x: 420, y: -900 }, 700, 120) : { dx: 0, dy: 0, r: 0 };
  outlined(ctx, () => { rrect(ctx, wx - sp - 4, gy2 - sH - 18, sp + 8, 16, 8); }, '#f3e2b8', OUT, 3);
  ctx.save(); ctx.translate(wx + sp / 2 + bailOff.dx, gy2 - sH - 10 + Math.min(bailOff.dy, 400)); ctx.rotate(bailOff.r * DEG);
  outlined(ctx, () => { rrect(ctx, -sp / 2 - 4, -8, sp + 8, 16, 8); }, '#f3e2b8', OUT, 3); ctx.restore();
  const wBall = (tt) => {
    if (tt < 83.7) return null;
    if (tt < tPitch) { const u = Ease.in(prog(83.7, tPitch, tt)); return { x: lerp(1180, 1080, u), y: lerp(420, gy2 - 30, u), r: lerp(8, 30, u) }; }
    if (tt < tTurn0) return { x: 1080, y: gy2 - 30, r: 30 };
    if (tt < tHit) { const u = Ease.inOut(prog(tTurn0, tHit, tt)); return { x: lerp(1080, offS.x + 18, u), y: lerp(gy2 - 30, offS.top - 16, Ease.out(u)) - Math.sin(u * Math.PI) * 60, r: lerp(30, 40, u) }; }
    const d = tt - tHit; return { x: offS.x + 18 + 500 * d, y: offS.top - 16 - 200 * d + 600 * d * d, r: 40 + d * 20 };
  };
  const wb = wBall(t);
  if (wb && wb.x < 1740) {
    for (let i = 6; i >= 1; i--) { const q = wBall(t - i * 0.03); if (!q) continue; ctx.fillStyle = `rgba(226,40,60,${0.25 * (1 - i / 7)})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * 0.9, 0, 7); ctx.fill(); }
    ctx.save(); ctx.beginPath(); ctx.rect(930, 150, 820, 720); ctx.clip();
    drawBall(ctx, wb.x, wb.y, wb.r, t * 14); ctx.restore();
  }
  impactBurst(ctx, t, tHit, offS.x, offS.top - 10, 1.2);
  if (t > tHit) label(ctx, t, tHit + 0.05, 92, 1340, 250, 'TOP OF OFF STUMP', COL.yellow, 44);
  ctx.restore();
}

// =============== OUTRO ===============
function outroGround(ctx, t) { drawBackdrop(ctx, t, { cheer: 0.05 }); }

function sShrug(ctx, t) {
  outroGround(ctx, t);
  const k = Ease.back(prog(91.6, 92.0, t)) * (1 - Ease.inOut(prog(94.9, 95.4, t)) * 0.5);
  const pose = {
    hL: { x: lerp(-36, -84, k), y: lerp(-150, -176, k) }, hR: { x: lerp(36, 84, k), y: lerp(-150, -176, k) },
    shrug: 8 * k, tilt: 6 * k, face: { mouth: k > 0.5 ? 'flat' : 'smile', brow: -0.6 * k },
    hipY: -162 + Math.sin(t * 2.4) * 1.5,
  };
  // bat leaning against his leg
  const s0 = skeleton(fullPose({ bat: { a: 12 }, grip: { x: 0, y: -132 } }));
  ctx.save(); ctx.translate(1010, GY); paintBat(ctx, s0); ctx.restore();
  drawPersonFront(ctx, 960, GY, pose, 'garyCap', 1.08);
  speech(ctx, t, 92.15, 95.45, 960, GY - 390, 'Fair enough, honestly.', { dx: 0, size: 40 });
  drawCounter(ctx, t, 1 - prog(95.0, 95.4, t));
}

function plaque(ctx, x, y, w, h, flip, t) {
  // flip: 0..1 (0 = side A, 1 = side B)
  const sy = Math.abs(Math.cos(flip * Math.PI));
  const sideB = flip > 0.5;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(1, Math.max(0.02, sy));
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; rrect(ctx, -w / 2 + 10, -h / 2 + 12, w, h, 16); ctx.fill();
  ctx.fillStyle = '#5a3a1a'; rrect(ctx, -w / 2, -h / 2, w, h, 16); ctx.fill();
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#f2cf6c'); g.addColorStop(1, '#d7a93d');
  ctx.fillStyle = g; rrect(ctx, -w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 10); ctx.fill();
  // shine sweep
  ctx.save(); rrect(ctx, -w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 10); ctx.clip();
  const sx = ((t * 0.5) % 1.6) * (w + 400) - w / 2 - 300;
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.moveTo(sx, -h / 2); ctx.lineTo(sx + 80, -h / 2); ctx.lineTo(sx - 40, h / 2); ctx.lineTo(sx - 120, h / 2); ctx.fill();
  ctx.restore();
  ctx.textAlign = 'center'; ctx.fillStyle = '#3b2a10';
  if (!sideB) {
    ctx.font = font(900, 130, F_TITLE); ctx.fillText('1993', 0, -10);
  } else {
    ctx.font = font(900, 62, F_TITLE); ctx.fillText('THE BALL OF', 0, -70);
    ctx.font = font(900, 86, F_TITLE); ctx.fillStyle = '#8a1424'; ctx.fillText('THE CENTURY', 0, 10);
  }
  ctx.strokeStyle = 'rgba(59,42,16,0.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w / 2 + 70, 40); ctx.lineTo(w / 2 - 70, 40); ctx.stroke();
  ctx.fillStyle = '#3b2a10'; ctx.font = font(400, 40, F_HAND);
  ctx.fillText('Shane Warne to Mike Gatting', 0, 92); ctx.font = font(400, 34, F_HAND); ctx.fillText('Old Trafford, 1993', 0, 136);
  ctx.restore();
}

function sPlaque(ctx, t) {
  outroGround(ctx, t);
  const drop = Ease.bounce(prog(95.55, 96.3, t));
  plaque(ctx, 280, lerp(-560, 150, drop), 820, 470, Ease.inOut(prog(99.45, 99.95, t)), t);
  const stand = { hip: { x: 0, y: -162 }, lean: 3, head: -2, fF: { x: 14, y: -8 }, fB: { x: -12, y: -8 }, bat: { a: 6 }, grip: { x: 30, y: -146 }, face: { mouth: 'smile', look: 0.8, lookY: -0.6 } };
  const salute = { hip: { x: 0, y: -164 }, lean: -2, head: 4, fF: { x: 14, y: -8 }, fB: { x: -12, y: -8 }, bat: { a: 172 }, grip: { x: 26, y: -350 }, eF: 1, eB: 1, face: { mouth: 'smile', eye: 'happy', brow: -0.3 } };
  let g = track(t, [[100.8, stand], [101.2, salute, 'back']]);
  g = breathe(g, t, 1.5);
  const walkIn = prog(95.5, 96.6, t);
  const gx = lerp(1700, 1300, Ease.out(walkIn));
  if (walkIn < 1 && walkIn > 0) { g = withBat(cyclePose((1700 - gx), { A: 26, lift: 14, lean: 5, hipY: -158, arm: 14 }), 6); g.face = stand.face; }
  drawPerson(ctx, gx, GY, -1, g, 'garyCap');
  speech(ctx, t, 101.05, 102.3, gx - 20, GY - 420, 'Respect.', { dx: -30 });
  if (t > 101.1) for (let i = 0; i < 8; i++) { const a = i * 0.785 + t; const r = 80 + 40 * Math.sin(t * 4 + i); starPath(ctx, gx - 30 + Math.cos(a) * r, GY - 520 + Math.sin(a) * r * 0.5, 10, 4); ctx.fillStyle = `rgba(246,197,49,${clamp(prog(101.1, 101.4, t)) * (1 - prog(101.9, 102.3, t))})`; ctx.fill(); }
}

function marker(ctx, text, x, y, k, size = 50, col = '#1f3a6e') {
  if (k <= 0) return;
  ctx.save(); ctx.font = font(400, size, F_HAND); ctx.textAlign = 'left';
  const tw = ctx.measureText(text).width;
  ctx.beginPath(); ctx.rect(x - 4, y - size, (tw + 8) * k, size * 1.5); ctx.clip();
  ctx.fillStyle = col; ctx.fillText(text, x, y);
  ctx.restore();
}

function sBoard(ctx, t) {
  outroGround(ctx, t);
  const bx = 250, by = 140, bw = 960, bh = 540;
  const rise = Ease.back(prog(102.3, 102.8, t));
  ctx.save(); ctx.translate(0, (1 - rise) * 700);
  // easel legs
  ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(bx + 90, by + bh - 20); ctx.lineTo(bx + 30, GY + 4); ctx.moveTo(bx + bw - 90, by + bh - 20); ctx.lineTo(bx + bw - 30, GY + 4); ctx.moveTo(bx + bw / 2, by + bh - 20); ctx.lineTo(bx + bw / 2, GY - 40); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; rrect(ctx, bx + 10, by + 14, bw, bh, 14); ctx.fill();
  ctx.fillStyle = '#8a6a48'; rrect(ctx, bx - 14, by - 14, bw + 28, bh + 28, 18); ctx.fill();
  ctx.fillStyle = '#fdfdfb'; rrect(ctx, bx, by, bw, bh, 10); ctx.fill();
  ctx.fillStyle = '#8a6a48'; rrect(ctx, bx + 80, by + bh + 8, bw - 160, 16, 8); ctx.fill();
  ctx.fillStyle = COL.red; rrect(ctx, bx + 140, by + bh + 2, 70, 12, 6); ctx.fill();
  ctx.fillStyle = '#2b4a8a'; rrect(ctx, bx + 230, by + bh + 2, 70, 12, 6); ctx.fill();
  ctx.font = font(400, 64, F_MARK); ctx.textAlign = 'center'; ctx.fillStyle = COL.ink; ctx.fillText('WHY WAS I OUT?', bx + bw / 2, by + 92);
  marker(ctx, 'A)  A bad shot', bx + 70, by + 210, prog(105.05, 105.8, t), 58);
  marker(ctx, 'B)  One of the best', bx + 70, by + 320, prog(107.4, 108.0, t), 58);
  marker(ctx, 'wickets in cricket', bx + 158, by + 392, prog(107.95, 108.5, t), 58);
  // strike out A
  const sa = prog(111.4, 111.7, t);
  if (sa > 0) { ctx.strokeStyle = COL.red; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx + 60, by + 192); ctx.lineTo(bx + 60 + 380 * sa, by + 186); ctx.stroke(); }
  // circle B
  const ck = prog(110.0, 110.6, t);
  if (ck > 0) {
    ctx.strokeStyle = COL.red; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 60 * ck; i++) { const a = -2.6 + (i / 60) * Math.PI * 2.15; const px = bx + 330 + Math.cos(a) * 320, py = by + 345 + Math.sin(a) * 92; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke();
  }
  const tk = prog(110.45, 110.75, t);
  if (tk > 0) { ctx.strokeStyle = COL.red; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(bx + 690, by + 300); const m = { x: bx + 720, y: by + 336 }; if (tk < 0.4) ctx.lineTo(lerp(bx + 690, m.x, tk / 0.4), lerp(by + 300, m.y, tk / 0.4)); else { ctx.lineTo(m.x, m.y); ctx.lineTo(lerp(m.x, bx + 800, (tk - 0.4) / 0.6), lerp(m.y, by + 250, (tk - 0.4) / 0.6)); } ctx.stroke(); }
  if (t > 110.8) { ctx.globalAlpha = clamp(prog(110.8, 111.0, t)); marker(ctx, '(definitely)', bx + 600, by + 470, 1, 40, COL.red); ctx.globalAlpha = 1; }
  ctx.restore();
  // Gary
  const stand = { hip: { x: 0, y: -162 }, lean: 3, head: -6, fF: { x: 14, y: -8 }, fB: { x: -12, y: -8 }, bat: { a: 6 }, grip: { x: 30, y: -146 }, face: { mouth: 'smile', look: 0.8, lookY: -0.5 } };
  const think = mix(stand, { head: 8, hF: { x: 30, y: -270 }, bat: { a: -8 }, grip: { x: 26, y: -150 }, face: { mouth: 'flat', look: 0.4, lookY: -1, brow: -0.4 } }, 1);
  const point = { hip: { x: 4, y: -160 }, lean: 6, head: -6, fF: { x: 22, y: -8 }, fB: { x: -14, y: -8 }, bat: { a: 114 }, grip: { x: 40, y: -262 }, eF: 1, eB: 1, face: { mouth: 'smirk', look: 0.8, lookY: -0.3, brow: 0.3 } };
  let g = track(t, [[104.8, stand], [105.2, think], [109.6, think], [110.0, point, 'back']]);
  g = breathe(g, t, 1.5);
  if (t > 111.0) g = mix(g, { face: { mouth: 'grin', eye: 'happy', brow: -0.2 }, head: -2 }, Ease.out(prog(111.0, 111.3, t)));
  const gx = lerp(1700, 1360, Ease.out(prog(102.3, 103.4, t)));
  if (t < 103.4 && t > 102.3) { g = withBat(cyclePose((1700 - gx), { A: 26, lift: 14, lean: 5, hipY: -158, arm: 14 }), 6); g.face = stand.face; }
  drawPerson(ctx, gx, GY, -1, g, 'garyCap');
  speech(ctx, t, 111.05, 115, gx - 20, GY - 410, 'Always B.', { dx: -10 });
}

// ---------- master timeline ----------
const SCENES = [
  { t0: 0, t1: 8.75, fn: sTitle },
  { t0: 8.75, t1: 27.25, fn: sYorker, wipe: '#5' },
  { t0: 27.25, t1: 47.0, fn: sDirect, wipe: '#4' },
  { t0: 47.0, t1: 55.0, fn: sScreamerA, wipe: '#3' },
  { t0: 55.0, t1: 65.0, fn: sScreamerB, fade: 0.3 },
  { t0: 65.0, t1: 80.25, fn: sStump, wipe: '#2' },
  { t0: 80.25, t1: 83.5, fn: sJaffa, wipe: '#1' },
  { t0: 83.5, t1: 91.25, fn: sSpinCam, fade: 0.35 },
  { t0: 91.25, t1: 95.5, fn: sShrug, fade: 0.35 },
  { t0: 95.5, t1: 102.25, fn: sPlaque, fade: 0.4 },
  { t0: 102.25, t1: 999, fn: sBoard, fade: 0.4 },
];
const DURATION = 114.25;
