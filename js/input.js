// Input: rebindable keyboard + controller (Gamepad API, standard layout).
// Bindings live in SAVE.state.settings.keys / .pad and are edited in Settings.
(function () {
  const ACTIONS = ["jump", "roll", "attack", "flip", "pause"];
  // one key and one button per action; pause is fixed to Esc / Start (also "back" in menus)
  const DEFAULT_KEYS = { jump: ["ArrowUp"], roll: ["ArrowDown"], attack: ["Space"], flip: ["KeyF"], pause: ["Escape"] };
  // standard gamepad: 0 A, 1 B, 2 X, 3 Y, 4 LB, 5 RB, 6 LT, 7 RT, 8 Back, 9 Start, 12-15 D-pad
  const DEFAULT_PAD = { jump: [0], roll: [1], attack: [2], flip: [3], pause: [9] };
  const FIXED = ["pause"];
  const PAD_NAMES = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "Back", "Start", "L-stick", "R-stick", "D-pad ↑", "D-pad ↓", "D-pad ←", "D-pad →", "Home"];
  const KEY_NAMES = { ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→", Space: "Space", Escape: "Esc",
    ShiftLeft: "L-Shift", ShiftRight: "R-Shift", ControlLeft: "L-Ctrl", ControlRight: "R-Ctrl", Enter: "Enter", Tab: "Tab" };

  const st = SAVE.state;
  st.settings = Object.assign({ musicVol: 0.8, sfxVol: 0.8, lang: null, touch: "auto" }, st.settings || {});
  const S = st.settings;
  const clone = o => JSON.parse(JSON.stringify(o));
  if (!S.keys) S.keys = clone(DEFAULT_KEYS);
  if (!S.pad) S.pad = clone(DEFAULT_PAD);
  ACTIONS.forEach(a => { S.keys[a] = S.keys[a] || []; S.pad[a] = S.pad[a] || []; });
  // older saves had a second key per action and P for pause: keep only the first, pause = Esc / Start
  ACTIONS.forEach(a => { S.keys[a] = S.keys[a].filter(c => c !== "KeyP" && c !== "Escape").slice(0, 1); S.pad[a] = S.pad[a].filter(b => b !== 9).slice(0, 1); });
  S.keys.pause = ["Escape"]; S.pad.pause = [9];
  ACTIONS.forEach(a => { if (!S.keys[a].length) S.keys[a] = DEFAULT_KEYS[a].slice(); if (!S.pad[a].length) S.pad[a] = DEFAULT_PAD[a].slice(); });

  const IN = {
    ACTIONS, S, FIXED,
    keyAction(code) { return ACTIONS.find(a => S.keys[a].includes(code)) || null; },
    keyName(code) { return KEY_NAMES[code] || code.replace(/^Key|^Digit/, "").replace(/^Numpad/, "Num "); },
    padName(i) { return PAD_NAMES[i] || "Button " + i; },
    label(a) { const k = S.keys[a][0]; return k ? this.keyName(k) : "—"; },
    bindKey(a, slot, code) {
      if (FIXED.includes(a) || code === "Escape") return false;              // Esc stays pause / back
      const old = S.keys[a][0];
      ACTIONS.forEach(x => { if (S.keys[x][0] === code && x !== a) S.keys[x] = old ? [old] : []; }); // swap, so nothing is left unbound
      S.keys[a] = [code]; SAVE.save(); return true;
    },
    bindPad(a, slot, btn) {
      if (FIXED.includes(a) || btn === 9) return false;                     // Start stays pause
      const old = S.pad[a][0];
      ACTIONS.forEach(x => { if (S.pad[x][0] === btn && x !== a) S.pad[x] = old != null ? [old] : []; });
      S.pad[a] = [btn]; SAVE.save(); return true;
    },
    clear(kind, a, slot) { (kind === "key" ? S.keys : S.pad)[a].splice(slot, 1); SAVE.save(); },
    reset() { S.keys = clone(DEFAULT_KEYS); S.pad = clone(DEFAULT_PAD); SAVE.save(); },

    // ---- controller polling (called every frame by the game loop) ----
    prev: [], padName_: "", capture: null,   // capture = fn(buttonIndex) while rebinding
    onAction: null,                           // fn(action) for gameplay
    onMenu: null,                             // fn("up"|"down"|"left"|"right"|"ok"|"back"|"start")
    poll() {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = Array.from(pads || []).find(p => p && p.connected);
      if (!gp) { this.padName_ = ""; this.prev = []; return; }
      this.padName_ = gp.id.replace(/\(.*?\)/g, "").trim().slice(0, 40) || "Gamepad";
      const now = gp.buttons.map(b => b.pressed || b.value > 0.5);
      // left stick acts as the D-pad
      const ax = gp.axes || [];
      if (ax[1] < -0.6) now[12] = true; if (ax[1] > 0.6) now[13] = true;
      if (ax[0] < -0.6) now[14] = true; if (ax[0] > 0.6) now[15] = true;
      now.forEach((on, i) => {
        if (!on || this.prev[i]) return;
        if (this.capture) { const c = this.capture; this.capture = null; c(i); return; }
        const act = ACTIONS.find(a => S.pad[a].includes(i));
        if (this.onAction && act && this.onAction(act)) return;   // consumed by gameplay
        const menu = { 12: "up", 13: "down", 14: "left", 15: "right", 0: "ok", 1: "back", 9: "start" }[i];
        if (menu && this.onMenu) this.onMenu(menu);
      });
      this.prev = now;
    },
  };
  window.INPUT = IN;
})();
