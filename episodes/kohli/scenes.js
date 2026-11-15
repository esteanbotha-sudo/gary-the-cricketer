// Episode: Virat Kohli's greatest moves (as copied by Gary). Timing comes from T (captions.js).
'use strict';
const COUNTER_LABEL = 'TIMES GARY FAILED';
const OUT_TIMES = [T.n5fall + 0.5, T.n4panic + 1.35, T.n3fall + 0.25, T.n2rest + 0.3, T.n1career + 0.3];
const DURATION = NARRATION_END;
const REL = { x: 359, y: GY - 372 };

function pitch(ctx, t, o) {
  fieldBase(ctx, t, o.cheer || 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, o.ump ? o.ump(t) : breathe(P.umpire, t), 'umpire');
  if (o.bowl) {
    const b = o.bowl;
    let bx = -400, bp = null;
    if (t < b.cfg.tStride + 0.95) { const r = bowlerAt(t, b.cfg); bx = r.x; bp = r.pose; }
    else { bx = 430; bp = b.after ? b.after(t) : breathe(mix(P.stand, { face: { mouth: 'flat', look: 0.8 } }, 1), t); }
    if (bx > -200) drawPerson(ctx, bx, GY, 1, bp, b.look || 'bowler');
  }
  if (o.under) o.under();
  drawStumps(ctx, STUMP_G, o.stumps || {});
  if (o.batter) drawPerson(ctx, o.batter.x ?? GARY_X, o.batter.y ?? GY, o.batter.dir ?? -1, o.batter.pose, o.batter.look, 1, { groundY: GY });
  if (o.keeper) drawPerson(ctx, 1776, GY, -1, o.keeper, 'greenKeeper');
  if (o.ball) drawBallPath(ctx, o.ballT ?? t, o.ball, { trail: 10 });
}
const stanceIdle = t => breathe(P.stance, t, 1.2);
const keeperIdle = t => breathe(P.keeper, t, 1.2);

function crown(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-70, 40); ctx.lineTo(-80, -30); ctx.lineTo(-40, 5); ctx.lineTo(0, -50); ctx.lineTo(40, 5); ctx.lineTo(80, -30); ctx.lineTo(70, 40); ctx.closePath();
  ctx.fillStyle = '#f6c531'; ctx.fill(); ctx.strokeStyle = '#8a6a10'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.stroke();
  for (const [cx, cy, c] of [[-80, -34, '#e2283c'], [0, -54, '#3b6fc4'], [80, -34, '#2f9e5b']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx, cy, 10, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#fff3b0'; ctx.fillRect(-60, 18, 120, 8);
  ctx.restore();
}
function book(ctx, x, y, open = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.15);
  ctx.fillStyle = '#e2283c'; ctx.strokeStyle = COL.ink; ctx.lineWidth = 3;
  rrect(ctx, -46 * open, -30, 46 * open, 60, 4); ctx.fill(); ctx.stroke();
  rrect(ctx, 0, -30, 46, 60, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = font(900, 13, F_TITLE); ctx.textAlign = 'center'; ctx.fillText('KOHLI', 23, -6); ctx.fillText('101', 23, 10);
  ctx.restore();
}
function ecg(ctx, t, x, y, bpm, col, name, panic) {
  const w = 460, h = 170;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#0d1a10'; rrect(ctx, -w / 2, 0, w, h, 16); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.stroke();
  ctx.font = font(900, 26, F_TITLE); ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.fillText(name + '  ♥', -w / 2 + 20, 36);
  ctx.textAlign = 'right'; ctx.font = font(900, 44, F_TITLE); ctx.fillText(Math.round(bpm) + ' BPM', w / 2 - 20, 44);
  ctx.beginPath(); ctx.rect(-w / 2 + 10, 56, w - 20, h - 66); ctx.clip();
  ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath();
  const per = 60 / bpm;
  for (let i = 0; i <= 220; i++) {
    const px = -w / 2 + 10 + i * 2, tt = t - (220 - i) * 0.006;
    const u = (tt / per) % 1;
    let v = 0;
    if (u < 0.06) v = Math.sin(u / 0.06 * Math.PI) * 0.15;
    else if (u > 0.12 && u < 0.15) v = -0.25; else if (u >= 0.15 && u < 0.19) v = 1; else if (u >= 0.19 && u < 0.23) v = -0.45;
    else if (u > 0.4 && u < 0.55) v = Math.sin((u - 0.4) / 0.15 * Math.PI) * 0.25;
    if (panic) v += Math.sin(tt * 90) * 0.15;
    const py = 56 + (h - 66) / 2 - v * (h - 80) * 0.45;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

// =============== TITLE ===============
function sTitle(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.3 });
  const k = prog(0.2, 1.0, t);
  ctx.save(); ctx.translate(960, 230); ctx.scale(lerp(0.3, 1, Ease.back(k)), lerp(0.3, 1, Ease.back(k)));
  ctx.textAlign = 'center';
  ctx.font = font(900, 180, F_TITLE); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('VIRAT KOHLI', 8, 48);
  textOutlined(ctx, 'VIRAT KOHLI', 0, 40, COL.red, '#fff', 18);
  const kk = Ease.back(prog(T.king + 0.3, T.king + 0.8, t));
  if (kk > 0) { ctx.save(); ctx.translate(0, 112); ctx.scale(kk, kk); ctx.font = font(900, 70, F_TITLE); textOutlined(ctx, 'THE KING', 0, 24, COL.ink, '#fff', 12); ctx.restore(); }
  ctx.restore();
  const cd = Ease.bounce(prog(T.king, T.king + 0.7, t));
  if (t > T.king) crown(ctx, 960, lerp(-120, 70, cd), 0.9);
  const sk = prog(T.studied, T.studied + 0.9, t);
  if (sk > 0) {
    ctx.save(); ctx.font = font(400, 50, F_HAND); ctx.textAlign = 'center';
    const tw = ctx.measureText('greatest moves, as copied by Gary').width;
    ctx.beginPath(); ctx.rect(960 - tw / 2 - 10, 400, (tw + 20) * sk, 80); ctx.clip();
    textOutlined(ctx, 'greatest moves, as copied by Gary', 960, 452, '#2b4a8a', '#fff', 8);
    ctx.restore();
  }
  const kp = breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'grin', eye: 'open', look: 0.6 } }, 1), t, 2);
  drawPerson(ctx, 1500, GY, -1, kp, 'kohli');
  nameTag(ctx, t, T.title + 0.4, T.n5, 1690, GY - 330, 'VIRAT KOHLI');
  if (t > T.studied - 0.4) {
    const walkEnd = T.studied + 1.4;
    const x = lerp(-120, 620, Ease.out(prog(T.studied - 0.4, walkEnd, t)));
    let g = t < walkEnd ? cyclePose(x + 120, { A: 24, lift: 14, lean: 2, hipY: -158, arm: 4 }) : breathe(P.stand, t, 1.5);
    g = mix(g, { hF: { x: 44, y: -236 }, hB: { x: 40, y: -232 }, eF: -1, eB: -1, head: 18, face: { mouth: 'flat', look: 0.6, lookY: 1, brow: 0.5 } }, 1);
    let opened = 1;
    if (t > T.see) {
      g = mix(g, { hF: { x: 30, y: -150 }, hB: { x: 60, y: -300 }, eB: 1, head: 0, face: { mouth: 'grin', eye: 'open', look: 0.8, lookY: 0 } }, Ease.back(prog(T.see, T.see + 0.3, t)));
      opened = 0;
    }
    drawPerson(ctx, x, GY, 1, g, 'garyCap');
    const hp = personPoint(x, GY, 1, 1, g, 'hF');
    book(ctx, hp.x + 10, hp.y - 20, opened);
    speech(ctx, t, T.see + 0.2, T.n5, x + 10, GY - 400, 'Easy!', { dx: 40 });
  }
}

