// Pixel-art sprites drawn from text maps, plus procedural backgrounds.
// Any sprite can be replaced by a PNG: put it in /assets and list its key in
// assets/manifest.json (see ART_PROMPTS.md for the exact keys and sizes).
(function () {
  const PAL = {
    k: "#1a1124", s: "#f1c09a", S: "#c98f6b", h: "#5a3220", H: "#3b2016",
    r: "#c8413b", R: "#8e2a2d", b: "#33467e", B: "#24315c", w: "#ece6d6",
    y: "#ffd866", Y: "#fff3b0", o: "#a8743a", g: "#7d7f8c", G: "#4c4e5a",
    e: "#ff3b3b", p: "#3a2a4a", P: "#6a4c80", q: "#8f6aa8", d: "#2a2233",
    D: "#433a52", W: "#ffffff", t: "#4a8a8a", T: "#2d5c5e", c: "#e7743a",
    m: "#7a1f3d", M: "#b0305a", n: "#d9b37c", v: "#5a8f4e", V: "#3d6b37"
  };

  function sprite(rows, over) {
    const w = Math.max(...rows.map(r => r.length)), h = rows.length;
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d");
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const ch = row[i];
        const col = (over && over[ch]) || PAL[ch];
        if (ch !== "." && col) { x.fillStyle = col; x.fillRect(i, j, 1, 1); }
      }
    });
    return c;
  }

  // ---------- Player (12 x 16, faces right) ----------
  const HEAD = [
    "....kkkkk...",
    "...khhhhhk..",
    "..khhhhhhhk.",
    "..khhsssshk.",
    "..khssskskk.",
    "...kssssssk.",
    "....kkkkkk..",
  ];
  const TORSO = [
    "...krrrrrk..",
    "..krrRrrrsk.",
    "..ksrRrrrkk.",
    "...krrrrk...",
    "...kbbbbk...",
  ];
  const TORSO_ATK = [
    "...krrrrrkk.",
    "..krrRrrrrsk",
    "..krrRrrrk..",
    "...krrrrk...",
    "...kbbbbk...",
  ];
  const TORSO_BLK = [
    "...krrrrrk..",
    "..krrRrrssk.",
    "..krrRrrrk..",
    "...krrrrk...",
    "...kbbbbk...",
  ];
  const LEGS_A = ["..kbbkkbbk..", ".kbbk..kbbk.", ".kwwk...kwwk", ".kkk.....kkk"];
  const LEGS_B = ["...kbbbbk...", "....kbbk....", "....kwwk....", "....kkkk...."];
  const LEGS_J = ["..kbbbbbbk..", ".kbbk..kbk..", ".kwk....kwk.", "............"];

  const ROLL = [
    "....kkkk....",
    "..kkhhhhkk..",
    ".khhhhhrrrk.",
    ".khhssrrrrk.",
    "khhsskrrRrrk",
    "khssskrrrrRk",
    "krrrrrrbbbbk",
    "krRrrrbbbbbk",
    ".krrrbbbbwk.",
    ".kbbbbbbbwk.",
    "..kkbbbbkk..",
    "....kkkk....",
  ];

  // ---------- Enemies (face left, toward the player) ----------
  const CROW1 = [
    "........k...",
    ".......kdk..",
    "..kk..kddk..",
    ".kyyddddddk.",
    "kWkdddddddDk",
    ".kkkdddddDk.",
    "....kk.kk...",
  ];
  const CROW2 = [
    "............",
    "............",
    "..kk........",
    ".kyydddddddk",
    "kWkdddddddDk",
    ".kkkddddDDk.",
    "....kkdddk..",
  ];
  const CRAWL1 = [
    ".....k.k.k......",
    "...kkPkPkPkk....",
    "..kPPPPPPPPPk...",
    ".kePPPqPPPPPPk..",
    "keePPPPPPqPPPPk.",
    "kPPPPPPPPPPPPPPk",
    ".kWkWkPPPPPPPPk.",
    "..k.k.kPkkPPkk..",
    ".....kPk..kPk...",
    "....kk.....kk...",
  ];
  const CRAWL2 = CRAWL1.slice(0, 8).concat(["......kPk.kPk...", ".......kk..kk..."]);
  const WISP1 = [
    "..kkkkkk..",
    ".kPPqqPPk.",
    "kPeePPPPPk",
    "kPPPPPPPqk",
    ".kPPPPPPk.",
    "..kPkPkPk.",
    "..k.k.k...",
  ];
  const WISP2 = WISP1.slice(0, 5).concat([".kPkPkPk..", ".k.k.k...."]);

  const POD1 = [
    "....kkkk....",
    "..kkMMMMkk..",
    ".kMMmmmmMMk.",
    ".kMmmmmmmMk.",
    "kMmeWmmeWmMk",
    "kMmmmmmmmmMk",
    ".kMmmmmmmMk.",
    "..kMMMMMMk..",
    "...kmmmmk...",
    "..kmkmmkmk..",
    ".kmk.kk.kmk.",
    "kk........kk",
  ];
  const POD2 = POD1.slice(0, 4).concat(["kMmeWmmeWmMk", "kMmkkkkkkmMk", ".kMkeeeekMk."], POD1.slice(7));

  // Player frames are rebuilt when the character's look changes
  const S = {
    pod1: sprite(POD1), pod2: sprite(POD2),
    crow1: sprite(CROW1), crow2: sprite(CROW2),
    crawl1: sprite(CRAWL1), crawl2: sprite(CRAWL2),
    wisp1: sprite(WISP1), wisp2: sprite(WISP2),
  };
  function buildPlayer(look) {
    const o = {};
    if (look && look.hair) { o.h = look.hair[0]; o.H = look.hair[1]; }
    if (look && look.jacket) { o.r = look.jacket[0]; o.R = look.jacket[1]; }
    S.run1 = sprite(HEAD.concat(TORSO, LEGS_A), o);
    S.run2 = sprite(HEAD.concat(TORSO, LEGS_B), o);
    S.jump = sprite(HEAD.concat(TORSO, LEGS_J), o);
    S.attack = sprite(HEAD.concat(TORSO_ATK, LEGS_A), o);
    S.block = sprite(HEAD.concat(TORSO_BLK, LEGS_B), o);
    S.roll = sprite(ROLL, o);
  }
  buildPlayer(null);

  // ---------- PNG overrides ----------
  const ART = {};  // key -> HTMLImageElement
  const SIZE = {}; // key -> [w, h] display size for bigger PNG art
  async function loadOverrides() {
    try {
      const res = await fetch("assets/manifest.json", { cache: "no-cache" });
      if (!res.ok) return;
      const raw = await res.json();
      // manifest: ["run1", ...]  or  { "run1": [w, h], "bg_top": true, ... }
      const list = Array.isArray(raw) ? raw.map(k => [k, null]) : Object.entries(raw);
      await Promise.all(list.map(([key, size]) => new Promise(ok => {
        const img = new Image();
        img.onload = () => { ART[key] = img; if (Array.isArray(size)) SIZE[key] = size; ok(); };
        img.onerror = ok;
        img.src = "assets/" + key + ".png";
      })));
    } catch (e) { /* no overrides: procedural art only */ }
  }

  // Draw sprite `key` with its bottom-left at (x, y). PNG overrides are
  // scaled to the procedural sprite's box so hitboxes stay the same.
  // A PNG can be drawn bigger via its manifest size; it stays bottom-anchored
  // and centred on the original box, so hitboxes don't change.
  function draw(ctx, key, x, y, w, h) {
    const img = ART[key] || S[key];
    if (!img) return;
    const base = S[key] || img;
    let bw = w || base.width, bh = h || base.height;
    const sz = ART[key] && SIZE[key];
    if (sz && sz.length >= 4) { // [w, h, ox, oy]: offset from the hitbox box
      ctx.drawImage(img, Math.round(x) + sz[2], Math.round(y) - sz[1] + sz[3], sz[0], sz[1]); return;
    }
    if (sz) { x -= (sz[0] - bw) / 2; bw = sz[0]; bh = sz[1]; }
    ctx.drawImage(img, Math.round(x), Math.round(y - bh), bw, bh);
  }

  // ---------- Seeded random for repeatable backgrounds ----------
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }

  function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

  // Each background layer is a tile drawn "standing on the floor" (bottom edge
  // = floor). Upside Down layers are drawn the same way, then flipped.
  function hills(w, h, col, seed, amp, base) {
    const c = canvas(w, h), x = c.getContext("2d"), r = rng(seed);
    x.fillStyle = col;
    let y = base;
    for (let i = 0; i < w; i += 2) {
      y += (r() - 0.5) * amp; y = Math.max(base - 14, Math.min(base + 8, y));
      // keep tile seamless: ease back to base near the end
      const t = i / w; const yy = t > 0.85 ? y + (base - y) * ((t - 0.85) / 0.15) : y;
      x.fillRect(i, Math.round(h - yy), 2, Math.round(yy));
    }
    return c;
  }

  function trees(w, h, col, seed, dead) {
    const c = canvas(w, h), x = c.getContext("2d"), r = rng(seed);
    x.fillStyle = col;
    for (let i = 4; i < w - 10; i += 10 + Math.floor(r() * 16)) {
      const th = 18 + Math.floor(r() * 22), tw = 2;
      x.fillRect(i, h - th, tw, th);
      if (dead) {
        for (let b = 0; b < 4; b++) {
          const by = h - th + 3 + b * 5, len = 3 + Math.floor(r() * 6), dir = r() > 0.5 ? 1 : -1;
          for (let k = 0; k < len; k++) x.fillRect(i + dir * k + (dir > 0 ? 2 : -1), by - Math.floor(k / 2), 1, 1);
        }
      } else {
        const cr = 6 + Math.floor(r() * 5);
        for (let yy = -cr; yy <= cr; yy++) {
          const ww = Math.floor(Math.sqrt(cr * cr - yy * yy));
          x.fillRect(i + 1 - ww, h - th + yy, ww * 2, 1);
        }
      }
    }
    return c;
  }

  function houses(w, h, pal, seed) {
    const c = canvas(w, h), x = c.getContext("2d"), r = rng(seed);
    let i = 6;
    while (i < w - 50) {
      const hw = 34 + Math.floor(r() * 18), hh = 20 + Math.floor(r() * 12);
      const body = pal.body[Math.floor(r() * pal.body.length)];
      const top = h - hh;
      // body
      x.fillStyle = pal.line; x.fillRect(i - 1, top - 1, hw + 2, hh + 1);
      x.fillStyle = body; x.fillRect(i, top, hw, hh);
      // siding lines
      x.fillStyle = pal.shade; for (let yy = top + 3; yy < h; yy += 3) x.fillRect(i, yy, hw, 1);
      // stepped roof
      const rh = Math.floor(hw / 2.4);
      for (let k = 0; k < rh; k++) {
        const inset = Math.floor(k * (hw / 2 + 3) / rh);
        x.fillStyle = pal.line; x.fillRect(i - 3 + inset, top - k - 1, hw + 6 - inset * 2, 1);
        x.fillStyle = pal.roof; x.fillRect(i - 2 + inset, top - k - 1, hw + 4 - inset * 2, 1);
      }
      // windows
      const nwin = 2 + Math.floor(r() * 2);
      for (let k = 0; k < nwin; k++) {
        const wx = i + 4 + k * Math.floor((hw - 8) / nwin), wy = top + 5;
        const lit = r() > pal.dark;
        x.fillStyle = pal.line; x.fillRect(wx - 1, wy - 1, 7, 8);
        x.fillStyle = lit ? pal.win : pal.winOff; x.fillRect(wx, wy, 5, 6);
        x.fillStyle = pal.line; x.fillRect(wx + 2, wy, 1, 6); x.fillRect(wx, wy + 3, 5, 1);
      }
      // door
      x.fillStyle = pal.line; x.fillRect(i + hw - 10, h - 11, 7, 11);
      x.fillStyle = pal.door; x.fillRect(i + hw - 9, h - 10, 5, 10);
      i += hw + 18 + Math.floor(r() * 30);
    }
    return c;
  }

  function lamps(w, h, pal) {
    const c = canvas(w, h), x = c.getContext("2d");
    for (let i = 40; i < w; i += 160) {
      const g = x.createRadialGradient(i + 5, h - 40, 1, i + 5, h - 40, 26);
      g.addColorStop(0, pal.glow); g.addColorStop(1, "rgba(0,0,0,0)");
      x.fillStyle = g; x.fillRect(i - 25, h - 70, 60, 70);
      x.fillStyle = pal.pole; x.fillRect(i, h - 42, 2, 42); x.fillRect(i, h - 42, 7, 2);
      x.fillStyle = pal.bulb; x.fillRect(i + 5, h - 40, 3, 2);
    }
    return c;
  }

  function flipV(src) {
    const c = canvas(src.width, src.height), x = c.getContext("2d");
    x.translate(0, src.height); x.scale(1, -1); x.drawImage(src, 0, 0);
    return c;
  }

  // Floor band tile (32 x 10): grass/asphalt on top, roots/veins underneath
  function floorTile() {
    const c = canvas(32, 10), x = c.getContext("2d");
    x.fillStyle = "#5a8f4e"; x.fillRect(0, 0, 32, 2);
    x.fillStyle = "#3d6b37"; for (let i = 0; i < 32; i += 3) x.fillRect(i, 1, 1, 1);
    x.fillStyle = "#4f4a52"; x.fillRect(0, 2, 32, 3);
    x.fillStyle = "#5e5862"; x.fillRect(3, 3, 2, 1); x.fillRect(17, 2, 3, 1); x.fillRect(26, 4, 2, 1);
    x.fillStyle = "#2a1a24"; x.fillRect(0, 5, 32, 2);
    x.fillStyle = "#1a0c16"; x.fillRect(0, 7, 32, 3);
    x.fillStyle = "#7a1f3d"; x.fillRect(5, 8, 6, 1); x.fillRect(10, 7, 1, 1); x.fillRect(20, 9, 7, 1); x.fillRect(26, 8, 1, 1);
    x.fillStyle = "#b0305a"; x.fillRect(7, 8, 2, 1); x.fillRect(22, 9, 2, 1);
    return c;
  }

  const TOP_H = 105, BOT_H = 104;
  const BG = {
    topFar: hills(512, 60, "#3f6f73", 7, 3, 26),
    topTrees: trees(480, 60, "#2d5c5e", 11, false),
    topHouses: houses(640, 70, { body: ["#c96b4b", "#7a9b8a", "#d9b37c", "#8e6fa0"], roof: "#4a2e3a", line: "#1a1124", shade: "rgba(0,0,0,.12)", win: "#ffd866", winOff: "#3b3550", door: "#5a3220", dark: 0.3 }, 3),
    topLamps: lamps(320, 80, { glow: "rgba(255,216,102,.45)", pole: "#1a1124", bulb: "#fff3b0" }),
    botFar: flipV(hills(512, 60, "#2a0f26", 9, 4, 30)),
    botTrees: flipV(trees(480, 70, "#3b1530", 13, true)),
    botHouses: flipV(houses(640, 70, { body: ["#3a2440", "#2f2236", "#45263f"], roof: "#1d0f1f", line: "#0b0610", shade: "rgba(0,0,0,.25)", win: "#9b2335", winOff: "#1a0f1f", door: "#120812", dark: 0.75 }, 5)),
    floor: floorTile(),
  };

  // Sky gradients (cached)
  function skyTop() {
    const c = canvas(1, TOP_H), x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, TOP_H);
    g.addColorStop(0, "#2f6f86"); g.addColorStop(0.55, "#7fb3a6"); g.addColorStop(0.85, "#f0b276"); g.addColorStop(1, "#f6c98a");
    x.fillStyle = g; x.fillRect(0, 0, 1, TOP_H); return c;
  }
  function skyBot() {
    const c = canvas(1, BOT_H), x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, BOT_H);
    g.addColorStop(0, "#3a0f26"); g.addColorStop(0.35, "#22091d"); g.addColorStop(1, "#0a0510");
    x.fillStyle = g; x.fillRect(0, 0, 1, BOT_H); return c;
  }
  BG.skyTop = skyTop(); BG.skyBot = skyBot();

  window.SPR = { S, PAL, ART, SIZE, BG, draw, loadOverrides, sprite, buildPlayer };
})();
