// node tools/thumb.cjs <frame.png> <out.png> "<line1>" "<line2>" "<tag>"
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const [, , img, out, l1, l2, tag, sx = '1110', sy = '600'] = process.argv;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const u = 'file://' + path.resolve(__dirname, 'thumb.html') + '?' + new URLSearchParams({ img: 'file://' + path.resolve(img), l1, l2, tag, sx, sy });
  await p.goto(u); await p.waitForFunction(() => window.done); await p.evaluate(() => window.done);
  await p.locator('canvas').screenshot({ path: out }); await b.close();
})();
