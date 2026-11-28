// Episode: Rohit Sharma's greatest moments (as attempted by Gary).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);
const celebrate = t => breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'smile', eye: 'happy' } }, 1), t, 2);
const relaxed = t => breathe(mix(P.stance, { hip: { x: -4, y: -150 }, lean: 12, face: { mouth: 'smile', eye: 'half', brow: -0.1, look: 0.6 } }, 1), t, 1);
const pull = { hip: { x: -10, y: -150 }, lean: -6, head: 2, fF: { x: 30, y: -8 }, fB: { x: -36, y: -8 }, bat: { a: 260 }, grip: { x: -30, y: -250 }, eF: 1, eB: 1, face: { mouth: 'smile', eye: 'half', look: -0.6, lookY: -0.6 } };
const big = { hip: { x: -6, y: -148 }, lean: 8, head: -6, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 228 }, grip: { x: -16, y: -232 }, face: { mouth: 'flat', eye: 'half', brow: 0.4, look: 0.6 } };
const loft = { hip: { x: 8, y: -146 }, lean: 6, head: -6, fF: { x: 46, y: -8 }, fB: { x: -26, y: -8 }, bat: { a: 150 }, grip: { x: 30, y: -220 }, face: { mouth: 'flat', brow: 0.4, look: 0.6 } };
const loftFollow = { hip: { x: 8, y: -150 }, lean: -6, head: 6, fF: { x: 46, y: -8 }, fB: { x: -26, y: -16 }, bat: { a: 215 }, grip: { x: 0, y: -330 }, eF: 1, eB: 1, face: { mouth: 'smile', eye: 'half', look: 0.6, lookY: -1 } };
const glide = { hip: { x: 10, y: -142 }, lean: 18, head: -14, fF: { x: 50, y: -8 }, fB: { x: -28, y: -8 }, bat: { a: -20 }, grip: { x: 40, y: -150 }, face: { mouth: 'smile', eye: 'half', look: 0.6, lookY: 0.4 } };

