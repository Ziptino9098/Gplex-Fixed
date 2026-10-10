# Gplex YouTube

Gplex Extended's own YouTube: the desktop YouTube drawn by Gplex itself, in the look of the year of
your Gplex layout, without YouTube's own app and without the V3 extension. It is the YouTube part
of the **alpha** build (`alpha.user.js`), where it replaces StarTube.

## How it works

1. **Takeover at document-start.** On a page Gplex draws (home, watch, results, channel, playlist,
   the feeds), the script stops every one of YouTube's own scripts before it runs: a
   `MutationObserver` marks each `<script>` as `text/plain` the moment the parser adds it. The HTML
   standard performs a microtask checkpoint before an inline script is prepared, so the observer is
   always first. YouTube's stylesheets are dropped the same way. Nothing of YouTube's app runs.
2. **The page's own data.** YouTube still sends everything the page needs inside that HTML:
   `ytInitialData` (what the page shows), `ytInitialPlayerResponse` (the video), and `ytcfg`
   (the session: client version, visitor id, whether you are signed in). Gplex reads them from the
   blocked scripts' text and draws the page from them. Pages are full loads, as they were before
   2015.
3. **More data from InnerTube.** Continuations ("Load more"), comments, the guide, search
   suggestions and every account action use YouTube's own API (`/youtubei/v1/...`) with the
   session from `ytcfg`. Signed in, requests carry the `SAPISIDHASH` authorization YouTube's app
   computes from the SAPISID cookie, so liking, subscribing, commenting and playlists work as you.
4. **The player.** The video plays in YouTube's embedded player (`/embed/ID`), same-origin, in an
   iframe with `controls=0`. Gplex talks to it through the official player protocol
   (`postMessage`: `listening`, `command`, `infoDelivery`), which works from every userscript world
   and every browser, and draws the control bar of the era itself. Captions, quality and speed come
   from the same protocol. A video whose owner turned embedding off plays in YouTube's own watch
   page inside the same frame, with everything but the player hidden.
5. **The look.** One DOM, with YouTube's Hitchhiker (2013-2017) ids and classes, styled per era:
   - 2013, 2014, 2015, 2016: YouTube's own Hitchhiker stylesheets and sprites, which YouTube still
     serves (`s.ytimg.com/yts/cssbin/www-core-vflZ7bM6S.css` and friends), pruned to what Gplex uses
     and embedded, with a small per-year layer (logo, buttons, the 2013 black bar).
   - 2010 and 2012: Gplex's own stylesheets for the classic white site and Cosmic Panda.
   - 2017 and 2019: Gplex's own stylesheets for the Polymer looks (Roboto, 56px masthead, the drawer).

## Which year

The Gplex layout picks the YouTube year (`UGF_YT_LAYOUT` = `auto`), or a year is chosen directly:

| Gplex layout | YouTube |
|---|---|
| 1997-2011, retro | 2010 |
| 2012 | 2012 (Cosmic Panda) |
| 2013, Late 2013 | 2013 |
| Late 2013 (N), Early/Late 2014 | 2014 |
| 2015, 2015L | 2015 |
| 2016 and its variants | 2016 |
| 2018, 2018M | 2017 (Polymer) |
| 2019 | 2019 (Polymer) |
| 2022 | YouTube's own site |

## Source

```
youtube/
  src/        the module, concatenated in name order inside one function (ES2020, no build step beyond that)
    10-env.js     settings, the era, constants
    20-dom.js     h() DOM builder, text runs, formatting
    30-boot.js    page kind, script blocking, reading the page's data
    40-api.js     InnerTube client, auth, continuations, suggestions
    50-parse.js   renderers -> plain models (video, playlist, channel, shelf, comment, ...)
    60-shell.js   masthead, guide, footer, the page frame
    70-pages.js   home, results, watch, channel, playlist, feeds
    80-player.js  the embedded player, the control bar, keyboard, autoplay
    90-actions.js like/dislike, subscribe, comments, playlists, notifications
    99-main.js    the router: start()
  themes/     one stylesheet per family/era, plus YouTube's own Hitchhiker CSS (pruned at build)
  assets/     logos (SVG), favicons, Hitchhiker sprites
  tools/      css-prune.js (keeps only the rules Gplex's DOM uses), test harness
  build.js    makes alpha.user.js (Gplex 8.x with StarTube swapped for this) and the alpha packages
```

Rules: no `innerHTML` (YouTube's pages require Trusted Types); every element is built with `h()`.
No StarTube, no V3. Data comes from the page or InnerTube, never from scraping Polymer's DOM.
One place for each thing: the lockup, the button, the shelf, the control bar are built once and
styled per era.

## Build

```
node youtube/build.js            # alpha.user.js, releases/alpha/*.zip, *.xpi
node youtube/build.js --check    # only the module, syntax-checked
```

## Testing here

`youtube/tools/render.js` loads a page of youtube.com in Chromium with the built script, the way a
userscript manager would, and screenshots it per era. The embedded player cannot play from a
datacenter address (YouTube answers "This video is unavailable" to it), so the control bar is tested
against `tools/fake-embed.html`, which speaks the same player protocol.

## State of the alpha (9.0.0.1)

Drawn and tested here, signed out, in every era: the home page (signed out it shows what is popular on
YouTube's topic channels, since YouTube's own signed-out home is empty), search results with filters and
"Load more", watch pages (player, description, comments and replies, related videos, playlists, up next),
channels (home, videos with Latest/Popular/Oldest, live, playlists, about), playlists, the trending feed,
search suggestions, theatre mode, the keyboard shortcuts.

Written to YouTube's API but not testable here, since they need an account: the guide's subscriptions,
the subscriptions/history/library feeds, liking, subscribing, commenting and replying, "Add to" playlists,
notifications and the account menu. The embedded player itself also refuses to play from the test
machine's address, so its control bar was tested against a stand-in that speaks the same protocol.
Testers with Google accounts are the next step.
