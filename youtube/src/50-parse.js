// ---- Gplex YouTube: YouTube's renderers as plain models ----
// YouTube describes a page as nested "renderers" (older) and "view models" (newer), and keeps changing
// which it sends where. Everything below turns them into a few plain shapes the pages draw from:
//   video    {kind, id, url, title, thumb, duration, seconds, views, published, channel, badges, live, short, upcoming, snippet, progress, index, selected}
//   playlist {kind, id, url, title, thumb, count, channel, videos, mix}
//   channel  {kind, id, url, name, avatar, subscribers, videos, handle, snippet, verified, subscribe}
//   shelf    {kind, title, url, items, layout}
//   more     {kind, token, endpoint}     message {kind, text}     featured {kind, video}
function keyOf(node) {
    for (const k in node) {
        if (Object.prototype.hasOwnProperty.call(node, k)) {
            return k;
        }
    }
    return "";
}
function badgesOf(list) {
    return (list || []).map(function(b) {
        const r = b.metadataBadgeRenderer || {};
        return { label: r.label || "", style: r.style || "", icon: r.icon && r.icon.iconType || "" };
    });
}
function verifiedOf(list) {
    return badgesOf(list).some(function(b) { return /VERIFIED|ARTIST/.test(b.style + b.icon); });
}
// "1y ago" -> "1 year ago": the wording of the time, as the old site wrote it
const AGO_UNITS = { y: "year", mo: "month", w: "week", d: "day", h: "hour", m: "minute", s: "second" };
function longAgo(s) {
    return String(s || "").replace(/(\d+)\s*(mo|[ymwdhs])\b(?=\s*ago)/g, function(all, n, u) {
        return n + " " + AGO_UNITS[u] + (n === "1" ? "" : "s");
    });
}
function channelOfByline(byline) {
    const runs = (byline && byline.runs) || [];
    const run = runs.find(function(r) { return r.navigationEndpoint; }) || runs[0];
    if (!run) {
        return null;
    }
    const ep = run.navigationEndpoint || {};
    return { name: text(byline), url: endpointUrl(ep), id: ep.browseEndpoint && ep.browseEndpoint.browseId || "" };
}
function overlaysOf(list) {
    const o = { duration: "", live: false, upcoming: false, short: false, progress: 0 };
    (list || []).forEach(function(x) {
        const t = x.thumbnailOverlayTimeStatusRenderer;
        if (t) {
            o.duration = text(t.text);
            o.live = t.style === "LIVE";
            o.upcoming = t.style === "UPCOMING";
            o.short = t.style === "SHORTS";
        }
        const r = x.thumbnailOverlayResumePlaybackRenderer;
        if (r) {
            o.progress = r.percentDurationWatched || 0;
        }
    });
    return o;
}
function avatarOf(r) {
    const c = r.channelThumbnailSupportedRenderers && r.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer;
    return thumbUrl((c && c.thumbnail) || r.channelThumbnail || r.avatar && r.avatar.decoratedAvatarViewModel && r.avatar.decoratedAvatarViewModel.avatar && r.avatar.decoratedAvatarViewModel.avatar.avatarViewModel && r.avatar.decoratedAvatarViewModel.avatar.avatarViewModel.image, 48);
}
// videoRenderer, gridVideoRenderer, compactVideoRenderer, playlistVideoRenderer, playlistPanelVideoRenderer,
// endScreenVideoRenderer, childVideoRenderer, videoCardRenderer, reelItemRenderer
function videoOf(r) {
    const o = overlaysOf(r.thumbnailOverlays);
    const views = text(r.viewCountText) || text(r.shortViewCountText);
    const meta = text(r.metadataText);
    const id = r.videoId || (r.navigationEndpoint && r.navigationEndpoint.watchEndpoint && r.navigationEndpoint.watchEndpoint.videoId) || "";
    const byline = r.longBylineText || r.shortBylineText || r.ownerText || r.bylineText;
    const v = {
        kind: "video",
        id: id,
        url: endpointUrl(r.navigationEndpoint) || "/watch?v=" + id,
        title: text(r.title || r.headline),
        thumb: videoThumb(id),
        duration: text(r.lengthText) || o.duration,
        seconds: Number(r.lengthSeconds) || parseTime(text(r.lengthText) || o.duration),
        views: views || (meta.split("•")[0] || "").trim() || text(r.videoInfo && { runs: [r.videoInfo.runs && r.videoInfo.runs[0]] }),
        published: longAgo(text(r.publishedTimeText) || (meta.split("•")[1] || "").trim() || (r.videoInfo && r.videoInfo.runs && r.videoInfo.runs.length > 2 ? r.videoInfo.runs[2].text : "")),
        channel: channelOfByline(byline),
        badges: badgesOf(r.badges).map(function(b) { return b.label; }).filter(Boolean),
        live: o.live || badgesOf(r.badges).some(function(b) { return /LIVE/.test(b.style + b.icon); }),
        upcoming: o.upcoming || !!r.upcomingEventData,
        short: o.short || !!r.headline,
        snippet: r.descriptionSnippet || (r.detailedMetadataSnippets && r.detailedMetadataSnippets[0] && r.detailedMetadataSnippets[0].snippetText) || null,
        progress: o.progress,
        index: r.index ? text(r.index) : r.indexText ? text(r.indexText) : "",
        selected: !!r.selected,
        setId: r.playlistSetVideoId || ""
    };
    if (v.channel) {
        v.channel.avatar = avatarOf(r);
        v.channel.verified = verifiedOf(r.ownerBadges);
    }
    if (r.upcomingEventData && r.upcomingEventData.startTime) {
        v.published = "Scheduled for " + new Date(Number(r.upcomingEventData.startTime) * 1000).toLocaleString();
    }
    return v;
}
// lockupViewModel (videos, playlists, podcasts), shortsLockupViewModel
function lockupOf(vm) {
    const ctx = vm.rendererContext && vm.rendererContext.commandContext && vm.rendererContext.commandContext.onTap && vm.rendererContext.commandContext.onTap.innertubeCommand;
    const url = endpointUrl(ctx);
    const img = vm.contentImage || {};
    const thumbVm = img.thumbnailViewModel || (img.collectionThumbnailViewModel && img.collectionThumbnailViewModel.primaryThumbnail && img.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel) || {};
    const meta = vm.metadata && vm.metadata.lockupMetadataViewModel || {};
    const rows = (meta.metadata && meta.metadata.contentMetadataViewModel && meta.metadata.contentMetadataViewModel.metadataRows || []).map(function(row) {
        return (row.metadataParts || []).map(function(p) {
            return { text: p.text && p.text.content || "", label: p.accessibilityLabel || "", url: endpointUrl(p.text && p.text.commandRuns && p.text.commandRuns[0] && p.text.commandRuns[0].onTap && p.text.commandRuns[0].onTap.innertubeCommand) };
        }).filter(function(p) { return p.text; });
    }).filter(function(r) { return r.length; });
    const badges = [];
    (thumbVm.overlays || []).forEach(function(o) {
        const b = o.thumbnailBottomOverlayViewModel && o.thumbnailBottomOverlayViewModel.badges || o.thumbnailOverlayBadgeViewModel && o.thumbnailOverlayBadgeViewModel.thumbnailBadges || [];
        b.forEach(function(x) {
            if (x.thumbnailBadgeViewModel) {
                badges.push({ text: x.thumbnailBadgeViewModel.text || "", style: x.thumbnailBadgeViewModel.badgeStyle || "", icon: x.thumbnailBadgeViewModel.icon && x.thumbnailBadgeViewModel.icon.sources && x.thumbnailBadgeViewModel.icon.sources[0] && x.thumbnailBadgeViewModel.icon.sources[0].clientResource && x.thumbnailBadgeViewModel.icon.sources[0].clientResource.imageName || "" });
            }
        });
    });
    const avatar = meta.image && meta.image.decoratedAvatarViewModel;
    const avatarVm = avatar && avatar.avatar && avatar.avatar.avatarViewModel;
    const avatarTap = avatar && avatar.rendererContext && avatar.rendererContext.commandContext && avatar.rendererContext.commandContext.onTap && avatar.rendererContext.commandContext.onTap.innertubeCommand;
    const byline = rows[0] && rows[0][0];
    const channel = byline ? { name: byline.text, url: byline.url || endpointUrl(avatarTap) || "", id: avatarTap && avatarTap.browseEndpoint && avatarTap.browseEndpoint.browseId || "", avatar: thumbUrl(avatarVm && avatarVm.image, 48), verified: false } : null;
    const stats = rows[1] || [];
    const type = vm.contentType || "";
    if (/PLAYLIST|PODCAST|ALBUM|COURSE/.test(type)) {
        const count = badges.map(function(b) { return b.text; }).find(function(t) { return /\d/.test(t); }) || "";
        return { kind: "playlist", id: vm.contentId || "", url: url || "/playlist?list=" + vm.contentId, title: meta.title && meta.title.content || "", thumb: thumbUrl(thumbVm.image, 320), count: count, channel: channel, videos: [], mix: /^RD/.test(vm.contentId || "") };
    }
    const timeBadge = badges.find(function(b) { return /^\d+:\d\d/.test(b.text); });
    const liveBadge = badges.find(function(b) { return /LIVE/.test(b.style) || /^LIVE$/i.test(b.text); });
    const id = vm.contentId || (ctx && ctx.watchEndpoint && ctx.watchEndpoint.videoId) || "";
    return {
        kind: "video",
        id: id,
        url: url || "/watch?v=" + id,
        title: meta.title && meta.title.content || "",
        thumb: videoThumb(id),
        duration: timeBadge ? timeBadge.text : "",
        seconds: timeBadge ? parseTime(timeBadge.text) : 0,
        views: stats[0] ? (/view/i.test(stats[0].text) ? stats[0].text : stats[0].text + " views") : "",
        published: longAgo(stats[1] ? stats[1].label || stats[1].text : ""),
        channel: channel,
        badges: [],
        live: !!liveBadge,
        upcoming: badges.some(function(b) { return /UPCOMING/.test(b.style); }),
        short: /SHORTS/.test(type),
        snippet: null,
        progress: 0,
        index: "",
        selected: false,
        setId: ""
    };
}
function shortsLockupOf(vm) {
    const tap = vm.onTap && vm.onTap.innertubeCommand;
    const id = tap && tap.reelWatchEndpoint && tap.reelWatchEndpoint.videoId || (vm.entityId || "").replace(/^shorts-shelf-item-/, "");
    const over = vm.overlayMetadata || {};
    return { kind: "video", id: id, url: "/watch?v=" + id, title: over.primaryText && over.primaryText.content || "", thumb: videoThumb(id), duration: "", seconds: 0, views: over.secondaryText && over.secondaryText.content || "", published: "", channel: null, badges: [], live: false, upcoming: false, short: true, snippet: null, progress: 0, index: "", selected: false, setId: "" };
}
// playlistRenderer, gridPlaylistRenderer, compactPlaylistRenderer, radioRenderer, compactRadioRenderer,
// gridRadioRenderer, compactStationRenderer
function playlistOf(r) {
    const id = r.playlistId || "";
    const thumbs = r.thumbnail || (r.thumbnails && r.thumbnails[0]) || null;
    return {
        kind: "playlist",
        id: id,
        url: endpointUrl(r.navigationEndpoint) || "/playlist?list=" + id,
        title: text(r.title),
        thumb: thumbUrl(thumbs, 320) || (r.videos && r.videos[0] && r.videos[0].childVideoRenderer ? videoThumb(r.videos[0].childVideoRenderer.videoId) : ""),
        count: text(r.videoCountText) || text(r.videoCountShortText) || (r.videoCount ? plural(Number(r.videoCount), "video") : ""),
        channel: channelOfByline(r.longBylineText || r.shortBylineText || r.ownerText),
        videos: (r.videos || []).map(function(v) { return videoOf(v.childVideoRenderer || v); }),
        mix: /^RD/.test(id) || !!r.isRadio
    };
}
// channelRenderer, gridChannelRenderer; the subscriber count and the handle swapped fields in 2022
function channelOf(r) {
    const texts = [text(r.subscriberCountText), text(r.videoCountText)];
    const id = r.channelId || "";
    return {
        kind: "channel",
        id: id,
        url: endpointUrl(r.navigationEndpoint) || "/channel/" + id,
        name: text(r.title),
        avatar: thumbUrl(r.thumbnail, 88),
        subscribers: texts.find(function(t) { return /subscriber/i.test(t); }) || "",
        videos: texts.find(function(t) { return /video/i.test(t); }) || "",
        handle: texts.find(function(t) { return /^@/.test(t); }) || "",
        snippet: r.descriptionSnippet || null,
        verified: verifiedOf(r.ownerBadges),
        subscribe: subscribeOf(r.subscribeButton)
    };
}
// what a subscribe button needs: the channel and whether you are subscribed
function subscribeOf(btn) {
    const r = btn && btn.subscribeButtonRenderer;
    if (!r) {
        return null;
    }
    return { channelId: r.channelId || "", subscribed: !!r.subscribed, enabled: r.enabled !== false, type: r.type || "FREE" };
}
function shelfOf(title, items, layout, url) {
    return { kind: "shelf", title: text(title), url: url || "", items: items, layout: layout || "horizontal" };
}
// A list of renderers -> models, flattening the containers YouTube wraps them in. Unknown things are
// left out; continuations become {kind: "more"}.
function modelsOf(list, endpoint) {
    const out = [];
    (list || []).forEach(function(node) {
        const k = keyOf(node), r = node[k];
        if (!r) {
            return;
        }
        switch (k) {
            case "richItemRenderer":
            case "richSectionRenderer":
                out.push.apply(out, modelsOf([r.content], endpoint));
                break;
            case "itemSectionRenderer":
            case "sectionListRenderer":
            case "richGridRenderer":
            case "playlistVideoListRenderer":
                out.push.apply(out, modelsOf(r.contents, endpoint));
                break;
            case "channelFeaturedContentRenderer":
                out.push.apply(out, modelsOf(r.items, endpoint));
                break;
            case "gridRenderer":
            case "horizontalListRenderer":
            case "verticalListRenderer":
            case "expandedShelfContentsRenderer":
            case "horizontalMovieListRenderer":
                out.push.apply(out, modelsOf(r.items || r.contents, endpoint));
                break;
            case "shelfRenderer": {
                const c = r.content || {};
                const inner = c.horizontalListRenderer || c.expandedShelfContentsRenderer || c.verticalListRenderer || c.gridRenderer || c.horizontalMovieListRenderer || {};
                const items = modelsOf(inner.items || inner.contents, endpoint);
                if (items.some(function(x) { return x.kind !== "more"; })) {
                    out.push(shelfOf(r.title, items, c.horizontalListRenderer ? "horizontal" : "vertical", endpointUrl(r.endpoint) || endpointUrl(r.title && r.title.runs && r.title.runs[0] && r.title.runs[0].navigationEndpoint)));
                }
                break;
            }
            case "richShelfRenderer": {
                const items = modelsOf(r.contents, endpoint);
                if (items.length) {
                    out.push(shelfOf(r.title, items, "horizontal", endpointUrl(r.endpoint)));
                }
                break;
            }
            case "reelShelfRenderer": {
                const items = modelsOf(r.items, endpoint);
                if (items.length) {
                    out.push(shelfOf(r.title || "Shorts", items, "horizontal"));
                }
                break;
            }
            case "horizontalCardListRenderer": {
                const cards = modelsOf(r.cards, endpoint);
                if (cards.length) {
                    out.push(shelfOf(r.header && r.header.richListHeaderRenderer && r.header.richListHeaderRenderer.title, cards, "horizontal"));
                }
                break;
            }
            case "videoRenderer":
            case "gridVideoRenderer":
            case "compactVideoRenderer":
            case "playlistVideoRenderer":
            case "playlistPanelVideoRenderer":
            case "endScreenVideoRenderer":
            case "childVideoRenderer":
            case "videoCardRenderer":
            case "reelItemRenderer":
            case "promotedVideoRenderer":
                out.push(videoOf(r));
                break;
            case "lockupViewModel":
                out.push(lockupOf(r));
                break;
            case "shortsLockupViewModel":
                out.push(shortsLockupOf(r));
                break;
            case "playlistRenderer":
            case "gridPlaylistRenderer":
            case "compactPlaylistRenderer":
            case "radioRenderer":
            case "compactRadioRenderer":
            case "gridRadioRenderer":
            case "compactStationRenderer":
                out.push(playlistOf(r));
                break;
            case "channelRenderer":
            case "gridChannelRenderer":
                out.push(channelOf(r));
                break;
            case "channelVideoPlayerRenderer":
                out.push({ kind: "featured", video: Object.assign(videoOf(r), { title: text(r.title), snippet: r.description || null, views: text(r.viewCountText), published: longAgo(text(r.publishedTimeText)) }) });
                break;
            case "continuationItemRenderer":
            case "continuationItemViewModel": {
                const c = continuationOf(node, endpoint);
                if (c) {
                    out.push(Object.assign({ kind: "more" }, c));
                }
                break;
            }
            case "messageRenderer":
                out.push({ kind: "message", text: text(r.text) || text(r.subtext && r.subtext.messageSubtextRenderer && r.subtext.messageSubtextRenderer.text) });
                break;
            case "backgroundPromoRenderer":
                out.push({ kind: "message", text: text(r.title), detail: text(r.bodyText) });
                break;
            case "feedNudgeRenderer":
                out.push({ kind: "message", text: text(r.title), detail: text(r.subtitle) });
                break;
            case "didYouMeanRenderer":
                out.push({ kind: "correction", label: text(r.didYouMean), query: text(r.correctedQuery), url: endpointUrl(r.correctedQueryEndpoint) });
                break;
            case "showingResultsForRenderer":
                out.push({ kind: "correction", label: text(r.showingResultsFor), query: text(r.correctedQuery), url: endpointUrl(r.correctedQueryEndpoint), original: text(r.originalQuery), originalUrl: endpointUrl(r.originalQueryEndpoint) });
                break;
            default:
                break;
        }
    });
    return out;
}
// The continuation a list carries, taken out of the models.
function splitMore(models) {
    const more = models.find(function(m) { return m.kind === "more"; }) || null;
    return { items: models.filter(function(m) { return m.kind !== "more"; }), more: more };
}
// The selected browse tab (a channel, a feed, a playlist): its content renderers and the tabs.
function tabsOf(data) {
    const two = data && data.contents && data.contents.twoColumnBrowseResultsRenderer;
    const tabs = (two && two.tabs || []).map(function(t) {
        const r = t.tabRenderer || t.expandableTabRenderer || {};
        return { title: r.title || "", url: endpointUrl(r.endpoint), selected: !!r.selected, content: r.content || null, params: r.endpoint && r.endpoint.browseEndpoint && r.endpoint.browseEndpoint.params || "" };
    });
    return { tabs: tabs, selected: tabs.find(function(t) { return t.selected; }) || tabs[0] || null };
}
function tabModels(tab, endpoint) {
    if (!tab || !tab.content) {
        return [];
    }
    return modelsOf([tab.content], endpoint || "browse");
}

