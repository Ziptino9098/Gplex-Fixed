// ---- core: settings, the era table, V3 bridge, helpers, InnerTube ----

// Firefox's add-on build sees the page through Xray wrappers, which hide what V3 keeps on the
// elements (el.data) and the page's own yt object: both are read and written through the page's view
if (window.wrappedJSObject && typeof cloneInto === "function") {
    try {
        Object.defineProperty(HTMLElement.prototype, "data", {
            configurable: true,
            get: function() {
                const w = this.wrappedJSObject;
                return w ? w.data : undefined;
            },
            set: function(v) {
                const w = this.wrappedJSObject;
                if (w) {
                    w.data = v && typeof v === "object" ? cloneInto(v, window, { cloneFunctions: true }) : v;
                }
            }
        });
    } catch (e) {}
}
// the page's yt object (YouTube's config)
function pageYt() {
    return (window.wrappedJSObject || window).yt;
}

// Gplex's storage (GM_* in the userscript; the in-page runner shims them)
function pref(key, fallback) {
    try {
        const v = GM_getValue(key, null);
        return v === null || v === undefined ? fallback : String(v);
    } catch (e) {
        return fallback;
    }
}
function setPref(key, value) {
    try {
        GM_setValue(key, String(value));
    } catch (e) {}
}

// the Gplex layout, as the rest of Gplex reads it (UGF_LAYOUT plus its sub-choices)
function gplexLayout() {
    let l = pref("UGF_LAYOUT", "2015");
    if (l === "2016" && pref("UGF_EARLY2016", "") === "true") {
        l = "2016E";
    }
    if (l === "2016" && pref("UGF_LATE2016", "") === "true") {
        l = "2016N";
    }
    if (l === "2014") {
        const v = pref("UGF_2014V", "");
        if (v === "2013N" || v === "2014E" || v === "2014N") {
            l = v;
        }
    }
    return l;
}

// YouTube's layout of each Gplex layout's years
const ERA_OF_LAYOUT = {
    "1997": "cloudgazer2007_1", "1998": "cloudgazer2007_1", "1998B": "cloudgazer2007_1", "1998N": "cloudgazer2007_1", "1999": "cloudgazer2007_1", "2000": "cloudgazer2007_1",
    "2001": "cloudgazer2007_1", "2002": "cloudgazer2007_1", "2003": "cloudgazer2007_1", "2005": "cloudgazer2007_1",
    "2006": "cloudgazer2007_1", "retro": "cloudgazer2007_1",
    "2007": "stargazer2008_1", "2009": "stargazer2009_1", "2009L": "stargazer2009_3", "2010N": "aozora2010_1",
    "2012": "cosmic2012_1", "2013": "hh2013_2", "2013L": "hh2013_2", "2013N": "hh2013_3", "2014E": "hh2013_3", "2014": "hh2014",
    "2014N": "hhE2015", "2015L": "hhE2015", "2015": "hh2015", "2015N": "hh2015", "2016E": "hhE2016", "2016L": "hhM2016",
    "2016": "hhM2016", "2016C": "hhM2016", "2016N": "hh2016", "2018": "poly2017", "2018M": "poly2018", "2019": "poly2019",
    "2022": "poly2022"
};
// the black Google bar: YouTube had it from 2011 to late 2013 (the 2011 bar in 2012's look, its
// 2012 update in 2013's)
function gbarFor(layout) {
    return layout === "2012" ? "classic" : layout === "2013" || layout === "2013L" ? "modern" : "off";
}
// the era to show: the one picked by hand on the settings page, else the Gplex layout's
function currentEra() {
    const pick = pref("UGF_ST_layoutPick", "auto");
    if (pick !== "auto" && ERAS[pick]) {
        return pick;
    }
    const l = gplexLayout();
    return Object.prototype.hasOwnProperty.call(ERA_OF_LAYOUT, l) ? ERA_OF_LAYOUT[l] : "hh2015";
}

