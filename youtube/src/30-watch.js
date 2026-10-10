// ---- watch page: the period's rows around V3's player, filled from what V3 knows and from YouTube ----

// what the page knows about the video (StarTube's CWD), reset on each navigation
let video = {};
function watchId() {
    const m = /[?&]v=([^&]+)/.exec(location.search) || /\/shorts\/([^/?&]+)/.exec(location.pathname);
    return m ? m[1] : "";
}
const WATCH_WL = { watch3: "w3", watch4a: "w4a", watch4b: "w4b", watch5a: "w5a", watch5b: "w5b", watch5c: "w5c", watch5d: "w5d", watch7: "w7",
    watch8: "w8", watch9a: "w9a", watch9b: "w9b", watch9c: "w9c", watch10beta: "w10beta" };
const TITLE_ON_TOP = /^watch[345]/;
const VIDEO_DROPDOWN = /^watch5[acd]$/;
const OLD_LOOK = /^watch[345]/;

// ---- the rows
function buildWatch() {
    const content = $("#watch7-content.watch-content");
    const sidebar = $("#watch7-sidebar-contents");
    if (!content || !sidebar || $("#st-watch-below-container")) {
        return;
    }
    const wl = ERA.watch;
    const at = $("#watch7-creator-bar") ? 1 : 0;
    const container = function(id, cls, markup) {
        return fromHtml('<div id="' + id + '" class="' + cls + " " + wl + '" wl="' + wl + '">' + markup + "</div>");
    };
    content.insertBefore(container("st-watch-below-container", "stdustwb", T.watchBelow), content.children[at]);
    content.insertBefore(container("st-watch-above-container", "stdustwa", T.watchAbove), content.children[at]);
    sidebar.insertBefore(container("st-watch-side-container", "stdustws", T.watchSide), sidebar.firstChild);
    sidebar.classList.add(wl);
    const put = function(holder, row) {
        setHtml($("#st-" + holder + "-row-holder"), T.rows[row]);
    };
    if (TITLE_ON_TOP.test(wl)) {
        put("above-title", "aboveTitle");
    } else if (wl !== "watch7") {
        put("below-title", "belowTitle");
    }
    if (/^watch4/.test(wl)) {
        put("ratings-info", "ratingsInfo");
        put("watch-tabs", "watchTabs");
        put("side-banner", "sideBanner");
        put("side-owner", "sideOwner");
        put("side-desc", "sideDesc");
        put("side-panels", "sidePanels");
        $("#st-watch-below").setAttribute("state", "share");
    }
    if (VIDEO_DROPDOWN.test(wl)) {
        put("above-owner", "aboveOwner");
        put("above-videos", "aboveVideos");
        put("actions-info", "actionsInfo");
        put("panels", "panels");
        put("desc", "desc");
        wireVideoDropdown();
    }
    if (wl === "watch8") {
        put("owner-info", "ownerInfo");
        put("actions", "actions");
        put("panels", "panels");
        put("desc", "desc");
        put("floaters", "floaters");
        put("extras", "extras");
    }
    if (wl === "watch9a") {
        put("info-actions", "infoActions");
        put("owner", "owner");
        put("desc", "desc");
        put("floaters", "floaters");
        put("extras", "extras");
        put("side-panels", "sidePanels");
        setTimeout(buildPopups, 1500);
    }
    if (wl === "watch10beta") {
        put("desc-actions", "descActions");
        put("owner-teaser", "ownerTeaser");
        put("floaters", "floaters");
        put("extras", "extras");
        put("side-panels", "sidePanels");
        setTimeout(buildPopups, 1500);
    }
    if (TITLE_ON_TOP.test(wl)) {
        setTimeout(topHeight, 1000);
    }
    moveWatchElements();
    wireWatchActions();
    if (FAMILY === "cosmic") {
        const toggle = $("#watch-description-toggle");
        if (toggle) {
            const rule = fromHtml('<div id="watch5-horizontal-rule">' + T.horizontalRule + "</div>");
            toggle.insertBefore(rule, toggle.firstChild);
        }
        when("#watch7-sidebar", function(sb) {
            if (!$("#sidebar-panda-rules")) {
                sb.insertBefore(fromHtml('<div id="sidebar-panda-rules">' + T.verticalRules + "</div>"), sb.firstChild);
            }
        });
    }
    if (wl === "watch5d") {
        $$(".st-btn").forEach(function(b) {
            b.classList.add("yt-uix-button", "yt-uix-button-default", "yt-uix-button-size-default");
        });
    }
    if (/^watch5[abc]$/.test(wl)) {
        $$(".st-btn").forEach(function(b) {
            b.classList.add("aozora-button");
        });
    }
    subscribeButtonStyle();
}
function topHeight() {
    const above = $("#st-watch-above");
    if (above) {
        body().style.setProperty("--top-title-height", above.offsetHeight + "px");
    }
}
// the subscribe button takes the period's shape (the stylesheet draws each class)
function subscribeButtonStyle() {
    const cls = FAMILY === "cosmic" ? "st-cosmic-watch-sub" : ERA.watch === "watch9a" || ERA.watch === "watch10beta" ? "st-poly-sub" :
        FAMILY === "poly" || /^hh(E2015|2015|E2016|M2016|2016)$/.test(ERA.id) ? "st-modern-sub" : ERA.id === "hh2013_1" ? "st-classic-sub" :
        /^hh201[34]/.test(ERA.id) ? "st-skinny-sub" : FAMILY === "stargazer" && ERA.id !== "cloudgazer2007_1" ? "st-stargazer-sub" :
        ERA.id === "cloudgazer2007_1" ? "st-cirrus-sub" : FAMILY === "aozora" ? "st-aozora-sub" : "";
    if (!cls) {
        return;
    }
    [$(".st-sub-button"), $("#watch7-subscription-container")].forEach(function(el) {
        if (el) {
            el.classList.add(cls);
            if (ERA.id === "poly2022" || (ERA.watch === "watch10beta")) {
                el.classList.add("st-poly-g2-sub");
            }
        }
    });
}
// V3's pieces move into the rows
function moveWatchElements() {
    const wl = ERA.watch;
    const b = body();
    attr(b, "has-ts", $("#watch7-secondary-actions .hid.yt-uix-button:nth-child(4)") ? "false" : "true");
    video.hasTranscript = !$("#watch7-secondary-actions .hid.yt-uix-button:nth-child(4)");
    $("#st-watch-below-container").setAttribute("no-owner", "false");
    move($("#watch7-headline"), $(".st-title"));
    if ($(".st-ltod-bar") && $(".video-extras-likes-dislikes")) {
        move($(".video-extras-sparkbars"), $(".st-ltod-bar"));
        move($(".video-extras-likes-dislikes"), $(".st-ltod-bar"));
    }
    move($("#watch7-sentiment-actions"), $(".st-ltod-buttons"));
    if (wl !== "watch7") {
        move($("#watch7-content #watch7-subscription-container"), $(".st-sub-button"));
    }
    move($("#watch-description"), $(".st-desc-content"));
    if (wl !== "watch7") {
        // the action panels exist once their buttons were pressed
        [2, 3, 4, 5, 6].forEach(function(n) {
            const btn = $("#watch7-secondary-actions .yt-uix-button:nth-child(" + n + ")");
            if (btn) {
                btn.click();
            }
        });
    }
    const first = function(sel, into) {
        const el = $(sel);
        const home = $(into);
        if (el && home) {
            home.insertBefore(el, home.firstChild);
        }
    };
    first("#action-panel-share", ".st-share-content");
    first("#action-panel-addto", ".st-addto-content");
    first("#action-panel-stats", ".st-stats-content");
    first("#action-panel-report", ".st-report-content");
    first("#action-panel-transcript", (wl === "watch9a" || wl === "watch10beta") && $(".st-side-panel .st-transcript-content") ? ".st-side-panel .st-transcript-content" : ".st-transcript-content");
    if (wl === "watch8" || wl === "watch9a" || wl === "watch10beta") {
        const clip = $("#watch-description-clip");
        const extra = $("#watch-description-extra-info");
        if (clip && extra) {
            clip.insertBefore(extra, clip.children[2]);
        }
    }
    if (wl !== "watch7") {
        first("#watch7-main .yt-user-name", ".st-owner-name");
    }
    if (/^watch4/.test(wl)) {
        when(".watch-sidebar-section:not(.st-moved):not(.new)", function() {
            const holder = $("#watch-related-holder");
            const next = function() {
                return $("#watch7-sidebar-contents > .watch-sidebar-section:not(.st-moved)");
            };
            const chat = !!$(".live_chat_box_iframe_holder");
            const sections = $$("#watch7-sidebar-contents > .watch-sidebar-section");
            const take = function(el, into, at) {
                if (el) {
                    into.insertBefore(el, into.children[at] || null);
                    el.classList.add("st-moved");
                }
            };
            if (chat) {
                take(sections[1], holder, 0);
                take(next(), holder, 1);
                take(next(), $("#watch-chat-holder"), 2);
                $("#st-chat-panel").classList.remove("hid");
            } else {
                take(next(), holder, 0);
                take(next(), holder, 1);
            }
            $("#st-related-panel").classList.remove("hid");
            $("#st-videos-panel").classList.remove("hid");
        });
        const sub = $(".st-owner .st-sub-count");
        if (sub) {
            sub.classList.add("hid");
            $(".st-owner .st-upload-date").classList.remove("hid");
        }
    }
    if (wl === "watch10beta") {
        first(".st-desc-views-info", "#eow-description");
    }
    const icon = $(".st-owner-icon");
    if (icon) {
        ["verified", "autogenerated"].forEach(function(k) {
            const badge = $(".yt-uix-button-panel .yt-user-name-icon-" + k);
            if (badge) {
                icon.insertBefore(badge, icon.firstChild);
            }
        });
    }
}

