const { chromium } = require('playwright');
const fs = require('fs'); fs.mkdirSync(__dirname + '/out', { recursive: true });
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 512, height: 512 } });
  await pg.goto('file://' + require('path').resolve(__dirname, '../www/index.html'));
  await pg.evaluate(() => {
    document.body.innerHTML = `<div style="width:512px;height:512px;border-radius:112px;overflow:hidden;position:relative;background:radial-gradient(circle at 30% 25%,#ffe066,#ff9f1c 55%,#f15bb5 100%)">
      <div style="position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 60%,rgba(255,255,255,.18) 0 12deg,transparent 12deg 24deg)"></div>
      <div style="position:absolute;left:66px;top:96px;width:380px">${monsterSVG('')}</div>
      <div style="position:absolute;left:0;right:0;top:22px;text-align:center;font:700 92px Fredoka;color:#fff;-webkit-text-stroke:14px #2b2d42;paint-order:stroke fill">1+2</div></div>`;
    document.body.style.background = 'transparent'; document.documentElement.style.background = 'transparent';
  });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: __dirname + '/out/icon512.png', omitBackground: true, clip: { x: 0, y: 0, width: 512, height: 512 } });
  await b.close();
})();
