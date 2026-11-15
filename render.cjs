// Render the full video: node render.cjs [--fps 60] [--workers 4] [--out output/gary-best-wickets.mp4] [--from 0 --to 114.25]
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path'), fs = require('fs');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +arg('fps', 60), WORKERS = +arg('workers', 4);
const OUT = path.resolve(arg('out', 'output/gary-best-wickets.mp4'));
const FROM = +arg('from', 0), TO = +arg('to', 114.25);
const TMP = path.resolve('output/.parts');
fs.mkdirSync(TMP, { recursive: true });

async function worker(id, f0, f1) {
  const part = path.join(TMP, `part_${String(id).padStart(2, '0')}.mp4`);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), part], { stdio: ['pipe', 'inherit', 'inherit'] });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log(`[w${id}] ERR`, e.message));
  await p.goto('file://' + path.resolve(__dirname, 'index.html') + '?render');
  await p.evaluate(() => window.ready);
  const canvas = p.locator('canvas');
  for (let f = f0; f < f1; f++) {
    await p.evaluate(t => renderFrame(t), f / FPS);
    const buf = await canvas.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) console.log(`[w${id}] ${f - f0}/${f1 - f0}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  return part;
}

(async () => {
  const t0 = Date.now();
  const F0 = Math.round(FROM * FPS), F1 = Math.round(TO * FPS), n = F1 - F0;
  const per = Math.ceil(n / WORKERS);
  const parts = await Promise.all(Array.from({ length: WORKERS }, (_, i) => worker(i, F0 + i * per, Math.min(F1, F0 + (i + 1) * per))));
  const list = path.join(TMP, 'list.txt');
  fs.writeFileSync(list, parts.map(p => `file '${p}'`).join('\n'));
  const audio = path.resolve(__dirname, 'audio', 'narration.m4a');
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-ss', String(FROM), '-t', String(TO - FROM), '-i', audio,
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
  console.log(`done: ${OUT} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
})();
