// ---- shell: the attributes the stylesheet keys on, the masthead, the guide, the footer ----

// what the page knows about the visitor and the current page (StarTube's gdp)
const me = { loggedIn: false, name: "", email: "", subs: "", pfp: "", lowPfp: "", channelUrl: "", channelId: "", dark: false };
function body() {
    return $("body .spitfire-body-container");
}
// the page kind, from V3's #page classes and the address
function pageKind() {
    const path = location.pathname;
    const q = location.search;
    if ($("#page.watch")) {
        return "watch";
    }
    if ($("#page.channel")) {
        return "channel";
    }
    if ($("#page.search")) {
        return "search";
    }
    if ($("#page.all_comments")) {
        return "comments";
    }
    if (path === "/playlist") {
        return "playlist";
    }
    if (path.indexOf("/feed/UC") === 0) {
        return "feed-inline-channel";
    }
    if (path.indexOf("/feed/guide") === 0) {
        return "feed-guide-builder";
    }
    if (path.indexOf("/feed/subscriptions") === 0) {
        return "feed-subs";
    }
    if (path.indexOf("/feed/social") === 0) {
        return "feed-social";
    }
    if (path === "/feed/recommended_for_you" || path === "/feed/what_to_watch/recommended") {
        return "feed-recs";
    }
    if (path.indexOf("/feed") === 0) {
        return "feed";
    }
    if ($("#page.home")) {
        return "home";
    }
    return q ? "" : "";
}
// the attributes that never change within an era (the flattened stylesheet keys on [st] for them)
// and the ones that do
function setEraAttributes() {
    attr(html, "st", true);
    attr(html, "startube", true);
    attr(html, "ly", ERA.id);
    attr(html, "static", has("StaticSite"));
    attr(html, "guide", has("NoGuide") ? "no" : has("GuideOnFeedsOnly") ? "feeds" : false);
    attr(html, "nocast", true);
    attr(html, "stargazer-header", ERA.header || false);
    attr(html, "upload-icon", ERA.upload === "icon");
    attr(html, "create-icon", ERA.upload === "create");
    attr(html, "exp-youtube-apps", ERA.apps === "yt");
    attr(html, "exp-account-menu", !!ERA.account && ERA.account !== "me");
    attr(html, "exp-polymer-account-menu", ERA.account === "poly");
    const b = body();
    if (b) {
        attr(b, "st", true);
        attr(b, "layout", ERA.id);
        attr(b, "rel-size", ERA.relatedSize || "small");
        attr(b, "compact-date", ERA.compactDate ? "on" : "off");
        attr(b, "search-text", ERA.searchText ? "on" : "off");
        attr(b, "poly-layout", FAMILY === "poly" ? "true" : false);
    }
}
function setPageAttributes() {
    const kind = pageKind();
    attr(html, "location", kind || false);
    attr(html, "dark", !!$(".dark-mode"));
    attr(html, "gbar", !!$(".gaiabar"));
    me.dark = !!$(".dark-mode");
    if (kind === "channel") {
        const sub = /\/(feed|videos|playlists|posts|about|search)(\/|$|\?)/.exec(location.pathname);
        attr(html, "chan-loc", sub ? (sub[1] === "posts" ? "backstage" : sub[1]) : "home");
    } else {
        attr(html, "chan-loc", false);
    }
    if (kind === "playlist") {
        const page = /[?&]page=(\d+)/.exec(location.search);
        attr(html, "pl-page", page ? page[1] : "1");
        attr(html, "pl-page-over-10", !!page && Number(page[1]) > 10);
    }
    const b = body();
    if (b && kind === "watch") {
        attr(b, "playlist-watch", /[?&]list=/.test(location.search) ? "true" : "false");
    }
    return kind;
}
function readVisitor() {
    const user = $("#yt-masthead-user");
    me.loggedIn = !$("#yt-masthead-signin") && !!user;
    attr(html, "logged-in", me.loggedIn ? "true" : "false");
    if (user) {
        const img = $(".yt-thumb-27 img", user);
        me.lowPfp = img ? img.src : "";
        me.pfp = me.lowPfp.split("=s")[0] + "=s108";
        me.name = ($("#yt-masthead-user-displayname") || {}).textContent || "";
    }
    const mine = $(".guide-user-links .guide-channel[id^='UC'] a");
    if (mine) {
        me.channelUrl = mine.getAttribute("href") || "";
        me.channelId = me.channelUrl.split("/channel/")[1] || "";
    }
}

