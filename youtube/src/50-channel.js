// ---- channel and playlist pages: the 2010-2013 channel look ("channels3") and the 2015+ tweaks ----

// what the page knows about the channel (and playlist) it shows
let channel = null;
function channelData() {
    return dig($("#content"), "data.twoColumnBrowseResultsRenderer.items.0.brandedPageV2Renderer");
}
// the contents of the tab V3 shows, from its page data
function activeTabContents(d) {
    const tabs = (d && d.tabs) || [];
    for (let i = 0; i < tabs.length; i++) {
        const t = tabs[i].tabRenderer;
        if (t && t.selected && t.endpoint) {
            const params = dig(t, "endpoint.browseEndpoint.params");
            if (t.title === "" && t.icon === "yt-uix-button-icon-c4-home") {
                return dig(t, "content.sectionListRenderer.contents");
            }
            if (params === "EgZ2aWRlb3PyBgQKAjoA" && t.richGridInfo) {
                return dig(t, "richGridInfo.contents.0.gridRenderer.items");
            }
            if (t.title === "Feed" || t.icon === "yt-uix-button-icon-c4-home-feed" || params === "EgVwb3N0c_IGBAoCSgA%3D") {
                return dig(t, "content.sectionListRenderer.contents.0.itemSectionRenderer.contents");
            }
            if (params === "EglwbGF5bGlzdHPyBgQKAkIA") {
                return dig(t, "content.sectionListRenderer.contents.0.itemSectionRenderer.contents.0.gridRenderer.items");
            }
        } else if (tabs[i].expandableTabRenderer && tabs[i].expandableTabRenderer.content) {
            return dig(tabs[i], "expandableTabRenderer.content.sectionListRenderer.contents");
        }
    }
    return null;
}
// the About facts V3 fetches for the channel (its newChannelInfoRequest)
function readAbout(d, c) {
    attr(html, "channel-about-fetched", "false");
    return Promise.resolve(d.newChannelInfoRequest).then(function(r) {
        const a = (r && r.fullAboutObject) || {};
        c.subscribeButton = a.subscribeButton;
        c.videoCount = a.videoCountText || "No videos";
        c.shortVideoCount = a.videoCountText ? a.videoCountText.split(" v")[0] : "0";
        c.viewCount = a.viewCountText || "No views";
        c.shortViewCount = a.viewCountText ? a.viewCountText.split(" v")[0] : "0";
        if (a.description) {
            c.description = a.description.replace(/</g, "&lt;").replace(/\n/g, "<br>");
        }
        if (r && r.avatar) {
            c.pfp = r.avatar.split("=s")[0] + "=s108";
        }
        c.subCount = withCommas(r && r.subscriberCount || 0);
        c.joinedDate = dig(a, "joinedDateText.content") || "Joined Dec 31, 1969";
        c.shortJoinedDate = c.joinedDate.split("d ")[1] || c.joinedDate;
        c.country = a.country;
        c.links = a.links;
        attr(html, "channel-about-fetched", "true");
    }).catch(function() {
        attr(html, "channel-about-fetched", "true");
    });
}
// the TV app's banner is the old channel background
function readBanner(c) {
    return fetch("https://www.youtube.com/youtubei/v1/browse?key=AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8&prettyPrint=false", {
        method: "POST", headers: { "Content-Type": "application/json", "X-Origin": location.origin }, credentials: "include",
        body: JSON.stringify({ context: { client: { clientName: "TVHTML5", clientVersion: "7.20240701.16.00", hl: "en", gl: "US" } }, browseId: c.id })
    }).then(function(r) {
        return r.json();
    }).then(function(r) {
        const thumbs = dig(r, "contents.tvBrowseRenderer.content.tvSurfaceContentRenderer.header.channelHeaderRenderer.backgroundImage.thumbnails");
        c.tvBanner = thumbs && thumbs.length ? thumbs[thumbs.length - 1].url : null;
        html.style.setProperty("--tvbg", "no-repeat url(" + c.tvBanner + ")");
    }).catch(function() {});
}
function readChannel(fresh) {
    const d = channelData();
    if (!d) {
        return null;
    }
    const meta = d.metadata.channelMetadataRenderer;
    const header = d.header.c4TabbedHeaderRenderer || {};
    const id = meta.externalId;
    if (channel && channel.id === id && !fresh && channel.page !== "playlist") {
        channel.page = d.channelSubpage;
        channel.content = activeTabContents(d);
        return channel;
    }
    const c = { id: id, shortId: id.replace(/^UC/, ""), page: d.channelSubpage, name: meta.title, pfp: dig(meta, "avatar.thumbnails.0.url") || "",
        description: (meta.description || "").replace(/</g, "&lt;").replace(/\n/g, "<br>"), tvBanner: "" };
    if (channel && channel.id === id && header.banner) {
        c.tvBanner = channel.tvBanner;
    } else if (header.banner) {
        attr(html, "c4banner", true);
        const tv = dig(header, "tvBanner.thumbnails");
        if (tv && tv.length) {
            c.tvBanner = tv[tv.length - 1].url;
        } else {
            readBanner(c);
        }
    } else {
        c.tvBanner = "none";
        attr(html, "c4banner", false);
    }
    c.content = activeTabContents(d);
    channel = c;
    readAbout(d, c);
    return c;
}
function readPlaylist(fresh) {
    const d = channelData();
    if (!d || !d.header.playlistHeaderRenderer) {
        return null;
    }
    const id = d.playlistOwnerId;
    const plId = String(d.feedId || "").replace(/^VL/, "");
    if (channel && channel.playlist && channel.playlist.id === plId && fresh) {
        channel.page = "playlist";
        channel.content = activeTabContents(d);
        return channel;
    }
    attr(html, "playlist-data-done", "false");
    const h = d.header.playlistHeaderRenderer;
    const firstVideo = dig(d, "tabs.0.tabRenderer.content.itemSectionRenderer.contents.1.itemSectionRenderer.contents.0.playlistVideoListRenderer.contents.0.playlistVideoRenderer.videoId");
    const c = { id: id, shortId: String(id).replace(/^UC/, ""), page: "playlist", name: dig(h, "ownerText.runs.1.text") || "", pfp: "", description: "", tvBanner: "",
        playlist: { id: plId, title: dig(h, "title.simpleText") || "", viewCount: dig(h, "stats.1.simpleText") || "", shortViewCount: (dig(h, "stats.1.simpleText") || "").split(" v")[0],
            shortVideoCount: dig(h, "stats.0.runs.0.text") || "0", description: dig(h, "descriptionText.simpleText") ? h.descriptionText.simpleText.replace(/</g, "&lt;").replace(/\n/g, "<br>") : "<i>No description available.</i>", firstVideoId: firstVideo } };
    channel = c;
    readBanner(c);
    readAbout(d, c).then(function() {
        attr(html, "playlist-data-done", "true");
    });
    return c;
}

