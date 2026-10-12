// The Gplex+ part of Gplex, on its own, for the Gplex+ apps: the asset table UGF_GPX and the
// ugfGplexPlusTheme function, with the four things they need from the rest of the script put in
// front (the GM storage as localStorage, the layout from the app's cookie, the Gplex+ name and the
// invite link). The site serves the result to the app (see plus_views.py, app_script).
//   node cut.js modern <Gplex userscript> <out.js>        (iOS 14 and later: the script's syntax as it is)
//   node cut.js legacy <Gplex Legacy userscript> <out.js> (iOS 6 to 13: lowered to ES5 with Babel, plus
//                                                        the few browser functions old Safari lacks)
"use strict";
const fs = require("fs");
const path = require("path");
const [, , variant, input, output] = process.argv;
if (!variant || !input || !output || ["modern", "legacy"].indexOf(variant) < 0) {
    console.error("usage: node cut.js modern|legacy <in.user.js> <out.js>");
    process.exit(1);
}
const src = fs.readFileSync(input, "utf8").replace(/\r\n/g, "\n");
const version = (src.match(/\/\/ @version\s+(\S+)/) || [])[1] || "?";
const invite = (src.match(/UGF_PLUS_INVITE = ("https:[^"]+")/) || [])[1];
if (!invite) {
    throw new Error("UGF_PLUS_INVITE not found");
}
const marks = variant === "modern"
    ? ["// (7.2.9) Gplex+ (plus.gplexextended.com", "// ---- Gplex Chrome page ----"]
    : ["var UGF_GPX = ", "var UGF_CHROME_ASSETS = "];
const a = src.indexOf(marks[0]);
const b = src.indexOf(marks[1], a);
if (a < 0 || b < 0) {
    throw new Error("the Gplex+ block was not found (" + a + ", " + b + ")");
}
let block = src.slice(a, b).trim() + "\n";
if (block.indexOf("ugfGplexPlusTheme") < 0 || block.indexOf("UGF_GPX") < 0) {
    throw new Error("the block does not look like the Gplex+ part");
}
if (variant === "legacy") {
    // old Safari wants -webkit- in front of flexbox (iOS 6 the old -webkit-box, 7 and 8 -webkit-flex)
    const anchor = "(document.head || root).appendChild(st);";
    if (block.indexOf(anchor) < 0) {
        throw new Error("the style insertion was not found (Gplex Legacy changed?)");
    }
    block = block.replace(anchor, "st.textContent = gpxPrefixCss(st.textContent);\n" + anchor);
}

const prelude = [
    "// Gplex+ for the Gplex+ app: the Gplex+ part of Gplex " + (variant === "legacy" ? "Legacy " : "") + version +
        " (the way Google+ looked in the year of a Gplex layout), served by plus.gplexextended.com. Made by cut.js from",
    "// the full script; nothing in it is hand-edited. The layout comes from the app's cookie gplex_theme.",
    '"use strict";',
    "function gpxCookie(name) {",
    '    var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));',
    '    return m ? decodeURIComponent(m[1]) : "";',
    "}",
    "function GM_getValue(k, d) {",
    '    if (k === "UGF_LAYOUT") {',
    '        var t = gpxCookie("gplex_theme");',
    "        // the 2014 family is one layout to the Gplex+ part",
    '        return t ? (/^(2013N|2014E|2014N)$/.test(t) ? "2014" : t) : d;',
    "    }",
    "    try {",
    "        var v = localStorage.getItem(k);",
    "        return v === null ? d : v;",
    "    } catch (e) {",
    "        return d;",
    "    }",
    "}",
    "function GM_setValue(k, v) {",
    "    try {",
    "        localStorage.setItem(k, String(v));",
    "    } catch (e) {}",
    "}",
    'var UGF_PLUS_NAME_DEFAULT = "Gplex+";',
    "function ugfPlusGet(k) {",
    "    var v = GM_getValue(k, null);",
    '    return v === null || v === undefined ? "" : String(v);',
    "}",
    "function ugfPlusName() {",
    '    var v = ugfPlusGet("UGF_PLUS_NAME").replace(/[\\u0000-\\u001f\\u007f]/g, "").replace(/\\s+/g, " ").trim().slice(0, 30);',
    "    return v || UGF_PLUS_NAME_DEFAULT;",
    "}",
    "var UGF_PLUS_INVITE = " + invite + ";"
];
if (variant === "legacy") {
    prelude.push(
        "// what Safari on iOS 6 to 9 lacks of what the Gplex+ part uses",
        "(function() {",
        "    try {",
        "        if (window.NodeList && !NodeList.prototype.forEach) {",
        "            NodeList.prototype.forEach = Array.prototype.forEach;",
        "        }",
        "        if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {",
        "            HTMLCollection.prototype.forEach = Array.prototype.forEach;",
        "        }",
        "        if (window.Element && !Element.prototype.remove) {",
        "            Element.prototype.remove = function() {",
        "                if (this.parentNode) {",
        "                    this.parentNode.removeChild(this);",
        "                }",
        "            };",
        "        }",
        "        if (window.Element && !Element.prototype.matches) {",
        "            Element.prototype.matches = Element.prototype.webkitMatchesSelector;",
        "        }",
        "        if (window.Element && !Element.prototype.closest) {",
        "            Element.prototype.closest = function(sel) {",
        "                var el = this;",
        "                while (el && el.nodeType === 1) {",
        "                    if (el.matches(sel)) {",
        "                        return el;",
        "                    }",
        "                    el = el.parentNode;",
        "                }",
        "                return null;",
        "            };",
        "        }",
        "        if (!String.prototype.includes) {",
        "            String.prototype.includes = function(s, p) {",
        "                return this.indexOf(s, p) !== -1;",
        "            };",
        "        }",
        "        if (!String.prototype.startsWith) {",
        "            String.prototype.startsWith = function(s, p) {",
        "                p = p || 0;",
        "                return this.substr(p, s.length) === s;",
        "            };",
        "        }",
        "        if (!Array.prototype.includes) {",
        "            Array.prototype.includes = function(x) {",
        "                return this.indexOf(x) !== -1;",
        "            };",
        "        }",
        "        if (!Array.from) {",
        "            Array.from = function(a) {",
        "                return Array.prototype.slice.call(a);",
        "            };",
        "        }",
        "        if (!Object.assign) {",
        "            Object.assign = function(t) {",
        "                for (var i = 1; i < arguments.length; i++) {",
        "                    var s = arguments[i];",
        "                    for (var k in s) {",
        "                        if (Object.prototype.hasOwnProperty.call(s, k)) {",
        "                            t[k] = s[k];",
        "                        }",
        "                    }",
        "                }",
        "                return t;",
        "            };",
        "        }",
        "    } catch (e) {}",
        "})();",
        "// flexbox with the -webkit- prefixes old Safari needs (and position: sticky); and Gplex 8.14's white label on",
        "// the 2015 look's invite button, which Gplex Legacy (7.2.29, kept as it is) draws in the link colour",
        "function gpxPrefixCss(css) {",
        '    css = String(css) + \'html[gplex-plus="g2015"] a.btn{color:#fff}html[gplex-plus="g2015"] a.btn.grey{color:#212121}\';',
        '    return css.replace(/display:\\s*inline-flex/g, "display:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex")',
        '        .replace(/display:\\s*flex/g, "display:-webkit-box;display:-webkit-flex;display:flex")',
        '        .replace(/position:\\s*sticky/g, "position:-webkit-sticky;position:sticky")',
        '        .replace(/([;{]\\s*)(flex|flex-direction|flex-wrap|align-items|align-self|justify-content|order|transform|transition|user-select|appearance)\\s*:([^;}]*)/g,',
        '            "$1-webkit-$2:$3;$2:$3");',
        "}"
    );
}
let code = prelude.join("\n") + "\n" + block;

if (variant === "legacy") {
    // the Legacy script is already lowered for Safari 9; iOS 6 to 8 want ES5 throughout
    const babel = require("./tools/node_modules/@babel/core");
    code = babel.transformSync(code, {
        presets: [[require.resolve("./tools/node_modules/@babel/preset-env"), { targets: { ios: "6" }, modules: false }]],
        compact: false,
        comments: true,
        sourceType: "script",
        configFile: false,
        babelrc: false
    }).code;
    // must parse as ES5
    const acorn = require("/home/user/Gplex-Fixed/build/node_modules/acorn");
    acorn.parse(code, { ecmaVersion: 5, sourceType: "script" });
} else {
    const acorn = require("/home/user/Gplex-Fixed/build/node_modules/acorn");
    acorn.parse(code, { ecmaVersion: 2020, sourceType: "script" });
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, code);
console.log(variant + ": " + output + " (" + code.length + " bytes from Gplex " + version + ")");