// ---- the watch page
function watchOf(data, player, page) {
    const two = data.contents && data.contents.twoColumnWatchNextResults || {};
    const results = two.results && two.results.results && two.results.results.contents || [];
    const find = function(key) {
        const n = results.find(function(x) { return x[key]; });
        return n ? n[key] : null;
    };
    const primary = find("videoPrimaryInfoRenderer") || {};
    const secondary = find("videoSecondaryInfoRenderer") || {};
    const details = player && player.videoDetails || {};
    const micro = player && player.microformat && player.microformat.playerMicroformatRenderer || {};
    const owner = secondary.owner && secondary.owner.videoOwnerRenderer || {};
    const likeVm = ((primary.videoActions && primary.videoActions.menuRenderer && primary.videoActions.menuRenderer.topLevelButtons) || []).map(function(b) { return b.segmentedLikeDislikeButtonViewModel; }).find(Boolean);
    const likeCount = likeVm && likeVm.likeCountEntity || {};
    const likeBtn = likeVm && likeVm.likeButtonViewModel && likeVm.likeButtonViewModel.likeButtonViewModel || {};
    const likeToggle = likeBtn.toggleButtonViewModel && likeBtn.toggleButtonViewModel.toggleButtonViewModel || {};
    const commentsSection = results.find(function(x) { return x.itemSectionRenderer && x.itemSectionRenderer.sectionIdentifier === "comment-item-section"; });
    const commentsCont = commentsSection ? continuationOf(commentsSection.itemSectionRenderer.contents && commentsSection.itemSectionRenderer.contents[0], "next") : null;
    const commentsOff = results.find(function(x) { return x.itemSectionRenderer && x.itemSectionRenderer.sectionIdentifier === "comments-entry-point" && x.itemSectionRenderer.contents && x.itemSectionRenderer.contents.some(function(c) { return c.messageRenderer; }); });
    const secondaryList = two.secondaryResults && two.secondaryResults.secondaryResults && two.secondaryResults.secondaryResults.results || [];
    const related = splitMore(modelsOf(secondaryList, "next"));
    const autoplayVm = data.playerOverlays && data.playerOverlays.playerOverlayRenderer && data.playerOverlays.playerOverlayRenderer.autoplay && data.playerOverlays.playerOverlayRenderer.autoplay.playerOverlayAutoplayRenderer;
    const autoplaySet = two.autoplay && two.autoplay.autoplay && two.autoplay.autoplay.sets && two.autoplay.autoplay.sets[0];
    const nextEp = autoplaySet && (autoplaySet.autoplayVideo || autoplaySet.nextButtonVideo);
    const pl = two.playlist && two.playlist.playlist;
    const captions = player && player.captions && player.captions.playerCaptionsTracklistRenderer && player.captions.playerCaptionsTracklistRenderer.captionTracks || [];
    const status = player && player.playabilityStatus || {};
    const viewsFull = text(primary.viewCount && primary.viewCount.videoViewCountRenderer && primary.viewCount.videoViewCountRenderer.viewCount) || (details.viewCount ? plural(Number(details.viewCount), "view") : "");
    return {
        id: details.videoId || page.id,
        title: text(primary.title) || details.title || "",
        superTitle: primary.superTitleLink || null,
        views: viewsFull,
        viewCount: Number(details.viewCount) || parseCount(viewsFull),
        live: !!details.isLiveContent && !!(primary.viewCount && primary.viewCount.videoViewCountRenderer && primary.viewCount.videoViewCountRenderer.isLive),
        date: text(primary.dateText) || micro.publishDate || "",
        relativeDate: longAgo(text(primary.relativeDateText)),
        likes: { short: likeCount.likeCountIfIndifferent && likeCount.likeCountIfIndifferent.content || "", full: likeCount.expandedLikeCountIfIndifferent && likeCount.expandedLikeCountIfIndifferent.content || (micro.likeCount ? fmtNum(micro.likeCount) : ""), count: Number(likeCount.likeCountIfIndifferentNumber || micro.likeCount) || 0, liked: likeToggle.isTogglingButtonDisabled ? false : !!likeToggle.isToggled },
        channel: {
            name: text(owner.title) || details.author || "",
            url: endpointUrl(owner.navigationEndpoint) || "/channel/" + (details.channelId || ""),
            id: details.channelId || (owner.navigationEndpoint && owner.navigationEndpoint.browseEndpoint && owner.navigationEndpoint.browseEndpoint.browseId) || "",
            avatar: thumbUrl(owner.thumbnail, 48),
            subscribers: text(owner.subscriberCountText),
            verified: verifiedOf(owner.badges)
        },
        subscribe: subscribeOf(secondary.subscribeButton) || { channelId: details.channelId || "", subscribed: false, enabled: true, type: "FREE" },
        description: secondary.attributedDescription || secondary.description || (details.shortDescription ? { simpleText: details.shortDescription } : null),
        metadataRows: ((secondary.metadataRowContainer && secondary.metadataRowContainer.metadataRowContainerRenderer && secondary.metadataRowContainer.metadataRowContainerRenderer.rows) || []).map(function(row) {
            const r = row.metadataRowRenderer || row.richMetadataRowRenderer || {};
            return { title: text(r.title), contents: (r.contents || []).map(function(c) { return c; }) };
        }).filter(function(r) { return r.title; }),
        category: micro.category || "",
        keywords: details.keywords || [],
        seconds: Number(details.lengthSeconds) || 0,
        related: related.items,
        relatedMore: related.more,
        comments: { more: commentsCont, off: !!commentsOff, count: "" },
        autoplay: autoplayVm ? Object.assign(videoOf({ videoId: autoplayVm.videoId, title: autoplayVm.videoTitle, lengthText: autoplayVm.thumbnailOverlays && autoplayVm.thumbnailOverlays[0] && autoplayVm.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer && autoplayVm.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer.text, shortViewCountText: autoplayVm.shortViewCountText, publishedTimeText: autoplayVm.publishedTimeText, longBylineText: autoplayVm.byline, navigationEndpoint: nextEp || autoplayVm.nextButton && autoplayVm.nextButton.buttonRenderer && autoplayVm.nextButton.buttonRenderer.navigationEndpoint }), { countdown: autoplayVm.countDownSecs || 5 }) : null,
        playlist: pl ? {
            id: pl.playlistId || page.list,
            title: text(pl.titleText) || pl.title || "",
            url: "/playlist?list=" + (pl.playlistId || page.list),
            owner: text(pl.shortBylineText) || text(pl.longBylineText) || pl.ownerName && text(pl.ownerName) || "",
            ownerUrl: pl.shortBylineText && endpointUrl(pl.shortBylineText.runs && pl.shortBylineText.runs[0] && pl.shortBylineText.runs[0].navigationEndpoint) || "",
            index: Number(pl.currentIndex) || 0,
            total: Number(pl.totalVideos) || 0,
            items: modelsOf(pl.contents, "next").filter(function(m) { return m.kind === "video"; }),
            mix: /^RD/.test(pl.playlistId || "")
        } : null,
        captions: captions.map(function(t) { return { url: t.baseUrl, name: text(t.name), code: t.languageCode, auto: t.kind === "asr", vss: t.vssId || "" }; }),
        embeddable: status.playableInEmbed !== false,
        playable: !status.status || status.status === "OK" || status.status === "LIVE_STREAM_OFFLINE",
        unavailable: status.status && status.status !== "OK" ? (text(status.errorScreen && status.errorScreen.playerErrorMessageRenderer && status.errorScreen.playerErrorMessageRenderer.reason) || status.reason || "This video is unavailable.") : "",
        unlisted: !!micro.isUnlisted,
        storyboard: player && player.storyboards && player.storyboards.playerStoryboardSpecRenderer && player.storyboards.playerStoryboardSpecRenderer.spec || "",
        start: page.start || 0
    };
}