// =============== #5 THE COVER DRIVE (with a freeze-frame) ===============
const K5 = { Tc: T.n5vk + 0.15, Tf: T.n5vk + 1.95 };
K5.Tr = K5.Tc - 0.55; K5.bowl = mkBowler(K5.Tr - 0.3, 290, 560);
const te5 = t => t < K5.Tc ? t : t < K5.Tf ? K5.Tc : t - (K5.Tf - K5.Tc);
const cdBall = pathOf([[K5.Tr, REL.x, REL.y], [K5.Tc - 0.15, 1300, GY - 6], [K5.Tc, 1440, GY - 40], [K5.Tc + 1.0, -120, GY - 4, 6]]);
const drive = { hip: { x: 18, y: -136 }, lean: 26, head: -24, fF: { x: 66, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 24 }, grip: { x: 54, y: -150 }, face: { mouth: 'flat', eye: 'open', brow: 0.7, look: 0.6, lookY: 0.6 } };
const driveFollow = { hip: { x: 18, y: -140 }, lean: 18, head: -14, fF: { x: 66, y: -8 }, fB: { x: -30, y: -20 }, bat: { a: 200 }, grip: { x: 6, y: -300 }, eF: 1, eB: 1, toeB: 30, face: { mouth: 'smile', eye: 'open', brow: 0.3, look: 0.8 } };
function s5A(ctx, t) {
  const e = te5(t), Tc = K5.Tc;
  let kp = e < Tc - 0.35 ? stanceIdle(t) : track(e, [[Tc - 0.35, P.stance], [Tc, drive, 'out'], [Tc + 0.35, driveFollow, 'out']]);
  pitch(ctx, t, { cheer: e > Tc + 0.3 ? 0.8 : 0.1, bowl: { cfg: K5.bowl }, batter: { pose: kp, look: 'kohli' }, keeper: keeperIdle(e), ball: cdBall, ballT: e, ump: e > Tc + 1.6 ? P_UMP_FOUR : null });
  const frozen = t > Tc && t < K5.Tf;
  if (frozen) {
    ctx.fillStyle = 'rgba(20,40,80,0.12)'; ctx.fillRect(0, 0, W, H);
    pill(ctx, t, Tc, K5.Tf, 960, 150, '❚❚  FREEZE FRAME', COL.navy, '#fff');
    const ff = personPoint(GARY_X, GY, -1, 1, drive, 'fF'), hd = personPoint(GARY_X, GY, -1, 1, drive, 'head');
    label(ctx, t, Tc + 0.05, K5.Tf, ff.x - 10, GY + 70, 'FRONT FOOT FORWARD', COL.yellow, 34);
    if (t > T.n5vk + 1.0) {
      ctx.strokeStyle = COL.yellow; ctx.lineWidth = 5; ctx.setLineDash([10, 8]);
      ctx.beginPath(); ctx.moveTo(hd.x, hd.y + 20); ctx.lineTo(1440, GY - 40); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, t, T.n5vk + 1.0, K5.Tf, hd.x - 150, hd.y - 50, 'HEAD OVER THE BALL', COL.yellow, 34);
    }
  }
  bigWord(ctx, t, K5.Tf + 1.4, T.n5gary + 0.3, 900, 380, 'FOUR!', '#2f9e5b');
  nameTag(ctx, t, T.n5 + 0.3, T.n5gary + 0.2, GARY_X - 20, GY - 420, 'VIRAT KOHLI');
  hud(ctx, t, '#5', 'THE COVER DRIVE', T.n5);
}
const G5 = { Tr: T.n5fall - 0.6 }; G5.Ts = T.n5fall + 0.5; G5.bowl = mkBowler(G5.Tr - 0.3, 290, 560);
const g5Ball = pathOf([[G5.Tr, REL.x, REL.y], [G5.Tr + 0.42, 1300, GY - 6], [G5.Ts, STUMP_G - 6, GY - 50], [G5.Ts + 0.8, 1880, GY - 8, 40]], true);
function s5B(ctx, t) {
  const lean = mix(drive, { lean: 40, head: -30, hip: { x: 30, y: -128 }, face: { mouth: 'flat', eye: 'wide', brow: -0.4, look: 0.6, lookY: 0.6 } }, 1);
  let g, gy = GY;
  if (t < T.n5gary + 0.8) g = stanceIdle(t);
  else if (t < T.n5fall) g = track(t, [[T.n5gary + 0.8, P.stance], [T.n5gary + 1.3, drive, 'out'], [T.n5fall, lean]]);
  else {
    const k = Ease.in(prog(T.n5fall, T.n5fall + 0.55, t));
    g = mix(lean, { rot: 84, lean: 0, head: -20, hip: { x: 0, y: -160 }, fF: { x: 30, y: -30 }, fB: { x: -10, y: -40 }, hF: { x: 40, y: -400 }, hB: { x: 10, y: -390 }, eF: 1, eB: 1, face: { mouth: 'o', eye: 'closed', brow: -0.8 } }, k);
    gy = GY + 126 * k;
  }
  const Ts = G5.Ts;
  const st = { s: [{}, flyingPart(t, Ts, { x: 300, y: -860 }, -700, -95), {}], b: [flyingPart(t, Ts, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Ts, { x: 450, y: -900 }, -1300, -30)] };
  pitch(ctx, t, { cheer: t > Ts ? 0.6 : 0.1, bowl: { cfg: G5.bowl, after: t2 => mix(P.celebrate, {}, Ease.back(prog(Ts, Ts + 0.4, t2))) }, batter: { pose: g, y: gy, look: 'gary' }, stumps: st, keeper: t > Ts ? mix(P.celebrate, {}, 1) : keeperIdle(t), ball: g5Ball });
  dust(ctx, t, T.n5fall + 0.5, GARY_X - 120, GY, 10, 120);
  impactBurst(ctx, t, Ts, STUMP_G, GY - 50, 1);
  bigWord(ctx, t, T.n5fall + 0.55, 99, 760, 380, 'FACEPLANT!');
  turnBanner(ctx, t, T.n5gary);
  hud(ctx, t, '#5', 'THE COVER DRIVE', T.n5);
}

