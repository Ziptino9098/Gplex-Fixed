// ---- Gplex YouTube: the pieces every page is made of ----
// Buttons, thumbnails, lockups (a video, playlist or channel with its title and byline), shelves,
// grids and "Load more". The markup is YouTube's Hitchhiker (2013-2017) markup, which its own
// stylesheets style; the other eras' stylesheets style the same markup their way.

// opts: {text, icon, style, size, href, id, cls, title, onclick, disabled, type, arrow, label}
function button(opts) {
    const o = opts || {};
    const cls = ["yt-uix-button", "yt-uix-button-size-" + (o.size || "default"), "yt-uix-button-" + (o.style || "default")];
    if (o.icon) {
        cls.push("yt-uix-button-has-icon");
    }
    if (!o.text) {
        cls.push("yt-uix-button-empty");
    }
    if (o.cls) {
        cls.push(o.cls);
    }
    const el = h(o.href ? "a" : "button", { class: cls.join(" "), href: o.href || null, id: o.id || null, title: o.title || null, "aria-label": o.label || o.title || null, type: o.href ? null : o.type || "button", disabled: o.disabled || null, onclick: o.onclick || null, target: o.target || null });
    if (o.icon) {
        el.appendChild(h("span", { class: "yt-uix-button-icon-wrapper" }, h("span", { class: "yt-uix-button-icon yt-uix-button-icon-" + o.icon + " yt-sprite" }), ICONS[o.svg || o.icon] ? icon(o.svg || o.icon) : null));
    }
    if (o.text) {
        el.appendChild(h("span", { class: "yt-uix-button-content" }, o.text));
    }
    if (o.arrow) {
        el.appendChild(h("span", { class: "yt-uix-button-arrow yt-sprite" }));
    }
    return el;
}
// A picture in YouTube's thumbnail box: the box has the size, the picture fits it.
function thumb(src, w, hgt, opts) {
    const o = opts || {};
    return h("span", { class: "video-thumb yt-thumb yt-thumb-" + w + (o.cls ? " " + o.cls : "") },
        h("span", { class: o.square ? "yt-thumb-square" : "yt-thumb-default" },
            h("span", { class: "yt-thumb-clip" },
                h("img", { src: src || "", width: w, height: hgt || w, alt: o.alt || "", loading: o.eager ? null : "lazy" }),
                h("span", { class: "vertical-align" }))));
}
function avatar(src, size, alt) {
    return thumb(src, size, size, { square: true, alt: alt });
}
function verifiedBadge() {
    return h("span", { class: "yt-channel-title-icon-verified yt-uix-tooltip yt-sprite", title: "Verified" }, icon("verified"));
}
// The overlays on a video's picture: its length, LIVE, and how much of it was watched.
function videoOverlays(v) {
    const out = [];
    if (v.live) {
        out.push(h("span", { class: "video-time video-time-live" }, "LIVE"));
    } else if (v.duration) {
        out.push(h("span", { class: "video-time" }, v.duration));
    }
    if (v.progress) {
        out.push(h("span", { class: "resume-playback-background" }), h("span", { class: "resume-playback-progress-bar", style: "width:" + v.progress + "%" }));
    }
    return out;
}
function playlistOverlay(p) {
    return [
        h("span", { class: "sidebar" }, h("span", { class: "yt-pl-sidebar-content yt-valign" }, h("span", { class: "yt-valign-container" },
            h("span", { class: "formatted-video-count-label" }, p.mix ? h("b", null, "50+") : countNumber(p.count)),
            h("span", { class: "yt-pl-icon" + (p.mix ? " yt-pl-icon-mix" : "") + " yt-pl-icon-reg yt-sprite" }, icon(p.mix ? "shuffle" : "playlist"))))),
        h("span", { class: "yt-pl-thumb-overlay" }, h("span", { class: "yt-pl-thumb-overlay-content" }, h("span", { class: "play-icon yt-sprite" }, icon("play")), h("span", { class: "yt-pl-thumb-overlay-text" }, "Play all")))
    ];
}
function countNumber(s) {
    const m = /[\d,]+/.exec(s || "");
    return m ? h("b", null, m[0]) : (s || "");
}
function bylineEl(ch, opts) {
    if (!ch) {
        return null;
    }
    const o = opts || {};
    return h("div", { class: "yt-lockup-byline" }, o.prefix ? "by " : null, ch.url ? h("a", { href: ch.url }, ch.name) : ch.name, ch.verified ? [" ", verifiedBadge()] : null);
}
function metaEl(parts) {
    const list = parts.filter(Boolean);
    return list.length ? h("div", { class: "yt-lockup-meta" }, h("ul", { class: "yt-lockup-meta-info" }, list.map(function(p) { return h("li", null, p); }))) : null;
}
// A lockup. style "tile" (a row: picture left, text right) or "grid" (picture above the text).
function lockup(m, style, w, hgt) {
    const grid = style === "grid";
    const tw = w || 196, th = hgt || 110;
    if (m.kind === "channel") {
        return h("div", { class: "yt-lockup yt-lockup-" + style + " yt-lockup-channel clearfix" },
            h("div", { class: "yt-lockup-dismissable" + (grid ? "" : " yt-uix-tile") },
                h("div", { class: "yt-lockup-thumbnail" }, h("a", { href: m.url }, thumb(m.avatar, grid ? th : 88, grid ? th : 88, { square: true, alt: m.name }))),
                h("div", { class: "yt-lockup-content" },
                    h("h3", { class: "yt-lockup-title" }, h("a", { href: m.url, class: "yt-uix-tile-link yt-ui-ellipsis yt-ui-ellipsis-2", title: m.name }, m.name, m.verified ? [" ", verifiedBadge()] : null)),
                    metaEl([m.subscribers, m.videos]),
                    !grid && m.snippet ? h("div", { class: "yt-lockup-description yt-ui-ellipsis yt-ui-ellipsis-2" }, richText(m.snippet)) : null,
                    h("div", { class: "yt-lockup-badges" }, subscribeButton(m.subscribe || { channelId: m.id, subscribed: false, enabled: true }, "small")))));
    }
    const isPl = m.kind === "playlist";
    const picture = h("div", { class: "yt-lockup-thumbnail" + (isPl ? " yt-pl-thumb" : "") + (m.progress ? " contains-percent-duration-watched" : "") },
        h("a", { href: m.url, class: isPl ? "yt-pl-thumb-link" : null, "aria-hidden": "true", tabindex: "-1" },
            h("div", { class: "yt-thumb video-thumb" }, h("span", { class: "yt-thumb-simple" }, h("img", { src: m.thumb, width: tw, height: th, alt: "", loading: "lazy" }))),
            isPl ? playlistOverlay(m) : null),
        isPl ? null : videoOverlays(m));
    const content = h("div", { class: "yt-lockup-content" },
        h("h3", { class: "yt-lockup-title" }, h("a", { href: m.url, class: "yt-uix-tile-link yt-ui-ellipsis yt-ui-ellipsis-2", title: m.title, dir: "ltr" }, m.title), m.duration && !isPl ? h("span", { class: "accessible-description" }, " - Duration: " + m.duration + ".") : null),
        bylineEl(m.channel, { prefix: YEAR <= 2014 }),
        isPl ? h("ol", { class: "yt-lockup-meta yt-lockup-playlist-items" }, (m.videos || []).slice(0, 2).map(function(v) {
            return h("li", { class: "yt-lockup-playlist-item clearfix" }, h("span", { class: "yt-lockup-playlist-item-length" }, v.duration), h("a", { href: v.url, class: "yt-lockup-playlist-item-title" }, v.title));
        })) : null,
        isPl ? h("div", { class: "yt-lockup-meta" }, h("ul", { class: "yt-lockup-meta-info" }, h("li", null, h("a", { href: m.mix ? m.url : "/playlist?list=" + m.id }, m.mix ? "Play mix" : "View full playlist" + (m.count ? " (" + m.count.replace(/\D+$/, "") + " videos)" : ""))))) : metaEl([m.views, m.published]),
        !grid && m.snippet ? h("div", { class: "yt-lockup-description yt-ui-ellipsis yt-ui-ellipsis-2" }, richText(m.snippet)) : null,
        m.badges && m.badges.length ? h("div", { class: "yt-lockup-badges" }, h("ul", { class: "yt-badge-list" }, m.badges.map(function(b) { return h("li", { class: "yt-badge-item" }, h("span", { class: "yt-badge" }, b)); }))) : null);
    return h("div", { class: "yt-lockup yt-lockup-" + style + " yt-lockup-" + m.kind + " clearfix", "data-video-id": m.kind === "video" ? m.id : null },
        h("div", { class: "yt-lockup-dismissable" + (grid ? "" : " yt-uix-tile") }, picture, content));
}
// A grid of lockups, as channels and the home page show them.
function gridOf(items, opts) {
    const o = opts || {};
    return h("ul", { class: "shelf-content" + (o.cls ? " " + o.cls : "") }, items.map(function(m) {
        return h("li", { class: "yt-shelf-grid-item" + (m.kind === "channel" ? " channels-content-item channel-shelf-item" : "") }, lockup(m, "grid", o.w, o.h));
    }));
}
// A shelf: a titled row (horizontal), list (vertical) or grid of lockups.
function shelfEl(s, opts) {
    const o = opts || {};
    const title = s.title ? h("div", { class: "shelf-title-table" }, h("div", { class: "shelf-title-row" }, h("h2", { class: "branded-page-module-title shelf-title-cell" }, s.url ? h("a", { href: s.url, class: "branded-page-module-title-link" }, h("span", { class: "branded-page-module-title-text" }, s.title)) : h("span", { class: "branded-page-module-title-text" }, s.title)))) : null;
    let body;
    if (s.layout === "vertical" || o.vertical) {
        body = h("div", { class: "expanded-shelf" }, h("ul", { class: "expanded-shelf-content-list has-multiple-items" }, s.items.map(function(m) {
            return h("li", { class: "expanded-shelf-content-item-wrapper" }, h("div", { class: "expanded-shelf-content-item" }, lockup(m, "tile", o.w, o.h)));
        })));
    } else if (s.layout === "grid" || o.grid) {
        body = h("div", { class: "multirow-shelf" }, gridOf(s.items, o));
    } else {
        body = shelfSlider(s.items, o);
    }
    return h("div", { class: "feed-item-container browse-list-item-container yt-section-hover-container compact-shelf shelf-item branded-page-box clearfix" + (o.cls ? " " + o.cls : "") },
        h("div", { class: "feed-item-dismissable" }, title, body));
}
// The sliding row of a horizontal shelf, with its two arrows: one page of items at a time.
function shelfSlider(items, opts) {
    const list = h("ul", { class: "yt-uix-shelfslider-list" }, items.map(function(m) {
        return h("li", { class: "yt-shelf-grid-item yt-uix-shelfslider-item" + (m.kind === "channel" ? " channels-content-item channel-shelf-item" : "") }, lockup(m, "grid", opts.w, opts.h));
    }));
    const body = h("div", { class: "yt-uix-shelfslider-body yt-viewport" }, list);
    const el = h("div", { class: "compact-shelf yt-uix-shelfslider yt-uix-shelfslider-at-head" }, body);
    const page = function(dir) {
        const width = body.clientWidth || 1;
        const max = Math.max(0, list.scrollWidth - width);
        const next = Math.min(max, Math.max(0, (Number(list.dataset.at) || 0) + dir * width));
        list.dataset.at = next;
        list.style.transform = "translateX(" + (-next) + "px)";
        el.classList.toggle("yt-uix-shelfslider-at-head", next === 0);
        el.classList.toggle("yt-uix-shelfslider-at-tail", next >= max);
    };
    ["prev", "next"].forEach(function(dir) {
        el.appendChild(h("button", { class: "yt-uix-button yt-uix-button-size-default yt-uix-button-shelf-slider-pager yt-uix-shelfslider-" + dir, type: "button", "aria-label": dir === "prev" ? "Previous" : "Next", onclick: function() { page(dir === "prev" ? -1 : 1); } },
            h("span", { class: "yt-uix-button-content" }, h("span", { class: "yt-uix-shelfslider-" + dir + "-arrow yt-sprite" }, icon(dir === "prev" ? "back" : "next")))));
    });
    return el;
}
// The subscribe button of a channel. The actions module makes it work; here it only looks right.
function subscribeButton(sub, size) {
    const s = sub || {};
    const container = h("span", { class: "yt-uix-button-subscription-container", "data-channel-id": s.channelId || "" });
    const btn = button({ text: s.subscribed ? "Subscribed" : "Subscribe", style: s.subscribed ? "subscribed-branded" : "subscribe-branded", size: size || "default", cls: "yt-uix-subscription-button" + (s.subscribed ? " yt-uix-subscription-button-subscribed" : ""), disabled: s.enabled === false || null });
    btn.dataset.channelId = s.channelId || "";
    btn.dataset.subscribed = s.subscribed ? "1" : "";
    container.appendChild(btn);
    if (s.count) {
        container.appendChild(h("span", { class: "yt-subscription-button-subscriber-count-branded-horizontal yt-subscriber-count", title: s.count }, s.count.replace(/\s*subscribers?$/i, "")));
    }
    return container;
}
// A "Load more" button that fetches a continuation and hands the response to onMore, which returns
// the next continuation (or nothing when the list is finished). With autoload, it fires when it
// scrolls into view, the way the Polymer site loaded more.
function loadMore(cont, onMore, opts) {
    const o = opts || {};
    let current = cont;
    let busy = false;
    const btn = h("button", { class: "yt-uix-button yt-uix-button-size-default yt-uix-button-default load-more-button yt-uix-load-more browse-items-load-more-button" + (o.cls ? " " + o.cls : ""), type: "button", "aria-label": o.text || "Load more" },
        h("span", { class: "yt-uix-button-content" },
            h("span", { class: "load-more-loading hid" }, h("span", { class: "yt-spinner" }, h("span", { class: "yt-spinner-img yt-sprite", title: "Loading icon" }), " Loading...")),
            h("span", { class: "load-more-text" }, o.text || "Load more")));
    const go = async function() {
        if (busy || !current) {
            return;
        }
        busy = true;
        btn.classList.add("loading");
        try {
            const resp = await api.more(current);
            current = (await onMore(resp)) || null;
        } catch (e) {
            console.error("Gplex YouTube: load more", e);
            current = null;
        }
        busy = false;
        btn.classList.remove("loading");
        if (!current) {
            btn.remove();
        }
    };
    btn.addEventListener("click", go);
    if (o.autoload && "IntersectionObserver" in window) {
        const io = new IntersectionObserver(function(entries) {
            if (entries.some(function(e) { return e.isIntersecting; })) {
                go();
            }
        }, { rootMargin: "400px" });
        io.observe(btn);
    }
    return btn;
}
function messageEl(m) {
    return h("div", { class: "gy-message" }, h("p", { class: "display-message" }, m.text || m), m.detail ? h("p", { class: "display-message-detail" }, m.detail) : null);
}
// Models -> the page's main list: shelves as shelves, loose items as a grid (home) or tiles (lists).
function sectionEl(models, opts) {
    const o = opts || {};
    const out = [];
    let loose = [];
    const flush = function() {
        if (!loose.length) {
            return;
        }
        if (o.tiles) {
            out.push(h("ol", { class: "item-section" }, loose.map(function(m) { return h("li", null, lockup(m, "tile", o.w, o.h)); })));
        } else {
            out.push(h("div", { class: "feed-item-container browse-list-item-container yt-section-hover-container branded-page-box clearfix" }, h("div", { class: "feed-item-dismissable" }, h("div", { class: "multirow-shelf" }, gridOf(loose, o)))));
        }
        loose = [];
    };
    models.forEach(function(m) {
        if (m.kind === "shelf") {
            flush();
            out.push(shelfEl(m, { vertical: o.tiles, w: o.w, h: o.h }));
        } else if (m.kind === "message") {
            flush();
            out.push(messageEl(m));
        } else if (m.kind === "correction") {
            flush();
            out.push(h("div", { class: "spell-correction spell-correction-dym" }, h("span", { class: "spell-correction-corrected" }, m.label + " "), h("a", { href: m.url, class: "spell-correction-corrected-query" }, h("i", null, m.query)), m.original ? [h("br"), "Search instead for ", h("a", { href: m.originalUrl }, m.original)] : null));
        } else if (m.kind === "featured") {
            flush();
            out.push(featuredEl(m.video));
        } else if (m.kind === "video" || m.kind === "playlist" || m.kind === "channel") {
            loose.push(m);
        }
    });
    flush();
    return out;
}
// A channel's trailer: the video with its description, as the channel's home tab shows it.
function featuredEl(v) {
    return h("div", { class: "video-player-view-component branded-page-box clearfix" },
        h("div", { class: "c4-player-container" }, h("a", { href: v.url, class: "c4-player-thumb" }, h("img", { src: videoThumb(v.id, "hq"), alt: "" }), h("span", { class: "play-icon yt-sprite" }, icon("play")))),
        h("div", { class: "c4-video-info" },
            h("h3", { class: "title" }, h("a", { href: v.url }, v.title)),
            h("div", { class: "metadata" }, [v.views, v.published].filter(Boolean).join(" • ")),
            v.snippet ? h("div", { class: "description" }, richText(v.snippet)) : null));
}