function scene(ctx, t, o) {
  fieldBase(ctx, t, o.cheer ?? 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    let bx = -400, bp = null;
    if (t < o.bowl.tStride + 0.95) { const r = bowlerAt(t, o.bowl); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = o.after ? o.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, o.bowlerLook || 'slBowler');
  }
  drawStumps(ctx, STUMP_G, o.stumps || {});
  drawPerson(ctx, GARY_X, GY, -1, o.batter || relaxed(t), o.batLook || 'rohit');
  drawPerson(ctx, 1776, GY, -1, o.keeper || keeperIdle(t), o.keepLook || 'slKeeper');
  if (o.ball) drawBallPath(ctx, t, o.ball, { trail: 10 });
}
function six(ctx, t, t0, x, y) {
  const s = Ease.back(prog(t0, t0 + 0.4, t)); if (s <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.font = font(900, 220, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('6', 10, 12); textOutlined(ctx, '6', 0, 0, '#2fa35c', '#fff', 18); ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.4 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 210); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('ROHIT SHARMA', 8, 48);
  textOutlined(ctx, 'ROHIT SHARMA', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.hitman, T.hitman + 0.4, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, '🎯 THE HITMAN', 0, 24, '#1f6fd1', '#fff', 12); ctx.restore(); }
  ctx.restore();
  const sk = prog(T.today, T.today + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moments, as attempted by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 355, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moments, as attempted by Gary', 960, 405, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  drawPerson(ctx, 1480, GY, -1, relaxed(t), 'rohit');
  nameTag(ctx, t, T.title + 0.4, T.n5, 1680, GY - 330, 'ROHIT SHARMA');
  if (t > 3.6) label(ctx, t, 3.6, T.today, 1480, GY + 70, 'EASY... ALMOST LAZY', '#1f6fd1', 34);
  if (t > T.today - 0.3) {
    // Gary lies asleep on the outfield, then wakes up
    const awake = t > T.nap + 1.4;
    if (!awake) {
      const { pose, Y } = plank(26, { face: { mouth: 'smile', eye: 'closed', brow: -0.3 } });
      pose.hF = { x: 30, y: -300 }; pose.hB = { x: 24, y: -60 }; pose.head = 20;
      drawPerson(ctx, 420, Y, 1, pose, 'gary', 1, { groundY: GY });
      ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
      for (let i = 0; i < 3; i++) { const ph = (t * 0.7 + i / 3) % 1; ctx.globalAlpha = 1 - ph; textOutlined(ctx, 'z', 560 + ph * 80 + i * 10, GY - 120 - ph * 140, '#2b4a8a', '#fff', 6); }
      ctx.globalAlpha = 1;
    } else {
      const g = breathe(mix(P.stand, { bat: { a: 20 }, grip: { x: 30, y: -146 }, hB: { x: 40, y: -280 }, eB: 1, face: { mouth: 'open', eye: 'half', brow: -0.2, look: 0.8 } }, 1), t, 1.5);
      drawPerson(ctx, 560, GY, 1, g, 'gary');
    }
  }
}

// =============== #5 THE PULL SHOT ===============
const S5 = { Tc: 17.9 }; S5.Tr = S5.Tc - 0.5; S5.bowl = mkBowler(S5.Tr - 0.3, 290, 620);
const pBall = pathOf([[S5.Tr, REL.x, REL.y], [S5.Tr + 0.27, 1000, GY - 6], [S5.Tc, 1470, GY - 230, 10], [S5.Tc + 1.2, 2060, 160, 220]]);
function s5A(ctx, t) {
  const Tc = S5.Tc;
  const b = t < Tc - 0.25 ? relaxed(t) : track(t, [[Tc - 0.25, P.stance], [Tc - 0.05, mix(P.backlift, { lean: 0 }, 1), 'out'], [Tc + 0.2, pull, 'out']]);
  scene(ctx, t, { bowl: S5.bowl, batter: b, ball: pBall, cheer: t > Tc ? 1 : 0.2, ump: t > Tc + 1.3 ? () => P.umpireSix : null });
  impactBurst(ctx, t, Tc, 1470, GY - 230, 0.9);
  label(ctx, t, 16.48, Tc + 0.6, 1500, GY + 70, 'SWIVEL', COL.yellow, 38);
  six(ctx, t, 18.6, 820, 380);
  nameTag(ctx, t, T.n5 + 0.3, 16.4, GARY_X - 20, GY - 440, 'ROHIT SHARMA');
  hud(ctx, t, '#5', 'THE PULL SHOT', T.n5);
}
const G5 = { Tc: 21.6 }; G5.Tr = G5.Tc - 0.5; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 620);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tr + 0.27, 1000, GY - 6], [G5.Tc + 0.15, 1716, GY - 200, 10]]);
function s5B(ctx, t) {
  const Tc = G5.Tc;
  let b = t < Tc - 0.25 ? stanceIdle(t) : track(t, [[Tc - 0.25, P.stance], [Tc - 0.05, mix(P.backlift, { lean: 0 }, 1), 'out'], [Tc + 0.2, mix(pull, { face: { mouth: 'open', eye: 'closed', brow: -1 } }, 1), 'out']]);
  if (t > T.n5muscle) { const w = Math.sin(t * 16) * 4; b = mix(P.stand, { hip: { x: -10, y: -140 + Math.abs(w) }, lean: 24, head: 10, fF: { x: 40, y: -60 }, hF: { x: 40, y: -150 }, hB: { x: 20, y: -140 }, bat: null, face: { mouth: 'open', eye: 'closed', brow: -1 } }, 1); }
  scene(ctx, t, { bowl: G5.bowl, batter: b, batLook: 'gary', ball: g5Ball, keeper: t > Tc + 0.15 ? mix(P.keeper, { hip: { x: 0, y: -158 }, lean: -6, head: 22, hF: { x: 30, y: -300 }, hB: { x: 10, y: -296 }, eF: 1, eB: 1, ball: 'F', face: { mouth: 'grin', look: -0.6 } }, 1) : null });
  if (t > T.n5muscle) { label(ctx, t, T.n5muscle, 999, GARY_X - 30, GY - 400, 'OWW, MY BACK!', COL.red, 44); const s0 = skeleton(fullPose({ bat: { a: 0 }, grip: { x: 0, y: 0 } })); ctx.save(); ctx.translate(GARY_X - 80, GY - 10); ctx.rotate(-1.4); paintBat(ctx, s0); ctx.restore(); }
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE PULL SHOT', T.n5);
}

