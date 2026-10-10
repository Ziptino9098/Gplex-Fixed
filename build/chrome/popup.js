// Gplex Extended for Chrome: the toolbar button's menu
/* global chrome */
"use strict";
const $ = function(id) {
    return document.getElementById(id);
};
const P = "v:";
$("ver").textContent = chrome.runtime.getManifest().version;

// the page's Gplex commands (what a userscript manager lists under the script)
chrome.tabs.query({ active: true, currentWindow: true }).then(function(tabs) {
    const tab = tabs[0];
    const none = function() {
        const d = document.createElement("div");
        d.className = "none";
        d.textContent = "Gplex isn't running on this page.";
        $("cmds").appendChild(d);
    };
    if (!tab) {
        return none();
    }
    return chrome.tabs.sendMessage(tab.id, { type: "gplex-menu" }, { frameId: 0 }).then(function(r) {
        if (!r || !r.items || !r.items.length) {
            return none();
        }
        r.items.forEach(function(name, i) {
            const b = document.createElement("button");
            b.className = "item";
            b.textContent = name;
            b.addEventListener("click", function() {
                chrome.tabs.sendMessage(tab.id, { type: "gplex-run", index: i }, { frameId: 0 }).catch(function() {}).finally(function() {
                    window.close();
                });
            });
            $("cmds").appendChild(b);
        });
    }).catch(none);
});

// Gplex+: the community, and the public invite link for joining it
[["plus", "https://plus.gplexextended.com/"], ["join", "https://plus.gplexextended.com/join?invite=VurHy0zUr0hlQ0xi"]].forEach(function(x) {
    $(x[0]).addEventListener("click", function() {
        chrome.tabs.create({ url: x[1] }).then(function() {
            window.close();
        });
    });
});

$("open").addEventListener("click", function() {
    chrome.tabs.create({ url: "https://www.google.com/gplex" }).then(function() {
        window.close();
    });
});

const readAll = function() {
    return chrome.storage.local.get(null).then(function(all) {
        const v = {};
        Object.keys(all || {}).forEach(function(k) {
            if (k.indexOf(P) === 0) {
                v[k.slice(P.length)] = all[k];
            }
        });
        return v;
    });
};
$("export").addEventListener("click", function() {
    readAll().then(function(v) {
        const box = $("box");
        box.style.display = "block";
        box.value = JSON.stringify(v, null, 1);
        box.select();
        $("msg").textContent = "Copy this text to keep your settings.";
    });
});

// import: this extension's export, the Firefox add-on's, or the JSON on Tampermonkey's "Storage" tab
// for Gplex ({"data": {...}})
let importing = false;
$("import").addEventListener("click", function() {
    const box = $("box");
    if (!importing) {
        importing = true;
        box.style.display = "block";
        box.value = "";
        box.focus();
        $("import").textContent = "Import the settings pasted above";
        $("msg").textContent = "Paste the settings, then click again. This replaces the current settings.";
        return;
    }
    let v;
    try {
        v = JSON.parse(box.value);
    } catch (e) {
        $("msg").textContent = "That isn't a settings file.";
        return;
    }
    if (v && v.data && typeof v.data === "object" && !Array.isArray(v.data)) {
        v = v.data;
    }
    if (!v || typeof v !== "object" || Array.isArray(v)) {
        $("msg").textContent = "That isn't a settings file.";
        return;
    }
    chrome.storage.local.get(null).then(function(all) {
        const old = Object.keys(all || {}).filter(function(k) {
            return k.indexOf(P) === 0;
        });
        const set = {};
        Object.keys(v).forEach(function(k) {
            set[P + k] = v[k];
        });
        return chrome.storage.local.remove(old).then(function() {
            return chrome.storage.local.set(set);
        });
    }).then(function() {
        importing = false;
        $("import").textContent = "Import settings (from here or Tampermonkey)";
        box.style.display = "none";
        $("msg").textContent = Object.keys(v).length + " settings imported. Reload your Google tabs to see them.";
    });
});
