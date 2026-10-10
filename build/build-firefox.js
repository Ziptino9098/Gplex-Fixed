#!/usr/bin/env node
// Builds the Gplex Extended Firefox add-on from the userscript:
//   node build-firefox.js main.user.js gplex-extended-firefox.xpi
// Needs Node 14+ and acorn (npm install acorn), which finds where the script can be split: the
// add-on site doesn't read JavaScript files over 5 MB, so Gplex goes in as a few files. The .xpi it makes is unsigned: load it in about:debugging
// ("Load Temporary Add-on"), install it in Firefox ESR / Developer Edition / Nightly with
// xpinstall.signatures.required set to false, or upload it to addons.mozilla.org to have it signed.
//
// The add-on runs the userscript unchanged, after gm-api.js (firefox/), which gives it the userscript
// functions it uses (GM_getValue, GM_setValue, GM_xmlhttpRequest, GM_registerMenuCommand, GM_info,
// unsafeWindow), and after pdf.js, which the userscript loads with @require. The background page
// keeps the settings and registers the scripts for the pages the userscript's @match lines name.
"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const acorn = require("acorn");

const [, , input, output] = process.argv;
if (!input || !output) {
    console.error("usage: node build-firefox.js main.user.js gplex-extended-firefox.xpi");
    process.exit(1);
}
const DIR = path.join(__dirname, "firefox");
const ALPHA = process.env.GPLEX_ALPHA === "1";    // the alpha build: its own add-on id, next to the main one
const ADDON_ID = ALPHA ? "gplex-extended-alpha@gplexextended.com" : "gplex-extended@gplexextended.com";
let src = fs.readFileSync(input, "utf8").replace(/\r\n/g, "\n");

