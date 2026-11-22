// Bug / idea reports: a screenshot of the current game frame + a comment +
// the game state at that moment. Kept in this browser (IndexedDB) until you
// export them as one .json file (open it with tools/unpack_reports.py).
(function () {
  const DB = "upsidedown-reports", STORE = "reports";
  let dbp = null, mem = null, memId = 1;   // mem = in-memory fallback when IndexedDB is unavailable

  function db() {
    if (!dbp) dbp = new Promise((res, rej) => {
      try {
        const r = indexedDB.open(DB, 1);
        r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    }).catch(() => { mem = mem || []; return null; });
    return dbp;
  }
  async function run(mode, fn) {
    const d = await db();
    if (!d) return null;
    return new Promise((res, rej) => {
      const t = d.transaction(STORE, mode), req = fn(t.objectStore(STORE));
      t.oncomplete = () => res(req && req.result); t.onerror = () => rej(t.error);
    });
  }

  // the canvas only: menus are HTML on top of it and don't show in the shot
  function capture() {
    try { return document.getElementById("game").toDataURL("image/jpeg", 0.85); } catch (e) { return null; }
  }
  function context() {
    const G = window.GAME, P = G._P || {}, S = SAVE.state, B = window.BUILD || {};
    const near = (G.obs || []).filter(o => o.x > -20 && o.x < 420).map(o =>
      `${o.side ? "UD" : "top"} ${o.platform ? "plat:" + o.kind : o.type} x${Math.round(o.x)} h${Math.round(o.h0)}-${Math.round(o.h1)}${o.dead ? " dead" : ""}`);
    let state = null; try { state = window.DEBUG ? DEBUG.snapshot() : null; } catch (e) {}
    return {
      when: new Date().toISOString(), build: (B.sha || "local").slice(0, 7) + (B.time ? " " + B.time : ""),
      url: location.href, ua: navigator.userAgent, screen: [innerWidth, innerHeight, devicePixelRatio],
      lang: I18N.lang, mode: G.mode, cls: S.sheet && S.sheet.cls, upgrades: S.up, lights: S.shards, best: S.best, runs: S.runs,
      player: { side: P.side, h: +(P.h || 0).toFixed(1), grounded: P.grounded, roll: P.roll > 0, skate: P.skate > 0, onPlatform: !!P.plat },
      state, onScreen: near, errors: (window.DEBUG && DEBUG.errors || []).slice(-10),
    };
  }

  async function add(r) {
    const rec = Object.assign({ created: new Date().toISOString() }, r);
    if (await db()) return run("readwrite", s => s.add(rec));
    rec.id = memId++; mem.push(rec); return rec.id;
  }
  async function list() {
    if (await db()) return (await run("readonly", s => s.getAll())) || [];
    return mem.slice();
  }
  async function del(id) {
    if (await db()) return run("readwrite", s => s.delete(id));
    mem = mem.filter(r => r.id !== id);
  }
  async function clear() {
    if (await db()) return run("readwrite", s => s.clear());
    mem = [];
  }

  function fileName() { return "upside-down-reports-" + new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-") + ".json"; }
  async function exportFile() {
    const reports = await list();
    const data = { game: "The Upside Down", exported: new Date().toISOString(), build: (window.BUILD || {}).sha || "local", count: reports.length, reports };
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = fileName();
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    return reports.length;
  }
  // without screenshots, to paste into a chat
  async function asText() {
    const reports = await list();
    return reports.map((r, i) => {
      const c = r.ctx || {}, s = c.state || {};
      return `#${i + 1} [${r.kind === "idea" ? "IDEA" : "BUG"}] ${r.comment}\n` +
        `   ${c.when || r.created} · build ${c.build} · ${c.mode} · ${c.cls} · ${s.dist != null ? s.dist + " m" : ""} speed ${s.speed ?? "?"} · side ${c.player ? (c.player.side ? "UD" : "top") : "?"}` +
        (c.onScreen && c.onScreen.length ? `\n   on screen: ${c.onScreen.join(", ")}` : "") +
        (c.errors && c.errors.length ? `\n   errors: ${c.errors.map(e => e.msg).join(" | ")}` : "");
    }).join("\n\n");
  }

  window.REPORT = { capture, context, add, list, del, clear, exportFile, asText };
})();
