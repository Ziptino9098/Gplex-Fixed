// Gplex Extended for Chrome: service worker. Makes Gplex's GM_xmlhttpRequest requests (only to the
// hosts the userscript's @connect and @match lines name), as a userscript manager does.
// GPLEX (the hosts) is put in front of this file by build-chrome.js.
/* global GPLEX, chrome */
"use strict";
const toB64 = function(buf) {
    const u = new Uint8Array(buf);
    let s = "";
    for (let i = 0; i < u.length; i += 32768) {
        s += String.fromCharCode.apply(null, u.subarray(i, i + 32768));
    }
    return btoa(s);
};
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name !== "gplex-xhr") {
        return;
    }
    // (requests come only from Gplex's own pages, through relay.js)
    if (!port.sender || !port.sender.tab) {
        port.disconnect();
        return;
    }
    const ac = new AbortController();
    let timer = 0;
    let finished = false;
    const send = function(m) {
        try {
            port.postMessage(m);
        } catch (e) {}
    };
    port.onDisconnect.addListener(function() {
        if (!finished) {
            ac.abort();
        }
    });
    port.onMessage.addListener(async function(req) {
        if (req.abort) {
            ac.abort();
            return;
        }
        let u;
        try {
            u = new URL(req.url);
        } catch (e) {
            send({ type: "error" });
            return;
        }
        if (!/^https?:$/.test(u.protocol) || !GPLEX.connect.some(function(h) { return u.hostname === h || u.hostname.endsWith("." + h); })) {
            send({ type: "error" });
            return;
        }
        if (req.timeout) {
            timer = setTimeout(function() {
                finished = true;
                ac.abort();
                send({ type: "timeout" });
            }, req.timeout);
        }
        let body;
        if (typeof req.dataB64 === "string") {
            const bin = atob(req.dataB64);
            body = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) {
                body[i] = bin.charCodeAt(i);
            }
        } else if (typeof req.data === "string") {
            body = req.data;
        }
        try {
            const r = await fetch(u.href, {
                method: req.method || "GET", headers: req.headers || {}, body: body,
                credentials: req.anonymous ? "omit" : "include", signal: ac.signal, redirect: "follow"
            });
            let h = "";
            r.headers.forEach(function(v, k) {
                h += k + ": " + v + "\r\n";
            });
            send({ type: "headers", readyState: 2, status: r.status, statusText: r.statusText, headers: h, url: r.url });
            const out = { type: "load", readyState: 4, status: r.status, statusText: r.statusText, headers: h, url: r.url };
            if (req.responseType === "arraybuffer" || req.responseType === "blob") {
                out.b64 = toB64(await r.arrayBuffer());
                out.mime = r.headers.get("content-type") || "";
            } else {
                const t = await r.text();
                if (req.responseType === "json") {
                    try {
                        out.response = JSON.parse(t);
                    } catch (e) {
                        out.response = null;
                    }
                } else {
                    out.response = t;
                }
            }
            clearTimeout(timer);
            finished = true;
            send(out);
        } catch (e) {
            clearTimeout(timer);
            if (!finished) {
                finished = true;
                send({ type: "error" });
            }
        }
    });
});
