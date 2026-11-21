// Menus: hub (outside the Hellfire Club), character sheet, upgrades,
// leaderboard, pause, game over.
(function () {
  const $ = s => document.querySelector(s);
  const panels = ["menu", "sheet", "upgrades", "leaderboard", "pause", "over"];
  const st = SAVE.state;
  const sign = n => (n >= 0 ? "+" : "") + n;

  if (!st.sheet) { st.sheet = SAVE.newSheet(); SAVE.save(); }
  const sheet = () => st.sheet;

  function applyLook() {
    const s = sheet();
    const hair = SAVE.LOOKS.hair.find(h => h.id === s.hair) || SAVE.LOOKS.hair[0];
    const jacket = SAVE.LOOKS.jacket.find(j => j.id === s.jacket) || SAVE.LOOKS.jacket[0];
    SPR.buildPlayer({ hair: hair.c, jacket: jacket.c });
  }
  applyLook();

  function show(name) {
    panels.forEach(p => $("#p-" + p).classList.toggle("hidden", p !== name));
    if (name === "menu") refreshMenu();
    if (name === "sheet") renderSheet();
    if (name === "upgrades") renderUpgrades();
    if (name === "leaderboard") renderBoard();
    document.querySelectorAll(".bank-n").forEach(n => n.textContent = st.shards);
    const first = name && $("#p-" + name + " .btn");
    if (first && !matchMedia("(pointer:coarse)").matches) first.focus({ preventScroll: true });
  }
  const hideAll = () => { panels.forEach(p => $("#p-" + p).classList.add("hidden")); if (document.activeElement) document.activeElement.blur(); };

  function refreshMenu() {
    $("#bank").textContent = st.shards;
    $("#best").textContent = st.best;
    $("#mute").textContent = st.muted ? "Sound off" : "Sound on";
    const s = sheet(), cls = SAVE.CLASSES.find(c => c.id === s.cls);
    $("#who").innerHTML = "";
    const n = document.createElement("b"); n.textContent = s.name || "ADVENTURER";
    const c = document.createElement("span");
    c.textContent = ` · ${cls.name} · ` + SAVE.ABIL.map(a => a + " " + SAVE.score(s, a)).join(" ");
    $("#who").append(n, c);
  }

  // ---- navigation ----
  function startRun() { hideAll(); GAME.start(); }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-go]"); if (!b) return;
    SFX.click();
    const go = b.dataset.go;
    if (go === "play") return startRun();
    if (go === "resume") { hideAll(); GAME.resume(); return; }
    if (go === "quit" || (go === "menu" && GAME.mode !== "attract")) GAME.toHub();
    show(go === "quit" ? "menu" : go);
  });
  GAME.onPause = () => show("pause");

  $("#mute").addEventListener("click", () => { st.muted = !st.muted; SFX.setMuted(st.muted); SAVE.save(); refreshMenu(); });
  SFX.setMuted(st.muted);

  // Space at the hub or after a run = start
  window.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") { if (e.key === "Enter") e.target.blur(); return; }
    const hubOpen = !$("#p-menu").classList.contains("hidden") || !$("#p-over").classList.contains("hidden");
    if (hubOpen && e.code === "Space" && (GAME.mode === "attract" || GAME.mode === "over")) { e.preventDefault(); startRun(); }
  });

  // ---- character sheet ----
  let rolling = false;
  function renderSheet() {
    const s = sheet();
    $("#cname").value = s.name;
    // classes
    $("#classes").innerHTML = SAVE.CLASSES.map(c => {
      const bonus = Object.entries(c.bonus).map(([k, v]) => `${k} +${v}`).join(", ");
      return `<button class="btn tiny cls${s.cls === c.id ? " on" : ""}" data-cls="${c.id}" ${c.locked ? "disabled" : ""} title="${c.desc}">
        ${c.name}<small>${c.locked ? "soon" : bonus}</small></button>`;
    }).join("");
    // looks
    ["hair", "jacket"].forEach(k => {
      $("#" + k).innerHTML = SAVE.LOOKS[k].map(o =>
        `<button class="sw${s[k] === o.id ? " on" : ""}" data-look="${k}" data-id="${o.id}" style="background:${o.c[0]}" aria-label="${k} ${o.id}"></button>`).join("");
    });
    renderAbil();
    drawPreview();
  }
  function renderAbil(fake) {
    const s = sheet();
    $("#abil").innerHTML = SAVE.ABIL.map(a => {
      const base = fake ? fake[a].total : s.scores[a];
      const cls = SAVE.CLASSES.find(c => c.id === s.cls).bonus[a] || 0;
      const total = base + cls, m = SAVE.mod(total);
      const dice = fake ? fake[a].dice : (s.dice && s.dice[a]) || [];
      const low = Math.min(...dice);
      let dropped = false;
      const faces = dice.map(d => { const drop = !dropped && d === low; if (drop) dropped = true; return `<i class="${drop ? "drop" : ""}">${d}</i>`; }).join("");
      return `<div class="ab${fake ? " spin" : ""}"><span class="an">${a}</span><span class="av">${total}</span>
        <span class="am">${sign(m)}</span><span class="dice">${faces}</span>
        <span class="ai">${SAVE.ABIL_INFO[a]}${cls ? ` <em>+${cls} class</em>` : ""}</span></div>`;
    }).join("");
    const used = s.rerolls || 0, free = SAVE.FREE_REROLLS - used;
    $("#roll").textContent = free > 0 ? `Reroll (${free} free)` : `Reroll · ${SAVE.REROLL_COST} ◆`;
    $("#roll").disabled = rolling || (free <= 0 && st.shards < SAVE.REROLL_COST);
    $("#roll-note").textContent = "4d6, drop the lowest";
    const r = SAVE.runStats(s);
    const rows = [
      ["Hearts", r.hearts], ["Bat reach", r.reach + " px"], ["Jump", Math.round(r.jumpV / 3.2) + "%"],
      ["Block", r.block.toFixed(2) + " s"], ["Dread time", r.battery.toFixed(1) + " s"],
      ["Magnet", r.magnet + " px"], ["Shard bonus", "1 per " + r.bonusDiv + " pts"],
    ];
    $("#derived").innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
  }
  function drawPreview() {
    const x = $("#preview").getContext("2d");
    x.clearRect(0, 0, 12, 16); x.drawImage(SPR.ART.run2 || SPR.S.run2, 0, 0, 12, 16);
  }

  $("#cname").addEventListener("input", e => { sheet().name = LB.clean(e.target.value) === "PLAYER" ? "" : LB.clean(e.target.value); SAVE.save(); });
  $("#p-sheet").addEventListener("click", e => {
    const c = e.target.closest("[data-cls]");
    if (c && !c.disabled) { sheet().cls = c.dataset.cls; SAVE.save(); renderSheet(); return; }
    const l = e.target.closest("[data-look]");
    if (l) { sheet()[l.dataset.look] = l.dataset.id; SAVE.save(); applyLook(); renderSheet(); SFX.click(); }
  });
  $("#roll").addEventListener("click", () => {
    const s = sheet();
    const free = SAVE.FREE_REROLLS - (s.rerolls || 0);
    if (free <= 0) { if (st.shards < SAVE.REROLL_COST) return; st.shards -= SAVE.REROLL_COST; }
    s.rerolls = (s.rerolls || 0) + 1;
    rolling = true; $("#roll").disabled = true;
    const result = SAVE.rollAll();
    let n = 0;
    const spin = setInterval(() => {
      renderAbil(SAVE.rollAll()); SFX.roll20();
      if (++n >= 8) {
        clearInterval(spin);
        SAVE.ABIL.forEach(a => { s.scores[a] = result[a].total; s.dice[a] = result[a].dice; });
        rolling = false; SAVE.save(); renderAbil(); SFX.buy();
        document.querySelectorAll(".bank-n").forEach(b => b.textContent = st.shards);
      }
    }, 90);
  });

  // ---- upgrades ----
  function renderUpgrades() {
    document.querySelectorAll(".bank-n").forEach(n => n.textContent = st.shards);
    $("#up-list").innerHTML = SAVE.UPGRADES.map(u => {
      const l = SAVE.lvl(u.id), max = u.costs.length, done = l >= max, cost = u.costs[l];
      const pips = u.costs.map((_, i) => `<i class="${i < l ? "on" : ""}"></i>`).join("");
      return `<div class="row"><div><h3>${u.name}<span class="pips">${pips}</span></h3><p>${u.desc}</p></div>
        <button class="btn tiny${done ? "" : " primary"}" data-buy="${u.id}" ${done || st.shards < cost ? "disabled" : ""}>${done ? "Maxed" : cost + " ◆"}</button></div>`;
    }).join("");
  }
  $("#up-list").addEventListener("click", e => {
    const b = e.target.closest("[data-buy]"); if (!b) return;
    if (SAVE.buy(b.dataset.buy)) { SFX.buy(); renderUpgrades(); }
  });

  // ---- leaderboard ----
  async function renderBoard() {
    const list = $("#lb-list");
    list.innerHTML = '<li class="muted">Loading…</li>';
    try {
      const rows = await LB.top(25);
      $("#lb-mode").textContent = LB.label();
      if (!rows.length) { list.innerHTML = '<li class="muted">No scores yet. Be the first.</li>'; return; }
      list.innerHTML = "";
      rows.forEach((r, i) => {
        const li = document.createElement("li");
        if (r.me) li.className = "me";
        const a = document.createElement("span"); a.textContent = i + 1;
        const b = document.createElement("span"); b.textContent = r.name;
        const c = document.createElement("span"); c.className = "sc"; c.textContent = r.score;
        li.append(a, b, c); list.appendChild(li);
      });
    } catch (e) {
      $("#lb-mode").textContent = LB.label();
      list.innerHTML = '<li class="muted">Leaderboard unreachable right now.</li>';
    }
  }

  // ---- game over ----
  GAME.onOver = async (r) => {
    $("#over-stats").innerHTML = `
      <span>Score</span><b>${r.score}${r.newBest ? " ★ NEW BEST" : ""}</b>
      <span>Distance</span><b>${r.dist} m</b>
      <span>Kills / parries</span><b>${r.kills} / ${r.parries}</b>
      <span>D20 fate</span><b>${r.fate}</b>
      <span>Shards found</span><b>${r.shards}</b>
      <span>Score bonus</span><b>+${r.bonus}</b>
      <span>Banked</span><b>◆ ${r.earned} (total ${st.shards})</b>`;
    show("over");
    const msg = $("#over-lb");
    if (r.score <= 0) { msg.textContent = ""; return; }
    msg.textContent = "Posting score…";
    try {
      const res = await LB.submit(sheet().name || "ADVENTURER", r.score);
      msg.textContent = LB.mode === "local" ? "Saved on this device." : res.saved ? "Score posted to the leaderboard." : `Your best stays ${res.best}.`;
    } catch (e) {
      msg.textContent = "Couldn't post the score (you may need Contributor access to the shared page).";
    }
  };

  // ---- touch buttons ----
  document.querySelectorAll(".touch button").forEach(b => {
    b.addEventListener("pointerdown", e => { e.preventDefault(); b.classList.add("on"); GAME.press(b.dataset.k); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(ev => b.addEventListener(ev, () => b.classList.remove("on")));
  });

  if (document.fonts && document.fonts.load) document.fonts.load("8px 'Press Start 2P'");
  show("menu");
})();