// ---- the action buttons and the panels/floaters/popups they open
function stButton(holder, id, label, trigger, icon) {
    const h = $(holder);
    if (!h) {
        return null;
    }
    setHtml(h, T.button);
    const btn = $("button", h);
    btn.id = id;
    btn.classList.add(trigger);
    btn.setAttribute("data-tooltip-text", label);
    $(".st-btn-text", btn).textContent = label;
    if (icon) {
        const box = $(".st-svg", btn);
        setHtml(box, T.svg);
        $(".filled-icon path", box).setAttribute("d", icon[0]);
        $(".outline-icon path", box).setAttribute("d", icon[1]);
    }
    return btn;
}
function setState(state) {
    $("#st-watch-below").setAttribute("state", state);
}
function toggleState(state) {
    setState($("#st-watch-below").getAttribute("state") === state ? "normal" : state);
}
function closeFloaters() {
    $$(".st-floater.visible, .st-floater-fence.visible").forEach(function(el) {
        el.classList.remove("visible");
    });
    $$(".st-addto-floater-trigger.active, .st-more-floater-trigger.active").forEach(function(el) {
        el.classList.remove("active");
    });
    document.body.classList.remove("st-no-scroll");
}
function toggleFloater(trigger, floater) {
    const open = !floater.classList.contains("visible");
    closeFloaters();
    if (open) {
        trigger.classList.add("active");
        floater.classList.add("visible");
        $(".st-floater-fence").classList.add("visible");
        document.body.classList.add("st-no-scroll");
        placeFloaters();
    }
}
function placeFloaters() {
    const rise = ERA.watch === "watch8" ? 28 : 40;
    [[".st-more-floater-trigger", ".st-more-floater"], [".st-addto-floater-trigger", ".st-addto-floater"]].forEach(function(p) {
        const t = $(p[0]);
        const f = $(p[1]);
        if (t && f) {
            const r = t.getBoundingClientRect();
            f.style.top = (r.top + rise) + "px";
            f.style.left = r.left + "px";
        }
    });
}
function wireWatchActions() {
    const wl = ERA.watch;
    const floating = wl === "watch8" || wl === "watch9a" || wl === "watch10beta";
    ["like", "dislike"].forEach(function(k) {
        const wrap = $("#watch-" + k + " .yt-uix-button-icon-wrapper");
        if (wrap && !$("svg", wrap)) {
            const box = fromHtml('<div class="st-svg">' + T.svgToggle + "</div>");
            wrap.insertBefore(box, wrap.firstChild);
            $(".filled-icon path", box).setAttribute("d", ICONS[k][0]);
            $(".outline-icon path", box).setAttribute("d", ICONS[k][1]);
            $(".active-icon path", box).setAttribute("d", ICONS.like[2]);
        }
    });
    const addTo = stButton(".st-addto-button-holder", "st-addto-button", "Add to", wl === "watch8" ? "st-addto-floater-trigger" : "st-addto-trigger", ICONS.addTo);
    if (addTo && (FAMILY === "cosmic" || /^watch5[abc]$/.test(wl))) {
        const after = $(".st-btn-after-icon", addTo);
        after.classList.remove("hid");
        after.classList.add("yt-uix-button-arrow");
    }
    stButton(".st-share-button-holder", "st-share-button", "Share", "st-share-trigger", ICONS.share);
    const save = stButton(".st-save-button-holder", "st-save-button", "Save", floating ? "st-addto-floater-trigger" : "st-addto-trigger", ICONS.save);
    if (save) {
        save.addEventListener("click", function() {
            toggleState("addto");
        });
    }
    stButton(".st-transcript-button-holder", "st-transcript-button", "Transcript", "st-transcript-trigger");
    stButton(".st-report-button-holder", "st-report-button", "Report", "st-report-trigger");
    stButton(".st-stats-button-holder", "st-stats-button", "Statistics", "st-stats-trigger");
    const more = stButton(".st-more-button-holder", "st-more-button", "More", floating ? "st-more-floater-trigger" : "st-more-trigger", ICONS.more);
    if (more) {
        more.setAttribute("data-tooltip-text", "More actions");
        setHtml($(".filled-icon svg", more), T.moreDots);
    }
    $$(".st-report-trigger-2, .st-transcript-trigger-2").forEach(function(b) {
        const icon = b.classList.contains("st-report-trigger-2") ? ICONS.report : ICONS.transcript;
        $(".filled-icon path", b).setAttribute("d", icon[0]);
        $(".outline-icon path", b).setAttribute("d", icon[1]);
    });
    $$(".st-side-panel-close").forEach(function(b) {
        $(".filled-icon path", b).setAttribute("d", ICONS.x[0]);
        $(".outline-icon path", b).setAttribute("d", ICONS.x[1]);
    });
    // the 2017+ side panels open from the buttons; 2008-2009 show the channel's videos and the related
    // list as sections (moveWatchElements)
    if (!/^watch4/.test(wl) && $("#st-comments-panel .st-side-panel-close svg")) {
        ["#st-videos-panel", "#st-about-panel", "#st-transcript-panel"].forEach(function(s) {
            const p = $(s);
            if (p) {
                p.classList.add("hid");
            }
        });
    }
    const teaserIcon = $(".st-teaser .st-svg");
    if (teaserIcon) {
        $(".filled-icon path", teaserIcon).setAttribute("d", ICONS.rChev[0]);
        $(".outline-icon path", teaserIcon).setAttribute("d", ICONS.rChev[1]);
    }
    // tabs and triggers: the row's [state] shows one panel
    $$(".st-watch-trigger").forEach(function(t) {
        t.addEventListener("click", function() {
            const trigger = t.getAttribute("trigger");
            $$(".st-watch-trigger.active").forEach(function(o) {
                if (o !== t) {
                    o.classList.remove("active");
                }
            });
            if (t.classList.contains("active") && !t.classList.contains("st-tab-trigger")) {
                t.classList.remove("active");
            } else {
                t.classList.add("active");
            }
            if ($("[state='" + trigger + "']") && !t.classList.contains("st-tab-trigger")) {
                setState("normal");
            } else {
                setState(trigger);
            }
        });
    });
    [["st-share-trigger", "share"], ["st-addto-trigger", "addto"], ["st-video-info-trigger", "video-info"], ["st-desc-trigger", "desc"],
        ["st-report-trigger", "report"], ["st-transcript-trigger", "transcript"], ["st-stats-trigger", "stats"], ["st-favorite-trigger", "favorite"]].forEach(function(p) {
        $$("." + p[0]).forEach(function(t) {
            t.addEventListener("click", function() {
                $$(".st-btn.active, .st-watch-tab.active").forEach(function(o) {
                    if (!o.classList.contains(p[0])) {
                        o.classList.remove("active");
                    }
                });
                t.classList.toggle("active");
                toggleState(p[1]);
            });
        });
    });
    $$(".st-addto-floater-trigger").forEach(function(t) {
        t.addEventListener("click", function() {
            toggleFloater(t, $(".st-addto-floater"));
        });
    });
    $$(".st-more-floater-trigger").forEach(function(t) {
        t.addEventListener("click", function() {
            toggleFloater(t, $(".st-more-floater"));
        });
    });
    // the More floater's items open their panel
    [["st-report-trigger-2", "report"], ["st-stats-trigger-2", "stats"]].forEach(function(p) {
        $$("." + p[0]).forEach(function(t) {
            t.addEventListener("click", function() {
                closeFloaters();
                toggleState(p[1]);
            });
        });
    });
    $$(".st-transcript-trigger-2").forEach(function(t) {
        t.addEventListener("click", function() {
            closeFloaters();
            if (wl === "watch8") {
                toggleState("transcript");
            } else {
                $("#st-transcript-panel").classList.toggle("hid");
            }
        });
    });
    const fence = $(".st-floater-fence");
    if (fence) {
        fence.addEventListener("click", closeFloaters);
    }
    const popupFence = $(".st-popup-fence");
    if (popupFence) {
        popupFence.addEventListener("click", function() {
            setState("normal");
        });
    }
    $$(".st-side-panel .st-side-panel-expander").forEach(function(b) {
        b.addEventListener("click", function() {
            b.parentNode.toggleAttribute("expanded");
        });
    });
    wireDescription();
    const teaser = $(".st-comment-teaser");
    if (teaser) {
        teaser.addEventListener("click", function() {
            if (!$("#st-comments-panel #watch-discussion")) {
                $("#st-comments-panel").classList.remove("hid");
                move($("#watch-discussion"), $("#st-comments-panel #watch-comments-holder"));
            }
        });
        $("#st-comments-panel .st-side-panel-close").addEventListener("click", function() {
            move($("#watch-discussion"), $("#watch7-main #watch7-content"));
            $("#st-comments-panel").classList.add("hid");
        });
    }
    const tsClose = $("#st-transcript-panel .st-side-panel-close");
    if (tsClose) {
        tsClose.addEventListener("click", function() {
            $("#st-transcript-panel").classList.add("hid");
        });
    }
    $$(".st-panel-close").forEach(function(b) {
        b.addEventListener("click", function() {
            setState("normal");
            closeFloaters();
            $$(".st-btn.active").forEach(function(o) {
                o.classList.remove("active");
            });
        });
    });
}
// the description's own expander (watch5) and the 2022 click-to-expand
function wireDescription() {
    const wl = ERA.watch;
    const desc = $("#watch-description");
    if (!desc) {
        return;
    }
    if ($("#st-side-desc-row") || /^watch5/.test(wl)) {
        const ex = $(".st-owner-desc-expander");
        if (ex) {
            ex.classList.remove("hid");
            $("button", ex).addEventListener("click", function() {
                const open = desc.classList.toggle("yt-uix-expander-collapsed");
                ex.classList.toggle("expanded", !open);
            });
        }
        desc.classList.remove("yt-uix-expander");
        const toggle = $("#watch-description-toggle");
        if (toggle) {
            toggle.addEventListener("click", function() {
                desc.classList.toggle("yt-uix-expander-collapsed");
                $(".st-desc").classList.toggle("expanded");
            });
        }
    }
}
// 2017+: Share and Add to open as dialogs over the page
function buildPopups() {
    const old = $("#wmr-popups");
    if (old) {
        old.remove();
    }
    const popups = fromHtml("<div>" + T.popups + "</div>");
    popups.id = "wmr-popups";
    extraStyle("popups", popups);
    const container = body();
    container.insertBefore(popups, container.children[1]);
    ["addto-visible", "share-visible", "more-visible", "popup-visible"].forEach(function(a) {
        html.setAttribute(a, "false");
    });
    if (!$("#wmr-popups #action-panel-addto")) {
        const btn = $("#watch7-secondary-actions .yt-uix-button:nth-child(3)");
        if (btn) {
            btn.click();
        }
        when(".playlist-items", function() {
            const home = $("#wmr-addto-popup div");
            home.insertBefore($("#action-panel-addto"), home.firstChild);
        });
    }
    if (!$("#wmr-popups #action-panel-share")) {
        const btn = $("#watch7-secondary-actions .yt-uix-button:nth-child(2)");
        if (btn) {
            btn.click();
        }
        when("#eow-description", function() {
            const home = $("#wmr-share-popup div");
            home.insertBefore($("#action-panel-share"), home.firstChild);
        });
    }
    const show = function(which, on) {
        $("#wmr-" + which + "-popup").setAttribute("visible", on ? "true" : "false");
        $("#wmr-fence").setAttribute("visible", on ? "true" : "false");
        html.setAttribute(which + "-visible", on ? "true" : "false");
        html.setAttribute("popup-visible", on ? "true" : "false");
    };
    $("#wmr-fence").addEventListener("click", function() {
        show("addto", false);
        show("share", false);
        closeFloaters();
    });
    [["#st-addto-button", "addto"], ["#st-save-button", "addto"], [".st-share-trigger", "share"]].forEach(function(p) {
        const b = $(p[0]);
        if (b) {
            b.addEventListener("click", function() {
                show(p[1], $("#wmr-" + p[1] + "-popup[visible='false']") !== null);
            });
        }
    });
}

