#!/usr/bin/env node
// Builds Gplex Extended for YouTube into the alpha: alpha.user.js (the main script with its YouTube part
// swapped for this one) and, unless --no-packages, the alpha's Chrome and Firefox packages in
// releases/alpha/.
//   node youtube/build.js [--check] [--no-packages]
// --check only assembles the module (youtube/gplex-youtube.module.js, for the test harness) and
// syntax-checks it.
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const ROOT = path.join(HERE, "..");
const MAIN = path.join(ROOT, "Gplex_-_Old_Google_Frontend.user.js");
const ALPHA = path.join(ROOT, "alpha.user.js");
const VERSION = "9.0.0.21";
const args = process.argv.slice(2);
const read = function(p) {
    return fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
};
const listed = function(dir, ext) {
    return fs.readdirSync(dir).filter(function(f) {
        return f.endsWith(ext);
    }).sort();
};
const MIME = { png: "image/png", gif: "image/gif", svg: "image/svg+xml", jpg: "image/jpeg", webp: "image/webp" };
const dataUri = function(p) {
    return "data:" + MIME[path.extname(p).slice(1).toLowerCase()] + ";base64," + fs.readFileSync(p).toString("base64");
};
// indentation and line breaks out (nothing inside a value or a selector is touched)
const packCss = function(css) {
    return css.replace(/\n\s*/g, "");
};