// ---- the eras. One row per YouTube look, resolved from StarTube 2.7's presets (its layout
// chains, run once; see youtube/README.md). watch = which watch page build, player = which
// player chrome, flags = the behaviours that differ (StarTube's "experiments", now facts).
const ERAS = {
    cloudgazer2007_1: { family: "stargazer", year: "2007", name: "2007", header: "tabbed-cirrus", watch: "watch3", player: "aozora2010", favicon: "2005", font: "arial", account: "me", channel: "c3", relatedSize: "smaller", compactName: true, logoLink: "home", v3: "cosmic", flexwatch: true,
        flags: "MoreTooltips TrueScrollableGuide StaticSite CosmicGuideLayout NotifSquare NoGuide AozoraComments AozoraSearch HideYoodles" },
    stargazer2008_1: { family: "stargazer", year: "2008", name: "2008", header: "tabbed", watch: "watch4a", player: "aozora2010", favicon: "2005", font: "arial", account: "me", channel: "c3", relatedSize: "smaller", compactName: true, homeRedir: "feedList", logoLink: "feedList", v3: "cosmic", flexwatch: true,
        flags: "MoreTooltips TrueScrollableGuide StaticSite CosmicGuideLayout NotifSquare NoGuide AozoraComments AozoraSearch HideYoodles" },
    stargazer2009_1: { family: "stargazer", year: "2009", name: "Early 2009", header: "bar", watch: "watch4b", player: "aozora2010", favicon: "2005", font: "arial", account: "me", channel: "c3", relatedSize: "smaller", compactName: true, homeRedir: "feedList", logoLink: "feedList", v3: "cosmic", flexwatch: true,
        flags: "MoreTooltips TrueScrollableGuide StaticSite CosmicGuideLayout NotifSquare NoGuide AozoraComments AozoraSearch HideYoodles" },
    stargazer2009_3: { family: "stargazer", year: "2009", name: "Late 2009", header: "simple", watch: "watch4b", player: "aozora2010", favicon: "2005", font: "arial", account: "me", channel: "c3", relatedSize: "smaller", compactName: true, logoLink: "home", v3: "cosmic", flexwatch: true,
        flags: "MoreTooltips TrueScrollableGuide StaticSite CosmicGuideLayout NotifSquare NoGuide AozoraComments AozoraSearch HideYoodles" },
    aozora2010_1: { family: "aozora", year: "2010", name: "2010", watch: "watch5a", player: "aozora2010", favicon: "2010", font: "arial", account: "me", channel: "c3", relatedSize: "smaller", logoLink: "home", v3: "cosmic", flexwatch: true,
        flags: "MoreTooltips TrueScrollableGuide StaticSite CosmicGuideLayout NotifSquare GuideOnFeedsOnly AozoraComments AozoraSearch HideYoodles" },
    aozora2011_2: { family: "aozora", year: "2011", name: "2011", watch: "watch5c", player: "aozora2010", favicon: "2010", font: "arial", account: "me", channel: "c3", relatedSize: "smaller", logoLink: "home", v3: "cosmic", flexwatch: true,
        flags: "MoreTooltips TrueScrollableGuide StaticSite CosmicGuideLayout NotifSquare GuideOnFeedsOnly AozoraComments AozoraSearch HideYoodles" },
    cosmic2012_1: { family: "cosmic", year: "2012", name: "2012 (Cosmic Panda)", watch: "watch5d", player: "cosmic2012", favicon: "2012", font: "arial", account: "me", channel: "c3", relatedSize: "small", homeRedir: "feedList", logoLink: "feedList", subsGrid: "list", v3: "cosmic", flexwatch: true,
        flags: "MoreTooltips TrueScrollableGuide StaticSite CosmicBG CosmicButtons CosmicComments CosmicGuideLayout NotifSquare GuideOnFeedsOnly AozoraSearch HideYoodles" },
    hh2013_1: { family: "hh", year: "2013", name: "Early 2013", watch: "watch7", player: "default2014", favicon: "2012", font: "arial", account: "me", channel: "c3", relatedSize: "small", logoLink: "home", subsGrid: "list", v3: "hitchhiker13early",
        flags: "ClassicTitle ClassicGuide ClassicSubscribe ClassicLtod NotifSquare Channels3TimeVisible Channels3DateVisible" },
    hh2013_2: { family: "hh", year: "2013", name: "Mid 2013", watch: "watch7", player: "default2014", favicon: "2012", font: "arial", account: "me", channel: "c4", relatedSize: "small", logoLink: "home", subsGrid: "list", v3: "hitchhiker13mid",
        flags: "ClassicLtod NotifSquare" },
    hh2013_3: { family: "hh", year: "2013", name: "Late 2013", watch: "watch7", player: "default2014", favicon: "2012", font: "arial", account: "me", channel: "c4", relatedSize: "small", logoLink: "home", subsGrid: "list", v3: "hitchhiker13",
        flags: "" },
    hh2014: { family: "hh", year: "2014", name: "2014", watch: "watch7", player: "default2014", favicon: "2012", font: "arial", account: "me", channel: "c4", relatedSize: "small", logoLink: "home", subsGrid: "list", v3: "nirvana14",
        flags: "PlaylistRedBorder PlaylistTimestamps" },
    hhE2015: { family: "hh", year: "2015", name: "Early 2015", watch: "watch8", player: "default2014", favicon: "2012", font: "arial", account: "mhh", channel: "c4", relatedSize: "small", logoLink: "home", v3: "nirvana15Early", flexwatch: true,
        flags: "MoveCountsToButtons NoVideosLink PlaylistRedBorder PlaylistTimestamps" },
    hh2015: { family: "hh", year: "2015", name: "2015", watch: "watch8", player: "modernV1", favicon: "2015", font: "roboto", account: "mhh", channel: "c4", relatedSize: "small", logoLink: "home", guideSubsExpand: true, v3: "nirvana15", flexwatch: true,
        flags: "MoveCountsToButtons NoVideosLink PlaylistRedBorder PlaylistTimestamps TrueScrollableGuide" },
    hhE2016: { family: "hh", year: "2016", name: "Early 2016", watch: "watch8", player: "modernV1", favicon: "2015", font: "roboto", account: "mhh", channel: "c4", relatedSize: "small", logoLink: "home", guideSubsExpand: true, v3: "nirvana15", flexwatch: true,
        flags: "MoveCountsToButtons Sharrow FlatLogo NoVideosLink ModernGuide PlaylistRedBorder PlaylistTimestamps TrueScrollableGuide NoByText RoundedTopbarPfp HideYoodles" },
    hhM2016: { family: "hh", year: "2016", name: "Mid 2016", watch: "watch8", player: "modernV2", favicon: "2015", font: "roboto", account: "mhh", channel: "c4", relatedSize: "small", searchText: true, logoLink: "home", guideSubsExpand: true, v3: "nirvana16", flexwatch: true,
        flags: "MoveCountsToButtons Sharrow FlatLogo NoVideosLink ModernGuide PlaylistTimestamps TrueScrollableGuide ViewsString NoByText RoundedTopbarPfp HideYoodles" },
    hh2016: { family: "hh", year: "2016", name: "Late 2016", watch: "watch8", player: "modernV2", favicon: "2015", font: "roboto", account: "mhh", channel: "c4", relatedSize: "large", searchText: true, logoLink: "home", guideSubsExpand: true, v3: "nirvana16", flexwatch: true,
        flags: "MoveCountsToButtons Sharrow FlatLogo NoVideosLink ModernGuide PlaylistTimestamps TrueScrollableGuide ViewsString NoByText RoundedTopbarPfp HideYoodles" },
    poly2017: { family: "poly", year: "2017", name: "2017", watch: "watch9a", player: "modernV2", favicon: "2017", font: "roboto", account: "poly", upload: "icon", apps: "yt", channel: "c4", relatedSize: "large", compactDate: true, searchText: true, logoLink: "home", v3: "poly17", flexwatch: true,
        flags: "MoreTooltips MoveCountsToButtons Sharrow InvertLogo ModernGuide PlaylistTimestamps TrueScrollableGuide ViewsString NoByText TopbarShadow WMRNoSaveText RoundedTopbarPfp HideYoodles" },
    poly2018: { family: "poly", year: "2018", name: "2018", watch: "watch9a", player: "modernV2", favicon: "2017", font: "roboto", account: "poly", upload: "create", apps: "yt", channel: "c4", relatedSize: "large", compactDate: true, spinner: "material", searchText: true, logoLink: "home", v3: "poly17", flexwatch: true,
        flags: "MoreTooltips MoveCountsToButtons Sharrow InvertLogo ModernGuide PlaylistTimestamps TrueScrollableGuide ViewsString NoByText CenteredSearch TopbarShadow RoundedTopbarPfp HideYoodles" },
    poly2019: { family: "poly", year: "2019", name: "2019", watch: "watch9a", player: "modernV2", favicon: "2017", font: "roboto", account: "poly", upload: "create", apps: "yt", channel: "c4", relatedSize: "large", compactDate: true, spinner: "material", searchText: true, logoLink: "home", v3: "poly17", flexwatch: true,
        flags: "MoreTooltips MoveCountsToButtons Sharrow InvertLogo ModernGuide PlaylistTimestamps TrueScrollableGuide ViewsString NoByText CenteredSearch TopbarShadow RoundedTopbarPfp HideYoodles" },
    poly2022: { family: "poly", year: "2022", name: "2022", watch: "watch10beta", player: "modernV4", favicon: "2017", font: "roboto", account: "poly", upload: "create", channel: "c4", relatedSize: "large", compactDate: true, spinner: "material", searchText: true, homeRedir: "feedGrid", logoLink: "feedGrid", outlineIcons: true, v3: "poly17", flexwatch: true,
        flags: "MoreTooltips MoveCountsToButtons Sharrow InvertLogo ModernGuide PlaylistTimestamps TrueScrollableGuide ViewsString NoByText CenteredSearch BigSearch RichGridHome WMRButtonsLowercase RoundedTopbarPfp HideYoodles" }
};
Object.keys(ERAS).forEach(function(id) {
    const e = ERAS[id];
    e.id = id;
    e.flags = new Set(e.flags.split(" ").filter(Boolean));
    e.subsGrid = e.subsGrid || "grid";
    e.upload = e.upload || "modern";
});
const ERA = ERAS[currentEra()];
const FAMILY = ERA.family;
function has(flag) {
    return ERA.flags.has(flag);
}

