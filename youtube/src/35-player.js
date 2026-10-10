// ---- the player: V3's 2014 HTML5 player chrome with the period's icons and settings menu ----

const MODERN_PLAYER = /^modernV/;
function playerIcon(button, name, id) {
    if (!button || button.classList.contains("startube-has-icon")) {
        return;
    }
    const v1 = ERA.player === "modernV1";
    const tpl = v1 && T.playerIcons[name + "V1"] ? T.playerIcons[name + "V1"] : T.playerIcons[name];
    const icon = fromHtml('<div class="startube-player-svg">' + tpl + "</div>");
    button.classList.add("startube-has-icon", "startube-player-icon");
    if (id) {
        button.id = id;
    }
    button.insertBefore(icon, button.children[name === "captions" || name === "settings" ? 1 : 0] || null);
}
// 2015+: the player's buttons get the icons of the time (the play/pause one animates between
// its two shapes as the player's state changes)
function modernPlayer() {
    if (!MODERN_PLAYER.test(ERA.player) || !($("#page.watch") || $("#page.channel"))) {
        return;
    }
    when(".html5-player-chrome", function() {
        const player = $("#movie_player");
        if (!player) {
            return;
        }
        player.classList.add("autohide-controls");
        const play = $(".ytp-button-play") || $(".ytp-button-pause") || $(".ytp-button-stop");
        if (play && !play.classList.contains("startube-has-icon")) {
            playerIcon(play, "playPause", "startube-playpause");
            let state = "paused";
            new MutationObserver(function() {
                if ($(".playing-mode") && state === "paused") {
                    $("#st-playing").beginElement();
                    state = "playing";
                } else if ($(".paused-mode") && state === "playing") {
                    $("#st-pausing").beginElement();
                    state = "paused";
                }
            }).observe(player, { attributes: true });
        }
        playerIcon($(".ytp-button-volume"), "volume", "startube-volume");
        playerIcon($("#subtitles_button"), "captions");
        playerIcon($("#settings_button"), "settings");
        playerIcon($(".ytp-size-toggle-large") || $(".ytp-size-toggle-small"), "size", "startube-theater");
        playerIcon($(".ytp-button-fullscreen-enter") || $(".ytp-button-fullscreen-exit"), "fullscreen", "startube-fullscreen");
        const later = $(".ytp-button-watch-later");
        const actions = $(".ytp-action-buttons");
        if (later && actions && !$(".ytp-action-buttons .ytp-button-watch-later")) {
            actions.insertBefore(later, actions.children[2] || null);
        }
        playerIcon(later, "watchLater");
        playerIcon($(".ytp-button-share"), "share");
        playerIcon($(".ytp-button-prev"), "prev");
        playerIcon($(".ytp-button-next"), "next");
    });
    when(".ytp-menu-container .ytp-menu", playerMenu);
    if (ERA.spinner === "material") {
        setTimeout(materialSpinner, 100);
    }
}
// the settings menu as a stack of pages (Autoplay, Annotations, Speed, Subtitles, Audio track,
// Quality), V3's own rows moved into them
function playerMenu() {
    const container = $(".ytp-menu-container");
    if (!container || $("#st-pl-settings")) {
        return;
    }
    const menu = fromHtml("<div>" + T.playerIcons.menu + "</div>");
    menu.id = "st-pl-settings";
    menu.className = "st-plm-container st-show-svgs multistate-handler";
    menu.setAttribute("state", "main");
    container.appendChild(menu);
    movePlayerMenuItems();
    setTimeout(movePlayerMenuItems, 1500);
    setTimeout(movePlayerMenuItems, 3000);
    const fit = function(page) {
        const content = $("#st-" + page + "-page .st-plm-content");
        let h = content ? content.offsetHeight : 0;
        if (page !== "main") {
            h += $("[data-player-size='fullscreen']") ? 49 : 33;
        }
        menu.style.height = h + "px";
        menu.style.setProperty("--page-height", h + "px");
    };
    menu.style.height = $("#st-main-page").offsetHeight + "px";
    $$(".st-pl-trigger", menu).forEach(function(t) {
        t.addEventListener("click", function() {
            const page = t.getAttribute("trigger");
            menu.setAttribute("state", page);
            setTimeout(function() {
                fit(page);
            }, 10);
        });
    });
    $$(".st-pl-toggle", menu).forEach(function(t) {
        const kind = t.getAttribute("toggle");
        if (kind === "autoplay") {
            t.addEventListener("click", function(e) {
                if (e.target.classList.contains("st-valid-tog")) {
                    t.setAttribute("state", body().getAttribute("autoplay") === "true" ? "false" : "true");
                    toggleAutoplay();
                }
            });
            return;
        }
        // annotations and the miniplayer are V3's segmented switches (rows 2 and 3)
        const row = kind === "miniplayer" ? 3 : 2;
        when(".ytp-menu .ytp-menu-row:nth-child(" + row + ") .ytp-segmented-control div", function() {
            const on = $(".ytp-menu .ytp-menu-row:nth-child(" + row + ") .ytp-segmented-control div");
            const off = $(".ytp-menu .ytp-menu-row:nth-child(" + row + ") .ytp-segmented-control div:last-child");
            const sync = function() {
                const checked = on.getAttribute("aria-checked") === "true";
                t.setAttribute("state", checked ? "true" : "false");
                attr(body(), kind, checked ? "true" : "false");
            };
            sync();
            t.addEventListener("click", function(e) {
                if (e.target.classList.contains("st-valid-tog")) {
                    (on.getAttribute("aria-checked") === "true" ? off : on).click();
                    setTimeout(sync, 10);
                }
            });
        });
    });
    setTimeout(function() {
        new MutationObserver(function(list) {
            if (list.some(function(m) { return m.removedNodes.length; })) {
                setTimeout(movePlayerMenuItems, 200);
                setTimeout(movePlayerMenuItems, 2000);
            }
        }).observe($("#st-main-page"), { attributes: true, childList: true, subtree: true });
    }, 1000);
    const settings = $("#settings_button");
    if (settings) {
        settings.addEventListener("click", function() {
            menu.setAttribute("state", "main");
            setTimeout(function() {
                fit("main");
            }, 10);
        });
    }
}
// V3's menu rows: 1 autoplay, 2 annotations, 3 miniplayer, 4 speed, then subtitles, audio track
// and quality as the video has them
function movePlayerMenuItems() {
    const row = function(n) {
        return $(".ytp-menu .ytp-menu-row:nth-child(" + n + ")");
    };
    if (!row(4)) {
        return;
    }
    const subtitles = !!row(6);
    const audio = !!row(7);
    attr(body(), "has-at", audio);
    $$("#st-pl-settings .ytp-menu-row").forEach(function(r) {
        r.remove();
    });
    const pages = { speed: 4, subtitles: subtitles ? 5 : 0, "audio-track": audio ? 6 : 0, quality: audio ? 7 : subtitles ? 6 : 5 };
    // the drop-downs first (by their original positions), then the rows themselves (each move
    // shifts the rest up, so row 4 is taken repeatedly)
    Object.keys(pages).forEach(function(p) {
        const dd = pages[p] && $(".ytp-menu .ytp-menu-row:nth-child(" + pages[p] + ") .ytp-drop-down-menu");
        if (dd) {
            $("#st-" + p + "-page .st-plm-content").appendChild(dd);
        }
    });
    const items = $$("#st-main-page .st-pl-menuitem");
    move(row(4), items[3]);
    if (subtitles) {
        move(row(4), items[4]);
    } else {
        items[4].classList.add("none");
    }
    if (audio) {
        move(row(4), items[5]);
    } else {
        items[5].classList.add("none");
    }
    move(row(4), items[6]);
    if (subtitles) {
        move($(".st-pl-subtitles .ytp-menu-cell:last-child"), $("#st-subtitles-page .st-plm-header"));
    }
    if (/[?&]list=/.test(location.search)) {
        items[0].classList.add("none");
    }
}
// 2018+: the Material loading spinner in place of the old one
function materialSpinner() {
    const player = $("#movie_player");
    if (!player || $("#st-material-spinner")) {
        return;
    }
    const s = fromHtml("<div>" + T.spinner + "</div>");
    s.id = "st-material-spinner";
    extraStyle("spinner", s);
    player.insertBefore(s, player.firstChild);
}
