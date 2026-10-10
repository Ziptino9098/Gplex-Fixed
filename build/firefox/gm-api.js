// Gplex Extended add-on: the userscript functions Gplex uses (GM_getValue and the rest), made from
// the add-on's own storage and background page. Runs before Gplex in every page Gplex works on.
// GPLEX_VALUES (the saved settings) is put in front of this file by the background page.
/* global GPLEX_VALUES, browser */
var GM_getValue, GM_setValue, GM_deleteValue, GM_listValues, GM_registerMenuCommand, GM_xmlhttpRequest, GM_info, unsafeWindow;
(function() {
    "use strict";
    const values = typeof GPLEX_VALUES === "object" && GPLEX_VALUES ? GPLEX_VALUES : {};
    const clone = function(v) {
        return v === undefined ? undefined : JSON.parse(JSON.stringify(v));
    };

    GM_getValue = function(k, d) {
        return Object.prototype.hasOwnProperty.call(values, k) ? clone(values[k]) : d;
    };
    // a change goes straight to the background page, which saves it and hands it to the next pages
    GM_setValue = function(k, v) {
        values[k] = clone(v);
        browser.runtime.sendMessage({ type: "gplex-set", key: k, value: values[k] }).catch(function() {});
    };
    GM_deleteValue = function(k) {
        delete values[k];
        browser.runtime.sendMessage({ type: "gplex-delete", key: k }).catch(function() {});
    };
    GM_listValues = function() {
        return Object.keys(values);
    };
    // changes made in other tabs
    browser.storage.onChanged.addListener(function(changes, area) {
        if (area !== "local" || !changes.values) {
            return;
        }
        const nv = changes.values.newValue || {};
        Object.keys(values).forEach(function(k) {
            if (!(k in nv)) {
                delete values[k];
            }
        });
        Object.keys(nv).forEach(function(k) {
            values[k] = nv[k];
        });
    });

    // the page's own objects (Firefox shows content scripts the page through Xray wrappers)
    unsafeWindow = window.wrappedJSObject || window;

    const manifest = browser.runtime.getManifest();
    GM_info = {
        script: { name: manifest.name, version: manifest.version, description: manifest.description },
        scriptHandler: "Gplex Extended add-on",
        version: manifest.version
    };

    // menu commands: listed in the add-on's toolbar button (top page only)
    const menu = [];
    GM_registerMenuCommand = function(name, fn) {
        menu.push({ name: String(name), fn: fn });
        return menu.length - 1;
    };
    if (window === window.top) {
        browser.runtime.onMessage.addListener(function(m) {
            if (m && m.type === "gplex-menu") {
                return Promise.resolve({ url: location.href, items: menu.map(function(x) { return x.name; }) });
            }
            if (m && m.type === "gplex-run" && menu[m.index]) {
                try {
                    menu[m.index].fn();
                } catch (e) {
                    console.error("Gplex Extended:", e);
                }
                return Promise.resolve(true);
            }
            return undefined;
        });
    }

    // requests to Google's services, made by the background page (as a userscript manager does)
    GM_xmlhttpRequest = function(d) {
        d = d || {};
        const port = browser.runtime.connect({ name: "gplex-xhr" });
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
        port.onMessage.addListener(function(m) {
            if (done) {
                return;
            }
            const r = {
                readyState: m.readyState || 0, status: m.status || 0, statusText: m.statusText || "",
                responseHeaders: m.headers || "", finalUrl: m.url || d.url,
                response: m.response, responseText: typeof m.response === "string" ? m.response : (m.text || "")
            };
            if (m.type === "headers") {
                call("onreadystatechange", r);
            } else if (m.type === "load") {
                done = true;
                r.readyState = 4;
                call("onreadystatechange", r);
                call("onload", r);
                call("onloadend", r);
                port.disconnect();
            } else if (m.type === "error" || m.type === "timeout") {
                done = true;
                call(m.type === "timeout" ? "ontimeout" : "onerror", r);
                call("onloadend", r);
                port.disconnect();
            }
        });
        port.postMessage({
            method: d.method || "GET", url: String(d.url), headers: d.headers || {}, data: d.data,
            responseType: d.responseType || "", anonymous: !!d.anonymous, timeout: d.timeout || 0
        });
        return {
            abort: function() {
                if (done) {
                    return;
                }
                done = true;
                try {
                    port.postMessage({ abort: true });
                    port.disconnect();
                } catch (e) {}
                call("onabort", {});
            }
        };
    };
})();