// =============== #4 ALL THE TIME IN THE WORLD ===============
const S4 = { Tc: 33.0 }; S4.Tr = 30.4; S4.bowl = mkBowler(S4.Tr - 0.3, 290, 560);
// the ball slows to a crawl (slow-mo) while Rohit waits, then he guides it past point
const tBall = t => { if (t < S4.Tr) return null; if (t < S4.Tc) { const u = Ease.out(clamp((t - S4.Tr) / (S4.Tc - S4.Tr))); return { x: lerp(REL.x, 1450, u), y: lerp(REL.y, GY - 6, Math.min(1, u * 1.2)) - Math.sin(u * Math.PI) * 30 }; } const d = t - S4.Tc; return d > 1.2 ? null : { x: 1450 - 1300 * d, y: GY - 6 }; };
function s4A(ctx, t) {
  const sm = clamp(prog(30.6, 31.0, t)) * (1 - prog(33.0, 33.3, t));
  const b = t < S4.Tc - 0.25 ? relaxed(t) : track(t, [[S4.Tc - 0.25, P.stance], [S4.Tc, glide, 'out']]);
  scene(ctx, t, { bowl: S4.bowl, batter: b, ball: tBall, cheer: t > S4.Tc ? 0.7 : 0.1, ump: t > S4.Tc + 1.0 ? P_UMP_FOUR : null });
  if (sm > 0) { vignette(ctx, 0.45 * sm); ctx.fillStyle = `rgba(40,60,110,${0.08 * sm})`; ctx.fillRect(0, 0, W, H); }
  pill(ctx, t, 30.6, 33.3, 960, 150, '◉  SLOW-MO');
  label(ctx, t, 31.39, 33.0, GARY_X - 20, GY - 420, 'waits...', '#1f6fd1', 40);
  label(ctx, t, 32.02, 33.0, GARY_X - 20, GY - 370, '...and waits', '#1f6fd1', 40);
  if (t > S4.Tc) label(ctx, t, S4.Tc, T.n4gary + 0.2, 900, 380, 'IN THE GAP. FOUR.', '#2f9e5b', 64);
  nameTag(ctx, t, T.n4 + 0.3, 30.2, GARY_X - 20, GY - 470, 'ROHIT SHARMA');
  hud(ctx, t, '#4', 'ALL THE TIME IN THE WORLD', T.n4);
}
const G4 = { Tr: 35.4 }; G4.Tk = G4.Tr + 0.6; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 560);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tr + 0.3, 1150, GY - 6], [G4.Tk, 1716, GY - 140, 10]]);
function s4B(ctx, t) {
  let b = mix(P.stance, { face: { mouth: 'smile', eye: 'half', look: 0.6 } }, 1);
  if (t > 38.6) b = track(t, [[38.6, P.stance], [38.85, glide, 'out']]);
  const kp = t > G4.Tk ? mix(P.keeper, { hip: { x: 2, y: -116 }, lean: 30, hF: { x: 62, y: -152 }, hB: { x: 54, y: -146 }, ball: 'F', face: { mouth: 'smirk', look: -0.8 } }, 1) : null;
  scene(ctx, t, { bowl: G4.bowl, batter: b, batLook: 'gary', ball: t < G4.Tk + 0.05 ? g4Ball : null, keeper: kp });
  if (t > G4.Tk) { label(ctx, t, G4.Tk, 999, 1776, GY - 300, 'ALREADY HERE', COL.red, 36); const w = Math.floor((t - G4.Tk) / 0.6) % 4; label(ctx, t, G4.Tk + 0.3, 38.6, GARY_X - 20, GY - 420, 'waits' + '.'.repeat(w), COL.ink, 40); }
  if (t > 38.85) bigWord(ctx, t, 38.85, 999, 860, 380, 'TOO LATE.', COL.red, 100);
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'ALL THE TIME IN THE WORLD', T.n4);
}

