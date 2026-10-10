// Gplex Extended for Chrome: the extension's side of every page Gplex works on (Chrome's "isolated
// world"). Gplex itself runs in the page (gplex.js, the "main world"), as it does in a userscript
// manager, because it reads the page's own objects (Gmail's, Maps', YouTube's). This file keeps its
// settings in the extension's storage, makes its GM_xmlhttpRequest requests through the service
// worker, and lists its menu commands in the toolbar button. The two sides talk over a private
// MessageChannel that gplex.js hands over before any of the page's own scripts have run.
/* global chrome */
(function() {
    "use strict";
    if (window.__gplexRelay) {
        return;
    }
    window.__gplexRelay = true;
    const P = "v:";                      // each setting is kept as "v:<name>" in chrome.storage.local
    let port = null;
    const readAll = function() {
        return chrome.storage.local.get(null).then(function(all) {
            const v = {};
            Object.keys(all || {}).forEach(function(k) {
                if (k.indexOf(P) === 0) {
                    v[k.slice(P.length)] = all[k];
                }
            });
            return v;
        });
    };
    const first = readAll();             // (started at once: Gplex waits for it)
    const onHello = function(e) {
        if (port || e.source !== window || !e.data || e.data.gplexHello !== 1 || !e.ports || !e.ports[0]) {
            return;
        }
        e.stopImmediatePropagation();
        window.removeEventListener("message", onHello, true);
        port = e.ports[0];
        port.onmessage = fromGplex;
        first.then(function(v) {
            port.postMessage({ type: "values", values: v });
        }, function() {
            port.postMessage({ type: "values", values: {} });
        });
    };
    window.addEventListener("message", onHello, true);

    // settings changed in other tabs (and this one's own, harmlessly)
    chrome.storage.onChanged.addListener(function(ch, area) {
        if (area !== "local" || !port) {
            return;
        }
        const set = {}, del = [];
        Object.keys(ch).forEach(function(k) {
            if (k.indexOf(P) === 0) {
                if ("newValue" in ch[k]) {
                    set[k.slice(P.length)] = ch[k].newValue;
                } else {
                    del.push(k.slice(P.length));
                }
            }
        });
        if (Object.keys(set).length || del.length) {
            port.postMessage({ type: "changed", set: set, del: del });
        }
    });

    const xhrs = {};
    const menuWait = {};
    function fromGplex(e) {
        const m = e.data || {};
        if (m.type === "set" && typeof m.key === "string") {
            const o = {};
            o[P + m.key] = m.value;
            chrome.storage.local.set(o).catch(function() {});
        } else if (m.type === "delete" && typeof m.key === "string") {
            chrome.storage.local.remove(P + m.key).catch(function() {});
        } else if (m.type === "xhr") {
            request(m.id, m.req || {});
        } else if (m.type === "xhr-abort") {
            const p = xhrs[m.id];
            delete xhrs[m.id];
            if (p) {
                try {
                    p.postMessage({ abort: true });
                    p.disconnect();
                } catch (err) {}
            }
        } else if (m.type === "menu-items") {
            const cb = menuWait[m.rid];
            delete menuWait[m.rid];
            if (cb) {
                cb(m.items || []);
            }
        }
    }

    // GM_xmlhttpRequest: the service worker makes the request (it may reach the hosts Gplex names;
    // the page can't); bytes come back as base64, since Chrome's extension messages carry only JSON
    function request(id, req) {
        let p;
        try {
            p = chrome.runtime.connect({ name: "gplex-xhr" });
        } catch (err) {
            port.postMessage({ type: "xhr", id: id, ev: { type: "error" } });
            return;
        }
        xhrs[id] = p;
        p.onMessage.addListener(function(r) {
            if (!xhrs[id]) {
                return;
            }
            let resp = r.response;
            if (typeof r.b64 === "string") {
                const bin = atob(r.b64);
                const u = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) {
                    u[i] = bin.charCodeAt(i);
                }
                resp = req.responseType === "blob" ? new Blob([u], { type: r.mime || "" }) : u.buffer;
            }
            const ev = Object.assign({}, r, { response: resp });
            delete ev.b64;
            port.postMessage({ type: "xhr", id: id, ev: ev });
            if (r.type !== "headers") {
                delete xhrs[id];
                try {
                    p.disconnect();
                } catch (err) {}
            }
        });
        p.onDisconnect.addListener(function() {
            if (xhrs[id]) {
                delete xhrs[id];
                port.postMessage({ type: "xhr", id: id, ev: { type: "error" } });
            }
        });
        p.postMessage(req);
    }

    // the toolbar button: the page's Gplex menu commands (top page only)
    if (window === window.top) {
        chrome.runtime.onMessage.addListener(function(m, sender, reply) {
            if (!m || !port) {
                return undefined;
            }
            if (m.type === "gplex-menu") {
                const rid = String(Math.random());
                menuWait[rid] = function(items) {
                    reply({ url: location.href, items: items });
                };
                port.postMessage({ type: "menu", rid: rid });
                setTimeout(function() {
                    if (menuWait[rid]) {
                        delete menuWait[rid];
                        reply({ url: location.href, items: [] });
                    }
                }, 1500);
                return true;
            }
            if (m.type === "gplex-run") {
                port.postMessage({ type: "run", index: m.index });
                reply(true);
            }
            return undefined;
        });
    }
})();
