// Pulls StarTube's stylesheet (the <style> blocks of its createApps template, main script 8.2, lines
// 22624-40214) out as plain CSS: node extract.js <Gplex 8.2 main script> -> startube-2.7.css
"use strict";
const fs = require("fs");
const L = fs.readFileSync(process.argv[2], "utf8").split("\n");
const sec = L.slice(22624 - 1, 40214 - 1).join("\n");
// the template literal: nE.innerHTML=ugfTT(`...`) ; take everything between the first backtick and the last
const a = sec.indexOf("`"), b = sec.lastIndexOf("`");
const tpl = sec.slice(a + 1, b);
// style blocks
const styles = [];
const re = /<style[^>]*>([\s\S]*?)<\/style>/g;
let m;
while ((m = re.exec(tpl))) { styles.push(m[1]); }
console.log("style blocks", styles.length, styles.map(s => s.length));
// ${...} template expressions inside: replace UGF_ST_IMG refs with a placeholder url
let css = styles.join("\n/* ---- next style block ---- */\n").replace(/\$\{UGF_ST_IMG\}/g, "UGF_ST_IMG");
const rest = tpl.replace(re, "").trim();
console.log("non-style markup length", rest.length, JSON.stringify(rest.slice(0, 300)));
fs.writeFileSync(require("path").join(__dirname, "startube-2.7.css"), css);
console.log("css bytes", css.length, "lines", css.split("\n").length, "other ${}", (css.match(/\$\{[^}]*\}/g) || []).slice(0, 10));