// ---- the video's facts, from V3's data and from YouTube's API
function readWatch() {
    const header = $("#watch7-user-header");
    const data = header && header.data && header.data.watch7UserHeader;
    if (!data) {
        return;
    }
    const v = video;
    v.id = v.id || watchId();
    v.isOwner = !!$("#watch7-creator-bar");
    attr(body(), "is-owner", v.isOwner);
    v.owner = dig(data, "userName.title.simpleText") || "";
    v.pfp = dig(data, "userPhoto.thumbnails.thumbnails.0.url") || "";
    const sub = dig(data, "subscribeButton.subscribeButtonRenderer");
    if (sub) {
        v.subCount = dig(sub, "subscriberCountText.simpleText") || "";
        v.subscribed = !!sub.subscribed;
    }
    const sent = dig(data, "sentimentBar.continuationItemRenderer.placeholder.sentimentBarRenderer") || {};
    v.viewCount = String(sent.viewCount || "").split(" v")[0];
    v.isLive = !$(".past_stream") && !!$(".header .now");
    const dateText = dig($("#watch-description-content"), "data.watchDescription.clip.videoDate.simpleText") || "";
    v.pubDate = dateText;
    v.date = dateText;
    v.dateMode = "special";
    if (/Published|Uploaded/.test(dateText)) {
        v.date = dateText.split("on ")[1] || dateText;
        v.dateMode = "normal";
    }
    v.superDate = longMonth(dateText);
    v.channelId = dig(data, "originalNavigationEndpoint.browseEndpoint.browseId") || "";
    v.channelLink = "/channel/" + v.channelId;
    v.videosLink = v.channelLink + "/videos";
    v.avgRating = Number(sent.averageRating || 0);
    v.sentimentState = sent.sentimentState || "INDIFFERENT";
    v.starRating = Math.floor(v.avgRating * 2) / 2;
    if (sent.dislikeCount !== null && sent.dislikeCount !== undefined) {
        v.ratingCount = withCommas((sent.likeCount || 0) + (sent.dislikeCount || 0));
        v.likeCount = withCommas(sent.likeCount || 0);
        v.dislikeCount = withCommas(sent.dislikeCount || 0);
    } else {
        v.ratingCount = v.likeCount = v.dislikeCount = "0";
    }
    applyWatch();
    if (v.isLive || !v.shortViewCount) {
        updateWatch();
        if (v.isLive) {
            v.liveTimer = setInterval(updateWatch, 5000);
        }
    }
}
const MONTHS = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December" };
function longMonth(s) {
    const m = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(.*)$/.exec(s || "");
    return m ? MONTHS[m[1]] + m[2] : s;
}
// the short view count, relative date and live numbers come from YouTube's "next" response
function updateWatch() {
    const v = video;
    const id = v.id;
    innertube("next", { videoId: id }).then(function(r) {
        if (video.id !== id) {
            return;
        }
        const list = dig(r, "contents.twoColumnWatchNextResults.results.results.contents") || [];
        const primary = (list.find(function(x) { return x.videoPrimaryInfoRenderer; }) || {}).videoPrimaryInfoRenderer;
        const secondary = (list.find(function(x) { return x.videoSecondaryInfoRenderer; }) || {}).videoSecondaryInfoRenderer;
        if (!primary) {
            return;
        }
        v.relativeDate = dig(primary, "relativeDateText.simpleText") || v.relativeDate;
        const vc = dig(primary, "viewCount.videoViewCountRenderer") || {};
        v.shortViewCount = (dig(vc, "shortViewCount.simpleText") || dig(vc, "extraShortViewCount.simpleText") || "").split(" v")[0];
        if (!v.pfp && secondary) {
            v.pfp = dig(secondary, "owner.videoOwnerRenderer.thumbnail.thumbnails.0.url") || "";
        }
        if (v.isLive) {
            const runs = dig(vc, "viewCount.runs") || [];
            v.viewCount = runs.map(function(x) { return x.text; }).join("");
            v.date = dig(primary, "dateText.simpleText") || v.date;
        }
        if (ERA.watch !== "watch7") {
            applyWatch();
        }
    }).catch(function() {});
}
// writes the facts into every row that shows them
function applyWatch() {
    const v = video;
    const old = OLD_LOOK.test(ERA.watch);
    const ext = has("ViewsString") && !v.isLive && !old ? " views" : "";
    text(".st-view-count", v.viewCount + ext);
    text(".st-short-view-count", (v.shortViewCount || v.viewCount) + ext);
    text(".st-upload-date", FAMILY === "stargazer" && v.superDate ? v.superDate : v.date);
    text(".st-pub-date", v.pubDate);
    text(".st-join-date", v.shortJoinedDate || "");
    text(".st-relative-date", v.relativeDate || v.date);
    $$(".st-pfp").forEach(function(a) {
        v3Link(a, "browse", v.channelId, v.channelLink);
        const img = $("img", a);
        if (img) {
            img.src = v.pfp;
        }
    });
    $$(".st-owner-name-spec, .st-owner-handle").forEach(function(a) {
        a.textContent = a.classList.contains("st-owner-handle") ? (v.channelHandle || "") : v.owner;
        v3Link(a, "browse", v.channelId, v.channelLink);
    });
    text(".st-owner-name-text", v.owner);
    const subCount = $(".st-sub-count");
    if (subCount) {
        subCount.textContent = v.subCount ? v.subCount + " subscribers" : v.channelSubCount && v.channelSubCount !== "0" ? v.channelSubCount + " subscribers" : "";
    }
    if ($("#st-edit-vid")) {
        $("#st-analytics").href = "https://www.youtube.com/analytics#;fi=v-" + v.id;
        $("#st-edit-vid").href = "https://studio.youtube.com/video/" + v.id + "/edit";
    }
    text(".st-video-count", v.videoCount || "");
    text(".st-short-video-count", v.shortVideoCount || "");
    $$(".st-video-count-link").forEach(function(a) {
        v3Link(a, "browse", v.channelId, v.videosLink, "EgZ2aWRlb3PyBgQKAjoA");
    });
    text(".st-channel-video-count", v.channelVideoCount || "");
    text(".st-channel-sub-count", v.channelSubCount || "");
    text(".st-channel-view-count", v.channelViewCount || "");
    text(".st-joined-date", v.joinedDate || "");
    $$(".st-channel-desc").forEach(function(el) {
        setHtml(el, v.channelDesc || "<i>No description available.</i>");
    });
    $$(".st-banner").forEach(function(img) {
        const box = img.parentNode.parentNode;
        if (v.banner) {
            img.src = v.banner;
            box.classList.remove("empty");
        } else {
            box.classList.add("empty");
        }
    });
    applyTeaser();
    if (v.dateMode === "normal" && $(".st-fancy-upload-date")) {
        $(".st-fancy-upload-date").classList.add("normal-date");
    }
    const url = $("#st-url input");
    if (url) {
        url.value = "https://www.youtube.com/watch?v=" + v.id;
        url.onclick = function() {
            url.select();
        };
    }
    stars();
}
function applyTeaser() {
    const t = $(".st-teaser-comment-text");
    if (!t) {
        return;
    }
    if (video.commentTeaserText) {
        t.textContent = video.commentTeaserText;
        $(".st-comment-teaser-pfp").src = video.commentTeaserPfp;
        $(".st-comment-teaser").setAttribute("has-comment", "");
    } else {
        $(".st-your-pfp").src = me.pfp;
    }
    text(".st-comment-count", video.commentCount || "");
}
// 2008-2009's five stars: the rating as it was, likes and dislikes behind it
function stars() {
    const box = $(".st-stars");
    if (!box || box.hasAttribute("rating")) {
        return;
    }
    const v = video;
    box.setAttribute("rating", v.starRating);
    $(".st-stars-object").setAttribute("title", v.starRating);
    $(".st-stars-rating-count").setAttribute("data-tooltip-text", v.likeCount + " likes, " + v.dislikeCount + " dislikes");
    $(".st-rating-count").textContent = v.ratingCount;
    if (v.sentimentState === "LIKE") {
        box.setAttribute("your-rating", "like");
        $(".st-your-star-rating").textContent = "5";
    } else if (v.sentimentState === "DISLIKE") {
        box.setAttribute("your-rating", "dislike");
        $(".st-your-star-rating").textContent = "1";
    }
    $$(".st-star").forEach(function(star) {
        const n = star.getAttribute("stars");
        const sent = star.getAttribute("sent");
        star.addEventListener("mouseenter", function() {
            $(".st-stars-fence").classList.remove("hid");
            if (!box.hasAttribute("your-rating")) {
                box.setAttribute("hover-rating", n);
                $(".st-your-star-rating").textContent = n;
            }
        });
        star.addEventListener("click", function() {
            box.removeAttribute("hover-rating");
            $(".st-your-star-rating").textContent = n;
            rate(sent);
            if (box.getAttribute("your-rating") === sent) {
                box.removeAttribute("your-rating");
            } else {
                box.setAttribute("your-rating", sent);
            }
        });
    });
    $(".st-stars-fence").addEventListener("mouseenter", function() {
        $(".st-stars-fence").classList.add("hid");
        box.removeAttribute("hover-rating");
    });
}
// likes and dislikes press the page's own buttons (YouTube signs those itself)
function rate(kind) {
    if (!me.loggedIn) {
        return;
    }
    const sels = kind === "like" ? [".like-button-renderer-like-button:not(.hid)", "#watch-like"] : [".like-button-renderer-dislike-button:not(.hid)", "#watch-dislike"];
    for (let i = 0; i < sels.length; i++) {
        const btn = $(sels[i]);
        if (btn) {
            btn.click();
            break;
        }
    }
    const was = video.sentimentState;
    video.sentimentState = kind === "like" ? (was === "LIKE" ? "INDIFFERENT" : "LIKE") : (was === "DISLIKE" ? "INDIFFERENT" : "DISLIKE");
}

