// Loads a page of youtube.com in Chromium with the built script, the way a userscript manager would at
// document-start, and screenshots it. The GM functions are stubbed with an in-memory store.
// usage: node render.js <script> <url> <era> <out.png> [settingsJSON]
//   env: GPLEX_MOCK=file (serve this saved HTML as the page), GPLEX_EVAL (JavaScript to run before the screenshot), GPLEX_CLIP (x,y,w,h), GPLEX_FULL=1,
//        GPLEX_FAKE_EMBED=path (serves this HTML for /embed/* so the control bar can be tested)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
(async () => {
    const [script, url, era, out, extra] = process.argv.slice(2);
    const store = Object.assign({ UGF_LAYOUT: "2015", UGF_YT_LAYOUT: era || "auto" }, extra ? JSON.parse(extra) : {});
    const src = fs.readFileSync(script, "utf8");
    const browser = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ["--autoplay-policy=no-user-gesture-required"] });
    const context = await browser.newContext({ viewport: { width: Number(process.env.GPLEX_WIDTH) || 1366, height: Number(process.env.GPLEX_HEIGHT) || 900 }, locale: "en-US", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" });
    await context.addInitScript(({ store }) => {
        const s = store;
        window.GM_getValue = (k, d) => (k in s ? s[k] : d);
        window.GM_setValue = (k, v) => { s[k] = v; };
        window.GM_deleteValue = (k) => { delete s[k]; };
        window.GM_listValues = () => Object.keys(s);
        window.GM_registerMenuCommand = () => {};
        window.GM_info = { script: { version: "test" } };
        window.unsafeWindow = window;
        window.GM_xmlhttpRequest = (o) => { fetch(o.url, { method: o.method || "GET" }).then(r => r.text().then(t => o.onload && o.onload({ status: r.status, responseText: t, response: t }))).catch(e => o.onerror && o.onerror(e)); };
        window.GM = { getValue: async (k, d) => window.GM_getValue(k, d), setValue: async (k, v) => window.GM_setValue(k, v), deleteValue: async (k) => window.GM_deleteValue(k), listValues: async () => window.GM_listValues() };
    }, { store });
    await context.addInitScript({ content: "(function(){ if (location.pathname.startsWith('/embed/')) return; var run = function(){\n" + src + "\n}; if (document.documentElement) { run(); } else { var mo = new MutationObserver(function(){ if (document.documentElement) { mo.disconnect(); run(); } }); mo.observe(document, { childList: true }); } })();" });
    if (process.env.GPLEX_MOCK) {
        // the page's own HTML from a saved copy (youtube.com challenges a browser from here on some pages)
        const html = fs.readFileSync(process.env.GPLEX_MOCK, "utf8");
        await context.route(url, route => route.request().resourceType() === "document" ? route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: html }) : route.continue());
    }
    if (process.env.GPLEX_FAKE_EMBED) {
        const fake = fs.readFileSync(process.env.GPLEX_FAKE_EMBED, "utf8");
        await context.route(/https:\/\/www\.youtube\.com\/embed\/.*/, route => route.fulfill({ status: 200, contentType: "text/html", body: fake }));
    }
    const page = await context.newPage();
    const logs = [];
    page.on("console", m => { const t = m.text(); if (!/swiftshader|GroupMarker/.test(t)) logs.push(m.type() + ": " + t.slice(0, 300)); });
    page.on("pageerror", e => logs.push("pageerror: " + String(e.stack || e).slice(0, 900)));
    page.on("response", r => { if (r.status() >= 400 && !/ytimg|ggpht|gstatic/.test(r.url())) logs.push("http " + r.status() + " " + r.request().resourceType() + " " + r.url().slice(0, 110)); });
    page.on("requestfailed", r => { if (/youtube\.com\/(youtubei|embed)/.test(r.url())) logs.push("requestfailed: " + r.url().slice(0, 120) + " " + (r.failure() || {}).errorText); });
    await page.goto(url, { waitUntil: "load", timeout: 90000 }).catch(e => logs.push("goto: " + e.message.slice(0, 200)));
    await page.waitForFunction(() => document.documentElement.hasAttribute("gplex-yt") || document.querySelector(".gy-error"), null, { timeout: 25000 }).catch(() => logs.push("no gplex page within 25s"));
    await page.waitForTimeout(Number(process.env.GPLEX_WAIT) || 2500);
    if (process.env.GPLEX_EVAL) {
        await page.evaluate(process.env.GPLEX_EVAL).catch(e => logs.push("eval: " + e.message));
        await page.waitForTimeout(800);
    }
    if (process.env.GPLEX_CLIP) {
        const c = process.env.GPLEX_CLIP.split(",").map(Number);
        await page.screenshot({ path: out, clip: { x: c[0], y: c[1], width: c[2], height: c[3] } });
    } else {
        await page.screenshot({ path: out, fullPage: !!process.env.GPLEX_FULL });
    }
    const state = await page.evaluate(() => ({ title: document.title, era: document.documentElement.getAttribute("gplex-yt"), body: document.body.className.slice(0, 80), lockups: document.querySelectorAll(".yt-lockup").length, guide: document.querySelectorAll(".guide-item").length, scripts: Array.from(document.scripts).filter(s => s.type !== "text/plain" && !s.hasAttribute("data-gplex")).length, errorPage: !!document.querySelector(".gy-error"), player: !!document.getElementById("gy-embed") }));
    console.log(JSON.stringify(state));
    logs.slice(0, 20).forEach(l => console.log("  " + l));
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
