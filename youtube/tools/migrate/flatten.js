// Flattens StarTube's stylesheet per era: with the attribute profiles (what StarTube 2.7 set on <html>
// and on body .spitfire-body-container for each layout, on the home and watch pages), every selector's
// era-fixed attribute tests are decided: selectors that can never match in an era are dropped there,
// and the tests that always match are replaced by [st] (same specificity). Rules are then grouped into
// chunks of consecutive rules with the same set of eras, in the original order, so each era's sheet
// (the chunks whose set holds it, concatenated) has exactly the old cascade.
// usage: node flatten.js  (after extract.js) -> out/chunks.json, out/<era>.css, out/pictures.json, stats on stdout
"use strict";
const fs = require("fs");
const path = require("path");
const F = require("./cssflat.js");
const OUT = path.join(__dirname, "out");
fs.mkdirSync(OUT, { recursive: true });

// runtime state attributes: they change with the page or the user, so their tests stay in the selectors
const STATE = new Set(("dark location chan-loc logged-in playlist-watch pw gbar has-v3 c4banner pl-page pl-page-over-10 comment-panel-open " +
    "popup-visible addto-visible share-visible more-visible has-at has-ts is-owner no-owner rel-head-added vwn-ready channel-sort " +
    "channel-about-fetched playlist-data-done videos-dd autoplay custom-sizerules flexwatch-large flexwatch-medium flexwatch-mini-v2 " +
    "guide static data-player-size").split(" "));
// (static, guide, custom-sizerules, flexwatch-*: era-fixed in truth, but kept as state so the sheets stay
// readable where they matter; the JS keeps setting them)
const FIXED = new Set([...F.ERA_ATTRS].filter(function(a) { return !STATE.has(a); }));

// ---- profiles: era -> {attr: value} (html and body container merged; home and watch merged, a
// differing value becomes an array of the values seen)
const profiles = {};
fs.readdirSync(path.join(__dirname, "profiles")).forEach(function(f) {
    const p = JSON.parse(fs.readFileSync(path.join(__dirname, "profiles", f), "utf8"));
    const era = p.home && p.home.html && p.home.html.ly;
    if (!era) { console.log("no profile for", f); return; }
    const attrs = profiles[era] || (profiles[era] = {});
    ["home", "watch"].forEach(function(pg) {
        const d = p[pg] || {};
        [d.html || {}, d.v3 || {}].forEach(function(set) {
            Object.keys(set).forEach(function(k) {
                if (!(k in attrs)) { attrs[k] = [set[k]]; } else if (attrs[k].indexOf(set[k]) < 0) { attrs[k].push(set[k]); }
            });
        });
    });
});
const ERAS = Object.keys(profiles).sort();
console.log("eras:", ERAS.join(" "));

