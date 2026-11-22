// Debug panel. Open with F9, or add #debug to the URL.
// Shows live state, catches errors, and has cheats for testing.
// "Copy report" puts everything on the clipboard to paste into a bug report.
(function () {
  const G = window.GAME;
  const errors = (window.__errs || []).map(m => ({ t: "load", msg: m }));
  const log = (msg) => { errors.push({ t: new Date().toISOString().slice(11, 19), msg: String(msg).slice(0, 300) }); if (errors.length > 30) errors.shift(); render(); };
  window.addEventListener("error", e => log(`${e.message} @ ${(e.filename || "").split("/").pop()}:${e.lineno}`));
  window.addEventListener("unhandledrejection", e => log("Promise: " + (e.reason && e.reason.message || e.reason)));

  const css = document.createElement("style");
  css.textContent = `
  #dbg{position:fixed;top:8px;left:8px;z-index:50;width:min(320px,calc(100vw - 16px));max-height:calc(100vh - 16px);overflow:auto;
    background:#0b0612ee;color:#f3e9dc;font:11px/1.45 ui-monospace,Menlo,Consolas,monospace;box-shadow:0 0 0 2px #5fd0c8;padding:10px;user-select:text}
  #dbg[hidden]{display:none}
  #dbg h4{margin:8px 0 4px;color:#5fd0c8;font-size:11px;font-weight:600}
  #dbg .kv{display:grid;grid-template-columns:auto 1fr;gap:1px 10px}#dbg .kv b{color:#ffd866;font-weight:400;text-align:right}
  #dbg label{display:flex;gap:6px;align-items:center;cursor:pointer;min-height:24px}
  #dbg button,#dbg select{font:inherit;background:#2b1a3d;color:#f3e9dc;border:0;padding:6px 8px;cursor:pointer;min-height:28px}
  #dbg button:hover{background:#3d2658}
  #dbg .dbg-row{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}
  #dbg .err{color:#ff6b7f;white-space:pre-wrap;word-break:break-word}
  #dbg .top{display:flex;justify-content:space-between;align-items:center}
  #dbg .ok{color:#5fd068}`;
  document.head.appendChild(css);

  const el = document.createElement("div");
  el.id = "dbg"; el.hidden = true;
  el.innerHTML = `
    <div class="top"><b>DEBUG</b><button data-a="close" aria-label="Close debug panel">F9 ✕</button></div>
    <div class="kv" id="dbg-kv"></div>
    <h4>Cheats</h4>
    <label><input type="checkbox" data-o="hitboxes"> Show hitboxes</label>
    <label><input type="checkbox" data-o="god"> God mode (no damage)</label>
    <label><input type="checkbox" data-o="noDread"> Dread never fills</label>
    <label><input type="checkbox" data-o="noSpawn"> No obstacles</label>
    <label>Speed <select data-o="slow"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></label>
    <h4>Spawn</h4>
    <div class="dbg-row"><select id="dbg-type"></select><button data-a="spawn">Spawn</button><button data-a="lights">Lights ×5</button></div>
    <div class="dbg-row"><button data-a="jump">+1000 m</button><button data-a="bank">+500 lights</button><button data-a="unlock">Unlock classes</button></div>
    <div class="dbg-row"><button data-a="reset">Reset save…</button></div>
    <h4>Errors <span id="dbg-ec"></span></h4>
    <div id="dbg-err" class="err"></div>
    <div class="dbg-row"><button data-a="copy">Copy report</button><span id="dbg-msg"></span></div>`;
  document.body.appendChild(el);
  const $ = s => el.querySelector(s);

  $("#dbg-type").innerHTML = Object.keys(G._TYPES).map(t => `<option>${t}</option>`).join("") +
    Object.keys(G.PLATS).map(k => `<option value="plat:${k}">${k} (jump on)</option>`).join("") + '<option value="skate">skateboard</option><option value="dice">dice crate</option>';

  function toggle(on) {
    el.hidden = on === undefined ? !el.hidden : !on;
    if (!el.hidden) render();
  }
  window.addEventListener("keydown", e => { if (e.code === "F9") { e.preventDefault(); toggle(); } });
  if (/debug/.test(location.hash + location.search)) toggle(true);

  el.addEventListener("change", e => {
    const o = e.target.dataset.o; if (!o) return;
    G.debug[o] = e.target.type === "checkbox" ? e.target.checked : Number(e.target.value);
  });
  let resetArmed = false;
  el.addEventListener("click", e => {
    const a = e.target.dataset.a; if (!a) return;
    const msg = $("#dbg-msg"); msg.textContent = "";
    if (a === "close") toggle(false);
    if (a === "spawn") {
      const v = $("#dbg-type").value;
      if (v.startsWith("plat:")) G.spawnPlatform(v.slice(5));
      else if (v === "dice") G.picks.push({ kind: "dice", side: G._P.side, x: 420, h: 7, taken: false, ph: 0, col: "#ff3d57" });
      else if (v === "skate") G.picks.push({ kind: "skate", side: G._P.side, x: 420, h: 12, taken: false, ph: 0, col: "#ff3d57" });
      else G.spawn(v);
    }
    if (a === "lights") G.spawnLights(G._P.side);
    if (a === "jump") { G.dist += 10000; G.t += 60; }
    if (a === "bank") { SAVE.state.shards += 500; SAVE.save(); document.querySelectorAll("#bank,.bank-n").forEach(n => n.textContent = SAVE.state.shards); }
    if (a === "unlock") { SAVE.CLASSES.forEach(c => c.locked = false); msg.textContent = " classes unlocked (this visit)"; }
    if (a === "reset") {
      if (!resetArmed) { resetArmed = true; e.target.textContent = "Click again to wipe"; return; }
      try { localStorage.removeItem("upsidedown.save.v1"); localStorage.removeItem("flipside.local.lb"); } catch (err) {}
      location.reload();
    }
    if (a === "copy") {
      const report = JSON.stringify({ when: new Date().toISOString(), url: location.href, ua: navigator.userAgent,
        screen: [innerWidth, innerHeight, devicePixelRatio], state: snapshot(), save: SAVE.state,
        art: Object.keys(SPR.ART).length, errors }, null, 1);
      navigator.clipboard.writeText(report).then(() => msg.textContent = " copied ✓", () => {
        msg.textContent = " clipboard blocked, report logged to console"; console.log(report);
      });
    }
  });

  function snapshot() {
    const P = G._P;
    const B = window.BUILD || { sha: "local" };
    return { build: (B.sha || "local").slice(0, 7) + (B.time ? " · " + B.time : ""), mode: G.mode, fps: Math.round(G.fps || 0), t: +G.t.toFixed(1), speed: Math.round(G.speed), dist: Math.round(G.dist / 10),
      score: Math.floor(G.score), lights: G.shards, hearts: G.hearts, side: P.side ? "upside down" : "normal",
      h: +P.h.toFixed(1), dread: +G.dread.toFixed(2), obstacles: G.obs.length, lightsOnScreen: G.picks.length,
      shots: G.shots.length, scenery: SCN.state.chunks.map(c => (c.items.map(i => i.key.replace(/^(set|prop)_/, "")).join("+") || "blank")).join(" | "),
      dice: G.dice, diceSaved: SAVE.state.dice, artLoaded: Object.keys(SPR.ART).length, leaderboard: LB.mode };
  }

  function render() {
    if (el.hidden) return;
    const s = snapshot();
    $("#dbg-kv").innerHTML = Object.entries(s).map(([k, v]) => `<span>${k}</span><b>${String(v).replace(/</g, "&lt;")}</b>`).join("");
    $("#dbg-ec").innerHTML = errors.length ? `(${errors.length})` : '<span class="ok">none</span>';
    $("#dbg-err").textContent = errors.map(e => `${e.t} ${e.msg}`).join("\n");
  }
  setInterval(render, 250);
  window.DEBUG = { log, snapshot, toggle, errors };
})();
