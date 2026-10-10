// ---- Gplex YouTube: InnerTube ----
// The page's ytcfg: the client version, the visitor id, whether you are signed in, the sign-in link.
const CFG = {};
function setConfig(cfg) {
    Object.assign(CFG, cfg || {});
}
function signedIn() {
    return CFG.LOGGED_IN === true;
}
function signInUrl() {
    return CFG.SIGNIN_URL || "https://accounts.google.com/ServiceLogin?service=youtube&continue=" + encodeURIComponent(ORIGIN + "/signin?action_handle_signin=true&app=desktop&next=" + encodeURIComponent(location.pathname + location.search));
}
function cookieValue(name) {
    const m = new RegExp("(?:^|; )" + name + "=([^;]*)").exec(document.cookie);
    return m ? decodeURIComponent(m[1]) : "";
}
async function sha1Hex(s) {
    const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(s));
    return Array.from(new Uint8Array(buf), function(b) { return b.toString(16).padStart(2, "0"); }).join("");
}
// The Authorization header YouTube's own app sends when signed in: SAPISIDHASH <time>_<sha1(time SAPISID origin)>
async function authorization() {
    const sapisid = cookieValue("SAPISID") || cookieValue("__Secure-3PAPISID");
    if (!sapisid) {
        return "";
    }
    const t = Math.floor(Date.now() / 1000);
    return "SAPISIDHASH " + t + "_" + await sha1Hex(t + " " + sapisid + " " + ORIGIN);
}
async function innertube(endpoint, body) {
    const ctx = JSON.parse(JSON.stringify(CFG.INNERTUBE_CONTEXT || { client: { clientName: "WEB", clientVersion: CFG.INNERTUBE_CLIENT_VERSION || "2.20261009.01.00", hl: "en", gl: "US" } }));
    delete ctx.clickTracking;
    const headers = {
        "Content-Type": "application/json",
        "X-Youtube-Client-Name": String(CFG.INNERTUBE_CONTEXT_CLIENT_NAME || 1),
        "X-Youtube-Client-Version": ctx.client.clientVersion,
        "X-Origin": ORIGIN
    };
    if (CFG.VISITOR_DATA) {
        headers["X-Goog-Visitor-Id"] = CFG.VISITOR_DATA;
    }
    if (signedIn()) {
        const auth = await authorization();
        if (auth) {
            headers.Authorization = auth;
            headers["X-Goog-AuthUser"] = String(CFG.SESSION_INDEX || 0);
            if (CFG.DELEGATED_SESSION_ID) {
                headers["X-Goog-PageId"] = CFG.DELEGATED_SESSION_ID;
            }
        }
    }
    const res = await fetch("/youtubei/v1/" + endpoint + "?prettyPrint=false", {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(Object.assign({ context: ctx }, body))
    });
    if (!res.ok) {
        throw new Error("YouTube answered " + res.status + " to " + endpoint);
    }
    return res.json();
}
const api = {
    browse: function(browseId, params, extra) {
        return innertube("browse", Object.assign({ browseId: browseId }, params ? { params: params } : {}, extra || {}));
    },
    search: function(query, params) {
        return innertube("search", Object.assign({ query: query }, params ? { params: params } : {}));
    },
    next: function(body) {
        return innertube("next", body);
    },
    // a continuation of any kind: the endpoint it belongs to is remembered with its token
    more: function(cont) {
        return innertube(cont.endpoint || "browse", { continuation: cont.token });
    },
    guide: function() {
        return innertube("guide", {});
    },
    post: innertube
};
// A continuation: {token, endpoint} from a continuationItemRenderer / continuationItemViewModel /
// continuationEndpoint / nextContinuationData, or null.
function continuationOf(node, endpoint) {
    if (!node) {
        return null;
    }
    const r = node.continuationItemRenderer || node.continuationItemViewModel || node;
    const ep = r.continuationEndpoint || (r.button && r.button.buttonRenderer && r.button.buttonRenderer.command) || r.serviceEndpoint || r.navigationEndpoint || r;
    const cmd = ep.continuationCommand || (ep.innertubeCommand && ep.innertubeCommand.continuationCommand);
    if (cmd && cmd.token) {
        const api = ep.commandMetadata && ep.commandMetadata.webCommandMetadata && ep.commandMetadata.webCommandMetadata.apiUrl;
        return { token: cmd.token, endpoint: endpoint || (api ? api.replace("/youtubei/v1/", "") : "browse") };
    }
    const next = r.nextContinuationData || (r.continuations && r.continuations[0] && r.continuations[0].nextContinuationData);
    if (next && next.continuation) {
        return { token: next.continuation, endpoint: endpoint || "browse" };
    }
    return null;
}
// The items a continuation response appends (or reloads), wherever YouTube put them.
function continuationItems(resp) {
    const out = [];
    const actions = [].concat(resp.onResponseReceivedActions || [], resp.onResponseReceivedEndpoints || [], resp.onResponseReceivedCommands || []);
    actions.forEach(function(a) {
        const x = a.appendContinuationItemsAction || a.reloadContinuationItemsCommand;
        if (x && x.continuationItems) {
            out.push.apply(out, x.continuationItems);
        }
    });
    if (!out.length && resp.continuationContents) {
        const c = resp.continuationContents;
        const inner = c.itemSectionContinuation || c.sectionListContinuation || c.gridContinuation || c.playlistVideoListContinuation || c.commentRepliesContinuation;
        if (inner) {
            out.push.apply(out, inner.contents || inner.items || []);
            (inner.continuations || []).forEach(function(k) {
                out.push(k);
            });
        }
    }
    return out;
}
// Search suggestions, from the same service YouTube's search box uses.
async function suggestions(q) {
    const client = CFG.INNERTUBE_CONTEXT && CFG.INNERTUBE_CONTEXT.client || {};
    const url = "https://suggestqueries-clients6.youtube.com/complete/search?client=youtube&ds=yt&xhr=t&hl=" + encodeURIComponent(client.hl || "en") + "&gl=" + encodeURIComponent(client.gl || "US") + "&q=" + encodeURIComponent(q);
    const res = await fetch(url, { credentials: "omit" });
    const j = await res.json();
    return (j[1] || []).map(function(x) { return x[0]; });
}