// ---- the channel's videos beside the video (2008-2012 "Videos" dropdown and list, 2017+ panel)
const VIDEOS_PARAMS = "EgZ2aWRlb3PyBgQKAjoA";
function loadChannelVideos() {
    const v = video;
    if (!v.channelId || v.channelVideosRequested) {
        return;
    }
    v.channelVideosRequested = true;
    innertube("browse", { browseId: v.channelId, params: VIDEOS_PARAMS }).then(function(r) {
        if (video !== v) {
            return;
        }
        const header = dig(r, "header.pageHeaderRenderer.content.pageHeaderViewModel") || {};
        v.aboutCont = dig(header, "description.descriptionPreviewViewModel.rendererContext.commandContext.onTap.innertubeCommand.showEngagementPanelEndpoint.engagementPanel.engagementPanelSectionListRenderer.content.sectionListRenderer.contents.0.itemSectionRenderer.contents.0.continuationItemRenderer.continuationEndpoint.continuationCommand.token") || dig(header, "description.descriptionPreviewViewModel.rendererContext.commandContext.onTap.innertubeCommand.showEngagementPanelEndpoint.engagementPanel.engagementPanelSectionListRenderer.content.sectionListRenderer.contents.0.itemSectionRenderer.contents.0.continuationItemRenderer.continuationEndpoint.continuationCommand.token");
        if (v.aboutCont && !v.joinedDate) {
            loadChannelAbout();
        }
        const sources = dig(header, "banner.imageBannerViewModel.image.sources");
        if (sources && sources.length) {
            v.banner = sources[0].url;
            v.bannerHQ = sources[sources.length - 1].url;
        }
        const count = ($(".yt-user-videos") || {}).textContent || "";
        v.videoCount = count || "No videos";
        v.shortVideoCount = count.split(" v")[0] || "0";
        const grid = dig(r, "contents.twoColumnBrowseResultsRenderer.tabs.1.tabRenderer.content.richGridRenderer");
        if (!grid) {
            attr(document.body, "channel-sort", "false");
            v.channelVideos = null;
            v.videoCount = "No videos";
            v.shortVideoCount = "0";
            return;
        }
        const chips = dig(grid, "header.chipBarViewModel.chips");
        if (chips) {
            attr(document.body, "channel-sort", "true");
            v.sortTokens = chips.map(function(c) { return dig(c, "chipViewModel.tapCommand.innertubeCommand.continuationCommand.token"); });
        } else {
            attr(document.body, "channel-sort", "false");
        }
        v.channelVideos = grid.contents || [];
        fillChannelVideos();
    }).catch(function() {});
}
function loadChannelAbout() {
    const v = video;
    innertube("browse", { browseId: v.channelId, continuation: v.aboutCont }).then(function(r) {
        if (video !== v) {
            return;
        }
        const ab = dig(r, "onResponseReceivedEndpoints.0.appendContinuationItemsAction.continuationItems.0.aboutChannelRenderer.metadata.aboutChannelViewModel") || {};
        v.channelDesc = ab.description ? ab.description.replace(/</g, "&lt;").replace(/\n/g, "<br>") : "<i>No description available.</i>";
        v.joinedDate = dig(ab, "joinedDateText.content") || "";
        v.shortJoinedDate = v.joinedDate.split("d ")[1] || "";
        v.channelSubCount = String(ab.subscriberCountText || "0").split("s")[0];
        v.channelVideoCount = String(ab.videoCountText || "0").split("v")[0];
        v.channelViewCount = String(ab.viewCountText || "0").split(" v")[0];
        v.channelHandle = String(ab.canonicalChannelUrl || "").split(".com/")[1] || "";
        applyWatch();
    }).catch(function() {});
}
// a video from the channel's grid (today's lockup) as a compact item of the period
function lockupFacts(item) {
    const lk = dig(item, "richItemRenderer.content.lockupViewModel");
    if (!lk) {
        return null;
    }
    const meta = dig(lk, "metadata.lockupMetadataViewModel") || {};
    const parts = dig(meta, "metadata.contentMetadataViewModel.metadataRows.0.metadataParts") || [];
    const sources = dig(lk, "contentImage.thumbnailViewModel.image.sources") || [];
    return {
        id: lk.contentId,
        href: "/watch?v=" + lk.contentId,
        title: dig(meta, "title.content") || "",
        viewCount: dig(parts, "0.text.content") || "No views",
        date: dig(parts, "1.text.content") || "Upcoming",
        time: dig(lk, "contentImage.thumbnailViewModel.overlays.0.thumbnailBottomOverlayViewModel.badges.0.thumbnailBadgeViewModel.text") || "",
        thumbnail: sources.length ? sources[sources.length - 1].url : ""
    };
}
function fillChannelVideos() {
    const v = video;
    const wl = ERA.watch;
    const list = v.channelVideos || [];
    if (VIDEO_DROPDOWN.test(wl)) {
        when("#watch5-videos-dd", function() {
            fillVideoDropdown(list);
        });
    }
    if (/^watch4/.test(wl)) {
        when("#watch-channel-videos", function(holder) {
            fillVideoList(holder, list, "videosTabVideo", "li", "video-list-item related-list-item context-data-item chan-name-clickable");
        });
    }
    if (wl === "watch9a" || wl === "watch10beta") {
        when("#videos-panel", function() {
            fillVideoList($("#videos-panel [js-destination]"), list, "videosPanelVideo", "li", "panel-video video-list-item related-list-item context-data-item");
        });
    }
}
function fillVideoList(holder, list, kind, tag, cls) {
    if (!holder) {
        return;
    }
    list.forEach(function(item) {
        if (item.continuationItemRenderer) {
            const more = fromHtml('<span class="continuation_item_wrapper st-load-more">' + T.loadMore + "</span>");
            holder.appendChild(more);
            more.addEventListener("click", function() {
                more.remove();
                const token = dig(item, "continuationItemRenderer.continuationEndpoint.continuationCommand.token");
                innertube("browse", { browseId: video.channelId, params: VIDEOS_PARAMS, continuation: token }).then(function(r) {
                    fillVideoList(holder, dig(r, "onResponseReceivedActions.0.appendContinuationItemsAction.continuationItems") || [], kind, tag, cls);
                }).catch(function() {});
            });
            return;
        }
        const f = lockupFacts(item);
        if (!f) {
            return;
        }
        const el = document.createElement(tag);
        el.className = cls;
        setHtml(el, fill(T.items[kind], f));
        if (f.id === video.id) {
            el.classList.add(kind === "videosPanelVideo" ? "active" : "now-playing");
        }
        holder.appendChild(el);
        v3Link($("a", el) || el, "watch", f.id, f.href);
    });
    countLabels();
}
function countLabels() {
    const v = video;
    const head = $(".owner-videos-scroller-head span");
    if (head) {
        head.textContent = v.videoCount;
    }
    const trigger = $(".st-video-dd-trigger[disabled]");
    if (trigger) {
        trigger.removeAttribute("disabled");
        text(".st-video-dd-trigger .run", v.videoCount);
        text(".st-video-count", v.videoCount);
        $$(".st-video-count-link").forEach(function(a) {
            v3Link(a, "browse", v.channelId, "/channel/" + v.channelId + "/videos?view=0");
        });
    }
}
// 2010-2012: six videos a page, five pages, under the owner's "N videos" button
function fillVideoDropdown(list) {
    const holder = $("#videos-dd-content");
    const pages = $$("#videos-dd-pagination button");
    let n = 0;
    list.forEach(function(item) {
        const f = lockupFacts(item);
        if (!f || n >= 30) {
            return;
        }
        const page = Math.floor(n / 6);
        if (n % 6 === 0 && page > 0 && pages[page]) {
            pages[page].classList.remove("hid");
            $("#watch5-videos-dd").setAttribute("max-pages", page + 1);
        }
        const a = fromHtml(fill(T.items.superCompactVideo, f));
        a.className = "st-super-compact-video sc-video";
        a.setAttribute("page", page);
        a.setAttribute("page-video", n % 6);
        holder.appendChild(v3Link(a, "watch", f.id, f.href));
        n++;
    });
    countLabels();
}
function wireVideoDropdown() {
    const dd = $("#watch5-videos-dd");
    const prev = $("#videos-dd-prev");
    const next = $("#videos-dd-next");
    const goTo = function(page) {
        const max = Number(dd.getAttribute("max-pages"));
        dd.setAttribute("page", page);
        attr(next, "disabled", page >= max);
        attr(prev, "disabled", page <= 1);
        $$("#videos-dd-pagination .yt-uix-button-toggled").forEach(function(b) {
            b.classList.remove("yt-uix-button-toggled");
        });
        const btn = $("#videos-dd-pagination [page='" + page + "']");
        if (btn) {
            btn.classList.add("yt-uix-button-toggled");
        }
    };
    $$("#videos-dd-pagination button").forEach(function(b) {
        b.addEventListener("click", function() {
            goTo(Number(b.getAttribute("page")));
        });
    });
    next.addEventListener("click", function() {
        if (!next.hasAttribute("disabled")) {
            goTo(Number(dd.getAttribute("page")) + 1);
        }
    });
    prev.addEventListener("click", function() {
        if (!prev.hasAttribute("disabled")) {
            goTo(Number(dd.getAttribute("page")) - 1);
        }
    });
    const trigger = $(".st-video-dd-trigger");
    trigger.addEventListener("click", function() {
        const on = !trigger.classList.contains("yt-uix-button-toggled");
        trigger.classList.toggle("yt-uix-button-toggled", on);
        $("#st-watch-below").setAttribute("videos-dd", on ? "on" : "off");
        $("#st-watch-above").setAttribute("videos-dd", on ? "on" : "off");
        topHeight();
    });
}