// ---- the channels3 page
function c3Items() {
    return $("#c3-content-items");
}
function c3Page() {
    if ($("#c3-sidebar") || !channel) {
        return;
    }
    const c = channel;
    const isPlaylist = c.page === "playlist";
    const content = $("#content");
    const page = fromHtml('<div id="c3-container">' + fill(T.c3Page, { id: c.id }) + "</div>");
    extraStyle("c3", page);
    content.insertBefore(page, content.firstChild);
    html.style.setProperty("--tvbg", "no-repeat url(" + c.tvBanner + ")");
    const img = new Image();
    img.onload = function() {
        html.style.setProperty("--tvbanner-width", this.width + "px");
    };
    img.src = c.tvBanner;
    $("#c3-channel-pfp img").src = c.pfp;
    text("#c3-channel-name .c3-name, #c3-channel-name .c3-name-link", c.name);
    if (isPlaylist) {
        text("#c3-playlist-title span", c.playlist.title);
        $(".c3-playall a").href = "/watch?v=" + c.playlist.firstVideoId + "&list=" + c.playlist.id;
    }
    $$(".c3 .stx-link").forEach(warmLink);
    if (!$(".c4-module-is-editable")) {
        when("#c4-primary-header-contents .yt-uix-button-subscription-container", function(btn) {
            space().appendChild(btn);
            $(isPlaylist ? "#c3-sidebar-subscribe" : "#c3-subscribe").appendChild(btn);
        });
    }
    if ($(".c4-player-container")) {
        when(".video-player-view-component video", function() {
            const player = $(".video-player-view-component");
            if (player) {
                space().appendChild(player);
                $("#c3-featured-slot").appendChild(player);
            }
        });
    }
    if (isPlaylist) {
        when(".pl-video-list", function(list) {
            space().appendChild(list);
            c3Items().appendChild(list);
        });
    }
    const page3 = $(".c3");
    const activate = function(tab, nav, cls) {
        $("#c3-" + tab + "-tab").classList.add("active");
        if (nav) {
            $("#c3-" + nav + "-nav").classList.add("active");
        }
        page3.classList.add(cls);
    };
    switch (c.page) {
        case "featured": activate("featured", null, "is-home"); break;
        case "videos": activate("videos", "uploads", "is-videos"); c3Fill("videos"); break;
        case "playlists": activate("videos", "playlists", "is-videos"); c3Fill("playlists"); break;
        case "posts": activate("feed", "backstage", "is-feed"); c3Fill("backstage"); break;
        case "feed": activate("feed", null, "is-feed"); break;
        case "search": $("#c3-search").classList.add("active"); page3.classList.add("is-search"); c3Fill("search"); break;
        case "about": activate("featured", null, "is-home"); break;
        case "playlist": page3.classList.add("is-playlist"); c3Fill("playlist"); break;
        default:
    }
    const loc = html.getAttribute("chan-loc");
    if (loc === "feed") {
        $("#c3-featured-tab").classList.remove("active");
        activate("feed", "activity", "is-feed");
        c3Fill("feed");
    }
    if (loc === "home") {
        activate("featured", null, "is-home");
        c3Fill("home");
    }
    when("[channel-about-fetched='true']", c3Blanks);
}
// an item of V3's channel grid (V3's own renderer with contextItemData) or of a YouTube response
function gridVideoFacts(item) {
    const r = dig(item, "richItemRenderer.content.gridVideoRenderer") || dig(item, "richItemRenderer.content.videoRenderer") || item.gridVideoRenderer || item.videoRenderer;
    if (r) {
        const ctx = r.contextItemData;
        const thumbs = dig(r, "thumbnail.thumbnails") || [];
        return {
            id: r.videoId,
            href: ctx ? ctx.href : dig(r, "navigationEndpoint.commandMetadata.webCommandMetadata.url") || "/watch?v=" + r.videoId,
            viewCount: ctx ? ctx.viewCount : dig(r, "viewCountText.simpleText") || "",
            publishDate: ctx ? ctx.publishDate : dig(r, "publishedTimeText.simpleText") || "",
            title: ctx ? ctx.title : dig(r, "title.runs.0.text") || dig(r, "title.simpleText") || "",
            thumbnail: (thumbs[3] || thumbs[0] || {}).url || "",
            length: dig(r, "lengthText.simpleText") || ""
        };
    }
    const f = lockupFacts(item);
    if (f) {
        f.publishDate = f.date;
        f.length = f.time;
    }
    return f;
}
function playlistFacts(item) {
    const lk = item.lockupViewModel;
    if (lk) {
        const cmd = dig(lk, "rendererContext.commandContext.onTap.innertubeCommand") || {};
        const thumb = dig(lk, "contentImage.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel") || {};
        const count = dig(thumb, "overlays.0.thumbnailOverlayBadgeViewModel.thumbnailBadges.0.thumbnailBadgeViewModel.text") || "";
        return { href: dig(cmd, "commandMetadata.webCommandMetadata.url") || "", videoId: dig(cmd, "watchEndpoint.videoId"), playlistId: dig(cmd, "watchEndpoint.playlistId") || "",
            title: dig(lk, "metadata.lockupMetadataViewModel.title.content") || "", thumb: dig(thumb, "image.sources.0.url") || "", shortVidCount: count.split(" v")[0], sideThumbs: lk.sidebarThumbnails, tpl: "c3PlaylistLockup" };
    }
    const g = item.gridPlaylistRenderer;
    if (g) {
        const ctx = g.contextItemData;
        return { href: ctx ? ctx.href : dig(g, "navigationEndpoint.commandMetadata.webCommandMetadata.url") || "", videoId: ctx ? dig(g, "originalNavigationEndpoint.watchEndpoint.videoId") : dig(g, "navigationEndpoint.watchEndpoint.videoId"),
            playlistId: g.playlistId, title: dig(g, "title.simpleText") || "", thumbnail: dig(g, "thumbnail.thumbnails.0.url") || "", videoCount: g.videoCount || "", sideThumbs: g.sidebarThumbnails, tpl: "c3PlaylistGrid" };
    }
    return null;
}
function sideThumbs(el, thumbs) {
    const slots = $$(".sidethumb", el);
    slots.forEach(function(s, n) {
        const t = thumbs && thumbs[n];
        if (t && !t.empty) {
            $("img", s).src = dig(t, "thumbnails.0.url") || "";
        } else {
            s.classList.add("empty");
        }
    });
}
function c3LoadMore(token, kind) {
    const more = fromHtml('<div class="c3-continuation">' + T.c3LoadMore + "</div>");
    c3Items().appendChild(more);
    if (kind === "videos" && !/view=0/.test(location.search)) {
        $("button", more).setAttribute("disabled", "");
        $(".run", more).textContent = "Please go to /videos?view=0 to load more videos.";
        return;
    }
    $("button", more).addEventListener("click", function() {
        innertube("browse", { browseId: channel.id, params: "EghjaGFubmVsc_IGBAoCUgA%3D", continuation: token }).then(function(r) {
            more.remove();
            channel.content = dig(r, "onResponseReceivedActions.0.appendContinuationItemsAction.continuationItems") || [];
            c3Fill(kind);
        }).catch(function() {});
    });
}
function c3Fill(page) {
    const c = channel;
    const items = c3Items();
    const list = c.content || [];
    const add = function(markup, cls) {
        const el = fromHtml('<div class="' + cls + '">' + markup + "</div>");
        items.appendChild(el);
        return el;
    };
    if (page === "search") {
        list.forEach(function(i) {
            const f = gridVideoFacts(dig(i, "itemSectionRenderer.contents.0") || {});
            if (f) {
                const el = add(fill(T.items.channelGridVideo, f), "channels-content-item yt-shelf-grid-item");
                $(".yt-uix-sessionlink", el).setAttribute("title", f.title);
                $$("a", el).forEach(function(a) {
                    v3Link(a, "watch", f.id, f.href);
                });
            }
        });
    }
    if (page === "playlist") {
        const header = $("#c3-content-header");
        header.insertBefore(fromHtml('<div class="c3-playlist-desc">' + c.playlist.description + "</div>"), header.firstChild);
    }
    if (page === "videos") {
        list.forEach(function(i) {
            if (i.continuationItemRenderer) {
                c3LoadMore(dig(i, "continuationItemRenderer.continuationEndpoint.continuationCommand.token"), "videos");
                return;
            }
            const f = gridVideoFacts(i);
            if (f) {
                const el = add(fill(T.c3Video, f), "channels-content-item yt-shelf-grid-item");
                $(".yt-uix-sessionlink", el).setAttribute("title", f.title);
                $$("a", el).forEach(function(a) {
                    v3Link(a, "watch", f.id, f.href);
                });
            }
        });
        const loading = $("#c3-content-items .c3-loading");
        if (loading) {
            loading.remove();
        }
    }
    if (page === "playlists") {
        list.forEach(function(i) {
            if (i.continuationItemRenderer) {
                c3LoadMore(dig(i, "continuationItemRenderer.continuationEndpoint.continuationCommand.token"), "playlists");
                return;
            }
            const f = playlistFacts(i);
            if (!f) {
                return;
            }
            const el = add(fill(T[f.tpl], f), "channels-content-item yt-shelf-grid-item");
            v3Link($(".yt-pl-thumb-link", el), "watch", f.videoId, f.href, f.playlistId);
            v3Link($(".yt-uix-sessionlink", el), "browse", "VL" + f.playlistId, "/playlist?list=" + f.playlistId);
            sideThumbs(el, f.sideThumbs);
        });
    }
    if (page === "feed") {
        list.forEach(function(i) {
            if (i.__DOM_REFERENCE && !i.continuationItemRenderer) {
                setTimeout(function() {
                    feedItem(i);
                }, 500);
            }
        });
    }
    if (page === "backstage") {
        const note = add(T.c3BackstageNote, "c3-warning-banner");
        note.id = "c3-backstage-warning";
        $(".close", note).addEventListener("click", function() {
            note.remove();
        });
        v3Link($("#c3-redir"), "browse", c.id, "/channel/" + c.id + "/community?force-c4", "Egljb21tdW5pdHnyBgQKAkoA");
        list.forEach(function(i) {
            if (i.__DOM_REFERENCE && i.backstagePostThreadRenderer) {
                setTimeout(function() {
                    const el = fromHtml('<div class="c3-backstage"></div>');
                    setHtml(el, i.__DOM_REFERENCE.outerHTML);
                    items.appendChild(el);
                }, 500);
            }
        });
    }
    if (page === "home") {
        innertube("browse", { browseId: c.id, params: VIDEOS_PARAMS }).then(function(r) {
            featuredList(dig(r, "contents.twoColumnBrowseResultsRenderer.tabs.1.tabRenderer.content.richGridRenderer.contents") || []);
        }).catch(function() {});
        list.forEach(function(i) {
            const first = dig(i, "itemSectionRenderer.contents.0");
            if (!first) {
                return;
            }
            if (first.channelFeaturedContentRenderer) {
                featuredContent(first.channelFeaturedContentRenderer);
            }
            const shelf = first.shelfRenderer;
            const shelfItems = shelf && dig(shelf, "content.horizontalListRenderer.items");
            if (shelfItems && shelfItems[0]) {
                if (shelfItems[0].gridChannelRenderer) {
                    when("#c3-featured-channels-slot", function() {
                        featuredChannels(shelf);
                    });
                }
                if (shelfItems[0].gridPlaylistRenderer) {
                    when("#c3-featured-playlists-slot", function() {
                        featuredPlaylists(shelf);
                    });
                }
            }
        });
    }
}
// a feed entry V3 drew, copied into the page with its links kept live
function feedItem(i) {
    const el = fromHtml('<div class="c3-feed-item"></div>');
    setHtml(el, i.__DOM_REFERENCE.outerHTML);
    c3Items().appendChild(el);
    setTimeout(function() {
        const title = $(".yt-lockup-title a", el);
        if (title) {
            const id = title.href.split("/watch?v=")[1];
            [title, $(".yt-lockup-thumbnail a", el)].forEach(function(a) {
                if (a) {
                    v3Link(a, "watch", id, title.href);
                }
            });
        }
        const author = $(".feed-author-bubble", el);
        if (author) {
            const id = author.href.split("/channel/")[1];
            [author, $(".yt-user-name", el)].forEach(function(a) {
                if (a) {
                    v3Link(a, "browse", id, author.href);
                }
            });
        }
    }, 100);
}
function featuredContent(data) {
    const dom = dig(data, "items.1.__DOM_REFERENCE");
    if (!dom) {
        return;
    }
    const el = fromHtml('<div class="c3-featured-content"></div>');
    setHtml(el, dom.outerHTML);
    const slot = $("#c3-featured-slot");
    slot.insertBefore(el, slot.firstChild);
    const title = $(".yt-lockup-title a", el);
    const author = $(".g-hovercard a", el);
    if (title) {
        const id = title.href.split("/watch?v=")[1];
        v3Link(title, "watch", id, title.href);
        v3Link($(".yt-lockup-thumbnail a", el), "watch", id, title.href);
    }
    if (author) {
        v3Link(author, "browse", author.href.split("/channel/")[1], author.href);
    }
}
// "Uploaded videos" on the channel's home: the newest, with a header once the counts are known
function featuredList(list) {
    if ($(".c3-featured-list")) {
        return;
    }
    const box = fromHtml('<div class="c3-featured-list">' + T.c3FeaturedList + "</div>");
    c3Items().insertBefore(box, c3Items().firstChild);
    const holder = $(".c3-featured-list-items", box);
    const videos = list.map(function(i) { return lockupFacts(i); }).filter(Boolean);
    videos.forEach(function(f) {
        const el = fromHtml('<div class="c3-featured-list-item">' + fill(T.items.bigListVideo, f) + "</div>");
        holder.appendChild(el);
        $(".video-overview", el).setAttribute("title", f.title);
        $$("a", el).forEach(function(a) {
            v3Link(a, "watch", f.id, f.href);
        });
    });
    when("[channel-about-fetched='true']", function() {
        if ($(".c3-featured-header")) {
            return;
        }
        const header = fromHtml('<div class="c3-featured-header">' + fill(T.items.featuredHeader, { length: Math.min(videos.length, 30), shortVideoCount: channel.shortVideoCount, shortId: channel.shortId, id: channel.id }) + "</div>");
        $("#c3-content-header").insertBefore(header, $("#c3-content-header").firstChild);
        $$("a", header).forEach(function(a) {
            v3Link(a, "browse", channel.id, "/channel/" + channel.id + "/videos", VIDEOS_PARAMS);
        });
    });
}
function featuredChannels(shelf) {
    if ($(".c3-featured-channels")) {
        return;
    }
    const slot = $("#c3-featured-channels-slot");
    slot.insertBefore(fromHtml('<div class="c3-featured-channels">' + fill(T.c3FeaturedChannels, { title: dig(shelf, "title.runs.0.text") || "" }) + "</div>"), slot.firstChild);
    const holder = $("#c3-featured-channels-slot .c3-sidebar-content");
    (dig(shelf, "content.horizontalListRenderer.items") || []).forEach(function(i) {
        const g = i.gridChannelRenderer;
        if (!g) {
            return;
        }
        const el = fromHtml('<div class="c3-featured-channel">' + fill(T.items.featuredChannel, { channelId: g.channelId, thumbnail: dig(g, "thumbnail.thumbnails.1.url") || dig(g, "thumbnail.thumbnails.0.url") || "",
            title: dig(g, "title.simpleText") || "", subCount: dig(g, "subscriberCountText.simpleText") || "" }) + "</div>");
        holder.appendChild(el);
        warmLink($("a", el));
    });
}
function featuredPlaylists(shelf) {
    if ($(".c3-featured-playlists")) {
        return;
    }
    const slot = $("#c3-featured-playlists-slot");
    slot.insertBefore(fromHtml('<div class="c3-featured-playlists">' + fill(T.c3FeaturedPlaylists, { title: dig(shelf, "title.runs.0.text") || "" }) + "</div>"), slot.firstChild);
    const holder = $("#c3-featured-playlists-slot .c3-sidebar-content");
    (dig(shelf, "content.horizontalListRenderer.items") || []).forEach(function(i) {
        const g = i.gridPlaylistRenderer;
        if (!g) {
            return;
        }
        const ctx = g.contextItemData || {};
        const author = dig(ctx, "authorNavigationEndpoint.browseEndpoint.browseId") || "";
        const href2 = ctx.href || "";
        const videoId = (href2.split("v=")[1] || "").split("&")[0];
        const f = { href: "/playlist?list=" + ctx.playlistId, href2: href2, href3: "/channel/" + author, thumb1: dig(g, "thumbnail.thumbnails.0.url") || "",
            vidCount: g.videoCount, title: dig(g, "title.simpleText") || "", byline: ctx.byLine || "" };
        const el = fromHtml('<div class="c3-featured-playlist c3-playlist">' + fill(T.items.featuredPlaylist, f) + "</div>");
        holder.appendChild(el);
        v3Link($(".c3-playlist-thumbnails", el), "watch", videoId, href2, ctx.playlistId);
        v3Link($(".c3-playlist-title", el), "browse", "VL" + ctx.playlistId, f.href);
        v3Link($(".c3-playlist-byline", el), "browse", author, f.href3);
        if (String(g.videoCount) === "1") {
            $(".c3-videos-string", el).textContent = "video";
        }
        const rest = $$(".c3-sidethumb:not(.c3-first-thumb)", el);
        rest.forEach(function(s, n) {
            const t = g.sidebarThumbnails && g.sidebarThumbnails[n];
            if (t && !t.empty) {
                $("img", s).src = dig(t, "thumbnails.0.url") || "";
            } else {
                s.classList.add("empty");
                el.classList.add("c3-not-full-playlist");
            }
        });
        if (!g.sidebarThumbnails) {
            el.classList.add("c3-not-full-playlist");
        }
    });
}
// the header's numbers, the About sidebar and the sort menu, once the About facts are in
function c3Blanks() {
    const c = channel;
    setHtml($("#c3-header-meta"), fill(T.c3HeaderMeta, c));
    if (c.playlist) {
        text("#c3-pl-view-count span", c.playlist.shortViewCount);
        text("#c3-pl-video-count span", c.playlist.shortVideoCount);
    }
    setHtml($("#c3-sidebar"), fill(T.c3Sidebar, { name: c.name, description: c.description || "<i>No description available.</i>", videoCount: c.videoCount, shortJoinedDate: c.shortJoinedDate, country: c.country || "" }));
    if (c.links) {
        const slot = $("#c3-channel-links-slot");
        slot.classList.remove("hid");
        c.links.forEach(function(l) {
            const link = l.channelExternalLinkViewModel;
            if (!link) {
                return;
            }
            const el = fromHtml('<div class="c3-channel-link-container">' + T.c3Link + "</div>");
            slot.appendChild(el);
            $(".c3-channel-link-text span", el).textContent = dig(link, "title.content") || "";
            $(".c3-channel-link", el).setAttribute("href", "https://" + (dig(link, "link.content") || ""));
            const icon = dig(link, "favicon.sources.2.url");
            if (icon) {
                $(".c3-channel-link img", el).setAttribute("src", icon);
            }
        });
    }
    if (c.country) {
        $("#c3-location").classList.remove("hid");
    }
    if (c.page === "videos") {
        setHtml($("#c3-content-header"), fill(T.c3VideosHeader, c));
        const rgi = dig(channelData(), "tabs.1.tabRenderer.richGridInfo");
        const chips = dig(rgi, "header.chipBarViewModel.chips");
        const tokens = chips ? chips.map(function(ch) { return dig(ch, "chipViewModel.tapCommand.innertubeCommand.continuationCommand.token"); }) :
            (dig(rgi, "header.feedFilterChipBarRenderer.contents") || []).map(function(ch) { return dig(ch, "chipCloudChipRenderer.navigationEndpoint.continuationCommand.token"); });
        if (/view=0/.test(location.search)) {
            [["newest", 0], ["popular", 1], ["oldest", 2]].forEach(function(p) {
                $("#c3-sort-" + p[0]).addEventListener("click", function() {
                    setHtml(c3Items(), T.c3Loading);
                    $("#c3-filter-dropdown").setAttribute("state", p[0]);
                    $("#c3-filter-menu").setAttribute("state", p[0]);
                    innertube("browse", { browseId: c.id, params: "EghjaGFubmVsc_IGBAoCUgA%3D", continuation: tokens[p[1]] }).then(function(r) {
                        c.content = dig(r, "onResponseReceivedActions.1.reloadContinuationItemsCommand.continuationItems") || [];
                        c3Fill("videos");
                    }).catch(function() {});
                });
            });
        }
    }
    if (c.page === "playlists") {
        setHtml($("#c3-content-header"), T.c3PlaylistsHeader);
    }
}

