// ---- Gplex YouTube: settings and the era ----
// Everything Gplex YouTube remembers lives in Gplex's storage (GM_getValue), next to the Gplex layout.
const PREFS = {
    on: "UGF_YT_ON",              // "true" (default) or "false": whether Gplex draws YouTube at all
    layout: "UGF_YT_LAYOUT",      // "auto" (follow the Gplex layout) or a YouTube year from ERAS
    autoplay: "UGF_YT_AUTOPLAY",  // "true" (default): play the next video when one ends (2015+)
    theater: "UGF_YT_THEATER",    // "true": the wide player on the watch page
    guide: "UGF_YT_GUIDE",        // "closed": the guide is folded away (2014+)
    volume: "UGF_YT_VOLUME",      // 0-100, and "muted"
    quality: "UGF_YT_QUALITY",    // a quality level the viewer picked, or "auto"
    rate: "UGF_YT_RATE"           // the playback speed, 1 by default
};
function pref(key, fallback) {
    try {
        const v = GM_getValue(PREFS[key] || key, null);
        return v === null || v === undefined ? fallback : String(v);
    } catch (e) {
        return fallback;
    }
}
function setPref(key, value) {
    try {
        GM_setValue(PREFS[key] || key, String(value));
    } catch (e) {}
}

// The YouTube years Gplex draws, oldest first. "2017" and "2019" are the Polymer looks.
const ERAS = ["2010", "2012", "2013", "2014", "2015", "2016", "2017", "2019"];
// The three families of page structure: the classic white site, Hitchhiker (2013-2017), Polymer.
const FAMILIES = { "2010": "classic", "2012": "classic", "2013": "hh", "2014": "hh", "2015": "hh", "2016": "hh", "2017": "poly", "2019": "poly" };

// The Gplex layout, with its variants, as the settings page stores it.
function gplexLayout() {
    const l = pref("UGF_LAYOUT", "2015");
    if (l === "2014") {
        const v = pref("UGF_2014V", "");
        if (v) {
            return v;
        }
    }
    if (l === "2016" && pref("UGF_EARLY2016", "") === "true") {
        return "2016E";
    }
    if (l === "2016" && pref("UGF_LATE2016", "") === "true") {
        return "2016N";
    }
    return l;
}
// The YouTube year for a Gplex layout; null means YouTube's own site (the 2022 layout).
function eraForLayout(layout) {
    if (layout === "2022") {
        return null;
    }
    if (layout === "2013N" || layout === "2014E") {
        return "2014";                // YouTube's October 2013 centre-aligned site is the 2014 look
    }
    const y = parseInt(layout, 10);
    if (!y || y <= 2011) {
        return "2010";
    }
    if (y <= 2016) {
        return String(y);
    }
    return y <= 2018 ? "2017" : "2019";
}
function currentEra() {
    const pick = pref("layout", "auto");
    return ERAS.includes(pick) ? pick : eraForLayout(gplexLayout());
}
const ERA = currentEra();
const FAMILY = FAMILIES[ERA] || "hh";
const IS = { classic: FAMILY === "classic", hh: FAMILY === "hh", poly: FAMILY === "poly" };
const YEAR = parseInt(ERA, 10) || 2015;
// body classes YouTube's own stylesheets key the year's variations on
const ERA_BODY_CLASS = { "2016": "exp-searchbox-redesign" };
// the classic site showed 4:3 pictures (letterboxed), the later ones 16:9
const THUMB_SIZE = FAMILIES[ERA] === "classic" ? "hq" : "mq";

const ORIGIN = "https://www.youtube.com";
const GPLEX_VERSION = (function() {
    try {
        return GM_info.script.version;
    } catch (e) {
        return "";
    }
})();
