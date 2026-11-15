#!/usr/bin/env python3
"""Procedural cricket-vibe soundtrack: music bed + stadium crowd + SFX, mixed under a narration.

usage: python3 tools/soundtrack.py episodes/<ep>/cues.json <narration audio> <out.m4a>
cues.json: {"duration": s, "sections": [[t, "intro"|"full"|"lite"|"tense"|"outro"], ...],
            "muffle": [[t0, t1], ...], "sfx": [[t, "bat"|"stumps"|"bails"|"catch"|"whoosh"|"thud"|"pop"|"ding"|"swish"|"cheer"|"bigcheer"|"groan"], ...]}
"""
import json, subprocess, sys, os
import numpy as np

SR = 48000
rng = np.random.default_rng(3)

def env_adsr(n, a, d, s, r, sr=SR):
    a, d, r = int(a * sr), int(d * sr), int(r * sr)
    e = np.ones(n) * s
    e[:a] = np.linspace(0, 1, a, endpoint=False) if a else e[:a]
    e[a:a + d] = np.linspace(1, s, max(0, min(d, n - a)), endpoint=False)[: max(0, min(d, n - a))]
    if r and n > r: e[-r:] *= np.linspace(1, 0, r)
    return e

def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); z = 0.0
    # vectorised via lfilter-free recursion in chunks (numpy only)
    for i in range(len(x)):
        z = (1 - a) * x[i] + a * z; y[i] = z
    return y

def lp(x, fc):  # fast FFT brick-ish lowpass
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x))

def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (f / hi) ** 4)) * (1 / (1 + (lo / np.maximum(f, 1)) ** 4))
    return np.fft.irfft(X, len(x))

def midi(m): return 440 * 2 ** ((m - 69) / 12)

# ---------------- instruments ----------------
def pluck(freq, dur, bright=0.5):
    n = int(dur * SR); p = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, p) * 0.8
    out = np.empty(n)
    idx = 0
    for i in range(n):
        out[i] = buf[idx]
        nxt = (idx + 1) % p
        buf[idx] = 0.5 * (buf[idx] + buf[nxt]) * (0.996 - 0.004 * (1 - bright))
        idx = nxt
    return out * np.linspace(1, 0.6, n)

PLUCK_CACHE = {}
def pluck_c(m, dur):
    k = (m, round(dur, 3))
    if k not in PLUCK_CACHE: PLUCK_CACHE[k] = pluck(midi(m), dur)
    return PLUCK_CACHE[k]

