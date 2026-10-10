// Keeps, from YouTube's Hitchhiker stylesheets, only the rules whose selectors can match Gplex
// YouTube's pages: every id and class in a kept selector must be one the sources name. Pictures the
// kept rules use are embedded. usage (from build.js): prune(css, tokens, pictures) -> css
"use strict";
// the ids and classes named anywhere in the given source texts (JS and CSS), plus the state classes
// that scripts toggle
function tokensOf(texts) {
    const found = new Set();
    texts.forEach(function(t) {
        let m;
        const re = /["'`][^"'`]*["'`]/g;
        while ((m = re.exec(t))) {
            m[0].slice(1, -1).split(/[\s+]+/).forEach(function(w) {
                if (/^[A-Za-z][\w-]*$/.test(w)) {
                    found.add(w);
                }
            });
        }
        const re2 = /[#.]([A-Za-z][\w-]*)/g;
        while ((m = re2.exec(t))) {
            found.add(m[1]);
        }
    });
    return found;
}
// one pass over a stylesheet: rules and @media blocks, as {selector, body} / {media, rules}
function parse(css) {
    const out = [];
    let i = 0;
    const skipSpace = function() {
        while (i < css.length && /\s/.test(css[i])) {
            i++;
        }
    };
    const readBlock = function() {
        // css[i] === "{"
        let depth = 0, start = i;
        for (; i < css.length; i++) {
            if (css[i] === "{") {
                depth++;
            } else if (css[i] === "}") {
                depth--;
                if (depth === 0) {
                    i++;
                    return css.slice(start + 1, i - 1);
                }
            }
        }
        return css.slice(start + 1);
    };
    while (i < css.length) {
        skipSpace();
        if (i >= css.length) {
            break;
        }
        if (css.startsWith("/*", i)) {
            i = css.indexOf("*/", i) + 2;
            continue;
        }
        const brace = css.indexOf("{", i);
        if (brace < 0) {
            break;
        }
        const head = css.slice(i, brace).trim();
        i = brace;
        const body = readBlock();
        if (head.startsWith("@")) {
            if (/^@(media|supports)/.test(head)) {
                out.push({ at: head, rules: parse(body) });
            } else if (/^@(font-face|keyframes|-webkit-keyframes|-moz-keyframes|page)/.test(head)) {
                out.push({ at: head, raw: body });
            }
        } else {
            out.push({ selector: head, body: body });
        }
    }
    return out;
}
// classes the pages build by joining a prefix and a name (icons, thumbnail sizes, button kinds)
const PREFIXES = ["yt-uix-button-icon-", "guide-", "yt-thumb-", "share-service-icon-", "related-list-item-compact-", "yt-lockup-", "yt-uix-button-", "yt-pl-", "comment-", "watch-", "pl-video", "filter-", "spell-correction", "yt-badge", "video-time", "yt-uix-expander", "like-button-renderer", "appbar-", "branded-page-", "feed-item-", "shelf-", "yt-uix-shelfslider", "c4-", "channel-header", "primary-header", "qualified-channel-title", "autoplay-", "playlist-", "yt-spinner", "load-more", "content-snap-width-"];
function selectorOk(sel, tokens) {
    const re = /[#.]([A-Za-z][\w-]*)/g;
    let m;
    while ((m = re.exec(sel))) {
        const t = m[1];
        if (!tokens.has(t) && !PREFIXES.some(function(p) { return t.startsWith(p); })) {
            return false;
        }
    }
    return true;
}
function serialize(rules, tokens, stats) {
    let out = "";
    rules.forEach(function(r) {
        if (r.raw !== undefined) {
            out += r.at + "{" + r.raw + "}";
        } else if (r.rules) {
            const inner = serialize(r.rules, tokens, stats);
            if (inner) {
                out += r.at + "{" + inner + "}";
            }
        } else {
            const kept = r.selector.split(",").map(function(s) { return s.trim(); }).filter(function(s) { return s && selectorOk(s, tokens); });
            stats.total++;
            if (kept.length) {
                stats.kept++;
                out += kept.join(",") + "{" + r.body + "}";
            }
        }
    });
    return out;
}
// Each picture the kept rules use is embedded once, as a custom property on :root.
function prune(css, tokens, pictures) {
    const stats = { total: 0, kept: 0 };
    const used = {};
    let out = serialize(parse(css), tokens, stats);
    out = out.replace(/url\((?:"|')?(?:https?:)?\/\/s\.ytimg\.com\/yts\/(?:imgbin|img)\/([^)"']+)(?:"|')?\)/g, function(all, name) {
        const file = name.split("/").pop();
        if (!pictures[file]) {
            return all;
        }
        const prop = "--gy-pic-" + file.replace(/\.[a-z]+$/, "").replace(/[^\w-]/g, "_");
        used[prop] = pictures[file];
        return "var(" + prop + ")";
    });
    const root = Object.keys(used).map(function(k) { return k + ":url(" + used[k] + ")"; }).join(";");
    return { css: (root ? ":root{" + root + "}" : "") + out, stats: stats, pictures: Object.keys(used).length };
}
module.exports = { prune: prune, tokensOf: tokensOf, parse: parse };
