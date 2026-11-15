// Core helpers: math, easing, keyframe tracks, drawing utilities.
'use strict';

const W = 1920, H = 1080;
const GY = 838;            // ground line (feet) in pitch scenes
const DEG = Math.PI / 180;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (a, b, t) => clamp((t - a) / (b - a)); // 0..1 progress of t in [a,b]

const Ease = {
  lin: k => k,
  in: k => k * k,
  out: k => 1 - (1 - k) * (1 - k),
  out3: k => 1 - Math.pow(1 - k, 3),
  in3: k => k * k * k,
  inOut: k => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2),
  inOut3: k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  back: k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
  elastic: k => (k === 0 || k === 1) ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * (2 * Math.PI / 3)) + 1,
  bounce: k => {
    const n1 = 7.5625, d1 = 2.75;
    if (k < 1 / d1) return n1 * k * k;
    if (k < 2 / d1) return n1 * (k -= 1.5 / d1) * k + 0.75;
    if (k < 2.5 / d1) return n1 * (k -= 2.25 / d1) * k + 0.9375;
    return n1 * (k -= 2.625 / d1) * k + 0.984375;
  },
};

// Mix numbers / objects / strings.
function mix(a, b, k) {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * k;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const o = Array.isArray(a) ? [] : {};
    for (const key in a) o[key] = key in b ? mix(a[key], b[key], k) : a[key];
    for (const key in b) if (!(key in a)) o[key] = b[key];
    return o;
  }
  if (a === undefined || a === null) return b;
  if (b === undefined || b === null) return a;
  return k < 0.5 ? a : b;
}

// Keyframe track: keys = [[time, value, easeName?], ...]; ease applies to segment ending at that key.
function track(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) {
      const [t0, v0] = keys[i - 1];
      const [t1, v1, e] = keys[i];
      const k = (Ease[e || 'inOut'])((t - t0) / (t1 - t0));
      return mix(v0, v1, k);
    }
  }
  return keys[keys.length - 1][1];
}

// Seeded random
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- drawing utils ----------
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Tapered capsule path segment (adds to current path).
function capsule(ctx, ax, ay, bx, by, ra, rb) {
  const ang = Math.atan2(by - ay, bx - ax);
  const d = Math.hypot(bx - ax, by - ay);
  // tangent correction for unequal radii
  const s = d > 0.001 ? clamp((ra - rb) / d, -0.99, 0.99) : 0;
  const off = Math.acos(s);
  ctx.moveTo(ax + Math.cos(ang + off) * ra, ay + Math.sin(ang + off) * ra);
  ctx.arc(ax, ay, ra, ang + off, ang - off + Math.PI * 2, false);
  ctx.arc(bx, by, rb, ang - off, ang + off, false);
  ctx.closePath();
}

function circlePath(ctx, x, y, r) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); }

// Fill a path (built by fn) with an outline that merges overlapping parts.
function outlined(ctx, build, fill, line, lw) {
  ctx.beginPath(); build();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = line; ctx.lineWidth = lw * 2; ctx.stroke();
  ctx.fillStyle = fill; ctx.fill();
}

function shade(hex, f) {
  // f < 1 darker, > 1 lighter
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  let r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  if (f < 1) { r *= f; g *= f; b *= f; }
  else { r = r + (255 - r) * (f - 1); g = g + (255 - g) * (f - 1); b = b + (255 - b) * (f - 1); }
  const h = v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b);
}

function font(weight, size, family) { return `${weight} ${size}px ${family}`; }
const F_TITLE = "'Fira Sans Condensed'";
const F_CAP = "'Baloo 2'";
const F_HAND = "'Patrick Hand'";
const F_MARK = "'Permanent Marker'";

function textOutlined(ctx, str, x, y, fill, line, lw) {
  ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  if (lw > 0) { ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.strokeText(str, x, y); }
  ctx.fillStyle = fill; ctx.fillText(str, x, y);
}

// Pop-in scale for an element visible in [t0, t1]
function popScale(t, t0, t1, dur = 0.35, outDur = 0.2) {
  if (t < t0 || t > t1) return 0;
  const a = Ease.back(prog(t0, t0 + dur, t));
  const b = 1 - Ease.in(prog(t1 - outDur, t1, t));
  return Math.max(0, a * b);
}
