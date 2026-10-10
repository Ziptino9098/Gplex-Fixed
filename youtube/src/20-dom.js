// ---- Gplex YouTube: DOM building and text ----
// YouTube's pages require Trusted Types for scripts, so nothing here uses innerHTML: every element is
// built with h(), and text is always a text node.
const SVG_NS = "http://www.w3.org/2000/svg";
function h(tag, attrs, ...children) {
    const el = tag.startsWith("svg:") ? document.createElementNS(SVG_NS, tag.slice(4)) : document.createElement(tag);
    if (attrs) {
        for (const name in attrs) {
            const v = attrs[name];
            if (v === null || v === undefined || v === false) {
                continue;
            }
            if (name.startsWith("on") && typeof v === "function") {
                el.addEventListener(name.slice(2), v);
            } else if (name === "dataset") {
                Object.assign(el.dataset, v);
            } else {
                el.setAttribute(name, v === true ? "" : String(v));
            }
        }
    }
    append(el, children);
    return el;
}
function append(el, children) {
    for (const c of children) {
        if (c === null || c === undefined || c === false || c === "") {
            continue;
        }
        if (Array.isArray(c)) {
            append(el, c);
        } else if (c instanceof Node) {
            el.appendChild(c);
        } else {
            el.appendChild(document.createTextNode(String(c)));
        }
    }
    return el;
}
function clear(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
    return el;
}
function replace(el, ...children) {
    return append(clear(el), children);
}
// An inline icon: a 24-unit path from ICONS (Polymer and the classic looks); Hitchhiker uses sprites.
function icon(name, cls) {
    const d = ICONS[name];
    const svg = h("svg:svg", { viewBox: "0 0 24 24", class: "gy-icon" + (cls ? " " + cls : ""), "aria-hidden": "true" });
    (Array.isArray(d) ? d : [d]).forEach(function(p) {
        svg.appendChild(h("svg:path", { d: p }));
    });
    return svg;
}
const ICONS = {
    menu: "M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z",
    search: "M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    mic: "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z",
    upload: "M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z",
    apps: "M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z",
    bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
    more: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
    account: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z",
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    trending: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z",
    subscriptions: "M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z",
    library: "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z",
    history: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",
    watchlater: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z",
    like: "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z",
    dislike: "M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z",
    share: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",
    add: "M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z",
    flag: "M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    play: "M8 5v14l11-7z",
    pause: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
    next: "M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z",
    volume: "M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z",
    volumeLow: "M7 9v6h4l5 5V4l-5 5H7z",
    muted: "M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z",
    settings: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
    captions: "M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z",
    theater: "M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z",
    fullscreen: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z",
    unfullscreen: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z",
    back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    sort: "M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z",
    expand: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",
    collapse: "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z",
    heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    verified: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    playlist: "M4 10h12v2H4v-2zm0-4h12v2H4V6zm0 8h8v2H4v-2zm10 0v6l5-3-5-3z",
    shuffle: "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
    repeat: "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z",
    youtube: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
    google: "M21.35 11.1H12v3.2h5.59c-.25 1.6-1.9 4.7-5.59 4.7-3.36 0-6.1-2.78-6.1-6.2S8.64 6.6 12 6.6c1.9 0 3.19.82 3.92 1.52l2.67-2.57C16.87 3.95 14.65 3 12 3 7.03 3 3 7.03 3 12s4.03 9 9 9c5.2 0 8.65-3.65 8.65-8.8 0-.6-.07-1.05-.3-1.1z"
};

