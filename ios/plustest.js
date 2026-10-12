// The Gplex+ cut on the live Gplex+ site, the way the app will have it: the cookie gplex_theme set, the
// page's head given the <script src="/app/..."> tag the patched server adds, the content security policy
// opened to the site's own scripts as the patched server does, the cut served at that address.
// usage: node plustest.js <cut.js> <theme> <out.png> [url]
const fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const [cut, theme, out, url] = process.argv.slice(2);
  const src = fs.readFileSync(cut, 'utf8');
  const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const context = await browser.newContext({ viewport: { width: 1100, height: 900 }, locale: 'en-US',
    userAgent: process.env.GPLEX_UA || undefined });
  if (theme) {
    await context.addCookies([{ name: 'gplex_theme', value: theme, domain: 'plus.gplexextended.com', path: '/', secure: true, expires: Math.floor(Date.now() / 1000) + 86400 }]);
  }
  // GPLEX_LIVE=1: nothing stands in; the live site itself must serve the tag and the cut (by the User-Agent)
  if (!process.env.GPLEX_LIVE) await context.route(/^https:\/\/plus\.gplexextended\.com\//, async route => {
    if (/\/app\/gplex-plus\.js/.test(route.request().url())) {
      return route.fulfill({ status: 200, contentType: 'text/javascript; charset=utf-8', body: src });
    }
    const r = await route.fetch();
    const ct = r.headers()['content-type'] || '';
    if (!/text\/html/.test(ct)) {
      return route.fulfill({ response: r });
    }
    const headers = Object.assign({}, r.headers());
    if (process.env.GPLEX_ALL) { console.log('  csp was: ' + headers['content-security-policy']); }
    headers['content-security-policy'] = (headers['content-security-policy'] || '').replace("script-src 'none'", "script-src 'self'");
    delete headers['content-length'];
    delete headers['content-encoding'];
    const body = (await r.text()).replace('</head>', '<script src="/app/gplex-plus.js"></script></head>');
    return route.fulfill({ status: r.status(), headers, body });
  });
  const page = await context.newPage();
  const logs = [];
  page.on('console', m => { if (process.env.GPLEX_ALL || /rror|Gplex|Refused/.test(m.text())) logs.push(m.type() + ': ' + m.text().slice(0, 300)); });
  page.on('pageerror', e => logs.push('pageerror: ' + String(e.stack || e).slice(0, 500)));
  await page.goto(url || 'https://plus.gplexextended.com/', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out, fullPage: false });
  const st = await page.evaluate(() => ({ era: document.documentElement.getAttribute('gplex-plus'), scripts: document.scripts.length, title: document.title }));
  console.log(JSON.stringify(st));
  logs.slice(0, 10).forEach(l => console.log('  ' + l));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