// =============== #4 THE CHASE ===============
function s4A(ctx, t) {
  const s = T.n4vk - 0.4, per = 1.25;
  const i = Math.floor((t - s) / per), u = ((t - s) / per) % 1;
  let kp = stanceIdle(t);
  let ballFn = null;
  if (t > s && i < 5) {
    kp = track(u, [[0, P.stance], [0.45, P.stance], [0.6, drive, 'out'], [0.85, driveFollow, 'out'], [1, P.stance]]);
    const t0 = s + i * per;
    ballFn = pathOf([[t0, 300, GY - 300], [t0 + 0.4 * per, 1300, GY - 6, 40], [t0 + 0.6 * per, 1440, GY - 40], [t0 + 1.4 * per, -150, GY - 4, 10]]);
  }
  kp = mix(kp, { face: { mouth: 'smile', eye: 'closed', brow: -0.2 } }, 1);
  pitch(ctx, t, { cheer: 0.5, batter: { pose: kp, look: 'kohli' }, keeper: keeperIdle(t), ball: ballFn });
  const need = Math.max(0, 120 - Math.max(0, Math.floor((t - s) / per)) * 24 - (t > s ? Math.floor(u * 4) * 0 : 0));
  scoreboard(ctx, t, T.n4 + 0.4, T.n4gary + 0.1, 1440, 150, 'THE CHASE', [['NEED', need === 0 ? 'WON!' : need, need === 0 ? COL.yellow : '#fff'], ['BALLS LEFT', Math.max(6, 60 - Math.max(0, Math.floor((t - s) / per)) * 11)]], { w: 440 });
  ctx.save(); ctx.globalAlpha = clamp(prog(T.n4 + 0.6, T.n4 + 1.0, t)); ecg(ctx, t, 400, 160, 62, '#4ade80', 'KOHLI', false); ctx.restore();
  label(ctx, t, T.n4vk + 3.4, T.n4gary + 0.2, 400, 380, 'CALM', '#2f9e5b', 50);
  nameTag(ctx, t, T.n4 + 0.3, T.n4gary + 0.2, GARY_X - 20, GY - 420, 'VIRAT KOHLI');
  hud(ctx, t, '#4', 'THE CHASE', T.n4);
}
const G4 = { Tr: T.n4panic + 0.8 }; G4.Tb = G4.Tr + 0.55; G4.bowl = mkBowler(G4.Tr - 0.3, 290, 560);
const g4Ball = pathOf([[G4.Tr, REL.x, REL.y], [G4.Tb - 0.15, 1360, GY - 6], [G4.Tb, STUMP_G - 6, GY - 60], [G4.Tb + 0.8, 1880, GY - 8, 40]], true);
function s4B(ctx, t) {
  const Tb = G4.Tb;
  const shake = t > T.n4gary + 0.3 && t < Tb ? Math.sin(t * 60) * (t > T.n4panic ? 5 : 2.5) : 0;
  const wild = { hip: { x: 0, y: -146 }, lean: 0, head: 0, fF: { x: 40, y: -8 }, fB: { x: -30, y: -8 }, bat: { a: 120 }, grip: { x: 26, y: -200 }, face: { mouth: 'open', eye: 'closed', brow: -1 } };
  let g = t < Tb - 0.3 ? mix(P.stance, { face: { mouth: 'open', eye: 'wide', brow: -1, look: 0.6 } }, 1) : track(t, [[Tb - 0.3, mix(P.backlift, { face: { mouth: 'open', eye: 'closed', brow: -1 } }, 1)], [Tb - 0.1, wild, 'in'], [Tb + 0.4, mix(wild, { bat: { a: 200 }, grip: { x: -20, y: -300 }, eF: 1, eB: 1 }, 1), 'out']]);
  const st = { s: [flyingPart(t, Tb, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tb, { x: 300, y: -860 }, -700, -95), flyingPart(t, Tb, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tb, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tb, { x: 450, y: -900 }, -1300, -30)] };
  pitch(ctx, t, { cheer: 0.6, bowl: { cfg: G4.bowl, after: t2 => mix(P.celebrate, {}, Ease.back(prog(Tb, Tb + 0.4, t2))) }, batter: { x: GARY_X + shake, pose: g, look: 'gary' }, stumps: st, keeper: t > Tb ? P.celebrate : keeperIdle(t), ball: g4Ball });
  sweat(ctx, t, GARY_X - 30, GY - 340, clamp(prog(T.n4gary + 0.5, T.n4gary + 1, t)));
  scoreboard(ctx, t, T.n4gary + 0.2, 99, 1440, 150, 'LAST BALL', [['NEED', 6, COL.red], ['BALLS LEFT', 1, COL.red]], { w: 440 });
  const bpm = t < Tb ? lerp(110, 199, prog(T.n4gary, T.n4panic + 0.5, t)) : 0;
  if (t < Tb + 0.05) ecg(ctx, t, 400, 160, Math.max(60, bpm), '#ff4d4d', 'GARY', true);
  else { ctx.save(); ctx.translate(400, 160); ctx.fillStyle = '#1a0d0d'; rrect(ctx, -230, 0, 460, 170, 16); ctx.fill(); ctx.strokeStyle = '#ff4d4d'; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.moveTo(-220, 110); ctx.lineTo(220, 110); ctx.stroke(); ctx.font = font(900, 40, F_TITLE); ctx.fillStyle = '#ff4d4d'; ctx.textAlign = 'center'; ctx.fillText('beeeeeeep', 0, 60); ctx.restore(); }
  impactBurst(ctx, t, Tb, STUMP_G, GY - 60, 1.3);
  bigWord(ctx, t, Tb + 0.05, 99, 820, 400, 'BOWLED!');
  turnBanner(ctx, t, T.n4gary);
  hud(ctx, t, '#4', 'THE CHASE', T.n4);
}

