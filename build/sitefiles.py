#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
The site's files over HTTPS, for the cloud session that makes the releases: it reads and replaces
them itself, instead of handing over a site update zip to apply by hand.

On the website, once (in the gplex-site folder, next to server.py):
    1. Copy this file there and run    py sitefiles.py install
       It adds four short pieces to server.py (the old one is kept as server.py.before-sitefiles).
    2. Start the server as usual. Each time it starts it prints the site files link, like the
       Gplex+ owner link:
           Site files link (lets the cloud session read and update the site's files; keep it to
           yourself): https://gplexextended.com/site/?key=...
       The key is made once and kept in gplex-data/site-files-key (delete that file for a new key).
       Opened in a browser, the link lists the files. The key only works over HTTPS (and over plain
       HTTP from the computer the server runs on).
    3. Put the key in the cloud environment's settings as the variable GPLEX_SITE_KEY: every new
       session then has it without being told.

From the cloud session (this same file, as a command; the key from GPLEX_SITE_KEY or --key, the
site from GPLEX_SITE_URL or --site, https://gplexextended.com unless told otherwise):
    python3 sitefiles.py list                               every file: path, size, date, sha256
    python3 sitefiles.py get files/changelog.json [local]   download one file
    python3 sitefiles.py put local-file files/changelog.json
    python3 sitefiles.py push <folder> [--restart]          every file in the folder whose content
                                                            differs, at the same relative path
    python3 sitefiles.py delete files/versions/8.9.diff.xz
    python3 sitefiles.py restart                            the server starts itself again

What the key reaches: the files in the gplex-site folder (server.py and the other code, files/,
static/, cydia/, tools/, README.txt). Not gplex-data (the download count, the certificates, the key
itself, Gplex+'s data), not certs/ or data/ inside the site folder, and no hidden files.
A new userscript, add-on, changelog or picture shows at once, as before. A new server.py, plus.py
or files/versions/index.json needs a restart; the restart first checks that every .py file compiles
and refuses if one does not. The server starts over in the same process (on Windows, as a new one),
so a service manager keeps it; a new sitefiles.py itself is read at the next start.
"""
import argparse
import hashlib
import hmac
import html
import json
import os
import re
import secrets
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

PREFIX = "/site/"
KEY_FILE = "site-files-key"             # in the data folder (gplex-data)
SKIP_DIRS = ("certs", "data", "__pycache__", "node_modules")
NAME = re.compile(r"^[A-Za-z0-9_][A-Za-z0-9._+@() -]*[A-Za-z0-9_)]$|^[A-Za-z0-9_]$")
MAX_UPLOAD = 64 * 1024 * 1024
WRONG_KEYS = 20                         # wrong keys from one address in an hour: then it waits an hour
REPLACE_TRIES = 20                      # a file being sent can't be replaced on Windows: try again shortly
DEFAULT_SITE = "https://gplexextended.com"


# ---------------------------------------------------------------- on the website
class Files(object):
    """Answers /site/... on the main site: the file list, a file, a new file, a deletion, a restart."""

    def __init__(self, folder, data_dir, servers, site_url, log):
        self.folder = os.path.realpath(folder)
        self.servers = [s for s in servers if s is not None]
        self.log = log
        self.key = self.load_key(os.path.join(data_dir, KEY_FILE))
        self.lock = threading.Lock()
        self.hashes = {}                # path -> (size, mtime, sha256)
        self.wrong = {}                 # address -> (wrong keys, since when)
        self.restarting = False
        host = urllib.parse.urlparse(site_url).hostname or "gplexextended.com"
        if any(s.__class__.__name__ == "TLSServer" for s in self.servers):
            link = "https://" + host
        else:
            link = "http://localhost:%d" % self.servers[0].server_address[1] if self.servers else "http://localhost"
        log("Site files link (lets the cloud session read and update the site's files; keep it to yourself): "
            "%s%s?key=%s" % (link, PREFIX, self.key))

    @staticmethod
    def load_key(path):
        try:
            with open(path) as f:
                key = f.read().strip()
            if re.match(r"^[A-Za-z0-9_-]{32,}$", key):
                return key
        except OSError:
            pass
        key = secrets.token_urlsafe(32)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(key + "\n")
        try:
            os.chmod(path, 0o600)
        except OSError:
            pass
        return key

    # ---- the request
    def handle(self, req):
        """Answers a request for /site/...; False when the request is not one."""
        if not req.path.startswith(PREFIX) or req.is_plus():
            return False
        try:
            self.answer(req)
        except Exception as e:          # (an unexpected error answers this request; the server goes on)
            self.log("Site files: %s: %s" % (e.__class__.__name__, e))
            self.text(req, 500, "The server had a problem: see its window.")
        return True

    @staticmethod
    def text(req, code, msg):
        req.send(code, msg + "\n", "text/plain; charset=utf-8", {"Cache-Control": "no-store"})

    def answer(self, req):
        who = req.client_address[0]
        secure = req.server.__class__.__name__ == "TLSServer" or who in ("127.0.0.1", "::1")
        if not secure:
            return self.text(req, 403, "Only over HTTPS.")
        path, _, query = req.path.partition("?")
        key = req.headers.get("X-Site-Key") or urllib.parse.parse_qs(query).get("key", [""])[0]
        ok = self.key_ok(key, who)
        if ok is None:
            return self.text(req, 429, "Too many wrong keys from your address: wait an hour.")
        if not ok:
            self.log("Site files: wrong key from %s" % who)
            return self.text(req, 403, "Wrong key.")
        what = urllib.parse.unquote(path[len(PREFIX):])
        if req.command == "GET":
            if what == "":
                return self.page(req, key)
            if what == "list":
                return req.send(200, json.dumps({"files": self.listing()}), "application/json",
                                {"Cache-Control": "no-store"})
            if what.startswith("get/"):
                return self.get(req, what[4:])
        elif what.startswith("put/"):
            return self.put(req, what[4:])
        elif what.startswith("delete/"):
            return self.delete(req, what[7:])
        elif what == "restart":
            return self.restart(req)
        self.text(req, 404, "No such action.")

    def key_ok(self, key, who):
        """True for the right key, False for a wrong one, None when the address has had too many wrong ones."""
        with self.lock:
            now = time.time()
            n, since = self.wrong.get(who, (0, now))
            if now - since > 3600:
                n, since = 0, now
            if n >= WRONG_KEYS:
                return None
            if key and hmac.compare_digest(key, self.key):
                self.wrong.pop(who, None)
                return True
            self.wrong[who] = (n + 1, since)
            for other in [a for a, (_, t) in self.wrong.items() if now - t > 3600]:
                del self.wrong[other]
            return False

    # ---- the files
    def local(self, rel):
        """The place on disk of a path from a request, or None when the path is not allowed."""
        parts = rel.replace("\\", "/").split("/")
        if any(not NAME.match(p) or p in SKIP_DIRS for p in parts):
            return None
        fp = os.path.join(self.folder, *parts)
        if os.path.islink(fp) or not os.path.realpath(fp).startswith(self.folder + os.sep):
            return None
        return fp

    def sha256(self, fp, st):
        with self.lock:
            known = self.hashes.get(fp)
            if known and known[:2] == (st.st_size, st.st_mtime):
                return known[2]
        h = hashlib.sha256()
        with open(fp, "rb") as f:
            for block in iter(lambda: f.read(1 << 20), b""):
                h.update(block)
        with self.lock:
            self.hashes[fp] = (st.st_size, st.st_mtime, h.hexdigest())
        return h.hexdigest()

    def listing(self):
        out = []
        for root, dirs, names in os.walk(self.folder):
            dirs[:] = sorted(d for d in dirs if not d.startswith(".") and d not in SKIP_DIRS)
            for n in sorted(names):
                fp = os.path.join(root, n)
                if n.startswith(".") or os.path.islink(fp):
                    continue
                try:
                    st = os.stat(fp)
                    sha = self.sha256(fp, st)
                except OSError:
                    continue
                out.append({"path": os.path.relpath(fp, self.folder).replace(os.sep, "/"),
                            "size": st.st_size, "mtime": int(st.st_mtime), "sha256": sha})
        return out

    def page(self, req, key):
        rows = []
        for f in self.listing():
            when = time.strftime("%Y-%m-%d %H:%M", time.localtime(f["mtime"]))
            rows.append('<tr><td><a href="%sget/%s?key=%s">%s</a></td><td align="right">%s</td><td>%s</td></tr>' % (
                PREFIX, urllib.parse.quote(f["path"]), html.escape(key), html.escape(f["path"]),
                "{:,}".format(f["size"]), when))
        body = ('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Site files - Gplex Extended</title>'
                '<style>body{font-family:arial,sans-serif;font-size:13px;margin:20px}td{padding:2px 12px 2px 0}'
                'th{text-align:left;padding:2px 12px 6px 0}</style></head><body>'
                '<h1 style="font-size:20px;font-weight:normal">Site files</h1>'
                '<p>The files of the website in %s (%d files). The cloud session reads and replaces them '
                'with this key; keep the link to yourself.</p>'
                '<table><tr><th>File</th><th>Bytes</th><th>Changed</th></tr>%s</table></body></html>'
                % (html.escape(self.folder), len(rows), "".join(rows)))
        req.send(200, body, "text/html; charset=utf-8", {"Cache-Control": "no-store"})

    def get(self, req, rel):
        fp = self.local(rel)
        if fp is None:
            return self.text(req, 400, "That path is not allowed.")
        try:
            with open(fp, "rb") as f:
                data = f.read()
        except OSError:
            return self.text(req, 404, "No such file.")
        req.send(200, data, "application/octet-stream", {"Cache-Control": "no-store"})

    def put(self, req, rel):
        fp = self.local(rel)
        if fp is None:
            return self.text(req, 400, "That path is not allowed.")
        try:
            n = int(req.headers.get("Content-Length") or 0)
        except ValueError:
            n = -1
        if n < 0 or n > MAX_UPLOAD:
            return self.text(req, 413, "Too big: up to %d MB." % (MAX_UPLOAD >> 20))
        data = b""
        while len(data) < n:
            block = req.rfile.read(min(n - len(data), 1 << 20))
            if not block:
                return self.text(req, 400, "The upload stopped short.")
            data += block
        sha = hashlib.sha256(data).hexdigest()
        expected = req.headers.get("X-Sha256", "")
        if expected and expected.lower() != sha:
            return self.text(req, 400, "The upload arrived damaged (sha256 differs).")
        os.makedirs(os.path.dirname(fp), exist_ok=True)
        tmp = os.path.join(os.path.dirname(fp), "." + os.path.basename(fp) + ".part")
        with open(tmp, "wb") as f:
            f.write(data)
        try:
            self.retry(os.replace, tmp, fp)
        except OSError as e:
            try:
                os.remove(tmp)
            except OSError:
                pass
            return self.text(req, 500, "Could not put the file in place: %s" % e)
        self.log("Site files: %s replaced (%s bytes) from %s" % (rel, "{:,}".format(n), req.client_address[0]))
        req.send(200, json.dumps({"path": rel, "size": n, "sha256": sha}), "application/json",
                 {"Cache-Control": "no-store"})

    def delete(self, req, rel):
        fp = self.local(rel)
        if fp is None:
            return self.text(req, 400, "That path is not allowed.")
        if not os.path.isfile(fp):
            return self.text(req, 404, "No such file.")
        try:
            self.retry(os.remove, fp)
        except OSError as e:
            return self.text(req, 500, "Could not delete it: %s" % e)
        self.log("Site files: %s deleted from %s" % (rel, req.client_address[0]))
        self.text(req, 200, "Deleted %s." % rel)

    @staticmethod
    def retry(fn, *args):
        for i in range(REPLACE_TRIES):
            try:
                return fn(*args)
            except PermissionError:
                if i == REPLACE_TRIES - 1:
                    raise
                time.sleep(0.25)

    # ---- the restart
    def compile_error(self):
        """What is wrong with the first .py file that does not compile, or None."""
        for root, dirs, names in os.walk(self.folder):
            dirs[:] = [d for d in dirs if not d.startswith(".") and d not in SKIP_DIRS]
            for n in names:
                if n.endswith(".py"):
                    fp = os.path.join(root, n)
                    try:
                        with open(fp, "rb") as f:
                            compile(f.read(), fp, "exec")
                    except (SyntaxError, ValueError, OSError) as e:
                        return "%s does not compile: %s" % (os.path.relpath(fp, self.folder), e)
        return None

    def restart(self, req):
        bad = self.compile_error()
        if bad:
            return self.text(req, 409, "Not restarting: " + bad)
        with self.lock:
            if self.restarting:
                return self.text(req, 409, "Already restarting.")
            self.restarting = True
        self.log("Site files: restart asked by %s" % req.client_address[0])
        self.text(req, 200, "Restarting.")
        t = threading.Thread(target=self.do_restart)
        t.daemon = False                # (the process waits for it after the server loops end)
        t.start()

    def do_restart(self):
        time.sleep(1)                   # (the reply goes out first)
        servers = [s for s in self.servers if s is not None]
        for s in servers:
            s.shutdown()
        for s in servers:
            s.server_close()
        cmd = [sys.executable] + sys.argv
        self.log("Site files: starting again: %s" % " ".join(cmd))
        try:
            sys.stdout.flush()
        except (OSError, ValueError):
            pass
        if os.name != "nt":
            # the same process, started over: it keeps its process id, its output and its place under a
            # service manager (systemd, a container), which would stop a child along with the parent
            try:
                os.execv(sys.executable, cmd)
            except OSError as e:
                self.log("Site files: could not start over in place (%s); starting a new process" % e)
        subprocess.Popen(cmd, cwd=os.getcwd())


# ---------------------------------------------------------------- install: the four pieces in server.py
IMPORT_AT = "from http.server import BaseHTTPRequestHandler, HTTPServer\n"
IMPORT_ADD = "import sitefiles\n"
GLOBAL_AT = re.compile(r"^CYDIA = None.*\n", re.M)
GLOBAL_ADD = "FILES = None             # the site's files over HTTPS, for the cloud session (sitefiles.py); made in main()\n"
METHOD_ADD = "        if FILES is not None and FILES.handle(self):\n            return\n"
OLD_COMMENT = "        # only Gplex+ takes forms; the site itself is read-only\n"
NEW_COMMENT = "        # Gplex+ takes forms, and the site files link (sitefiles.py); the site itself is read-only\n"
MAIN_AT = '    print("Press Ctrl+C to stop.")\n'
MAIN_ADD = ("    global FILES\n"
            "    FILES = sitefiles.Files(HERE, a.data_dir, (httpd, httpsd), LATEST_URL,\n"
            "                            log=lambda m: (sys.stdout.write(m + \"\\n\"), sys.stdout.flush()))\n")


def patched(text):
    """server.py's text (LF line ends) with the four pieces, or None and why not: (text, reason)."""
    if IMPORT_ADD in text:
        done = all(x in text for x in (GLOBAL_ADD, MAIN_ADD)) and text.count(METHOD_ADD) == 2
        return None, "already has the site files link" + ("" if done else ", but only in part: send me the file")
    anchors = ((IMPORT_AT, text.count(IMPORT_AT)), ("CYDIA = None", len(GLOBAL_AT.findall(text))),
               ("def do_GET", text.count("    def do_GET(self):\n")), ("def do_POST", text.count("    def do_POST(self):\n")),
               (MAIN_AT.strip(), text.count(MAIN_AT)))
    missing = [a for a, n in anchors if n != 1]
    if missing:
        return None, "has changed where the site files link goes (%s): send me the file" % ", ".join(missing)
    text = text.replace(IMPORT_AT, IMPORT_AT + IMPORT_ADD)
    text = GLOBAL_AT.sub(lambda m: m.group(0) + GLOBAL_ADD, text)
    for method in ("    def do_GET(self):\n", "    def do_POST(self):\n"):
        text = text.replace(method, method + METHOD_ADD)
    text = text.replace(OLD_COMMENT, NEW_COMMENT)
    text = text.replace(MAIN_AT, MAIN_ADD + MAIN_AT)
    compile(text, "server.py", "exec")
    return text, ""


def install(path, backup=True):
    """Puts the four pieces into server.py at path (keeping the old file as server.py.before-sitefiles,
    unless backup is off); says what it did."""
    with open(path, "rb") as f:
        raw = f.read()
    crlf = b"\r\n" in raw
    text, reason = patched(raw.decode("utf-8").replace("\r\n", "\n"))
    if text is None:
        return "%s %s." % (path, reason)
    if backup and not os.path.exists(path + ".before-sitefiles"):
        os.replace(path, path + ".before-sitefiles")
    tmp = path + ".updating"
    with open(tmp, "wb") as f:
        f.write(text.replace("\n", "\r\n").encode("utf-8") if crlf else text.encode("utf-8"))
    os.replace(tmp, path)
    return ("Done: %s now answers the site files link%s.\n"
            "Start the server as usual; it prints the link, which also lists the files when opened in a browser."
            % (path, " (the old file is server.py.before-sitefiles)" if backup else ""))


# ---------------------------------------------------------------- the command, from the cloud session
class Client(object):
    def __init__(self, site, key):
        self.site = site.rstrip("/")
        self.key = key

    def call(self, what, data=None, extra=None):
        headers = {"X-Site-Key": self.key}
        headers.update(extra or {})
        req = urllib.request.Request(self.site + PREFIX + what, data=data, headers=headers,
                                     method="POST" if data is not None else "GET")
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            raise SystemExit("%s: %s %s" % (what, e.code, e.read().decode("utf-8", "replace").strip()))
        except urllib.error.URLError as e:
            raise SystemExit("%s: could not reach %s: %s" % (what, self.site, e.reason))

    def listing(self):
        return json.loads(self.call("list").decode("utf-8"))["files"]

    def put(self, local, remote):
        with open(local, "rb") as f:
            data = f.read()
        return self.call("put/" + urllib.parse.quote(remote), data,
                         {"X-Sha256": hashlib.sha256(data).hexdigest(), "Content-Type": "application/octet-stream"})


def file_sha256(fp):
    h = hashlib.sha256()
    with open(fp, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def main():
    ap = argparse.ArgumentParser(description="The site's files over HTTPS: list, get, put, push, delete, restart; "
                                             "or install, on the website, to add the link to server.py.")
    ap.add_argument("--site", default=os.environ.get("GPLEX_SITE_URL", DEFAULT_SITE), help="the site (default %s)" % DEFAULT_SITE)
    ap.add_argument("--key", default=os.environ.get("GPLEX_SITE_KEY", ""), help="the key from the site files link (default: GPLEX_SITE_KEY)")
    sub = ap.add_subparsers(dest="cmd")
    sub.required = True
    p = sub.add_parser("install", help="on the website: add the link to server.py (once)")
    p.add_argument("server", nargs="?", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "server.py"))
    sub.add_parser("list", help="every file on the site")
    p = sub.add_parser("get", help="download a file")
    p.add_argument("remote")
    p.add_argument("local", nargs="?")
    p = sub.add_parser("put", help="upload a file")
    p.add_argument("local")
    p.add_argument("remote")
    p = sub.add_parser("push", help="upload every file in a folder whose content differs, at the same relative path")
    p.add_argument("folder")
    p.add_argument("--restart", action="store_true", help="then restart the server")
    p = sub.add_parser("delete", help="delete a file")
    p.add_argument("remote")
    sub.add_parser("restart", help="the server starts itself again")
    a = ap.parse_args()
    if a.cmd == "install":
        print(install(a.server))
        return
    if not a.key:
        raise SystemExit("No key: set GPLEX_SITE_KEY or give --key (it is in the site files link the server prints).")
    c = Client(a.site, a.key)
    if a.cmd == "list":
        files = c.listing()
        for f in files:
            print("%12s  %s  %s  %s" % ("{:,}".format(f["size"]), time.strftime("%Y-%m-%d %H:%M", time.localtime(f["mtime"])),
                                        f["sha256"][:12], f["path"]))
        print("%d files" % len(files))
    elif a.cmd == "get":
        data = c.call("get/" + urllib.parse.quote(a.remote))
        local = a.local or os.path.basename(a.remote)
        with open(local, "wb") as f:
            f.write(data)
        print("%s: %s bytes, saved as %s" % (a.remote, "{:,}".format(len(data)), local))
    elif a.cmd == "put":
        r = json.loads(c.put(a.local, a.remote).decode("utf-8"))
        print("%s: %s bytes now on the site" % (r["path"], "{:,}".format(r["size"])))
    elif a.cmd == "push":
        there = dict((f["path"], f["sha256"]) for f in c.listing())
        sent = same = 0
        for root, dirs, names in os.walk(a.folder):
            dirs[:] = sorted(d for d in dirs if not d.startswith("."))
            for n in sorted(names):
                if n.startswith("."):
                    continue
                fp = os.path.join(root, n)
                rel = os.path.relpath(fp, a.folder).replace(os.sep, "/")
                if there.get(rel) == file_sha256(fp):
                    same += 1
                    continue
                r = json.loads(c.put(fp, rel).decode("utf-8"))
                print("%s: %s bytes %s" % (rel, "{:,}".format(r["size"]), "replaced" if rel in there else "added"))
                sent += 1
        print("%d file%s sent, %d unchanged" % (sent, "" if sent == 1 else "s", same))
        if a.restart:
            print(c.call("restart", b"").decode("utf-8").strip())
    elif a.cmd == "delete":
        print(c.call("delete/" + urllib.parse.quote(a.remote), b"").decode("utf-8").strip())
    elif a.cmd == "restart":
        print(c.call("restart", b"").decode("utf-8").strip())


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:             # (the output was piped into something that stopped reading)
        pass
