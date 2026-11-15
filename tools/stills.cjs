// Render stills at given times: node tools/stills.cjs <outdir> <t1> <t2> ...
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [, , out, ...times] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('file://' + path.resolve(__dirname, '..', 'index.html') + '?render');
  await p.evaluate(() => window.ready);
  for (const t of times) {
    await p.evaluate(t => renderFrame(+t), t);
    await p.locator('canvas').screenshot({ path: `${out}/s_${(+t).toFixed(2).padStart(6, '0')}.png` });
  }
  await b.close();
})();
