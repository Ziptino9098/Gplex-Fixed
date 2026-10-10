// ---- comments: V3's thread with the period's rating row (2010-2012) or icons (2017+) ----

const LEGACY_COMMENTS = /AozoraComments|CosmicComments/;
function legacyComments() {
    return has("AozoraComments") || has("CosmicComments");
}
function polymerComments() {
    return FAMILY === "poly";
}
function commentsOnPage() {
    return $("#page.watch") || $("#page.all_comments");
}
// one pass over the comments V3 has drawn so far
function styleComments() {
    $$(".comment:not(.startube-comment)").forEach(function(c) {
        if (legacyComments()) {
            legacyComment(c);
        } else {
            polymerComment(c);
        }
    });
    if (polymerComments()) {
        sortButton();
        commentPlaceholder("Add a public comment");
        commentHeader();
    } else if (/^hh(E2015|2015|E2016|M2016|2016)$/.test(ERA.id)) {
        commentPlaceholder("Add a comment");
        commentHeader();
    }
}
// 2010-2012: thumbs count and "Show replies" in the comment's header
function legacyComment(c) {
    const header = $("header", c);
    if (!header) {
        return;
    }
    const row = fromHtml('<div class="startube-comment-data flex-bar">' + T.commentRating + "</div>");
    header.insertBefore(row, header.children[2] || null);
    c.classList.add("startube-comment");
    const likes = ($(".action_bar .count", c) || {}).textContent || "";
    $(".comment-rating .count", row).textContent = likes;
    $(".comment-rating .active-count", row).textContent = ($(".action_bar .count_active", c) || {}).textContent || "";
    row.classList.add(likes ? "has-likes" : "no-likes-by-default");
    if ($(".like.active", c)) {
        row.classList.add("comment-liked", "has-likes");
    }
    if ($(".heart.active", c)) {
        row.classList.add("comment-hearted");
    }
    const like = $(".like", c);
    if (like) {
        like.addEventListener("click", function() {
            const liked = row.classList.toggle("comment-liked");
            if (row.classList.contains("no-likes-by-default")) {
                row.classList.toggle("has-likes", liked);
            }
        });
    }
    const thread = c.parentNode && c.parentNode.parentNode && c.parentNode.parentNode.parentNode;
    const link = thread && $(".link_action", thread);
    if (c.parentNode.className !== "post") {
        c.classList.add("startube-reply");
    } else if (link) {
        $(".load-more-link .expand-text", row).textContent = ($(".link_action_text", thread) || {}).textContent || "";
        $(".load-more-link", row).addEventListener("click", function() {
            link.click();
            row.classList.toggle("comment-expanded");
        });
    } else {
        row.classList.add("no-replies");
        c.classList.add("no-replies");
    }
}
// 2017+: like and dislike as icons, the reply button first (2019+: last), hearts
function polymerComment(c) {
    if ($("svg", c)) {
        return;
    }
    const bar = $(".action_bar", c);
    const like = $(".action_bar .like", c);
    const dislike = $(".action_bar .dislike", c);
    const reply = $(".action_bar .reply-button", c);
    const poster = $(".reply_poster", c);
    const heart = $(".action_bar .heart", c);
    if (!bar || !like || !dislike) {
        return;
    }
    if (($(".count_active", c) || {}).textContent === "1") {
        bar.classList.add("no-likes");
    }
    const gen2 = /^poly20(19|22)/.test(ERA.id);
    (gen2 ? [like, dislike, heart, reply] : [reply, like, dislike, heart]).forEach(function(el) {
        if (el) {
            bar.appendChild(el);
        }
    });
    bar.classList.add(gen2 ? "gen2-comment" : "gen1-comment");
    if (poster) {
        bar.appendChild(poster);
    }
    const likeIcon = fromHtml('<div class="st-svg">' + T.commentLike + "</div>");
    const dislikeIcon = fromHtml('<div class="st-svg">' + T.commentDislike + "</div>");
    const likeBox = $(".sentiment.like", c);
    const dislikeBox = $(".sentiment.dislike", c);
    likeBox.classList.add("startube-has-icon", "yt-uix-tooltip");
    dislikeBox.classList.add("startube-has-icon", "yt-uix-tooltip");
    likeBox.insertBefore(likeIcon, likeBox.firstChild);
    dislikeBox.insertBefore(dislikeIcon, dislikeBox.firstChild);
    const tips = function() {
        likeBox.setAttribute("data-tooltip-text", $(".like.active", c) ? "Unlike" : "Like");
        dislikeBox.setAttribute("data-tooltip-text", $(".dislike.active", c) ? "Remove Dislike" : "Dislike");
    };
    tips();
    likeIcon.addEventListener("click", function() {
        const img = $(".like img", c);
        if (img) {
            img.click();
        }
        setTimeout(tips, 100);
    });
    dislikeIcon.addEventListener("click", function() {
        setTimeout(tips, 100);
    });
    c.classList.add("startube-comment");
    const thread = c.parentNode && c.parentNode.parentNode && c.parentNode.parentNode.parentNode;
    if (c.parentNode.className !== "post") {
        c.classList.add("startube-reply");
    } else if (thread && $(".link_action", thread)) {
        const label = $(".link_action_text", thread);
        if (ERA.id === "poly2022" && label && $("[lang='en']")) {
            label.textContent = label.textContent.indexOf("View all") > -1 ? label.textContent.split("View all ")[1] : "1 Reply";
        }
        if (gen2) {
            const loader = $(".loader", thread);
            if (loader && !loader.classList.contains("startube-has-icon")) {
                loader.insertBefore(fromHtml('<div class="st-svg">' + T.commentReplies + "</div>"), loader.firstChild);
                loader.classList.add("startube-has-icon");
            }
        }
    } else {
        likeIcon.classList.add("no-replies");
        c.classList.add("no-replies");
    }
}
// the sort button moves beside the count and gets its icon
function sortButton() {
    if (!commentsOnPage() || $(".widget_bounds .yt-spinner-message")) {
        return;
    }
    const existing = $("#st-comment-sort");
    if (existing) {
        text("span", "Sort by", existing);
        return;
    }
    when(".left-options > button", function(btn) {
        const home = $(".all-comments");
        if (!home || $("#st-comment-sort")) {
            return;
        }
        home.appendChild(btn);
        btn.id = "st-comment-sort";
        btn.classList.add("flex-bar");
        const span = $("span", btn);
        if (span) {
            span.textContent = "Sort by";
        }
        btn.insertBefore(fromHtml('<div class="st-svg">' + T.sortIcon + "</div>"), btn.firstChild);
    });
}
function commentPlaceholder(wording) {
    if (!commentsOnPage() || $(".widget_bounds .yt-spinner-message") || $(".share.focus_caller.startube")) {
        return;
    }
    when(".focus_caller", function() {
        const box = $(".share.focus_caller");
        if (box && commentsOnPage()) {
            box.textContent = wording;
            box.classList.add("startube");
        }
    });
}
// "Comments • N" and the first comment as the 2022 teaser
function commentHeader() {
    if (!commentsOnPage() || $(".distiller_yt_headline.startube")) {
        return;
    }
    when(".distiller_yt_headline", function(h) {
        if (h.classList.contains("startube")) {
            return;
        }
        const count = (($("span:nth-child(2)", h) || {}).textContent || "").split("(")[1];
        video.commentCount = count ? count.split(")")[0] : "";
        setHtml(h, T.commentHeader);
        $(".comment-count", h).textContent = video.commentCount;
        h.classList.add("startube");
        const first = $(".comment");
        if (first) {
            video.commentTeaserPfp = ($(".distiller_yt-thread_avatar", first) || {}).src || "";
            video.commentTeaserText = ($(".text-content span", first) || {}).textContent || "";
        }
        applyTeaser();
    });
}
// V3 adds comments as they load, are sorted or expanded: style the new ones each time
function watchComments() {
    if (!legacyComments() && !polymerComments() && !/^hh(E2015|2015|E2016|M2016|2016)$/.test(ERA.id)) {
        return;
    }
    when("#watch-discussion .distiller_yt_instance", function() {
        const later = function() {
            if ($(".distiller_content")) {
                styleComments();
            }
        };
        [100, 1000, 2500].forEach(function(ms) {
            setTimeout(later, ms);
        });
        const discussion = $("#watch-discussion");
        if (discussion && !discussion.stWatched) {
            discussion.stWatched = true;
            let pending = 0;
            new MutationObserver(function() {
                if (!pending) {
                    pending = setTimeout(function() {
                        pending = 0;
                        later();
                    }, 300);
                }
            }).observe(discussion, { childList: true, subtree: true });
        }
    });
}
