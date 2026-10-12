// lists the identifiers a block of script uses but does not define (its needs from the rest of Gplex)
const fs = require("fs");
const acorn = require("/home/user/Gplex-Fixed/build/node_modules/acorn");
const walk = require("/home/user/Gplex-Fixed/build/node_modules/acorn-walk");
const [, , file, startMark, endMark] = process.argv;
const src = fs.readFileSync(file, "utf8");
const a = src.indexOf(startMark), b = src.indexOf(endMark, a);
if (a < 0 || b < 0) { console.error("marks not found", a, b); process.exit(1); }
const block = src.slice(a, b);
console.log("block: lines", block.split("\n").length, "bytes", block.length);
const ast = acorn.parse(block, { ecmaVersion: "latest", sourceType: "script", allowHashBang: true });
// declared names at every scope: approximate by collecting all declarations anywhere in the block
const declared = new Set();
walk.full(ast, (n) => {
    if (n.type === "VariableDeclarator" && n.id.type === "Identifier") declared.add(n.id.name);
    if ((n.type === "FunctionDeclaration" || n.type === "FunctionExpression" || n.type === "ClassDeclaration") && n.id) declared.add(n.id.name);
    if (n.type === "FunctionDeclaration" || n.type === "FunctionExpression" || n.type === "ArrowFunctionExpression") n.params.forEach(p => walk.full(p, (q) => { if (q.type === "Identifier") declared.add(q.name); }));
    if (n.type === "CatchClause" && n.param) walk.full(n.param, (q) => { if (q.type === "Identifier") declared.add(q.name); });
    if (n.type === "VariableDeclarator" && n.id.type !== "Identifier") walk.full(n.id, (q) => { if (q.type === "Identifier") declared.add(q.name); });
});
const used = new Map();
walk.ancestor(ast, {
    Identifier(n, anc) {
        const p = anc[anc.length - 2];
        if (p && ((p.type === "MemberExpression" && p.property === n && !p.computed) || (p.type === "Property" && p.key === n && !p.computed && !p.shorthand) || (p.type === "MethodDefinition" && p.key === n) || (p.type === "PropertyDefinition" && p.key === n))) return;
        if (!declared.has(n.name)) used.set(n.name, (used.get(n.name) || 0) + 1);
    }
});
const browser = new Set(["window","document","console","setTimeout","clearTimeout","setInterval","clearInterval","String","Number","Array","Object","Math","JSON","Date","RegExp","Error","TypeError","Promise","encodeURIComponent","decodeURIComponent","parseInt","parseFloat","isNaN","isFinite","undefined","NaN","Infinity","navigator","location","history","localStorage","sessionStorage","fetch","URL","URLSearchParams","MutationObserver","Event","CustomEvent","KeyboardEvent","MouseEvent","HTMLElement","Element","Node","NodeList","FormData","XMLHttpRequest","requestAnimationFrame","cancelAnimationFrame","Image","Audio","Blob","File","FileReader","TextEncoder","TextDecoder","Map","Set","WeakMap","Symbol","Reflect","Proxy","Intl","getComputedStyle","matchMedia","screen","alert","confirm","prompt","atob","btoa","crypto","performance","queueMicrotask","structuredClone","globalThis","arguments","this","DOMParser","Range","Selection","ResizeObserver","IntersectionObserver","AbortController","Headers","Request","Response","escape","unescape","Boolean","Function","eval","trustedTypes","self","top","parent","frames","innerWidth","innerHeight","scrollTo","scrollBy","scrollX","scrollY","open","close","focus","blur","print","HTMLInputElement","HTMLAnchorElement","HTMLImageElement","Text","DocumentFragment","CSS","visualViewport","devicePixelRatio","WebSocket","EventSource","Worker","SharedWorker","BroadcastChannel","Notification","Option","Touch","TouchEvent","PointerEvent","InputEvent","FocusEvent","DragEvent","ClipboardEvent","WheelEvent","AnimationEvent","TransitionEvent","HashChangeEvent","PopStateEvent","StorageEvent","MessageEvent","ErrorEvent","ProgressEvent","Uint8Array","ArrayBuffer","DataView","Int32Array","Float32Array","Float64Array","Uint32Array","Uint16Array","Int8Array","Int16Array","Uint8ClampedArray","BigInt","void","onerror","postMessage","addEventListener","removeEventListener","dispatchEvent","HTMLCollection","SVGElement","Path2D","OffscreenCanvas","ImageData","HTMLCanvasElement","CanvasRenderingContext2D","speechSynthesis","SpeechSynthesisUtterance","ShadowRoot","customElements","HTMLTemplateElement","getSelection","requestIdleCallback","cancelIdleCallback","structuredClone","HTMLIFrameElement","HTMLFormElement","HTMLButtonElement","HTMLSelectElement","HTMLTextAreaElement","HTMLDivElement","HTMLSpanElement","MediaQueryList","Attr","Comment","CharacterData","ProcessingInstruction","XPathResult","XMLSerializer","Document","HTMLDocument","Window","EventTarget","Storage","Location","History","Navigator","Screen"]);
const outside = [...used.entries()].filter(([k]) => !browser.has(k)).sort((x, y) => y[1] - x[1]);
console.log("needs from outside:", outside.map(([k, v]) => k + "(" + v + ")").join(" "));