// ---- V3's own settings (localStorage v3_local_db, config.db.yt): the keys StarTube 2.7 set, by
// preset; every era writes the base, its preset and its player size rule
const V3_BASE = { APPBAR_GUIDE_IS_PART_OF_MASTHEAD_POSITIONER: true, FLASH7_PLAYER_STYLE: false, JFK_SIGN_IN: false, MATERIAL_C4: false,
    PLAYER_FORCE_MODERN_PLAYER_EMBED: false, PROMINENT_UPLOAD_BUTTON: false, USE_APPBAR_CONTEXT_CONTAINER: false,
    WATCH7_ACTION_PANELS_USE_ICONS: false, WATCH7_HIDE_ACTION_PANEL_TITLES: false, WATCH8: false };
// the 2014-2016 "nirvana" site: centred, guide in the app bar, cards
const V3_NIRVANA = { APPBAR_FLEXWATCH_MINI: true, APPBAR_GUIDE: true, APPBAR_GUIDE_BUTTON_SIMPLE_STYLE: true, APPBAR_GUIDE_PINNING: true,
    APPBAR_GUIDE_SCROLL: false, BACKSTAGE_POST_IS_PRESENTED_AS_FEED: false, BODY_LEGACY_BACKGROUND: false, CARDIFIED_PAGE: true,
    EXPAND_DISTILLER_POST_ICON: false, GUIDE_NAVIGATE_TO_CHANNEL_FEED: false, INDIVIDUAL_CARDS: false, INDIVIDUAL_CARDS_WATCH: true,
    LEFT_ALIGN_GUIDE_FIXED: true, LOHP_VIDEO_FIX_THUMB_ASPECTRATIO: true, MASTHEAD_APPBAR_FUSION: true, MASTHEAD_APPBAR_LAUNCH: true,
    MASTHEAD_POSITIONER: true, NEW_APPBAR_GUIDE_ICONS: true, NEW_LOGO: true, SITE_AS_GIANT_CARD: true, SITE_CENTER_ALIGNED: true,
    W2W_AS_LOHP_EVERYTIME: true, WATCH7_CREATOR_BAR_LIGHT: true, WATCH7_TEXT_RATING: false };