// ---- comments (the newer entity form, and the older commentRenderer form)
function commentEntities(resp) {
    const out = { comments: {}, toolbars: {}, surfaces: {} };
    ((resp.frameworkUpdates && resp.frameworkUpdates.entityBatchUpdate && resp.frameworkUpdates.entityBatchUpdate.mutations) || []).forEach(function(m) {
        const p = m.payload || {};
        if (p.commentEntityPayload) {
            out.comments[p.commentEntityPayload.key] = p.commentEntityPayload;
        } else if (p.engagementToolbarStateEntityPayload) {
            out.toolbars[p.engagementToolbarStateEntityPayload.key] = p.engagementToolbarStateEntityPayload;
        } else if (p.engagementToolbarSurfaceEntityPayload) {
            out.surfaces[p.engagementToolbarSurfaceEntityPayload.key] = p.engagementToolbarSurfaceEntityPayload;
        }
    });
    return out;
}
function commentOf(node, ents) {
    const thread = node.commentThreadRenderer;
    const base = thread || node;
    const vm = base.commentViewModel && (base.commentViewModel.commentViewModel || base.commentViewModel);
    const old = base.commentRenderer || base.comment && base.comment.commentRenderer;
    let c;
    if (vm) {
        const e = ents.comments[vm.commentKey] || { properties: {}, author: {}, toolbar: {} };
        const state = ents.toolbars[vm.toolbarStateKey] || {};
        const surface = ents.surfaces[vm.toolbarSurfaceKey] || {};
        const cmd = function(k) {
            return surface[k] && surface[k].innertubeCommand && surface[k].innertubeCommand.performCommentActionEndpoint && surface[k].innertubeCommand.performCommentActionEndpoint.action || "";
        };
        c = {
            id: e.properties.commentId || vm.commentId || "",
            text: e.properties.content || { content: "" },
            author: { name: e.author.displayName || "", url: endpointUrl(e.author.channelCommand && e.author.channelCommand.innertubeCommand) || "/channel/" + (e.author.channelId || ""), avatar: e.author.avatarThumbnailUrl || "", verified: !!e.author.isVerified, creator: !!e.author.isCreator },
            time: longAgo(e.properties.publishedTime || ""),
            likes: e.toolbar.likeCountNotliked || e.toolbar.likeCountLiked || "",
            liked: state.likeState === "TOOLBAR_LIKE_STATE_LIKED",
            disliked: state.likeState === "TOOLBAR_LIKE_STATE_DISLIKED",
            hearted: state.heartState === "TOOLBAR_HEART_STATE_HEARTED",
            heartAvatar: e.toolbar.creatorThumbnailUrl || "",
            pinned: vm.pinnedText || "",
            replyCount: e.toolbar.replyCount || "",
            level: e.properties.replyLevel || 0,
            actions: { like: cmd("likeCommand"), unlike: cmd("unlikeCommand"), dislike: cmd("dislikeCommand"), undislike: cmd("undislikeCommand"), reply: dig(surface, "replyCommand.innertubeCommand.createCommentReplyDialogEndpoint.dialog.commentReplyDialogRenderer.replyButton.buttonRenderer.serviceEndpoint.createCommentReplyEndpoint.createReplyParams") || "" }
        };
    } else if (old) {
        c = {
            id: old.commentId || "",
            text: old.contentText || { runs: [] },
            author: { name: text(old.authorText), url: endpointUrl(old.authorEndpoint), avatar: thumbUrl(old.authorThumbnail, 48), verified: !!old.authorCommentBadge, creator: !!old.authorIsChannelOwner },
            time: longAgo(text(old.publishedTimeText)),
            likes: text(old.voteCount),
            liked: old.voteStatus === "LIKE",
            disliked: old.voteStatus === "DISLIKE",
            hearted: !!(old.actionButtons && old.actionButtons.commentActionButtonsRenderer && old.actionButtons.commentActionButtonsRenderer.creatorHeart && old.actionButtons.commentActionButtonsRenderer.creatorHeart.creatorHeartRenderer && old.actionButtons.commentActionButtonsRenderer.creatorHeart.creatorHeartRenderer.isHearted),
            heartAvatar: "",
            pinned: old.pinnedCommentBadge ? text(old.pinnedCommentBadge.pinnedCommentBadgeRenderer && old.pinnedCommentBadge.pinnedCommentBadgeRenderer.label) : "",
            replyCount: old.replyCount ? String(old.replyCount) : "",
            level: old.isReply ? 1 : 0,
            actions: {}
        };
    } else {
        return null;
    }
    c.kind = "comment";
    const replies = thread && thread.replies && thread.replies.commentRepliesRenderer;
    // (the continuation sits in "contents" or, with the page's own client context, in "subThreads")
    c.repliesMore = replies ? continuationOf((replies.contents || replies.subThreads || [])[0], "next") : null;
    c.repliesLabel = replies ? text(replies.viewReplies && replies.viewReplies.buttonRenderer && replies.viewReplies.buttonRenderer.text) : "";
    return c;
}
// A comments response: the header (first page only), the threads, and the next page.
function commentsOf(resp) {
    const ents = commentEntities(resp);
    const items = continuationItems(resp);
    const out = { header: null, comments: [], more: null };
    items.forEach(function(node) {
        if (node.commentsHeaderRenderer) {
            const hdr = node.commentsHeaderRenderer;
            const box = hdr.createRenderer && hdr.createRenderer.commentSimpleboxRenderer;
            out.header = {
                count: text(hdr.countText) || text(hdr.commentsCount),
                sorts: ((hdr.sortMenu && hdr.sortMenu.sortFilterSubMenuRenderer && hdr.sortMenu.sortFilterSubMenuRenderer.subMenuItems) || []).map(function(s) { return { title: s.title, selected: !!s.selected, more: continuationOf(s.serviceEndpoint, "next") }; }),
                avatar: thumbUrl(box && box.authorThumbnail, 48),
                placeholder: text(box && box.placeholderText) || "Add a public comment...",
                createParams: dig(box, "submitButton.buttonRenderer.serviceEndpoint.createCommentEndpoint.createCommentParams") || "",
                disabled: box && box.disabledText && !box.submitButton ? box.disabledText : ""
            };
        } else if (node.commentThreadRenderer || node.commentViewModel || node.commentRenderer) {
            const c = commentOf(node, ents);
            if (c) {
                out.comments.push(c);
            }
        } else if (node.continuationItemRenderer) {
            out.more = continuationOf(node, "next");
        }
    });
    return out;
}