// ---- masthead
const FAVICONS = {
    "2017": "https://www.youtube.com/s/desktop/daa4e47c/img/favicon_32x32.png",
    "2015": "https://s.ytimg.com/yts/img/favicon_32-vfl8NGn4k.png",
    "2010": "https://s.ytimg.com/yt/favicon-vflZlzSbU.ico",
    "2005": "https://s.ytimg.com/yt/favicon-vfl1123.ico"
};
// V3 sets its own 2012 icon; the others are swapped in after it has
function setFavicon() {
    const url = FAVICONS[ERA.favicon];
    if (!url) {
        return;
    }
    let link = $("#st-favi");
    if (!link) {
        const old = $("head [rel='icon']");
        if (!old) {
            return;
        }
        link = old.cloneNode(true);
        link.id = "st-favi";
        old.remove();
        document.head.appendChild(link);
    }
    setTimeout(function() {
        link.href = url;
    }, 3000);
}
// the menus live outside V3's masthead, under a fence that closes them
function menus() {
    let m = $("#st-menus");
    if (!m) {
        const c = fromHtml('<div id="st-menus-container"><div id="st-menus"></div><div id="st-menus-fence"></div></div>');
        document.body.insertBefore(c, document.body.firstChild);
        m = $("#st-menus");
        $("#st-menus-fence").addEventListener("click", closeMenus);
    }
    return m;
}
function closeMenus() {
    const c = $("#st-menus-container");
    if (c) {
        c.classList.remove("menu-visible");
    }
    $$("#st-menus [visible]").forEach(function(el) {
        el.removeAttribute("visible");
    });
    const apps = $("#startube-youtube-apps");
    if (apps) {
        apps.classList.remove("active");
    }
}
function toggleMenu(menu, button) {
    const c = $("#st-menus-container");
    const open = !menu.hasAttribute("visible");
    closeMenus();
    if (open) {
        menu.setAttribute("visible", "");
        c.classList.add("menu-visible");
        if (button) {
            button.classList.add("active");
        }
    }
}
// a parking place for V3 elements moved between pages
function space() {
    let s = $("#st-space");
    if (!s) {
        s = fromHtml('<div id="st-space"></div>');
        document.body.insertBefore(s, document.body.firstChild);
    }
    return s;
}
function svgIcon(filled, outline) {
    const box = fromHtml('<div class="st-svg">' + T.svg + "</div>");
    $(".filled-icon path", box).setAttribute("d", filled);
    $(".outline-icon path", box).setAttribute("d", outline);
    return box;
}
const ICONS = {
    search: ["M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
        "M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"],
    upload: ["M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z", "M17,18v1H6V18ZM6.49,9l.71.71L11,5.91V16h1V5.91l3.8,3.81L16.51,9l-5-5Z"],
    create: ["M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z",
        "M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z"],
    addTo: ["M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", "M20,12h-8v8h-1v-8H3v-1h8V3h1v8h8V12z"],
    share: ["M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z", "M15,5.63L20.66,12L15,18.37V15v-1h-1c-3.96,0-7.14,1-9.75,3.09c1.84-4.07,5.11-6.4,9.89-7.1L15,9.86V9V5.63 M14,3v6C6.22,10.13,3.11,15.33,2,21c2.78-3.88,6.44-5.66,12-5.66V21l8-9L14,3L14,3z"],
    save: ["M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z", "M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z"],
    more: ["", "M7.5,12c0,0.83-0.67,1.5-1.5,1.5S4.5,12.83,4.5,12s0.67-1.5,1.5-1.5S7.5,11.17,7.5,12z M12,10.5c-0.83,0-1.5,0.67-1.5,1.5 s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S12.83,10.5,12,10.5z M18,10.5c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5 S18.83,10.5,18,10.5z"],
    like: ["M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z",
        "M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z",
        "M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z"],
    dislike: ["M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z",
        "M17,4h-1H6.57C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21 c0.58,0,1.14-0.24,1.52-0.65L17,14h4V4H17z M10.4,19.67C10.21,19.88,9.92,20,9.62,20c-0.26,0-0.5-0.11-0.63-0.3 c-0.07-0.1-0.15-0.26-0.09-0.47l1.52-4.94l0.4-1.29H9.46H5.23c-0.41,0-0.8-0.17-1.03-0.46c-0.12-0.15-0.25-0.4-0.18-0.72l1.34-6 C5.46,5.35,5.97,5,6.57,5H16v8.61L10.4,19.67z M20,13h-3V5h3V13z",
        "M18,4h3v10h-3V4z M5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21c0.58,0,1.14-0.24,1.52-0.65L17,14V4H6.57 C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14z"],
    rChev: ["M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z", "M9.4,18.4l-0.7-0.7l5.6-5.6L8.6,6.4l0.7-0.7l6.4,6.4L9.4,18.4z"],
    lChev: ["M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z", "M14.6,18.4L8.3,12l6.4-6.4l0.7,0.7L9.7,12l5.6,5.6L14.6,18.4z"],
    x: ["M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z", "M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z"],
    report: ["M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z", "M13.18,4l0.24,1.2L13.58,6h0.82H19v7h-5.18l-0.24-1.2L13.42,11H12.6H6V4H13.18 M14,3H5v18h1v-9h6.6l0.4,2h7V5h-5.6 L14,3L14,3z"],
    transcript: ["M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z",
        "M5,11h2v2H5V11z M15,15H5v2h10V15z M19,15h-2v2h2V15z M19,11H9v2h10V11z M22,6H2v14h20V6z M3,7h18v12H3V7z"],
    subscribed: ["M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z", "M9,18.7l-5.4-5.4l0.7-0.7L9,17.3L20.6,5.6l0.7,0.7L9,18.7z"]
};
function mastheadContent() {
    return $("#yt-masthead-content");
}
// the Upload icon (2017) or Create button (2018+) in the masthead, with its menu
function addUploadButton() {
    const mh = mastheadContent();
    if (!mh || $("#startube-upload-icon") || $(".st-create")) {
        return;
    }
    if (ERA.upload === "icon") {
        const a = fromHtml('<a id="startube-upload-icon" class="st-show-svgs yt-uix-tooltip" title="Upload" href="/upload"></a>');
        a.appendChild(svgIcon(ICONS.upload[0], ICONS.upload[1]));
        mh.insertBefore(a, mh.children[2]);
        return;
    }
    if (ERA.upload !== "create") {
        return;
    }
    const btn = fromHtml('<div id="startube-create-icon" class="st-show-svgs yt-uix-tooltip st-create"></div>');
    btn.appendChild(svgIcon(ICONS.create[0], ICONS.create[1]));
    mh.insertBefore(btn, mh.children[2]);
    const menu = fromHtml('<div id="startube-create-menu" class="startube-menu startube-material-menu st-show-svgs">' + T.createMenu + "</div>");
    menus().insertBefore(menu, menus().firstChild);
    $("#startube-create-post", menu).href = me.channelUrl + "/community?show_create_dialog=1";
    $("#startube-create-menu-v3-settings", menu).addEventListener("click", openV3Settings);
    btn.addEventListener("click", function() {
        toggleMenu(menu);
    });
}
// the YouTube apps button (2017-2019) and its menu
function addAppsButton() {
    const mh = mastheadContent();
    if (ERA.apps !== "yt" || !mh || $("#startube-youtube-apps")) {
        return;
    }
    const btn = fromHtml('<div id="startube-youtube-apps" class="st-show-svgs yt-uix-tooltip" title="YouTube apps">' + T.appsIcon + "</div>");
    mh.insertBefore(btn, mh.children[2]);
    const menu = fromHtml('<div id="startube-ytapps-menu" class="startube-menu startube-material-menu st-show-svgs">' + T.appsMenu + "</div>");
    menus().insertBefore(menu, menus().firstChild);
    btn.addEventListener("click", function() {
        toggleMenu(menu, btn);
    });
}
function addNotificationIcon() {
    const bell = $("#sb-button-notify");
    if (!bell || $("#startube-notif-icon")) {
        return;
    }
    const icon = fromHtml('<div id="startube-notif-icon" class="st-svg thumb">' + T.notifIcon + "</div>");
    bell.classList.add("startube-has-icon");
    bell.insertBefore(icon, bell.firstChild);
    bell.addEventListener("click", function() {
        if (!$("svg", bell)) {
            addNotificationIcon();
        }
    });
}
function addSearchIcon() {
    const btn = $("#search-btn");
    if (!btn || $("#startube-search-icon")) {
        return;
    }
    const icon = svgIcon(ICONS.search[0], ICONS.search[1]);
    icon.id = "startube-search-icon";
    icon.classList.add("thumb");
    btn.classList.add("startube-has-icon");
    btn.insertBefore(icon, btn.firstChild);
}
// the magnifier inside the search box (2022)
function addSearchBoxIcon() {
    const box = $("#masthead-search-terms");
    if (!box || $("#startube-search-tumor")) {
        return;
    }
    const icon = svgIcon(ICONS.search[0], ICONS.search[1]);
    icon.id = "startube-search-tumor";
    icon.classList.add("thumb");
    box.classList.add("startube-has-icon");
    box.insertBefore(icon, box.firstChild);
}
function searchWording() {
    const run = $("#search-btn .run");
    if (run && FAMILY !== "hh" && FAMILY !== "poly") {
        run.textContent = "Search";
    }
    const terms = $("#masthead-search-term");
    if (terms && ERA.searchText) {
        terms.setAttribute("placeholder", "Search");
    }
}
// 2010-2011: Browse, Movies and Upload beside the search box
function addAozoraLinks() {
    const mh = mastheadContent();
    if (!mh || $("#aozora-topbar-links")) {
        return;
    }
    const links = fromHtml('<div id="aozora-topbar-links" class="flex-bar">' + T.aozoraLinks + "</div>");
    mh.insertBefore(links, mh.children[2]);
    $$(".stx-link", links).forEach(warmLink);
}
// the masthead of 2007-2009: V3's logo, search box and user area moved into the period's header
function addStargazerHeader() {
    const mh = $("#yt-masthead-container");
    if (!mh || !ERA.header || $("#stargazer-header")) {
        return;
    }
    const h = fromHtml('<div id="stargazer-header" class="flex-bar">' + T.stargazerHeader + "</div>");
    extraStyle("stargazer-header", h);
    mh.insertBefore(h, mh.firstChild);
    const kind = ERA.header === "bar" ? ".st-sbh" : ERA.header === "simple" ? ".st-ssh" : ".st-sth";
    $(kind + " .stargazer-logo-container", h).appendChild($("#logo-container"));
    $(kind + " .stargazer-search-container", h).appendChild($("#masthead-search"));
    const user = $("#yt-masthead-user");
    if (user) {
        $(kind + " .stargazer-user-container", h).appendChild(user);
    }
    const terms = $("#masthead-search-terms");
    if (terms) {
        terms.classList.remove("gsfe_b");
    }
    h.classList.add(me.loggedIn ? "logged-in" : "logged-out");
    const dd = $("#stargazer-upload-menu-container", h);
    const toggleDd = function() {
        dd.toggleAttribute("visible");
        h.classList.toggle("upload-menu-open", dd.hasAttribute("visible"));
    };
    $("#stargazer-upload-dropdown", h).addEventListener("click", toggleDd);
    $("#stargazer-upload-fence", h).addEventListener("click", toggleDd);
    $("#stargazer-v3-settings", h).addEventListener("click", function() {
        toggleDd();
        openV3Settings();
    });
    $$(".stx-link", h).forEach(warmLink);
}
// marks the period header's tab for the page
function stargazerTab(kind) {
    const h = $("#stargazer-header");
    if (!h) {
        return;
    }
    const tab = { home: "home", "feed-recs": "home", "feed-inline-channel": "channels", "feed-guide-builder": "channels", channel: "channels",
        "feed-subs": "videos", watch: "videos", "feed-social": "community", comments: "community" }[kind];
    $$(".stargazer-tab.active", h).forEach(function(t) {
        t.classList.remove("active");
    });
    if (tab) {
        $$("#stargazer-" + tab + ".stargazer-tab", h).forEach(function(t) {
            t.classList.add("active");
        });
    }
}
// links drawn by Gplex: V3 reads the navigation data kept on the element (stx-* from the markup)
function warmLink(a) {
    const ep = a.getAttribute("stx-ep");
    if (!ep) {
        return a;
    }
    return v3Link(a, ep, a.getAttribute("stx-id"), null, a.getAttribute("stx-params"));
}
function openV3Settings() {
    const item = $("#upload-menu-account:not(.yt-uix-button-menu-new-section-separator)");
    if (item) {
        item.click();
    }
}
// the account menu of 2015+ (Hitchhiker's card, or Polymer's list), built from V3's masthead card
function addAccountMenu() {
    const icon = $(".yt-masthead-user-icon");
    if (!ERA.account || ERA.account === "me" || !icon || icon.classList.contains("startube-evented")) {
        return;
    }
    icon.classList.add("startube-evented");
    icon.addEventListener("click", function() {
        let menu = $(".st-acme");
        if (!menu) {
            const trigger = $("#masthead-expanded [href='#']");
            if (trigger) {
                trigger.click();
            }
            menu = fromHtml('<div id="st-account-menu" class="startube-menu st-show-svgs st-acme" page="main">' + T.accountMenu + "</div>");
            menus().insertBefore(menu, menus().firstChild);
            fillAccountMenu(menu);
            $("#st-polymer-switch-account", menu).addEventListener("click", function() {
                menu.setAttribute("page", "accounts");
            });
            $("#st-polymer-appearance", menu).addEventListener("click", function() {
                menu.setAttribute("page", "appearance");
            });
            $("#st-dark-tog", menu).addEventListener("click", function() {
                setPref("UGF_ST_dark", me.dark ? "off" : "on");
                applyV3Settings(ERA);
                location.reload();
            });
            $$("#st-polymer-menu-back", menu).forEach(function(b) {
                b.addEventListener("click", function() {
                    menu.setAttribute("page", "main");
                });
            });
            $$("#st-account-menu-v3-settings, #st-polymer-v3-settings", menu).forEach(function(b) {
                b.addEventListener("click", openV3Settings);
            });
            $$("#st-account-menu-startube-settings, #st-polymer-startube-settings", menu).forEach(function(b) {
                b.classList.remove("none");
                b.addEventListener("click", function() {
                    window.open("https://www.google.com/gplex#ugf-yt-settings", "_blank");
                });
            });
            $("#st-polymer-v3-settings", menu).classList.remove("none");
        }
        menu.setAttribute("page", "main");
        toggleMenu(menu);
        menu.toggleAttribute("visible", $("#st-menus-container").classList.contains("menu-visible"));
    });
}
function fillAccountMenu(menu) {
    when("#masthead-expanded .yt-uix-clickcard-card", function() {
        move($(".masthead-card-switch-account .yt-uix-clickcard-card-body"), $("#st-account-menu-other .st-account-menu-content", menu));
        const actions = $("#yt-masthead-multilogin-actions");
        move(actions, $("#st-account-menu-footer", menu));
        if (actions) {
            $$("a", actions).forEach(function(a) {
                a.classList.add("yt-uix-button", "yt-uix-button-default");
            });
            if (actions.children[1]) {
                actions.children[1].textContent = "Add channel";
            }
        }
        me.email = ($("#masthead-expanded-menu-email") || {}).textContent || "";
        me.name = ($("#masthead-expanded-menu-account-info p") || {}).textContent || me.name;
        me.subs = ($(".yt-masthead-multilogin-user-content span:nth-of-type(2)") || {}).textContent || "";
        text("#st-account-menu-main .st-account-menu-header span, #st-polymer-menu-email span, #st-account-menu-email span", me.email, menu);
        text("#st-account-menu-username span, #st-polymer-menu-username span", me.name, menu);
        text("#st-account-menu-sub-count span", me.subs, menu);
        $$("#st-account-menu-pfp img, #st-polymer-menu-pfp img", menu).forEach(function(img) {
            img.src = me.pfp;
        });
        [$("#st-account-menu-pfp", menu), $("#st-polymer-my-channel", menu)].forEach(function(a) {
            v3Link(a, "browse", me.channelId, me.channelUrl);
        });
    });
}
// V3's own settings, reachable from its masthead menu
function addSettingsLinks() {
    when("#masthead-expanded-menu-list", function(list) {
        if ($("#st-masthead-expanded-v3-settings-button")) {
            return;
        }
        const v3 = fromHtml('<li id="st-masthead-expanded-v3-settings-button" class="masthead-expanded-menu-item"><a class="yt-uix-sessionlink">V3 Settings</a></li>');
        v3.addEventListener("click", openV3Settings);
        list.insertBefore(v3, list.children[5]);
        const gp = fromHtml('<li id="st-masthead-expanded-startube-settings-button" class="masthead-expanded-menu-item"><a class="yt-uix-sessionlink" href="https://www.google.com/gplex#ugf-yt-settings" target="_blank">Gplex settings</a></li>');
        list.insertBefore(gp, list.children[6]);
    });
}
function hideDoodle() {
    const logo = $("#logo-container.doodle");
    if (logo) {
        logo.classList.remove("doodle");
        const img = $("img", logo);
        if (img) {
            img.src = "//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif";
        }
        const region = $(".content-region");
        if (region) {
            region.removeAttribute("style");
        }
    }
}
function masthead() {
    setFavicon();
    searchWording();
    if (has("HideYoodles")) {
        hideDoodle();
    }
    if (FAMILY === "stargazer") {
        addStargazerHeader();
    }
    if (FAMILY === "aozora" || FAMILY === "cosmic") {
        addAozoraLinks();
    }
    if (FAMILY === "poly") {
        addSearchIcon();
        addNotificationIcon();
        setTimeout(addNotificationIcon, 20000);
    }
    if (has("BigSearch")) {
        addSearchBoxIcon();
    }
    addUploadButton();
    addAppsButton();
    addAccountMenu();
    addSettingsLinks();
}