// the 2013 site: left aligned, the guide in the page
const V3_HITCHHIKER13 = Object.assign({}, V3_NIRVANA, { APPBAR_GUIDE: false, APPBAR_GUIDE_BUTTON_SIMPLE_STYLE: false,
    APPBAR_GUIDE_PINNING: false, APPBAR_GUIDE_SCROLL: true, BACKSTAGE_POST_IS_PRESENTED_AS_FEED: true, CARDIFIED_PAGE: false,
    EXPAND_DISTILLER_POST_ICON: true, INDIVIDUAL_CARDS_WATCH: false, LEFT_ALIGN_GUIDE_FIXED: false, LOHP_VIDEO_FIX_THUMB_ASPECTRATIO: false,
    MASTHEAD_APPBAR_FUSION: false, MASTHEAD_APPBAR_LAUNCH: false, MASTHEAD_POSITIONER: false, NEW_APPBAR_GUIDE_ICONS: false,
    SITE_AS_GIANT_CARD: false, SITE_CENTER_ALIGNED: false, WATCH7_CREATOR_BAR_LIGHT: false });
const V3_PRESETS = {
    hitchhiker13early: Object.assign({}, V3_HITCHHIKER13, { NEW_LOGO: false, BODY_LEGACY_BACKGROUND: true }),
    hitchhiker13mid: Object.assign({}, V3_HITCHHIKER13, { NEW_LOGO: false }),
    hitchhiker13: V3_HITCHHIKER13,
    nirvana14: Object.assign({}, V3_NIRVANA, { APPBAR_GUIDE_SCROLL: true, BACKSTAGE_POST_IS_PRESENTED_AS_FEED: true, EXPAND_DISTILLER_POST_ICON: true, INDIVIDUAL_CARDS_WATCH: false }),
    nirvana15Early: Object.assign({}, V3_NIRVANA, { APPBAR_GUIDE_SCROLL: true, BACKSTAGE_POST_IS_PRESENTED_AS_FEED: true }),
    nirvana15: V3_NIRVANA,
    nirvana16: Object.assign({}, V3_NIRVANA, { LOHP_VIDEO_FIX_THUMB_ASPECTRATIO: false, W2W_AS_LOHP_EVERYTIME: false }),
    poly17: Object.assign({}, V3_NIRVANA, { CARDIFIED_PAGE: false, INDIVIDUAL_CARDS_WATCH: false, LOHP_VIDEO_FIX_THUMB_ASPECTRATIO: false, W2W_AS_LOHP_EVERYTIME: false, MASTHEAD_SHOW_RED_LOGO_FOR_REDUSER: false, NEW_LOGO: undefined, INDIVIDUAL_CARDS: undefined }),
    // 2007-2012: the nirvana frame under Gplex's own styling, the old background and text ratings
    cosmic: Object.assign({}, V3_NIRVANA, { APPBAR_FLEXWATCH_MINI: false, BACKSTAGE_POST_IS_PRESENTED_AS_FEED: true, BODY_LEGACY_BACKGROUND: true, CARDIFIED_PAGE: false,
        INDIVIDUAL_CARDS: undefined, MASTHEAD_SHOW_RED_LOGO_FOR_REDUSER: false, NEW_LOGO: false, WATCH7_CREATOR_BAR_LIGHT: false, WATCH7_TEXT_RATING: true })
};
// the player's size steps (V3's "flexwatch", 2015+): [min window width, min height, player width, height]
const V3_SIZES = [[1496, 768, 640, 360], [1496, 768, 854, 480], [2130, 768, 1280, 720]];
function v3Settings(era) {
    const conf = Object.assign({}, V3_BASE, V3_PRESETS[era.v3]);
    if (era.flexwatch) {
        V3_SIZES.forEach(function(s, i) {
            const n = "PLAYER_SIZERULE" + (i + 1) + "_";
            conf[n + "MIN_WIDTH"] = s[0];
            conf[n + "MIN_HEIGHT"] = s[1];
            conf[n + "API_SIZE_WIDTH"] = s[2];
            conf[n + "API_SIZE_HEIGHT"] = s[3];
        });
    }
    const gbar = gbarFor(gplexLayout());
    conf.USING_GBAR = gbar !== "off";
    conf.MODERN_GBAR_DELEGATION = gbar !== "classic";
    const dark = pref("UGF_ST_dark", "auto");
    if (dark !== "auto") {
        conf.DARK_MOD = dark === "on";
    }
    Object.keys(conf).forEach(function(k) {
        if (conf[k] === undefined) {
            delete conf[k];
        }
    });
    return conf;
}
function v3Db() {
    try {
        return JSON.parse(localStorage.getItem("v3_local_db") || "null") || { config: { db: { yt: {} } } };
    } catch (e) {
        return { config: { db: { yt: {} } } };
    }
}
// writes what the era wants into V3's settings; true when something changed (V3 reads its settings
// when the page starts, so the caller starts the page again)
function applyV3Settings(era) {
    const db = v3Db();
    db.config = db.config || {};
    db.config.db = db.config.db || {};
    const yt = db.config.db.yt = db.config.db.yt || {};
    const want = v3Settings(era);
    let changed = false;
    Object.keys(want).forEach(function(k) {
        if (yt[k] !== want[k]) {
            yt[k] = want[k];
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem("v3_local_db", JSON.stringify(db));
    }
    return changed;
}
// one reload per quarter minute at most: a settings change takes effect on the next start of the page
function reloadOnce() {
    let last = 0;
    try {
        last = Number(sessionStorage.getItem("ugf_st_relayout") || 0);
    } catch (e) {}
    if (Date.now() - last < 15000) {
        return false;
    }
    try {
        sessionStorage.setItem("ugf_st_relayout", String(Date.now()));
    } catch (e) {}
    location.reload();
    return true;
}

// ---- DOM helpers
const $ = function(sel, root) {
    return (root || document).querySelector(sel);
};
const $$ = function(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
};
const html = document.documentElement;
// an element from markup (Trusted Types: through Gplex's policy)
function fromHtml(markup) {
    const t = document.createElement("template");
    t.innerHTML = ugfTT(markup);
    return t.content.firstElementChild;
}
function setHtml(el, markup) {
    el.innerHTML = ugfTT(markup);
    return el;
}
// a feature's own stylesheet (css/extra/) inside the feature's element, as StarTube had it: it
// comes after V3's sheets, and goes (and comes back) with the element
function extraStyle(name, host) {
    const style = document.createElement("style");
    style.id = "st-style-" + name;
    style.textContent = ST_EXTRA_CSS[name];
    host.insertBefore(style, host.firstChild);
}
// calls fn(element) once the selector matches, now or when V3 adds it (within the wait)
function when(sel, fn, waitMs) {
    const now = $(sel);
    if (now) {
        fn(now);
        return;
    }
    let done = false;
    const obs = new MutationObserver(function() {
        const el = $(sel);
        if (el && !done) {
            done = true;
            obs.disconnect();
            fn(el);
        }
    });
    obs.observe(html, { childList: true, subtree: true });
    setTimeout(function() {
        if (!done) {
            done = true;
            obs.disconnect();
        }
    }, waitMs || 15000);
}
function attr(el, name, value) {
    if (value === false || value === null || value === undefined) {
        el.removeAttribute(name);
    } else {
        el.setAttribute(name, value === true ? "" : String(value));
    }
}
function move(el, into, before) {
    if (el && into && el.parentNode !== into) {
        into.insertBefore(el, before || null);
    }
    return el;
}
function text(sel, value, root) {
    $$(sel, root).forEach(function(el) {
        el.textContent = value;
    });
}
function withCommas(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// a link V3 navigates in place (V3 reads the navigation data it keeps on the element)
function v3Link(a, endpoint, id, href, params) {
    if (href) {
        a.href = href;
    }
    const url = a.getAttribute("href") || "";
    const ep = endpoint === "watch" ? { watchEndpoint: { videoId: id, playlistId: params || undefined } } :
        { browseEndpoint: { browseId: id, canonicalBaseUrl: url, params: params || undefined } };
    ep.commandMetadata = { webCommandMetadata: { url: url } };
    a.data = { abstractVorElement: { navigationEndpoint: ep } };
    return a;
}

// ---- YouTube's own API, with the browser's cookies (the page's session: no header made from
// cookies, Gplex never does that)
const INNERTUBE_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
function innertube(endpoint, body) {
    const headers = { "Content-Type": "application/json", "X-Origin": location.origin };
    try {
        const cfg = (pageYt() || {}).config_ || {};
        headers["X-Goog-AuthUser"] = String(cfg.SESSION_INDEX || "0");
        const ds = String(cfg.DATASYNC_ID || "");
        if (ds.indexOf("||") > 0 && ds.split("||")[1].length >= 5) {
            headers["X-Goog-PageId"] = ds.split("||")[0];
        }
    } catch (e) {}
    return fetch("https://www.youtube.com/youtubei/v1/" + endpoint + "?key=" + INNERTUBE_KEY + "&prettyPrint=false", {
        method: "POST", headers: headers, credentials: "include", mode: "cors",
        body: JSON.stringify(Object.assign({ context: { client: { clientName: "WEB", clientVersion: "2.20260507.01.00", hl: "en", gl: "US" } } }, body))
    }).then(function(r) {
        return r.json();
    });
}
function dig(o, path) {
    const parts = path.split(".");
    for (let i = 0; i < parts.length && o !== undefined && o !== null; i++) {
        o = o[parts[i]];
    }
    return o;
}
