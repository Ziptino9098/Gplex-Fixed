#!/usr/bin/env node
// Builds Gplex Extended for Chrome (and Edge, Opera, Brave) from the userscript:
//   node build-chrome.js main.user.js gplex-extended-chrome.zip [folder]
// The .zip is what the Chrome Web Store takes; the folder (if named) is the same files unpacked, for
// chrome://extensions > Developer mode > "Load unpacked". Needs Node 14+ and nothing else.
//
// A Manifest V3 extension. Gplex runs unchanged in the page ("main world", Chrome 111+), wrapped in
// chrome/gm-head.js and gm-tail.js, which give it the userscript functions (GM_getValue, GM_setValue,
// GM_xmlhttpRequest, GM_registerMenuCommand, GM_info, unsafeWindow), and after pdf.js (its @require
// files). chrome/relay.js, on the extension's side of the same pages, keeps the settings in the
// extension's storage and passes the requests to chrome/sw.js, the service worker, which makes them.
"use strict";
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const [, , input, output, folder] = process.argv;
if (!input || !output) {
    console.error("usage: node build-chrome.js main.user.js gplex-extended-chrome.zip [folder]");
    process.exit(1);
}
const DIR = path.join(__dirname, "chrome");
const FF = path.join(__dirname, "firefox");     // (the icons and pdf.js are shared with the Firefox add-on)
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
    throw new Error("version " + version + " can't be an extension version");
}
const validPattern = function(p) {
    return /^(\*|https?|wss?|file|ftp):\/\/(\*|\*\.[^*\/:]+|[^*\/:]+)(:\d+)?\/.*$/.test(p);
};
const matches = [];
meta("match").forEach(function(p) {
    if (!validPattern(p)) {
        throw new Error("@match " + p + " is not a pattern Chrome accepts");
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
// @require: packed in the extension (the Chrome Web Store allows no code from outside)
const requires = meta("require").map(function(u) {
    const f = path.basename(u.split("?")[0]);
    if (!fs.existsSync(path.join(FF, "vendor", f))) {
        throw new Error("@require " + u + ": put a copy of " + f + " in firefox/vendor/");
    }
    return fs.readFileSync(path.join(FF, "vendor", f), "utf8");
});

// ---- the extension's files
const files = {};
const put = function(name, data) {
    files[name] = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
};
const description = process.env.GPLEX_ALPHA === "1" ? "Google and YouTube in their old look, with Gplex's own YouTube (alpha): pick any year from 1997 to 2024. An unofficial fan project." : "Google and YouTube in their old look: pick any year from 1997 to 2024. An unofficial fan project.";
const manifest = {
    manifest_version: 3,
    name: process.env.GPLEX_ALPHA === "1" ? "Gplex Extended Alpha" : "Gplex Extended",
    version: version,
    description: description,
    author: (meta("author")[0] || "Ziptino9098, lightbeam24"),
    homepage_url: "https://gplexextended.com/",
    minimum_chrome_version: "111",
    icons: { "16": "icons/icon-16.png", "32": "icons/icon-32.png", "48": "icons/icon-48.png", "128": "icons/icon-128.png" },
    background: { service_worker: "sw.js" },
    action: {
        default_title: "Gplex Extended",
        default_popup: "popup.html",
        default_icon: { "16": "icons/icon-16.png", "32": "icons/icon-32.png" }
    },
    permissions: ["storage"],
    host_permissions: hostPermissions,
    content_scripts: [
        // the extension's side first, so it is listening when Gplex hands it the channel
        { matches: matches, exclude_matches: excludeMatches.length ? excludeMatches : undefined,
            exclude_globs: excludeGlobs.length ? excludeGlobs : undefined,
            js: ["relay.js"], run_at: "document_start", all_frames: true },
        { matches: matches, exclude_matches: excludeMatches.length ? excludeMatches : undefined,
            exclude_globs: excludeGlobs.length ? excludeGlobs : undefined,
            js: ["gplex.js"], run_at: "document_start", all_frames: true, world: "MAIN" }
    ]
};
put("manifest.json", JSON.stringify(manifest, null, 2) + "\n");
put("relay.js", fs.readFileSync(path.join(DIR, "relay.js")));
put("sw.js", "// (made by build-chrome.js from the userscript's header)\nconst GPLEX = " + JSON.stringify({ connect: connect }, null, 1) + ";\n\n" +
    fs.readFileSync(path.join(DIR, "sw.js"), "utf8"));
const info = { name: manifest.name, version: version, description: description };
// (Chrome won't load a script with a Unicode "noncharacter" in it, U+FFFE, U+FFFF or U+FDD0-FDEF, which
// can only be in a string or a regular expression: those are written as \u escapes, which mean the same)
const escNonchars = function(t) {
    return t.replace(/[\uFDD0-\uFDEF\uFFFE\uFFFF]/g, function(c) {
        return "\\u" + c.charCodeAt(0).toString(16);
    });
};
put("gplex.js", escNonchars("// Gplex Extended " + version + " for Chrome: the userscript, with its @require files, run in the page\n" +
    fs.readFileSync(path.join(DIR, "gm-head.js"), "utf8").replace("__GPLEX_INFO__", JSON.stringify(info)) +
    requires.map(function(t) {
        return "\n" + t + "\n;\n";
    }).join("") + body + "\n" + fs.readFileSync(path.join(DIR, "gm-tail.js"), "utf8")));
put("popup.html", fs.readFileSync(path.join(DIR, "popup.html")));
put("popup.js", fs.readFileSync(path.join(DIR, "popup.js")));
["icon-16.png", "icon-32.png", "icon-48.png"].forEach(function(f) {
    put("icons/" + f, fs.readFileSync(path.join(FF, "icons", f)));
});
put("icons/icon-128.png", fs.readFileSync(path.join(DIR, "icon-128.png")));
put("LICENSE.txt", "Gplex Extended - MIT license (Ziptino9098, lightbeam24).\n" +
    "Includes StarTube by lightbeam24 (MIT license, https://github.com/lightbeam24/StarTube)\n" +
    "and PDF.js by Mozilla (Apache License 2.0, see pdfjs-LICENSE.txt).\n");
if (fs.existsSync(path.join(FF, "vendor", "pdfjs-LICENSE.txt"))) {
    put("pdfjs-LICENSE.txt", fs.readFileSync(path.join(FF, "vendor", "pdfjs-LICENSE.txt")));
}

// ---- the .zip (for the Chrome Web Store, and unpacked into a folder for "Load unpacked")
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
if (folder) {
    fs.rmSync(folder, { recursive: true, force: true });
    Object.keys(files).forEach(function(name) {
        const f = path.join(folder, name);
        fs.mkdirSync(path.dirname(f), { recursive: true });
        fs.writeFileSync(f, files[name]);
    });
}
console.log("Gplex Extended " + version + " for Chrome -> " + output + (folder ? " and " + folder + "/" : "") + " (" + (fs.statSync(output).size / 1048576).toFixed(1) +
    " MB, " + Object.keys(files).length + " files, " + matches.length + " page patterns)");