// ---- guide
const GUIDE_ITEMS = { "FEwhat_to_watch": "home", "FEsubscriptions": "subscriptions", "FEhistory": "history", "FEtrending": "trending",
    "FEsocial": "social", "VLWL": "watchLater", "VLLL": "liked", "FEguide_builder": "guideBuilder", "FEchannels": "channels" };
const GUIDE_NAMES = { "FEwhat_to_watch": "Home", "FEsubscriptions": "Subscriptions", "FEhistory": "History" };
function guideIcon(item, name) {
    const box = $(".yt-valign-container", item);
    if (!box || item.classList.contains("startube")) {
        return;
    }
    box.classList.add("startube-has-icon");
    box.insertBefore(fromHtml('<div class="st-svg thumb">' + T.guideIcons[name] + "</div>"), box.firstChild);
    item.classList.add("startube");
}
// 2016+: Material icons on the guide's entries, the logo as SVG, "Home" and "Subscriptions"
function modernGuide() {
    Object.keys(GUIDE_ITEMS).forEach(function(id) {
        const item = $("#" + id + "-guide-item");
        if (!item) {
            return;
        }
        if (GUIDE_NAMES[id]) {
            text(".display-name span", GUIDE_NAMES[id], item);
        }
        guideIcon(item, GUIDE_ITEMS[id]);
    });
    const mine = $(".guide-user-links .guide-channel[id^='UC']");
    if (mine && !mine.classList.contains("startube")) {
        mine.classList.add("startube-mychan");
        guideIcon(mine, "myChannel");
        const links = $(".guide-user-links");
        links.insertBefore(mine, links.children[1]);
    }
    $$(".guide-channel[id^='VLP']:not(.startube)").forEach(function(item) {
        guideIcon(item, "playlist");
    });
    const btn = $("#appbar-guide-button");
    if (btn && !btn.classList.contains("startube")) {
        const icon = fromHtml('<div id="startube-guide-icon" class="st-svg thumb">' + T.guideIcons.guideButton + "</div>");
        btn.classList.add("startube-has-icon", "startube");
        btn.insertBefore(icon, btn.firstChild);
    }
    const logo = $("#logo-container");
    if (logo && !logo.classList.contains("startube")) {
        logo.classList.add("startube-has-icon", "startube");
        logo.insertBefore(fromHtml('<div class="st-svg thumb">' + T.guideIcons.logo + "</div>"), logo.firstChild);
    }
    const nav = $(".appbar-nav-menu");
    if (nav && ($(".home") || $(".feed")) && !/feed\/(history|social|hype)|distiller_post_history/.test(location.href)) {
        when(".epic-nav-item-heading", function() {
            const label = function(n, s) {
                const h = $(".appbar-nav-menu li:nth-child(" + n + ") .epic-nav-item-heading") || $(".appbar-nav-menu li:nth-child(" + n + ") .yt-uix-button-content span");
                if (h) {
                    h.textContent = s;
                }
            };
            label(1, "Home");
            label(2, "Subscriptions");
        });
    }
}
// 2015+: the Library and Subscriptions lists unfold in the guide instead of flying out
function scrollableGuide() {
    const lib = $("#guide-library-section");
    if (lib && lib.data && lib.data.guideSubscriptionsSectionRenderer) {
        lib.data.guideSubscriptionsSectionRenderer.navigationEndpoint = "";
    }
    when("#guide-subscriptions-section", function() {
        const expand = function(container, id, at, open) {
            if (!container || container.classList.contains("st-modded") || !$(".guide-flyout", container)) {
                return;
            }
            const box = fromHtml('<div id="' + id + '">' + T.guideExpander + "</div>");
            container.insertBefore(box, container.children[at]);
            const list = $(".guide-flyout .guide-channels-list", container);
            const items = $(".startube-guide-expander-items", box);
            items.insertBefore(list, items.firstChild);
            items.classList.add("startube-fixed-guide-item");
            container.classList.add("st-modded");
            if (open) {
                $(".yt-uix-expander", box).classList.remove("yt-uix-expander-collapsed");
            }
        };
        expand($("#guide-library-container"), "startube-library-expander-container", 5, false);
        $$("#guide-subscriptions-container").forEach(function(c) {
            expand(c, "startube-subs-expander-container", 4, !!ERA.guideSubsExpand);
        });
    });
    if (FAMILY === "poly" && $(".guide-toplevel") && !$("#startube-guide-footer")) {
        const foot = fromHtml('<li class="guide-section" id="startube-guide-footer">' + T.guideFooter + "</li>");
        $(".guide-toplevel").appendChild(foot);
    }
}
// 2007-2012: "Browse Channels", the profile block and the From YouTube entry at the top of the guide
function cosmicGuide() {
    const guide = $("#appbar-guide-menu");
    if (!guide || !$(".show-guide") || $("#startube-guide-top-left")) {
        return;
    }
    const top = fromHtml("<div>" + T.cosmicGuideTop + "</div>");
    top.id = "startube-guide-cosmic-section";
    guide.insertBefore(top, guide.firstChild);
    const z = fromHtml("<div>" + T.cosmicGuideSection + "</div>");
    z.id = "startube-guide-z-section";
    const toplevel = $(".guide-toplevel");
    toplevel.insertBefore(z, toplevel.firstChild);
    const list = $(".guide-channels-list", z);
    list.insertBefore($("#FEwhat_to_watch-guide-item"), list.children[1]);
    if (me.loggedIn && me.channelUrl) {
        const subs = $("#FEsubscriptions-guide-item");
        const channels = $("#guide-channels");
        if (subs && channels) {
            channels.parentNode.insertBefore(subs, channels.parentNode.firstChild);
            text(".display-name span", "Subscriptions", subs);
            subs.classList.add("startube");
        }
        const subsSection = $("#guide-subscriptions-section");
        if (subsSection) {
            toplevel.insertBefore(subsSection, toplevel.firstChild);
        }
        $("#startube-guide-pfp img", top).src = me.pfp;
        v3Link($("#startube-guide-pfp", top), "browse", me.channelId, me.channelUrl);
        v3Link($("#st-g-my-channel", top), "browse", me.channelId, me.channelUrl);
        v3Link($("#st-g-my-videos", top), "browse", me.channelId, me.channelUrl + "/videos", "EgZ2aWRlb3PyBgQKAjoA");
    } else {
        $("#startube-guide-profile-section", top).style.display = "none";
    }
    $$("#guide .stx-link").forEach(warmLink);
}
// where the logo and the guide's Home and Subscriptions lead in this era (the list or grid feed)
function guideLinks() {
    const feedHref = ERA.logoLink === "feedGrid" ? "/feed/what_to_watch/recommended?flow=grid" : "/feed/what_to_watch/recommended";
    const subsHref = ERA.subsGrid === "grid" ? "/feed/subscriptions?flow=grid" : "/feed/subscriptions";
    const home = $("#FEwhat_to_watch-guide-item a");
    if (home && ERA.logoLink === "feedGrid") {
        v3Link(home, "browse", "FEwhat_to_watch", feedHref);
    }
    const logo = $("#logo-container");
    if (logo && (ERA.logoLink === "feedList" || ERA.logoLink === "feedGrid")) {
        v3Link(logo, "browse", "FEwhat_to_watch", feedHref);
    }
    const subs = $("#FEsubscriptions-guide-item a");
    if (subs && ERA.subsGrid === "grid") {
        v3Link(subs, "browse", "FEsubscriptions", subsHref);
    }
}
function guide() {
    guideLinks();
    if (has("ModernGuide")) {
        when(".guide-channel", modernGuide);
    }
    if (has("TrueScrollableGuide")) {
        scrollableGuide();
    }
    if (has("CosmicGuideLayout")) {
        cosmicGuide();
    }
}
// the fixed-width ("static") site of 2007-2012: the guide sits where the content starts
function placeGuide() {
    const content = $("#content");
    const menu = $("[static] #appbar-guide-menu");
    if (!content || !menu) {
        return;
    }
    const box = content.getBoundingClientRect();
    menu.style.left = box.left + "px";
    html.style.setProperty("--guide-left", box.left + "px");
    const mh = $("#masthead-positioner");
    if (mh) {
        const top = mh.getBoundingClientRect().height;
        menu.style.top = top + "px";
        html.style.setProperty("--guide-top", top + "px");
    }
    menu.style.height = (box.height - 20) + "px";
    html.style.setProperty("--guide-height", (box.height - 20) + "px");
}

// ---- footer
function footerYear() {
    const links = $("#footer-links-secondary");
    if (links && !$("#st-yt-c")) {
        links.appendChild(fromHtml('<li id="st-yt-c"><span class="copyright" dir="ltr">© ' + new Date().getFullYear() + " YouTube, LLC</span></li>"));
    }
}