// ---- channel and playlist headers
function metadataParts(vm) {
    const rows = vm && vm.metadata && vm.metadata.contentMetadataViewModel && vm.metadata.contentMetadataViewModel.metadataRows || [];
    const parts = [];
    rows.forEach(function(row) {
        (row.metadataParts || []).forEach(function(p) {
            const t = p.text && p.text.content || "";
            if (t) {
                parts.push({ text: t, url: endpointUrl(p.text.commandRuns && p.text.commandRuns[0] && p.text.commandRuns[0].onTap && p.text.commandRuns[0].onTap.innertubeCommand), avatars: p.avatarStack && p.avatarStack.avatarStackViewModel && p.avatarStack.avatarStackViewModel.text && p.avatarStack.avatarStackViewModel.text.content || "" });
            }
        });
    });
    return parts;
}
function channelHeaderOf(data) {
    const meta = data.metadata && data.metadata.channelMetadataRenderer || {};
    const hdr = data.header || {};
    const vm = hdr.pageHeaderRenderer && hdr.pageHeaderRenderer.content && hdr.pageHeaderRenderer.content.pageHeaderViewModel;
    const c4 = hdr.c4TabbedHeaderRenderer;
    const parts = metadataParts(vm);
    const pick = function(re) {
        const p = parts.find(function(x) { return re.test(x.text); });
        return p ? p.text : "";
    };
    const actions = vm && vm.actions && vm.actions.flexibleActionsViewModel && vm.actions.flexibleActionsViewModel.actionsRows || [];
    let subscribed = false, subscribeVm = null;
    actions.forEach(function(row) {
        (row.actions || []).forEach(function(a) {
            if (a.subscribeButtonViewModel) {
                subscribeVm = a.subscribeButtonViewModel;
                subscribed = !!a.subscribeButtonViewModel.subscribed;
            }
        });
    });
    return {
        id: meta.externalId || (c4 && c4.channelId) || "",
        name: dig(vm, "title.dynamicTextViewModel.text.content") || (c4 && text(c4.title)) || meta.title || "",
        url: (meta.vanityChannelUrl || meta.channelUrl || "").replace(/^https?:\/\/www\.youtube\.com/, "") || "/channel/" + (meta.externalId || ""),
        avatar: thumbUrl(dig(vm, "image.decoratedAvatarViewModel.avatar.avatarViewModel.image"), 160) || thumbUrl(c4 && c4.avatar, 160) || thumbUrl(meta.avatar, 160),
        banner: thumbUrl(dig(vm, "banner.imageBannerViewModel.image"), 1280) || thumbUrl(c4 && c4.banner, 1280),
        handle: pick(/^@/) || (c4 && text(c4.channelHandleText)) || "",
        subscribers: pick(/subscriber/i) || (c4 && text(c4.subscriberCountText)) || "",
        videos: pick(/video/i) || (c4 && text(c4.videosCountText)) || "",
        description: dig(vm, "description.descriptionPreviewViewModel.description.content") || meta.description || "",
        verified: !!(dig(vm, "title.dynamicTextViewModel.text.attachmentRuns") || []).length || !!(c4 && c4.badges && c4.badges.length),
        subscribe: subscribeOf(c4 && c4.subscribeButton) || { channelId: meta.externalId || "", subscribed: subscribed, enabled: true, type: "FREE" },
        keywords: meta.keywords || "",
        rss: meta.rssUrl || ""
    };
}
function playlistHeaderOf(data, page) {
    const meta = data.metadata && data.metadata.playlistMetadataRenderer || {};
    const side = data.sidebar && data.sidebar.playlistSidebarRenderer && data.sidebar.playlistSidebarRenderer.items || [];
    const primary = side[0] && side[0].playlistSidebarPrimaryInfoRenderer;
    const secondaryOwner = side[1] && side[1].playlistSidebarSecondaryInfoRenderer && side[1].playlistSidebarSecondaryInfoRenderer.videoOwner && side[1].playlistSidebarSecondaryInfoRenderer.videoOwner.videoOwnerRenderer;
    const vm = data.header && data.header.pageHeaderRenderer && data.header.pageHeaderRenderer.content && data.header.pageHeaderRenderer.content.pageHeaderViewModel;
    const parts = metadataParts(vm);
    const stats = primary ? (primary.stats || []).map(text) : parts.map(function(p) { return p.text; });
    const ownerPart = parts.find(function(p) { return p.url || p.avatars; });
    const firstUrl = endpointUrl(primary && primary.navigationEndpoint) || endpointUrl(dig(vm, "heroImage.contentPreviewImageViewModel.rendererContext.commandContext.onTap.innertubeCommand"));
    return {
        id: page.list,
        title: (primary && text(primary.title)) || dig(vm, "title.dynamicTextViewModel.text.content") || meta.title || "",
        thumb: thumbUrl(dig(primary, "thumbnailRenderer.playlistVideoThumbnailRenderer.thumbnail"), 320) || thumbUrl(dig(vm, "heroImage.contentPreviewImageViewModel.image"), 320),
        count: stats.find(function(s) { return /video/i.test(s); }) || "",
        views: stats.find(function(s) { return /view/i.test(s); }) || "",
        updated: stats.find(function(s) { return /updated|ago|today|yesterday/i.test(s) && !/view|video/i.test(s); }) || "",
        owner: secondaryOwner ? { name: text(secondaryOwner.title), url: endpointUrl(secondaryOwner.navigationEndpoint), avatar: thumbUrl(secondaryOwner.thumbnail, 48) } : ownerPart ? { name: ownerPart.avatars || ownerPart.text, url: ownerPart.url, avatar: "" } : null,
        description: text(primary && primary.description) || dig(vm, "description.descriptionPreviewViewModel.description.content") || meta.description || "",
        playUrl: firstUrl,
        mix: /^RD/.test(page.list)
    };
}