// ---- 2015+ channel pages: the picture beside the name, the subscriber count, a Home tab
function polymerChannel() {
    if (FAMILY !== "poly") {
        return;
    }
    when(".channel-header-profile-image-container", function(pfp) {
        const header = $("#c4-primary-header-contents");
        if (header && $("#page.channel")) {
            header.insertBefore(pfp, header.children[2] || null);
        }
    });
    when(".yt-subscription-button-subscriber-count-branded-horizontal", function(count) {
        if ($(".startube-poly-sub-count") || !$("#page.channel")) {
            return;
        }
        count.textContent = count.textContent + " subscribers";
        const title = $(".branded-page-header-title");
        if (title) {
            title.insertBefore(count, title.firstChild);
        }
        count.classList.add("startube-poly-sub-count");
    });
    when("#channel-search", function(search) {
        const item = $(".epic-nav-item", search);
        if (item && !$("svg", search)) {
            item.appendChild(svgIcon(ICONS.search[0], ICONS.search[1]));
        }
    });
}
function channelHomeTab() {
    if (FAMILY !== "poly" && !/^hh(E2015|2015|E2016|M2016|2016)$/.test(ERA.id)) {
        return;
    }
    setTimeout(function() {
        if ($(".startube-tab")) {
            return;
        }
        const menu = $("#channel-navigation-menu");
        if (!menu) {
            return;
        }
        const selected = $(".epic-nav-item-empty.selected", menu);
        if (selected) {
            selected.parentNode.id = "channel-main-tab";
            menu.insertBefore(fromHtml('<li class="startube-tab">' + T.homeTab + "</li>"), menu.firstChild);
            return;
        }
        when("#channel-navigation-menu li:nth-child(1) a", function(first) {
            if ($(".startube-tab") || $(".epic-nav-item-empty.selected", menu)) {
                return;
            }
            const tab = fromHtml('<li class="startube-tab">' + fill(T.homeTabLink, { navUrl: first.getAttribute("href") }) + "</li>");
            menu.insertBefore(tab, menu.firstChild);
            tab.data = first.data;
        });
    }, 250);
}
function channelPage(fresh) {
    readChannel(fresh);
    if (ERA.channel === "c3" && !/force-c4/.test(location.search)) {
        attr(html, "exp-channels3", true);
        c3Page();
    } else if (/force-c4/.test(location.search)) {
        attr(html, "exp-channels3", false);
    }
    polymerChannel();
    channelHomeTab();
}
function playlistPage(fresh) {
    when("#content", function() {
        readPlaylist(fresh);
        if (ERA.channel === "c3") {
            when("[playlist-data-done='true']", c3Page);
        }
    });
    polymerPlaylist();
}
