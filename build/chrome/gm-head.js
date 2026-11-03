// Gplex Extended for Chrome: Gplex in the page, as a userscript manager runs it. This part gives it
// the userscript functions (GM_getValue and the rest); the settings come from the extension's side
// (relay.js) over a private MessageChannel, and Gplex starts once they are here (a few milliseconds).
(function() {
var __gplexBoot = (function() {
    "use strict";
    // (the channel to relay.js: a stand-in that drops what is sent until relay.js has answered on one)
    let port = { postMessage: function() {} };
    let values = {};
    let got = false, started = false, runFn = null;
    const clone = function(v) {
        return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
    };
    const menu = [];
    const xhrs = {};
    let xid = 0;
    const api = {};
    api.GM_getValue = function(k, d) {
        return Object.prototype.hasOwnProperty.call(values, k) ? clone(values[k]) : d;
    };
    api.GM_setValue = function(k, v) {
        values[k] = clone(v);
        port.postMessage({ type: "set", key: String(k), value: values[k] });
    };
    api.GM_deleteValue = function(k) {
        delete values[k];
        port.postMessage({ type: "delete", key: String(k) });
    };
    api.GM_listValues = function() {
        return Object.keys(values);
    };
    api.GM_registerMenuCommand = function(name, fn) {
        menu.push({ name: String(name), fn: fn });
        return menu.length - 1;
    };
    const man = __GPLEX_INFO__;
    api.GM_info = { script: { name: man.name, version: man.version, description: man.description },
        scriptHandler: "Gplex Extended for Chrome", version: man.version };
    api.unsafeWindow = window;
    api.GM_xmlhttpRequest = function(d) {
        d = d || {};
        const id = ++xid;
        let done = false;
        const call = function(name, r) {
            if (typeof d[name] === "function") {
                try {
                    d[name](r);
                } catch (e) {
                    console.error("Gplex Extended:", e);
                }
            }
        };
        xhrs[id] = function(m) {
            if (done) {
                return;
            }
            const r = { readyState: m.readyState || 0, status: m.status || 0, statusText: m.statusText || "",
                responseHeaders: m.headers || "", finalUrl: m.url || d.url, response: m.response,
                responseText: typeof m.response === "string" ? m.response : "" };
            if (m.type === "headers") {
                call("onreadystatechange", r);
                return;
            }
            done = true;
            delete xhrs[id];
            if (m.type === "load") {
                r.readyState = 4;
                call("onreadystatechange", r);
                call("onload", r);
            } else {
                call(m.type === "timeout" ? "ontimeout" : "onerror", r);
            }
            call("onloadend", r);
        };
        let url = String(d.url);
        try {
            url = new URL(url, location.href).href;
        } catch (e) {}
        const req = { method: d.method || "GET", url: url, headers: d.headers || {}, responseType: d.responseType || "",
            anonymous: !!d.anonymous, timeout: d.timeout || 0 };
        const data = d.data;
        if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
            const u = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            let s = "";
            for (let i = 0; i < u.length; i += 32768) {
                s += String.fromCharCode.apply(null, u.subarray(i, i + 32768));
            }
            req.dataB64 = btoa(s);
        } else if (data !== undefined && data !== null) {
            req.data = String(data);
        }
        port.postMessage({ type: "xhr", id: id, req: req });
        return {
            abort: function() {
                if (done) {
                    return;
                }
                done = true;
                delete xhrs[id];
                port.postMessage({ type: "xhr-abort", id: id });
                call("onabort", {});
            }
        };
    };
    const go = function() {
        if (started || !runFn) {
            return;
        }
        started = true;
        runFn(api.GM_getValue, api.GM_setValue, api.GM_deleteValue, api.GM_listValues, api.GM_registerMenuCommand,
            api.GM_xmlhttpRequest, api.GM_info, api.unsafeWindow);
    };
    const onMessage = function(e) {
        const m = e.data || {};
        if (m.type === "values") {
            if (!got) {
                got = true;
                port = e.target;
                values = m.values || {};
                go();
            }
        } else if (m.type === "changed") {
            Object.keys(m.set || {}).forEach(function(k) {
                values[k] = m.set[k];
            });
            (m.del || []).forEach(function(k) {
                delete values[k];
            });
        } else if (m.type === "xhr") {
            if (xhrs[m.id]) {
                xhrs[m.id](m.ev || {});
            }
        } else if (m.type === "menu") {
            port.postMessage({ type: "menu-items", rid: m.rid, items: menu.map(function(x) { return x.name; }) });
        } else if (m.type === "run") {
            const it = menu[m.index];
            if (it) {
                try {
                    it.fn();
                } catch (err) {
                    console.error("Gplex Extended:", err);
                }
            }
        }
    };
    // hand a channel to relay.js, and again every 100 ms until it answers: the two sides are started
    // separately, and a first hello that went out before relay.js was listening left Gplex starting
    // after 2.5 seconds with its defaults (the pages away from www.google.com then in 2015's look)
    let hellos = 0;
    const hello = function() {
        if (got) {
            return;
        }
        const ch = new MessageChannel();
        ch.port1.onmessage = onMessage;
        window.postMessage({ gplexHello: 1 }, "*", [ch.port2]);
        if (++hellos < 25) {
            setTimeout(hello, 100);
        }
    };
    hello();
    // (if the extension's side never answers - the extension was just updated or turned off - Gplex
    // still starts, with its defaults)
    setTimeout(function() {
        if (!got) {
            got = true;
            console.log("[Gplex] the settings did not come from the extension in 2.5 seconds; starting with the defaults");
            go();
        }
    }, 2500);
    return { start: function(fn) {
        runFn = fn;
        if (got) {
            go();
        }
    } };
})();
__gplexBoot.start(function(GM_getValue, GM_setValue, GM_deleteValue, GM_listValues, GM_registerMenuCommand, GM_xmlhttpRequest, GM_info, unsafeWindow) {