// ---- selector tests
const ATTR = /\[\s*([a-zA-Z][\w-]*)\s*(?:([\^$*|~]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?\s*\]/g;
function tests(s) {
    const out = []; let m; ATTR.lastIndex = 0;
    while ((m = ATTR.exec(s))) { out.push({ attr: m[1], op: m[2] || "", val: m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : (m[5] || ""), text: m[0] }); }
    return out;
}
function testVal(t, v) {
    if (!t.op) { return true; }
    return t.op === "=" ? v === t.val : t.op === "^=" ? v.startsWith(t.val) : t.op === "$=" ? v.endsWith(t.val) : t.op === "*=" ? v.indexOf(t.val) > -1 :
        t.op === "~=" ? v.split(/\s+/).indexOf(t.val) > -1 : t.op === "|=" ? (v === t.val || v.startsWith(t.val + "-")) : false;
}
// true / false / "state" (unknown: not an era-fixed attribute)
function decide(t, attrs) {
    if (!FIXED.has(t.attr)) { return "state"; }
    const vals = attrs[t.attr];
    if (!vals) { return false; }
    return vals.some(function(v) { return testVal(t, v); });
}
// one selector under one era: {keep: bool, sel: rewritten}
function rewrite(sel, attrs) {
    let keep = true;
    // :not( ... ) groups first
    let s = sel.replace(/:not\(([^()]*)\)/g, function(m, inner) {
        const ts = tests(inner);
        if (!ts.length) { return m; }
        const fixedTs = ts.filter(function(t) { return FIXED.has(t.attr); });
        if (!fixedTs.length) { return m; }
        if (fixedTs.length !== ts.length) { throw new Error("mixed :not " + sel); }
        // :not(A B) matches unless all of A, B hold
        const allHold = fixedTs.every(function(t) { return decide(t, attrs) === true; });
        if (allHold) { keep = false; }
        return fixedTs.map(function() { return "[st]"; }).join("");
    });
    s = s.replace(ATTR, function(m, a) {
        const t = tests(m)[0];
        const d = decide(t, attrs);
        if (d === "state") { return m; }
        if (d === false) { keep = false; }
        return "[st]";
    });
    return { keep: keep, sel: s.replace(/\s+/g, " ").trim() };
}

// ---- rules
let css = fs.readFileSync(path.join(__dirname, "startube-2.7.css"), "utf8");
// pictures: data URIs -> custom properties
const pictures = {}; let pn = 0;
css = css.replace(/url\((?:"|')?(data:[^)"']+)(?:"|')?\)/g, function(m, uri) {
    let name = Object.keys(pictures).find(function(k) { return pictures[k] === uri; });
    if (!name) { name = "--st-pic-" + (++pn); pictures[name] = uri; }
    return "var(" + name + ")";
});
css = css.replace(/url\(UGF_ST_IMG\)/g, "var(--st-pic-sprite)");
const rules = F.flatten(F.parse(css));
console.log("rules", rules.length, "pictures", pn);

// per era: ordered list of {key, text}
const perEra = {};
ERAS.forEach(function(era) { perEra[era] = []; });
const atRulesText = [];
rules.forEach(function(r, idx) {
    if (!r.sel) { // @font-face, @keyframes: everywhere
        const text = (r.media ? "@media " + r.media + "{" : "") + r.at + "{" + r.body + "}" + (r.media ? "}" : "");
        ERAS.forEach(function(era) { perEra[era].push({ idx: idx, text: text }); });
        return;
    }
    const sels = F.splitList(r.sel);
    ERAS.forEach(function(era) {
        const kept = [];
        sels.forEach(function(s) {
            const w = rewrite(s, profiles[era]);
            if (w.keep && kept.indexOf(w.sel) < 0) { kept.push(w.sel); }
        });
        if (!kept.length) { return; }
        const text = (r.media ? "@media " + r.media + "{" : "") + kept.join(",") + "{" + r.body + "}" + (r.media ? "}" : "");
        perEra[era].push({ idx: idx, text: text });
    });
});
// dedupe within an era: identical rule text, keep the last
ERAS.forEach(function(era) {
    const seen = new Set();
    const list = perEra[era];
    for (let i = list.length - 1; i >= 0; i--) {
        if (seen.has(list[i].text)) { list.splice(i, 1); } else { seen.add(list[i].text); }
    }
});
// chunks: walk the original rules in order; for each rule index the set of eras + the texts (text can
// differ per era when different selectors survived); a chunk = consecutive rules with the same era set
// and the same text across those eras
const byIdx = {};
ERAS.forEach(function(era) { perEra[era].forEach(function(it) { (byIdx[it.idx] = byIdx[it.idx] || {})[era] = it.text; }); });
const chunks = [];
Object.keys(byIdx).map(Number).sort(function(a, b) { return a - b; }).forEach(function(idx) {
    const m = byIdx[idx];
    // group eras by identical text
    const groups = {};
    Object.keys(m).forEach(function(era) { (groups[m[era]] = groups[m[era]] || []).push(era); });
    Object.keys(groups).forEach(function(text) {
        const eras = groups[text].sort().join(" ");
        const last = chunks[chunks.length - 1];
        if (last && last.eras === eras) { last.css += "\n" + text; } else { chunks.push({ eras: eras, css: text }); }
    });
});
fs.writeFileSync(path.join(OUT, "chunks.json"), JSON.stringify(chunks));
fs.writeFileSync(path.join(OUT, "pictures.json"), JSON.stringify(pictures));
ERAS.forEach(function(era) {
    fs.writeFileSync(path.join(OUT, era + ".css"), chunks.filter(function(c) { return c.eras.split(" ").indexOf(era) > -1; }).map(function(c) { return c.css; }).join("\n"));
});
const sizes = {};
chunks.forEach(function(c) { sizes[c.eras] = (sizes[c.eras] || 0) + c.css.length; });
console.log("chunks", chunks.length, "distinct era sets", Object.keys(sizes).length);
Object.entries(sizes).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 25).forEach(function(e) { console.log(String(e[1]).padStart(7), e[0]); });
ERAS.forEach(function(era) { console.log(era, perEra[era].length, "rules", fs.statSync(path.join(OUT, era + ".css")).size, "bytes"); });
console.log("total chunk bytes", chunks.reduce(function(n, c) { return n + c.css.length; }, 0));
