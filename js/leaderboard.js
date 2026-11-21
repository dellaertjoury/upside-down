// Leaderboard with three backends, picked automatically:
//  1. "claude"   - published as a Claude artifact: shared artifact database
//  2. "supabase" - hosted anywhere (GitHub Pages) with js/config.js filled in
//  3. "local"    - fallback: best runs on this device only
(function () {
  const LB = { mode: "local", ready: null, me: null };
  let db = null;

  const clean = s => String(s || "").toUpperCase().replace(/[^A-Z0-9 _\-]/g, "").trim().slice(0, 12) || "PLAYER";
  const withTimeout = (p, ms = 10000) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]);
  const cfg = window.UPSIDE_CONFIG || {};
  const hasSupa = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);

  LB.ready = (async () => {
    try {
      const c = window.claude;
      if (c && typeof c.use === "function") {
        const [d, u] = await Promise.all([c.use("db"), c.use("user")]);
        const id = u ? await u.id() : null;
        if (d && id) { db = d; LB.me = id; LB.mode = "claude"; return; }
      }
    } catch (e) { /* fall through */ }
    if (hasSupa) LB.mode = "supabase";
  })();

  // ---- local ----
  const LKEY = "flipside.local.lb";
  function localList() { try { return JSON.parse(localStorage.getItem(LKEY) || "[]"); } catch (e) { return []; } }
  function localSubmit(name, score) {
    const l = localList(); l.push({ name, score, ts: Date.now() });
    l.sort((a, b) => b.score - a.score);
    try { localStorage.setItem(LKEY, JSON.stringify(l.slice(0, 25))); } catch (e) {}
  }

  // ---- supabase (REST, no library) ----
  function supa(path, opts = {}) {
    return fetch(cfg.supabaseUrl.replace(/\/$/, "") + "/rest/v1/" + path, Object.assign({}, opts, {
      headers: Object.assign({ apikey: cfg.supabaseAnonKey, Authorization: "Bearer " + cfg.supabaseAnonKey, "Content-Type": "application/json" }, opts.headers || {})
    }));
  }

  LB.submit = async function (rawName, score) {
    await LB.ready;
    const name = clean(rawName); score = Math.floor(score);
    if (LB.mode === "claude") {
      const ref = db.doc("scores/" + LB.me);
      const cur = await withTimeout(ref.get());
      const prev = cur.exists ? cur.data() : null;
      if (prev && prev.best >= score && prev.name === name) return { saved: false, best: prev.best };
      const best = Math.max(score, prev ? prev.best || 0 : 0);
      await withTimeout(ref.set({ name, best, ts: Date.now() }));
      return { saved: true, best };
    }
    if (LB.mode === "supabase") {
      const r = await withTimeout(supa("scores", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ name, score }) }));
      if (!r.ok) throw new Error("supabase " + r.status);
      return { saved: true };
    }
    localSubmit(name, score); return { saved: true };
  };

  LB.top = async function (n = 25) {
    await LB.ready;
    if (LB.mode === "claude") {
      const snap = await withTimeout(db.collection("scores").orderBy("best", "desc").limit(n).get());
      return snap.docs.map(d => { const v = d.data() || {}; return { name: clean(v.name), score: Math.floor(Number(v.best) || 0), me: d.id === LB.me }; });
    }
    if (LB.mode === "supabase") {
      const r = await withTimeout(supa("scores?select=name,score&order=score.desc&limit=200"));
      if (!r.ok) throw new Error("supabase " + r.status);
      const rows = await r.json(), seen = new Set(), out = [];
      for (const row of rows) { const nm = clean(row.name); if (seen.has(nm)) continue; seen.add(nm); out.push({ name: nm, score: Math.floor(row.score) }); if (out.length >= n) break; }
      return out;
    }
    return localList().slice(0, n);
  };

  LB.label = () => ({ claude: "Global · shared with friends", supabase: "Global · online", local: "This device only" })[LB.mode];
  LB.clean = clean;
  window.LB = LB;
})();
