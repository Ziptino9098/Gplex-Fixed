// ---- launcher (outside ugfStarTube): where and how the YouTube part runs ----

// The extension builds run as content scripts in a world of their own, where V3's data on its
// elements can't be seen: there the YouTube part is handed to the page itself, with Gplex's values
// and a way to save them back. True when the page took it.
function ugfStarTubeInPage() {
    if (typeof unsafeWindow !== "undefined" || window.wrappedJSObject || typeof window.ytcfg !== "undefined" ||
        !document.querySelector("script[nonce]")) {
        return false;
    }
    const keys = ["UGF_LAYOUT", "UGF_EARLY2016", "UGF_LATE2016", "UGF_2014V", "UGF_STARTUBE_ON", "UGF_ST_layoutPick", "UGF_ST_dark"];
    const vals = {};
    keys.forEach(function(k) {
        try {
            const v = GM_getValue(k, null);
            if (v !== null && v !== undefined) {
                vals[k] = v;
            }
        } catch (e) {}
    });
    const ev = "ugf-st-save-" + Math.random().toString(36).slice(2);
    document.addEventListener(ev, function(e) {
        try {
            const m = JSON.parse(String(e.detail));
            if (!/^UGF_ST_[\w.-]{1,80}$/.test(m.k)) {
                return;
            }
            if (m.del) {
                GM_deleteValue(m.k);
            } else if (typeof m.v === "string" && m.v.length < 2000) {
                GM_setValue(m.k, m.v);
            }
        } catch (err) {}
    });
    let ver = "";
    try {
        ver = GM_info.script.version;
    } catch (e) {}
    const code = "(function() {\n" +
        "document.documentElement.setAttribute('data-ugf-st', 'page');\n" +
        "var ugfV = " + JSON.stringify(vals) + ";\n" +
        "var ugfSave = function(m) { document.dispatchEvent(new CustomEvent(" + JSON.stringify(ev) + ", { detail: JSON.stringify(m) })); };\n" +
        "var GM_getValue = function(k, d) { return Object.prototype.hasOwnProperty.call(ugfV, k) ? ugfV[k] : d; };\n" +
        "var GM_setValue = function(k, v) { ugfV[k] = String(v); ugfSave({ k: k, v: String(v) }); };\n" +
        "var GM_deleteValue = function(k) { delete ugfV[k]; ugfSave({ k: k, del: 1 }); };\n" +
        "var GM_info = { script: { name: 'Gplex Extended', version: " + JSON.stringify(ver) + " } };\n" +
        "var ugfTTPolicy = (function() { try { if (window.trustedTypes && window.trustedTypes.createPolicy) { return window.trustedTypes.createPolicy('gplex-tt-page', { createHTML: function(s) { return s; } }); } } catch (e) {} return null; })();\n" +
        ugfTT.toString() + "\n" +
        ugfStarTube.toString() + "\n" +
        "try { ugfStarTube(); } catch (e) { console.error('Gplex Extended for YouTube:', e); }\n" +
        "})();";
    let text = code;
    try {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            text = window.trustedTypes.createPolicy("gplex-st-page", { createScript: function(s) { return s; } }).createScript(code);
        }
    } catch (e) {}
    const s = document.createElement("script");
    s.nonce = document.querySelector("script[nonce]").nonce || "";
    try {
        s.text = text;
    } catch (e) {
        s.textContent = code;
    }
    (document.head || document.documentElement).appendChild(s);
    s.remove();
    return document.documentElement.getAttribute("data-ugf-st") === "page";
}
// No AI features on YouTube either: the "Ask" button and its panel, and AI summaries
function ugfYouTubeNoAI() {
    try {
        const st = document.createElement("style");
        st.id = "ugf-youtube-no-ai";
        st.textContent = [
            'button[aria-label="Ask"]', 'yt-button-view-model:has(> button-view-model > button[aria-label="Ask"])',
            'ytd-button-renderer:has(button[aria-label="Ask"])', 'you-chat-item-view-model',
            'ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"]',
            'ytd-engagement-panel-section-list-renderer[target-id*="ai-summary"]',
            'ytd-expandable-metadata-renderer[has-video-summary]', 'video-summary-content-view-model',
            'ytd-video-description-ai-summary-renderer'
        ].map(function(x) { return x + " { display: none !important; }"; }).join("\n");
        const add = function() {
            if (!st.isConnected && (document.head || document.documentElement)) {
                (document.head || document.documentElement).appendChild(st);
            }
        };
        add();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", add, { once: true });
        }
        window.addEventListener("load", add, { once: true });
    } catch (e) {}
}
if (ugfOnYouTube && !ugfYtmTakesOver() && !ugfYtmPlayerFrame()) {
    (function() {
        ugfYouTubeNoAI();
        const get = function(k, d) {
            try {
                const v = typeof GM_getValue === "function" ? GM_getValue(k, null) : null;
                return v === null || v === undefined ? d : String(v);
            } catch (e) {
                return d;
            }
        };
        if (get("UGF_STARTUBE_ON", "true") === "false") {
            return;
        }
        const run = function() {
            try {
                if (!ugfStarTubeInPage()) {
                    ugfStarTube();
                }
            } catch (e) {
                console.error("Gplex Extended for YouTube:", e);
            }
        };
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", run, { once: true });
        } else {
            run();
        }
    })();
}