def bass(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(m)
    w = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    return w * env_adsr(n, 0.005, 0.12, 0.55, 0.05) * 0.9

def trumpet(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = midi(m)
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * t) * np.clip(t * 3, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    saw = sum(np.sin(k * ph) / k * (0.85 ** k) for k in range(1, 12))
    e = env_adsr(n, 0.04, 0.1, 0.75, 0.08)
    return lp(saw * e, 2600) * 0.5

def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)

def clap():
    n = int(0.25 * SR); t = np.arange(n) / SR
    x = rng.normal(0, 1, n) * (np.exp(-t * 25) + 0.5 * np.exp(-np.maximum(t - 0.012, 0) * 30) * (t > 0.012))
    return bp(x, 900, 5000) * 0.6

def shaker():
    n = int(0.07 * SR); t = np.arange(n) / SR
    return bp(rng.normal(0, 1, n), 5000, 12000) * np.exp(-t * 60) * 0.25

def tabla(m=62):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = midi(m) * (1 + 0.25 * np.exp(-t * 18))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 0.55

def place(buf, x, t, g=1.0):
    i = int(t * SR)
    if i >= len(buf) or i + len(x) <= 0: return
    j0 = max(0, -i); i = max(0, i); j1 = min(len(x), len(buf) - i + j0)
    buf[i:i + j1 - j0] += x[j0:j1] * g

# ---------------- music ----------------
def powerchord(m, dur):
    """Overdriven saw power chord (root + fifth + octave)."""
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for mm, g in [(m, 1), (m + 7, 0.8), (m + 12, 0.6)]:
        f = midi(mm)
        for det in (-0.004, 0.004):
            ph = 2 * np.pi * f * (1 + det) * t
            x += g * sum(np.sin(k * ph) / k for k in range(1, 9))
    x = np.tanh(x * 0.9) * env_adsr(n, 0.004, 0.15, 0.7, 0.06)
    return lp(x, 3200) * 0.35

def snare():
    n = int(0.3 * SR); t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
    return (bp(rng.normal(0, 1, n), 1500, 9000) * np.exp(-t * 18) * 0.8 + body * 0.6) * 0.7

def hat(open_=False):
    n = int((0.25 if open_ else 0.05) * SR); t = np.arange(n) / SR
    return bp(rng.normal(0, 1, n), 7000, 16000) * np.exp(-t * (12 if open_ else 80)) * 0.3

def crash():
    n = int(2.0 * SR); t = np.arange(n) / SR
    return bp(rng.normal(0, 1, n), 3000, 15000) * np.exp(-t * 2.2) * 0.35

def music(dur, sections):
    bpm = 140; beat = 60 / bpm; bar = 4 * beat
    out = np.zeros((2, int((dur + 3) * SR)))
    L, R = out
    prog = [(55, [67, 71, 74]), (62, [66, 69, 74]), (52, [67, 71, 76]), (60, [67, 72, 76])]  # G D Em C
    hook = [(0, 79, 1), (1, 83, 1), (2, 86, 1.5), (3.5, 83, .5), (4, 84, 1), (5, 88, 1), (6, 86, 2),
            (8, 83, 1), (9, 86, 1), (10, 91, 1.5), (11.5, 90, .5), (12, 88, 1), (13, 84, 1), (14, 86, 2)]
    S = [(st, mm) for st, mm in sections]
    def mode_at(t):
        m = S[0][1]
        for st, mm in S:
            if t >= st: m = mm
        return m
    starts = [st for st, _ in S[1:]]
    both = lambda x, t, g, w=0.0: (place(L, x, t, g), place(R, x, t + w, g))
    nbars = int(dur / bar) + 1
    PC = {}
    for b in range(nbars):
        t0 = b * bar
        mode = mode_at(t0 + 0.01)
        root, chord = prog[b % 4]
        nxt_change = any(t0 + bar <= st < t0 + 2 * bar for st in starts)
        if mode == 'tense':  # pulsing heartbeat tension
            for k in range(16):
                both(bass(root - 12, beat * 0.22), t0 + k * beat / 4, 0.42 if k % 4 == 0 else 0.25)
                place(L if k % 2 else R, hat(), t0 + k * beat / 4, 0.5)
            for k in (0, 1.75, 2.5): both(kick(), t0 + k * beat, 0.6)
            if b % 2 == 1:  # tension riser over two bars
                n = int(bar * SR); tt = np.arange(n) / SR
                r = bp(rng.normal(0, 1, n), 800, 6000) * (tt / bar) ** 2 * 0.25
                both(r, t0, 1)
            continue
        lite = mode in ('intro', 'lite', 'outro')
        # driving 8th-note pluck riff
        pat = [0, 2, 1, 2, 0, 2, 1, 2]
        for k in range(8):
            x = pluck_c(chord[pat[k]] + 12, beat * 0.8)
            place(L, x, t0 + k * beat / 2, 0.3); place(R, x, t0 + k * beat / 2 + 0.008, 0.22)
        # pumping offbeat octave bass
        for k in range(8):
            m = root - 12 if k % 2 == 0 else root
            both(bass(m, beat * 0.42), t0 + k * beat / 2, 0.5 if not lite else 0.35)
        # drums: four-on-the-floor kick, backbeat snare, 16th hats
        for k in range(4):
            both(kick(), t0 + k * beat, 0.75 if not lite else 0.5)
            if k % 2 == 1: both(snare(), t0 + k * beat, 0.7 if not lite else 0.45, 0.004)
        for k in range(16):
            place(L if k % 2 else R, hat(open_=(k % 4 == 2 and not lite)), t0 + k * beat / 4, (0.7 if k % 2 else 0.45) * (0.6 if lite else 1))
        if b % 4 == 0 and not lite: both(crash(), t0, 0.9)
        if not lite:
            # power-chord stabs on the off-beats
            if root not in PC: PC[root] = powerchord(root - 12, beat * 0.45)
            for bt in (0, 1.5, 3):
                both(PC[root], t0 + bt * beat, 0.55, 0.01)
            # tabla flourish
            if b % 2 == 1:
                for bt, m in [(3.0, 62), (3.25, 67), (3.5, 60), (3.75, 64)]: both(tabla(m), t0 + bt * beat, 0.4)
        # stadium-trumpet hook through every full phrase
        if mode in ('full', 'hype'):
            ph = (b % 4) * 4
            for st, m, d in hook:
                if ph <= st < ph + 4:
                    x = trumpet(m, d * beat * 0.95)
                    place(L, x, t0 + (st - ph) * beat, 0.34); place(R, x, t0 + (st - ph) * beat + 0.012, 0.3)
        # snare roll fill into the next section change
        if nxt_change:
            for k in range(16):
                both(snare(), t0 + 3 * beat + k * beat / 16 * 4 / 4, 0.2 + 0.5 * k / 16)
    # big ending: chord + crash
    end = dur - 2.4
    for m in [43, 55, 62, 67, 71]:
        x = pluck_c(m + 12, 2.5); both(x, end, 0.35)
    both(powerchord(43, 2.0), end, 0.6); both(crash(), end, 1.0); both(kick(), end, 1.0)
    return out[:, :int(dur * SR)]

# ---------------- crowd + sfx ----------------
def noise(n): return rng.normal(0, 1, n)

def crowd_bed(dur):
    n = int(dur * SR)
    x = bp(noise(n), 250, 2500)
    t = np.arange(n) / SR
    mod = 0.7 + 0.2 * np.sin(2 * np.pi * 0.07 * t) + 0.1 * np.sin(2 * np.pi * 0.23 * t + 1)
    y = bp(noise(n), 250, 2500)
    return np.stack([x * mod, y * mod]) * 0.035

def cheer(big=False):
    d = 5.5 if big else 3.6; n = int(d * SR); t = np.arange(n) / SR
    e = np.clip(t / 0.18, 0, 1) * np.exp(-np.maximum(t - 0.4, 0) / (1.6 if big else 1.1))
    voice = bp(noise(n), 400, 3500) * (1 + 0.3 * np.sin(2 * np.pi * 3 * t))
    claps = np.zeros(n)
    for _ in range(int(d * (900 if big else 600))):
        i = rng.integers(0, n - 2000); k = clap()[:1500] * rng.uniform(0.2, 1)
        claps[i:i + 1500] += k
    x = (voice * 0.5 + bp(claps, 800, 6000) * 0.12) * e
    return x * (0.7 if big else 0.5)

def groan():
    n = int(2.2 * SR); t = np.arange(n) / SR
    e = np.clip(t / 0.3, 0, 1) * np.exp(-t / 1.0)
    return bp(noise(n), 150, 900) * e * 0.4

def wood(f=1300, decay=40, g=1.0):
    n = int(0.25 * SR); t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.7 * t)) * np.exp(-t * decay)
    x += bp(noise(n), 1500, 8000) * np.exp(-t * 160) * 0.6
    return x * g

