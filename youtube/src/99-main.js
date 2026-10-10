// ---- Gplex YouTube: start ----
// YouTube's <head> goes, but for the character set and the viewport; Gplex's stylesheet, icon and
// font come in.
function prepareHead() {
    const head = document.head;
    const root = document.documentElement;
    Array.from(root.attributes).forEach(function(a) {
        if (a.name !== "lang" && a.name !== "dir") {
            root.removeAttribute(a.name);
        }
    });
    // (YouTube's markup may carry a <title> in the body too; the document's title must be head's)
    document.querySelectorAll("title").forEach(function(el) {
        el.remove();
    });
    Array.from(head.children).forEach(function(el) {
        if (el.hasAttribute("data-gplex")) {
            return;
        }
        if (el.nodeName === "META" && (el.hasAttribute("charset") || el.getAttribute("name") === "viewport")) {
            return;
        }
        el.remove();
    });
    const css = typeof UGF_YT_CSS === "object" ? UGF_YT_CSS : {};
    const assets = typeof UGF_YT_ASSETS === "object" ? UGF_YT_ASSETS : {};
    const sheet = [css.base || "", IS.hh ? css.hitchhiker || "" : "", css[FAMILY] || "", css["era" + ERA] || ""].join("\n");
    head.appendChild(h("style", { "data-gplex": "1", id: "gy-style" }, sheet));
    if (IS.poly || YEAR >= 2016) {
        head.appendChild(h("link", { "data-gplex": "1", rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" }));
    }
    const favicon = assets[YEAR >= 2017 ? "favicon2017" : "favicon2013"];
    if (favicon) {
        head.appendChild(h("link", { "data-gplex": "1", rel: "icon", href: favicon }));
    }
}
function errorPage(err) {
    console.error("Gplex YouTube:", err);
    const own = location.pathname + location.search + (location.search ? "&" : "?") + "gplex=off";
    replace(document.body, h("div", { class: "gy-error" },
        h("h1", null, "Gplex couldn't draw this page"),
        h("p", null, String(err && err.message || err)),
        h("p", null, h("a", { href: own, class: "yt-uix-button yt-uix-button-size-default yt-uix-button-primary" }, h("span", { class: "yt-uix-button-content" }, "Open YouTube's own page")), " ", h("a", { href: location.href, class: "yt-uix-button yt-uix-button-size-default yt-uix-button-default" }, h("span", { class: "yt-uix-button-content" }, "Try again")))));
}
async function render(page, bundle) {
    if (!bundle.data) {
        // the page came without its data (a consent page, a challenge, a changed format): YouTube's own page
        location.replace(location.pathname + location.search + (location.search ? "&" : "?") + "gplex=off");
        return;
    }
    setConfig(bundle.cfg);
    STATE.page = page;
    STATE.data = bundle.data;
    STATE.user = userOf(bundle.data);
    prepareHead();
    const built = await PAGES[page.kind](page, bundle.data, bundle.player);
    buildFrame({ page: page, content: built.content, appbar: built.appbar, pageClass: built.pageClass, guide: built.guide, player: built.player, wide: built.wide });
    setTitle(built.title);
    wireSubscribeButtons(document.body);
    if (built.after) {
        built.after();
    }
}
function start() {
    const page = pageOf(location);
    if (!page || !ERA || pref("on", "true") === "false" || window.top !== window.self) {
        return;
    }
    if (page.kind === "shorts") {
        location.replace("/watch?v=" + page.id);
        return;
    }
    const blocker = blockPageScripts();
    const ready = function() {
        blocker.stop();
        try {
            render(page, readPageData(blocker.scripts)).catch(errorPage);
        } catch (e) {
            errorPage(e);
        }
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", ready, { once: true });
    } else {
        ready();
    }
}
start();