// ---- the player's size steps (V3's "flexwatch"), as the stylesheet needs them
function playerSizeRules() {
    const sizes = ERA.flexwatch ? V3_SIZES : null;
    if (!sizes || !$(".player-height")) {
        return;
    }
    const rule = function(w, h, min) {
        const at = "[data-player-size=\"small\"] .appbar-flexwatch-mini ";
        const css = at + ".watch-content," + at + "#watch7-content," + at + "#action-panel-stats.action-panel-content," + at + ".player-width," + at + ".player-unavailable .video-thumb img{width:" + w + "px!important}" +
            "[data-player-size=\"small\"] " + (min ? ".appbar-flexwatch-mini " : "") + ".player-height:not(.livestream_chat.yt-uix-expander-collapsed):not(#watch-queue){height:calc(" + h + "px + 30px)!important}" +
            "[data-player-size=\"small\"][pl-ver^=\"m\"] " + (min ? ".appbar-flexwatch-mini " : "") + ".player-height:not(.livestream_chat.yt-uix-expander-collapsed):not(#watch-queue){height:" + h + "px!important}";
        return min ? "@media screen and (min-width:" + min[0] + "px) and (min-height:" + min[1] + "px){" + css + "}" : css;
    };
    let style = $("#st-sizerule-style");
    if (!style) {
        style = document.createElement("style");
        style.id = "st-sizerule-style";
        html.insertBefore(style, html.firstChild);
    }
    style.textContent = rule(sizes[0][2], sizes[0][3]) + rule(sizes[1][2], sizes[1][3], sizes[1]) + rule(sizes[2][2], sizes[2][3], sizes[2]);
    attr(html, "custom-sizerules", true);
    [200, 500, 1000, 2000, 3000].forEach(function(ms) {
        setTimeout(playerWidth, ms);
    });
}
// the content column is as wide as the player and the sidebar together
function playerWidth() {
    if (!$("#page.watch") || !$("#watch7-sidebar") || !$(".html5-video-container")) {
        return;
    }
    const sizes = ERA.flexwatch ? V3_SIZES : null;
    const side = $("#watch7-sidebar").getBoundingClientRect().width;
    const vid = $(".html5-video-container").getBoundingClientRect();
    const full = side + vid.width;
    let style = $("#st-sizerule-style-2");
    if (!style) {
        style = document.createElement("style");
        style.id = "st-sizerule-style-2";
        html.insertBefore(style, html.firstChild);
    }
    const at = "[data-player-size=\"small\"] .appbar-flexwatch-mini.site-center-aligned ";
    const css = at + ".watch #player," + at + "#st-watch-above-container," + at + "#page.watch #content{width:" + full + "px!important}";
    style.textContent = css + (sizes ? sizes.slice(1).map(function(s) {
        return "@media screen and (min-width:" + s[0] + "px) and (min-height:" + s[1] + "px){" + css + "}";
    }).join("") : "");
    document.body.style.setProperty("--player-width", vid.width + "px");
    document.body.style.setProperty("--player-height", vid.height + "px");
}
function playerColumnWidth() {
    const c = $("#watch7-main > #watch7-content");
    if (c) {
        attr(body(), "pw", c.offsetWidth);
    }
}