// =============== #3 THE SIXES ===============
function s3A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 1 });
  const per = 1.1, u = ((t - T.n3) / per) % 1;
  const b = track(u, [[0, P.stance], [0.35, big, 'out'], [0.5, loft, 'in'], [0.75, loftFollow, 'out'], [1, P.stance]]);
  drawPerson(ctx, 1450, GY, -1, b, 'rohit');
  for (let i = 0; i < 26; i++) { const r = rng(i + 9); const ph = ((t * (0.5 + r() * 0.4) + r()) % 1); drawBall(ctx, r() * 1100 + 100, -40 + ph * 760, 9, t * 10 + i); }
  const bars = [['ROHIT SHARMA', 1.0, '#1f6fd1'], ['CHRIS GAYLE', 0.99, '#7a1f2b']];
  const k = Ease.out3(prog(45.5, 47.4, t));
  if (t > 45.4) bars.forEach(([nm, v, c], i) => { const y = 380 + i * 110, w = 640 * v * (i === 0 ? k : Math.min(1, k * 1.05)); ctx.font = font(900, 34, F_TITLE); ctx.textAlign = 'left'; textOutlined(ctx, nm, 160, y - 12, COL.ink, '#fff', 8); ctx.fillStyle = c; rrect(ctx, 160, y, Math.max(10, w), 54, 10); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.stroke(); });
  if (t > 47.2) label(ctx, t, 47.2, T.n3gary + 0.2, 480, 640, 'MOST INTERNATIONAL SIXES', COL.red, 48);
  if (t > 43.6) famousCard(ctx, t, 43.6, 45.35, '2023', 'passes Chris Gayle for the most international sixes');
  nameTag(ctx, t, T.n3 + 0.3, T.n3gary + 0.2, 1450, GY - 470, 'ROHIT SHARMA');
  hud(ctx, t, '#3', 'THE SIXES', T.n3);
}
function kitBag(ctx, x, y, hit, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#1b2a4a'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 4;
  rrect(ctx, -110, -70, 220, 70, 20); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ff8a1f'; ctx.fillRect(-110, -44, 220, 10);
  ctx.strokeStyle = '#555'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -70, 30, Math.PI, 0); ctx.stroke();
  ctx.font = font(900, 22, F_TITLE); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('GARY', 0, -12);
  if (hit) { const k = prog(hit, hit + 0.6, t); for (let i = 0; i < 5; i++) { const a = -2.4 + i * 0.4; const d = 120 * Ease.out(k); ctx.save(); ctx.translate(Math.cos(a) * d, -70 + Math.sin(a) * d + 400 * k * k); ctx.rotate(k * 6 + i); ctx.fillStyle = ['#fff', '#e3b46e', '#f6c531', '#7cc4ff', '#e2283c'][i]; rrect(ctx, -14, -8, 28, 16, 4); ctx.fill(); ctx.restore(); } }
  ctx.restore();
}
function s3B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.2 });
  const Tc = 51.4, Th = 53.1;
  const b = t < Tc - 0.4 ? stanceIdle(t) : track(t, [[Tc - 0.4, P.stance], [Tc - 0.12, big, 'out'], [Tc, loft, 'in'], [Tc + 0.3, mix(loftFollow, { face: { mouth: 'grin', eye: 'open' } }, 1), 'out']]);
  drawPerson(ctx, 1450, GY, -1, t > Th + 0.3 ? mix(P.handsOnHead, {}, 1) : b, 'gary');
  kitBag(ctx, 420, GY + 10, t > Th ? Th : 0, t);
  const bp = pathOf([[Tc, 1380, GY - 110], [Th, 420, GY - 70, 420]])(t);
  if (bp) drawBall(ctx, bp.x, bp.y, 9, t * 20);
  impactBurst(ctx, t, Th, 420, GY - 70, 1);
  six(ctx, t, 51.9, 900, 380);
  if (t > Th) bigWord(ctx, t, Th, 999, 420, 560, 'MY KIT!', COL.red, 90);
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE SIXES', T.n3);
}

