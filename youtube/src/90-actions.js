// ---- Gplex YouTube: what needs your account ----
// Subscribing, liking, commenting, playlists, notifications and the account menu, through the same
// InnerTube calls YouTube's own app makes, as you. Signed out, each of these goes to the sign-in page.
function needSignIn() {
    location.href = signInUrl();
}
// Subscribe buttons anywhere on the page: one listener for all of them.
function wireSubscribeButtons(root) {
    root.addEventListener("click", async function(e) {
        const btn = e.target.closest(".yt-uix-subscription-button");
        if (!btn) {
            return;
        }
        e.preventDefault();
        if (!signedIn()) {
            needSignIn();
            return;
        }
        const id = btn.dataset.channelId;
        const subscribed = btn.dataset.subscribed === "1";
        if (!id || btn.disabled) {
            return;
        }
        btn.disabled = true;
        try {
            await api.post(subscribed ? "subscription/unsubscribe" : "subscription/subscribe", { channelIds: [id] });
            btn.dataset.subscribed = subscribed ? "" : "1";
            btn.classList.toggle("yt-uix-button-subscribe-branded", subscribed);
            btn.classList.toggle("yt-uix-button-subscribed-branded", !subscribed);
            btn.classList.toggle("yt-uix-subscription-button-subscribed", !subscribed);
            btn.querySelector(".yt-uix-button-content").textContent = subscribed ? "Subscribe" : "Subscribed";
        } catch (err) {
            console.error("Gplex YouTube: subscribe", err);
        }
        btn.disabled = false;
    });
}
// The like and dislike buttons of a video.
function likeButtons(watch) {
    let state = watch.likes.liked ? "like" : "none";
    let count = watch.likes.count;
    const likeBtn = button({ text: "", icon: "like", svg: "like", cls: "like-button-renderer-like-button", title: "I like this" });
    const dislikeBtn = button({ text: "", icon: "dislike", svg: "dislike", cls: "like-button-renderer-dislike-button", title: "I dislike this" });
    const countEl = h("span", { class: "yt-uix-button-content gy-like-count" });
    likeBtn.appendChild(countEl);
    const draw = function() {
        countEl.textContent = count ? fmtNum(count) : watch.likes.full || "";
        likeBtn.classList.toggle("yt-uix-button-toggled", state === "like");
        dislikeBtn.classList.toggle("yt-uix-button-toggled", state === "dislike");
    };
    const rate = async function(want) {
        if (!signedIn()) {
            needSignIn();
            return;
        }
        const next = state === want ? "none" : want;
        const endpoint = next === "none" ? "like/removelike" : next === "like" ? "like/like" : "like/dislike";
        try {
            await api.post(endpoint, { target: { videoId: watch.id } });
            if (state === "like") {
                count--;
            }
            state = next;
            if (state === "like") {
                count++;
            }
            draw();
        } catch (err) {
            console.error("Gplex YouTube: rate", err);
        }
    };
    likeBtn.addEventListener("click", function() { rate("like"); });
    dislikeBtn.addEventListener("click", function() { rate("dislike"); });
    draw();
    return h("span", { class: "like-button-renderer" + (signedIn() ? " actionable" : "") }, likeBtn, " ", dislikeBtn);
}
// "Add to": your playlists, with the video in or out of each; Watch later first.
async function addToMenu(videoId, anchor) {
    if (!signedIn()) {
        needSignIn();
        return;
    }
    const el = popup(anchor, h("div", { class: "gy-addto" }, h("div", { class: "gy-addto-loading" }, "Loading...")), "gy-popup-addto");
    try {
        const resp = await api.post("playlist/get_add_to_playlist", { videoIds: [videoId] });
        const lists = [];
        (resp.contents || []).forEach(function(c) {
            const r = c.addToPlaylistRenderer;
            (r && r.playlists || []).forEach(function(p) {
                const x = p.playlistAddToOptionRenderer;
                if (x) {
                    lists.push({ id: x.playlistId, title: text(x.title), has: x.containsSelectedVideos === "ALL", privacy: x.privacy || "" });
                }
            });
        });
        const rows = lists.map(function(p) {
            const cb = h("input", { type: "checkbox", id: "gy-addto-" + p.id, checked: p.has || null });
            cb.addEventListener("change", async function() {
                cb.disabled = true;
                try {
                    await api.post("playlist/edit", { playlistId: p.id, actions: [cb.checked ? { action: "ACTION_ADD_VIDEO", addedVideoId: videoId } : { action: "ACTION_REMOVE_VIDEO_BY_VIDEO_ID", removedVideoId: videoId }] });
                } catch (err) {
                    cb.checked = !cb.checked;
                }
                cb.disabled = false;
            });
            return h("li", null, cb, h("label", { for: "gy-addto-" + p.id }, p.title), h("span", { class: "gy-addto-privacy" }, p.privacy.toLowerCase()));
        });
        const title = h("input", { type: "text", class: "gy-addto-new-title", placeholder: "Enter playlist name...", maxlength: "150" });
        const create = h("form", { class: "gy-addto-new", onsubmit: async function(e) {
            e.preventDefault();
            if (!title.value.trim()) {
                return;
            }
            try {
                await api.post("playlist/create", { title: title.value.trim(), privacyStatus: "PRIVATE", videoIds: [videoId] });
                closeMenu();
            } catch (err) {
                console.error("Gplex YouTube: create playlist", err);
            }
        } }, title, button({ text: "Create", style: "primary", size: "small", type: "submit" }));
        replace(el, h("div", { class: "gy-addto" }, h("h3", null, "Add to"), h("ul", { class: "gy-addto-list" }, rows), create));
    } catch (err) {
        replace(el, h("div", { class: "gy-addto" }, "Couldn't load your playlists."));
    }
}
// The share panel: the link, and the places the old site shared to.
function sharePanel(watch) {
    const url = "https://youtu.be/" + watch.id;
    const field = h("input", { type: "text", class: "share-panel-url yt-uix-form-input-text", value: url, readonly: true, onclick: function() { field.select(); } });
    const embed = h("textarea", { class: "share-embed-code", readonly: true, rows: 3 }, "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/" + watch.id + "\" frameborder=\"0\" allowfullscreen></iframe>");
    const t = encodeURIComponent(watch.title), u = encodeURIComponent(url);
    const links = [["Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + u], ["Twitter", "https://twitter.com/intent/tweet?url=" + u + "&text=" + t], ["Google+", "https://plus.gplexextended.com/share?url=" + u], ["Tumblr", "https://www.tumblr.com/share/link?url=" + u + "&name=" + t], ["Blogger", "https://www.blogger.com/blog-this.g?u=" + u + "&n=" + t], ["reddit", "https://www.reddit.com/submit?url=" + u + "&title=" + t], ["Pinterest", "https://pinterest.com/pin/create/button/?url=" + u + "&description=" + t], ["Email", "mailto:?subject=" + t + "&body=" + u]];
    const panel = h("div", { id: "action-panel-share", class: "action-panel-content yt-card yt-card-has-padding gy-share hid" },
        h("div", { class: "gy-share-tabs" }, h("button", { class: "yt-uix-button yt-uix-button-size-default yt-uix-button-link gy-share-tab gy-on", type: "button", onclick: function(e) { showTab(e.currentTarget, "share"); } }, h("span", { class: "yt-uix-button-content" }, "Share")), h("button", { class: "yt-uix-button yt-uix-button-size-default yt-uix-button-link gy-share-tab", type: "button", onclick: function(e) { showTab(e.currentTarget, "embed"); } }, h("span", { class: "yt-uix-button-content" }, "Embed"))),
        h("div", { class: "gy-share-body gy-share-share" },
            h("ul", { class: "share-service-buttons" }, links.map(function(l) { return h("li", null, h("a", { href: l[1], target: "_blank", rel: "noopener", class: "share-service-icon share-service-icon-" + l[0].toLowerCase().replace("+", "plus"), title: l[0] }, h("span", { class: "gy-share-name" }, l[0]))); })),
            h("div", { class: "gy-share-url" }, field, button({ text: "Copy", size: "small", onclick: function() { field.select(); navigator.clipboard && navigator.clipboard.writeText(url); } }))),
        h("div", { class: "gy-share-body gy-share-embed hid" }, embed));
    const showTab = function(btn, which) {
        panel.querySelectorAll(".gy-share-tab").forEach(function(b) { b.classList.toggle("gy-on", b === btn); });
        panel.querySelector(".gy-share-share").classList.toggle("hid", which !== "share");
        panel.querySelector(".gy-share-embed").classList.toggle("hid", which !== "embed");
    };
    return panel;
}
// ---- comments
function commentEl(c, reply) {
    const liked = h("span", { class: "comment-renderer-like-count" + (c.liked ? " on" : " off") }, c.likes || "");
    const likeBtn = button({ icon: "like", svg: "like", cls: "comment-action-like" + (c.liked ? " yt-uix-button-toggled" : ""), title: "Like" });
    const dislikeBtn = button({ icon: "dislike", svg: "dislike", cls: "comment-action-dislike" + (c.disliked ? " yt-uix-button-toggled" : ""), title: "Dislike" });
    const vote = async function(want) {
        if (!signedIn()) {
            needSignIn();
            return;
        }
        const action = want === "like" ? (c.liked ? c.actions.unlike : c.actions.like) : (c.disliked ? c.actions.undislike : c.actions.dislike);
        if (!action) {
            return;
        }
        try {
            await api.post("comment/perform_comment_action", { actions: [action] });
            if (want === "like") {
                c.liked = !c.liked;
                c.disliked = false;
            } else {
                c.disliked = !c.disliked;
                c.liked = false;
            }
            likeBtn.classList.toggle("yt-uix-button-toggled", c.liked);
            dislikeBtn.classList.toggle("yt-uix-button-toggled", c.disliked);
        } catch (err) {
            console.error("Gplex YouTube: comment vote", err);
        }
    };
    likeBtn.addEventListener("click", function() { vote("like"); });
    dislikeBtn.addEventListener("click", function() { vote("dislike"); });
    const replyBox = h("div", { class: "comment-renderer-replybox" });
    const replyBtn = button({ text: "Reply", style: "link", cls: "comment-action-reply", onclick: function() {
        if (!signedIn()) {
            needSignIn();
            return;
        }
        if (!replyBox.firstChild) {
            replyBox.appendChild(simplebox({ placeholder: "Add a public reply...", submitText: "Reply", avatar: STATE.user.avatar, cancel: function() { clear(replyBox); }, submit: async function(txt) {
                const resp = await api.post("comment/create_comment_reply", { createReplyParams: c.actions.reply, commentText: txt });
                const made = commentsOf(resp);
                clear(replyBox);
                const list = el.querySelector(".comment-replies-renderer-pages") || el.appendChild(h("div", { class: "comment-replies-renderer" }, h("div", { class: "comment-replies-renderer-pages" }))).firstChild;
                made.comments.forEach(function(r) { list.appendChild(commentEl(r, true)); });
            } }));
        }
    } });
    const el = h("div", { class: "comment-renderer" + (c.liked ? " liked" : ""), "data-cid": c.id },
        h("a", { href: c.author.url, class: "comment-author-thumbnail-link" }, h("span", { class: "video-thumb comment-author-thumbnail yt-thumb yt-thumb-" + (reply ? 32 : 48) }, h("span", { class: "yt-thumb-square" }, h("span", { class: "yt-thumb-clip" }, h("img", { src: c.author.avatar, width: reply ? 32 : 48, height: reply ? 32 : 48, alt: c.author.name, loading: "lazy" }), h("span", { class: "vertical-align" }))))),
        h("div", { class: "comment-renderer-content" },
            c.pinned ? h("div", { class: "comment-renderer-pinned-comment-badge" }, c.pinned) : null,
            h("div", { class: "comment-renderer-header" },
                h("span", { class: c.author.creator ? "comment-renderer-author-comment-badge creator" : null }, h("a", { href: c.author.url, class: "comment-author-text" }, c.author.name), c.author.verified ? [" ", verifiedBadge()] : null),
                h("span", { class: "comment-renderer-time" }, h("a", { href: "/watch?v=" + (STATE.page.id || "") + "&lc=" + c.id }, c.time))),
            h("div", { class: "comment-renderer-text" }, h("div", { class: "comment-renderer-text-content" }, richText(c.text))),
            h("div", { class: "comment-renderer-footer" },
                h("div", { class: "comment-action-buttons-toolbar" }, replyBtn, liked, h("span", { role: "radiogroup" }, likeBtn, " ", dislikeBtn), c.hearted ? h("span", { class: "comment-renderer-creator-heart", title: "Hearted by the creator" }, c.heartAvatar ? h("img", { src: c.heartAvatar, width: 16, height: 16, alt: "" }) : null, icon("heart")) : null),
                replyBox)));
    if (c.repliesMore) {
        const pages = h("div", { class: "comment-replies-renderer-pages" });
        let cont = c.repliesMore;
        const more = h("button", { class: "yt-uix-button yt-uix-button-size-default yt-uix-button-link load-more-button comment-replies-renderer-paginator comment-replies-renderer-expander-down", type: "button" }, h("span", { class: "yt-uix-button-content" }, h("span", { class: "load-more-text" }, c.repliesLabel || "View replies")));
        more.addEventListener("click", async function() {
            if (!cont) {
                pages.classList.toggle("hid");
                more.querySelector(".load-more-text").textContent = pages.classList.contains("hid") ? (c.repliesLabel || "View replies") : "Hide replies";
                return;
            }
            more.disabled = true;
            try {
                const made = commentsOf(await api.more(cont));
                made.comments.forEach(function(r) { pages.appendChild(commentEl(r, true)); });
                cont = made.more;
                more.querySelector(".load-more-text").textContent = cont ? "Show more replies" : "Hide replies";
            } catch (err) {
                console.error("Gplex YouTube: replies", err);
            }
            more.disabled = false;
        });
        el.appendChild(h("div", { class: "comment-replies-renderer" }, h("div", { class: "comment-replies-renderer-header" }, more), pages));
    }
    return el;
}
// The box a comment is written in.
function simplebox(o) {
    const ta = h("textarea", { class: "comment-simplebox-text", placeholder: o.placeholder, rows: 1, "aria-label": o.placeholder });
    const submit = button({ text: o.submitText || "Comment", style: "primary", type: "submit", disabled: true });
    const form = h("form", { class: "comment-simplebox-renderer comment-simplebox" + (o.cancel ? " gy-simplebox-reply" : ""), onsubmit: async function(e) {
        e.preventDefault();
        const txt = ta.value.trim();
        if (!txt) {
            return;
        }
        submit.disabled = true;
        try {
            await o.submit(txt);
            ta.value = "";
            ta.rows = 1;
            form.classList.remove("gy-simplebox-active");
        } catch (err) {
            console.error("Gplex YouTube: comment", err);
            alert("Your comment could not be posted.");
        }
        submit.disabled = false;
    } },
        h("span", { class: "video-thumb comment-author-thumbnail yt-thumb yt-thumb-48" }, h("span", { class: "yt-thumb-square" }, h("span", { class: "yt-thumb-clip" }, o.avatar ? h("img", { src: o.avatar, width: 48, height: 48, alt: "" }) : icon("account"), h("span", { class: "vertical-align" })))),
        h("div", { class: "comment-simplebox-content" }, ta, h("div", { class: "comment-simplebox-buttons" }, button({ text: "Cancel", style: "default", onclick: function() { ta.value = ""; ta.rows = 1; form.classList.remove("gy-simplebox-active"); if (o.cancel) { o.cancel(); } } }), submit)));
    ta.addEventListener("focus", function() {
        if (!signedIn()) {
            ta.blur();
            needSignIn();
            return;
        }
        form.classList.add("gy-simplebox-active");
        ta.rows = 3;
    });
    ta.addEventListener("input", function() {
        submit.disabled = !ta.value.trim();
        ta.rows = Math.max(3, Math.min(12, ta.value.split("\n").length + 1));
    });
    return form;
}
// The whole comments section of a watch page: the header, the box, the threads and "Load more".
function commentsSection(watch) {
    const root = h("div", { id: "watch-discussion", class: "branded-page-box yt-card" });
    const section = h("div", { id: "comment-section-renderer", class: "comment-section-renderer" });
    root.appendChild(section);
    if (watch.comments.off) {
        section.appendChild(h("div", { class: "comment-section-header-renderer" }, "Comments are disabled for this video."));
        return root;
    }
    if (!watch.comments.more) {
        return root;
    }
    const items = h("div", { class: "comment-section-renderer-items", id: "comment-section-renderer-items" });
    const header = h("div", { class: "comment-section-header-renderer" }, "Loading comments...");
    section.appendChild(header);
    section.appendChild(items);
    const addPage = function(made) {
        made.comments.forEach(function(c) {
            items.appendChild(h("section", { class: "comment-thread-renderer" }, commentEl(c)));
        });
        return made.more;
    };
    api.more(watch.comments.more).then(function(resp) {
        const made = commentsOf(resp);
        const hdr = made.header || { count: "", sorts: [], placeholder: "Add a public comment...", avatar: STATE.user.avatar };
        const sortSel = hdr.sorts.length ? h("select", { class: "gy-comment-sort", onchange: async function(e) {
            const s = hdr.sorts[e.target.selectedIndex];
            if (!s || !s.more) {
                return;
            }
            clear(items);
            const page = commentsOf(await api.more(s.more));
            const next = addPage(page);
            replace(moreWrap, next ? loadMore(next, async function(r) { return addPage(commentsOf(r)); }, { text: "Show more", cls: "comment-section-renderer-paginator" }) : null);
        } }, hdr.sorts.map(function(s) { return h("option", { selected: s.selected || null }, s.title); })) : null;
        replace(header, h("span", { class: "comment-section-header-count" }, hdr.count ? (hdr.count.replace(/[^\d,.KMB]/g, "") + " Comments").replace(/^\s+/, "") : "Comments"), sortSel ? h("span", { class: "comment-section-sort-menu" }, "Sort by ", sortSel) : null);
        section.insertBefore(simplebox({ placeholder: hdr.placeholder, avatar: hdr.avatar || STATE.user.avatar, submit: async function(txt) {
            const resp = await api.post("comment/create_comment", { createCommentParams: hdr.createParams, commentText: txt });
            const made = commentsOf(resp);
            made.comments.reverse().forEach(function(c) { items.insertBefore(h("section", { class: "comment-thread-renderer" }, commentEl(c)), items.firstChild); });
        } }), items);
        const next = addPage(made);
        if (next) {
            moreWrap.appendChild(loadMore(next, async function(r) { return addPage(commentsOf(r)); }, { text: "Show more", cls: "comment-section-renderer-paginator" }));
        }
    }).catch(function(err) {
        console.error("Gplex YouTube: comments", err);
        replace(header, "Comments couldn't be loaded.");
    });
    const moreWrap = h("div", { class: "comment-section-more" });
    section.appendChild(moreWrap);
    return root;
}
// ---- the bell and the account menu
async function notificationsMenu(anchor) {
    const el = popup(anchor, h("div", { class: "gy-notifications" }, h("h3", null, "Notifications"), h("div", { class: "gy-addto-loading" }, "Loading...")), "gy-popup-notifications");
    try {
        const resp = await api.post("notification/get_notification_menu", { notificationsMenuRequestType: "NOTIFICATIONS_MENU_REQUEST_TYPE_INBOX" });
        const rows = [];
        const walk = function(o) {
            if (!o || typeof o !== "object") {
                return;
            }
            if (o.notificationRenderer) {
                const n = o.notificationRenderer;
                rows.push(h("li", { class: n.read ? "" : "gy-unread" }, h("a", { href: endpointUrl(n.navigationEndpoint) || "#" }, h("img", { src: thumbUrl(n.thumbnail, 48), width: 40, height: 40, alt: "" }), h("span", { class: "gy-notification-text" }, h("span", null, text(n.shortMessage)), h("span", { class: "gy-notification-time" }, longAgo(text(n.sentTimeText)))), n.videoThumbnail ? h("img", { class: "gy-notification-video", src: thumbUrl(n.videoThumbnail, 120), alt: "" }) : null)));
                return;
            }
            Object.keys(o).forEach(function(k) { walk(o[k]); });
        };
        walk(resp);
        replace(el, h("div", { class: "gy-notifications" }, h("h3", null, "Notifications"), rows.length ? h("ul", null, rows) : h("p", null, "No notifications yet.")));
    } catch (err) {
        replace(el, h("div", { class: "gy-notifications" }, "Notifications couldn't be loaded."));
    }
}
async function accountMenu(anchor) {
    const el = popup(anchor, h("div", { class: "gy-account" }, h("div", { class: "gy-addto-loading" }, "Loading...")), "gy-popup-account");
    let name = "", email = "", photo = STATE.user.avatar, channelUrl = "/feed/you";
    try {
        const resp = await api.post("account/account_menu", {});
        const find = function(o, key, out) {
            if (!o || typeof o !== "object") {
                return;
            }
            if (o[key]) {
                out.push(o[key]);
            }
            Object.keys(o).forEach(function(k) { find(o[k], key, out); });
        };
        const hdrs = [];
        find(resp, "activeAccountHeaderRenderer", hdrs);
        if (hdrs[0]) {
            name = text(hdrs[0].accountName);
            email = text(hdrs[0].email);
            photo = thumbUrl(hdrs[0].accountPhoto, 56) || photo;
            channelUrl = endpointUrl(hdrs[0].manageAccountTitle && hdrs[0].manageAccountTitle.runs && hdrs[0].manageAccountTitle.runs[0] && hdrs[0].manageAccountTitle.runs[0].navigationEndpoint) || channelUrl;
        }
        const items = [];
        find(resp, "compactLinkRenderer", items);
        const links = items.map(function(it) { return { text: text(it.title), href: endpointUrl(it.navigationEndpoint) || endpointUrl(it.serviceEndpoint) }; }).filter(function(l) { return l.href && !/signout|logout/i.test(l.href); });
        const mine = links.find(function(l) { return /Your channel|My channel/i.test(l.text); });
        if (mine) {
            channelUrl = mine.href;
        }
    } catch (err) {
        console.error("Gplex YouTube: account menu", err);
    }
    replace(el, h("div", { class: "gy-account" },
        h("div", { class: "gy-account-header" }, photo ? h("img", { src: photo, width: 56, height: 56, alt: "" }) : null, h("div", null, h("div", { class: "gy-account-name" }, name || "Your account"), h("div", { class: "gy-account-email" }, email))),
        menuItems([{ text: YEAR >= 2017 ? "My channel" : "My Channel", href: channelUrl, icon: "account" }, { text: YEAR >= 2017 ? "Creator Studio" : "Video Manager", href: "https://studio.youtube.com/", icon: "upload" }, { text: "YouTube settings", href: "https://www.youtube.com/account?gplex=off", icon: "settings" }, { text: "Gplex settings", href: "https://www.google.com/gplex" }, "-", { text: "Switch account", href: "https://accounts.google.com/AccountChooser?service=youtube&continue=" + encodeURIComponent(ORIGIN + "/") }, { text: "Sign out", href: "/logout" }])));
}