// ---- the sidebar's head: "Up next" and the autoplay switch
function autoplayHeader() {
    const bar = $(".autoplay-bar");
    if (!bar || $("#st-related-header")) {
        return;
    }
    const h = fromHtml("<div>" + T.autoplayHeader + "</div>");
    h.id = "st-related-header";
    h.className = "flex-bar st-rh";
    bar.insertBefore(h, bar.firstChild);
    attr(body(), "rel-head-added", "true");
    const sync = function() {
        const on = !!$(".autoplay-bar .checkbox-on-off input[checked]");
        attr(body(), "autoplay", on ? "true" : "false");
        $$("[toggle='autoplay']").forEach(function(t) {
            t.setAttribute("state", on ? "true" : "false");
        });
    };
    setTimeout(sync, 10);
    setTimeout(sync, 500);
    const flip = function() {
        const on = body().getAttribute("autoplay") !== "true";
        attr(body(), "autoplay", on ? "true" : "false");
        $$("[toggle='autoplay']").forEach(function(t) {
            t.setAttribute("state", on ? "true" : "false");
        });
        const input = $(".autoplay-bar .checkbox-on-off input");
        if (input) {
            input.click();
        }
    };
    $("#st-ap-tog", h).addEventListener("click", flip);
    $("#st-ap-label", h).addEventListener("click", flip);
    $("#st-ap-hover", h).addEventListener("mouseenter", function() {
        $("#st-ap-toggle-cont").setAttribute("show-card", "true");
    });
    $("#st-ap-fence", h).addEventListener("mouseenter", function() {
        $("#st-ap-toggle-cont").setAttribute("show-card", "false");
    });
    if (FAMILY === "poly") {
        $("#st-ap-tog", h).classList.add("yt-uix-tooltip");
        $("#st-ap-tog", h).title = "When autoplay is enabled, a suggested video will automatically play next.";
    }
    if (FAMILY === "aozora") {
        $("#st-un-label", h).classList.add("none");
        $("#st-s-label", h).classList.remove("none");
    }
}
function toggleAutoplay() {
    const t = $("#st-ap-tog");
    if (t) {
        t.click();
    }
}
// 2007-2009: related videos say "by <channel>" with the channel linked
function relatedBylines() {
    $$("#page.watch .context-data-item").forEach(function(item) {
        if ($(".chan-name", item) || !item.data) {
            return;
        }
        const card = $(".g-hovercard", item);
        if (!card) {
            return;
        }
        const author = ($(".run:last-child", card) || {}).textContent || "";
        let endpoint = dig(item.data, "compactVideoRenderer.contextItemData.authorNavigationEndpoint") ||
            dig(item.data, "lockupViewModel.metadata.lockupMetadataViewModel.image.decoratedAvatarViewModel.rendererContext.commandContext.onTap.innertubeCommand");
        const id = dig(endpoint, "browseEndpoint.browseId");
        if (!id) {
            return;
        }
        setHtml(card, T.relatedByline);
        const name = $(".chan-name", card);
        name.textContent = author;
        name.href = "/channel/" + id;
        name.data = { abstractVorElement: { navigationEndpoint: endpoint } };
        item.classList.add("chan-name-clickable");
    });
    const more = $("#watch-related .continuation_item_wrapper:not(.st-load-more):not(.st-related-cont)");
    if (more && $("button", more)) {
        more.classList.add("st-related-cont");
        $("button", more).addEventListener("click", function() {
            [500, 1500, 3000].forEach(function(ms) {
                setTimeout(relatedBylines, ms);
            });
        });
    }
}
// the playlist bar beside the player: 2015+ puts the title on the right; timestamps on the items
function watchPlaylist() {
    if (FAMILY === "hh" && !/^hh2013/.test(ERA.id) || FAMILY === "poly") {
        const left = $(".watch7-playlist-bar-left");
        const right = $(".watch7-playlist-bar-right");
        if (left && right && !$(".watch7-playlist-bar-left", right)) {
            right.insertBefore(left, right.firstChild);
        }
    }
    if (has("PlaylistTimestamps")) {
        $$(".yt-uix-scroller-scroll-unit:not(.startube-time-patched)").forEach(function(item) {
            const length = dig(item, "data.playlistPanelVideoRenderer.lengthText.simpleText");
            const a = $("a", item);
            if (!length || !a || $(".playlist-time", a)) {
                return;
            }
            const span = fromHtml('<span class="stat time playlist-time"><span>' + length + "</span></span>");
            a.insertBefore(span, a.children[4] || null);
            item.classList.add("startube-time-patched");
        });
    }
}
function mixThumbnails() {
    $$(".yt-pl-thumb:not(.yt-mix-thumb)").forEach(function(t) {
        if (t.textContent.indexOf("50+") > -1) {
            t.classList.add("yt-mix-thumb");
        }
    });
}