// =============== #3 THE STRAIGHT SIX ===============
const K3 = { Tr: T.n3vk + 1.75 }; K3.Tc = K3.Tr + 0.45; K3.bowl = mkBowler(K3.Tr - 0.3, 290, 600);
const sixBall = pathOf([[K3.Tr, REL.x, REL.y], [K3.Tc - 0.12, 1340, GY - 6], [K3.Tc, 1470, GY - 140, 10], [K3.Tc + 1.1, 200, -120, 380]]);
const backFoot = { hip: { x: -16, y: -152 }, lean: 0, head: -6, fF: { x: 26, y: -8 }, fB: { x: -44, y: -8 }, bat: { a: 120 }, grip: { x: 30, y: -210 }, face: { mouth: 'flat', eye: 'open', brow: 0.8, look: 0.6 } };
const sixFollow = { hip: { x: -10, y: -156 }, lean: -6, head: 6, fF: { x: 26, y: -8 }, fB: { x: -44, y: -8 }, bat: { a: 176 }, grip: { x: 30, y: -320 }, eF: 1, eB: 1, face: { mouth: 'grin', eye: 'open', look: 0.8, lookY: -1 } };
function s3A(ctx, t) {
  const Tc = K3.Tc;
  const cam = track(t, [[Tc - 0.6, { z: 1, x: 960, y: 540 }], [Tc - 0.2, { z: 1.35, x: 1300, y: 640 }, 'inOut'], [Tc + 0.5, { z: 1.35, x: 1250, y: 620 }], [Tc + 1.0, { z: 1, x: 960, y: 540 }, 'inOut']]);
  let kp = t < Tc - 0.3 ? stanceIdle(t) : track(t, [[Tc - 0.3, P.stance], [Tc - 0.05, backFoot, 'out'], [Tc + 0.25, sixFollow, 'out']]);
  if (t > Tc + 1.2) kp = breathe(sixFollow, t, 1.5);
  ctx.save(); camApply(ctx, cam);
  pitch(ctx, t, {
    cheer: t > Tc ? 1 : 0.2, bowl: { cfg: K3.bowl, look: 'bowler', after: t2 => mix(bowlerAt(K3.bowl.tStride + 0.95, K3.bowl).pose, P.handsOnHead, Ease.back(prog(Tc + 0.6, Tc + 1.0, t2))) },
    batter: { pose: kp, look: 'kohli' }, keeper: keeperIdle(t), ball: sixBall, ump: t > Tc + 1.3 ? () => P.umpireSix : null,
  });
  impactBurst(ctx, t, Tc, 1470, GY - 140, 1);
  ctx.restore();
  famousCard(ctx, t, T.n3where - 0.1, T.n3vk + 1.2, 'MELBOURNE, 2022', 'T20 World Cup · India vs Pakistan');
  const s6 = popScale(t, Tc + 0.9, T.n3gary + 0.3, 0.45, 0.2);
  if (s6 > 0) { ctx.save(); ctx.translate(820, 380); ctx.scale(s6, s6); ctx.font = font(900, 240, F_TITLE); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillText('6', 10, 12); textOutlined(ctx, '6', 0, 0, '#2fa35c', '#fff', 18); ctx.restore(); }
  const bf = personPoint(GARY_X, GY, -1, 1, backFoot, 'fB');
  if (t > T.n3vk + 4.6) {
    label(ctx, t, T.n3vk + 4.6, T.n3gary + 0.2, bf.x + 40, GY + 80, 'OFF THE BACK FOOT', COL.yellow, 36);
    ctx.strokeStyle = COL.yellow; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(bf.x + 40, GY + 40); ctx.lineTo(bf.x + 6, GY + 6); ctx.stroke();
  }
  nameTag(ctx, t, T.n3 + 0.3, T.n3gary + 0.2, GARY_X - 20, GY - 420, 'VIRAT KOHLI');
  hud(ctx, t, '#3', 'THE STRAIGHT SIX', T.n3);
}
function s3B(ctx, t) {
  const Tf = T.n3fall + 0.25;
  const back = mix(backFoot, { fB: { x: -60, y: -8 }, hip: { x: -26, y: -150 } }, 1);
  const wobble = { hip: { x: -40, y: -158 }, lean: -14, head: 10, fF: { x: 10, y: -30 }, fB: { x: -66, y: -8 }, bat: null, hF: { x: 80 + Math.sin(t * 16) * 30, y: -280 }, hB: { x: -70, y: -300 + Math.cos(t * 16) * 30 }, eF: 1, eB: 1, face: { mouth: 'open', eye: 'wide', brow: -1, look: 0.4 } };
  let g, gy = GY;
  if (t < T.n3gary + 0.5) g = stanceIdle(t);
  else if (t < T.n3gary + 1.2) g = track(t, [[T.n3gary + 0.5, P.stance], [T.n3gary + 1.2, back, 'out']]);
  else if (t < T.n3fall) g = mix(back, wobble, Ease.out(prog(T.n3gary + 1.5, T.n3gary + 2.0, t)));
  else {
    const k = Ease.in(prog(T.n3fall, Tf + 0.1, t));
    g = mix(wobble, { rot: -86, lean: 0, head: 20, hip: { x: -30, y: -160 }, fF: { x: 30, y: -60 }, fB: { x: 0, y: -50 }, hF: { x: 60, y: -360 }, hB: { x: -10, y: -360 }, face: { mouth: 'o', eye: 'closed', brow: -0.8 } }, k);
    gy = GY + 120 * k;
  }
  const st = { s: [flyingPart(t, Tf, { x: 160, y: -620 }, 420, 80), flyingPart(t, Tf, { x: 300, y: -760 }, -700, -95), flyingPart(t, Tf, { x: 420, y: -560 }, 900, 92)], b: [flyingPart(t, Tf, { x: 200, y: -1000 }, 1500, 20), flyingPart(t, Tf, { x: 450, y: -900 }, -1300, -30)] };
  // bowler starts his run-up, then stops and laughs
  const bx = t < T.n3fall ? lerp(-300, 120, prog(T.n3gary + 0.8, T.n3fall, t)) : 120;
  fieldBase(ctx, t, t > Tf ? 0.7 : 0.1);
  drawStumps(ctx, STUMP_B);
  drawPerson(ctx, UMP_X, GY, 1, t > T.n3hw ? P.umpireOut : breathe(P.umpire, t), 'umpire');
  if (bx > -200) drawPerson(ctx, bx, GY, 1, t < T.n3fall ? cyclePose(bx + 300, { A: 36, lift: 28, lean: 10 }) : mix(P.handsOnHead, { face: { mouth: 'grin', eye: 'happy' } }, 1), 'bowler');
  drawStumps(ctx, STUMP_G, st);
  drawPerson(ctx, GARY_X, gy, -1, g, 'gary', 1, { groundY: GY });
  if (t > T.n3fall) { const s0 = skeleton(fullPose({ bat: { a: 0 }, grip: { x: 0, y: 0 } })); ctx.save(); ctx.translate(GARY_X - 120, GY - 10); ctx.rotate(-1.4); paintBat(ctx, s0); ctx.restore(); }
  drawPerson(ctx, 1776, GY, -1, t > Tf ? mix(P.celebrate, {}, 1) : keeperIdle(t), 'greenKeeper');
  impactBurst(ctx, t, Tf, STUMP_G, GY - 60, 1.3);
  dust(ctx, t, Tf, STUMP_G - 40, GY, 10, 100);
  stamp(ctx, t, T.n3hw, 99, 900, 380, 'HIT WICKET');
  turnBanner(ctx, t, T.n3gary);
  hud(ctx, t, '#3', 'THE STRAIGHT SIX', T.n3);
}