// ---- the stylesheet: blocks under /* @eras ... */ markers, in cascade order
const ALL_ERAS = /^\s*(\w+):\s*\{\s*family:/gm;
const coreText = read(path.join(HERE, "src", "10-core.js"));
const eraIds = [];
let m;
while ((m = ALL_ERAS.exec(coreText))) {
    eraIds.push(m[1]);
}
const sheet = read(path.join(HERE, "css", "startube.css"));
const blocks = sheet.split("/* @eras ").slice(1).map(function(part) {
    const i = part.indexOf(" */");
    const eras = part.slice(0, i).trim();
    const css = packCss(part.slice(i + 3).trim());
    (eras === "all" ? eraIds : eras.split(" ")).forEach(function(e) {
        if (eraIds.indexOf(e) < 0) {
            throw new Error("unknown era in @eras: " + e);
        }
    });
    return { eras: eras === "all" ? eraIds.join(" ") : eras, css: css };
});
const pictures = {};
listed(path.join(HERE, "assets", "pictures"), "").forEach(function(f) {
    pictures["--st-pic-" + f.replace(/\.\w+$/, "")] = dataUri(path.join(HERE, "assets", "pictures", f));
});
blocks.forEach(function(b) {
    (b.css.match(/var\(--st-pic-[\w-]+\)/g) || []).forEach(function(v) {
        if (!pictures[v.slice(4, -1)]) {
            throw new Error("no picture for " + v);
        }
    });
});
const extra = {};
listed(path.join(HERE, "css", "extra"), ".css").forEach(function(f) {
    extra[f.replace(/\.css$/, "")] = packCss(read(path.join(HERE, "css", "extra", f)).replace(/^\/\*[\s\S]*?\*\/\n/, ""));
});

// ---- the module: src/10-90 inside ugfStarTube(), src/99 (the launcher) after it
const srcDir = path.join(HERE, "src");
const inside = listed(srcDir, ".js").filter(function(f) {
    return !f.startsWith("99-");
}).map(function(f) {
    return read(path.join(srcDir, f));
});
const launcher = read(path.join(srcDir, "99-launcher.js"));
const wrapped = [
    "// ---- Gplex Extended for YouTube ----",
    "// The YouTube part of Gplex, on the V3 extension (Vorapis 2013), which draws youtube.com as it was in",
    "// 2013: this moves it to the look of the year of your Gplex layout, 2007 to 2022. Descended from",
    "// StarTube " + "2.7.0.10 by lightbeam24 (MIT license, https://github.com/lightbeam24/StarTube), rewritten.",
    "// Source: youtube/ in the repository; this is its build.",
    "function ugfStarTube() {",
    "\"use strict\";",
    "const ST_CSS = " + JSON.stringify(blocks) + ";",
    "const ST_PICTURES = " + JSON.stringify(pictures) + ";",
    "const ST_EXTRA_CSS = " + JSON.stringify(extra) + ";",
    inside.join("\n"),
    "}",
    launcher,
    "// ---- end Gplex Extended for YouTube ----"
].join("\n");
try {
    new Function("ugfOnYouTube", "ugfYtmTakesOver", "ugfYtmPlayerFrame", "ugfTT", "GM_getValue", "GM_setValue", "GM_deleteValue", "GM_info", wrapped);
} catch (e) {
    console.error("the module does not parse:", e.message);
    process.exit(1);
}
const kb = function(n) {
    return (n / 1024).toFixed(0) + " KB";
};
console.log("module: " + inside.length + " files, " + kb(inside.join("").length) + " code; stylesheet " + blocks.length + " blocks, " +
    kb(blocks.reduce(function(n, b) { return n + b.css.length; }, 0)) + "; " + Object.keys(pictures).length + " pictures, " + kb(JSON.stringify(pictures).length));
if (args.includes("--check")) {
    fs.writeFileSync(path.join(HERE, "gplex-youtube.module.js"), wrapped);
    process.exit(0);
}

// ---- alpha.user.js: the main script, with StarTube swapped for this
let main = read(MAIN);
const between = function(s, startMarker, endMarker, replacement) {
    const a = s.indexOf(startMarker);
    const b = s.indexOf(endMarker, a);
    if (a < 0 || b < 0) {
        throw new Error("marker not found: " + (a < 0 ? startMarker : endMarker));
    }
    return s.slice(0, a) + replacement + s.slice(b + endMarker.length);
};
const once = function(s, from, to) {
    const n = typeof from === "string" ? s.split(from).length - 1 : (s.match(new RegExp(from.source, from.flags + "g")) || []).length;
    if (n !== 1) {
        throw new Error("expected one occurrence, found " + n + ": " + String(from).slice(0, 70));
    }
    return s.replace(from, to);
};
// the header
main = once(main, "// @name         Gplex Extended - Fixed and extended version of the legendary Gplex Old Google script", "// @name         Gplex Extended Alpha - Gplex Old Google with its YouTube part rewritten");
main = once(main, /^\/\/ @version\s+\S+$/m, "// @version      " + VERSION);
main = once(main, /^(\/\/ @description\s+.*?), plus YouTube \(.*\)$/m, "$1, plus YouTube (Gplex Extended for YouTube, rewritten: alpha, with the V3 extension)");
main = once(main, /^\/\/ @downloadURL .*$/m, "// @downloadURL https://raw.githubusercontent.com/Ziptino9098/Gplex-Fixed/main/alpha.user.js");
main = once(main, /^\/\/ @updateURL .*$/m, "// @updateURL https://raw.githubusercontent.com/Ziptino9098/Gplex-Fixed/main/alpha.user.js");
// StarTube out, this in (the mobile YouTube part after it stays)
main = between(main, "// ---- Gplex Extended for YouTube: StarTube 2.7.0.10 by lightbeam24", "// ---- end StarTube ----", wrapped);
// the settings page: StarTube's settings window becomes two choices (its on/off section stays)
main = once(main, /\n\s*if \(typeof ugfStarTubeApi !== "undefined" && ugfStarTubeApi\.applyMaster\) \{\n\s*ugfStarTubeApi\.applyMaster\(\);\n\s*\}/, "");
main = once(main, /\n\s*if \(typeof ugfStarTube === "function" && document\.getElementById\("ugf-yt-st-host"\)[^\n]*\n\s*ugfStarTube\("settings"\);(\n[^\n]*){8}\n\s*\}/, "");
main = between(main, "<div class=\"ugf-gplex-section\" id=\"ugf-yt-settings\"", "<div class=\"ugf-gplex-section\" style=\"display: none\">",
    read(path.join(HERE, "tools", "settings-section.html")).trim() + "\n                        <div class=\"ugf-gplex-section\" style=\"display: none\">");
main = once(main, "\"finon\", \"startubeon\", \"ytclassicon\"]", "\"finon\", \"startubeon\", \"ytlayout\", \"ytdark\", \"ytclassicon\"]");
main = once(main, "[\"startubeon\", \"UGF_STARTUBE_ON\"], [\"ytclassicon\", \"UGF_YT_CLASSIC_ON\"]]", "[\"startubeon\", \"UGF_STARTUBE_ON\"], [\"ytlayout\", \"UGF_ST_layoutPick\"], [\"ytdark\", \"UGF_ST_dark\"], [\"ytclassicon\", \"UGF_YT_CLASSIC_ON\"]]");
main = once(main, "    let startubeOn = \"true\";", "    let startubeOn = \"true\";\n    let ytLayout = \"auto\";\n    let ytDark = \"auto\";");
main = once(main, "html:not([startubeon-dd-open]) #ugf-startubeon-dd,\nhtml:not([startubeon-dd-open]) #ugf-startubeon-fence,", "html:not([startubeon-dd-open]) #ugf-startubeon-dd,\nhtml:not([startubeon-dd-open]) #ugf-startubeon-fence,\nhtml:not([ytlayout-dd-open]) #ugf-ytlayout-dd,\nhtml:not([ytlayout-dd-open]) #ugf-ytlayout-fence,\nhtml:not([ytdark-dd-open]) #ugf-ytdark-dd,\nhtml:not([ytdark-dd-open]) #ugf-ytdark-fence,");
main = once(main, "            <div id=\"ugf-startubeon-fence\" class=\"ugf-fence\">\n            </div>", "            <div id=\"ugf-startubeon-fence\" class=\"ugf-fence\">\n            </div>\n            <div id=\"ugf-ytlayout-fence\" class=\"ugf-fence\">\n            </div>\n            <div id=\"ugf-ytdark-fence\" class=\"ugf-fence\">\n            </div>");
main = once(main, "                            } else if (o[0] === \"startubeon\") {\n                                startubeOn = value;\n", "                            } else if (o[0] === \"startubeon\") {\n                                startubeOn = value;\n                            } else if (o[0] === \"ytlayout\") {\n                                ytLayout = value;\n                            } else if (o[0] === \"ytdark\") {\n                                ytDark = value;\n");
main = once(main, "startubeOn = String((typeof GM_getValue === \"function\" ? GM_getValue(\"UGF_STARTUBE_ON\", null) : null) || \"true\");", "startubeOn = String((typeof GM_getValue === \"function\" ? GM_getValue(\"UGF_STARTUBE_ON\", null) : null) || \"true\");\n        ytLayout = String((typeof GM_getValue === \"function\" ? GM_getValue(\"UGF_ST_layoutPick\", null) : null) || \"auto\");\n        ytDark = String((typeof GM_getValue === \"function\" ? GM_getValue(\"UGF_ST_dark\", null) : null) || \"auto\");");
// the two dropdowns show the wording of the chosen item
main = once(main, "        if (setting == \"startubeon\" || setting == \"all\") {\n", "        [[\"ytlayout\", ytLayout], [\"ytdark\", ytDark]].forEach(function(o) {\n            if (setting == o[0] || setting == \"all\") {\n                const item = document.querySelector(\"#ugf-option-\" + o[0] + \" .ugf-dropdown-item[value=\\\"\" + o[1] + \"\\\"] span\");\n                const btn = document.querySelector(\"#ugf-option-\" + o[0] + \" .ugf-dropdown-button span\");\n                if (item && btn) {\n                    btn.textContent = item.textContent;\n                }\n            }\n        });\n        if (setting == \"startubeon\" || setting == \"all\") {\n");
main = main.replace(/\r?\n/g, "\r\n");
fs.writeFileSync(ALPHA, main);
try {
    new Function(main);
} catch (e) {
    console.error("alpha.user.js does not parse:", e.message);
    process.exit(1);
}
console.log("alpha.user.js: " + (main.length / 1048576).toFixed(2) + " MB, version " + VERSION);
if (args.includes("--no-packages")) {
    process.exit(0);
}
// ---- the packages
const out = path.join(ROOT, "releases", "alpha");
fs.mkdirSync(out, { recursive: true });
const base = "gplex-extended-alpha-" + VERSION;
const env = Object.assign({}, process.env, { GPLEX_ALPHA: "1" });
execFileSync("node", [path.join(ROOT, "build", "build-chrome.js"), ALPHA, path.join(out, base + "-chrome.zip"), path.join(out, base + "-chrome-unpacked")], { stdio: "inherit", env: env });
execFileSync("node", [path.join(ROOT, "build", "build-firefox.js"), ALPHA, path.join(out, base + "-firefox.xpi")], { stdio: "inherit", env: env });
console.log("packages in releases/alpha/");
