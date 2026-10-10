#!/usr/bin/env node
// Builds Gplex YouTube into the alpha: alpha.user.js (Gplex Extended with StarTube swapped for Gplex
// YouTube) and, unless --no-packages, the alpha's Chrome and Firefox packages in releases/alpha/.
//   node youtube/build.js [--check] [--no-packages]
// --check only assembles and syntax-checks the module.
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { prune, tokensOf } = require("./tools/css-prune.js");

const HERE = __dirname;
const ROOT = path.join(HERE, "..");
const MAIN = path.join(ROOT, "Gplex_-_Old_Google_Frontend.user.js");
const ALPHA = path.join(ROOT, "alpha.user.js");
const VERSION = "9.0.0.1";
const args = process.argv.slice(2);
const read = function(p) {
    return fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
};
const dataUri = function(p) {
    const ext = path.extname(p).slice(1).toLowerCase();
    const mime = { png: "image/png", gif: "image/gif", svg: "image/svg+xml", jpg: "image/jpeg" }[ext] || "application/octet-stream";
    return "data:" + mime + ";base64," + fs.readFileSync(p).toString("base64");
};
const listed = function(dir, ext) {
    return fs.readdirSync(dir).filter(function(f) { return f.endsWith(ext); }).sort();
};

// ---- the module
const srcDir = path.join(HERE, "src");
const sources = listed(srcDir, ".js").map(function(f) { return read(path.join(srcDir, f)); });
const moduleText = sources.join("\n");

