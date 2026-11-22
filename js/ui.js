// Menus: hub (outside the Hellfire Club), character sheet, upgrades,
// leaderboard, settings (sound, language, display, keybinds), pause, game over.
(function () {
  const $ = s => document.querySelector(s);
  const panels = ["menu", "sheet", "upgrades", "leaderboard", "settings", "pause", "over", "report"];
  const st = SAVE.state, S = INPUT.S;
  const sign = n => (n >= 0 ? "+" : "") + n;
  const esc = v => String(v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  if (!st.sheet) { st.sheet = SAVE.newSheet(); SAVE.save(); }
  const sheet = () => st.sheet;

  // ---- settings defaults (older saves kept sound/music toggles at the top level) ----
  if (S.musicOn === undefined) S.musicOn = st.music !== false;
  if (S.sfxOn === undefined) S.sfxOn = !st.muted;
  if (S.lang) I18N.lang = S.lang;
  function applySound() {
    SFX.setMuted(!S.sfxOn);
    SFX.music.setOn(S.musicOn);
    SFX.setVolumes(S.musicVol, S.sfxVol);
  }
  applySound();
  function applyTouch() {
    document.body.classList.toggle("touch-always", S.touch === "always");
    document.body.classList.toggle("touch-never", S.touch === "never");
  }
  applyTouch();

  function applyLook() {
    const s = sheet();
    const hair = SAVE.LOOKS.hair.find(h => h.id === s.hair) || SAVE.LOOKS.hair[0];
    const jacket = SAVE.LOOKS.jacket.find(j => j.id === s.jacket) || SAVE.LOOKS.jacket[0];
    SPR.buildPlayer({ hair: hair.c, jacket: jacket.c });
  }
  applyLook();

  let current = null;
  function show(name) {
    current = name;
    GAME.subMenu = GAME.mode === "pause" && name !== "pause";
    panels.forEach(p => $("#p-" + p).classList.toggle("hidden", p !== name));
    $("#touch").classList.add("hide");
    if (name === "menu") refreshMenu();
    if (name === "sheet") { renderSheet(); fitSettings(); }
    if (name === "upgrades") renderUpgrades();
    if (name === "leaderboard") renderBoard();
    if (name === "settings") { bindTab = INPUT.padName_ ? "pad" : "key"; renderSettings(); fitSettings(); }
    document.querySelectorAll(".bank-n").forEach(n => n.textContent = st.shards);
    const first = name && $("#p-" + name + " .btn");
    if (first && (!matchMedia("(pointer:coarse)").matches || INPUT.padName_)) first.focus({ preventScroll: true });
  }
  const hideAll = () => {
    current = null; GAME.subMenu = false;
    panels.forEach(p => $("#p-" + p).classList.add("hidden")); $("#touch").classList.remove("hide");
    if (document.activeElement) document.activeElement.blur();
  };

  function refreshMenu() {
    $("#bank").textContent = st.shards;
    $("#best").textContent = st.best;
    const s = sheet();
    $("#who").innerHTML = "";
    const n = document.createElement("b"); n.textContent = s.name || t("sheet.placeholder");
    const c = document.createElement("span");
    c.textContent = ` · ${t("cls." + s.cls)}`;
    const ab = document.createElement("span"); ab.className = "who-ab";
    ab.textContent = SAVE.ABIL.map(a => a + " " + SAVE.score(s, a)).join("  ");
    $("#who").append(n, c, ab);
    $("#keys-hint").textContent = t("keys.hint", Object.fromEntries(INPUT.ACTIONS.map(a => [a, INPUT.label(a)])));
  }
  function relabel() { // after a language change
    I18N.apply();
    if (current) show(current);
  }

  // ---- navigation ----
  function startRun() { hideAll(); GAME.start(); }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-go]"); if (!b) return;
    SFX.click();
    const go = b.dataset.go;
    if (go === "report") return openReport(current);
    if (go === "play") return startRun();
    if (go === "resume") { hideAll(); GAME.resume(); return; }
    if (go === "quit" || (go === "menu" && GAME.mode !== "attract" && GAME.mode !== "pause")) GAME.toHub();
    if (go === "menu" && GAME.mode === "pause") return show("pause");
    show(go === "quit" ? "menu" : go);
  });
  GAME.onPause = () => show("pause");

  // browsers only allow sound after the first click or key press: start the hub music then
  const wake = () => {
    SFX.unlock(); applySound();
    if (SFX.music.mode === "off" && GAME.mode === "attract") SFX.music.setMode("hub");
    removeEventListener("pointerdown", wake); removeEventListener("keydown", wake);
  };
  addEventListener("pointerdown", wake); addEventListener("keydown", wake);

  // ---- full screen (real browser full screen; the game already fills the window) ----
  const root = document.documentElement;
  const fsApi = root.requestFullscreen ? "requestFullscreen" : root.webkitRequestFullscreen ? "webkitRequestFullscreen" : null;
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  function toggleFull() {
    if (!fsApi) return;
    if (fsEl()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else {
      const p = root[fsApi]();
      if (p && p.then) p.then(() => { try { screen.orientation.lock("landscape").catch(() => {}); } catch (e) {} }).catch(() => {});
    }
  }
  $("#fs").addEventListener("click", toggleFull);
  ["fullscreenchange", "webkitfullscreenchange"].forEach(ev => document.addEventListener(ev, () => { if (current === "settings") renderSettings(); }));

  // ---- the border flickers in the colour of each light you collect ----
  const frame = $("#frame");
  GAME.onLight = col => {
    frame.style.setProperty("--glow", col);
    frame.classList.remove("glow"); void frame.offsetWidth; frame.classList.add("glow");
  };

  // Space / Enter at the hub or after a run = start
  window.addEventListener("keydown", e => {
    if (INPUT.listening) return;
    if (e.target.tagName === "TEXTAREA") return;     // typing a report
    if (e.target.tagName === "INPUT" && e.target.type !== "range") { if (e.key === "Enter") e.target.blur(); return; }
    if (e.code === "F8" && (GAME.mode === "play" || GAME.mode === "pause" || current === "menu" || current === "over")) { // quick report with a screenshot
      e.preventDefault(); if (current === "report") return;
      const shot = REPORT.capture(), ctx = REPORT.context();
      if (GAME.mode === "play") GAME.pause();
      return openReport(current || "pause", shot, ctx);
    }
    if (e.code === "Escape" && current === "report") { e.preventDefault(); return closeReport(); }
    const hubOpen = current === "menu" || current === "over";
    if (current === "over" && e.code === "Space" && (st.dice > 0 || rolling)) { e.preventDefault(); rollDice(); return; } // open Dice Crates first
    if (hubOpen && e.code === "Space" && (GAME.mode === "attract" || GAME.mode === "over")) { e.preventDefault(); startRun(); }
    if (e.code === "Escape" && current && !["menu", "pause", "over"].includes(current)) { e.preventDefault(); show(GAME.mode === "pause" ? "pause" : "menu"); }
  });

  // ---- character sheet ----
  function renderSheet() {
    const s = sheet();
    $("#cname").value = s.name;
    $("#classes").innerHTML = SAVE.CLASSES.map(c => {
      const bonus = Object.entries(c.bonus).map(([k, v]) => `${k} +${v}`).join(", ");
      const icon = SPR.ART["ui_class_" + c.id];
      return `<button class="btn tiny cls${s.cls === c.id ? " on" : ""}" data-cls="${c.id}" ${c.locked ? "disabled" : ""} title="${esc(t("cls." + c.id + ".d"))}">
        ${icon ? `<img class="cls-ic" src="${icon.src}" alt="">` : ""}${c.locked && SPR.ART.ui_lock ? `<img class="lock-ic" src="${SPR.ART.ui_lock.src}" alt="">` : ""}<span>${esc(t("cls." + c.id))}<small>${c.locked ? esc(t("sheet.soon")) : bonus}</small></span></button>`;
    }).join("");
    ["hair", "jacket"].forEach(k => {
      $("#" + k).innerHTML = SAVE.LOOKS[k].map(o =>
        `<button class="sw${s[k] === o.id ? " on" : ""}" data-look="${k}" data-id="${o.id}" style="background:${o.c[0]}" aria-label="${k} ${o.id}"></button>`).join("");
    });
    renderAbil();
    drawPreview();
  }
  function renderAbil() {
    const s = sheet();
    $("#abil").innerHTML = SAVE.ABIL.map(a => {
      const cls = SAVE.CLASSES.find(c => c.id === s.cls).bonus[a] || 0;
      const total = SAVE.score(s, a), m = SAVE.mod(total), up = SAVE.fromUpgrades(a);
      const sic = SPR.ART["ui_stat_" + a.toLowerCase()];
      const bonus = [cls ? t("ab.class", { n: cls }) : "", up ? t("ab.up", { n: up }) : ""].filter(Boolean).join(" · ") || "—";
      return `<tr><th>${sic ? `<img class="sic" src="${sic.src}" alt="">` : ""}${a}</th><td class="av">${total}</td><td class="am">${sign(m)}</td>
        <td class="ai">${esc(t("ab." + a))}</td><td class="ab-b">${esc(bonus)}</td></tr>`;
    }).join("");
    const r = SAVE.runStats(s);
    const rows = [
      [t("d.hearts"), r.hearts],
      (() => { const a = (SAVE.CLASSES.find(c => c.id === s.cls).attack || {}).type, B = GAME.BAL;
        if (a === "arc") { // flight time of the lobbed marble x its speed
          const vx = B.arc.vx + (r.reach - 16) * B.arc.perReach, tf = (B.arc.vh + Math.sqrt(B.arc.vh ** 2 + 2 * B.arc.g * 11)) / B.arc.g;
          return [t("d.range"), Math.round(vx * tf) + " px"]; }
        if (a === "bolt") return [t("d.bolt"), t("d.boltVal")];
        return [t("d.reach"), r.reach + " px"]; })(),
      [t("d.jump"), Math.round(r.jumpV / 3.2) + "%"],
      [t("d.dread"), r.battery.toFixed(1) + " s"],
      [t("d.magnet"), r.magnet + " px"], [t("d.bonus"), t("d.bonusVal", { n: r.bonusDiv })],
    ];
    $("#derived").innerHTML = rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  }
  function drawPreview() {
    const c = $("#preview"), art = SPR.ART[GAME.pk("idle")] || SPR.ART[GAME.pk("idle1")] || SPR.ART[GAME.pk("run1")];
    const src = art || SPR.S.run2;
    c.width = src.width; c.height = src.height;
    c.style.aspectRatio = src.width + "/" + src.height;
    const x = c.getContext("2d"); x.imageSmoothingEnabled = false;
    x.drawImage(src, 0, 0);
    document.querySelectorAll("#hair, #jacket").forEach(el => el.parentElement.hidden = !!art);
  }

  $("#cname").addEventListener("input", e => { sheet().name = LB.clean(e.target.value) === "PLAYER" ? "" : LB.clean(e.target.value); SAVE.save(); });
  $("#p-sheet").addEventListener("click", e => {
    const c = e.target.closest("[data-cls]");
    if (c && !c.disabled) { sheet().cls = c.dataset.cls; SAVE.save(); renderSheet(); return; }
    const l = e.target.closest("[data-look]");
    if (l) { sheet()[l.dataset.look] = l.dataset.id; SAVE.save(); applyLook(); renderSheet(); SFX.click(); }
  });
  // ---- Dice Crates: open them after a run, the d20 sets the odds ----
  let rolling = false;
  const pct = x => Math.round(x * 100) + "%";
  function renderDice(res) {
    const box = $("#over-dice"), left = st.dice || 0;
    box.hidden = left <= 0 && !res;
    if (box.hidden) return;
    $("#dice-left").textContent = left > 0 ? t("dice.left", { n: left }) : t("dice.none");
    $("#dice-roll").textContent = left > 0 ? t("dice.roll") : t("dice.done");
    $("#dice-roll").disabled = rolling || left <= 0;
    $("#dice-roll").hidden = left <= 0;
    if (!res) { $("#dice-res").innerHTML = `<small>${esc(t("dice.hint"))}</small>`; return; }
    const what = res.upgrade ? t("dice.upgrade", { u: t("up." + res.upgrade) }) : t("dice.lights", { n: res.lights });
    $("#dice-res").innerHTML = `<b style="color:${res.col}">${esc(t("dice.t." + res.tier))}</b>${esc(what)}
      <br><small>${esc(t("dice.odds", { r: res.roll, rare: pct(res.odds.rare), leg: pct(res.odds.legendary) }))}</small>`;
  }
  function rollDice() {
    if (rolling || !(st.dice > 0)) return;
    rolling = true; renderDice(null); $("#dice-roll").disabled = true;
    const res = SAVE.openDice(), d = $("#d20");
    d.className = "d20 spin"; let n = 0;
    const spin = setInterval(() => {
      d.firstChild.textContent = 1 + Math.floor(Math.random() * 20); SFX.roll20();
      if (++n < 10) return;
      clearInterval(spin);
      d.firstChild.textContent = res.roll;
      d.className = "d20" + (res.roll === 20 ? " nat20" : res.roll === 1 ? " nat1" : "");
      rolling = false; renderDice(res);
      (res.tier === "legendary" || res.tier === "rare" ? SFX.gold : SFX.buy)();
      document.querySelectorAll(".bank-n").forEach(b => b.textContent = st.shards);
      const tot = $("#over-total"); if (tot) tot.textContent = t("over.total", { n: st.shards });
      if (st.dice <= 0) { const again = $('#p-over [data-go="play"]'); again && again.focus({ preventScroll: true }); }
    }, 80);
  }
  $("#dice-roll").addEventListener("click", rollDice);

  // ---- upgrades ----
  function renderUpgrades() {
    document.querySelectorAll(".bank-n").forEach(n => n.textContent = st.shards);
    $("#up-list").innerHTML = SAVE.UPGRADES.map(u => {
      const l = SAVE.lvl(u.id), max = u.costs.length, done = l >= max, cost = u.costs[l];
      const pips = u.costs.map((_, i) => `<i class="${i < l ? "on" : ""}"></i>`).join("");
      const uic = SPR.ART["ui_up_" + u.id];
      return `<div class="row${uic ? " has-ic" : ""}">${uic ? `<img class="uic" src="${uic.src}" alt="">` : ""}<div><h3>${esc(t("up." + u.id))}<span class="pips">${pips}</span></h3><p>${esc(t("up." + u.id + ".d"))}</p></div>
        <button class="btn tiny${done ? "" : " primary"}" data-buy="${u.id}" ${done || st.shards < cost ? "disabled" : ""}>${done ? esc(t("up.maxed")) : cost + ' <i class="bulb"></i>'}</button></div>`;
    }).join("");
  }
  $("#up-list").addEventListener("click", e => {
    const b = e.target.closest("[data-buy]"); if (!b) return;
    if (SAVE.buy(b.dataset.buy)) { SFX.buy(); renderUpgrades(); }
  });

  // ---- leaderboard ----
  async function renderBoard() {
    const list = $("#lb-list");
    list.innerHTML = `<li class="muted">${esc(t("lb.loading"))}</li>`;
    try {
      const rows = await LB.top(25);
      $("#lb-mode").textContent = t("lb." + LB.mode);
      if (!rows.length) { list.innerHTML = `<li class="muted">${esc(t("lb.empty"))}</li>`; return; }
      list.innerHTML = "";
      rows.forEach((r, i) => {
        const li = document.createElement("li");
        if (r.me) li.className = "me";
        const a = document.createElement("span"); a.textContent = i + 1;
        const md = i < 3 && SPR.ART["ui_medal_" + (i + 1)];
        if (md) { const im = document.createElement("img"); im.src = md.src; im.alt = String(i + 1); im.className = "medal"; a.replaceChildren(im); }
        const b = document.createElement("span"); b.textContent = r.name;
        const c = document.createElement("span"); c.className = "sc"; c.textContent = r.score;
        li.append(a, b, c); list.appendChild(li);
      });
    } catch (e) {
      $("#lb-mode").textContent = t("lb." + LB.mode);
      list.innerHTML = `<li class="muted">${esc(t("lb.down"))}</li>`;
    }
  }

  // ---- settings ----
  let listening = null; // { kind: "key" | "pad", action, slot }
  function renderSettings() {
    $("#s-music").textContent = S.musicOn ? t("set.on") : t("set.off");
    $("#s-sfx").textContent = S.sfxOn ? t("set.on") : t("set.off");
    $("#s-music").setAttribute("aria-pressed", S.musicOn); $("#s-sfx").setAttribute("aria-pressed", S.sfxOn);
    $("#s-musicvol").value = S.musicVol; $("#s-sfxvol").value = S.sfxVol;
    $("#s-lang").innerHTML = I18N.langs.map(l => `<button class="btn tiny${I18N.lang === l ? " on" : ""}" data-lang="${l}">${esc(I18N.name(l))}</button>`).join("");
    $("#s-touch").innerHTML = ["auto", "always", "never"].map(m => `<button class="btn tiny${S.touch === m ? " on" : ""}" data-touch="${m}">${esc(t("set." + m))}</button>`).join("");
    $("#fs").textContent = fsEl() ? t("set.on") : t("set.off");
    $("#fs").disabled = !fsApi;
    renderBinds();
  }
  // short screens: scale the settings panel down until it fits (never up)
  function fitSettings() {
    const el = current === "settings" ? $("#p-settings .settings") : current === "sheet" ? $("#p-sheet .sheet") : current === "report" ? $("#p-report .rep-wrap") : null; if (!el) return;
    el.style.zoom = "";
    const frame = el.closest(".frame") || document.body;
    const avail = Math.min(frame.clientHeight || innerHeight, innerHeight) * 0.97, need = el.getBoundingClientRect().height;
    if (need > avail) el.style.zoom = (avail / need).toFixed(3);
  }
  addEventListener("resize", fitSettings);
  let bindTab = "key";   // Settings > Controls shows one tab: keyboard or controller
  function renderBinds() {
    const slot = (kind, a, i) => {
      const L = listening && listening.kind === kind && listening.action === a && listening.slot === i;
      const v = kind === "key" ? S.keys[a][i] : S.pad[a][i];
      const label = L ? t(kind === "key" ? "set.press" : "set.pressPad") : v == null ? "—" : kind === "key" ? INPUT.keyName(v) : INPUT.padName(v);
      return `<td><button class="btn tiny bind${L ? " on" : ""}" data-bind="${kind}" data-act="${a}" data-slot="${i}">${esc(label)}</button></td>`;
    };
    document.querySelectorAll("#p-settings [data-tab]").forEach(b => { const on = b.dataset.tab === bindTab; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    $("#s-binds").innerHTML = INPUT.ACTIONS.map(a =>
      `<tr><th>${esc(t("act." + a))}</th>${slot(bindTab, a, 0)}${slot(bindTab, a, 1)}</tr>`).join("");
    $("#s-pad").textContent = bindTab === "key" ? t("set.bindHint") : INPUT.padName_ ? t("set.padFound", { n: INPUT.padName_ }) : t("set.padNone");
  }
  setInterval(() => { if (current === "settings" && !listening && bindTab === "pad") { const el = $("#s-pad"), want = INPUT.padName_ ? t("set.padFound", { n: INPUT.padName_ }) : t("set.padNone"); if (el.textContent !== want) el.textContent = want; } }, 1000);

  $("#p-settings").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.id === "s-music") { S.musicOn = !S.musicOn; applySound(); SAVE.save(); renderSettings(); return; }
    if (b.id === "s-sfx") { S.sfxOn = !S.sfxOn; applySound(); SAVE.save(); renderSettings(); SFX.click(); return; }
    if (b.id === "s-reset") { INPUT.reset(); renderBinds(); SFX.buy(); return; }
    if (b.dataset.tab) { bindTab = b.dataset.tab; listening = null; INPUT.listening = null; INPUT.capture = null; renderBinds(); SFX.click(); return; }
    if (b.dataset.lang) { S.lang = b.dataset.lang; SAVE.save(); I18N.set(S.lang); relabel(); fitSettings(); return; }
    if (b.dataset.touch) { S.touch = b.dataset.touch; SAVE.save(); applyTouch(); renderSettings(); return; }
    if (b.dataset.bind) {
      listening = { kind: b.dataset.bind, action: b.dataset.act, slot: +b.dataset.slot };
      INPUT.listening = listening.kind === "key" ? listening : null;
      if (listening.kind === "pad") INPUT.capture = btn => { INPUT.bindPad(listening.action, listening.slot, btn); listening = null; renderBinds(); SFX.buy(); };
      renderBinds();
    }
  });
  ["s-musicvol", "s-sfxvol"].forEach(id => $("#" + id).addEventListener("input", e => {
    S[id === "s-musicvol" ? "musicVol" : "sfxVol"] = +e.target.value; applySound();
  }));
  ["s-musicvol", "s-sfxvol"].forEach(id => $("#" + id).addEventListener("change", () => { SAVE.save(); if (id === "s-sfxvol") SFX.light(); }));
  // capture the next key while rebinding (Esc cancels, Backspace/Delete clears the slot)
  window.addEventListener("keydown", e => {
    if (!listening || listening.kind !== "key") return;
    e.preventDefault(); e.stopImmediatePropagation();
    const L = listening; listening = null; INPUT.listening = null;
    if (e.code === "Backspace" || e.code === "Delete") INPUT.clear("key", L.action, L.slot);
    else if (e.code !== "Escape") { INPUT.bindKey(L.action, L.slot, e.code); SFX.buy(); }
    renderBinds();
  }, true);

  // ---- game over ----
  GAME.onOver = async (r) => {
    $("#over-stats").innerHTML = `
      <span>${esc(t("over.score"))}</span><b>${r.score}${r.newBest ? " ★ " + esc(t("over.best")) : ""}</b>
      <span>${esc(t("over.dist"))}</span><b>${r.dist} m</b>
      <span>${esc(t("over.ptsDist"))}</span><b>${r.pts.dist}</b>
      <span>${esc(t("over.ptsCombat"))}</span><b>${r.pts.combat}</b>
      <span>${esc(t("over.ptsLights"))}</span><b>${r.pts.lights}</b>
      <span>${esc(t("over.kills"))}</span><b>${r.kills}</b>
      <span>${esc(t("over.haul"))}</span><b>${r.bestHaul}</b>
      ${r.lostHaul > 0 ? `<span>${esc(t("over.lost"))}</span><b style="color:#ff6b8f">−${r.lostHaul} · −${r.lostLights} <i class="bulb"></i></b>` : ""}
      ${r.dice ? `<span>${esc(t("over.dice"))}</span><b style="color:#ff9fb4">${r.dice}</b>` : ""}
      <span>${esc(t("over.found"))}</span><b>${r.shards}</b>
      <span>${esc(t("over.bonus"))}</span><b>+${r.bonus}</b>
      <span>${esc(t("over.banked"))}</span><b><i class="bulb"></i> ${r.earned} (<span id="over-total">${esc(t("over.total", { n: st.shards }))}</span>)</b>`;
    const d = $("#d20"); d.className = "d20"; d.firstChild.textContent = "?";
    show("over"); renderDice(null);
    if (st.dice > 0) $("#dice-roll").focus({ preventScroll: true });
    const msg = $("#over-lb");
    if (r.score <= 0) { msg.textContent = ""; return; }
    msg.textContent = t("lb.posting");
    try {
      const res = await LB.submit(sheet().name || t("sheet.placeholder"), r.score);
      msg.textContent = LB.mode === "local" ? t("lb.savedLocal") : res.saved ? t("lb.posted") : t("lb.kept", { n: res.best });
    } catch (e) { msg.textContent = t("lb.fail"); }
  };

  // ---- bug / idea reports ----
  let repFrom = null, repShot = null, repCtx = null, repKind = "bug", clearArmed = false;
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("on");
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2200);
  }
  function openReport(from, shot, ctx) {
    repFrom = from || "menu";
    repShot = shot || REPORT.capture(); repCtx = ctx || REPORT.context();
    repKind = "bug"; clearArmed = false;
    show("report");
    $("#rep-shot").src = repShot || ""; $("#rep-text").value = ""; $("#rep-msg").textContent = "";
    $("#rep-clear").textContent = t("rep.clear");
    document.querySelectorAll("[data-kind]").forEach(b => b.classList.toggle("on", b.dataset.kind === repKind));
    renderReports().then(fitSettings);
    $("#rep-text").focus({ preventScroll: true });
  }
  function closeReport() { show(repFrom === "report" ? "menu" : repFrom || "menu"); }
  async function renderReports() {
    const list = await REPORT.list();
    $("#rep-count").textContent = t("rep.list", { n: list.length });
    $("#rep-list").innerHTML = list.length ? list.slice().reverse().map(r => `<div class="rep-item">
        ${r.shot ? `<img src="${r.shot}" alt="">` : "<span></span>"}
        <span><b class="${r.kind === "idea" ? "idea" : ""}">${esc(t(r.kind === "idea" ? "rep.idea" : "rep.bug"))}</b> ${esc(r.comment.slice(0, 140))}${r.comment.length > 140 ? "…" : ""}
          <small>${esc(new Date(r.created).toLocaleString())}${r.ctx && r.ctx.state ? " · " + esc(r.ctx.state.dist) + " m" : ""}</small></span>
        <button class="x" data-del="${r.id}" aria-label="${esc(t("rep.del"))}" title="${esc(t("rep.del"))}">✕</button></div>`).join("")
      : `<p class="muted">${esc(t("rep.none"))}</p>`;
    ["#rep-export", "#rep-copy", "#rep-clear"].forEach(id => $(id).disabled = !list.length);
  }
  async function saveReport() {
    const comment = $("#rep-text").value.trim();
    if (!comment) { $("#rep-msg").textContent = t("rep.empty"); $("#rep-text").focus(); return; }
    await REPORT.add({ kind: repKind, comment, shot: repShot, ctx: repCtx });
    const n = (await REPORT.list()).length;
    SFX.buy(); closeReport(); toast(t("rep.saved", { n }));
  }
  $("#p-report").addEventListener("click", async e => {
    const k = e.target.closest("[data-kind]");
    if (k) { repKind = k.dataset.kind; document.querySelectorAll("[data-kind]").forEach(b => b.classList.toggle("on", b === k)); SFX.click(); return; }
    const d = e.target.closest("[data-del]");
    if (d) { await REPORT.del(+d.dataset.del); renderReports(); return; }
  });
  $("#rep-save").addEventListener("click", saveReport);
  $("#rep-back").addEventListener("click", () => { SFX.click(); closeReport(); });
  $("#rep-text").addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveReport(); }
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeReport(); }
  });
  $("#rep-export").addEventListener("click", async () => {
    try { const n = await REPORT.exportFile(); $("#rep-msg").textContent = t("rep.exported", { n }); }
    catch (e) { $("#rep-msg").textContent = t("rep.exportFail"); }
  });
  $("#rep-copy").addEventListener("click", async () => {
    const txt = await REPORT.asText();
    try { await navigator.clipboard.writeText(txt); $("#rep-msg").textContent = t("rep.copied"); }
    catch (e) { console.log(txt); $("#rep-msg").textContent = t("rep.copyFail"); }
  });
  $("#rep-clear").addEventListener("click", async () => {
    if (!clearArmed) { clearArmed = true; $("#rep-clear").textContent = t("rep.sure"); return; }
    clearArmed = false; await REPORT.clear(); $("#rep-clear").textContent = t("rep.clear"); renderReports();
  });

  // ---- controller in the menus: D-pad / stick moves focus, A selects, B goes back ----
  INPUT.onMenu = cmd => {
    if (!current) return;
    if (cmd === "start" && (current === "menu" || current === "over")) return startRun();
    if (cmd === "start" && current === "pause") { hideAll(); GAME.resume(); return; }
    const panel = $("#p-" + current);
    const items = Array.from(panel.querySelectorAll("button:not([disabled]), input")).filter(el => el.offsetParent !== null);
    const at = items.indexOf(document.activeElement);
    const el = document.activeElement;
    if ((cmd === "left" || cmd === "right") && el && el.type === "range") {
      el.value = Math.min(1, Math.max(0, +el.value + (cmd === "right" ? 0.05 : -0.05))); el.dispatchEvent(new Event("input")); el.dispatchEvent(new Event("change")); return;
    }
    if (cmd === "up" || cmd === "left") (items[at - 1] || items[items.length - 1]).focus();
    if (cmd === "down" || cmd === "right") (items[at + 1] || items[0]).focus();
    if (cmd === "ok" && el && items.includes(el)) el.click();
    if (cmd === "back") {
      if (current === "report") return closeReport();
      if (current === "pause") { hideAll(); GAME.resume(); }
      else if (current !== "menu") { const back = panel.querySelector('[data-go="menu"]'); if (back) back.click(); }
    }
  };

  // ---- touch buttons ----
  document.querySelectorAll(".touch button").forEach(b => {
    b.addEventListener("pointerdown", e => { e.preventDefault(); b.classList.add("on"); GAME.press(b.dataset.k); });
    ["pointerup", "pointerleave", "pointercancel"].forEach(ev => b.addEventListener(ev, () => b.classList.remove("on")));
  });

  // ---- menu art from assets/ ----
  const CSS_ART = ["ui_button", "ui_button_primary", "ui_panel", "ui_box", "ui_dice", "ui_sheet", "ui_light", "ui_row", "ui_d20"];
  function applyUiArt() {
    const A = SPR.ART, rt = document.documentElement;
    CSS_ART.forEach(k => { if (A[k]) { rt.style.setProperty("--" + k.replace(/_/g, "-"), `url("${A[k].src}")`); document.body.classList.add("has-" + k.replace(/_/g, "-")); } });
    if (A.ui_logo) {
      const img = document.createElement("img"); img.src = A.ui_logo.src; img.alt = "The Upside Down"; img.className = "logo-img";
      $(".logo").replaceChildren(img);
    }
    document.querySelectorAll(".touch button").forEach(b => {
      const a = A["ui_touch_" + b.dataset.k];
      if (a) { b.setAttribute("aria-label", b.textContent); b.removeAttribute("data-i18n"); const i = document.createElement("img"); i.src = a.src; i.alt = ""; b.replaceChildren(i); }
    });
    if (current) show(current);
  }
  (SPR.ready || Promise.resolve()).then(applyUiArt);

  if (document.fonts && document.fonts.load) document.fonts.load("8px 'Press Start 2P'");
  I18N.apply();
  show("menu");
})();
