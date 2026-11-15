#!/usr/bin/env python3
"""Build episodes/<ep>/cues.json for the player episodes from the timing markers in captions.js."""
import json, re, sys
ep = sys.argv[1]
src = open(f'episodes/{ep}/captions.js').read()
T = json.loads(re.search(r'const T = (\{.*?\});', src, re.S).group(1))
END = float(re.search(r'NARRATION_END = ([\d.]+)', src).group(1))
fx = []
def a(t, *names):
    for n in names: fx.append([round(t, 3), n])
segs = ['n5', 'n4', 'n3', 'n2', 'n1']
for s in segs:
    a(T[s] - 0.3, 'whoosh'); a(T[s + ('gary')] - 0.05, 'whoosh')
muffle = []
if ep == 'abd':
    a(T['mr360'] + 0.7, 'thud'); a(T['mr360'] + 0.75, 'cheer'); a(T['today'], 'swish'); a(T['wrong'] + 0.1, 'pop')
    tc = T['n5ab'] + 3.15; a(tc, 'bat'); a(tc + 0.1, 'cheer'); a(tc + 1.3, 'thud')
    th = T['n5hit'] + 0.1; a(th, 'block', 'boing', 'ding'); a(th, 'riser', 'hit'); a(T['n5not'], 'groan', 'thud')
    tc = T['n4ab'] + 2.25; a(T['n4ab'] + 0.4, 'swish'); a(tc, 'bat'); a(tc + 0.1, 'cheer'); a(tc + 0.3, 'pop')
    a(T['n4gary'] + 0.4, 'swish'); a(T['n4drop'], 'swish'); a(T['n4drop'] + 0.15, 'ding'); a(T['n4drop'] + 1.1, 'block'); a(T['n4drop'] + 0.9, 'pop')
    tc = T['n3ab'] + 3.05; a(tc, 'bat'); a(tc + 0.1, 'bigcheer'); a(tc + 1.0, 'thud')
    tb = T['n3bowled'] + 0.05; a(T['n3stay'] + 0.3, 'pop'); a(tb, 'stumps', 'riser', 'hit', 'ding'); a(tb + 0.1, 'cheer')
    c = T['n2ab'] + 2.8; a(c, 'catch'); a(c + 0.3, 'bigcheer'); a(T['n2ab'] + 3.5, 'riser', 'hit')
    a(T['n2gary'] + 1.2, 'thud'); a(T['n2miss'] + 0.35, 'block', 'ding'); a(T['n2miss'] + 0.4, 'riser', 'hit'); a(T['n2miss'] + 0.5, 'groan')
    s0, e0 = T['n1'] + 1.0, T['n1six'] + 1.5; per = (e0 - s0) / 31
    a(s0, 'bigcheer')
    for i in range(31): a(s0 + i * per + 0.4 * per, 'bat')
    a(T['n1six'], 'bigcheer'); a(e0, 'riser', 'hit')
    s1, e1 = T['n1gary'] + 0.3, T['n1gary'] + 3.0; p1 = (e1 - s1) / 31
    for i in range(31): a(s1 + i * p1 + 0.5 * p1, 'block')
    a(e1, 'ding'); a(T['n1mark'] + 0.25, 'bat'); a(T['n1mark'] + 1.0, 'cheer', 'pop')
    a(T['yes'] + 0.1, 'pop'); a(T['no'] - 0.1, 'whoosh'); a(T['no'] + 0.7, 'riser', 'hit', 'groan')
    sections = [[0, 'intro'], [T['n5'] - 0.5, 'full'], [T['outro'] - 0.3, 'outro']]
else:
    a(T['king'], 'thud', 'cheer'); a(T['studied'], 'swish'); a(T['see'] + 0.2, 'pop')
    tc, tf = T['n5vk'] + 0.15, T['n5vk'] + 1.95
    a(tc, 'bat', 'riser'); a(tc + 0.02, 'hit'); muffle.append([tc, tf]); a(tf + 0.2, 'cheer'); a(tf + 1.4, 'thud')
    ts = T['n5fall'] + 0.5; a(ts, 'thud', 'stumps', 'ding'); a(ts + 0.05, 'riser', 'hit')
    s0, per = T['n4vk'] - 0.4, 1.25
    for i in range(5): a(s0 + i * per + 0.6 * per, 'bat'); a(s0 + i * per + 0.7 * per, 'cheer') if i == 4 else None
    tb = T['n4panic'] + 1.35; a(tb - 0.1, 'swish'); a(tb, 'stumps', 'riser', 'hit', 'ding'); a(tb + 0.1, 'cheer')
    tc = T['n3vk'] + 2.2; muffle.append([tc - 0.6, tc + 0.6]); a(tc, 'bat', 'riser', 'hit'); a(tc + 0.15, 'bigcheer'); a(tc + 0.9, 'thud')
    tf = T['n3fall'] + 0.25; a(tf, 'thud', 'stumps', 'ding'); a(tf + 0.1, 'cheer'); a(T['n3hw'], 'riser', 'hit')
    a(T['n2gary'] + 2.1, 'pop'); a(T['n2rest'], 'boing'); a(T['n2rest'] + 0.3, 'ding')
    a(T['n1name'], 'bigcheer', 'riser'); a(T['n1name'] + 0.02, 'hit'); a(T['n1vk'] + 4.8, 'whoosh'); a(T['n1vk'] + 5.8, 'cheer')
    a(T['n1gary'] + 0.4, 'cheer'); a(T['n1career'], 'whoosh'); a(T['n1career'] + 0.3, 'ding', 'groan')
    a(T['work'], 'swish'); a(T['tomorrow'] - 0.1, 'whoosh'); a(T['tomorrow'] + 0.2, 'pop')
    sections = [[0, 'intro'], [T['n5'] - 0.5, 'full'], [T['outro'] - 0.3, 'full'], [T['tomorrow'] - 0.2, 'outro']]
json.dump({'duration': END, 'sections': sections, 'muffle': muffle, 'sfx': fx}, open(f'episodes/{ep}/cues.json', 'w'), indent=1)
print(ep, len(fx), 'cues, duration', END)
