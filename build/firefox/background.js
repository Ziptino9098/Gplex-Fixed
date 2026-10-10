// Gplex Extended add-on: background page.
//  - keeps the settings (what the userscript kept with GM_setValue) in the add-on's storage
//  - registers Gplex to run at the start of every matching page, with the current settings in front
//    of it, so Gplex reads them at once, as it does in a userscript manager
//  - makes GM_xmlhttpRequest's requests
// GPLEX (the pages, the files) is put in front of this file by build-firefox.js.
/* global GPLEX, browser */
"use strict";
let values = {};
let registered = null;
// every change to the settings re-registers Gplex; pages that start loading meanwhile wait for it
let ready = Promise.resolve();

function register() {
    return (async function() {
        if (registered) {
            try {
                await registered.unregister();
            } catch (e) {}
            registered = null;
        }
        registered = await browser.contentScripts.register({
            matches: GPLEX.matches,
            excludeMatches: GPLEX.excludeMatches.length ? GPLEX.excludeMatches : undefined,
            excludeGlobs: GPLEX.excludeGlobs.length ? GPLEX.excludeGlobs : undefined,
            js: [{ code: "var GPLEX_VALUES = " + JSON.stringify(values) + ";" }].concat(GPLEX.files.map(function(f) {
                return { file: f };
            })),
            runAt: "document_start",
            allFrames: true
        });
    })();
}
function update() {
    ready = ready.then(register, register).catch(function(e) {
        console.error("Gplex Extended: could not register", e);
    });
    return ready;
}
let saveTimer = 0;
function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function() {
        browser.storage.local.set({ values: values });
    }, 50);
}

ready = browser.storage.local.get("values").then(function(r) {
    values = (r && r.values) || {};
}).then(register).catch(function(e) {
    console.error("Gplex Extended: could not start", e);
});

// a page Gplex works on waits (usually not at all) until Gplex is registered with the latest settings
browser.webRequest.onBeforeRequest.addListener(function() {
    return ready.then(function() {
        return {};
    });
}, { urls: GPLEX.matches, types: ["main_frame", "sub_frame"] }, ["blocking"]);

browser.runtime.onMessage.addListener(function(m, sender) {
    if (!m || typeof m.type !== "string") {
        return undefined;
    }
    if (m.type === "gplex-set" && typeof m.key === "string") {
        values[m.key] = m.value;
        save();
        update();
        return undefined;
    }
    if (m.type === "gplex-delete" && typeof m.key === "string") {
        delete values[m.key];
        save();
        update();
        return undefined;
    }
    // the toolbar button's settings export and import (not from pages)
    if (sender.url && sender.url.indexOf(browser.runtime.getURL("")) === 0) {
        if (m.type === "gplex-export") {
            return Promise.resolve(values);
        }
        if (m.type === "gplex-import" && m.values && typeof m.values === "object") {
            values = m.values;
            browser.storage.local.set({ values: values });
            return update().then(function() {
                return Object.keys(values).length;
            });
        }
    }
    return undefined;
});

browser.runtime.onConnect.addListener(function(port) {
    if (port.name !== "gplex-xhr") {
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
        // only the services Gplex asks for (its @connect list and the pages it runs on)
        if (!GPLEX.connect.some(function(h) { return u.hostname === h || u.hostname.endsWith("." + h); })) {
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
        try {
            const r = await fetch(u.href, {
                method: req.method, headers: req.headers,
                body: req.data === undefined || req.data === null ? undefined : req.data,
                credentials: req.anonymous ? "omit" : "include", signal: ac.signal, redirect: "follow"
            });
            let h = "";
            r.headers.forEach(function(v, k) {
                h += k + ": " + v + "\r\n";
            });
            send({ type: "headers", readyState: 2, status: r.status, statusText: r.statusText, headers: h, url: r.url });
            let resp;
            if (req.responseType === "arraybuffer") {
                resp = await r.arrayBuffer();
            } else if (req.responseType === "blob") {
                resp = await r.blob();
            } else {
                const t = await r.text();
                if (req.responseType === "json") {
                    try {
                        resp = JSON.parse(t);
                    } catch (e) {
                        resp = null;
                    }
                } else {
                    resp = t;
                }
            }
            clearTimeout(timer);
            finished = true;
            send({ type: "load", readyState: 4, status: r.status, statusText: r.statusText, headers: h, url: r.url, response: resp });
        } catch (e) {
            clearTimeout(timer);
            if (!finished) {
                finished = true;
                send({ type: "error" });
            }
        }
    });
});
