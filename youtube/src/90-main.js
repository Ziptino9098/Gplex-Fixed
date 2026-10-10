// ---- boot: V3's settings, the stylesheet, the page passes on V3's navigation events ----

// the era's stylesheet: the chunks whose era sets hold it, in order, after the pictures
function styleSheet() {
    const root = ":root{" + Object.keys(ST_PICTURES).map(function(k) {
        return k + ":url(" + ST_PICTURES[k] + ")";
    }).join(";") + "}";
    return root + "\n" + ST_CSS.filter(function(chunk) {
        return chunk.eras.indexOf(ERA.id) > -1;
    }).map(function(chunk) {
        return chunk.css;
    }).join("\n");
}
// before <head>, as StarTube placed it: V3's own sheets come later and win equal-specificity ties
function addStyleSheet() {
    if ($("#startube-style")) {
        return;
    }
    const box = document.createElement("div");
    box.id = "startube-style";
    const style = document.createElement("style");
    style.textContent = styleSheet();
    box.appendChild(style);
    html.insertBefore(box, html.firstChild);
}
// V3 isn't drawing the page: a note on YouTube's own page, once per session
function needV3() {
    try {
        if (sessionStorage.getItem("ugf_st_nov3")) {
            return;
        }
    } catch (e) {}
    const note = fromHtml('<div id="st-need-v3" style="position:fixed;left:24px;bottom:24px;z-index:9999;width:360px;padding:16px;border-radius:12px;background:#fff;color:#0f0f0f;font:14px Roboto,Arial,sans-serif;box-shadow:0 0 24px 12px rgba(0,0,0,.15)">' +
        '<div style="font-size:18px;font-weight:bold;margin-bottom:8px">Gplex Extended for YouTube needs V3</div>' +
        '<div>The YouTube part of Gplex works on top of the V3 extension (Vorapis 2013), which draws YouTube as it was in 2013. Install V3, then reload.</div>' +
        '<div style="margin-top:12px"><a href="https://vorapis.pages.dev/#/home/download" target="_blank" style="color:#065fd4;font-weight:bold">Get V3</a>' +
        '<a id="st-need-v3-close" href="#" style="float:right;color:#606060">Not now</a></div></div>');
    document.body.appendChild(note);
    $("#st-need-v3-close", note).addEventListener("click", function(e) {
        e.preventDefault();
        note.remove();
        try {
            sessionStorage.setItem("ugf_st_nov3", "1");
        } catch (err) {}
    });
}

let lastPass = 0;
// everything that depends on the page V3 just drew (or redrew)
function pagePass(fresh) {
    setEraAttributes();
    const kind = setPageAttributes();
    readVisitor();
    menus();
    space();
    if (fresh) {
        closeMenus();
        attr(html, "comment-panel-open", $("[comment-panel-open]") ? "false" : false);
    }
    footerYear();
    masthead();
    guide();
    stargazerTab(kind);
    if (kind === "watch") {
        watchPage(fresh);
        watchComments();
    } else if (kind === "comments") {
        watchComments();
    } else if (kind === "channel") {
        channelPage(fresh);
    } else if (kind === "playlist") {
        playlistPage(fresh);
    } else if (kind === "search") {
        searchPage();
    } else {
        feedAsHome();
        homePage(kind);
    }
    if (kind === "channel") {
        modernPlayer();
    }
    placeGuide();
    playerColumnWidth();
    mixThumbnails();
    lastPass = Date.now();
}
function onResize() {
    placeGuide();
    playerColumnWidth();
    playerWidth();
    placeFloaters();
}
function start() {
    if (applyV3Settings(ERA) && reloadOnce()) {
        return;
    }
    if (homeRedirect()) {
        return;
    }
    addStyleSheet();
    document.addEventListener("V3_NAVITRONIC_STARTED", function() {
        closeMenus();
        closeFloaters();
    });
    // V3 rewrites <html>'s attributes mid-load: ours go back on
    document.addEventListener("V3_SERVERCONTRACT_FLUSH_DOCEL_ATTRIB", function() {
        pagePass(false);
    });
    document.addEventListener("V3_NAVITRONIC_FINISHED", function() {
        pagePass(true);
        [500, 1500, 3000].forEach(function(ms) {
            setTimeout(placeGuide, ms);
        });
    });
    window.addEventListener("resize", onResize);
    const ready = function() {
        pagePass(true);
        [1000, 2000, 4000].forEach(function(ms) {
            setTimeout(function() {
                if (Date.now() - lastPass > 900) {
                    pagePass(false);
                }
            }, ms);
        });
        [500, 2000, 4000].forEach(function(ms) {
            setTimeout(playerColumnWidth, ms);
        });
    };
    if ($("body .spitfire-body-container")) {
        ready();
    } else {
        when("body .spitfire-body-container", ready, 20000);
        setTimeout(function() {
            if (!$("body .spitfire-body-container") && $("ytd-app")) {
                needV3();
            }
        }, 4000);
    }
}
start();