// =============== #2 FITNESS ===============
function gymBase(ctx, t, cheer) {
  drawBackdrop(ctx, t, { cheer });
  // cones + mat
  ctx.fillStyle = '#3b6fc4'; rrect(ctx, 600, GY - 6, 720, 26, 10); ctx.fill();
  for (const cx of [300, 1620]) { ctx.fillStyle = '#f08a3c'; ctx.beginPath(); ctx.moveTo(cx - 24, GY + 10); ctx.lineTo(cx, GY - 50); ctx.lineTo(cx + 24, GY + 10); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(cx - 12, GY - 22, 24, 7); }
}
function pushUpAt(u) { return lerp(108, 64, Math.sin(u * Math.PI)); }
function s2A(ctx, t) {
  gymBase(ctx, t, 0.3);
  const s = T.n2 + 0.8, per = 0.36;
  const n = t > s ? Math.floor((t - s) / per) : 0;
  const hh = t > s ? pushUpAt(((t - s) / per) % 1) : 108;
  const { pose, Y } = plank(hh, { face: { mouth: 'smile', eye: 'open', look: 0.8 } });
  drawPerson(ctx, 900, Y, 1, pose, 'kohliCap', 1, { groundY: GY });
  scoreboard(ctx, t, T.n2 + 0.4, T.n2gary + 0.1, 1440, 150, 'PUSH-UPS', [['KOHLI', n, COL.yellow]], { w: 400 });
  label(ctx, t, T.n2vk + 0.8, T.n2gary + 0.2, 960, 420, 'TRAINS LIKE AN ATHLETE', COL.ink, 44);
  nameTag(ctx, t, T.n2 + 0.3, T.n2gary + 0.2, 1010, GY - 260, 'VIRAT KOHLI');
  hud(ctx, t, '#2', 'FITNESS', T.n2);
}
function s2B(ctx, t) {
  gymBase(ctx, t, 0.1);
  const d0 = T.n2gary + 0.3, up = T.n2gary + 1.0, done = T.n2rest - 0.4;
  let hh = 108, face = { mouth: 'flat', eye: 'open', brow: 0.5, look: 0.8 };
  if (t > d0 && t < up) hh = lerp(108, 60, Ease.inOut(prog(d0, up, t)));
  else if (t >= up && t < done) { hh = lerp(60, 108, Ease.inOut(prog(up, done, t))) + Math.sin(t * 50) * 3; face = { mouth: 'open', eye: 'closed', brow: -1 }; }
  if (t >= T.n2rest) { hh = lerp(108, 26, Ease.in(prog(T.n2rest, T.n2rest + 0.35, t))); face = { mouth: 'smile', eye: 'closed', brow: -0.2 }; }
  const { pose, Y } = plank(hh, { face });
  if (t >= T.n2rest + 0.35) { pose.hF = { x: 30, y: -300 }; pose.hB = { x: 24, y: -60 }; pose.head = 20; }
  drawPerson(ctx, 900, Y, 1, pose, 'garyField', 1, { groundY: GY });
  sweat(ctx, t, 1010, GY - 210, clamp(prog(up, up + 0.3, t)) * (t < T.n2rest ? 1 : 0));
  const n = t > done ? 1 : 0;
  scoreboard(ctx, t, T.n2gary + 0.2, 99, 1440, 150, 'PUSH-UPS', [['GARY', n, n ? COL.yellow : COL.red]], { w: 400 });
  if (t > T.n2rest + 0.6) { ctx.font = font(400, 54, F_HAND); ctx.textAlign = 'center'; for (let i = 0; i < 3; i++) { const ph = ((t - T.n2rest) * 0.7 + i / 3) % 1; ctx.globalAlpha = 1 - ph; textOutlined(ctx, 'z', 1040 + ph * 80 + i * 10, GY - 120 - ph * 160, '#2b4a8a', '#fff', 6); } ctx.globalAlpha = 1; }
  bigWord(ctx, t, done + 0.05, T.n2rest, 960, 380, '1!', '#2f9e5b', 120);
  turnBanner(ctx, t, T.n2gary);
  hud(ctx, t, '#2', 'FITNESS', T.n2);
}

