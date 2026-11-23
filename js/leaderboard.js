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
  function localSubmit(name, score, info) {
    const l = localList(); l.push({ name, score, ts: Date.now(), info });
    l.sort((a, b) => b.score - a.score);
    try { localStorage.setItem(LKEY, JSON.stringify(l.slice(0, 25))); } catch (e) {}
  }

  // ---- supabase (REST, no library) ----
  function supa(path, opts = {}) {
    return fetch(cfg.supabaseUrl.replace(/\/$/, "") + "/rest/v1/" + path, Object.assign({}, opts, {
      headers: Object.assign({ apikey: cfg.supabaseAnonKey, Authorization: "Bearer " + cfg.supabaseAnonKey, "Content-Type": "application/json" }, opts.headers || {})
    }));
  }

  // info: how the run went (hero class, distance, kills, lights, best stash, d20), shown when a row is clicked
  const cleanInfo = i => {
    if (!i || typeof i !== "object") return null;
    const n = v => Math.max(0, Math.floor(Number(v) || 0)), o = { cls: String(i.cls || "").replace(/[^a-z]/g, "").slice(0, 10), dist: n(i.dist), kills: n(i.kills), lights: n(i.lights), haul: n(i.haul), pieces: Math.min(6, n(i.pieces)) };
    if (i.roll) { o.roll = Math.min(20, n(i.roll)); o.mult = Math.round((Number(i.mult) || 0) * 100) / 100; }
    return o;
  };
  LB.submit = async function (rawName, score, info) {
    info = cleanInfo(info);
    await LB.ready;
    const name = clean(rawName); score = Math.floor(score);
    if (LB.mode === "claude") {
      const ref = db.doc("scores/" + LB.me);
      const cur = await withTimeout(ref.get());
      const prev = cur.exists ? cur.data() : null;
      // keep each player's 10 best runs (not just the best), so the board can list runs
      const run = { name, score, ts: Date.now(), info };
      const runs = (prev && Array.isArray(prev.runs) ? prev.runs : prev && prev.best ? [{ name: prev.name, score: prev.best, ts: prev.ts || 0 }] : [])
        .concat(run).sort((a, b) => b.score - a.score).slice(0, 10);
      const best = runs[0].score;
      if (!runs.includes(run)) return { saved: false, best }; // not one of this player's 10 best
      await withTimeout(ref.set({ name, best, ts: Date.now(), runs }));
      return { saved: true, best };
    }
    if (LB.mode === "supabase") {
      const r = await withTimeout(supa("scores", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ name, score, info }) }));
      if (!r.ok) { // an older table without the info column: post the bare score
        const r2 = await withTimeout(supa("scores", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ name, score }) }));
        if (!r2.ok) throw new Error("supabase " + r2.status);
      }
      return { saved: true };
    }
    localSubmit(name, score, info); return { saved: true };
  };

  LB.top = async function (n = 25) {
    await LB.ready;
    if (LB.mode === "claude") {
      const snap = await withTimeout(db.collection("scores").orderBy("best", "desc").limit(n).get());
      const out = [];
      snap.docs.forEach(d => {
        const v = d.data() || {}, runs = Array.isArray(v.runs) && v.runs.length ? v.runs : [{ name: v.name, score: v.best }];
        runs.forEach(r => out.push({ name: clean(r.name || v.name), score: Math.floor(Number(r.score) || 0), me: d.id === LB.me, ts: r.ts || 0, info: cleanInfo(r.info) }));
      });
      return out.sort((a, b) => b.score - a.score).slice(0, n);
    }
    if (LB.mode === "supabase") {
      let r = await withTimeout(supa("scores?select=name,score,info,created_at&order=score.desc&limit=" + n));
      if (!r.ok) r = await withTimeout(supa("scores?select=name,score,created_at&order=score.desc&limit=" + n)); // table without info
      if (!r.ok) throw new Error("supabase " + r.status);
      return (await r.json()).map(row => ({ name: clean(row.name), score: Math.floor(row.score), ts: Date.parse(row.created_at) || 0, info: cleanInfo(row.info) })); // every run, not one per name
    }
    return localList().slice(0, n).map(r => Object.assign({}, r, { info: cleanInfo(r.info) }));
  };

  LB.label = () => ({ claude: "Global · shared with friends", supabase: "Global · online", local: "This device only" })[LB.mode];
  LB.clean = clean;
  window.LB = LB;
})();
