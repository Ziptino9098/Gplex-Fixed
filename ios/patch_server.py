"""The website: the Gplex+ app for iOS 14 and later as an unsigned .ipa at /download/GplexPlus-<v>.ipa (from
files/ios/), and the download page's "Jailbroken iPhone?" paragraph telling about both apps.
python3 patch_server.py <server.py> <out server.py>"""
import sys

src, out = sys.argv[1:3]
p = open(src, encoding="utf-8").read()
edits = [
    ('''<h3 style="margin-top: 14px;">Jailbroken iPhone?</h3>
<p>Gplex Userscripts runs Gplex (Gplex Legacy) in Safari on iOS 9 to 12. Get it from the <a href="/cydia">Cydia repo</a>.</p>
''', '''<h3 style="margin-top: 14px;">Jailbroken iPhone?</h3>
<p>Gplex Userscripts runs Gplex (Gplex Legacy) in Safari on iOS 9 to 12. Get it from the <a href="/cydia">Cydia repo</a>.</p>
<h3 style="margin-top: 14px;">Gplex+ on an iPhone or iPad</h3>
<p>Gplex+, the community, as an app with a Theme list that draws it the way Google+ looked in the year of any Gplex layout.
iOS 6 to 13 (jailbroken): the <b>Gplex+</b> package in the <a href="/cydia">Cydia repo</a>. iOS 14 and later: the
<a href="/download/GplexPlus-1.0.ipa">unsigned .ipa</a>, installed with AppSync Unified on a jailbroken device or with
<a href="https://ios.cfw.guide/installing-trollstore/">TrollStore</a> (iOS 14.0 to 16.6.1 and 17.0) without one.</p>
'''),
    ('''        if path in ("/download/gplex-legacy.user.js", "/gplex-legacy.user.js"):
            return self.send_file(LEGACY_PATH, "text/javascript; charset=utf-8", head, cache=False)
''', '''        if path in ("/download/gplex-legacy.user.js", "/gplex-legacy.user.js"):
            return self.send_file(LEGACY_PATH, "text/javascript; charset=utf-8", head, cache=False)
        # the Gplex+ app for iOS 14 and later (files/ios/GplexPlus-<v>.ipa; the iOS 6-13 one is a .deb in the Cydia repo)
        m = re.match(r"^/download/(GplexPlus-\\d+(?:\\.\\d+){1,3}\\.ipa)$", path)
        if m:
            return self.send_file(os.path.join(HERE, "files", "ios", m.group(1)), "application/octet-stream", head, cache=False)
'''),
]
for old, new in edits:
    assert p.count(old) == 1, (old[:60], p.count(old))
    p = p.replace(old, new)
compile(p, "server.py", "exec")
open(out, "w", encoding="utf-8", newline="\n").write(p)
print("server.py patched")