def sfx(name):
    if name == 'bat': return wood(1150, 38, 0.9)
    if name == 'block': return wood(900, 50, 0.6)
    if name == 'stumps':
        out = np.zeros(int(0.8 * SR))
        for k, f in enumerate([1600, 1900, 1400, 2100, 1700]):
            place(out, wood(f, 30, 0.7 / (1 + k * 0.3)), 0.03 * k + rng.uniform(0, 0.03))
        return out
    if name == 'bails':
        out = np.zeros(int(0.5 * SR)); place(out, wood(2400, 45, 0.6), 0); place(out, wood(2800, 50, 0.4), 0.06); return out
    if name == 'catch':
        n = int(0.2 * SR); t = np.arange(n) / SR
        return (bp(noise(n), 200, 1800) * np.exp(-t * 45) + np.sin(2 * np.pi * 140 * t) * np.exp(-t * 30)) * 0.8
    if name == 'whoosh':
        n = int(0.6 * SR); t = np.arange(n) / SR
        x = noise(n) * np.sin(np.pi * t / 0.6) ** 2
        return bp(x, 600, 5000) * 0.35
    if name == 'swish':
        n = int(0.3 * SR); t = np.arange(n) / SR
        return bp(noise(n), 1500, 7000) * np.sin(np.pi * t / 0.3) ** 3 * 0.35
    if name == 'thud':
        n = int(0.5 * SR); t = np.arange(n) / SR
        f = 70 + 60 * np.exp(-t * 20)
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) + bp(noise(n), 100, 900) * np.exp(-t * 30) * 0.5) * 0.8
    if name == 'pop':
        n = int(0.15 * SR); t = np.arange(n) / SR
        f = 500 + 900 * t / 0.15
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 25) * 0.3
    if name == 'ding':
        n = int(0.9 * SR); t = np.arange(n) / SR
        return (np.sin(2 * np.pi * 1318 * t) + 0.4 * np.sin(2 * np.pi * 2636 * t)) * np.exp(-t * 5) * 0.22
    if name == 'riser':  # 1.6 s build that peaks at the cue time (placed early in main)
        n = int(1.6 * SR); t = np.arange(n) / SR
        x = bp(noise(n), 600, 9000) * (t / 1.6) ** 2.5
        f = 200 + 1400 * (t / 1.6) ** 2
        x += np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / 1.6) ** 2 * 0.3
        return x * 0.5
    if name == 'hit':  # cinematic impact
        n = int(2.2 * SR); t = np.arange(n) / SR
        f = 45 + 80 * np.exp(-t * 12)
        sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.5)
        return (sub * 0.9 + bp(noise(n), 200, 6000) * np.exp(-t * 10) * 0.6 + np.pad(crash(), (0, max(0, n - int(2.0 * SR))))[:n] * 0.6) * 0.8
    if name == 'cheer': return cheer(False)
    if name == 'bigcheer': return cheer(True)
    if name == 'groan': return groan()
    if name == 'boing':
        n = int(0.5 * SR); t = np.arange(n) / SR
        f = 180 + 120 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 4)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * 0.4
    raise ValueError(name)

