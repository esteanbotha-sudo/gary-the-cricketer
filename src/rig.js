// Human character rig: 2-bone IK limbs, proportioned body, expressive face, cricket kit.
'use strict';

const OUT = '#20232b';           // outline colour
const LW = 3;                    // outline width (character units)
const L = {                      // body proportions (units ~ px at scale 1)
  torso: 104, neck: 11, headR: 27,
  thigh: 82, shin: 80, upper: 60, fore: 55,
  bat: 130, handle: 42,
};

const LOOKS = {
  gary: {
    shirt: '#1f3a6e', accent: '#f2c230', trousers: '#f4f4f0', skin: '#e9b48a', hair: '#5a3825',
    head: 'helmet', capColor: '#1b3160', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  garyCap: {
    shirt: '#1f3a6e', accent: '#f2c230', trousers: '#f4f4f0', skin: '#e9b48a', hair: '#5a3825',
    head: 'cap', capColor: '#1b3160', pads: true, gloves: null, shoes: '#f4f4f0', sleeve: 'long',
  },
  partner: {
    shirt: '#1f3a6e', accent: '#f2c230', trousers: '#f4f4f0', skin: '#b9784f', hair: '#1d1410',
    head: 'helmet', capColor: '#1b3160', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  bowler: {
    shirt: '#1d7a46', accent: '#c9f06a', trousers: '#1d7a46', skin: '#c58c5c', hair: '#18110c',
    head: 'cap', capColor: '#155c34', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short', beard: true,
  },
  spinner: {
    shirt: '#1d7a46', accent: '#c9f06a', trousers: '#1d7a46', skin: '#d9a273', hair: '#2a1a10',
    head: 'cap', capColor: '#155c34', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  fielder: {
    shirt: '#1d7a46', accent: '#c9f06a', trousers: '#1d7a46', skin: '#efc39b', hair: '#c9a15a',
    head: 'cap', capColor: '#155c34', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  keeper: {
    shirt: '#1d7a46', accent: '#c9f06a', trousers: '#1d7a46', skin: '#b97a4c', hair: '#120c08',
    head: 'cap', capColor: '#155c34', pads: true, gloves: '#f1f1ea', bigGloves: true, shoes: '#f4f4f0', sleeve: 'long',
  },
  abd: {
    shirt: '#0f7a43', accent: '#f6c531', trousers: '#0f7a43', skin: '#f0c7a0', hair: '#3b2a1c',
    head: 'helmet', capColor: '#0b5a31', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  abdField: {
    shirt: '#0f7a43', accent: '#f6c531', trousers: '#0f7a43', skin: '#f0c7a0', hair: '#3b2a1c',
    head: 'cap', capColor: '#0b5a31', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  kohli: {
    shirt: '#1f6fd1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#c98d62', hair: '#15100c',
    head: 'helmet', capColor: '#16336e', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long', beard: true,
  },
  kohliCap: {
    shirt: '#1f6fd1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#c98d62', hair: '#15100c',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short', beard: true,
  },
  garyField: {
    shirt: '#1f3a6e', accent: '#f2c230', trousers: '#f4f4f0', skin: '#e9b48a', hair: '#5a3825',
    head: 'cap', capColor: '#1b3160', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  maroon: {
    shirt: '#7a1f2b', accent: '#f6c531', trousers: '#7a1f2b', skin: '#6b4430', hair: '#120c08',
    head: 'cap', capColor: '#5c1520', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  maroonKeeper: {
    shirt: '#7a1f2b', accent: '#f6c531', trousers: '#7a1f2b', skin: '#5e3b29', hair: '#120c08',
    head: 'cap', capColor: '#5c1520', pads: true, gloves: '#f1f1ea', bigGloves: true, shoes: '#f4f4f0', sleeve: 'long',
  },
  greenKeeper: {
    shirt: '#1d7a46', accent: '#c9f06a', trousers: '#1d7a46', skin: '#c58c5c', hair: '#18110c',
    head: 'cap', capColor: '#155c34', pads: true, gloves: '#f1f1ea', bigGloves: true, shoes: '#f4f4f0', sleeve: 'long',
  },
  warne: {
    shirt: '#f7f5ee', accent: '#1d4a2b', trousers: '#f7f5ee', skin: '#efc39b', hair: '#f0cf6e',
    head: 'cap', capColor: '#1d4a2b', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'long',
  },
  ausKeeper: {
    shirt: '#f7f5ee', accent: '#1d4a2b', trousers: '#f7f5ee', skin: '#e9b48a', hair: '#3b2a1c',
    head: 'cap', capColor: '#1d4a2b', pads: true, gloves: '#f1f1ea', bigGloves: true, shoes: '#f4f4f0', sleeve: 'long',
  },
  england: {
    shirt: '#f7f5ee', accent: '#1b2a4a', trousers: '#f7f5ee', skin: '#f0c9a4', hair: '#6b4a2b',
    head: 'helmet', capColor: '#1b2a4a', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  sachin: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#c98d62', hair: '#1a120c',
    head: 'helmet', capColor: '#16336e', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  sachinCap: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#c98d62', hair: '#1a120c',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  indiaMate: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#a8714a', hair: '#120c08',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  garyMate: {
    shirt: '#1f3a6e', accent: '#f2c230', trousers: '#f4f4f0', skin: '#d9a273', hair: '#2a1a10',
    head: 'cap', capColor: '#1b3160', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  dhoni: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#b98055', hair: '#1a120c',
    head: 'helmet', capColor: '#16336e', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  dhoniKeep: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#b98055', hair: '#1a120c',
    head: 'cap', capColor: '#16336e', pads: true, gloves: '#f1f1ea', bigGloves: true, shoes: '#f4f4f0', sleeve: 'long',
  },
  dhoniCap: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#b98055', hair: '#1a120c',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  garyKeeper: {
    shirt: '#1f3a6e', accent: '#f2c230', trousers: '#f4f4f0', skin: '#e9b48a', hair: '#5a3825',
    head: 'cap', capColor: '#1b3160', pads: true, gloves: '#f1f1ea', bigGloves: true, shoes: '#f4f4f0', sleeve: 'long',
  },
  maroonBat: {
    shirt: '#7a1f2b', accent: '#f6c531', trousers: '#7a1f2b', skin: '#6b4430', hair: '#120c08',
    head: 'helmet', capColor: '#5c1520', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  stokes: {
    shirt: '#f7f5ee', accent: '#1b2a4a', trousers: '#f7f5ee', skin: '#f0c4a0', hair: '#b5652b',
    head: 'helmet', capColor: '#1b2a4a', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long', beard: true,
  },
  stokesField: {
    shirt: '#f7f5ee', accent: '#1b2a4a', trousers: '#f7f5ee', skin: '#f0c4a0', hair: '#b5652b',
    head: 'cap', capColor: '#1b2a4a', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'long', beard: true,
  },
  leach: {
    shirt: '#f7f5ee', accent: '#1b2a4a', trousers: '#f7f5ee', skin: '#f3cdb0', hair: '#7a5a3a',
    head: 'helmet', capColor: '#1b2a4a', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  steyn: {
    shirt: '#f7f5ee', accent: '#0b5a31', trousers: '#f7f5ee', skin: '#efc39b', hair: '#3b2a1c',
    head: 'cap', capColor: '#0b5a31', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'long',
  },
  saField: {
    shirt: '#f7f5ee', accent: '#0b5a31', trousers: '#f7f5ee', skin: '#d9a273', hair: '#1a120c',
    head: 'cap', capColor: '#0b5a31', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'long',
  },
  saKeeper: {
    shirt: '#f7f5ee', accent: '#0b5a31', trousers: '#f7f5ee', skin: '#f0c7a0', hair: '#3b2a1c',
    head: 'cap', capColor: '#0b5a31', pads: true, gloves: '#f1f1ea', bigGloves: true, shoes: '#f4f4f0', sleeve: 'long',
  },
  bumrah: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#b98055', hair: '#120c08',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short', beard: true,
  },
  lara: {
    shirt: '#7a1f2b', accent: '#f6c531', trousers: '#f7f5ee', skin: '#6b4430', hair: '#120c08',
    head: 'helmet', capColor: '#5c1520', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  laraCap: {
    shirt: '#7a1f2b', accent: '#f6c531', trousers: '#f7f5ee', skin: '#6b4430', hair: '#120c08',
    head: 'cap', capColor: '#5c1520', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  laraWarks: {
    shirt: '#f7f5ee', accent: '#1b2a4a', trousers: '#f7f5ee', skin: '#6b4430', hair: '#120c08',
    head: 'helmet', capColor: '#1b2a4a', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  gayle: {
    shirt: '#7a1f2b', accent: '#f6c531', trousers: '#7a1f2b', skin: '#5e3b29', hair: '#120c08',
    head: 'helmet', capColor: '#5c1520', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long', beard: true,
  },
  gayleCap: {
    shirt: '#7a1f2b', accent: '#f6c531', trousers: '#7a1f2b', skin: '#5e3b29', hair: '#120c08',
    head: 'cap', capColor: '#5c1520', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short', beard: true,
  },
  gayleRcb: {
    shirt: '#c8102e', accent: '#f6c531', trousers: '#1b1b1b', skin: '#5e3b29', hair: '#120c08',
    head: 'helmet', capColor: '#1b1b1b', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long', beard: true,
  },
  akram: {
    shirt: '#0f7a43', accent: '#c9f06a', trousers: '#0f7a43', skin: '#c58c5c', hair: '#18110c',
    head: 'cap', capColor: '#0b5a31', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  murali: {
    shirt: '#1b3f8f', accent: '#f6c531', trousers: '#1b3f8f', skin: '#8a5a3a', hair: '#120c08',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'long',
  },
  muraliTest: {
    shirt: '#f7f5ee', accent: '#1b3f8f', trousers: '#f7f5ee', skin: '#8a5a3a', hair: '#120c08',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'long',
  },
  slKeeper: {
    shirt: '#f7f5ee', accent: '#1b3f8f', trousers: '#f7f5ee', skin: '#9a6a48', hair: '#120c08',
    head: 'cap', capColor: '#16336e', pads: true, gloves: '#f1f1ea', bigGloves: true, shoes: '#f4f4f0', sleeve: 'long',
  },
  kallis: {
    shirt: '#f7f5ee', accent: '#0b5a31', trousers: '#f7f5ee', skin: '#efc39b', hair: '#3b2a1c',
    head: 'helmet', capColor: '#0b5a31', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long',
  },
  kallisCap: {
    shirt: '#f7f5ee', accent: '#0b5a31', trousers: '#f7f5ee', skin: '#efc39b', hair: '#3b2a1c',
    head: 'cap', capColor: '#0b5a31', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'long',
  },
  maxwell: {
    shirt: '#f6c531', accent: '#0b5a31', trousers: '#f6c531', skin: '#efc39b', hair: '#6b4a2b',
    head: 'helmet', capColor: '#0b5a31', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long', beard: true,
  },
  maxwellCap: {
    shirt: '#f6c531', accent: '#0b5a31', trousers: '#f6c531', skin: '#efc39b', hair: '#6b4a2b',
    head: 'cap', capColor: '#0b5a31', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short', beard: true,
  },
  physio: {
    shirt: '#e2283c', accent: '#ffffff', trousers: '#1b2a4a', skin: '#e0b08a', hair: '#3b2a1c',
    head: 'cap', capColor: '#e2283c', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  rohit: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#c98d62', hair: '#1a120c',
    head: 'helmet', capColor: '#16336e', pads: true, gloves: '#f4f4f0', shoes: '#f4f4f0', sleeve: 'long', beard: true,
  },
  rohitCap: {
    shirt: '#2a7de1', accent: '#ff8a1f', trousers: '#1b3f8f', skin: '#c98d62', hair: '#1a120c',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short', beard: true,
  },
  slBowler: {
    shirt: '#1b3f8f', accent: '#f6c531', trousers: '#1b3f8f', skin: '#8a5a3a', hair: '#120c08',
    head: 'cap', capColor: '#16336e', pads: false, gloves: null, shoes: '#f4f4f0', sleeve: 'short',
  },
  umpire: {
    shirt: '#fbfbf7', accent: '#2a2f3a', trousers: '#2b2f38', skin: '#f0c9a4', hair: '#bdbdbd',
    head: 'hat', capColor: '#fbfbf7', pads: false, gloves: null, shoes: '#202020', sleeve: 'long', coat: true,
    moustache: true,
  },
};

const up = a => ({ x: Math.sin(a * DEG), y: -Math.cos(a * DEG) });
const add = (p, v, s = 1) => ({ x: p.x + v.x * s, y: p.y + v.y * s });

function ik(a, t, l1, l2, bend) {
  let dx = t.x - a.x, dy = t.y - a.y;
  let d = Math.hypot(dx, dy);
  const maxD = l1 + l2 - 0.5;
  if (d > maxD) { dx *= maxD / d; dy *= maxD / d; d = maxD; }
  d = Math.max(d, Math.abs(l1 - l2) + 0.5);
  const base = Math.atan2(dy, dx);
  const cosA = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
  const off = Math.acos(cosA);
  const ang = base - bend * off;
  const j = { x: a.x + Math.cos(ang) * l1, y: a.y + Math.sin(ang) * l1 };
  return { j, end: { x: a.x + dx, y: a.y + dy } };
}

const BASE_POSE = {
  hip: { x: 0, y: -162 }, lean: 3, head: 0, rot: 0,
  fF: { x: 12, y: -8 }, fB: { x: -12, y: -8 },
  hF: { x: 10, y: -150 }, hB: { x: -6, y: -152 },
  eF: -1, eB: -1,               // elbow bend direction (+1 forward)
  bat: null, grip: { x: 14, y: -140 },
  face: { mouth: 'smile', eye: 'open', brow: 0, look: 0.3, lookY: 0 },
  finger: false, ball: false, toeF: 0, toeB: 0,
};

function fullPose(p) { return mix(BASE_POSE, p || {}, 1); }

// Compute skeleton (local coords, facing +x).
function skeleton(p) {
  const hip = p.hip;
  const u = up(p.lean);
  const neck = add(hip, u, L.torso);
  const sh = add(hip, u, L.torso - 15);
  const hu = up(p.lean + p.head);
  const headC = add(neck, hu, L.neck + L.headR * 0.92);
  let hF = p.hF, hB = p.hB, batDir = null, batTop = null;
  if (p.bat) {
    batDir = { x: Math.sin(p.bat.a * DEG), y: Math.cos(p.bat.a * DEG) };
    hB = { x: p.grip.x, y: p.grip.y };
    hF = add(hB, batDir, 15);
    batTop = add(hB, batDir, -8);
  }
  const shF = add(sh, { x: 3, y: 1 }), shB = add(sh, { x: -3, y: -1 });
  const armF = ik(shF, hF, L.upper, L.fore, p.eF);
  const armB = ik(shB, hB, L.upper, L.fore, p.eB);
  const hipF = add(hip, { x: 3, y: 2 }), hipB = add(hip, { x: -3, y: -2 });
  const legF = ik(hipF, p.fF, L.thigh, L.shin, 1);
  const legB = ik(hipB, p.fB, L.thigh, L.shin, 1);
  return { hip, neck, sh, headC, shF, shB, armF, armB, hipF, hipB, legF, legB, batDir, batTop, hF: armF.end, hB: armB.end, u, hu };
}

// ---- body part painters (local space) ----
function paintLeg(ctx, hipP, leg, look, dark, toe) {
  const k = leg.j, a = leg.end;
  const tr = dark ? shade(look.trousers, 0.84) : look.trousers;
  outlined(ctx, () => { capsule(ctx, hipP.x, hipP.y, k.x, k.y, 16, 12.5); capsule(ctx, k.x, k.y, a.x, a.y, 12.5, 9); }, tr, OUT, LW);
  // trouser crease
  ctx.strokeStyle = shade(tr, 0.86); ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(lerp(hipP.x, k.x, 0.3) + 4, lerp(hipP.y, k.y, 0.3)); ctx.lineTo(lerp(k.x, a.x, 0.75) + 3, lerp(k.y, a.y, 0.75)); ctx.stroke();
  if (look.pads) {
    const pc = dark ? '#dcdcd4' : '#ffffff';
    const sv = { x: a.x - k.x, y: a.y - k.y }; const sl = Math.hypot(sv.x, sv.y) || 1;
    const n = { x: sv.x / sl, y: sv.y / sl };
    let f = { x: -n.y, y: n.x }; if (f.x < 0) f = { x: -f.x, y: -f.y };
    const top = add(add(k, n, -16), f, 3), bot = add(add(a, n, -5), f, 3);
    outlined(ctx, () => { capsule(ctx, top.x, top.y, bot.x, bot.y, 13.5, 11.5); }, pc, OUT, LW);
    ctx.strokeStyle = dark ? '#c4c4bb' : '#d3d7de'; ctx.lineWidth = 1.8;
    for (const o of [-4, 4]) {
      const pa = add(add(top, n, 14), f, o), pb = add(add(bot, n, -4), f, o);
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
    const kr = add(top, n, 11);
    ctx.beginPath(); ctx.moveTo(kr.x - f.x * 11, kr.y - f.y * 11); ctx.lineTo(kr.x + f.x * 11, kr.y + f.y * 11); ctx.stroke();
    ctx.strokeStyle = shade(look.shirt, dark ? 0.8 : 1); ctx.lineWidth = 3;
    const sm = add(top, n, 30);
    ctx.beginPath(); ctx.moveTo(sm.x - f.x * 12, sm.y - f.y * 12); ctx.lineTo(sm.x + f.x * 12, sm.y + f.y * 12); ctx.stroke();
  }
  // shoe
  const ang = (toe || 0) * DEG;
  ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(ang);
  const sc = dark ? shade(look.shoes, 0.85) : look.shoes;
  outlined(ctx, () => { rrect(ctx, -10, -4, 36, 14, 7); }, sc, OUT, LW);
  ctx.fillStyle = shade(sc, 0.75); rrect(ctx, -10, 6, 36, 4, 2); ctx.fill();
  ctx.restore();
}

function paintArm(ctx, shP, arm, look, dark, opts) {
  const e = arm.j, h = arm.end;
  const shirt = dark ? shade(look.shirt, 0.82) : look.shirt;
  const skin = dark ? shade(look.skin, 0.85) : look.skin;
  if (look.sleeve === 'long') {
    outlined(ctx, () => { capsule(ctx, shP.x, shP.y, e.x, e.y, 11.5, 9.5); capsule(ctx, e.x, e.y, h.x, h.y, 9.5, 7.5); }, shirt, OUT, LW);
    // cuff
  } else {
    const mid = { x: lerp(shP.x, e.x, 0.62), y: lerp(shP.y, e.y, 0.62) };
    outlined(ctx, () => { capsule(ctx, mid.x, mid.y, e.x, e.y, 9, 8); capsule(ctx, e.x, e.y, h.x, h.y, 8, 6.8); }, skin, OUT, LW);
    outlined(ctx, () => { capsule(ctx, shP.x, shP.y, mid.x, mid.y, 12.5, 11); }, shirt, OUT, LW);
  }
  // hand / glove
  if (opts.glove) {
    const g = dark ? shade(opts.glove, 0.85) : opts.glove;
    const r = opts.big ? 13.5 : 10.5;
    outlined(ctx, () => { circlePath(ctx, h.x, h.y, r); }, g, OUT, LW);
    ctx.fillStyle = look.shirt; ctx.beginPath(); ctx.arc(h.x, h.y, r * 0.45, 0, Math.PI * 2); ctx.fill();
  } else {
    outlined(ctx, () => { circlePath(ctx, h.x, h.y, 8.5); }, skin, OUT, LW);
    if (opts.finger) {
      // index finger pointing along forearm direction extended
      const v = { x: h.x - e.x, y: h.y - e.y }; const l = Math.hypot(v.x, v.y) || 1;
      outlined(ctx, () => { capsule(ctx, h.x, h.y, h.x + v.x / l * 20, h.y + v.y / l * 20, 4, 3.5); }, skin, OUT, LW * 0.8);
    }
  }
}

function paintTorso(ctx, s, look) {
  const hip = s.hip, u = s.u;
  const chest = add(hip, u, L.torso - 22);
  const belly = add(hip, u, 30);
  const fwd = { x: -u.y, y: u.x }; // forward perpendicular
  if (look.coat) {
    // umpire coat: longer, flares below hips
    const bottom = add(hip, u, -38);
    outlined(ctx, () => {
      ctx.moveTo(chest.x - fwd.x * 24, chest.y - fwd.y * 24);
      ctx.quadraticCurveTo(chest.x + fwd.x * 34, chest.y + fwd.y * 34, belly.x + fwd.x * 28, belly.y + fwd.y * 28);
      ctx.lineTo(bottom.x + fwd.x * 30, bottom.y + fwd.y * 30);
      ctx.lineTo(bottom.x - fwd.x * 28, bottom.y - fwd.y * 28);
      ctx.quadraticCurveTo(belly.x - fwd.x * 26, belly.y - fwd.y * 26, chest.x - fwd.x * 24, chest.y - fwd.y * 24);
      circlePath(ctx, chest.x + fwd.x * 2, chest.y + fwd.y * 2, 27);
    }, look.shirt, OUT, LW);
    // coat buttons + lapel
    ctx.fillStyle = '#9aa0aa';
    for (let i = 0; i < 3; i++) { const b = add(add(hip, u, 10 + i * 24), fwd, 26); ctx.beginPath(); ctx.arc(b.x, b.y, 2.6, 0, 7); ctx.fill(); }
    ctx.strokeStyle = '#c9ccd2'; ctx.lineWidth = 2;
    const l0 = add(add(hip, u, L.torso - 8), fwd, 12), l1 = add(add(hip, u, 52), fwd, 24);
    ctx.beginPath(); ctx.moveTo(l0.x, l0.y); ctx.lineTo(l1.x, l1.y); ctx.stroke();
    // tie
    ctx.fillStyle = '#2a2f3a';
    const t0 = add(add(hip, u, L.torso - 10), fwd, 22);
    ctx.beginPath(); ctx.moveTo(t0.x, t0.y); ctx.lineTo(t0.x + fwd.x * 6 - u.x * 30, t0.y + fwd.y * 6 - u.y * 30); ctx.lineTo(t0.x - u.x * 30, t0.y - u.y * 30); ctx.closePath(); ctx.fill();
    return;
  }
  // trousers seat
  outlined(ctx, () => { capsule(ctx, hip.x, hip.y + 2, belly.x, belly.y, 21, 21); }, look.trousers, OUT, LW);
  // shirt body with slight chest
  outlined(ctx, () => {
    capsule(ctx, belly.x - u.x * 6, belly.y - u.y * 6, chest.x, chest.y, 22, 26);
    circlePath(ctx, chest.x + fwd.x * 4, chest.y + fwd.y * 4, 25);
  }, look.shirt, OUT, LW);
  // side panel / piping
  ctx.strokeStyle = look.accent; ctx.lineWidth = 4; ctx.lineCap = 'round';
  const p0 = add(add(belly, u, -4), fwd, -4), p1 = add(add(chest, u, 12), fwd, -6);
  ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.quadraticCurveTo(p1.x - fwd.x * 8, (p0.y + p1.y) / 2, p1.x, p1.y); ctx.stroke();
  // shirt hem shading
  ctx.strokeStyle = shade(look.shirt, 0.75); ctx.lineWidth = 2;
  const hm = add(hip, u, 14);
  ctx.beginPath(); ctx.moveTo(hm.x - fwd.x * 18, hm.y - fwd.y * 18); ctx.lineTo(hm.x + fwd.x * 20, hm.y + fwd.y * 20); ctx.stroke();
  // collar
  const c = add(s.neck, u, -4);
  ctx.fillStyle = shade(look.shirt, 0.7);
  ctx.beginPath(); ctx.moveTo(c.x - fwd.x * 10, c.y - fwd.y * 10); ctx.lineTo(c.x + fwd.x * 14, c.y + fwd.y * 14); ctx.lineTo(c.x + fwd.x * 6 - u.x * 12, c.y + fwd.y * 6 - u.y * 12); ctx.closePath(); ctx.fill();
}

function paintHead(ctx, s, look, face) {
  const n = s.neck, hc = s.headC, hu = s.hu;
  const fwd = { x: -hu.y, y: hu.x };
  // neck
  outlined(ctx, () => { capsule(ctx, n.x, n.y, lerp(n.x, hc.x, 0.6), lerp(n.y, hc.y, 0.6), 9.5, 9.5); }, shade(look.skin, 0.9), OUT, LW);
  ctx.save();
  ctx.translate(hc.x, hc.y);
  ctx.rotate(Math.atan2(hu.x, -hu.y));
  const R = L.headR;
  // skull + jaw (merged)
  outlined(ctx, () => {
    ctx.ellipse(0, -2, R * 0.95, R, 0, 0, Math.PI * 2);
    ctx.moveTo(10 + 17, 13); ctx.ellipse(10, 13, 17, 14, 0, 0, Math.PI * 2);
    ctx.moveTo(24 + 6, 1); ctx.ellipse(24, 1, 6, 6.5, 0, 0, Math.PI * 2); // nose
  }, look.skin, OUT, LW);
  // hair (back)
  ctx.fillStyle = look.hair;
  ctx.beginPath(); ctx.ellipse(-6, -8, R * 0.82, R * 0.8, -0.3, Math.PI * 0.55, Math.PI * 1.65); ctx.closePath(); ctx.fill();
  if (look.beard) {
    ctx.fillStyle = look.hair; ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.moveTo(-6, 6); ctx.quadraticCurveTo(0, 30, 16, 27); ctx.quadraticCurveTo(26, 24, 27, 14); ctx.quadraticCurveTo(18, 22, 8, 16); ctx.quadraticCurveTo(0, 12, -6, 6); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // ear
  outlined(ctx, () => { ctx.ellipse(-4, 2, 6, 8, 0, 0, Math.PI * 2); }, shade(look.skin, 0.92), OUT, LW * 0.8);
  ctx.strokeStyle = shade(look.skin, 0.7); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-4, 2, 3.2, -1, 1.6); ctx.stroke();
  // cheek blush
  ctx.fillStyle = 'rgba(230,110,100,0.22)'; ctx.beginPath(); ctx.ellipse(12, 10, 7, 4.5, 0, 0, 7); ctx.fill();
  // eye
  const ex = 13, ey = -4;
  const lk = (face.look || 0) * 2.2, lky = (face.lookY || 0) * 2;
  if (face.eye === 'closed' || face.eye === 'happy') {
    ctx.strokeStyle = OUT; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    ctx.beginPath();
    if (face.eye === 'happy') ctx.arc(ex, ey + 2, 5, Math.PI * 1.1, Math.PI * 1.9); else ctx.arc(ex, ey - 1, 5, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
  } else {
    const big = face.eye === 'wide' ? 1.3 : 1;
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.ellipse(ex, ey, 5.2 * big, 6.5 * big, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a1d14'; ctx.beginPath(); ctx.arc(ex + lk + 0.8, ey + lky + 0.5, 3.2 * (face.eye === 'wide' ? 0.9 : 1), 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + lk + 1.8, ey + lky - 0.8, 1.1, 0, 7); ctx.fill();
    if (face.eye === 'half') { ctx.fillStyle = look.skin; ctx.beginPath(); ctx.rect(ex - 7, ey - 9, 14, 7); ctx.fill(); ctx.strokeStyle = OUT; ctx.beginPath(); ctx.moveTo(ex - 6, ey - 2); ctx.lineTo(ex + 6, ey - 2); ctx.stroke(); }
  }
  // brow
  const br = face.brow || 0; // + angry (inner down), - worried
  ctx.strokeStyle = look.hair === '#bdbdbd' ? '#8a8a8a' : shade(look.hair, 0.8); ctx.lineWidth = 3.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(ex - 6, ey - 10 - br * 2.5); ctx.lineTo(ex + 6, ey - 11 + br * 3); ctx.stroke();
  if (look.moustache) { ctx.fillStyle = '#a9a9a9'; ctx.beginPath(); ctx.ellipse(19, 10, 7, 3, 0.2, 0, 7); ctx.fill(); }
  // mouth
  const mx = 17, my = 16;
  ctx.strokeStyle = OUT; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  switch (face.mouth) {
    case 'grin':
      ctx.fillStyle = '#7a2a2a'; ctx.beginPath(); ctx.moveTo(mx - 7, my - 2); ctx.quadraticCurveTo(mx + 1, my + 10, mx + 9, my - 3); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(mx - 6, my - 1.5); ctx.lineTo(mx + 8, my - 2.5); ctx.lineTo(mx + 6, my + 1.5); ctx.lineTo(mx - 4, my + 1.5); ctx.closePath(); ctx.fill();
      break;
    case 'open':
      ctx.fillStyle = '#7a2a2a'; ctx.beginPath(); ctx.ellipse(mx + 1, my + 2, 6, 7, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e46a6a'; ctx.beginPath(); ctx.ellipse(mx + 1, my + 6, 3.5, 2.5, 0, 0, 7); ctx.fill();
      break;
    case 'o':
      ctx.fillStyle = '#7a2a2a'; ctx.beginPath(); ctx.ellipse(mx + 1, my + 1, 3, 3.6, 0, 0, 7); ctx.fill(); ctx.stroke(); break;
    case 'flat':
      ctx.beginPath(); ctx.moveTo(mx - 5, my); ctx.lineTo(mx + 6, my); ctx.stroke(); break;
    case 'frown':
      ctx.beginPath(); ctx.moveTo(mx - 6, my + 3); ctx.quadraticCurveTo(mx, my - 3, mx + 7, my + 2); ctx.stroke(); break;
    case 'smirk':
      ctx.beginPath(); ctx.moveTo(mx - 5, my + 1); ctx.quadraticCurveTo(mx + 2, my + 3, mx + 8, my - 3); ctx.stroke(); break;
    default:
      ctx.beginPath(); ctx.moveTo(mx - 6, my - 1); ctx.quadraticCurveTo(mx, my + 5, mx + 7, my - 2); ctx.stroke();
  }
  // headwear
  if (look.head === 'cap') {
    outlined(ctx, () => {
      ctx.moveTo(-R * 0.98, -6); ctx.bezierCurveTo(-R, -R * 1.45, R * 1.05, -R * 1.45, R * 0.98, -10); ctx.lineTo(-R * 0.98, -6); ctx.closePath();
    }, look.capColor, OUT, LW);
    outlined(ctx, () => { ctx.moveTo(14, -12); ctx.quadraticCurveTo(36, -16, 46, -8); ctx.quadraticCurveTo(34, -5, 14, -7); ctx.closePath(); }, shade(look.capColor, 0.8), OUT, LW);
    ctx.fillStyle = look.accent; ctx.beginPath(); ctx.arc(0, -R * 1.07, 3, 0, 7); ctx.fill();
  } else if (look.head === 'helmet') {
    // grille behind? draw shell then grille in front of face
    outlined(ctx, () => {
      ctx.moveTo(-R * 1.08, 4); ctx.bezierCurveTo(-R * 1.15, -R * 1.6, R * 1.15, -R * 1.6, R * 1.06, -8); ctx.lineTo(10, -6); ctx.lineTo(4, 10); ctx.lineTo(-R * 1.08, 10); ctx.closePath();
    }, look.capColor, OUT, LW);
    // ear guard
    outlined(ctx, () => { ctx.ellipse(-4, 3, 9, 11, 0, 0, Math.PI * 2); }, shade(look.capColor, 1.15), OUT, LW * 0.8);
    // visor
    outlined(ctx, () => { ctx.moveTo(16, -14); ctx.quadraticCurveTo(40, -16, 44, -8); ctx.quadraticCurveTo(30, -6, 16, -8); ctx.closePath(); }, shade(look.capColor, 0.75), OUT, LW);
    // badge
    ctx.fillStyle = look.accent; ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(6, -21); ctx.lineTo(5, -14); ctx.lineTo(0, -11); ctx.lineTo(-5, -14); ctx.lineTo(-6, -21); ctx.closePath(); ctx.fill();
    // grille
    ctx.strokeStyle = OUT; ctx.lineWidth = 5.5; ctx.lineCap = 'round';
    const grille = () => {
      ctx.beginPath(); ctx.moveTo(40, -6); ctx.quadraticCurveTo(42, 14, 30, 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, 6); ctx.quadraticCurveTo(26, 4, 41, 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, 14); ctx.quadraticCurveTo(24, 18, 38, 16); ctx.stroke();
    };
    grille(); ctx.strokeStyle = '#c7ccd4'; ctx.lineWidth = 2.6; grille();
  } else if (look.head === 'hat') {
    outlined(ctx, () => {
      ctx.moveTo(-R * 0.85, -20); ctx.bezierCurveTo(-R * 0.9, -R * 1.85, R * 0.95, -R * 1.85, R * 0.88, -20); ctx.closePath();
    }, look.capColor, OUT, LW);
    outlined(ctx, () => { ctx.ellipse(2, -19, R * 1.5, 5.5, -0.05, 0, Math.PI * 2); }, look.capColor, OUT, LW);
    ctx.fillStyle = '#2a2f3a'; ctx.fillRect(-R * 0.86, -27, R * 1.73, 5);
  }
  ctx.restore();
}

function paintBat(ctx, s, dark) {
  if (!s.batDir) return;
  const d = s.batDir, top = s.batTop;
  const hEnd = add(top, d, L.handle);
  const tip = add(top, d, L.bat);
  // handle
  outlined(ctx, () => { capsule(ctx, top.x, top.y, hEnd.x, hEnd.y, 4.2, 4.2); }, '#2c2c2c', OUT, LW * 0.7);
  ctx.strokeStyle = '#4e6aa8'; ctx.lineWidth = 2;
  for (let i = 1; i < 5; i++) { const p = add(top, d, i * 8); ctx.beginPath(); ctx.moveTo(p.x - d.y * 4, p.y + d.x * 4); ctx.lineTo(p.x + d.y * 4, p.y - d.x * 4); ctx.stroke(); }
  // blade (shoulders + toe), with back ridge
  const n = { x: -d.y, y: d.x };
  const b0 = add(hEnd, d, -2), b1 = add(tip, d, -4);
  outlined(ctx, () => {
    const p = (q, w) => ({ x: q.x + n.x * w, y: q.y + n.y * w });
    const a1 = p(b0, -6), a2 = p(add(b0, d, 10), -10), a3 = p(b1, -10), a4 = p(b1, 9), a5 = p(add(b0, d, 10), 9), a6 = p(b0, 5);
    ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.lineTo(a3.x, a3.y);
    ctx.quadraticCurveTo(tip.x, tip.y, a4.x, a4.y); ctx.lineTo(a5.x, a5.y); ctx.lineTo(a6.x, a6.y); ctx.closePath();
  }, dark ? '#c99a5b' : '#e3b46e', OUT, LW);
  ctx.strokeStyle = '#c2914f'; ctx.lineWidth = 2;
  const g0 = add(add(b0, d, 14), n, 2), g1 = add(add(b1, d, -6), n, 2);
  ctx.beginPath(); ctx.moveTo(g0.x, g0.y); ctx.lineTo(g1.x, g1.y); ctx.stroke();
  // sticker
  ctx.fillStyle = '#1f3a6e';
  const st = add(add(b0, d, 22), n, -1);
  ctx.save(); ctx.translate(st.x, st.y); ctx.rotate(Math.atan2(d.y, d.x)); ctx.fillRect(0, -5, 18, 8); ctx.restore();
}

// Draw a person. X,Y = world position of ground point; dir = 1 faces right, -1 faces left.
function drawPerson(ctx, X, Y, dir, pose, lookName, S = 1, opts = {}) {
  const look = LOOKS[lookName] || lookName;
  const p = fullPose(pose);
  const s = skeleton(p);
  // ground shadow
  if (!opts.noShadow) {
    const air = clamp((-s.hip.y - 120) / 260, 0, 1);
    const lift = Math.min(p.fF.y, p.fB.y);
    const hx = X + (p.hip.x + (p.rot ? 0 : 0)) * dir * S;
    const spread = Math.abs(p.fF.x - p.fB.x) * 0.5 + 40;
    ctx.fillStyle = `rgba(30,50,20,${0.22 * (1 - clamp((-lift - 8) / 400))})`;
    const gy = opts.groundY ?? Y;
    ctx.beginPath(); ctx.ellipse(hx, gy + 2, (p.rot ? 120 : spread) * S, 11 * S, 0, 0, 7); ctx.fill();
  }
  ctx.save();
  ctx.translate(X, Y); ctx.scale(dir * S, S);
  if (p.rot) { ctx.translate(s.hip.x, s.hip.y); ctx.rotate(p.rot * DEG); ctx.translate(-s.hip.x, -s.hip.y); }
  const glove = look.gloves;
  paintArm(ctx, s.shB, s.armB, look, true, { glove, big: look.bigGloves, finger: false });
  paintLeg(ctx, s.hipB, s.legB, look, true, p.toeB);
  paintLeg(ctx, s.hipF, s.legF, look, false, p.toeF);
  paintTorso(ctx, s, look);
  paintHead(ctx, s, look, p.face);
  if (p.bat && !p.batFront) paintBat(ctx, s);
  if (p.ball === 'B') drawBallLocal(ctx, s.hB.x + 4, s.hB.y - 6);
  paintArm(ctx, s.shF, s.armF, look, false, { glove, big: look.bigGloves, finger: p.finger });
  if (p.bat && p.batFront) paintBat(ctx, s);
  if (p.ball === 'F') drawBallLocal(ctx, s.hF.x + 4, s.hF.y - 8);
  ctx.restore();
  return s;
}

// World position of a local point for a person (no rotation support).
function toWorld(X, Y, dir, S, lp) { return { x: X + lp.x * dir * S, y: Y + lp.y * S }; }

function drawBallLocal(ctx, x, y) {
  outlined(ctx, () => { circlePath(ctx, x, y, 8); }, '#d42a2a', OUT, 2);
  ctx.strokeStyle = '#fbe3c8'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x - 6, y, 8, -0.8, 0.8); ctx.stroke();
}

// ---------- procedural cycles ----------
// Run/walk pose from travelled distance (local forward). opts: {A, lift, lean, hipY, arm}
function cyclePose(dist, o = {}) {
  const A = o.A || 40, lift = o.lift || 34, lean = o.lean ?? 14, hipY = o.hipY ?? -152, armA = o.arm ?? 34;
  const ph = dist / (4 * A);
  const foot = (u) => {
    u = ((u % 1) + 1) % 1;
    if (u < 0.5) return { x: A - 4 * A * u, y: -8 };
    const s = (u - 0.5) / 0.5;
    return { x: -A + 2 * A * Ease.inOut(s), y: -8 - lift * Math.sin(Math.PI * s) };
  };
  const fF = foot(ph), fB = foot(ph + 0.5);
  const bob = Math.cos(ph * 4 * Math.PI) * (o.bob ?? 5);
  const sw = Math.cos(ph * 2 * Math.PI);
  const shY = hipY - 92;
  return {
    hip: { x: o.hipX ?? 4, y: hipY + bob }, lean, head: -lean * 0.6,
    fF: { x: fF.x + 6, y: fF.y }, fB: { x: fB.x + 6, y: fB.y },
    hF: { x: 18 - sw * armA, y: shY + 92 - Math.abs(sw) * 14 }, hB: { x: 18 + sw * armA, y: shY + 92 - Math.abs(sw) * 14 },
    eF: 1, eB: 1,
    toeF: fF.y < -10 ? 15 : 0, toeB: fB.y < -10 ? 15 : 0,
  };
}

// ---------- front view (for the outro shrug) ----------
function drawPersonFront(ctx, X, Y, pose, lookName, S = 1) {
  const look = LOOKS[lookName];
  const p = mix({ hipY: -162, hL: { x: -40, y: -150 }, hR: { x: 40, y: -150 }, tilt: 0, face: { mouth: 'smile', brow: 0, eye: 'open' }, shrug: 0 }, pose, 1);
  ctx.fillStyle = 'rgba(30,50,20,0.22)'; ctx.beginPath(); ctx.ellipse(X, Y + 2, 60 * S, 11 * S, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(X, Y); ctx.scale(S, S);
  const hipY = p.hipY, shY = hipY - L.torso + 12 - p.shrug;
  // legs
  for (const sx of [-1, 1]) {
    const hp = { x: sx * 14, y: hipY + 6 }, ft = { x: sx * 20, y: -8 };
    const kn = { x: sx * 17, y: lerp(hp.y, ft.y, 0.5) };
    outlined(ctx, () => { capsule(ctx, hp.x, hp.y, kn.x, kn.y, 15, 12); capsule(ctx, kn.x, kn.y, ft.x, ft.y, 12, 9.5); }, look.trousers, OUT, LW);
    if (look.pads) {
      outlined(ctx, () => { capsule(ctx, kn.x, kn.y - 14, ft.x, ft.y - 6, 16, 14); }, '#fff', OUT, LW);
      ctx.strokeStyle = '#cfd3da'; ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(kn.x + i * 6, kn.y); ctx.lineTo(ft.x + i * 6, ft.y - 10); ctx.stroke(); }
    }
    outlined(ctx, () => { rrect(ctx, ft.x - 12 + sx * 4, ft.y - 4, 24, 13, 6); }, look.shoes, OUT, LW);
  }
  // torso
  outlined(ctx, () => { rrect(ctx, -24, hipY - 18, 48, 34, 14); }, look.trousers, OUT, LW);
  outlined(ctx, () => {
    ctx.moveTo(-34, shY + 6); ctx.quadraticCurveTo(-36, shY - 6, -22, shY - 8); ctx.lineTo(22, shY - 8); ctx.quadraticCurveTo(36, shY - 6, 34, shY + 6);
    ctx.lineTo(27, hipY - 4); ctx.quadraticCurveTo(0, hipY + 4, -27, hipY - 4); ctx.closePath();
  }, look.shirt, OUT, LW);
  ctx.fillStyle = look.accent; ctx.fillRect(-27, hipY - 30, 54, 5);
  ctx.fillStyle = shade(look.shirt, 0.7); ctx.beginPath(); ctx.moveTo(-10, shY - 8); ctx.lineTo(0, shY + 8); ctx.lineTo(10, shY - 8); ctx.fill();
  ctx.font = font(900, 26, F_TITLE); ctx.textAlign = 'center'; ctx.fillStyle = look.accent; ctx.fillText('G', 0, shY + 46);
  // arms
  for (const [sx, h] of [[-1, p.hL], [1, p.hR]]) {
    const sh = { x: sx * 28, y: shY };
    const a = ik(sh, h, L.upper, L.fore, sx > 0 ? -1 : 1);
    outlined(ctx, () => { capsule(ctx, sh.x, sh.y, a.j.x, a.j.y, 11.5, 9.5); capsule(ctx, a.j.x, a.j.y, a.end.x, a.end.y, 9.5, 7.5); }, look.shirt, OUT, LW);
    outlined(ctx, () => { circlePath(ctx, a.end.x, a.end.y, 9); }, look.skin, OUT, LW);
  }
  // neck/head
  const hc = { x: 0, y: shY - 40 };
  outlined(ctx, () => { capsule(ctx, 0, shY, 0, hc.y + 10, 10, 10); }, shade(look.skin, 0.9), OUT, LW);
  ctx.save(); ctx.translate(hc.x, hc.y); ctx.rotate(p.tilt * DEG);
  const R = L.headR;
  outlined(ctx, () => {
    ctx.ellipse(0, 0, R * 0.92, R * 1.05, 0, 0, 7);
    ctx.moveTo(-R + 2 + 7, 2); ctx.ellipse(-R + 2, 2, 7, 9, 0, 0, 7);
    ctx.moveTo(R - 2 + 7, 2); ctx.ellipse(R - 2, 2, 7, 9, 0, 0, 7);
  }, look.skin, OUT, LW);
  ctx.fillStyle = 'rgba(230,110,100,0.22)';
  ctx.beginPath(); ctx.ellipse(-13, 10, 6, 4, 0, 0, 7); ctx.ellipse(13, 10, 6, 4, 0, 0, 7); ctx.fill();
  for (const sx of [-1, 1]) {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.ellipse(sx * 9, -2, 5, 6.2, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a1d14'; ctx.beginPath(); ctx.arc(sx * 9, -1, 3, 0, 7); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx * 9 + 1, -2.2, 1, 0, 7); ctx.fill();
    ctx.strokeStyle = shade(look.hair, 0.8); ctx.lineWidth = 3;
    const b = p.face.brow;
    ctx.beginPath(); ctx.moveTo(sx * 4, -10 - b * 3); ctx.lineTo(sx * 14, -11 + b * 2); ctx.stroke();
  }
  ctx.strokeStyle = shade(look.skin, 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(3, 7, -1, 8); ctx.stroke();
  ctx.strokeStyle = OUT; ctx.lineWidth = 2.4; ctx.beginPath();
  if (p.face.mouth === 'flat') { ctx.moveTo(-7, 16); ctx.quadraticCurveTo(0, 18, 8, 14); }
  else { ctx.moveTo(-8, 14); ctx.quadraticCurveTo(0, 20, 8, 14); }
  ctx.stroke();
  // cap (front)
  outlined(ctx, () => { ctx.moveTo(-R, -14); ctx.bezierCurveTo(-R, -R * 1.65, R, -R * 1.65, R, -14); ctx.closePath(); }, look.capColor, OUT, LW);
  outlined(ctx, () => { ctx.ellipse(0, -15, R * 0.98, 5, 0, 0, Math.PI); }, shade(look.capColor, 0.8), OUT, LW);
  ctx.fillStyle = look.accent; ctx.beginPath(); ctx.arc(0, -29, 5, 0, 7); ctx.fill();
  ctx.restore();
  ctx.restore();
}
