// ---- Gplex YouTube: the page frame ----
// The masthead, the guide, the footer and the frame around a page's content. One structure for every
// era; the era's stylesheet lays it out. Only the links and buttons an era had are drawn.
const STATE = { data: null, cfg: null, page: null, user: null };

// What the page knows about you: signed in or out, and your picture, from its top bar.
function userOf(data) {
    const tb = data && data.topbar && data.topbar.desktopTopbarRenderer;
    const btn = ((tb && tb.topbarButtons) || []).map(function(b) { return b.topbarMenuButtonRenderer; }).find(function(b) { return b && b.avatar; });
    return { signedIn: signedIn(), avatar: btn ? thumbUrl(btn.avatar, 56) : "", name: "" };
}
// ---- the masthead
function masthead(page) {
    const user = STATE.user;
    const guideBtn = YEAR >= 2014 ? button({ id: "appbar-guide-button", icon: "appbar-guide", svg: "menu", style: "text", cls: "appbar-guide-toggle", title: "Guide", onclick: toggleGuide }) : null;
    const logo = h("span", { id: "yt-masthead-logo-fragment" },
        h("a", { href: "/", id: "logo-container", class: "masthead-logo-renderer", title: "YouTube Home" },
            h("span", { class: "logo masthead-logo-renderer-logo yt-sprite" }),
            YEAR <= 2016 ? h("span", { class: "content-region" }, (CFG.GL || "US").toUpperCase()) : null));
    const search = searchForm(page);
    let account;
    if (user.signedIn) {
        account = h("div", { id: "yt-masthead-user", class: "yt-uix-clickcard" },
            YEAR >= 2017 ? button({ id: "upload-btn", icon: "material-upload", svg: "upload", style: "text", title: "Upload", href: "/upload" }) : button({ id: "upload-btn", text: "Upload", style: "default", href: "/upload" }),
            YEAR >= 2014 ? h("span", { id: "yt-masthead-notifications" }, button({ id: "yt-masthead-notifications-button", icon: "bell", svg: "bell", style: "text", title: "Notifications", onclick: function(e) { notificationsMenu(e.currentTarget); } })) : null,
            h("span", { id: "yt-masthead-account" }, h("button", { class: "yt-uix-button yt-uix-button-size-default yt-uix-button-text yt-masthead-user-icon yt-uix-clickcard-target", type: "button", "aria-label": "Account", onclick: function(e) { accountMenu(e.currentTarget); } },
                h("span", { class: "yt-uix-button-content" }, user.avatar ? h("span", { class: "yt-thumb yt-thumb-28" }, h("span", { class: "yt-thumb-square" }, h("span", { class: "yt-thumb-clip" }, h("img", { src: user.avatar, width: 28, height: 28, alt: "" })))) : icon("account")))));
    } else {
        account = h("div", { id: "yt-masthead-signin" },
            YEAR >= 2013 && YEAR <= 2016 ? button({ id: "upload-btn", text: "Upload", style: "default", href: signInUrl() }) : null,
            YEAR >= 2017 ? button({ id: "yt-masthead-apps-button", icon: "appbar-guide", svg: "apps", style: "text", title: "YouTube apps", onclick: function(e) { appsMenu(e.currentTarget); } }) : null,
            YEAR >= 2017 ? button({ id: "yt-masthead-signin-dots", icon: "hover-action-menu", svg: "more", style: "text", title: "Settings", onclick: function(e) { settingsMenu(e.currentTarget); } }) : null,
            button({ text: "Sign in", style: "primary", href: signInUrl(), cls: "yt-masthead-signin-button", svg: YEAR >= 2017 ? "account" : null, icon: YEAR >= 2017 ? "icon-account-settings" : null }));
    }
    return h("div", { id: "yt-masthead" },
        h("div", { class: "yt-masthead-logo-container" }, guideBtn, logo),
        account,
        h("div", { id: "yt-masthead-content" }, search));
}
// The search box, with suggestions from YouTube as you type (keyboard: up, down, enter, escape).
function searchForm(page) {
    const input = h("input", { type: "text", id: "masthead-search-term", class: "search-term masthead-search-renderer-input yt-uix-form-input-bidi", name: "search_query", value: page && page.kind === "results" ? page.query : "", placeholder: "Search", title: "Search", autocomplete: "off", "aria-label": "Search", dir: "ltr", spellcheck: "false" });
    const submit = button({ id: "search-btn", text: "Search", type: "submit", cls: "search-btn-component search-button", icon: YEAR >= 2013 ? "search" : null, svg: "search" });
    const box = h("div", { id: "masthead-search-terms", class: "masthead-search-terms-border", dir: "ltr" }, input);
    const list = h("ul", { class: "gy-sbox", role: "listbox", hidden: true });
    const form = h("form", { action: "/results", id: "masthead-search", class: "search-form consolidated-form", onsubmit: function(e) { if (!input.value.trim()) { e.preventDefault(); } } }, submit, box, list, YEAR >= 2017 ? button({ id: "yt-masthead-mic", icon: "search", svg: "mic", style: "text", title: "Search with your voice", onclick: function() { input.focus(); } }) : null);
    let timer = 0, chosen = -1, items = [];
    const show = function(words) {
        items = words;
        chosen = -1;
        clear(list);
        words.forEach(function(w, i) {
            list.appendChild(h("li", { role: "option", onmousedown: function(e) { e.preventDefault(); input.value = w; form.submit(); }, onmousemove: function() { mark(i); } }, h("b", null, w.slice(0, input.value.length)), w.slice(input.value.length)));
        });
        list.hidden = !words.length;
    };
    const mark = function(i) {
        chosen = i;
        Array.from(list.children).forEach(function(li, j) { li.classList.toggle("gy-sbox-on", j === i); });
    };
    input.addEventListener("input", function() {
        clearTimeout(timer);
        const q = input.value.trim();
        if (!q) {
            show([]);
            return;
        }
        timer = setTimeout(function() {
            suggestions(q).then(function(words) { if (input.value.trim() === q) { show(words.slice(0, 10)); } }).catch(function() { show([]); });
        }, 120);
    });
    input.addEventListener("keydown", function(e) {
        if (list.hidden) {
            return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const n = items.length;
            mark(((chosen + (e.key === "ArrowDown" ? 1 : -1)) % n + n) % n);
            input.value = items[chosen];
        } else if (e.key === "Escape") {
            show([]);
        }
    });
    input.addEventListener("blur", function() { setTimeout(function() { show([]); }, 150); });
    return form;
}
// ---- the guide
const GUIDE_ICONS = { TAB_HOME_CAIRO: "what-to-watch", WHAT_TO_WATCH: "what-to-watch", TAB_SUBSCRIPTIONS_CAIRO: "my-subscriptions", SUBSCRIPTIONS: "my-subscriptions", WATCH_HISTORY_CAIRO: "history", HISTORY: "history", ACCOUNT_CIRCLE_CAIRO: "my-channel", WATCH_LATER: "watch-later", LIKED_VIDEOS: "likes-playlist", PLAYLISTS: "playlists", TAB_TRENDING_CAIRO: "trending", TRENDING: "trending", MUSIC_CAIRO: "music", MUSIC: "music", LIVE_CAIRO: "live", GAMING_LOGO_CAIRO: "gaming", GAMING: "gaming", MOVIES: "movies", NEWS: "news", SPORTS: "sports", LEARNING: "learning", FASHION: "fashion", PODCASTS: "podcasts", MIX: "mix", CHANNELS: "browse-channels", SETTINGS: "settings", HELP: "help", FEEDBACK: "feedback", FLAG_CAIRO: "flag", TAB_SHORTS_CAIRO: "shorts" };
// The guide signed out, as the 2014 site had it.
function staticGuide() {
    const best = [["Popular on YouTube", "/feed/trending", "popular"], ["Music", "/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ", "music"], ["Sports", "/channel/UCEgdi0XIXXZ-qJOFPf4JSKw", "sports"], ["Gaming", "/channel/UCOpNcN46UbXVtpKMrmU4Abg", "gaming"], ["Movies", "/channel/UClgRkhTL3_hImCAmdLfDE4g", "movies"], ["News", "/channel/UCYfdidRxbB8Qhf0Nx7ioOYw", "news"], ["Live", "/channel/UC4R8DWoMoI7CAwX8_LjQHig", "live"], ["Learning", "/channel/UCtFRv9O2AHqOZjjynzrv-xg", "learning"]];
    return [
        { title: "", items: [{ title: YEAR >= 2017 ? "Home" : "What to Watch", url: "/", icon: "what-to-watch" }, YEAR >= 2017 ? { title: "Trending", url: "/feed/trending", icon: "trending" } : null, YEAR >= 2017 ? { title: "Subscriptions", url: "/feed/subscriptions", icon: "my-subscriptions" } : null].filter(Boolean) },
        YEAR >= 2017 ? { title: "", items: [{ title: "Library", url: "/feed/library", icon: "playlists" }, { title: "History", url: "/feed/history", icon: "history" }] } : null,
        { title: YEAR >= 2017 ? "Best of YouTube" : "Best of YouTube", items: best.map(function(b) { return { title: b[0], url: b[1], icon: b[2] }; }) },
        { title: "", items: [], signin: true }
    ].filter(Boolean);
}
function guideSectionsFromApi(resp) {
    const sections = guideOf(resp).filter(function(s) { return !/More from YouTube/i.test(s.title); });
    return sections.map(function(s) {
        s.items = s.items.filter(function(it) { return !/TAB_SHORTS|SHORTS/.test(it.icon) && !/youtube\.com\/?$|tv\.youtube|music\.youtube|youtubekids/.test(it.url) && it.url; });
        s.items.forEach(function(it) {
            it.icon = GUIDE_ICONS[it.icon] || (it.avatar ? "" : it.icon.toLowerCase().replace(/_cairo$/, "").replace(/_/g, "-"));
            if (it.title === "Home" && YEAR < 2017) {
                it.title = "What to Watch";
            }
            if (it.title === "Subscriptions" && YEAR < 2017) {
                it.title = "My Subscriptions";
            }
        });
        return s;
    }).filter(function(s) { return s.items.length; });
}
function guideEntry(it, selected) {
    return h("li", { class: "guide-channel guide-notification-item overflowable-list-item" + (it.hidden ? " guide-item-hidden" : ""), role: "menuitem" },
        h("a", { href: it.url, class: "guide-item yt-valign" + (selected ? " guide-item-selected" : ""), title: it.title },
            h("span", { class: "yt-valign-container" },
                it.avatar ? h("span", { class: "thumb" }, h("span", { class: "video-thumb yt-thumb yt-thumb-20" }, h("span", { class: "yt-thumb-square" }, h("span", { class: "yt-thumb-clip" }, h("img", { src: it.avatar, width: 20, height: 20, alt: "" }), h("span", { class: "vertical-align" }))))) : guideIcon(it.icon),
                h("span", { class: "display-name" + (it.count ? "" : " no-count") }, h("span", null, it.title))),
            it.live ? h("span", { class: "guide-badge-live yt-valign", title: "LIVE" }, h("span", { class: "yt-valign-container" })) : it.count ? h("span", { class: "guide-count yt-valign" }, h("span", { class: "yt-valign-container guide-count-value" }, String(it.count))) : null));
}
// Hitchhiker's sprite has these guide icons; the others are drawn as vector icons.
const HH_GUIDE_SPRITES = ["guide-what-to-watch-icon", "guide-my-subscriptions-icon", "guide-history-icon", "guide-watch-later-icon", "guide-playlists-icon", "guide-likes-playlist-icon", "guide-my-channel-icon", "guide-trending-icon", "guide-music-icon", "guide-movies-icon", "guide-mix-icon", "guide-purchases-icon", "guide-uploads-icon"];
function guideIcon(name) {
    if (IS.hh && HH_GUIDE_SPRITES.includes("guide-" + name + "-icon")) {
        return h("span", { class: "thumb guide-" + name + "-icon yt-sprite" });
    }
    return h("span", { class: "thumb gy-guide-icon gy-guide-icon-" + (name || "channel") }, icon(ICONS[GUIDE_SVG[name]] ? GUIDE_SVG[name] : "play"));
}
const GUIDE_SVG = { "what-to-watch": "home", trending: "trending", popular: "trending", "my-subscriptions": "subscriptions", history: "history", "watch-later": "watchlater", playlists: "library", "likes-playlist": "like", "my-channel": "account", music: "play", live: "play", gaming: "play", movies: "play", news: "play", sports: "play", learning: "play", mix: "shuffle" };
function guideEl(sections) {
    const here = location.pathname + location.search;
    const top = h("ul", { class: "guide-toplevel" });
    sections.forEach(function(s, i) {
        const li = h("li", { class: "guide-section" + (s.subscriptions ? " guide-subscriptions-section" : "") });
        if (s.title) {
            li.appendChild(h("h3", null, s.subscriptions ? h("a", { href: "/feed/channels" }, s.title) : s.title));
        }
        if (s.signin) {
            li.appendChild(h("div", { class: "guide-signin-promo yt-box" }, h("p", null, "Sign in now to see your channels and recommendations!"), button({ text: "Sign in", style: "primary", href: signInUrl() })));
        } else {
            const ul = h("ul", { class: "guide-user-links yt-uix-tdl yt-box", role: "menu" }, s.items.map(function(it) { return guideEntry(it, it.url === here || (it.url === "/" && here === "/")); }));
            const hidden = s.items.filter(function(it) { return it.hidden; }).length;
            li.appendChild(ul);
            if (hidden) {
                const more = h("button", { class: "yt-uix-expander-head guide-view-more yt-valign", type: "button", onclick: function() { ul.classList.toggle("guide-expanded"); more.firstChild.textContent = ul.classList.contains("guide-expanded") ? "Show less" : "Show " + hidden + " more"; } }, h("span", { class: "yt-valign-container" }, "Show " + hidden + " more"));
                li.appendChild(more);
            }
        }
        if (i < sections.length - 1) {
            li.appendChild(h("hr", { class: "guide-section-separator" }));
        }
        top.appendChild(li);
    });
    return h("div", { class: "guide-module-content yt-scrollbar" }, top);
}
async function fillGuide(menu) {
    let sections = staticGuide();
    if (STATE.user.signedIn) {
        try {
            sections = guideSectionsFromApi(await api.guide());
        } catch (e) {
            console.error("Gplex YouTube: guide", e);
        }
    }
    replace(menu, guideEl(sections));
}
function guideOpen() {
    return pref("guide", "") !== "closed";
}
let guideOverlay = false;
// The guide is pinned beside the content on wide windows (where the page allows pinning), and slides
// over the page from the guide button elsewhere.
function applyGuideState() {
    const root = document.documentElement;
    const pinnable = document.body.classList.contains("guide-pinning-enabled") && window.innerWidth >= 1250;
    const pinned = pinnable && guideOpen();
    root.classList.toggle("guide-pinned", pinned);
    root.classList.toggle("show-guide", pinned || guideOverlay);
    root.classList.toggle("guide-overlay", !pinned && guideOverlay);
}
function toggleGuide() {
    const pinnable = document.body.classList.contains("guide-pinning-enabled") && window.innerWidth >= 1250;
    if (pinnable) {
        setPref("guide", guideOpen() ? "closed" : "open");
        guideOverlay = false;
    } else {
        guideOverlay = !guideOverlay;
    }
    applyGuideState();
    snapWidth();
}
// ---- the footer
function footer() {
    const links1 = YEAR >= 2017 ? ["About", "Press", "Copyright", "Creators", "Advertise", "Developers"] : ["About", "Press", "Copyright", "Creators", "Advertise", "Developers", YEAR <= 2014 ? "+YouTube" : "YouTube Red"];
    const links2 = ["Terms", "Privacy", "Policy & Safety", "Send feedback", YEAR >= 2015 ? "Test new features" : "Try something new!"];
    const hrefs = { "About": "https://www.youtube.com/about/", "Press": "https://blog.youtube/press/", "Copyright": "https://www.youtube.com/about/copyright/", "Creators": "https://www.youtube.com/creators/", "Advertise": "https://www.youtube.com/ads/", "Developers": "https://developers.google.com/youtube", "+YouTube": "https://plus.gplexextended.com/", "YouTube Red": "https://www.youtube.com/premium", "Terms": "https://www.youtube.com/t/terms", "Privacy": "https://policies.google.com/privacy", "Policy & Safety": "https://www.youtube.com/howyoutubeworks/policies/community-guidelines/", "Send feedback": "https://support.google.com/youtube/", "Test new features": "https://www.youtube.com/new", "Try something new!": "https://www.youtube.com/new" };
    const link = function(t) { return h("li", null, h("a", { href: hrefs[t] || "#" }, t)); };
    return h("div", { id: "footer" },
        h("div", { id: "footer-main" },
            h("div", { id: "footer-logo" }, h("a", { href: "/", id: "footer-logo-link", title: "YouTube home" }, h("span", { class: "footer-logo-icon yt-sprite" }))),
            h("ul", { class: "pickers yt-uix-button-group" },
                h("li", null, button({ text: "Language: English", icon: "footer-language", arrow: true, cls: "yt-picker-button" })),
                h("li", null, button({ text: "Content location: " + (CFG.GL === "US" || !CFG.GL ? "United States" : CFG.GL), arrow: true, cls: "yt-picker-button" })),
                h("li", null, button({ text: (YEAR >= 2015 ? "Restricted Mode" : "Safety") + ": Off", arrow: true, cls: "yt-picker-button" }))),
            button({ text: "History", icon: "footer-history", svg: "history", href: "/feed/history", cls: "yt-picker-button" }),
            YEAR <= 2016 ? button({ text: "Help", href: "https://support.google.com/youtube/", cls: "yt-picker-button" }) : null),
        h("div", { id: "footer-links" },
            h("ul", { id: "footer-links-primary" }, links1.map(link)),
            h("ul", { id: "footer-links-secondary" }, links2.map(link), h("li", null, h("span", { class: "copyright", dir: "ltr" }, "© " + YEAR + " YouTube, LLC")))));
}
// ---- the black Google bar of 2012 and 2013 (the bar Google's sites shared until late 2013)
function googleBar() {
    const items = [["+You", "https://plus.gplexextended.com/"], ["Search", "https://www.google.com/"], ["Images", "https://www.google.com/imghp"], ["Maps", "https://www.google.com/maps"], ["Play", "https://play.google.com/"], ["YouTube", "/"], ["News", "https://news.google.com/"], ["Gmail", "https://mail.google.com/"], ["Drive", "https://drive.google.com/"], ["Calendar", "https://calendar.google.com/"], ["More", "https://about.google/products/"]];
    return h("div", { id: "gb", class: "gy-gbar" },
        h("ol", { class: "gy-gbar-links" }, items.map(function(it) { return h("li", { class: it[0] === "YouTube" ? "gy-gbar-on" : null }, h("a", { href: it[1] }, it[0], it[0] === "More" ? h("span", { class: "gy-gbar-arrow" }) : null)); })),
        h("div", { class: "gy-gbar-right" }, STATE.user.signedIn ? h("a", { href: "/feed/you", class: "gy-gbar-user" }, STATE.user.avatar ? h("img", { src: STATE.user.avatar, width: 24, height: 24, alt: "" }) : "Account") : h("a", { href: signInUrl(), class: "gy-gbar-signin" }, "Sign in")));
}
// ---- the frame
// opts: {page, content (element or elements), appbar (element), pageClass, guide (true: the guide is
// pinned on this page), wide}
function buildFrame(opts) {
    const o = opts || {};
    const body = document.body;
    body.id = "body";
    const day = new Date();
    body.className = ["date-" + day.getFullYear() + String(day.getMonth() + 101).slice(1) + String(day.getDate() + 100).slice(1), "en_US", "ltr", "site-center-aligned", "site-as-giant-card", "flex-width-enabled", "flex-width-enabled-snap", "gy-" + FAMILY, "gy-era-" + ERA, ERA_BODY_CLASS[ERA] || "", (o.page && o.page.kind === "watch") ? "gy-watch" : "", o.guide ? "guide-pinning-enabled" : "", o.appbar ? "" : "appbar-hidden", STATE.user.signedIn ? "yt-user-logged-in" : "", "page-loaded"].filter(Boolean).join(" ");
    document.documentElement.setAttribute("gplex-yt", ERA);
    document.documentElement.classList.add("gy", "gy-" + FAMILY);
    const guideMenu = h("div", { id: "appbar-guide-menu", class: "appbar-menu appbar-guide-menu-layout appbar-guide-clickable-ancestor yt-uix-scroller yt-uix-tdl", role: "navigation" });
    const frame = [
        YEAR === 2012 || YEAR === 2013 ? googleBar() : null,
        h("div", { id: "body-container" },
            h("div", { id: "masthead-positioner" },
                h("div", { id: "yt-masthead-container", class: "clearfix yt-base-gutter" }, masthead(o.page)),
                h("div", { id: "masthead-appbar-container", class: "clearfix" }, h("div", { id: "masthead-appbar" }, h("div", { id: "appbar-content" }, o.appbar || null)))),
            h("div", { id: "masthead-positioner-height-offset" }),
            h("div", { id: "page-container" },
                h("div", { id: "page", class: (o.pageClass || "") + (o.wide ? " watch-wide watch-stage-mode" : "") },
                    h("div", { id: "guide", class: "yt-scrollbar" }, guideMenu),
                    h("div", { class: "alerts-wrapper" }, h("div", { id: "alerts", class: "content-alignment" })),
                    h("div", { id: "header" }),
                    o.player || null,
                    h("div", { id: "content", class: "content-alignment" + (o.contentClass ? " " + o.contentClass : ""), role: "main" }, o.content)))),
        h("div", { id: "footer-container", class: "yt-base-gutter force-layer" }, footer())
    ];
    replace(body, frame);
    fillGuide(guideMenu);
    applyGuideState();
    snapWidth();
    window.addEventListener("resize", function() {
        applyGuideState();
        snapWidth();
    });
    document.addEventListener("click", function(e) {
        if (guideOverlay && !e.target.closest("#guide, #appbar-guide-button")) {
            guideOverlay = false;
            applyGuideState();
        }
    });
}
// The content width snaps to 850, 1056 or 1262px (3, 4 or 5 cards), as Hitchhiker chose by window width.
function snapWidth() {
    if (document.body.classList.contains("gy-watch")) {
        return;
    }
    const w = window.innerWidth - (document.documentElement.classList.contains("show-guide") ? 230 : 0);
    const n = w >= 1330 ? 3 : w >= 1124 ? 2 : 1;
    const root = document.documentElement;
    root.classList.remove("content-snap-width-1", "content-snap-width-2", "content-snap-width-3");
    root.classList.add("content-snap-width-" + n);
}
// The channel tabs row (and a channel's name) in the app bar under the masthead.
function appbarNav(tabs, owner) {
    return h("div", { id: "appbar-nav", class: "appbar-content-hidable" },
        owner ? h("a", { href: owner.url, class: "appbar-nav-owner" }, owner.avatar ? h("img", { class: "appbar-nav-avatar", src: owner.avatar, title: owner.name, alt: owner.name, height: 23, width: 23 }) : null, h("span", { class: "appbar-nav-owner-name" }, owner.name)) : null,
        h("ul", { class: "appbar-nav-menu" }, tabs.map(function(t) {
            return h("li", null, t.selected ? h("h2", { class: "epic-nav-item-heading", "aria-selected": "true" }, t.title) : h("a", { href: t.url, class: "yt-uix-button yt-uix-button-epic-nav-item yt-uix-button-size-default", "aria-selected": "false" }, h("span", { class: "yt-uix-button-content" }, t.title)));
        })));
}
// ---- menus (a small popup under a button; one open at a time)
let openMenu = null;
function popup(anchor, content, cls) {
    closeMenu();
    const r = anchor.getBoundingClientRect();
    const el = h("div", { class: "gy-popup" + (cls ? " " + cls : ""), style: "top:" + (r.bottom + window.scrollY + 4) + "px;left:" + Math.max(8, r.right + window.scrollX - 300) + "px", role: "menu" }, content);
    document.body.appendChild(el);
    openMenu = el;
    setTimeout(function() {
        document.addEventListener("click", closeMenuOnOutside);
    }, 0);
    return el;
}
function closeMenuOnOutside(e) {
    if (openMenu && !openMenu.contains(e.target)) {
        closeMenu();
    }
}
function closeMenu() {
    if (openMenu) {
        openMenu.remove();
        openMenu = null;
        document.removeEventListener("click", closeMenuOnOutside);
    }
}
function menuItems(items) {
    return h("ul", { class: "gy-menu" }, items.map(function(it) {
        if (!it) {
            return null;
        }
        if (it === "-") {
            return h("li", { class: "gy-menu-sep" });
        }
        return h("li", null, h("a", { href: it.href || "#", class: "gy-menu-item", onclick: it.onclick ? function(e) { e.preventDefault(); closeMenu(); it.onclick(); } : null }, it.icon ? icon(it.icon) : null, it.text));
    }));
}
function settingsMenu(anchor) {
    popup(anchor, menuItems([{ text: "Settings", href: "https://www.google.com/gplex", icon: "settings" }, { text: "Help", href: "https://support.google.com/youtube/" }, { text: "Send feedback", href: "https://support.google.com/youtube/" }]));
}
function appsMenu(anchor) {
    popup(anchor, menuItems([{ text: "YouTube TV", href: "https://tv.youtube.com/" }, { text: "YouTube Music", href: "https://music.youtube.com/" }, { text: "YouTube Kids", href: "https://www.youtubekids.com/" }, "-", { text: "Creator Studio", href: "https://studio.youtube.com/" }]));
}
