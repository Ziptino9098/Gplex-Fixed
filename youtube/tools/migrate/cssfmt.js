// Formats parsed CSS (cssflat.js) one declaration per line, dropping declarations a later one in the
// same rule overrides.
"use strict";
const F = require("./cssflat.js");
// splits declarations on ; outside quotes and parentheses
function decls(body) {
    const out = []; let depth = 0, cur = "", q = null;
    for (const c of body) {
        if (q) { cur += c; if (c === q) { q = null; } continue; }
        if (c === '"' || c === "'") { q = c; cur += c; continue; }
        if (c === "(") { depth++; } else if (c === ")") { depth--; }
        if (c === ";" && depth === 0) { out.push(cur); cur = ""; } else { cur += c; }
    }
    out.push(cur);
    const list = out.map(function(d) { return d.replace(/\s+/g, " ").trim(); }).filter(Boolean).map(function(d) {
        const i = d.indexOf(":");
        return i < 0 ? d : d.slice(0, i).trim() + ": " + d.slice(i + 1).trim().replace(/\s*!\s*important$/, " !important");
    });
    // a property set twice: the later wins, so the earlier goes (unless it is the vendor-prefixed
    // fallback of the later, or the only one marked !important)
    const seen = {};
    return list.filter(function(d, i) {
        const prop = d.split(":")[0].toLowerCase();
        const later = list.slice(i + 1).find(function(x) { return x.split(":")[0].toLowerCase() === prop; });
        if (!later) { return true; }
        return /-(webkit|moz|ms|o)-/.test(d) || (/!important$/.test(d) && !/!important$/.test(later));
    });
}
function format(rules, indent) {
    return rules.map(function(r) {
        if (r.rules) {
            return indent + r.media + " {\n" + format(r.rules, indent + "    ") + "\n" + indent + "}";
        }
        const head = r.sel ? F.splitList(r.sel).join(",\n" + indent) : r.at;
        const body = r.at && /^@keyframes/.test(r.at) ? format(F.parse(r.body), indent + "    ") :
            decls(r.body).map(function(d) { return indent + "    " + d + ";"; }).join("\n");
        return indent + head + " {\n" + body + "\n" + indent + "}";
    }).join("\n");
}
module.exports = { format, decls };