// ---- the guide
function guideOf(resp) {
    const sections = [];
    const entry = function(e) {
        const r = e.guideEntryRenderer;
        if (!r) {
            return null;
        }
        return { title: text(r.formattedTitle), url: endpointUrl(r.navigationEndpoint), icon: r.icon && r.icon.iconType || "", avatar: thumbUrl(r.thumbnail, 32), id: r.entryData && r.entryData.guideEntryData && r.entryData.guideEntryData.guideEntryId || "", count: r.badges && r.badges.count || 0, live: !!(r.badges && r.badges.liveBroadcasting), selected: !!r.isPrimary && false };
    };
    (resp.items || []).forEach(function(it) {
        const s = it.guideSectionRenderer || it.guideSubscriptionsSectionRenderer;
        if (!s) {
            return;
        }
        const items = [];
        (s.items || []).forEach(function(e) {
            if (e.guideCollapsibleEntryRenderer) {
                (e.guideCollapsibleEntryRenderer.expandableItems || []).forEach(function(x) {
                    const m = entry(x);
                    if (m) {
                        m.hidden = true;
                        items.push(m);
                    }
                });
            } else if (e.guideCollapsibleSectionEntryRenderer) {
                const hd = entry(e.guideCollapsibleSectionEntryRenderer.headerEntry);
                if (hd) {
                    items.push(hd);
                }
            } else {
                const m = entry(e);
                if (m) {
                    items.push(m);
                }
            }
        });
        if (items.length) {
            sections.push({ title: text(s.formattedTitle), items: items, subscriptions: !!it.guideSubscriptionsSectionRenderer });
        }
    });
    return sections;
}

// ---- search: the filters and the chips of the results page
function searchOf(data) {
    const two = data.contents && data.contents.twoColumnSearchResultsRenderer || {};
    const list = two.primaryContents && two.primaryContents.sectionListRenderer || {};
    const header = data.header && data.header.searchHeaderRenderer || {};
    const dialog = dig(header, "searchFilterButton.buttonRenderer.command.openPopupAction.popup.searchFilterOptionsDialogRenderer");
    const groups = ((dialog && dialog.groups) || []).map(function(g) {
        const r = g.searchFilterGroupRenderer || {};
        return { title: text(r.title), filters: (r.filters || []).map(function(f) {
            const x = f.searchFilterRenderer || {};
            return { label: text(x.label), url: endpointUrl(x.navigationEndpoint), selected: x.status === "FILTER_STATUS_SELECTED", disabled: x.status === "FILTER_STATUS_DISABLED" };
        }) };
    });
    const models = splitMore(modelsOf(list.contents, "search"));
    return {
        items: models.items,
        more: models.more,
        groups: groups,
        estimated: Number(data.estimatedResults) || 0,
        refinements: data.refinements || []
    };
}
