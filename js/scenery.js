// Scenery stream: a calm backdrop with set pieces that roll by now and then.
// The street is built from "floor frames" (chunks): mostly blank stretches
// with a few props, and every few blanks one building (house, school, police
// station...). The next 3 chunks are always generated ahead of the screen so
// buildings slide in smoothly. The Upside Down mirrors the same street,
// rotten, under the floor.
(function () {
  const W = 400;
  const PARALLAX = 0.5;        // set pieces move at half the run speed
  const MIN_BLANKS = 2, MAX_BLANKS = 4;
  const LOOKAHEAD = 3;

  // Placeholder sizes in game pixels; PNG art overrides via its manifest size.
  const BUILDINGS = {
    set_house:  [46, 40], set_houses: [104, 40], set_school: [140, 56], set_police: [86, 48],
    set_store:  [84, 44], set_arcade: [76, 46], set_diner: [90, 38], set_gas: [100, 46], set_camper: [70, 28],
  };
  const PROPS = {
    prop_tree: [30, 52], prop_lamp: [10, 44], prop_mailbox: [8, 13],
    prop_hedge: [26, 11], prop_phonebooth: [12, 30], prop_hydrant: [7, 10],
  };

  const BACKGROUND = Object.keys(BUILDINGS); // all buildings are background again (street objects are the platforms)
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const S = { chunks: [], nextX: 0, blanks: 2, last: "" };

  function size(key) {
    const sz = SPR.SIZE[key];
    if (SPR.ART[key] && sz) return [sz[0], sz[1]];
    return BUILDINGS[key] || PROPS[key];
  }

  function makeChunk() {
    const c = { x: S.nextX, items: [] };
    if (S.blanks > 0) { // blank stretch: grass, maybe a prop or two
      S.blanks--;
      c.w = Math.round(rand(110, 190));
      const n = Math.random() < 0.3 ? 0 : Math.random() < 0.7 ? 1 : 2;
      let cur = c.x + 6;
      for (let i = 0; i < n; i++) { // props side by side, never past the stretch
        const key = pick(Object.keys(PROPS)), [pw] = size(key);
        const room = c.x + c.w - 6 - pw - cur;
        if (room < 0) break;
        const x = Math.round(cur + Math.random() * room * (n === 1 ? 1 : 0.5));
        c.items.push({ key, x }); cur = x + pw + 4;
      }
    } else {           // a building
      // store, police, diner, arcade, camper and gas station are rooftop platforms in
      // the foreground (js/game.js), so the background keeps the houses and the school
      const key = pick(BACKGROUND.filter(k => k !== S.last));
      S.last = key;
      const [bw] = size(key), pad = Math.round(rand(20, 40));
      c.w = bw + pad * 2;
      c.items.push({ key, x: c.x + pad });
      if (Math.random() < 0.5) { // a tree or lamp next to it
        const pk = pick(["prop_tree", "prop_lamp", "prop_mailbox"]), [pw] = size(pk);
        c.items.push({ key: pk, x: c.x + pad + bw + 4 }); c.w += pw + 4;
      }
      S.blanks = MIN_BLANKS + Math.floor(Math.random() * (MAX_BLANKS - MIN_BLANKS + 1));
    }
    S.nextX += c.w;
    return c;
  }

  // Start a fresh street. The first stretch is kept clear for the Hellfire Club.
  function reset() {
    S.chunks = []; S.nextX = 0; S.last = "";
    S.chunks.push({ x: 0, w: 150, items: [] }); S.nextX = 150;
    S.blanks = 1 + Math.floor(Math.random() * 2);
  }

  function update(layerX) {
    while (S.chunks.filter(c => c.x > layerX + W).length < LOOKAHEAD) S.chunks.push(makeChunk());
    S.chunks = S.chunks.filter(c => c.x + c.w > layerX - 20);
  }

  // ---------- placeholder painters (cached, drawn at 3x for crispness) ----------
  const cache = {};
  const PAL = {
    day: { line: "#3b3446", wallA: "#9a8f86", wallB: "#8a9890", wallC: "#a89880", brick: "#8f6a60", roof: "#5e5266",
      win: "#e8cf8a", winOff: "#5d5868", door: "#5e4a40", trim: "#c9bfb0", sign: "#3b3446", signTxt: "#f0dca0", accent: "#7a98b8",
      leaf: "#5f7f66", leaf2: "#4d6b56", trunk: "#5e4a40", metal: "#6b6f7a" },
    dark: { line: "#120812", wallA: "#3a2440", wallB: "#33223a", wallC: "#40263a", brick: "#3a1a2c", roof: "#1d0f1f",
      win: "#9b2335", winOff: "#1a0f1f", door: "#120812", trim: "#4a1f36", sign: "#1a0c16", signTxt: "#b0305a", accent: "#5b1b3a",
      leaf: "#3b1530", leaf2: "#2a0f26", trunk: "#2a1020", metal: "#2f2236" },
  };
  function canvas(w, h) {
    const c = document.createElement("canvas"); c.width = w * 3; c.height = h * 3;
    const x = c.getContext("2d"); x.scale(3, 3); x.imageSmoothingEnabled = false; return [c, x];
  }
  function paint(key, dark) {
    const id = key + (dark ? "_dark" : "");
    if (cache[id]) return cache[id];
    const [w, h] = BUILDINGS[key] || PROPS[key];
    const [c, x] = canvas(w, h), p = dark ? PAL.dark : PAL.day;
    const R = (col, a, b, cw, ch) => { x.fillStyle = col; x.fillRect(a, b, cw, ch); };
    const sign = (txt, a, b, sw) => {
      R(p.line, a - 1, b - 1, sw + 2, 9); R(p.sign, a, b, sw, 7);
      x.font = "5px 'Press Start 2P', monospace"; x.textAlign = "center"; x.textBaseline = "top";
      x.fillStyle = p.signTxt; x.fillText(txt, a + sw / 2, b + 1, sw - 2);
    };
    const windows = (a, b, n, gap, ww = 7, wh = 7) => {
      for (let i = 0; i < n; i++) { const lit = Math.random() > (dark ? 0.6 : 0.4);
        R(p.line, a + i * gap - 1, b - 1, ww + 2, wh + 2); R(lit ? p.win : p.winOff, a + i * gap, b, ww, wh); }
    };
    const box = (a, b, bw, bh, col) => { R(p.line, a - 1, b - 1, bw + 2, bh + 1); R(col, a, b, bw, bh); };
    const gable = (a, base, bw, col) => {
      const rh = Math.floor(bw / 2.6);
      for (let k = 0; k < rh; k++) { const ins = Math.floor(k * (bw / 2 + 2) / rh);
        R(p.line, a - 2 + ins, base - k - 1, bw + 4 - ins * 2, 1); R(col, a - 1 + ins, base - k - 1, bw + 2 - ins * 2, 1); }
    };
    const house = (a, bw, bh, col) => {
      box(a, h - bh, bw, bh, col); gable(a, h - bh, bw, p.roof);
      windows(a + 5, h - bh + 6, 2, bw - 17); R(p.line, a + bw / 2 - 4, h - 13, 8, 13); R(p.door, a + bw / 2 - 3, h - 12, 6, 12);
    };
    switch (key) {
      case "set_house": house(0, 46, 24, p.wallA); break;
      case "set_houses": house(0, 46, 24, p.wallB); house(56, 46, 22, p.wallC); break;
      case "set_school":
        box(0, 14, 140, 42, p.brick); R(p.roof, -1, 12, 142, 3);
        windows(6, 20, 9, 15, 9, 8); windows(6, 34, 4, 15, 9, 8); windows(87, 34, 4, 15, 9, 8);
        R(p.line, 64, 39, 14, 17); R(p.door, 65, 40, 12, 16); sign("HIGH SCHOOL", 42, 3, 58);
        R(p.metal, 134, 0, 1, 14); R(dark ? p.accent : "#b85450", 135, 1, 5, 3); break;
      case "set_police":
        box(0, 12, 86, 36, p.wallC); R(p.roof, -1, 10, 88, 3);
        windows(6, 20, 2, 12, 8, 9); windows(58, 20, 2, 12, 8, 9);
        R(p.line, 34, 30, 18, 18); R(p.door, 35, 31, 16, 17); sign("POLICE", 25, 2, 36);
        R(dark ? p.accent : p.accent, 41, 24, 4, 3); break;
      case "set_store":
        box(0, 8, 84, 36, p.wallB); R(p.roof, -1, 6, 86, 3);
        for (let i = 0; i < 12; i++) R(i % 2 ? p.trim : (dark ? p.accent : "#a05a5a"), 4 + i * 6.3, 18, 6.3, 5);
        R(p.line, 6, 24, 46, 20); R(p.winOff, 7, 25, 44, 19); R(p.win, 9, 27, 10, 6);
        R(p.line, 60, 26, 16, 18); R(p.door, 61, 27, 14, 17); sign("GENERAL STORE", 8, 9, 68); break;
      case "set_arcade":
        box(0, 6, 76, 40, dark ? p.wallA : "#4e4660"); R(p.roof, -1, 4, 78, 3);
        sign("ARCADE", 14, 10, 48); R(p.line, 6, 22, 64, 24); R(dark ? p.win : "#6f5a8a", 7, 23, 62, 23);
        for (let i = 0; i < 6; i++) R(i % 2 ? p.signTxt : p.accent, 8 + i * 10, 26, 6, 2);
        R(p.line, 30, 32, 16, 14); R(p.door, 31, 33, 14, 13); break;
      case "set_diner":
        box(0, 10, 90, 28, p.trim); R(p.roof, -1, 8, 92, 3); R(p.accent, 0, 30, 90, 3);
        windows(5, 16, 6, 14, 10, 9); sign("DINER", 28, 0, 34); break;
      case "set_gas":
        R(p.line, 0, 8, 70, 7); R(p.trim, 1, 9, 68, 5); R(dark ? p.accent : "#a05a5a", 1, 13, 68, 1);
        R(p.metal, 8, 15, 3, 31); R(p.metal, 58, 15, 3, 31);
        for (const px of [22, 40]) { R(p.line, px - 1, 30, 9, 16); R(p.wallC, px, 31, 7, 15); R(p.winOff, px + 1, 33, 5, 4); }
        R(p.metal, 86, 4, 2, 42); sign("GAS", 78, 0, 18); break;
      case "prop_tree": {
        R(p.trunk, 14, 30, 3, 22);
        for (let yy = -13; yy <= 13; yy++) { const ww = Math.floor(Math.sqrt(169 - yy * yy));
          R(yy < 4 ? p.leaf : p.leaf2, 15 - ww, 16 + yy, ww * 2, 1); }
        if (dark) for (let i = 0; i < 5; i++) R(p.accent, 6 + i * 4, 10 + (i % 2) * 6, 1, 8);
        break; }
      case "prop_lamp": R(p.metal, 4, 4, 2, 40); R(p.metal, 4, 4, 6, 2); R(dark ? p.win : "#f3e3a8", 7, 6, 3, 2); break;
      case "prop_mailbox": R(p.metal, 3, 6, 2, 7); R(p.line, 0, 0, 8, 7); R(dark ? p.wallA : p.accent, 1, 1, 6, 5); break;
      case "prop_hedge": R(p.line, 0, 1, 26, 10); R(p.leaf2, 1, 2, 24, 9); R(p.leaf, 2, 2, 22, 3); break;
      case "prop_phonebooth": box(0, 0, 12, 30, dark ? p.wallA : "#8a9fb0"); R(p.winOff, 2, 5, 8, 20); R(p.signTxt, 2, 1, 8, 2); break;
      case "prop_hydrant": R(p.line, 0, 2, 7, 8); R(dark ? p.accent : "#b06060", 1, 3, 5, 7); R(p.line, 2, 0, 3, 3); break;
    }
    if (dark) { // vines over everything in the Upside Down
      for (let i = 0; i < Math.max(2, w / 14); i++) {
        const vx = Math.floor(Math.random() * w), len = 4 + Math.floor(Math.random() * h * 0.5);
        for (let yy = 0; yy < len; yy += 2) R("#5b1b3a", vx + Math.round(Math.sin(yy * 0.4 + i) * 1.5), yy, 1, 2);
      }
    }
    return (cache[id] = c);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { for (const k in cache) delete cache[k]; });

  // Draw in the side's local coordinates (floor at y = 0, up = negative).
  function draw(ctx, side, layerX) {
    for (const c of S.chunks) for (const it of c.items) {
      const sx = Math.round(it.x - layerX);
      const k = side ? it.key + "_dark" : it.key, art = SPR.ART[k];
      const [w, h] = art ? size(k) : size(it.key);
      if (sx > W || sx + w < 0) continue;
      ctx.drawImage(art || paint(it.key, side === 1), sx, -h, w, h);
    }
  }

  window.SCN = { reset, update, draw, PARALLAX, BUILDINGS, PROPS, state: S };
  reset();
})();
