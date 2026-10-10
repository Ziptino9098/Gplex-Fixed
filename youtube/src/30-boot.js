// ---- Gplex YouTube: the page and its data ----
// Which page this is (null: one Gplex leaves to YouTube), from the address alone, at document-start.
function pageOf(loc) {
    const p = loc.pathname.replace(/\/+$/, "") || "/";
    const q = new URLSearchParams(loc.search);
    if (q.get("gplex") === "off" || q.get("gplex") === "false") {
        return null;
    }
    if (p === "/" || p === "/index") {
        return { kind: "home" };
    }
    if (p === "/results") {
        return { kind: "results", query: q.get("search_query") || q.get("q") || "", sp: q.get("sp") || "" };
    }
    if (p === "/watch") {
        const id = q.get("v");
        return id && /^[\w-]{11}$/.test(id) ? { kind: "watch", id: id, list: q.get("list") || "", index: Number(q.get("index")) || 0, start: parseStart(q.get("t")) } : null;
    }
    let m = /^\/shorts\/([\w-]{11})$/.exec(p);
    if (m) {
        return { kind: "shorts", id: m[1] };
    }
    if (p === "/playlist") {
        return q.get("list") ? { kind: "playlist", list: q.get("list") } : null;
    }
    m = /^\/feed\/(subscriptions|history|library|you|trending|explore|playlists|channels|storefront)$/.exec(p);
    if (m) {
        return { kind: "feed", feed: m[1] };
    }
    m = /^\/hashtag\/([^\/]+)$/.exec(p);
    if (m) {
        return { kind: "hashtag", tag: decodeURIComponent(m[1]) };
    }
    if (p === "/gaming") {
        return { kind: "channel", base: "/channel/UCOpNcN46UbXVtpKMrmU4Abg", tab: "featured" };
    }
    m = /^\/(@[^\/]+|channel\/UC[\w-]{22}|c\/[^\/]+|user\/[^\/]+)(?:\/(featured|videos|shorts|streams|live|playlists|community|posts|about|search|podcasts|releases|courses|membership))?$/.exec(p);
    if (m) {
        return { kind: "channel", base: "/" + m[1], tab: m[2] === "live" ? "streams" : m[2] === "community" ? "posts" : m[2] || "featured", query: q.get("query") || "" };
    }
    return null;
}
// "1h2m3s", "123", "123s" -> seconds
function parseStart(t) {
    if (!t) {
        return 0;
    }
    if (/^\d+s?$/.test(t)) {
        return parseInt(t, 10);
    }
    const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
    return m ? (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0) : 0;
}

// Keeps YouTube's own scripts from running, from now until stop(): each <script> the parser adds is
// turned into text before the browser prepares it (the standard runs a microtask checkpoint first,
// and that is when the observer sees it). Its stylesheets and preloads go too. Gplex's own elements
// carry data-gplex and are left alone.
function blockPageScripts() {
    const scripts = [];
    const mo = new MutationObserver(function(records) {
        for (const r of records) {
            for (const n of r.addedNodes) {
                if (n.nodeType !== 1 || n.hasAttribute("data-gplex")) {
                    continue;
                }
                if (n.nodeName === "SCRIPT") {
                    n.type = "text/plain";
                    scripts.push(n);
                } else if (n.nodeName === "LINK" && /stylesheet|preload|modulepreload|prefetch/.test(n.rel)) {
                    n.remove();
                } else if (n.nodeName === "STYLE" || n.nodeName === "IFRAME") {
                    n.remove();
                }
            }
        }
    });
    mo.observe(document, { childList: true, subtree: true });
    return {
        scripts: scripts,
        stop: function() {
            mo.disconnect();
        }
    };
}

// ---- the page's data, out of the blocked scripts' text
// The end of the JSON value (object or array) that starts at s[from], minding strings.
function balancedEnd(s, from) {
    let depth = 0, inStr = false, esc = false;
    for (let i = from; i < s.length; i++) {
        const c = s[i];
        if (inStr) {
            if (esc) {
                esc = false;
            } else if (c === "\\") {
                esc = true;
            } else if (c === "\"") {
                inStr = false;
            }
        } else if (c === "\"") {
            inStr = true;
        } else if (c === "{" || c === "[") {
            depth++;
        } else if (c === "}" || c === "]") {
            depth--;
            if (depth === 0) {
                return i + 1;
            }
        }
    }
    return -1;
}
function jsonAfter(s, re) {
    const m = re.exec(s);
    if (!m) {
        return null;
    }
    const from = m.index + m[0].length;
    if (s[from] === "'" || s[from] === "\"") {
        // the value as a JavaScript string holding JSON
        try {
            return JSON.parse(JSON.parse(s.slice(from, s.indexOf(s[from] + ";", from + 1) + 1).replace(/^'|'$/g, "\"")));
        } catch (e) {
            return null;
        }
    }
    const end = balancedEnd(s, from);
    if (end < 0) {
        return null;
    }
    try {
        return JSON.parse(s.slice(from, end));
    } catch (e) {
        return null;
    }
}
function readPageData(scripts) {
    const s = scripts.map(function(x) { return x.textContent || ""; }).join("\n;\n");
    const cfg = {};
    const re = /ytcfg\.set\(\{/g;
    let m;
    while ((m = re.exec(s))) {
        const end = balancedEnd(s, m.index + m[0].length - 1);
        if (end > 0) {
            try {
                Object.assign(cfg, JSON.parse(s.slice(m.index + m[0].length - 1, end)));
            } catch (e) {}
        }
    }
    return {
        cfg: cfg,
        data: jsonAfter(s, /(?:var |window\[")ytInitialData"?\]?\s*=\s*/),
        player: jsonAfter(s, /(?:var |window\[")ytInitialPlayerResponse"?\]?\s*=\s*/)
    };
}