// =============== #1 FIFTY ODI HUNDREDS ===============
function celebratePose(t) { return breathe(mix(P.stand, { bat: { a: 176 }, grip: { x: 18, y: -350 }, eF: 1, eB: 1, hip: { x: 0, y: -164 }, lean: -4, head: 8, face: { mouth: 'grin', eye: 'happy' } }, 1), t, 2); }
function s1A(ctx, t) {
  fieldBase(ctx, t, 1);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  drawStumps(ctx, STUMP_G);
  const kp = t < T.n1name ? stanceIdle(t) : mix(P.stance, celebratePose(t), Ease.back(prog(T.n1name, T.n1name + 0.4, t)));
  drawPerson(ctx, GARY_X, GY, -1, kp, 'kohli');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'greenKeeper');
  // grid of fifty hundreds, then the Sachin comparison
  const swap = prog(T.n1vk + 4.6, T.n1vk + 5.0, t);
  const gridA = 1 - swap;
  if (t > T.n1name && gridA > 0) {
    const n = clamp(Math.floor((t - T.n1name) / 0.05), 0, 50);
    ctx.save(); ctx.globalAlpha = gridA;
    for (let i = 0; i < n; i++) {
      const cx = 160 + (i % 10) * 76, cy = 380 + Math.floor(i / 10) * 60;
      ctx.fillStyle = i === 49 ? COL.red : COL.yellow; ctx.beginPath(); ctx.arc(cx, cy, 27, 0, 7); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = font(900, 22, F_TITLE); ctx.fillStyle = i === 49 ? '#fff' : COL.ink; ctx.textAlign = 'center'; ctx.fillText('100', cx, cy + 8);
    }
    ctx.font = font(900, 64, F_TITLE); textOutlined(ctx, `${n} ODI HUNDREDS`, 500, 330, COL.red, '#fff', 12);
    ctx.restore();
  }
  if (swap > 0) {
    ctx.save(); ctx.globalAlpha = swap;
    const bars = [['SACHIN TENDULKAR', 49, '#3b6fc4'], ['VIRAT KOHLI', 50, COL.red]];
    bars.forEach(([nm, v, c], i) => {
      const y = 360 + i * 110, w = 600 * (v / 50) * Ease.out3(prog(T.n1vk + 4.8, T.n1vk + 5.8, t));
      ctx.font = font(900, 34, F_TITLE); ctx.textAlign = 'left'; textOutlined(ctx, nm, 140, y - 10, COL.ink, '#fff', 8);
      ctx.fillStyle = c; rrect(ctx, 140, y, Math.max(10, w), 54, 10); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 3; ctx.stroke();
      ctx.font = font(900, 44, F_TITLE); textOutlined(ctx, String(Math.round(v * Ease.out3(prog(T.n1vk + 4.8, T.n1vk + 5.8, t)))), 150 + w + 10, y + 44, c, '#fff', 8);
    });
    ctx.restore();
  }
  famousCard(ctx, t, T.n1vk - 0.1, T.n1gary - 0.1, '50th ODI HUNDRED', 'World Cup semi-final · Mumbai, 2023');
  nameTag(ctx, t, T.n1 + 0.3, T.n1gary + 0.2, GARY_X - 20, GY - 560, 'VIRAT KOHLI');
  hud(ctx, t, '#1', '50 ODI HUNDREDS', T.n1);
}
function s1B(ctx, t) {
  fieldBase(ctx, t, 0.3);
  drawStumps(ctx, STUMP_B); drawPerson(ctx, UMP_X, GY, 1, breathe(P.umpire, t), 'umpire');
  drawStumps(ctx, STUMP_G);
  let g = mix(P.stance, celebratePose(t), Ease.back(prog(T.n1gary + 0.3, T.n1gary + 0.7, t)));
  if (t > T.n1career + 0.4) g = mix(g, { head: 20, face: { mouth: 'flat', eye: 'half', brow: -0.6, look: -0.5 } }, Ease.out(prog(T.n1career + 0.4, T.n1career + 0.8, t)));
  drawPerson(ctx, GARY_X, GY, -1, g, 'gary');
  drawPerson(ctx, 1776, GY, -1, keeperIdle(t), 'greenKeeper');
  const rows = [['RUNS', 100, COL.yellow]];
  if (t > T.n1career) rows.push(['MATCHES', 214, COL.red], ['AVERAGE', '0.47', COL.red]);
  scoreboard(ctx, t, T.n1gary + 0.3, 99, 620, 150, t > T.n1career ? "GARY'S WHOLE CAREER" : 'GARY', rows, { w: 560 });
  turnBanner(ctx, t, T.n1gary);
  hud(ctx, t, '#1', '50 ODI HUNDREDS', T.n1);
}

