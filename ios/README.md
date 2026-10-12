# Gplex+ for iOS

plus.gplexextended.com, the Gplex Extended community, as an app with a Theme list: Gplex+ drawn the way
Google+ looked in the year of any Gplex layout. The theme is the Gplex+ part of Gplex itself, which the
site serves to the app (nothing of Gplex is inside the app), so the apps stay small and the theme follows
Gplex's releases.

Two apps from one source file, `app/GPApp.m`:

| | iOS 6 to 13 | iOS 14 and later |
|---|---|---|
| web view | UIWebView | WKWebView |
| binary | armv7 and arm64, no ARC, iPhoneOS 10.3 SDK | arm64, ARC, iPhoneOS 14.5 SDK |
| User-Agent suffix | `GplexPlusLegacy/1.0` | `GplexPlusApp/1.0` |
| theme script | the Gplex+ part of Gplex Legacy, lowered to ES5 | the Gplex+ part of today's Gplex |
| package | `.deb` into /Applications, in the site's Cydia repo | unsigned `.ipa` (AppSync Unified, TrollStore) |

## How it fits together

- The app keeps the chosen layout in the cookie `gplex_theme` on plus.gplexextended.com and adds its
  suffix to the system User-Agent. `themes.plist` in the bundle lists Gplex's layouts (value, label, the
  Google+ look it maps to), made from the script's own settings menu.
- The site (`plus.py`, `plus_views.py`, patched by `patch_plus.py`) knows the app by the User-Agent: it
  puts `<script src="/app/gplex-plus.js">` (or `-legacy.js`) into every page it sends the app, serves those
  files from `plus_app/` next to `plus.py`, and opens its content security policy to its own scripts for
  the app only (`script-src 'self'` instead of `'none'`).
- `cut.js` makes the two scripts: the asset table `UGF_GPX` and the function `ugfGplexPlusTheme` out of a
  Gplex userscript, with the four things they need from the rest of Gplex put in front (the GM storage as
  localStorage, the layout from the cookie, the Gplex+ name, the invite link). `legacy` lowers the result
  to ES5 with Babel for Safari on iOS 6 to 9 and adds the few browser functions those lack, plus
  `-webkit-` flexbox prefixes at the point the style is inserted.
- `patch_server.py` gives the website the IPA download (`files/ios/`) and a paragraph on the download page.

## Building

Everything is built on Linux; no Mac. Fetch once, next to this folder's scripts:

- the SDKs: `git clone --depth 1 --filter=blob:none --sparse https://github.com/theos/sdks sdks`,
  then `git -C sdks sparse-checkout set iPhoneOS10.3.sdk iPhoneOS14.5.sdk` (the 9.3 SDK there lacks a system stub, liblaunch)
- `ldid` (fake-signing): `git clone https://github.com/ProcursusTeam/ldid ldid-src && make -C ldid-src`
  (needs libplist-dev and libssl-dev)
- for the iOS 14 app: clang and lld (`ld64.lld`, a symlink to lld is enough)
- for the iOS 6 app: Apple's ld64 from cctools-port, because lld cannot link armv7 and cannot read the old
  SDK's stubs: `build-tapi.sh` builds libtapi and cctools (with libdispatch from `build-cctools.sh`'s first
  step) into `cctools-out/`
- Node with `tools/`: `npm install esbuild @babel/core @babel/preset-env` (cut.js), Playwright (plustest.js)

Then:

    python3 mkicon.py out/art                      # the icon (a red square with a white g+) and launch images
    node cut.js modern <Gplex userscript> out/gplex-plus.js
    node cut.js legacy <Gplex Legacy userscript> out/gplex-plus-legacy.js
    ./build-modern.sh 1.0                         # out/GplexPlus-1.0.ipa
    ./build-legacy.sh 1.0                         # out/com.gplexextended.plus_1.0_iphoneos-arm.deb

`themes-modern.plist` and `themes-legacy.plist` in `out/` come from the layout menus of the two scripts
(see the python in the session notes, or regenerate with the same regex over `UGF_SET_LAYOUT_*`).

## Testing

`node plustest.js out/gplex-plus.js 2013 shot.png` loads the live site in Chromium with the cookie set
and the script tag put in (as the patched server does); with `GPLEX_LIVE=1` and `GPLEX_UA` set to an
app's User-Agent it takes the live site as it is, which is the real test once the site is updated. The
`gplex-plus` attribute on `<html>` says which Google+ look was drawn (g2011, g2012, g2012w, g2013, g2015).
Old Safari's engine cannot be run here: the legacy cut is checked to parse as ES5 and to behave in
Chromium; the apps themselves need a device.
