# Gplex Extended for YouTube

The YouTube part of Gplex Extended, rewritten. It runs on top of the V3 extension (Vorapis 2013), which
draws youtube.com as it was in 2013, and moves that page to the look of the year of your Gplex layout,
2007 to 2022. It descends from StarTube 2.7.0.10 by lightbeam24 (MIT license,
https://github.com/lightbeam24/StarTube), which did the same with a settings window of its own: here
every one of those settings is a fact of the era, the stylesheet is resolved per era, and the code is
one pass per page. It is the YouTube part of the **alpha** build (`alpha.user.js` and the packages in
`releases/alpha/`); the main script still carries StarTube itself.

## How it works

1. **V3 draws the page.** V3 renders youtube.com in its 2013 Hitchhiker DOM (`#yt-masthead`,
   `#appbar-guide-menu`, `#watch7-*`, `#page.watch` and so on) and fires `V3_NAVITRONIC_STARTED`,
   `V3_SERVERCONTRACT_FLUSH_DOCEL_ATTRIB` and `V3_NAVITRONIC_FINISHED` as it navigates. V3's own
   settings live in `localStorage` (`v3_local_db`).
2. **The era.** `src/10-core.js` holds one table row per YouTube look (`ERAS`): which V3 preset to
   write (the 2013 site, the 2014-2016 "nirvana" site, Polymer's frame, or the old site under the
   frame), the player sizes, which watch-page build, which player chrome, which channel page, and
   the flags for everything else. On every page load the row's V3 settings are compared with
   `v3_local_db` and written once, with one reload, when they differ.
3. **The passes.** On V3's events the shell sets the attributes the stylesheet keys on
   (`src/20-shell.js`), rebuilds the masthead of the era (the 2007-2009 header, the 2010-2012 links,
   the 2017+ buttons and menus), the guide and the footer, then the page: the watch page's rows of
   buttons, metadata, description and related videos (`src/30-watch.js`), the player chrome and menu
   (`src/35-player.js`), comments (`src/40-comments.js`), channel and playlist pages
   (`src/50-channel.js`), and home, feeds and search (`src/60-home.js`). Markup comes from
   `src/15-templates.js` (StarTube's, cleaned), through Gplex's Trusted Types policy.
4. **What V3 does not give.** A channel's videos and About tab on the watch page, channel banners and
   the channels3 page use YouTube's own API (`/youtubei/v1/browse`), with the browser's cookies and the
   session from the page; nothing builds a sign-in header from cookies.
5. **The look.** `css/startube.css` is StarTube's stylesheet with its settings resolved per era (see
   `tools/migrate/README.md`): each block carries an `@eras` line, the build inlines the blocks and the
   runtime adds the era's blocks before `<head>`, where StarTube had them. The four feature
   stylesheets in `css/extra/` go inside the element they style, as before. Pictures are the files in
   `assets/pictures/`, inlined as `--st-pic-<name>` custom properties.

## Which year

The Gplex layout picks the era unless one is chosen on the settings page:

| Gplex layout | YouTube |
|---|---|
| 1997-2006, retro | 2007 |
| 2007 | 2008 |
| 2009 / Late 2009 | Early 2009 / Late 2009 |
| 2010 | 2010 |
| 2012 | 2012 (Cosmic Panda) |
| 2013, Late 2013 | Mid 2013 |
| Late 2013 (N), Early 2014 | Late 2013 |
| 2014 | 2014 |
| Late 2014, Late 2015 (L) | Early 2015 |
| 2015, Late 2015 | 2015 |
| Early 2016 | Early 2016 |
| 2016, Late 2016 (L), 2016 (C) | Mid 2016 |
| Late 2016 (N) | Late 2016 |
| 2018 | 2017 |
| 2018 (M) | 2018 |
| 2019 | 2019 |
| 2022 | 2022 |

Early 2013, Mid 2013 and 2011 exist only as hand-picked eras. The black Google bar follows the Gplex
layout as before: 2012's with the 2012 layout, 2013's with the 2013 layouts, none otherwise.

## Settings

Three, on the Gplex settings page: Gplex Extended for YouTube on or off (`UGF_STARTUBE_ON`, as before),
the YouTube layout (`UGF_ST_layoutPick`: `auto` or an era id), and the dark theme (`UGF_ST_dark`:
`auto`, `on` or `off`, written to V3's `DARK_MOD`). Everything StarTube offered as an option is a
fact of the era now.

## What is gone from StarTube

Its settings window and every option in it; its update cards, changelog, welcome and alert banners;
Densor, the frosted glass, ambient mode, the return popup, the live chat panel, the duplicate-script
detector; the Hype page, chips and lists (YouTube no longer serves the Hype leaderboard); the layouts
no Gplex layout maps to (Skybird, Ringo, Amsterdam, Epic, the alternative watch pages). Signed-in
paths (the account menu, subscriptions in the guide, the owner's watch page) are ported but untested
here: please report.

## Source

```
youtube/
  src/               the module, concatenated in name order inside ugfStarTube()
    10-core.js         settings, the era table, V3 presets and settings, DOM helpers, InnerTube
    15-templates.js    markup (generated from StarTube's templates, cleaned)
    20-shell.js        attributes, masthead, menus, guide, footer
    30-watch.js        the watch page
    35-player.js       player chrome, menu, spinner
    40-comments.js     comments
    50-channel.js      channel (channels3 and Polymer) and playlist pages
    60-home.js         home, feeds, search, the playlist page's header
    90-main.js         the stylesheet, the passes on V3's events, start()
    99-launcher.js     outside ugfStarTube(): the on/off setting, the in-page runner for the extensions
  css/startube.css   the stylesheet, blocks under @eras lines
  css/extra/         the four feature stylesheets (2007-2009 header, channels3, spinner, popups)
  assets/pictures/   the pictures the stylesheet embeds
  tools/settings-section.html   the settings page section the build puts into the main script
  tools/migrate/     how css/startube.css was derived from StarTube's (see its README)
  tools/render.js    renders a page with V3 in Chromium for checking (needs Playwright and V3)
  build.js           makes alpha.user.js and the alpha packages
```

## Build

```
node youtube/build.js            # alpha.user.js, then releases/alpha/ (Chrome zip + unpacked, Firefox xpi)
node youtube/build.js --check    # only assembles youtube/gplex-youtube.module.js for tools/render.js
```

The build takes the main script, swaps its StarTube section for the module, replaces the StarTube
settings section with `tools/settings-section.html`, and sets the alpha's name, version and update
URLs. The Firefox package runs the module in the add-on's own world: the module reads and writes the
data V3 keeps on elements through `wrappedJSObject`. The Chrome package hands the module to the page
(Chrome's content scripts cannot see that data), as the main script's StarTube does.