// ---- the watch page, on each navigation to it
function watchPage(fresh) {
    if (fresh) {
        if (video.liveTimer) {
            clearInterval(video.liveTimer);
        }
        video = { id: watchId() };
        attr(body(), "rel-head-added", "false");
    }
    when("#watch7-content.watch-content .yt-uix-button", buildWatch);
    when("#watch7-user-header", function() {
        if (!video.read) {
            video.read = true;
            readWatch();
            if (video.channelId) {
                loadChannelVideos();
            }
        }
    });
    playerSizeRules();
    if (ERA.compactName) {
        when("#page.watch .context-data-item", relatedBylines);
    }
    if (/[?&]list=/.test(location.search)) {
        when("#watch7-playlist-data", watchPlaylist);
    }
    const db = v3Db();
    if (dig(db, "config.db.yt.WATCH_AUTOPLAY_DELEGATION")) {
        when(".autoplay-bar", function() {
            autoplayHeader();
            setTimeout(autoplayHeader, 1500);
        });
    }
    if (has("MoveCountsToButtons")) {
        when(".watch", countsOnButtons);
    }
    if (has("MoreTooltips")) {
        when(".watch", moreTooltips);
    }
    modernPlayer();
}
// 2015+: the like and dislike buttons carry their counts
function countsOnButtons() {
    const likes = $(".likes-count");
    const dislikes = $(".dislikes-count");
    if (!likes || !dislikes) {
        return;
    }
    text("#watch-like .run", likes.textContent);
    const content = $("#watch-dislike .yt-uix-button-content");
    if (content) {
        setHtml(content, '<span class="run">' + dislikes.textContent.replace(/</g, "&lt;") + "</span>");
        $("#watch-dislike").classList.remove("yt-uix-button-empty");
    }
}
function moreTooltips() {
    const tip = function(sel, title) {
        const el = $(sel);
        if (el && !el.classList.contains("yt-uix-tooltip")) {
            el.setAttribute("title", title);
            el.classList.add("yt-uix-tooltip");
        }
    };
    const bars = $(".video-extras-sparkbars");
    if (bars) {
        tip(".video-extras-sparkbars", ($(".video-extras-sparkbar-likes") || { style: {} }).style.width + " of viewers like this video");
    }
    const user = $("#watch7-user-header .yt-user-name");
    if (user) {
        tip("#watch7-user-header .yt-user-name", "View " + user.textContent + "'s channel");
        tip("#watch7-user-header .yt-user-videos", "View " + user.textContent + "'s videos");
    }
    tip(".yt-uix-button-subscribe-branded:not([disabled='True'])", "Subscribe");
    tip(".yt-uix-button-subscribed-branded:not([disabled='True'])", "Unsubscribe");
    tip("#watch7-secondary-actions .start", "Video info");
    tip("#watch7-secondary-actions .yt-uix-button:nth-child(2)", "Share");
    tip("#watch7-secondary-actions .yt-uix-button:nth-child(3)", "Add to");
}