// ---- the userscript header
const end = src.indexOf("// ==/UserScript==");
if (end < 0) {
    throw new Error("no userscript header");
}
const header = src.slice(0, end);
let body = src.slice(end + "// ==/UserScript==".length);
// (Gplex 7.2.4+) the add-on gives Gplex GM_getValue and the rest itself, so the userscript's wrapper for
// managers with only GM.getValue (async-gm.js) comes off
{
    const a = body.indexOf("// ugf-async-gm >>>"), b = body.indexOf("// <<< ugf-async-gm"), z = body.lastIndexOf("}); // ugf-async-gm end");
    if (a > -1) {
        if (b < a || z < b) {
            throw new Error("ugf-async-gm wrapper markers out of order");
        }
        body = body.slice(0, a) + body.slice(body.indexOf("\n", b) + 1, z) + body.slice(z + "}); // ugf-async-gm end".length);
    }
}
const meta = function(tag) {
    const out = [];
    const re = new RegExp("^//\\s*@" + tag + "\\s+(.+?)\\s*$", "gm");
    let m;
    while ((m = re.exec(header))) {
        out.push(m[1]);
    }
    return out;
};
const version = meta("version")[0];
if (!/^\d+(\.\d+){0,3}$/.test(version || "")) {
    throw new Error("version " + version + " can't be an add-on version");
}
// a match pattern Firefox accepts (hosts may only start with "*.")
const validPattern = function(p) {
    return /^(\*|https?|wss?|file|ftp):\/\/(\*|\*\.[^*\/:]+|[^*\/:]+)(:\d+)?\/.*$/.test(p);
};
const matches = [];
meta("match").forEach(function(p) {
    if (!validPattern(p)) {
        throw new Error("@match " + p + " is not a pattern Firefox accepts");
    }
    if (matches.indexOf(p) < 0) {
        matches.push(p);
    }
});
const excludeMatches = [];
const excludeGlobs = [];
meta("exclude").forEach(function(p) {
    (validPattern(p) ? excludeMatches : excludeGlobs).push(p);
});
// the hosts GM_xmlhttpRequest may reach: @connect, and the sites Gplex runs on
const connect = [];
meta("connect").concat(matches.map(function(p) {
    return p.replace(/^[^:]+:\/\//, "").replace(/[:\/].*$/, "").replace(/^\*\.?/, "");
})).forEach(function(h) {
    if (h && connect.indexOf(h) < 0) {
        connect.push(h);
    }
});
const hostPermissions = [];
matches.concat(meta("connect").map(function(h) {
    return "*://" + h + "/*";
})).forEach(function(p) {
    if (hostPermissions.indexOf(p) < 0) {
        hostPermissions.push(p);
    }
});
// @require: only pdf.js is expected; it is packed in the add-on (the add-on site allows no code from outside)
const vendor = [];
meta("require").forEach(function(u) {
    const f = path.basename(u.split("?")[0]);
    if (!fs.existsSync(path.join(DIR, "vendor", f))) {
        throw new Error("@require " + u + ": put a copy of " + f + " in firefox/vendor/");
    }
    vendor.push("vendor/" + f);
});

// ---- the userscript body
// StarTube reads and writes what the V3 extension keeps on the page's elements (el.data). Firefox shows
// content scripts the page through Xray wrappers, which hide that, so for StarTube an element's "data"
// is the page's own (and what StarTube puts there is copied into the page, where V3 reads it). Its
// event listeners stay on the add-on's side, where the page's events can reach them.
// (the alpha has Gplex YouTube instead of StarTube, and needs none of this)
if (body.indexOf("function ugfStarTube(ugfMode) {\n") >= 0) {
    const fn = "function ugfStarTube(ugfMode) {\n";
    body = body.replace(fn, fn + "if (globalThis.window.wrappedJSObject && typeof cloneInto === \"function\") {\n" +
        "    try {\n" +
        "        Object.defineProperty(HTMLElement.prototype, \"data\", { configurable: true,\n" +
        "            get: function() { const w = this.wrappedJSObject; return w ? w.data : undefined; },\n" +
        "            set: function(v) { const w = this.wrappedJSObject; if (w) { w.data = v && typeof v === \"object\" ? cloneInto(v, globalThis.window, { cloneFunctions: true }) : v; } } });\n" +
        "    } catch (e) {}\n" +
        "}\n");
    const ytOld = "if (window.wrappedJSObject) {\n    window.yt ||= window.wrappedJSObject.yt;\n}\n";
    if (body.indexOf(ytOld) < 0) {
        throw new Error("StarTube's yt setup not found (Gplex changed?)");
    }
    body = body.replace(ytOld, "if (globalThis.window.wrappedJSObject) {\n    try {\n        Object.defineProperty(globalThis, \"yt\", { configurable: true, " +
        "get: function() { return globalThis.window.wrappedJSObject.yt; } });\n    } catch (e) {}\n}\n");
}
// ---- split into files of at most 4.5 MB, between top-level statements. The add-on's scripts in a page
// share one global scope, so what one part declares, the next can use, as in the single file.
const MAX_PART = 4.5 * 1024 * 1024;
const ast = acorn.parse(body, { ecmaVersion: "latest", sourceType: "script", allowReturnOutsideFunction: false });
const bodyParts = [];
let partStart = 0, lastEnd = 0;
ast.body.forEach(function(n, i) {
    const next = i + 1 < ast.body.length ? ast.body[i + 1].start : body.length;
    if (n.end - n.start > MAX_PART) {
        throw new Error("one statement is " + ((n.end - n.start) / 1048576).toFixed(1) + " MB, more than a part can hold");
    }
    if (next - partStart > MAX_PART && lastEnd > partStart) {
        bodyParts.push(body.slice(partStart, lastEnd));
        partStart = lastEnd;
    }
    lastEnd = next;
});
bodyParts.push(body.slice(partStart));
const gplexFiles = bodyParts.map(function(t, i) {
    return bodyParts.length === 1 ? "gplex.js" : "gplex-" + (i + 1) + ".js";
});

// ---- the add-on's files
const files = {};
const put = function(name, data) {
    files[name] = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
};
const manifest = {
    manifest_version: 2,
    name: ALPHA ? "Gplex Extended Alpha" : "Gplex Extended",
    version: version,
    description: ALPHA ? "The old look, 1997 to 2024, for Google Search, Gmail, Maps, Docs and more, plus YouTube drawn by Gplex itself (alpha)." : "The old look, 1997 to 2024, for Google Search, Gmail, Maps, Docs and more, plus YouTube with the V3 extension.",
    author: (meta("author")[0] || "Ziptino9098, lightbeam24"),
    homepage_url: "https://gplexextended.com/",
    icons: { "16": "icons/icon-16.png", "32": "icons/icon-32.png", "48": "icons/icon-48.png", "96": "icons/icon-96.png" },
    // (nothing is collected: the add-on talks only to the Google services Gplex restyles)
    browser_specific_settings: { gecko: { id: ADDON_ID, strict_min_version: "115.0", data_collection_permissions: { required: ["none"] } } },
    background: { scripts: ["background.js"] },
    browser_action: {
        default_title: "Gplex Extended",
        default_popup: "popup.html",
        default_icon: { "16": "icons/icon-16.png", "32": "icons/icon-32.png" }
    },
    permissions: ["storage", "webRequest", "webRequestBlocking"].concat(hostPermissions)
};
put("manifest.json", JSON.stringify(manifest, null, 2) + "\n");
const scripts = ["gm-api.js"].concat(vendor, gplexFiles);
put("background.js", "// (made by build-firefox.js from the userscript's header)\nconst GPLEX = " + JSON.stringify({
    matches: matches, excludeMatches: excludeMatches, excludeGlobs: excludeGlobs, connect: connect, files: scripts
}, null, 1) + ";\n\n" + fs.readFileSync(path.join(DIR, "background.js"), "utf8"));
put("gm-api.js", fs.readFileSync(path.join(DIR, "gm-api.js")));
vendor.forEach(function(f) {
    put(f, fs.readFileSync(path.join(DIR, f)));
});
if (vendor.length && fs.existsSync(path.join(DIR, "vendor", "pdfjs-LICENSE.txt"))) {
    put("vendor/pdfjs-LICENSE.txt", fs.readFileSync(path.join(DIR, "vendor", "pdfjs-LICENSE.txt")));
}
bodyParts.forEach(function(t, i) {
    put(gplexFiles[i], "// Gplex Extended " + version + ", part " + (i + 1) + " of " + bodyParts.length + " (from the userscript)\n" + t + "\n");
});
put("popup.html", fs.readFileSync(path.join(DIR, "popup.html")));
put("popup.js", fs.readFileSync(path.join(DIR, "popup.js")));
fs.readdirSync(path.join(DIR, "icons")).forEach(function(f) {
    put("icons/" + f, fs.readFileSync(path.join(DIR, "icons", f)));
});
put("LICENSE.txt", "Gplex Extended - MIT license (Ziptino9098, lightbeam24).\n" +
    "Includes StarTube by lightbeam24 (MIT license, https://github.com/lightbeam24/StarTube)\n" +
    "and PDF.js by Mozilla (Apache License 2.0, see vendor/pdfjs-LICENSE.txt).\n");

// ---- the .xpi (a zip file)
const CRC = (function() {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
        }
        t[n] = c >>> 0;
    }
    return t;
})();
const crc32 = function(buf) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
};
const parts = [];
const central = [];
let offset = 0;
// (fixed date: the same userscript always gives the same .xpi)
const DOS_TIME = 0, DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
Object.keys(files).sort(function(a, b) {
    return a === "manifest.json" ? -1 : b === "manifest.json" ? 1 : a < b ? -1 : a > b ? 1 : 0;
}).forEach(function(name) {
    const data = files[name];
    const comp = zlib.deflateRawSync(data, { level: 9 });
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    parts.push(local, nameBuf, comp);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(8, 10);
    cen.writeUInt16LE(DOS_TIME, 12);
    cen.writeUInt16LE(DOS_DATE, 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(comp.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, nameBuf);
    offset += local.length + nameBuf.length + comp.length;
});
const cenSize = central.reduce(function(n, b) {
    return n + b.length;
}, 0);
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0);
eocd.writeUInt16LE(Object.keys(files).length, 8);
eocd.writeUInt16LE(Object.keys(files).length, 10);
eocd.writeUInt32LE(cenSize, 12);
eocd.writeUInt32LE(offset, 16);
fs.writeFileSync(output, Buffer.concat(parts.concat(central, [eocd])));
console.log("Gplex Extended " + version + " add-on -> " + output + " (" + (fs.statSync(output).size / 1048576).toFixed(1) +
    " MB, " + Object.keys(files).length + " files, " + matches.length + " page patterns)");
