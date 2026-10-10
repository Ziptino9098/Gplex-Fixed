// Writes ../../css/startube.css from out/chunks.json (flatten.js): the blocks in cascade order, each under
// its @eras marker, one declaration per line, the pictures named as the files in ../../assets/pictures/.
// usage: node write-css.js
"use strict";
const fs = require("fs");
const path = require("path");
const F = require("./cssflat.js");
const format = require("./cssfmt.js").format;
const chunks = JSON.parse(fs.readFileSync(path.join(__dirname, "out", "chunks.json"), "utf8"));
// the pictures flatten.js numbered (in order of first use), as the asset files they were written out to
const names = { "--st-pic-sprite": "sprite", "--st-pic-1": "apps-wallet-finance", "--st-pic-2": "apps-firefox", "--st-pic-3": "player-modern-controls-shade",
    "--st-pic-4": "player-modern-check", "--st-pic-5": "player-modern-fullscreen-shade", "--st-pic-6": "share-x", "--st-pic-7": "share-whatsapp",
    "--st-pic-8": "share-kakao", "--st-pic-9": "player-modern-back", "--st-pic-10": "player-modern-arrow", "--st-pic-11": "player-cosmic-chrome",
    "--st-pic-12": "player-aozora-buttons" };
const ALL = "aozora2010_1 aozora2011_2 cloudgazer2007_1 cosmic2012_1 hh2013_1 hh2013_2 hh2013_3 hh2014 hh2015 hh2016 hhE2015 hhE2016 hhM2016 poly2017 poly2018 poly2019 poly2022 stargazer2008_1 stargazer2009_1 stargazer2009_3";
// what the rewrite no longer draws: StarTube's Hype page and chips, and the "watched right now" and
// third-column lists it fed from YouTube's Hype leaderboard, which YouTube no longer serves
const DEAD = ["#st-vids-watched-now", "#st-vwn-", ".vwn-video", ".st-vwn-s", "#startube-third-column", "#thirdcol-videos", ".thirdcol-video",
    "#startube-spotlight", "#st-hype-", ".hype-list-item", "-hype-chip", "#FEhype_leaderboard-guide-item"];
function alive(rules) {
    return rules.map(function(r) {
        if (r.rules) { return Object.assign({}, r, { rules: alive(r.rules) }); }
        if (!r.sel) { return r; }
        const kept = F.splitList(r.sel).filter(function(s) { return !DEAD.some(function(d) { return s.indexOf(d) > -1; }); });
        return kept.length ? Object.assign({}, r, { sel: kept.join(",") }) : null;
    }).filter(function(r) { return r && !(r.rules && !r.rules.length); });
}
let dropped = 0;
let out = ["/* Gplex Extended for YouTube: the stylesheet, by era. Each block applies to the eras its @eras line names",
    "   (\"all\" = every era); the build keeps the blocks of the era in this order. The pictures are the files in",
    "   assets/pictures/, as --st-pic-<name>. Derived from StarTube 2.7.0.10's stylesheet by lightbeam24 (MIT),",
    "   with its settings resolved per era: see tools/migrate/. */", ""];
let bytes = 0;
chunks.forEach(function(c) {
    const css = c.css.replace(/var\((--st-pic-[\w-]+)\)/g, function(m, k) {
        if (!names[k]) { throw new Error("no picture " + k); }
        return "var(--st-pic-" + names[k] + ")";
    });
    const parsed = F.parse(css);
    const rules = alive(parsed);
    dropped += parsed.length - rules.length;
    if (!rules.length) { return; }
    const text = format(rules, "");
    bytes += text.length;
    out.push("/* @eras " + (c.eras === ALL ? "all" : c.eras) + " */", text, "");
});
fs.writeFileSync(path.join(__dirname, "..", "..", "css", "startube.css"), out.join("\n"));
console.log("chunks", chunks.length, "bytes", bytes, "dead rules dropped", dropped);
