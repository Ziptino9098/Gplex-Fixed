# How css/startube.css was made

StarTube 2.7.0.10 kept one stylesheet for every look it could take, keyed by the attributes its
settings put on `<html>` and on `body .spitfire-body-container` (`[wl]`, `[pl-ver]`, `[layout]`, the
`exp-*` experiments, and so on). Gplex Extended for YouTube has one fixed look per era, so those
attribute tests are decided once, here, instead of at every style recalculation:

1. `extract.js <Gplex 8.2 main script>` pulls StarTube's stylesheet out of the main script's StarTube
   section (`Gplex_-_Old_Google_Frontend.user.js` at commit 42add9d) as `startube-2.7.css`.
2. `profiles/*.json` are the attributes StarTube 2.7 itself set on the home and watch pages for each
   Gplex layout (and for the three eras no layout maps to), dumped from it running on V3 in Chromium.
3. `flatten.js` decides every era-fixed attribute test against those profiles (`era-attrs.txt` lists
   the attributes StarTube set from its settings; the rest are page state and stay in the selectors):
   a test that always holds becomes `[st]` (same specificity, set on both elements at run time), a
   selector that can never match in an era is dropped there, and consecutive rules with the same
   set of eras are grouped into blocks, in the original order, so every era's sheet keeps the old
   cascade. It writes `out/chunks.json`, `out/<era>.css` and the pictures it found embedded.
4. `write-css.js` writes `../../css/startube.css` from the chunks: one `/* @eras ... */` line per
   block, formatted by `cssfmt.js` (one declaration per line, a declaration repeated later in the
   same rule dropped), the embedded pictures as `var(--st-pic-<name>)` for the files in
   `../../assets/pictures/` (the three icons drawn at 26-56px were resized to twice that).

The result was checked era by era: the old sheet and the flattened one swapped on the same rendered
page give the same pixels (home: identical for most eras, a few pixels in the masthead for the rest;
watch: only what loaded between the two screenshots). `cssflat.js` is the parser the tools share.