// =============== OUTRO ===============
function deckchair(ctx, x) {
  ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 90, GY); ctx.lineTo(x + 40, GY - 150); ctx.moveTo(x + 60, GY); ctx.lineTo(x - 40, GY - 110); ctx.stroke();
  ctx.fillStyle = '#e2283c'; ctx.beginPath(); ctx.moveTo(x - 70, GY - 70); ctx.lineTo(x + 40, GY - 150); ctx.lineTo(x + 70, GY - 120); ctx.lineTo(x - 20, GY - 30); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x - 70 + i * 36, GY - 70 - i * 27); ctx.lineTo(x - 58 + i * 36, GY - 79 - i * 27); ctx.lineTo(x - 8 + i * 36, GY - 39 - i * 27); ctx.lineTo(x - 20 + i * 36, GY - 30 - i * 27); ctx.fill(); }
}
function calendar(ctx, t, x, y, text, sub) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; rrect(ctx, -110 + 6, 8, 220, 230, 16); ctx.fill();
  ctx.fillStyle = '#fff'; rrect(ctx, -110, 0, 220, 230, 16); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = COL.red; rrect(ctx, -110, 0, 220, 64, 16); ctx.fill(); ctx.fillRect(-110, 40, 220, 24);
  ctx.font = font(900, 34, F_TITLE); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(sub, 0, 46);
  ctx.font = font(900, text.length > 4 ? 36 : 96, F_TITLE); ctx.fillStyle = COL.ink; ctx.fillText(text, 0, text.length > 4 ? 158 : 180);
  ctx.restore();
}
function sOutro(ctx, t) {
  drawBackdrop(ctx, t, { cheer: 0.2 });
  if (t < T.tomorrow) {
    // Kohli shuttle runs while the days fly by
    const per = 1.6, u = ((t - T.outro) / per) % 1, leg = Math.floor((t - T.outro) / per) % 2;
    const x = leg === 0 ? lerp(500, 1450, u) : lerp(1450, 500, u);
    const p = cyclePose((t - T.outro) * 950, { A: 50, lift: 46, lean: 20, hipY: -150, arm: 42 });
    p.face = { mouth: 'flat', eye: 'open', brow: 0.6, look: 0.8 };
    drawPerson(ctx, x, GY, leg === 0 ? 1 : -1, p, 'kohliCap');
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4; const yy = GY - 120 - i * 30, dx = leg === 0 ? -1 : 1; ctx.beginPath(); ctx.moveTo(x + dx * 70, yy); ctx.lineTo(x + dx * (140 + i * 10), yy); ctx.stroke(); }
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const di = t > T.work ? Math.floor((t - T.work) / 0.18) : 0;
    calendar(ctx, t, 300, 140, String(1 + (di % 28)), days[di % 7]);
    if (t > T.work) label(ctx, t, T.work, T.tomorrow, 960, 300, 'EVERY. SINGLE. DAY.', COL.red, 60);
    nameTag(ctx, t, T.outro + 0.2, T.tomorrow, x, GY - 400, 'VIRAT KOHLI');
  } else {
    deckchair(ctx, 1000);
    const sit = { hip: { x: -10, y: -96 }, lean: -38, head: 20, fF: { x: 110, y: -8 }, fB: { x: 96, y: -8 }, hF: { x: 64, y: -196 }, hB: { x: -36, y: -292 }, eF: -1, eB: 1, face: { mouth: 'smile', eye: 'closed', brow: -0.3 } };
    drawPerson(ctx, 990, GY, 1, breathe(sit, t, 1), 'garyField');
    // sunglasses + drink
    const hp = personPoint(990, GY, 1, 1, sit, 'head');
    ctx.fillStyle = '#111'; rrect(ctx, hp.x + 2, hp.y - 12, 30, 12, 5); ctx.fill();
    const dh = personPoint(990, GY, 1, 1, sit, 'hF');
    ctx.fillStyle = '#ffd36b'; rrect(ctx, dh.x - 8, dh.y - 34, 18, 32, 4); ctx.fill(); ctx.strokeStyle = COL.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = COL.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(dh.x + 4, dh.y - 34); ctx.lineTo(dh.x + 14, dh.y - 52); ctx.stroke();
    calendar(ctx, t, 1500, 360, 'TOMORROW', 'START');
    nameTag(ctx, t, T.tomorrow + 0.2, 99, hp.x, hp.y - 90, 'GARY');
  }
  drawCounter(ctx, t, 1 - prog(T.outro, T.outro + 0.4, t));
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
  { t0: T.outro, t1: T.tomorrow, fn: sOutro, fade: 0.4 },
  { t0: T.tomorrow, t1: 999, fn: sOutro, fade: 0.3 },
];