// =============== #2 THE DOUBLE HUNDREDS ===============
function s2A(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.8 });
  drawPerson(ctx, 1450, GY, -1, celebrate(t), 'rohit');
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 1450, GY - 520, 'ROHIT SHARMA');
  [0, 1, 2].forEach(i => {
    const s = Ease.back(prog(58.9 + i * 0.5, 59.3 + i * 0.5, t)); if (s <= 0) return;
    ctx.save(); ctx.translate(320 + i * 280, 450); ctx.scale(s, s);
    ctx.fillStyle = COL.yellow; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 6; ctx.stroke();
    ctx.font = font(900, 96, F_TITLE); ctx.textAlign = 'center'; ctx.fillStyle = COL.ink; ctx.fillText('200', 0, 34);
    ctx.restore();
  });
  if (t > 58.9) label(ctx, t, 58.9, T.n2gary + 0.2, 600, 290, 'THREE ODI DOUBLE HUNDREDS', COL.red, 54);
  if (t > 61.4) label(ctx, t, 61.4, T.n2gary + 0.2, 600, 650, 'NO ONE ELSE HAS THREE', '#1f6fd1', 48);
  hud(ctx, t, '#2', 'THE DOUBLE HUNDREDS', T.n2);
}
function cup(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#fff'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-40, -70); ctx.lineTo(40, -70); ctx.lineTo(32, 0); ctx.lineTo(-32, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(46, -40, 16, -1.4, 1.4); ctx.stroke();
  ctx.fillStyle = '#5a3a1a'; ctx.beginPath(); ctx.ellipse(0, -66, 36, 8, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(150,150,150,0.6)'; ctx.lineWidth = 3; for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(-10 + i * 20, -80); ctx.bezierCurveTo(-20 + i * 20 + Math.sin(t * 3) * 6, -110, i * 20, -130, -10 + i * 20, -150); ctx.stroke(); }
  ctx.restore();
}
function s2B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  [0, 1, 2].forEach(i => { const s = Ease.back(prog(64.8 + i * 0.4, 65.2 + i * 0.4, t)); if (s > 0) cup(ctx, 340 + i * 220, 520, s * 1.4, t); });
  if (t > T.n2coffee) label(ctx, t, T.n2coffee, 999, 560, 300, 'DOUBLE ESPRESSO x3', COL.ink, 50);
  if (t > T.n2before) label(ctx, t, T.n2before, 999, 560, 640, '(BEFORE BREAKFAST)', COL.red, 40);
  const g = breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1, face: { mouth: 'grin', eye: 'wide', brow: 0.4, look: -0.8 } }, 1), t, 1.5);
  const jitter = t > T.n2coffee ? Math.sin(t * 50) * 4 : 0;
  drawPerson(ctx, 1450 + jitter, GY, -1, g, 'garyField');
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'THE DOUBLE HUNDREDS', T.n2);
}

