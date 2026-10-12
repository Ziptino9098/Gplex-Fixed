"""Gplex+ server: the Gplex+ apps. The site knows the app by its User-Agent (GplexPlusApp/<v> on iOS 14 and
later, GplexPlusLegacy/<v> on iOS 6 to 13), serves the app's cut of Gplex from plus_app/ at /app/<name>.js,
puts the script tag into every page it sends the app, and lets scripts from the site run for it (the
content security policy otherwise allows none). python3 patch_plus.py <site copies dir> <out dir>"""
import os
import sys

src, out = sys.argv[1:3]
os.makedirs(out, exist_ok=True)


def patch(name, edits):
    p = open(os.path.join(src, name), encoding="utf-8").read()
    for old, new in edits:
        assert p.count(old) == 1, (name, old[:60], p.count(old))
        p = p.replace(old, new)
    open(os.path.join(out, name), "w", encoding="utf-8", newline="\n").write(p)
    compile(p, name, "exec")
    print(name, "patched")


patch("plus.py", [
    ('''def legacy_browser(ua):
    return bool(ua and LEGACY_UA.search(ua))
''', '''def legacy_browser(ua):
    return bool(ua and LEGACY_UA.search(ua))


# the Gplex+ apps for iOS (see plus_views.app_script): "modern" (iOS 14 and later, WKWebView) or "legacy"
# (iOS 6 to 13, UIWebView), by the User-Agent the app adds to the system's
APP_UA = re.compile(r"\\bGplexPlus(App|Legacy)/\\d")


def app_kind(ua):
    m = APP_UA.search(ua or "")
    return None if not m else ("modern" if m.group(1) == "App" else "legacy")
'''),
    ('''        if rep.ctype.startswith("text/html"):
            handler.send_header("Content-Security-Policy",
                                "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                                "font-src 'self' https://fonts.gstatic.com; "
                                "script-src 'none'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; "
                                "form-action 'self'")''',
     '''        if rep.ctype.startswith("text/html"):
            # (the Gplex+ apps run the site's own script, nobody else runs any)
            scripts = "'self'" if app_kind(handler.headers.get("User-Agent")) else "'none'"
            handler.send_header("Content-Security-Policy",
                                "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                                "font-src 'self' https://fonts.gstatic.com; "
                                "script-src " + scripts + "; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; "
                                "form-action 'self'")'''),
])

patch("plus_views.py", [
    ('''def page(self, req, title, body, code=200, side="", nav=None, bare=False):
    u = req.user
''', '''# ---- the Gplex+ apps for iOS: the Gplex+ part of Gplex (cut.js's output in plus_app/), served to the app
# at /app/<name>.js and put into every page it gets. The app keeps the layout in the cookie gplex_theme,
# which that script reads. iOS 14 and later get the cut of today's Gplex; iOS 6 to 13 the cut of Gplex Legacy.
APP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plus_app")
APP_FILES = {"modern": "gplex-plus.js", "legacy": "gplex-plus-legacy.js"}


def app_kind_of(req):
    try:
        return P.app_kind(req.h.headers.get("User-Agent"))
    except Exception:
        return None


def app_script(req):
    kind = app_kind_of(req)
    if not kind:
        return ""
    name = APP_FILES[kind]
    try:
        stamp = str(int(os.stat(os.path.join(APP_DIR, name)).st_mtime))
    except OSError:
        return ""
    return '<script src="/app/%s?v=%s"></script>' % (name, stamp)


def view_app_file(self, req, name):
    if name not in APP_FILES.values():
        return Reply(404, "Not found", "text/plain; charset=utf-8")
    try:
        with open(os.path.join(APP_DIR, name), "rb") as f:
            data = f.read()
    except OSError:
        return Reply(404, "Not found", "text/plain; charset=utf-8")
    rep = Reply(200, data, "text/javascript; charset=utf-8")
    rep.headers.append(("Cache-Control", "public, max-age=3600"))
    return rep


def page(self, req, title, body, code=200, side="", nav=None, bare=False):
    u = req.user
'''),
    ('''           '<meta name="viewport" content="width=1040"><title>%s</title><style type="text/css">%s</style></head>'
           '<body class="%s">%s%s%s</body></html>') % (
        ' data-gp-brand="custom"' if nm != P.NAME else "", esc(title + " - " + nm if title != P.NAME else nm), CSS,
        ("nav-" + nav if nav else "nav-none") + (" in" if u else " out") + (" bare" if bare or not u else ""), head, inner, foot)''',
     '''           '<meta name="viewport" content="width=1040"><title>%s</title><style type="text/css">%s</style>%s</head>'
           '<body class="%s">%s%s%s</body></html>') % (
        ' data-gp-brand="custom"' if nm != P.NAME else "", esc(title + " - " + nm if title != P.NAME else nm), CSS, app_script(req),
        ("nav-" + nav if nav else "nav-none") + (" in" if u else " out") + (" bare" if bare or not u else ""), head, inner, foot)'''),
    ('''    if path.startswith("/media/"):
        return self.view_media(req, path[7:])
''', '''    if path.startswith("/media/"):
        return self.view_media(req, path[7:])
    if path.startswith("/app/"):
        return view_app_file(self, req, path[5:])
'''),
])