// ---- YouTube's text objects
// {simpleText}, {runs:[{text, navigationEndpoint, bold...}]}, {content, commandRuns, styleRuns} (the
// newer attributed strings), or a plain string: all become the same runs.
function runsOf(t) {
    if (!t) {
        return [];
    }
    if (typeof t === "string") {
        return [{ text: t }];
    }
    if (t.simpleText !== undefined) {
        return [{ text: t.simpleText }];
    }
    if (t.runs) {
        return t.runs.map(function(r) {
            return { text: r.text || "", url: endpointUrl(r.navigationEndpoint), bold: r.bold, italics: r.italics, strike: r.strikethrough, emoji: r.emoji && r.emoji.image ? pickThumb(r.emoji.image) : null };
        });
    }
    if (t.content !== undefined) {
        const s = t.content, out = [];
        let at = 0;
        (t.commandRuns || []).slice().sort(function(a, b) { return a.startIndex - b.startIndex; }).forEach(function(c) {
            const start = c.startIndex || 0, end = start + (c.length || 0);
            if (start < at || end > s.length) {
                return;
            }
            if (start > at) {
                out.push({ text: s.slice(at, start) });
            }
            out.push({ text: s.slice(start, end), url: endpointUrl(c.onTap && c.onTap.innertubeCommand) });
            at = end;
        });
        if (at < s.length) {
            out.push({ text: s.slice(at) });
        }
        return out;
    }
    return [];
}
function text(t) {
    return runsOf(t).map(function(r) { return r.text; }).join("");
}
// Text with its links and line breaks, as nodes. YouTube's own redirect links point straight at their
// target, and a timestamp of the video being watched keeps its href (the watch page seeks on it).
function richText(t, opts) {
    const frag = document.createDocumentFragment();
    const o = opts || {};
    runsOf(t).forEach(function(r) {
        let node = linesOf(r.text);
        if (r.emoji && r.emoji.url) {
            node = h("img", { class: "gy-emoji", src: r.emoji.url, alt: r.text, title: r.text });
        }
        if (r.bold) {
            node = h("b", null, node);
        }
        if (r.italics) {
            node = h("i", null, node);
        }
        if (r.strike) {
            node = h("s", null, node);
        }
        if (r.url) {
            const url = plainUrl(r.url);
            node = h("a", { href: url, class: o.linkClass || null, target: /^https?:\/\//.test(url) && !url.startsWith(ORIGIN) ? "_blank" : null, rel: "noopener" }, node);
        }
        frag.appendChild(node);
    });
    return frag;
}
function linesOf(s) {
    const parts = String(s).split("\n"), frag = document.createDocumentFragment();
    parts.forEach(function(p, i) {
        if (i) {
            frag.appendChild(h("br"));
        }
        if (p) {
            frag.appendChild(document.createTextNode(p));
        }
    });
    return frag;
}
// YouTube's "/redirect?q=..." wrapper around outside links: the link itself.
function plainUrl(url) {
    const m = /^(?:https:\/\/www\.youtube\.com)?\/redirect\?.*?[?&]q=([^&]+)/.exec(url);
    return m ? decodeURIComponent(m[1]) : url;
}
// The address a navigation endpoint leads to, relative when it is on youtube.com.
function endpointUrl(ep) {
    if (!ep) {
        return "";
    }
    const web = ep.commandMetadata && ep.commandMetadata.webCommandMetadata;
    if (web && web.url) {
        return web.url.replace(/^https:\/\/www\.youtube\.com(?=\/)/, "");
    }
    if (ep.watchEndpoint) {
        return watchUrl(ep.watchEndpoint.videoId, ep.watchEndpoint.playlistId, ep.watchEndpoint.index, ep.watchEndpoint.startTimeSeconds);
    }
    if (ep.browseEndpoint) {
        return ep.browseEndpoint.canonicalBaseUrl || "/channel/" + ep.browseEndpoint.browseId;
    }
    if (ep.urlEndpoint) {
        return ep.urlEndpoint.url;
    }
    if (ep.searchEndpoint) {
        return "/results?search_query=" + encodeURIComponent(ep.searchEndpoint.query || "") + (ep.searchEndpoint.params ? "&sp=" + encodeURIComponent(ep.searchEndpoint.params) : "");
    }
    return "";
}
function watchUrl(id, list, index, start) {
    return "/watch?v=" + id + (list ? "&list=" + list : "") + (list && index !== undefined && index !== null ? "&index=" + (Number(index) + 1) : "") + (start ? "&t=" + start + "s" : "");
}
// The best picture of a thumbnails list for a width: the smallest one at least that wide.
function pickThumb(thumbs, width) {
    const list = (thumbs && (thumbs.thumbnails || thumbs.sources)) || (Array.isArray(thumbs) ? thumbs : []);
    if (!list.length) {
        return null;
    }
    const sorted = list.slice().sort(function(a, b) { return (a.width || 0) - (b.width || 0); });
    const fit = sorted.find(function(t) { return (t.width || 0) >= (width || 0); });
    return fit || sorted[sorted.length - 1];
}
function thumbUrl(thumbs, width) {
    const t = pickThumb(thumbs, width);
    return t ? t.url.replace(/^\/\//, "https://") : "";
}
// A video's picture straight from YouTube's image servers, at the sizes the old site used:
// "default" 120x90, "mq" 320x180, "hq" 480x360, "sd" 640x480, "maxres" 1280x720.
function videoThumb(id, size) {
    return "https://i.ytimg.com/vi/" + id + "/" + (size || THUMB_SIZE) + "default.jpg";
}

// A value deep in YouTube's data by its path ("a.b.0.c"), or undefined.
function dig(o, path) {
    return String(path).split(".").reduce(function(v, k) { return v === null || v === undefined ? undefined : v[k]; }, o);
}

// ---- numbers and time
function fmtNum(n) {
    return Number(n || 0).toLocaleString("en-US");
}
function fmtTime(secs) {
    const s = Math.max(0, Math.floor(secs || 0)), m = Math.floor(s / 60) % 60, hh = Math.floor(s / 3600);
    const two = function(x) { return x < 10 ? "0" + x : String(x); };
    return (hh ? hh + ":" + two(m) : String(m)) + ":" + two(s % 60);
}
function parseTime(str) {
    const parts = String(str || "").trim().split(":").map(Number);
    if (!parts.length || parts.some(isNaN)) {
        return 0;
    }
    return parts.reduce(function(acc, p) { return acc * 60 + p; }, 0);
}
// "1,234 views" -> 1234; "1.2M views" -> 1200000
function parseCount(str) {
    const m = /([\d,.]+)\s*([KMB])?/i.exec(String(str || "").replace(/\s/g, " "));
    if (!m) {
        return 0;
    }
    const n = parseFloat(m[1].replace(/,/g, ""));
    const mult = { K: 1e3, M: 1e6, B: 1e9 }[(m[2] || "").toUpperCase()] || 1;
    return Math.round(n * mult);
}
function plural(n, word, words) {
    return fmtNum(n) + " " + (n === 1 ? word : words || word + "s");
}
function setTitle(t) {
    document.title = t ? t + " - YouTube" : "YouTube";
}
