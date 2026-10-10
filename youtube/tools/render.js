#!/usr/bin/env node
// Renders a youtube.com page in Chromium with V3 and the module (build.js --check), and screenshots it:
//   V3=/path/to/Vorapis.user.js node tools/render.js <era> <gplexLayout> <url> <out.png> [options]
// Options: --pick=<era> (the hand-picked era setting; default auto), --mock=<saved watch page html> (served
// as the document: V3 fetches the data itself, and youtube.com rate-limits repeated watch loads),
// --settle=<ms> (wait after V3 drew the page; default 4000), --eval=<js> (printed as JSON), --profile=<dir>.
// Needs Playwright (npm install playwright) and a copy of the V3 userscript, which is not distributed here.
"use strict";
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const [era, layout, url, out, ...rest] = process.argv.slice(2);
const opt = { pick: "auto", settle: 4000, profile: path.join(__dirname, "..", "profile") };
rest.forEach(function(a) {
    const m = /^--(\w+)=(.*)$/s.exec(a);
    if (m) {
        opt[m[1]] = m[2];
    }
});
if (!era || !layout || !url || !out || !process.env.V3) {
    console.error("usage: V3=<Vorapis.user.js> node tools/render.js <era> <gplexLayout> <url> <out.png> [--pick=] [--mock=] [--settle=] [--eval=]");
    process.exit(1);
}
const v3 = fs.readFileSync(process.env.V3, "utf8");
const module_ = fs.readFileSync(path.join(__dirname, "..", "gplex-youtube.module.js"), "utf8");
// what the main script gives the module: Gplex's storage, the Trusted Types helper, the page tests
const shim = "(function() {\n" +
    "var store = " + JSON.stringify({ UGF_LAYOUT: layout, UGF_STARTUBE_ON: "true", UGF_ST_layoutPick: opt.pick, UGF_ST_dark: "auto", UGF_V3_NATIVE: "0" }) + ";\n" +
    "window.GM_getValue = function(k, d) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : d; };\n" +
    "window.GM_setValue = function(k, v) { store[k] = v; };\n" +
    "window.GM_deleteValue = function(k) { delete store[k]; };\n" +
    "window.GM_info = { script: { name: 'Gplex Extended', version: 'render' } };\n" +
    "window.ugfOnYouTube = true; window.ugfYtmTakesOver = function() { return false; }; window.ugfYtmPlayerFrame = function() { return false; };\n" +
    "var policy = null; try { policy = window.trustedTypes.createPolicy('gplex-tt', { createHTML: function(s) { return s; } }); } catch (e) {}\n" +
    "window.ugfTT = function(s) { return policy ? policy.createHTML(s) : s; };\n" +
    "})();";
// V3's welcome dialog, marked as seen
const oobe = "(function() { try { var db = JSON.parse(localStorage.getItem('v3_local_db') || 'null') || { config: { db: { yt: {} } } }; var yt = db.config.db.yt; " +
    "if (!yt.NEW_OOBE_INFO || !yt.NEW_OOBE_INFO.welcomePassed) { yt.NEW_OOBE_INFO = { welcomePassed: true }; yt.NEW_OOBE_DEBUGGER_DELEGATION2 = false; localStorage.setItem('v3_local_db', JSON.stringify(db)); } } catch (e) {} })();";
// V3 expects a document element: as an init script it runs before there is one
const v3Wrapped = "(function() { var run = function() {\n" + v3.replace(/<\/script>/g, "<\\/script>") + "\n}; if (document.documentElement) { run(); } else { new MutationObserver(function(m, o) { if (document.documentElement) { o.disconnect(); run(); } }).observe(document, { childList: true }); } })();";

(async function() {
    const ctx = await chromium.launchPersistentContext(opt.profile, {
        headless: true, viewport: { width: 1366, height: 900 }, locale: "en-US",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
    });
    const page = ctx.pages()[0] || await ctx.newPage();
    page.on("pageerror", function(e) {
        console.log("[pageerror]", String(e.stack || e).slice(0, 600));
    });
    page.on("console", function(m) {
        if (/Gplex/.test(m.text())) {
            console.log("[console]", m.text().slice(0, 300));
        }
    });
    for (const content of [oobe, v3Wrapped, shim, module_]) {
        await page.addInitScript({ content: content });
    }
    if (opt.mock) {
        const html = fs.readFileSync(opt.mock, "utf8");
        await page.route(function(u) {
            return u.href.split("#")[0] === url.split("#")[0];
        }, function(route) {
            if (route.request().resourceType() === "document") {
                route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: html });
            } else {
                route.continue();
            }
        });
    }
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 }).catch(function(e) {
        console.log("goto:", e.message);
    });
    // until V3 drew the page in the era (the module reloads once when it changes V3's settings)
    const t0 = Date.now();
    while (Date.now() - t0 < 60000) {
        const ok = await page.evaluate(function(exp) {
            return !!document.querySelector("#page") && document.documentElement.style.display !== "none" && document.documentElement.getAttribute("ly") === exp;
        }, era).catch(function() {
            return false;
        });
        if (ok) {
            break;
        }
        await page.waitForTimeout(500);
    }
    await page.waitForTimeout(Number(opt.settle));
    if (opt.eval) {
        console.log(JSON.stringify(await page.evaluate(opt.eval), null, 1));
    }
    await page.screenshot({ path: out });
    await ctx.close();
})();
