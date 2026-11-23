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
      // keep each player's 10 best runs (not just the best), so the board can list runs
      const run = { name, score, ts: Date.now() };
      const runs = (prev && Array.isArray(prev.runs) ? prev.runs : prev && prev.best ? [{ name: prev.name, score: prev.best, ts: prev.ts || 0 }] : [])
        .concat(run).sort((a, b) => b.score - a.score).slice(0, 10);
      const best = runs[0].score;
      if (!runs.includes(run)) return { saved: false, best }; // not one of this player's 10 best
      await withTimeout(ref.set({ name, best, ts: Date.now(), runs }));
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
      const out = [];
      snap.docs.forEach(d => {
        const v = d.data() || {}, runs = Array.isArray(v.runs) && v.runs.length ? v.runs : [{ name: v.name, score: v.best }];
        runs.forEach(r => out.push({ name: clean(r.name || v.name), score: Math.floor(Number(r.score) || 0), me: d.id === LB.me }));
      });
      return out.sort((a, b) => b.score - a.score).slice(0, n);
    }
    if (LB.mode === "supabase") {
      const r = await withTimeout(supa("scores?select=name,score&order=score.desc&limit=" + n));
      if (!r.ok) throw new Error("supabase " + r.status);
      return (await r.json()).map(row => ({ name: clean(row.name), score: Math.floor(row.score) })); // every run, not one per name
    }
    return localList().slice(0, n);
  };

  LB.label = () => ({ claude: "Global · shared with friends", supabase: "Global · online", local: "This device only" })[LB.mode];
  LB.clean = clean;
  window.LB = LB;
})();
