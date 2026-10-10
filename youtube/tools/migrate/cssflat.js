// Analyses StarTube's stylesheet: parses rules, finds the era conditions in each selector (attribute
// tests on <html> / body .v3 that StarTube sets from its settings), and, given per-layout attribute
// profiles, tells which rules apply to which layouts.
"use strict";
const fs = require("fs");
const path = require("path");

// ---- parsing (rules and @media blocks; comments dropped)
function parse(css) {
    const out = [];
    let i = 0;
    const skip = function() { while (i < css.length && /\s/.test(css[i])) { i++; } };
    const block = function() { // css[i] === "{"
        let depth = 0; const start = i;
        for (; i < css.length; i++) {
            if (css[i] === "{") { depth++; } else if (css[i] === "}") { depth--; if (depth === 0) { i++; return css.slice(start + 1, i - 1); } }
        }
        return css.slice(start + 1);
    };
    while (i < css.length) {
        skip();
        if (i >= css.length) { break; }
        if (css.startsWith("/*", i)) { const e = css.indexOf("*/", i); i = e < 0 ? css.length : e + 2; continue; }
        const brace = css.indexOf("{", i);
        if (brace < 0) { break; }
        const head = css.slice(i, brace).trim();
        i = brace;
        const body = block();
        if (head.startsWith("@media") || head.startsWith("@supports") || head.startsWith("@container")) {
            out.push({ media: head, rules: parse(body) });
        } else if (head.startsWith("@")) {
            out.push({ at: head, body: body });
        } else {
            out.push({ sel: head.replace(/\s*\n\s*/g, " "), body: body.trim() });
        }
    }
    return out;
}
function flatten(rules, media) {
    const out = [];
    rules.forEach(function(r) {
        if (r.rules) { flatten(r.rules, (media ? media + " and " : "") + r.media.replace(/^@media\s*/, "")).forEach(function(x) { out.push(x); }); }
        else if (r.sel) { out.push({ sel: r.sel, body: r.body, media: media || "" }); }
        else { out.push({ at: r.at, body: r.body, media: media || "" }); }
    });
    return out;
}
// ---- era attributes: the attribute names StarTube itself sets on <html> or on body .spitfire-body-container.v3
// (anything else in [..] is page state and stays in the selector)
const ERA_ATTRS = new Set(fs.readFileSync(path.join(__dirname, "era-attrs.txt"), "utf8").split(/\s+/).filter(Boolean));
// splits a selector list on top-level commas
function splitList(sel) {
    const out = []; let depth = 0, cur = "", q = null;
    for (let k = 0; k < sel.length; k++) {
        const c = sel[k];
        if (q) { cur += c; if (c === q) { q = null; } continue; }
        if (c === '"' || c === "'") { q = c; cur += c; continue; }
        if (c === "(" || c === "[") { depth++; } else if (c === ")" || c === "]") { depth--; }
        if (c === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else { cur += c; }
    }
    if (cur.trim()) { out.push(cur.trim()); }
    return out;
}
// the era tests in one selector: [{attr, op, val, neg}]
const ATTR_RE = /\[\s*([a-zA-Z][\w-]*)\s*(?:([\^$*|~]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?\s*\]/g;
function conditions(selector) {
    const out = [];
    // :not(...) blocks: tests inside are negated (only simple :not([attr]) / :not([attr=v]) are handled)
    let s = selector.replace(/:not\(([^()]*)\)/g, function(m, inner) {
        let mm; ATTR_RE.lastIndex = 0;
        while ((mm = ATTR_RE.exec(inner))) {
            if (ERA_ATTRS.has(mm[1])) { out.push({ attr: mm[1], op: mm[2] || "", val: mm[3] !== undefined ? mm[3] : mm[4] !== undefined ? mm[4] : (mm[5] || ""), neg: true }); }
        }
        return " ";
    });
    let m; ATTR_RE.lastIndex = 0;
    while ((m = ATTR_RE.exec(s))) {
        if (ERA_ATTRS.has(m[1])) { out.push({ attr: m[1], op: m[2] || "", val: m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : (m[5] || ""), neg: false }); }
    }
    return out;
}
function testOne(c, attrs) {
    const has = Object.prototype.hasOwnProperty.call(attrs, c.attr);
    let ok;
    if (!has) { ok = false; }
    else if (!c.op) { ok = true; }
    else {
        const v = attrs[c.attr];
        ok = c.op === "=" ? v === c.val : c.op === "^=" ? v.startsWith(c.val) : c.op === "$=" ? v.endsWith(c.val) : c.op === "*=" ? v.indexOf(c.val) > -1 :
            c.op === "~=" ? v.split(/\s+/).indexOf(c.val) > -1 : c.op === "|=" ? (v === c.val || v.startsWith(c.val + "-")) : false;
    }
    return c.neg ? !ok : ok;
}
// does this selector (one of a list) possibly apply under the given attribute set?
function applies(selector, attrs) {
    return conditions(selector).every(function(c) { return testOne(c, attrs); });
}
module.exports = { parse, flatten, splitList, conditions, applies, ERA_ATTRS };

if (require.main === module) {
    const css = fs.readFileSync(path.join(__dirname, "startube.css"), "utf8");
    const rules = flatten(parse(css));
    const plain = rules.filter(function(r) { return r.sel; });
    console.log("rules", plain.length, "at-rules", rules.length - plain.length);
    let sels = 0, withEra = 0, noEra = 0;
    const attrUse = {};
    plain.forEach(function(r) {
        splitList(r.sel).forEach(function(s) {
            sels++;
            const c = conditions(s);
            if (c.length) { withEra++; c.forEach(function(x) { attrUse[x.attr] = (attrUse[x.attr] || 0) + 1; }); } else { noEra++; }
        });
    });
    console.log("selectors", sels, "with era conditions", withEra, "unconditional", noEra);
    console.log(Object.entries(attrUse).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 40).map(function(e) { return e[0] + ":" + e[1]; }).join(" "));
    const bytes = plain.reduce(function(n, r) { return n + r.body.length; }, 0);
    console.log("declaration bytes", bytes);
}