// =============== #1 TWO SIX FOUR ===============
function s1A(ctx, t) {
  const s = 77.6, e = 82.6;
  fieldBase(ctx, t, t > s ? 1 : 0.5);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire'); drawStumps(ctx, STUMP_G);
  const per = (e - s) / 16, inM = t > s && t < e;
  let b = relaxed(t);
  if (inM) { const u = ((t - s) / per) % 1, i = Math.floor((t - s) / per), t0 = s + i * per; b = i % 3 === 1 ? track(u, [[0, P.stance], [0.4, P.stance], [0.6, mix(P.backlift, { lean: 0 }, 1), 'out'], [0.8, pull, 'out'], [1, P.stance]]) : track(u, [[0, P.stance], [0.3, big, 'out'], [0.45, loft, 'in'], [0.7, loftFollow, 'out'], [1, P.stance]]); drawBallPath(ctx, t, pathOf([[t0 - per * 0.2, 300, GY - 300], [t0 + 0.5 * per, 1480, GY - 110, 40], [t0 + 1.3 * per, i % 2 ? -100 : 2100, i % 2 ? 300 : 200, 300]]), { trail: 8 }); }
  else if (t >= e) b = celebrate(t);
  drawPerson(ctx, GARY_X, GY, -1, b, 'rohit');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'slKeeper');
  if (inM) pill(ctx, t, s, e, 960, 150, '⏩  FAST FORWARD');
  const k = clamp(prog(s, e, t));
  scoreboard(ctx, t, T.n1 + 0.4, T.n1gary + 0.1, 1590, 150, 'ROHIT', [['RUNS', Math.round(264 * Ease.inOut(k)), k >= 1 ? COL.yellow : '#fff'], ['BALLS', Math.round(173 * k)]], { w: 380 });
  if (t > 82.8) label(ctx, t, 82.8, T.n1gary + 0.2, 760, 400, 'HIGHEST ODI SCORE EVER', COL.red, 60);
  famousCard(ctx, t, 74.1, 77.5, 'KOLKATA, 2014', '264 vs Sri Lanka · Eden Gardens');
  nameTag(ctx, t, T.n1 + 0.3, 77.5, GARY_X - 20, GY - 420, 'ROHIT SHARMA');
  hud(ctx, t, '#1', '264', T.n1);
}
function s1B(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.05 });
  const digits = [['2', 89.47], ['6', 90.65], ['4', 91.21]];
  digits.forEach(([d, t0], i) => { const s = Ease.back(prog(t0, t0 + 0.35, t)); if (s <= 0) return; ctx.save(); ctx.translate(360 + i * 220, 430); ctx.scale(s, s); ctx.fillStyle = '#14223f'; rrect(ctx, -90, -110, 180, 220, 18); ctx.fill(); ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.stroke(); ctx.font = font(900, 150, F_TITLE); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(d, 0, 54); ctx.restore(); });
  if (t > 87.3 && t < 89.4) scoreboard(ctx, t, 87.3, 89.45, 580, 200, "GARY'S HIGHEST SCORE", [['', '...', COL.yellow]], { w: 500, rh: 100 });
  if (t > T.n1extras) { label(ctx, t, T.n1extras, 999, 580, 640, 'ALL EXTRAS. 0 OFF THE BAT.', COL.red, 44); stamp(ctx, t, T.n1extras, 999, 1100, 250, 'EXTRAS'); }
  const g = breathe(mix(P.stand, { bat: { a: 16 }, grip: { x: 30, y: -142 }, head: t > T.n1extras ? 20 : 0, face: { mouth: t > T.n1extras ? 'frown' : 'grin', eye: t > T.n1extras ? 'half' : 'open', look: -0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1450, GY, -1, g, 'gary');
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', '264', T.n1);
}

// =============== OUTRO ===============
function target(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); [[60, '#e2283c'], [44, '#fff'], [28, '#e2283c'], [12, '#fff']].forEach(([r, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); }); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 60, 0, 7); ctx.stroke(); ctx.restore(); }
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  target(ctx, 380, GY - 300, 1);
  drawBall(ctx, 380, GY - 300, 10, 0);
  drawPerson(ctx, 600, GY, 1, celebrate(t), 'rohitCap');
  nameTag(ctx, t, T.outro + 0.2, 999, 600, GY - 520, 'THE HITMAN');
  target(ctx, 1640, GY - 300, 1);
  // Gary's balls scattered everywhere except the target
  if (t > T.gary2) for (let i = 0; i < 7; i++) { const r = rng(i + 31); drawBall(ctx, 1500 + (r() - 0.2) * 360, GY - 120 - r() * 380, 9, i); }
  const g = breathe(mix(P.stand, { hF: { x: 40, y: -250 }, eF: 1, face: { mouth: 'flat', eye: 'half', brow: -0.4, look: 0.8 } }, 1), t, 1.5);
  drawPerson(ctx, 1300, GY, -1, g, 'garyField');
  if (t > T.gary2 + 0.6) nameTag(ctx, t, T.gary2 + 0.6, 999, 1300, GY - 420, 'THE MISSMAN', '#cfd6e4');
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
}

const OUT_TIMES = [T.n5muscle, 38.85, 53.1, T.n2before, T.n1extras];
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
