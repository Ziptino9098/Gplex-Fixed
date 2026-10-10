// ---- Gplex YouTube: the player ----
// The video plays in YouTube's embedded player, same-origin, in an iframe without its own controls.
// Gplex drives it through the player's message protocol (the one the IFrame Player API uses):
// the frame is told we are "listening", it sends "infoDelivery" messages with its state, and it
// takes "command" messages (playVideo, seekTo, setVolume, ...). Gplex draws the control bar of the
// era over it. A video that may not be embedded plays in YouTube's own watch page inside the frame,
// with YouTube's controls.
const QUALITY_NAMES = { highres: "4320p", hd2880: "2880p", hd2160: "2160p", hd1440: "1440p", hd1080: "1080p", hd720: "720p", large: "480p", medium: "360p", small: "240p", tiny: "144p", auto: "Auto" };
const PLAYING = 1, PAUSED = 2, BUFFERING = 3, ENDED = 0, CUED = 5;
function createPlayer(watch, opts) {
    const o = opts || {};
    const st = { state: -1, time: 0, duration: watch.seconds || 0, loaded: 0, volume: Number(pref("volume", "100")) || 0, muted: pref("volume", "") === "muted", quality: "auto", qualities: [], rate: 1, rates: [1], ready: false, updated: 0, native: !watch.embeddable || !watch.playable, captions: "", ended: false };
    const listeners = {};
    const on = function(ev, fn) {
        (listeners[ev] = listeners[ev] || []).push(fn);
    };
    const emit = function(ev, arg) {
        (listeners[ev] || []).forEach(function(fn) { fn(arg); });
    };
    // ---- the frame
    const params = { enablejsapi: 1, autoplay: 1, controls: 0, rel: 0, iv_load_policy: 3, modestbranding: 1, playsinline: 1, fs: 0, disablekb: 1, origin: ORIGIN, widget_referrer: ORIGIN + location.pathname + location.search };
    if (watch.start) {
        params.start = watch.start;
    }
    const query = Object.keys(params).map(function(k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
    const frame = h("iframe", { id: "gy-embed", class: "gy-embed", "data-gplex": "1", src: st.native ? "/watch?v=" + watch.id + "&gplex=off" + (watch.start ? "&t=" + watch.start : "") : "/embed/" + watch.id + "?" + query, allow: "autoplay; fullscreen; encrypted-media; picture-in-picture", allowfullscreen: true, frameborder: "0", title: watch.title });
    const cmd = function(func) {
        if (!frame.contentWindow) {
            return;
        }
        frame.contentWindow.postMessage(JSON.stringify({ event: "command", func: func, args: Array.prototype.slice.call(arguments, 1), id: 1, channel: "widget" }), ORIGIN);
    };
    window.addEventListener("message", function(e) {
        if (e.source !== frame.contentWindow || e.origin !== ORIGIN) {
            return;
        }
        let m;
        try {
            m = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        } catch (err) {
            return;
        }
        if (!m || !m.event) {
            return;
        }
        if (m.event === "onReady") {
            st.ready = true;
            ["onStateChange", "onPlaybackQualityChange", "onPlaybackRateChange", "onError"].forEach(function(ev) {
                cmd("addEventListener", ev);
            });
            cmd(st.muted ? "mute" : "unMute");
            cmd("setVolume", st.volume);
            const q = pref("quality", "auto");
            if (q !== "auto") {
                cmd("setPlaybackQualityRange", q, q);
            }
            const r = Number(pref("rate", "1")) || 1;
            if (r !== 1) {
                cmd("setPlaybackRate", r);
            }
            emit("ready");
        } else if (m.event === "infoDelivery" || m.event === "initialDelivery") {
            takeInfo(m.info || {});
        } else if (m.event === "onStateChange") {
            setState(Number(m.info));
        } else if (m.event === "onError") {
            st.error = m.info;
            emit("error", m.info);
        }
    });
    frame.addEventListener("load", function() {
        if (st.native) {
            nativeFrameStyle(frame);
            return;
        }
        frame.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), ORIGIN);
    });
    const takeInfo = function(info) {
        if (info.playerState !== undefined) {
            setState(Number(info.playerState));
        }
        if (info.currentTime !== undefined) {
            st.time = Number(info.currentTime) || 0;
            st.updated = performance.now();
        }
        if (info.duration) {
            st.duration = Number(info.duration) || st.duration;
        }
        if (info.videoLoadedFraction !== undefined) {
            st.loaded = Number(info.videoLoadedFraction) || 0;
        }
        if (info.volume !== undefined) {
            st.volume = Number(info.volume);
        }
        if (info.muted !== undefined) {
            st.muted = !!info.muted;
        }
        if (info.playbackQuality) {
            st.quality = info.playbackQuality;
        }
        if (info.availableQualityLevels) {
            st.qualities = info.availableQualityLevels;
        }
        if (info.playbackRate) {
            st.rate = Number(info.playbackRate);
        }
        if (info.availablePlaybackRates) {
            st.rates = info.availablePlaybackRates;
        }
        emit("info", st);
    };
    const setState = function(s) {
        if (s === st.state) {
            return;
        }
        st.state = s;
        if (s === ENDED) {
            st.ended = true;
            emit("ended");
        }
        emit("state", s);
    };
    // the time now, between two deliveries
    const now = function() {
        if (st.state !== PLAYING || !st.updated) {
            return st.time;
        }
        return Math.min(st.duration || Infinity, st.time + (performance.now() - st.updated) / 1000 * st.rate);
    };
    const api = {
        state: st,
        on: on,
        now: now,
        play: function() { cmd("playVideo"); },
        pause: function() { cmd("pauseVideo"); },
        toggle: function() { cmd(st.state === PLAYING || st.state === BUFFERING ? "pauseVideo" : "playVideo"); },
        seek: function(t) {
            st.time = Math.max(0, Math.min(st.duration || t, t));
            st.updated = performance.now();
            cmd("seekTo", st.time, true);
            emit("info", st);
        },
        seekBy: function(d) { api.seek(now() + d); },
        volume: function(v) {
            st.volume = Math.max(0, Math.min(100, Math.round(v)));
            st.muted = false;
            cmd("unMute");
            cmd("setVolume", st.volume);
            setPref("volume", st.volume);
            emit("info", st);
        },
        mute: function(m) {
            st.muted = m === undefined ? !st.muted : !!m;
            cmd(st.muted ? "mute" : "unMute");
            setPref("volume", st.muted ? "muted" : st.volume);
            emit("info", st);
        },
        quality: function(q) {
            st.quality = q;
            setPref("quality", q);
            if (q === "auto") {
                cmd("setPlaybackQualityRange", "tiny", "highres");
            } else {
                cmd("setPlaybackQualityRange", q, q);
                cmd("setPlaybackQuality", q);
            }
            emit("info", st);
        },
        rate: function(r) {
            st.rate = r;
            setPref("rate", r);
            cmd("setPlaybackRate", r);
            emit("info", st);
        },
        captions: function(code) {
            st.captions = code || "";
            if (code) {
                cmd("loadModule", "captions");
                cmd("setOption", "captions", "track", { languageCode: code });
            } else {
                cmd("unloadModule", "captions");
            }
            emit("info", st);
        },
        frame: frame
    };
    api.el = playerBox(watch, api, o);
    return api;
}
// YouTube's own watch page inside the frame (a video that may not be embedded): only its player shows.
function nativeFrameStyle(frame) {
    try {
        const doc = frame.contentDocument;
        if (!doc || !doc.head) {
            return;
        }
        doc.head.appendChild(h("style", { "data-gplex": "1" }, "html,body{overflow:hidden!important;background:#000!important}ytd-masthead,#masthead-container,tp-yt-app-drawer,ytd-mini-guide-renderer,#secondary,#below,#chat,ytd-watch-flexy[fullscreen] #secondary,#columns>*:not(#primary){display:none!important}#movie_player,ytd-player,#player-container,#player-container-inner,#player-container-outer,#player,#full-bleed-container,#player-full-bleed-container{position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;max-height:none!important;margin:0!important;padding:0!important;z-index:2147483000!important}"));
    } catch (e) {}
}
// ---- the player box: the frame, the control bar, the overlays
function playerBox(watch, api, o) {
    const st = api.state;
    const box = h("div", { class: "gy-player gy-player-" + ERA + (st.native ? " gy-player-native" : ""), tabindex: "0" }, api.frame);
    if (st.native) {
        if (!watch.playable) {
            box.appendChild(h("div", { class: "gy-player-unavailable" }, h("p", null, watch.unavailable || "This video is unavailable."), h("a", { href: "/watch?v=" + watch.id + "&gplex=off", class: "yt-uix-button yt-uix-button-size-default yt-uix-button-default" }, h("span", { class: "yt-uix-button-content" }, "Open in YouTube"))));
        }
        return box;
    }
    // the control bar
    const playBtn = cbButton("play", "Play", function() { api.toggle(); });
    const nextBtn = o.next ? cbButton("next", "Next", function() { location.href = o.next.url; }) : null;
    const muteBtn = cbButton("volume", "Mute", function() { api.mute(); });
    const volume = h("div", { class: "gy-cb-volume" }, h("div", { class: "gy-cb-volume-track" }, h("div", { class: "gy-cb-volume-level" }), h("div", { class: "gy-cb-volume-handle" })));
    const timeEl = h("div", { class: "gy-cb-time" }, h("span", { class: "gy-cb-time-current" }, fmtTime(watch.start || 0)), h("span", { class: "gy-cb-time-sep" }, " / "), h("span", { class: "gy-cb-time-duration" }, fmtTime(watch.seconds || 0)));
    const ccBtn = watch.captions.length ? cbButton("captions", "Subtitles/CC", function(e) { captionsMenu(e.currentTarget); }) : null;
    const gearBtn = cbButton("settings", "Settings", function(e) { settingsPanel(e.currentTarget); });
    const sizeBtn = o.theater ? cbButton("theater", "Theater mode", function() { o.theater(); }) : null;
    const fsBtn = cbButton("fullscreen", "Full screen", function() { toggleFullscreen(); });
    const loaded = h("div", { class: "gy-cb-loaded" }), played = h("div", { class: "gy-cb-played" }), handle = h("div", { class: "gy-cb-handle" }), hover = h("div", { class: "gy-cb-hover" }), tip = h("div", { class: "gy-cb-tip" }, "0:00");
    const progress = h("div", { class: "gy-cb-progress", role: "slider", "aria-label": "Seek slider" }, h("div", { class: "gy-cb-track" }, loaded, hover, played, handle), tip);
    const bar = h("div", { class: "gy-cb" },
        progress,
        h("div", { class: "gy-cb-row" },
            h("div", { class: "gy-cb-left" }, playBtn, nextBtn, h("div", { class: "gy-cb-volume-area" }, muteBtn, volume), timeEl),
            h("div", { class: "gy-cb-right" }, ccBtn, gearBtn, sizeBtn, fsBtn)));
    const bigPlay = h("button", { class: "gy-bigplay", type: "button", "aria-label": "Play", onclick: function() { api.play(); } }, icon("play"));
    const shade = h("div", { class: "gy-player-shade" }, bigPlay);
    box.appendChild(shade);
    box.appendChild(bar);
    // ---- what the bar shows
    const draw = function() {
        const t = api.now(), d = st.duration || 0;
        const pct = d ? Math.min(100, t / d * 100) : 0;
        played.style.width = pct + "%";
        handle.style.left = pct + "%";
        loaded.style.width = Math.min(100, st.loaded * 100) + "%";
        timeEl.firstChild.textContent = fmtTime(t);
        timeEl.lastChild.textContent = fmtTime(d);
        const playing = st.state === PLAYING || st.state === BUFFERING;
        replace(playBtn, icon(playing ? "pause" : "play"));
        playBtn.title = playing ? "Pause" : "Play";
        box.classList.toggle("gy-playing", playing);
        box.classList.toggle("gy-paused", !playing && st.state !== -1 && st.state !== CUED);
        box.classList.toggle("gy-ended", st.state === ENDED);
        box.classList.toggle("gy-unstarted", st.state === -1 || st.state === CUED);
        const vol = st.muted ? 0 : st.volume;
        volume.firstChild.firstChild.style.width = vol + "%";
        volume.firstChild.lastChild.style.left = vol + "%";
        replace(muteBtn, icon(st.muted || vol === 0 ? "muted" : vol < 50 ? "volumeLow" : "volume"));
        muteBtn.title = st.muted ? "Unmute" : "Mute";
        if (ccBtn) {
            ccBtn.classList.toggle("gy-cb-on", !!st.captions);
        }
    };
    api.on("info", draw);
    api.on("state", draw);
    let raf = 0;
    const tick = function() {
        if (st.state === PLAYING) {
            draw();
        }
        raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // ---- seeking: click and drag on the progress bar, with the time under the pointer
    const timeAt = function(e) {
        const r = progress.firstChild.getBoundingClientRect();
        return Math.max(0, Math.min(1, (e.clientX - r.left) / (r.width || 1))) * (st.duration || 0);
    };
    let dragging = false;
    progress.addEventListener("mousemove", function(e) {
        const t = timeAt(e);
        tip.textContent = fmtTime(t);
        tip.style.left = (e.clientX - progress.getBoundingClientRect().left) + "px";
        hover.style.width = (st.duration ? t / st.duration * 100 : 0) + "%";
        if (dragging) {
            played.style.width = hover.style.width;
            handle.style.left = hover.style.width;
            timeEl.firstChild.textContent = fmtTime(t);
        }
    });
    progress.addEventListener("mousedown", function(e) {
        if (e.button !== 0) {
            return;
        }
        dragging = true;
        box.classList.add("gy-scrubbing");
        e.preventDefault();
        const up = function(ev) {
            dragging = false;
            box.classList.remove("gy-scrubbing");
            api.seek(timeAt(ev));
            document.removeEventListener("mouseup", up);
        };
        document.addEventListener("mouseup", up);
    });
    // ---- the volume slider
    const volAt = function(e) {
        const r = volume.firstChild.getBoundingClientRect();
        return Math.max(0, Math.min(1, (e.clientX - r.left) / (r.width || 1))) * 100;
    };
    volume.addEventListener("mousedown", function(e) {
        e.preventDefault();
        api.volume(volAt(e));
        const move = function(ev) { api.volume(volAt(ev)); };
        const up = function() {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
        };
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
    });
    // ---- the bar hides while the video plays and the mouse rests (the overlay eras)
    let hideTimer = 0;
    const wake = function() {
        box.classList.remove("gy-idle");
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function() {
            if (st.state === PLAYING && !openMenu) {
                box.classList.add("gy-idle");
            }
        }, 2500);
    };
    box.addEventListener("mousemove", wake);
    box.addEventListener("mouseleave", function() {
        if (st.state === PLAYING) {
            box.classList.add("gy-idle");
        }
    });
    // the shade over the picture: a click plays or pauses (the frame itself cannot be clicked through)
    shade.addEventListener("click", function(e) {
        if (e.target === shade) {
            api.toggle();
        }
    });
    shade.addEventListener("dblclick", function() { toggleFullscreen(); });
    // ---- menus
    function captionsMenu(anchor) {
        const items = [{ text: "Off", onclick: function() { api.captions(""); }, on: !st.captions }].concat(watch.captions.map(function(c) {
            return { text: c.name + (c.auto ? " (auto-generated)" : ""), onclick: function() { api.captions(c.code); }, on: st.captions === c.code };
        }));
        playerMenu(anchor, "Subtitles/CC", items);
    }
    function settingsPanel(anchor) {
        const qualities = (st.qualities.length ? st.qualities : ["auto"]).filter(function(q) { return q !== "auto"; });
        const items = [
            { text: "Quality", value: QUALITY_NAMES[st.quality] || st.quality, sub: [{ text: "Auto", onclick: function() { api.quality("auto"); }, on: pref("quality", "auto") === "auto" }].concat(qualities.map(function(q) { return { text: QUALITY_NAMES[q] || q, onclick: function() { api.quality(q); }, on: pref("quality", "auto") === q }; })) },
            { text: "Speed", value: st.rate === 1 ? "Normal" : String(st.rate), sub: (st.rates.length > 1 ? st.rates : [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]).map(function(r) { return { text: r === 1 ? "Normal" : String(r), onclick: function() { api.rate(r); }, on: st.rate === r }; }) }
        ];
        playerMenu(anchor, "", items);
    }
    function playerMenu(anchor, title, items) {
        const list = h("ul", { class: "gy-pmenu" }, title ? h("li", { class: "gy-pmenu-title" }, title) : null, items.map(function(it) {
            if (it.sub) {
                return h("li", { class: "gy-pmenu-item gy-pmenu-more", onclick: function(e) { e.stopPropagation(); playerMenu(anchor, it.text, it.sub); } }, h("span", { class: "gy-pmenu-label" }, it.text), h("span", { class: "gy-pmenu-value" }, it.value, icon("next")));
            }
            return h("li", { class: "gy-pmenu-item" + (it.on ? " gy-pmenu-on" : ""), onclick: function() { closeMenu(); it.onclick(); } }, h("span", { class: "gy-pmenu-check" }, icon("check")), h("span", { class: "gy-pmenu-label" }, it.text));
        }));
        closeMenu();
        const el = h("div", { class: "gy-popup gy-popup-player" }, list);
        box.appendChild(el);
        const r = anchor.getBoundingClientRect(), b = box.getBoundingClientRect();
        el.style.right = Math.max(8, b.right - r.right) + "px";
        el.style.bottom = (b.bottom - r.top + 6) + "px";
        openMenu = el;
        setTimeout(function() { document.addEventListener("click", closeMenuOnOutside); }, 0);
    }
    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (box.requestFullscreen) {
            box.requestFullscreen();
        }
    }
    document.addEventListener("fullscreenchange", function() {
        const fs = document.fullscreenElement === box;
        box.classList.toggle("gy-fullscreen", fs);
        replace(fsBtn, icon(fs ? "unfullscreen" : "fullscreen"));
    });
    // ---- keys, as YouTube's player had them
    document.addEventListener("keydown", function(e) {
        const tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || e.target.isContentEditable || e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }
        const k = e.key;
        let handled = true;
        if (k === " " || k === "k") {
            api.toggle();
        } else if (k === "ArrowLeft") {
            api.seekBy(-5);
        } else if (k === "ArrowRight") {
            api.seekBy(5);
        } else if (k === "j") {
            api.seekBy(-10);
        } else if (k === "l") {
            api.seekBy(10);
        } else if (k === "ArrowUp") {
            api.volume(st.volume + 5);
        } else if (k === "ArrowDown") {
            api.volume(st.volume - 5);
        } else if (k === "m") {
            api.mute();
        } else if (k === "f") {
            toggleFullscreen();
        } else if (k === "t" && o.theater) {
            o.theater();
        } else if (k === "c" && watch.captions.length) {
            api.captions(st.captions ? "" : watch.captions[0].code);
        } else if (/^[0-9]$/.test(k)) {
            api.seek(st.duration * Number(k) / 10);
        } else if (k === "Home") {
            api.seek(0);
        } else if (k === "End") {
            api.seek(st.duration);
        } else if (k === ">" || k === "<") {
            const rates = st.rates.length > 1 ? st.rates : [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
            const i = Math.max(0, Math.min(rates.length - 1, rates.indexOf(st.rate) + (k === ">" ? 1 : -1)));
            api.rate(rates[i]);
        } else {
            handled = false;
        }
        if (handled) {
            e.preventDefault();
            wake();
        }
    });
    draw();
    return box;
}
function cbButton(name, title, onclick) {
    return h("button", { class: "gy-cb-btn gy-cb-" + name, type: "button", title: title, "aria-label": title, onclick: onclick }, icon(name));
}
// "Up next" with its countdown (2015 and later), or straight on to the next video of a playlist.
function autoplayNext(api, next, box, opts) {
    const o = opts || {};
    if (!next) {
        return;
    }
    api.on("ended", function() {
        if (o.playlist || YEAR < 2015 || pref("autoplay", "true") === "false") {
            if (o.playlist) {
                location.href = next.url;
            }
            return;
        }
        let left = next.countdown || 5;
        const num = h("span", { class: "gy-upnext-count" }, String(left));
        const panel = h("div", { class: "gy-upnext" },
            h("div", { class: "gy-upnext-label" }, "Up next"),
            h("a", { href: next.url, class: "gy-upnext-video" }, h("img", { src: next.thumb, alt: "" }), h("span", { class: "gy-upnext-title" }, next.title), next.channel ? h("span", { class: "gy-upnext-by" }, next.channel.name) : null),
            h("div", { class: "gy-upnext-timer" }, "Playing in ", num, " seconds"),
            h("div", { class: "gy-upnext-actions" }, button({ text: "Cancel", onclick: function() { clearInterval(timer); panel.remove(); } }), button({ text: "Play now", style: "primary", onclick: function() { location.href = next.url; } })));
        box.appendChild(panel);
        const timer = setInterval(function() {
            left--;
            num.textContent = String(left);
            if (left <= 0) {
                clearInterval(timer);
                location.href = next.url;
            }
        }, 1000);
    });
}