def main():
    cues_path, narr, out = sys.argv[1:4]
    cues = json.load(open(cues_path))
    dur = cues['duration']
    mus = music(dur, cues['sections'])
    # muffle music (slow-mo / replay moments)
    for a, b in cues.get('muffle', []):
        i0, i1 = int(a * SR), int(b * SR)
        for ch in range(2):
            seg = mus[ch, i0:i1]
            m = lp(seg, 700)
            fade = np.ones(len(seg)); f = min(int(0.25 * SR), len(seg) // 2)
            fade[:f] = np.linspace(0, 1, f); fade[-f:] = np.linspace(1, 0, f)
            mus[ch, i0:i1] = seg * (1 - fade) + m * fade
    n = mus.shape[1]
    t = np.arange(n) / SR
    mus *= np.clip(t / 1.0, 0, 1) * np.clip((dur - t) / 0.6, 0, 1)
    amb = crowd_bed(dur)[:, :n]
    fx = np.zeros((2, n))
    for tt, name in cues['sfx']:
        if name == 'riser': tt -= 1.6
        x = sfx(name)
        if name in ('cheer', 'bigcheer', 'groan'):
            y = sfx(name); place(fx[0], x, tt); place(fx[1], y, tt + 0.01)
        else:
            place(fx[0], x, tt, 0.9); place(fx[1], x, tt, 0.9)
    tmp = os.path.join(os.path.dirname(os.path.abspath(out)), '.st_tmp'); os.makedirs(tmp, exist_ok=True)
    def wav(path, x):
        x = np.clip(x, -1, 1); pcm = (x.T * 32767).astype('<i2')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', path], input=pcm.tobytes(), check=True)
    peak = np.abs(mus).max() or 1
    wav(f'{tmp}/music.wav', mus / peak * 0.9)
    wav(f'{tmp}/bed.wav', amb + fx)
    # music ducked under narration; voice on top
    fc = ('[0:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=1.0,asplit=2[v][sc];'
          '[1:a]volume=1.12[m];'
          '[m][sc]sidechaincompress=threshold=0.06:ratio=3.5:attack=60:release=500:makeup=1[md];'
          '[2:a]volume=1.0[fx];'
          '[v][md][fx]amix=inputs=3:duration=longest:normalize=0,alimiter=limit=0.88,volume=0.78[o]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', narr, '-i', f'{tmp}/music.wav', '-i', f'{tmp}/bed.wav',
                    '-filter_complex', fc, '-map', '[o]', '-t', str(dur), '-c:a', 'aac', '-b:a', '192k', out], check=True)
    print('wrote', out)

if __name__ == '__main__':
    main()
