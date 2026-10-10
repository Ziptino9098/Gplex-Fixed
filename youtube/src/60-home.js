// ---- home, feeds, search and playlist pages ----

const FEED_HREF = "/feed/what_to_watch/recommended";
// 2008-2009 and 2012 open on the feed list; 2022 on the grid
function homeRedirect() {
    if (location.href !== "https://www.youtube.com/" || !ERA.homeRedir) {
        return false;
    }
    location.replace("https://www.youtube.com" + FEED_HREF + (ERA.homeRedir === "feedGrid" ? "?flow=grid" : ""));
    return true;
}
// the feed is drawn as the home page
function feedAsHome() {
    if (location.pathname === FEED_HREF) {
        when("#page", function(p) {
            p.className = "feed clearfix";
        });
        if (has("CosmicGuideLayout")) {
            when("#FEwhat_to_watch-guide-item", function(item) {
                const a = $("a.guide-item-selected", item);
                if (a) {
                    a.classList.remove("guide-item-selected");
                }
            });
        }
    }
}
// 2007-2012: the recommended shelf stands in the right-hand column, with the period's rules
function thirdColumn() {
    if (!$("#page.home") || location.pathname.indexOf("/feed") === 0 || $("#epic-panda-rules")) {
        return;
    }
    when(".feed-item-container:nth-child(5) img", function() {
        const containers = $$(".feed-item-container");
        let recs = $(".lohp-newspaper-shelf") ? containers[1] : containers[0];
        if (recs && $(".lohp-newspaper-shelf", recs)) {
            recs = containers[2];
        }
        const column = $(".branded-page-v2-secondary-col");
        const box = column && $(".branded-page-box", column);
        if (!recs || !box) {
            return;
        }
        recs.style.display = "block";
        box.appendChild(recs);
        column.insertBefore(fromHtml('<div id="epic-panda-rules">' + T.pandaRules + "</div>"), column.firstChild);
        when(".feed-item-container:nth-child(10) img", function() {
            $$(".compact-shelf:not(.rule-added)").forEach(function(shelf) {
                shelf.classList.add("rule-added");
                shelf.insertBefore(fromHtml('<div class="horizontal-rule">' + T.shelfRule + "</div>"), shelf.firstChild);
            });
        }, 60000);
    });
}
function stargazerFeedHeader() {
    if (pageKind() !== "feed-recs" || $(".stargazer-feed-header")) {
        return;
    }
    when(".branded-page-v2-subnav-container", function(c) {
        setHtml(c, T.stargazerFeedHeader);
    });
}
// 2012: "From YouTube" and "Subscriptions" heads
function cosmicFeedHeader() {
    const kind = pageKind();
    const title = kind === "feed-recs" ? "From YouTube" : kind === "feed-subs" ? "Subscriptions" : "";
    if (!title || $(".epic-feed-header")) {
        return;
    }
    when(".branded-page-v2-subnav-container", function(c) {
        setHtml(c, fill(T.cosmicFeedHeader, { title: title }));
    });
}
// 2022: the home grid shows each channel's picture, and the topic chips sit above it
function richGridHome() {
    if (!$("#page.home") && pageKind() !== "feed-recs") {
        return;
    }
    $("#content").classList.add("yt-rich-grid");
    $$(".yt-shelf-grid-item").forEach(function(item) {
        if ($(".yt-lockup-user-photo", item) || !item.data) {
            return;
        }
        const r = dig(item, "data.richItemRenderer.content.gridVideoRenderer") || dig(item, "data.richItemRenderer.content.videoRenderer") || item.data.compactVideoRenderer;
        const ctx = r && r.contextItemData;
        const endpoint = ctx && ctx.authorNavigationEndpoint;
        const pfp = ctx && (ctx.authorAvatar || dig(r, "channelThumbnail.thumbnails.0.url"));
        if (!pfp || !endpoint) {
            return;
        }
        const url = dig(endpoint, "browseEndpoint.canonicalBaseUrl") || dig(endpoint, "watchEndpoint.canonicalBaseUrl") || "";
        const content = $(".yt-lockup-content", item);
        const photo = fromHtml('<a class="yt-lockup-user-photo"><img></a>');
        photo.href = url;
        $("img", photo).src = pfp;
        photo.data = { abstractVorElement: { navigationEndpoint: endpoint } };
        content.insertBefore(photo, content.firstChild);
        const details = fromHtml('<div class="yt-lockup-details"></div>');
        content.insertBefore(details, content.children[1]);
        [".yt-lockup-title", ".yt-lockup-meta", ".yt-lockup-badges"].forEach(function(s) {
            move($(s, item), details);
        });
        item.classList.add("yt-rich-lockup-item");
    });
    const more = $("#content li + .continuation_item_wrapper button:not(.listening)");
    if (more) {
        more.classList.add("listening");
        more.addEventListener("click", function() {
            when("#content li + .continuation_item_wrapper button:not(.listening)", richGridHome);
        });
    }
    const chips = $("[location^='feed'] .branded-page-v2-subnav-container ul:not(.st-chip-bar)");
    if (chips) {
        const container = $(".branded-page-v2-subnav-container");
        const bar = fromHtml('<div class="st-chip-bar-container"></div>');
        container.insertBefore(bar, container.firstChild);
        bar.appendChild(chips);
        chips.classList.add("st-chip-bar", "flex-bar");
        chips.style.transform = "translateX(0)";
        const all = $(".yt-uix-button-menu-item-selected", chips);
        if (all) {
            all.className = "st-chip listening active st-chip-all yt-uix-tooltip";
            all.addEventListener("click", function() {
                location.reload();
            });
        }
        $$("li:not(.listening)", chips).forEach(function(chip) {
            chip.className = "st-chip listening";
            chip.addEventListener("click", function() {
                $$(".st-chip.active").forEach(function(c) {
                    c.classList.remove("active");
                });
                chip.classList.add("active");
                when("#content li + .continuation_item_wrapper button:not(.listening)", richGridHome);
            });
        });
    }
}
// 2017+: the shelves' arrows as icons
function shelfIcons() {
    if (FAMILY !== "poly" || location.pathname.indexOf("/feed") === 0 || !($(".home") || $(".channel"))) {
        return;
    }
    when(".yt-uix-shelfslider-next", function() {
        $$(".compact-shelf").forEach(function(shelf) {
            [["next", ICONS.rChev], ["prev", ICONS.lChev]].forEach(function(p) {
                const wrap = $(".yt-uix-shelfslider-" + p[0] + ":not(.icon-added) .yt-uix-button-icon-wrapper", shelf);
                if (wrap) {
                    wrap.parentNode.classList.add("icon-added", "st-shelf-btn");
                    wrap.insertBefore(svgIcon(p[1][0], p[1][1]), wrap.firstChild);
                }
            });
        });
    }, 60000);
}
// the search page: 2007-2012's "Search results for" head, 2017+'s filter icon
function searchPage() {
    if (!$("#page.search")) {
        return;
    }
    if (has("AozoraSearch") && !$("#aozora-search-header")) {
        const query = ($("#masthead-search-term") || {}).value || "";
        const results = (($(".num-results span") || {}).textContent || "").toLowerCase().split(" r")[0].split("t ")[1] || "";
        const header = $(".search-header");
        if (header) {
            header.insertBefore(fromHtml('<div id="aozora-search-header">' + fill(T.aozoraSearchHeader, { searchValue: query.replace(/</g, "&lt;"), resultCount: results }) + "</div>"), header.firstChild);
        }
    }
    if (FAMILY === "poly" && !$("#st-filter-icon")) {
        const btn = $(".search-header .yt-uix-button-content");
        if (btn) {
            btn.insertBefore(fromHtml('<div id="st-filter-icon">' + T.filterIcon + "</div>"), btn.firstChild);
        }
    }
}
// 2017+: the playlist page's owner row and icon buttons
function polymerPlaylist() {
    if (FAMILY !== "poly" || pageKind() !== "playlist") {
        return;
    }
    when(".channel-header-profile-image-container", function() {
        if ($("#st-pp-pfp")) {
            return;
        }
        const header = $(".pl-header-content");
        if (!header) {
            return;
        }
        const owner = fromHtml('<div id="st-poly-playlist-owner" class="flex-bar">' + T.polyPlaylistOwner + "</div>");
        header.appendChild(owner);
        const actions = fromHtml('<div id="st-poly-playlist-actions" class="flex-bar">' + T.polyPlaylistActions + "</div>");
        header.insertBefore(actions, header.children[2] || null);
        move($(".channel-header-profile-image-container"), $("#st-pp-pfp"));
        move($(".pl-header-details li"), $("#st-pp-name"));
        when("#c4-primary-header-contents .yt-uix-button-subscription-container", function(sub) {
            move(sub, $("#st-pp-sub"));
        });
    });
}
function homePage(kind) {
    if (kind === "home" && (FAMILY === "stargazer" || FAMILY === "aozora" || FAMILY === "cosmic" || /^hh2013_[12]$/.test(ERA.id))) {
        thirdColumn();
    }
    if (FAMILY === "cosmic") {
        cosmicFeedHeader();
    }
    if (ERA.id === "stargazer2008_1" || ERA.id === "stargazer2009_1") {
        stargazerFeedHeader();
    }
    if (has("RichGridHome")) {
        setTimeout(richGridHome, 200);
    }
    shelfIcons();
}
