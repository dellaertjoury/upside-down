// Input: rebindable keyboard + controller (Gamepad API, standard layout).
// Bindings live in SAVE.state.settings.keys / .pad and are edited in Settings.
(function () {
  const ACTIONS = ["jump", "roll", "attack", "flip", "pause"];
  const DEFAULT_KEYS = { jump: ["ArrowUp", "KeyW"], roll: ["ArrowDown", "KeyS"], attack: ["Space"], flip: ["KeyF"], pause: ["KeyP", "Escape"] };
  // standard gamepad: 0 A, 1 B, 2 X, 3 Y, 4 LB, 5 RB, 6 LT, 7 RT, 8 Back, 9 Start, 12-15 D-pad
  const DEFAULT_PAD = { jump: [0, 12], roll: [1, 13], attack: [2, 7], flip: [3, 5], pause: [9] };
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

  const IN = {
    ACTIONS, S,
    keyAction(code) { return ACTIONS.find(a => S.keys[a].includes(code)) || null; },
    keyName(code) { return KEY_NAMES[code] || code.replace(/^Key|^Digit/, "").replace(/^Numpad/, "Num "); },
    padName(i) { return PAD_NAMES[i] || "Button " + i; },
    label(a) { const k = S.keys[a][0]; return k ? this.keyName(k) : "—"; },
    bindKey(a, slot, code) {
      ACTIONS.forEach(x => { S.keys[x] = S.keys[x].filter(c => c !== code); }); // a key does one thing
      S.keys[a][slot] = code; S.keys[a] = S.keys[a].filter(Boolean); SAVE.save();
    },
    bindPad(a, slot, btn) {
      ACTIONS.forEach(x => { S.pad[x] = S.pad[x].filter(b => b !== btn); });
      S.pad[a][slot] = btn; S.pad[a] = S.pad[a].filter(b => b != null); SAVE.save();
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
