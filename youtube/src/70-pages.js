// ---- Gplex YouTube: the pages ----
// Each page builder takes the page (from the address) and the page's data, and returns what the
// frame needs: {title, content, appbar, pageClass, guide, player, wide, after}.
const TOPIC_CHANNELS = [["Gaming", "UCOpNcN46UbXVtpKMrmU4Abg"], ["News", "UCYfdidRxbB8Qhf0Nx7ioOYw"], ["Sports", "UCEgdi0XIXXZ-qJOFPf4JSKw"], ["Live", "UC4R8DWoMoI7CAwX8_LjQHig"], ["Movies", "UClgRkhTL3_hImCAmdLfDE4g"], ["Learning", "UCtFRv9O2AHqOZjjynzrv-xg"]];
// The frame of a feed, channel or playlist page: YouTube's "branded page" with one column.
function brandedPage(top, body, opts) {
    const o = opts || {};
    return h("div", { class: "branded-page-v2-container branded-page-base-bold-titles branded-page-v2-container-flex-width" + (top ? " branded-page-v2-has-top-row" : "") + " branded-page-v2-secondary-column-hidden" },
        top ? h("div", { class: "branded-page-v2-top-row" }, top) : null,
        h("div", { class: "branded-page-v2-col-container" }, h("div", { class: "branded-page-v2-col-container-inner" },
            h("div", { class: "branded-page-v2-primary-col" }, h("div", { class: "yt-card clearfix" + (o.cls ? " " + o.cls : "") }, h("div", { class: "branded-page-v2-body branded-page-v2-primary-column-content" }, h("ul", { id: "browse-items-primary" }, h("li", null, body))))))));
}
function signInPromo(title, detail) {
    return h("div", { class: "gy-signin-promo yt-card yt-card-has-padding" }, h("h2", null, title), detail ? h("p", null, detail) : null, button({ text: "Sign in", style: "primary", href: signInUrl() }));
}
// Appends a continuation's items to a grid or a tile list; returns the next continuation.
function moreInto(list, style, endpoint, opts) {
    const o = opts || {};
    return async function(resp) {
        const got = splitMore(modelsOf(continuationItems(resp), endpoint));
        got.items.forEach(function(m) {
            if (m.kind === "shelf") {
                list.parentNode.insertBefore(shelfEl(m, { vertical: style === "tile", w: o.w, h: o.h }), list.nextSibling);
            } else if (m.kind === "video" || m.kind === "playlist" || m.kind === "channel") {
                list.appendChild(style === "tile" ? h("li", null, lockup(m, "tile", o.w, o.h)) : h("li", { class: "yt-shelf-grid-item" + (m.kind === "channel" ? " channels-content-item channel-shelf-item" : "") }, lockup(m, "grid", o.w, o.h)));
            }
        });
        return got.more;
    };
}
function lastList(container, selector) {
    const lists = container.querySelectorAll(selector);
    return lists[lists.length - 1] || null;
}
// A feed body: sections for the models, and "Load more" when there is a continuation.
function feedBody(models, more, opts) {
    const o = opts || {};
    const body = h("div", { class: "gy-feed" }, sectionEl(models, o));
    if (more) {
        let list = lastList(body, o.tiles ? "ol.item-section" : "ul.shelf-content");
        if (!list) {
            list = o.tiles ? h("ol", { class: "item-section" }) : h("ul", { class: "shelf-content" });
            body.appendChild(o.tiles ? list : h("div", { class: "feed-item-container branded-page-box clearfix" }, h("div", { class: "feed-item-dismissable" }, h("div", { class: "multirow-shelf" }, list))));
        }
        body.appendChild(loadMore(more, moreInto(list, o.tiles ? "tile" : "grid", more.endpoint, o), { autoload: IS.poly }));
    }
    return body;
}
// Shelves of what is popular, from YouTube's topic channels, for the home page signed out and the
// trending page.
async function popularShelves() {
    const results = await Promise.allSettled(TOPIC_CHANNELS.map(function(t) { return api.browse(t[1]); }));
    const shelves = [];
    results.forEach(function(r, i) {
        if (r.status !== "fulfilled") {
            return;
        }
        const models = tabModels(tabsOf(r.value).selected);
        const found = models.find(function(m) { return m.kind === "shelf" && m.items.filter(function(x) { return x.kind === "video"; }).length >= 4; });
        const loose = models.filter(function(m) { return m.kind === "video"; });
        const items = (found ? found.items : loose).filter(function(x) { return x.kind === "video"; }).slice(0, 12);
        if (items.length >= 4) {
            shelves.push(shelfOf(TOPIC_CHANNELS[i][0], items, "horizontal", "/channel/" + TOPIC_CHANNELS[i][1]));
        }
    });
    return shelves;
}
// ---- home
async function pageHome(page, data) {
    const got = splitMore(tabModels(tabsOf(data).selected));
    let models = got.items, more = got.more;
    const real = models.filter(function(m) { return m.kind !== "message"; });
    if (!real.length) {
        models = await popularShelves();
        more = null;
        models.unshift({ kind: "heading", text: YEAR >= 2015 ? "Recommended" : "Popular on YouTube" });
    }
    const body = feedBody(models.filter(function(m) { return m.kind !== "heading"; }), more, { w: 196, h: 110 });
    const heading = models.find(function(m) { return m.kind === "heading"; });
    if (heading) {
        body.insertBefore(h("h2", { class: "branded-page-module-title gy-feed-title" }, heading.text), body.firstChild);
    }
    return { title: "", content: brandedPage(null, body), pageClass: "feed home", guide: true };
}
// ---- search results
function pageResults(page, data) {
    const s = searchOf(data);
    const w = YEAR >= 2016 ? 246 : 196, hgt = YEAR >= 2016 ? 138 : 110;
    const filters = h("div", { id: "filter-dropdown", class: "hid" }, s.groups.map(function(g) {
        return h("ul", { class: "filter-col" }, h("h4", { class: "filter-col-title" }, g.title), g.filters.map(function(f) {
            return h("li", { class: "filter" + (f.selected ? " filter-selected" : "") + (f.disabled ? " filter-disabled" : "") }, f.disabled ? h("span", null, f.label) : h("a", { href: f.url }, f.label));
        }));
    }));
    const filterBtn = button({ text: "Filters", arrow: true, style: "link", cls: "filter-button", onclick: function() { filters.classList.toggle("hid"); filterBtn.classList.toggle("yt-uix-button-toggled"); } });
    const chosen = s.groups.reduce(function(a, g) { return a.concat(g.filters.filter(function(f) { return f.selected; })); }, []);
    const header = h("div", { class: "search-header" },
        h("div", { class: "filter-top" },
            h("div", { class: "filter-button-container" }, filterBtn),
            chosen.length ? h("ul", { class: "filter-crumb-list" }, chosen.map(function(f) { return h("li", { class: "filter-crumb" }, f.label); })) : h("span", { class: "filter-crumb-spacer" }),
            s.estimated ? h("p", { class: "num-results" }, "About ", h("strong", null, fmtNum(s.estimated)), " results") : null),
        filters);
    const body = feedBody(s.items, s.more, { tiles: true, w: w, h: hgt });
    return { title: page.query, content: h("div", { id: "results" }, h("ol", { class: "section-list" }, h("li", { class: "branded-page-v2-subnav-container branded-page-gutter-padding" }, header), h("li", null, body))), pageClass: "search", guide: true };
}
// ---- watch
function relatedItem(m) {
    if (m.kind === "playlist") {
        return h("li", { class: "video-list-item related-list-item related-list-item-compact-playlist" },
            h("a", { href: m.url, class: "related-playlist yt-pl-thumb-link" + (m.mix ? " mix-playlist" : "") },
                h("span", { class: "yt-pl-thumb" + (m.mix ? " yt-mix-thumb" : "") }, h("span", { class: "video-thumb yt-thumb yt-thumb-168" }, h("span", { class: "yt-thumb-clip" }, h("img", { src: m.thumb, width: 168, height: 94, alt: "", loading: "lazy" }), h("span", { class: "vertical-align" }))), playlistOverlay(m)),
                h("span", { class: "title", dir: "ltr", title: m.title }, m.title),
                m.channel ? h("span", { class: "stat attribution" }, YEAR <= 2014 ? h("span", null, "by ") : null, h("span", null, m.channel.name)) : h("span", { class: "stat attribution" }, m.mix ? "YouTube" : "")));
    }
    return h("li", { class: "video-list-item related-list-item related-list-item-compact-video", "data-video-id": m.id },
        h("div", { class: "content-wrapper" }, h("a", { href: m.url, class: "content-link", title: m.title },
            h("span", { dir: "ltr", class: "title" }, m.title),
            m.channel ? h("span", { class: "stat attribution" }, YEAR <= 2014 ? h("span", null, "by ") : null, h("span", null, m.channel.name), m.channel.verified ? [" ", verifiedBadge()] : null) : null,
            h("span", { class: "stat view-count" }, m.live ? "Watching now" : m.views, YEAR >= 2015 && m.published ? [" • ", m.published] : null))),
        h("div", { class: "thumb-wrapper" }, h("a", { href: m.url, class: "thumb-link", "aria-hidden": "true", tabindex: "-1" }, h("span", { class: "yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related" }, h("img", { src: m.thumb, width: 168, height: 94, alt: "", loading: "lazy" }), videoOverlays(m)))));
}
function playlistPanel(pl, current) {
    const list = h("ol", { id: "playlist-autoscroll-list", class: "playlist-videos-list yt-uix-scroller yt-viewport" }, pl.items.map(function(v, i) {
        const here = v.id === current;
        return h("li", { class: "yt-uix-scroller-scroll-unit" + (here ? " currently-playing" : ""), "data-video-id": v.id, "data-index": i },
            h("span", { class: "index" }, here ? "▶" : v.index || String(i + 1)),
            h("a", { href: v.url, class: "playlist-video clearfix" },
                thumb(v.thumb, 72, 40, { alt: "" }),
                h("div", { class: "playlist-video-description" }, h("h4", { class: "yt-ui-ellipsis yt-ui-ellipsis-2" }, v.title), h("span", { class: "video-uploader-byline" }, v.channel ? (YEAR <= 2014 ? "by " : "") + v.channel.name : ""))));
    }));
    const header = h("div", { class: "playlist-header" },
        h("div", { class: "playlist-header-content" },
            h("div", { class: "playlist-info" },
                pl.mix ? h("span", { class: "playlist-mix-icon yt-sprite" }, icon("shuffle")) : null,
                h("h3", { class: "playlist-title" }, pl.mix ? pl.title : h("a", { href: pl.url }, pl.title)),
                h("ul", { class: "playlist-details" },
                    pl.owner ? h("li", { class: "author-attribution" }, pl.ownerUrl ? h("a", { href: pl.ownerUrl }, pl.owner) : pl.owner) : null,
                    h("li", { class: "playlist-progress" }, h("span", { id: "playlist-current-index" }, String(pl.index + 1)), " / ", h("span", { id: "playlist-length" }, pl.mix ? "50+" : String(pl.total || pl.items.length)))))));
    const panel = h("div", { id: "player-playlist" }, h("div", { class: "watch-playlist player-height" }, header, list));
    setTimeout(function() {
        const cur = list.querySelector(".currently-playing");
        if (cur) {
            list.scrollTop = Math.max(0, cur.offsetTop - list.clientHeight / 2);
        }
    }, 0);
    return panel;
}
function descriptionPanel(w) {
    const panel = h("div", { id: "action-panel-details", class: "action-panel-content yt-uix-expander yt-card yt-card-has-padding yt-uix-expander-collapsed" });
    const rows = w.metadataRows.map(function(r) {
        return h("li", { class: "watch-meta-item yt-uix-expander-body" }, h("h4", { class: "title" }, r.title), h("ul", { class: "content watch-info-tag-list" }, r.contents.map(function(c) { return h("li", null, richText(c)); })));
    });
    if (w.category && !w.metadataRows.some(function(r) { return /Category/i.test(r.title); })) {
        rows.push(h("li", { class: "watch-meta-item yt-uix-expander-body" }, h("h4", { class: "title" }, "Category"), h("ul", { class: "content watch-info-tag-list" }, h("li", null, h("a", { href: "/results?search_query=" + encodeURIComponent(w.category) }, w.category)))));
    }
    panel.appendChild(h("div", { id: "watch-description", class: "yt-uix-button-panel" }, h("div", { id: "watch-description-content" }, h("div", { id: "watch-description-clip" },
        w.date ? h("div", { id: "watch-uploader-info" }, h("strong", { class: "watch-time-text" }, (w.live ? "Started streaming on " : YEAR >= 2013 ? "Published on " : "Uploaded on ") + w.date)) : null,
        h("div", { id: "watch-description-text" }, h("p", { id: "eow-description" }, richText(w.description, { linkClass: "yt-uix-redirect-link" }))),
        rows.length ? h("div", { id: "watch-description-extras" }, h("ul", { class: "watch-extras-section" }, rows)) : null))));
    const toggle = function() {
        panel.classList.toggle("yt-uix-expander-collapsed");
    };
    panel.appendChild(button({ text: "Show more", cls: "yt-uix-button-expander yt-uix-expander-head yt-uix-expander-collapsed-body", onclick: toggle }));
    panel.appendChild(button({ text: "Show less", cls: "yt-uix-button-expander yt-uix-expander-head yt-uix-expander-body", onclick: toggle }));
    // a timestamp in the description seeks the video
    panel.addEventListener("click", function(e) {
        const a = e.target.closest("a");
        if (!a || !STATE.player) {
            return;
        }
        const m = /^\/watch\?v=([\w-]{11})&t=(\d+)s?$/.exec(a.getAttribute("href") || "");
        if (m && m[1] === w.id) {
            e.preventDefault();
            STATE.player.seek(Number(m[2]));
            STATE.player.play();
            window.scrollTo(0, 0);
        }
    });
    return panel;
}
function pageWatch(page, data, playerResp) {
    const w = watchOf(data, playerResp, page);
    STATE.watch = w;
    const theater = pref("theater", "") === "true";
    const next = w.playlist ? (w.playlist.items[w.playlist.index + 1] || null) : w.autoplay;
    const toggleTheater = function() {
        const on = !document.getElementById("page").classList.contains("watch-stage-mode");
        document.getElementById("page").classList.toggle("watch-wide", on);
        document.getElementById("page").classList.toggle("watch-stage-mode", on);
        setPref("theater", on ? "true" : "false");
        window.dispatchEvent(new Event("resize"));
    };
    const player = createPlayer(w, { next: next, theater: toggleTheater });
    STATE.player = player;
    const playerEl = h("div", { id: "player", class: "content-alignment" + (w.playlist ? " watch-playlist-collapsed" : ""), role: "complementary" },
        h("div", { id: "theater-background", class: "player-height" }),
        h("div", { id: "player-mole-container" }, h("div", { id: "player-api", class: "player-width player-height player-api", tabindex: "-1" }, player.el), w.playlist ? playlistPanel(w.playlist, w.id) : null));
    autoplayNext(player, next, player.el, { playlist: !!w.playlist });
    // the share panel and the buttons
    const share = sharePanel(w);
    const actions = h("div", { id: "watch8-action-buttons", class: "watch-action-buttons clearfix" },
        h("div", { id: "watch8-secondary-actions", class: "watch-secondary-actions yt-uix-button-group" },
            button({ text: "Add to", icon: "add-to", svg: "add", cls: "action-panel-trigger-addto", onclick: function(e) { addToMenu(w.id, e.currentTarget); } }),
            button({ text: "Share", icon: "share", svg: "share", cls: "action-panel-trigger-share", onclick: function(e) { share.classList.toggle("hid"); e.currentTarget.classList.toggle("yt-uix-button-toggled"); } }),
            button({ text: "More", arrow: true, cls: "action-panel-trigger-more", onclick: function(e) { popup(e.currentTarget, menuItems([{ text: "Report", href: "/watch?v=" + w.id + "&gplex=off", icon: "flag" }, { text: "Open YouTube's own page", href: "/watch?v=" + w.id + "&gplex=off" }])); } })),
        h("div", { id: "watch8-sentiment-actions" },
            h("div", { id: "watch7-views-info" }, h("div", { class: "watch-view-count" + (w.live ? " metadata-updateable-viewership" : "") }, w.views), w.likes.count ? h("div", { class: "video-extras-sparkbars" }, h("div", { class: "video-extras-sparkbar-likes", style: "width:100%" })) : null),
            likeButtons(w)));
    const headline = h("div", { id: "watch7-headline", class: "clearfix" },
            w.superTitle ? h("span", { class: "standalone-collection-badge-renderer-text" }, richText(w.superTitle)) : null,
            h("div", { id: "watch-headline-title" }, h("h1", { class: "watch-title-container" }, w.unlisted ? h("span", { id: "watch-privacy-icon", class: "unlisted", title: "This video is unlisted. Only those with the link can see it." }, h("span", { class: "privacy-icon yt-sprite" })) : null, h("span", { id: "eow-title", class: "watch-title", dir: "ltr", title: w.title }, w.title))));
    if (IS.classic) {
        playerEl.insertBefore(headline, playerEl.firstChild);
    }
    const watchContent = h("div", { id: "watch7-content", class: "watch-main-col" }, IS.classic ? playerEl : null);
    const header = h("div", { id: "watch-header", class: "yt-card yt-card-has-padding" },
        IS.classic ? null : headline,
        h("div", { id: "watch7-user-header" },
            h("a", { href: w.channel.url, class: "yt-user-photo" }, avatar(w.channel.avatar, 48, w.channel.name)),
            h("div", { class: "yt-user-info" }, h("a", { href: w.channel.url }, w.channel.name), w.channel.verified ? [" ", verifiedBadge()] : null),
            h("span", { id: "watch7-subscription-container" }, subscribeButton(Object.assign({}, w.subscribe, { count: w.channel.subscribers })))),
        actions);
    const content = h("div", { id: "watch7-container" },
        h("div", { id: "player-messages" }),
        h("div", { id: "watch7-main-container" }, h("div", { id: "watch7-main", class: "clearfix" },
            append(watchContent, [header, h("div", { id: "watch-action-panels", class: "watch-action-panels" }, share), descriptionPanel(w), commentsSection(w)]),
            h("div", { id: "watch7-sidebar", class: "watch-sidebar" },
                h("div", { id: "watch7-sidebar-contents", class: "watch-sidebar-gutter yt-card yt-card-has-padding" }, h("div", { id: "watch7-sidebar-modules" },
                    YEAR >= 2015 && w.autoplay && !w.playlist ? autoplaySection(w.autoplay) : null,
                    h("div", { class: "watch-sidebar-section" }, YEAR >= 2015 && w.autoplay && !w.playlist ? h("hr", { class: "watch-sidebar-separation-line" }) : null, h("div", { class: "watch-sidebar-body" }, relatedList(w)))))))));
    return { title: w.title, content: content, player: IS.classic ? null : playerEl, pageClass: "watch" + (w.playlist ? " watch-playlist" : ""), wide: theater, guide: false };
}
function autoplaySection(next) {
    const cb = h("input", { id: "autoplay-checkbox", type: "checkbox", checked: pref("autoplay", "true") !== "false" || null, onchange: function() { setPref("autoplay", cb.checked ? "true" : "false"); } });
    return h("div", { class: "watch-sidebar-section" }, h("div", { class: "autoplay-bar" },
        h("div", { class: "checkbox-on-off" }, h("label", { for: "autoplay-checkbox" }, "Autoplay"), h("span", { class: "yt-uix-checkbox-on-off" }, cb, h("label", { for: "autoplay-checkbox", id: "autoplay-checkbox-label" }, h("span", { class: "checked" }), h("span", { class: "toggle" }), h("span", { class: "unchecked" })))),
        h("h4", { class: "watch-sidebar-head" }, "Up next"),
        h("div", { class: "watch-sidebar-body" }, h("ul", { class: "video-list" }, relatedItem(next)))));
}
function relatedList(w) {
    const list = h("ul", { id: "watch-related", class: "video-list" }, w.related.map(relatedItem));
    const wrap = h("div", null, list);
    if (w.relatedMore) {
        wrap.appendChild(loadMore(w.relatedMore, async function(resp) {
            const got = splitMore(modelsOf(continuationItems(resp), "next"));
            got.items.filter(function(m) { return m.kind === "video" || m.kind === "playlist"; }).forEach(function(m) { list.appendChild(relatedItem(m)); });
            return got.more;
        }, { text: "Show more", cls: "yt-uix-button-expander", autoload: IS.poly }));
    }
    return wrap;
}
// ---- channels
const TAB_NAMES = { Home: "Home", Videos: "Videos", Shorts: "Shorts", Live: "Live", Playlists: "Playlists", Posts: "Discussion", Community: "Discussion", About: "About", Podcasts: "Podcasts", Releases: "Releases", Courses: "Courses" };
function channelTabs(hd, tabs, page) {
    const out = tabs.filter(function(t) { return TAB_NAMES[t.title]; }).map(function(t) { return { title: TAB_NAMES[t.title], url: t.url, selected: t.selected, params: t.params }; });
    if (!out.some(function(t) { return t.title === "About"; })) {
        out.push({ title: "About", url: hd.url + "/about", selected: page.tab === "about" });
    }
    return out;
}
function channelHeader(hd, tabs) {
    return h("div", { class: "branded-page-v2-header channel-header yt-card" },
        h("div", { id: "gh-banner" }, h("div", { id: "c4-header-bg-container", class: "c4-visible-on-hover-container" + (hd.banner ? " has-custom-banner" : ""), style: hd.banner ? "background-image:url(" + hd.banner + ")" : null },
            h("div", { class: "hd-banner" }, h("div", { class: "hd-banner-image", style: hd.banner ? "background-image:url(" + hd.banner + ")" : null })),
            h("a", { class: "channel-header-profile-image-container", href: hd.url }, h("img", { class: "channel-header-profile-image", src: hd.avatar, title: hd.name, alt: hd.name })))),
        h("div", { class: "primary-header-contents clearfix", id: "c4-primary-header-contents" }, h("div", { class: "primary-header-upper-section-wrapper clearfix" }, h("div", { class: "primary-header-upper-section" },
            h("div", { class: "primary-header-upper-section-block" }, h("h1", { class: "branded-page-header-title" }, h("span", { class: "qualified-channel-title ellipsized" + (hd.verified ? " has-badge" : "") }, h("span", { class: "qualified-channel-title-wrapper" }, h("span", { dir: "ltr", class: "qualified-channel-title-text" }, h("a", { dir: "ltr", href: hd.url, class: "branded-page-header-title-link", title: hd.name }, hd.name))), hd.verified ? h("span", { class: "qualified-channel-title-badge" }, verifiedBadge()) : null))),
            h("div", { class: "primary-header-upper-section-block" }, h("div", { class: "primary-header-actions" }, subscribeButton(Object.assign({}, hd.subscribe, { count: hd.subscribers }), "default")))))),
        h("div", { id: "channel-subheader", class: "clearfix branded-page-gutter-padding appbar-content-trigger" }, h("ul", { id: "channel-navigation-menu", class: "clearfix" }, tabs.map(function(t) {
            return h("li", null, h("a", { href: t.url, class: "yt-uix-button yt-uix-button-epic-nav-item yt-uix-button-size-default" + (t.selected ? " selected" : "") }, h("span", { class: "yt-uix-button-content" }, t.title)));
        }))));
}
async function pageChannel(page, data) {
    const hd = channelHeaderOf(data);
    const all = tabsOf(data);
    const tabs = channelTabs(hd, all.tabs, page);
    const owner = { name: hd.name, url: hd.url, avatar: hd.avatar };
    let body, title = hd.name;
    const sel = all.selected;
    const chips = (dig(sel, "content.richGridRenderer.header.chipBarViewModel.chips") || []).map(function(c) { return c.chipViewModel; }).filter(Boolean);
    if (page.tab === "about") {
        body = h("div", { class: "about-metadata branded-page-box-padding" },
            h("h2", { class: "branded-page-module-title" }, "Description"),
            h("div", { class: "about-description" }, h("pre", null, hd.description || "No description.")),
            h("h2", { class: "branded-page-module-title" }, "Stats"),
            h("ul", { class: "about-stats" }, [hd.subscribers, hd.videos].filter(Boolean).map(function(s) { return h("li", null, s); })),
            hd.rss ? h("p", null, h("a", { href: hd.rss }, "RSS feed")) : null);
        title = hd.name + " - About";
    } else if (page.tab === "posts") {
        body = h("div", { class: "branded-page-box-padding" }, h("p", { class: "display-message" }, "Posts are shown on ", h("a", { href: hd.url + "/posts?gplex=off" }, "YouTube's own page"), "."));
    } else {
        const got = splitMore(tabModels(sel));
        const grid = page.tab !== "featured" && page.tab !== "search";
        const list = h("div", { class: "gy-channel-list" });
        const draw = function(items, more) {
            replace(list, feedBody(items, more, { w: 196, h: 110, tiles: !grid, grid: grid }));
        };
        draw(got.items, got.more);
        const subnav = chips.length ? h("div", { class: "branded-page-v2-subnav-container channel-subnav" }, h("ul", { class: "gy-chips" }, chips.map(function(c) {
            return h("li", null, h("button", { class: "yt-uix-button yt-uix-button-size-default " + (c.selected ? "yt-uix-button-toggled yt-uix-button-default" : "yt-uix-button-link"), type: "button", onclick: async function(e) {
                const cont = continuationOf(c.tapCommand && c.tapCommand.innertubeCommand, "browse");
                if (!cont) {
                    return;
                }
                Array.from(e.currentTarget.closest("ul").querySelectorAll("button")).forEach(function(b) { b.classList.remove("yt-uix-button-toggled", "yt-uix-button-default"); b.classList.add("yt-uix-button-link"); });
                e.currentTarget.classList.add("yt-uix-button-toggled", "yt-uix-button-default");
                const resp = await api.more(cont);
                const got2 = splitMore(modelsOf(continuationItems(resp), "browse"));
                draw(got2.items, got2.more);
            } }, h("span", { class: "yt-uix-button-content" }, c.text)));
        }))) : null;
        body = h("div", null, subnav, list);
        if (page.tab !== "featured") {
            title = hd.name + " - " + (TAB_NAMES[sel && sel.title] || page.tab);
        }
    }
    return { title: title, content: brandedPage(channelHeader(hd, tabs), body), appbar: appbarNav(tabs, owner), pageClass: "channel not-fixed-width-tab-widescreen", guide: true };
}
// ---- playlists
function playlistRow(v, i) {
    return h("tr", { class: "pl-video yt-uix-tile", "data-video-id": v.id, "data-title": v.title },
        h("td", { class: "pl-video-handle" }),
        h("td", { class: "pl-video-index" }),
        h("td", { class: "pl-video-thumbnail" }, h("span", { class: "pl-video-thumb ux-thumb-wrap" }, h("a", { href: v.url, "aria-hidden": "true", tabindex: "-1" }, thumb(v.thumb, 72, 40, { alt: "" })))),
        h("td", { class: "pl-video-title" }, h("a", { href: v.url, class: "pl-video-title-link yt-uix-tile-link" }, v.title), h("div", { class: "pl-video-owner" }, v.channel ? (YEAR <= 2014 ? "by " : "") : "", v.channel ? h("a", { href: v.channel.url }, v.channel.name) : null)),
        h("td", { class: "pl-video-badges" }),
        h("td", { class: "pl-video-added-by" }),
        h("td", { class: "pl-video-time" }, h("div", { class: "more-menu-wrapper" }, h("div", { class: "timestamp" }, h("span", null, v.duration)))));
}
function pagePlaylist(page, data) {
    const hd = playlistHeaderOf(data, page);
    const got = splitMore(tabModels(tabsOf(data).selected));
    const videos = got.items.filter(function(m) { return m.kind === "video"; });
    const tbody = h("tbody", { id: "pl-load-more-destination" }, videos.map(playlistRow));
    const header = h("div", { id: "pl-header", class: "branded-page-box clearfix" },
        hd.thumb ? h("div", { class: "pl-header-thumb" }, h("img", { src: hd.thumb, height: 126, alt: "" }), hd.playUrl ? h("a", { href: hd.playUrl, class: "pl-header-play-all-overlay yt-valign" }, "► Play all") : null) : null,
        h("div", { class: "pl-header-content" },
            h("h1", { class: "pl-header-title" }, hd.title),
            h("ul", { class: "pl-header-details" }, hd.owner ? h("li", null, "by ", hd.owner.url ? h("a", { href: hd.owner.url }, hd.owner.name) : hd.owner.name) : null, hd.count ? h("li", null, hd.count) : null, hd.views ? h("li", null, hd.views) : null, hd.updated ? h("li", null, hd.updated) : null),
            hd.description ? h("p", { class: "pl-header-description" }, hd.description) : null,
            h("div", { class: "playlist-actions" }, hd.playUrl ? button({ text: "Play all", icon: "queue-play", svg: "play", href: hd.playUrl, cls: "playlist-play-all" }) : null)));
    const body = h("div", { id: "pl-video-list", class: "pl-video-list" }, h("table", { id: "pl-video-table", class: "pl-video-table" }, tbody));
    if (got.more) {
        body.appendChild(loadMore(got.more, async function(resp) {
            const next = splitMore(modelsOf(continuationItems(resp), "browse"));
            next.items.filter(function(m) { return m.kind === "video"; }).forEach(function(v) { tbody.appendChild(playlistRow(v, tbody.children.length)); });
            return next.more;
        }, { autoload: IS.poly }));
    }
    return { title: hd.title, content: brandedPage(null, h("div", null, header, body)), appbar: hd.owner ? appbarNav([], { name: hd.owner.name, url: hd.owner.url, avatar: hd.owner.avatar }) : null, pageClass: "playlist not-fixed-width-tab-widescreen", guide: true };
}
// ---- feeds: subscriptions, history, library, trending, hashtags
const FEED_TITLES = { subscriptions: "My Subscriptions", history: "History", library: "Library", you: "You", playlists: "Playlists", channels: "Channels", trending: "Trending", explore: "Trending", storefront: "Movies & Shows" };
async function pageFeed(page, data) {
    const title = FEED_TITLES[page.feed] || "YouTube";
    if (page.feed === "trending" || page.feed === "explore") {
        const shelves = await popularShelves();
        const body = feedBody(shelves, null, { w: 196, h: 110 });
        body.insertBefore(h("h2", { class: "branded-page-module-title gy-feed-title" }, YEAR >= 2015 ? "Trending" : "Popular on YouTube"), body.firstChild);
        return { title: title, content: brandedPage(null, body), pageClass: "feed trending", guide: true };
    }
    if (!signedIn()) {
        const texts = { subscriptions: ["Don't miss new videos", "Sign in to see updates from your favorite YouTube channels"], history: ["Keep track of what you watch", "Watch history isn't viewable when signed out."], library: ["Enjoy your favorite videos", "Sign in to access videos that you've liked or saved"], you: ["Enjoy your favorite videos", "Sign in to access videos that you've liked or saved"], playlists: ["Your playlists", "Sign in to see your playlists"], channels: ["Your channels", "Sign in to see the channels you subscribe to"] };
        const t = texts[page.feed] || ["Sign in", ""];
        return { title: title, content: brandedPage(null, signInPromo(t[0], t[1])), pageClass: "feed", guide: true };
    }
    const sel = tabsOf(data).selected;
    let models = [], more = null;
    if (page.feed === "history" && sel && sel.content && sel.content.sectionListRenderer) {
        // history comes in sections by day
        (sel.content.sectionListRenderer.contents || []).forEach(function(s) {
            const isr = s.itemSectionRenderer;
            if (isr) {
                const got = splitMore(modelsOf(isr.contents, "browse"));
                const day = text(isr.header && isr.header.itemSectionHeaderRenderer && isr.header.itemSectionHeaderRenderer.title);
                models.push(day ? shelfOf(day, got.items, "vertical") : null);
                models.push.apply(models, day ? [] : got.items);
                more = got.more || more;
            } else if (s.continuationItemRenderer) {
                more = continuationOf(s, "browse");
            }
        });
        models = models.filter(Boolean);
    } else {
        const got = splitMore(tabModels(sel));
        models = got.items;
        more = got.more;
    }
    if (!models.length) {
        models = [{ kind: "message", text: "Nothing here yet." }];
    }
    const body = feedBody(models, more, { w: 196, h: 110, tiles: page.feed === "history" });
    body.insertBefore(h("h2", { class: "branded-page-module-title gy-feed-title" }, title), body.firstChild);
    return { title: title, content: brandedPage(null, body), pageClass: "feed " + page.feed, guide: true };
}
function pageHashtag(page, data) {
    const got = splitMore(tabModels(tabsOf(data).selected));
    const body = feedBody(got.items, got.more, { w: 196, h: 110 });
    body.insertBefore(h("h2", { class: "branded-page-module-title gy-feed-title" }, "#" + page.tag), body.firstChild);
    return { title: "#" + page.tag, content: brandedPage(null, body), pageClass: "feed hashtag", guide: true };
}
const PAGES = { home: pageHome, results: pageResults, watch: pageWatch, channel: pageChannel, playlist: pagePlaylist, feed: pageFeed, hashtag: pageHashtag };