// ---- stylesheets and pictures
const themeDir = path.join(HERE, "themes");
const themes = {};
listed(themeDir, ".css").forEach(function(f) {
    themes[f.replace(/\.css$/, "")] = read(path.join(themeDir, f));
});
const hhDir = path.join(HERE, "assets", "hitchhiker");
const pictures = {};
listed(path.join(hhDir, "img"), "").forEach(function(f) {
    pictures[f] = dataUri(path.join(hhDir, "img", f));
});
const hhCss = listed(hhDir, ".css").map(function(f) { return read(path.join(hhDir, f)); }).join("\n");
const tokens = tokensOf(sources.concat(Object.values(themes)));
const pruned = prune(hhCss, tokens, pictures);
themes.hitchhiker = pruned.css;
const logos = {};
listed(path.join(HERE, "assets", "logos"), ".svg").forEach(function(f) {
    logos[f.replace(/\.svg$/, "")] = dataUri(path.join(HERE, "assets", "logos", f));
});
// the logos go into the stylesheets as --gy-logo-YEAR custom properties, the favicons into the assets
const logoVars = ":root{" + Object.keys(logos).map(function(k) { return "--gy-" + k + ":url(" + logos[k] + ")"; }).join(";") + "}";
themes.base = logoVars + "\n" + (themes.base || "");
const assets = { favicon2013: faviconSvg("#e62117", "#fff", 2013), favicon2017: faviconSvg("#f00", "#fff", 2017) };
function faviconSvg(bg, fg, year) {
    const svg = year >= 2017
        ? "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='" + bg + "' d='M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z'/><path fill='" + fg + "' d='M9.6 15.6V8.4l6.2 3.6z'/></svg>"
        : "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect x='1' y='3' width='14' height='10' rx='3' fill='" + bg + "'/><path fill='" + fg + "' d='M6.5 5.5v5l4-2.5z'/></svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
const prelude = "const UGF_YT_CSS = " + JSON.stringify(themes) + ";\nconst UGF_YT_ASSETS = " + JSON.stringify(assets) + ";\n";

const wrapped = [
    "// ---- Gplex YouTube ----",
    "// Gplex Extended's own YouTube (alpha): the desktop YouTube drawn by Gplex itself, in the look of the",
    "// year of your layout, without YouTube's app and without the V3 extension. Source: youtube/ in the",
    "// repository; this is its build. Stylesheets of 2013-2017 and their pictures are YouTube's own.",
    "function ugfYouTube() {",
    "\"use strict\";",
    prelude,
    moduleText,
    "}",
    "if (ugfOnYouTube && !ugfYtmTakesOver() && !ugfYtmPlayerFrame()) {",
    "    try {",
    "        ugfYouTube();",
    "    } catch (e) {",
    "        console.error(\"Gplex YouTube:\", e);",
    "    }",
    "}",
    "// ---- end Gplex YouTube ----"
].join("\n");
try {
    new Function("ugfOnYouTube", "ugfYtmTakesOver", "ugfYtmPlayerFrame", "GM_getValue", "GM_setValue", "GM_info", wrapped);
} catch (e) {
    console.error("the module does not parse:", e.message);
    process.exit(1);
}
console.log("module: " + sources.length + " files, " + (moduleText.length / 1024).toFixed(0) + " KB; Hitchhiker CSS " + (hhCss.length / 1024).toFixed(0) + " KB -> " + (pruned.css.length / 1024).toFixed(0) + " KB (" + pruned.stats.kept + " of " + pruned.stats.total + " rules); pictures " + Object.keys(pictures).length);
if (args.includes("--check")) {
    fs.writeFileSync(path.join(HERE, "gplex-youtube.module.js"), wrapped);
    process.exit(0);
}

// ---- alpha.user.js: the main script, with StarTube swapped for Gplex YouTube
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
    const n = s.split(from).length - 1;
    if (n !== 1) {
        throw new Error("expected one occurrence, found " + n + ": " + from.slice(0, 60));
    }
    return s.replace(from, to);
};
// the header
main = once(main, "// @name         Gplex Extended - Fixed and extended version of the legendary Gplex Old Google script", "// @name         Gplex Extended Alpha - Gplex Old Google with Gplex's own YouTube");
main = main.replace(/^\/\/ @version\s+\S+$/m, "// @version      " + VERSION);
main = main.replace(/^(\/\/ @description\s+.*?), plus YouTube \(.*\)$/m, "$1, plus YouTube drawn by Gplex itself (Gplex YouTube, alpha)");
main = main.replace(/^\/\/ @downloadURL .*$/m, "// @downloadURL https://raw.githubusercontent.com/Ziptino9098/Gplex-Fixed/main/alpha.user.js");
main = main.replace(/^\/\/ @updateURL .*$/m, "// @updateURL https://raw.githubusercontent.com/Ziptino9098/Gplex-Fixed/main/alpha.user.js");
// StarTube: out, Gplex YouTube: in (the mobile YouTube part after it stays)
main = between(main, "// ---- Gplex Extended for YouTube: StarTube 2.7.0.10 by lightbeam24", "// ---- end StarTube ----", wrapped);
// what referred to StarTube elsewhere
main = once(main, "const ugfHasStarTube = true;", "const ugfHasStarTube = true;   // (the YouTube settings section shows; in the alpha it is Gplex YouTube's)");
main = main.replace(/\n\s*if \(typeof ugfStarTubeApi !== "undefined" && ugfStarTubeApi\.applyMaster\) \{\n\s*ugfStarTubeApi\.applyMaster\(\);\n\s*\}/, "");
main = main.replace(/\n\s*if \(typeof ugfStarTube === "function" && document\.getElementById\("ugf-yt-st-host"\)[^\n]*\n\s*ugfStarTube\("settings"\);\n\s*\}/, "");
// the settings page: the two StarTube sections become Gplex YouTube's
const settingsStart = main.indexOf("<div class=\"ugf-gplex-section\"${ugfHasStarTube ? \"\" : ' style=\"display: none\"'}>");
const settingsEnd = main.indexOf("<div class=\"ugf-gplex-section\" style=\"display: none\">", settingsStart);
if (settingsStart < 0 || settingsEnd < 0) {
    throw new Error("settings sections not found");
}
main = main.slice(0, settingsStart) + read(path.join(HERE, "tools", "settings-section.html")).trim() + "\n                        " + main.slice(settingsEnd);
main = once(main, "\"finon\", \"startubeon\", \"ytclassicon\"]", "\"finon\", \"yton\", \"ytlayout\", \"ytautoplay\", \"ytclassicon\"]");
main = once(main, "[\"startubeon\", \"UGF_STARTUBE_ON\"], [\"ytclassicon\", \"UGF_YT_CLASSIC_ON\"]]", "[\"yton\", \"UGF_YT_ON\"], [\"ytlayout\", \"UGF_YT_LAYOUT\"], [\"ytautoplay\", \"UGF_YT_AUTOPLAY\"], [\"ytclassicon\", \"UGF_YT_CLASSIC_ON\"]]");
main = once(main, "    let startubeOn = \"true\";", "    let startubeOn = \"true\";\n    let ytLayout = \"auto\";\n    let ytAutoplay = \"true\";");
main = once(main, "html:not([startubeon-dd-open]) #ugf-startubeon-dd,\nhtml:not([startubeon-dd-open]) #ugf-startubeon-fence,", "html:not([yton-dd-open]) #ugf-yton-dd,\nhtml:not([yton-dd-open]) #ugf-yton-fence,\nhtml:not([ytlayout-dd-open]) #ugf-ytlayout-dd,\nhtml:not([ytlayout-dd-open]) #ugf-ytlayout-fence,\nhtml:not([ytautoplay-dd-open]) #ugf-ytautoplay-dd,\nhtml:not([ytautoplay-dd-open]) #ugf-ytautoplay-fence,");
main = once(main, "            <div id=\"ugf-startubeon-fence\" class=\"ugf-fence\">\n            </div>", "            <div id=\"ugf-yton-fence\" class=\"ugf-fence\">\n            </div>\n            <div id=\"ugf-ytlayout-fence\" class=\"ugf-fence\">\n            </div>\n            <div id=\"ugf-ytautoplay-fence\" class=\"ugf-fence\">\n            </div>");
main = main.replace(/\n\s*\} else if \(o\[0\] === "startubeon"\) \{\n\s*startubeOn = value;/, "");
main = once(main, "startubeOn = String((typeof GM_getValue === \"function\" ? GM_getValue(\"UGF_STARTUBE_ON\", null) : null) || \"true\");", "startubeOn = String((typeof GM_getValue === \"function\" ? GM_getValue(\"UGF_YT_ON\", null) : null) || \"true\");\n        ytLayout = String((typeof GM_getValue === \"function\" ? GM_getValue(\"UGF_YT_LAYOUT\", null) : null) || \"auto\");\n        ytAutoplay = String((typeof GM_getValue === \"function\" ? GM_getValue(\"UGF_YT_AUTOPLAY\", null) : null) || \"true\");");
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
execFileSync("node", [path.join(ROOT, "build", "build-chrome.js"), ALPHA, path.join(out, base + "-chrome.zip"), path.join(out, base + "-chrome-unpacked")], { stdio: "inherit", env: Object.assign({}, process.env, { GPLEX_ALPHA: "1" }) });
execFileSync("node", [path.join(ROOT, "build", "build-firefox.js"), ALPHA, path.join(out, base + "-firefox.xpi")], { stdio: "inherit", env: Object.assign({}, process.env, { GPLEX_ALPHA: "1" }) });
console.log("packages in releases/alpha/");
