// THE UPSIDE DOWN: endless runner on a floor you can flip through.
// Top half = the normal town. Bottom half = the Upside Down.
(function () {
  const W = 400, H = 225;
  const FT = 105;          // y of the top surface (normal world floor)
  const FB = 121;          // y of the bottom surface (Upside Down "floor")
  const SCALE = 3;         // canvas = 3 device pixels per game pixel (crisp art)
  const PX = 64;           // player's fixed screen x
  // ---------------- Balance (tune here) ----------------
  const BAL = {
    // score
    metrePts: 1,                 // per metre run (10 game px = 1 m)
    lightPts: 5,                 // per light collected
    killPts: { crow: 10, wisp: 10, crawler: 15, pod: 15, stalker: 25 }, // bats 10, crawlers 15, walkers 25 (x2 upside down)
    dreadRate: 0.6,              // Dread fills at 60% speed: ~8 s in the Upside Down before upgrades
    // HEAT: what you earn in the Upside Down is a HAUL, multiplied by Heat, kept only
    // when you flip back up yourself. Thrown out by the Dread = lose half. Die down there = lose it all.
    heat: { start: 1.5, step: 0.5, every: 2, edge: 0.75, edgeBonus: 0.25, ejectLoss: 0.5 },
    lightsDown: 0.75,            // share of loose lights that spawn in the Upside Down
    // lights economy
    crateEvery: [16, 24],        // seconds between crates
    crateTiers: [[3, 0.6, 0.3], [5, 0.3, 0.4], [10, 0.1, 0.3]], // [lights, chance at the start, chance from 2000 m]
    heartCrate: 0.25,            // share of crates holding a heart instead
    dice: { first: [25, 40], every: [50, 80], down: 0.6 }, // Dice Crates: kept, opened after the run (60% in the Upside Down)
    milestoneEvery: 500, milestoneLights: 10, // every 500 m: +10 lights
    lightHeight: [20, 38],       // single lights float this high: jump for them
    platformEvery: [9, 14],      // seconds between cars / dumpsters / buses to jump on
    skate: { every: [35, 60], speed: 1.7 }, // skateboard power-up (unlocked in the shop)
    roofHeight: [24, 34],        // roof height in game px (a jump reaches ~50)
    // ranged attacks
    arc: { vx: 200, perReach: 5, vh: 90, g: 380 }, // Ranger marble (reach upgrades add speed = range)
    skip: { vx: 230, range: 120 },                 // Ranger low shot (roll + attack): skims the ground
    bolt: { vx: 300 },                             // Wizard firework
  };

  // Run speed: starts gentle and builds up slowly (game px per second)
  const SPEED_START = 70, SPEED_GAIN = 1.2, SPEED_MAX = 320;
  const GRAV = 980, FLIP_T = 0.26, STAND_H = 18, ROLL_H = 9;
  const CLUB_X = 10;       // Hellfire Club building: left edge at run start

  const cv = document.getElementById("game");
  cv.width = W * SCALE; cv.height = H * SCALE;
  let ctx = cv.getContext("2d"); // swapped briefly by G.preview (player manual)
  ctx.imageSmoothingEnabled = false;
  const { S, BG, draw } = window.SPR;

  const rand = (a, b) => a + Math.random() * (b - a);
  const T_ = (k, v) => I18N.t(k, v);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // ---------------- Obstacle catalogue ----------------
  // h0..h1 = vertical extent measured AWAY from the floor surface.
  const TYPES = {
    // normal world
    // heights: bats/crows fly at head height (ROLL under: a roll is 9 tall, standing 18), hounds run on the
    // ground (JUMP over), walkers are twice your height and can't be cleared: ATTACK them (or flip away)
    crow:      { side: 0, w: 12, h0: 15, h1: 23, enemy: true, vx: -45, after: 250 },
    // upside down
    stump:     { side: 1, w: 12, h0: 0,  h1: 12 },
    tendril:   { side: 1, w: 14, h0: 12, h1: 107, after: 500 },
    crawler:   { side: 1, w: 16, h0: 0,  h1: 10, enemy: true, vx: -60, after: 250 },
    wisp:      { side: 1, w: 10, h0: 15, h1: 22, enemy: true, vx: -25, bob: true, after: 700 }, // bobs 12..18: always over a roll
    pod:       { side: 1, w: 12, h0: 0,  h1: 12, enemy: true, shooter: true, after: 600 },
    stalker:   { side: 1, w: 16, h0: 0,  h1: 120, enemy: true, hp: 2, vx: -25, after: 1500 }, // drawn 44 tall; the hitbox goes above any jump
    // light crates: smash with a hit to spill Christmas lights
    crate:      { side: 0, w: 10, h0: 0, h1: 10, crate: true }, // knee-high next to the kid; 11 px = 5 lights, 13 px = 10
    crate_dark: { side: 1, w: 10, h0: 0, h1: 10, crate: true },
  };
  // Christmas-light colours (the run currency). Gold is rare and worth 5.
  const BULBS = [["red", "#ff3d57"], ["green", "#5fd068"], ["blue", "#4da3ff"], ["yellow", "#ffd866"], ["orange", "#ff9a3d"], ["pink", "#ff6bd0"]];
  const POOL = [
    ["crow", "crawler", "stalker"],               // hounds and walkers cross over to the street later in a run
    ["tendril", "crawler", "crow", "stalker"],       // (the spore wisp and spore pod are retired)
  ];

  // d20 fate roll at the start of every run
  const FATE = [
    { min: 20, label: "fate.20", col: "#5fd0c8", hearts: 1, score: 1, dread: 1 },
    { min: 15, label: "fate.15", col: "#ffd866", hearts: 0, score: 1.2, dread: 1 },
    { min: 6,  label: "fate.6", col: "#f3e9dc", hearts: 0, score: 1, dread: 1 },
    { min: 2,  label: "fate.2", col: "#ff9fb4", hearts: 0, score: 1, dread: 1.15 },
    { min: 1,  label: "fate.1", col: "#ff3d57", hearts: 0, score: 1, dread: 1.3 },
  ];

  // ---------------- State ----------------
  const G = {
    debug: { hitboxes: false, god: false, noDread: false, noSpawn: false, slow: 1 },
    mode: "attract", t: 0, speed: 0, scroll: 0, scroll0: 0, dist: 0, score: 0,
    shards: 0, kills: 0, parries: 0, nextAt: 420, obs: [], picks: [], parts: [], shots: [], pshots: [], pops: [],
    shake: 0, flash: 0, flashCol: "#fff", bolt: null, boltT: 3, overT: 0,
    stats: null, hearts: 1, reviveLeft: false, dread: 0, fate: null, onOver: null, onPause: null,
  };
  const P = {};
  function resetPlayer() {
    Object.assign(P, { side: 0, h: 0, vh: 0, grounded: true, jumps: 0, roll: 0, atk: 0, atkCd: 0,
      blk: 0, blkCd: 0, blkAge: 0, flip: 0, switched: false, flipCd: 0, flipLock: 0, inv: 0, runT: 0,
      bufJump: 0, bufFlip: 0, bufRoll: 0, bufAtk: 0, bufBlk: 0, bufBoard: 0, crash: 0, dead: false, die: null });
  }
  resetPlayer();

  const AMB = Array.from({ length: 46 }, () => ({ x: rand(0, W), y: rand(FB, H), v: rand(3, 10), s: Math.random() < 0.2 ? 2 : 1 }));
  const DUST = Array.from({ length: 14 }, () => ({ x: rand(0, W), y: rand(10, FT - 4), v: rand(2, 6) }));

  // ---------------- Input ----------------
  const ACT = { jump: "bufJump", flip: "bufFlip", roll: "bufRoll", attack: "bufAtk", board: "bufBoard" };
  G.press = function (a) {
    SFX.unlock();
    if (G.mode !== "play" || P.dead) return;
    if (ACT[a]) P[ACT[a]] = a === "flip" ? 0.3 : 0.15;
  };
  // Keys and controller buttons are rebindable (Settings); see js/input.js.
  window.addEventListener("keydown", e => {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (INPUT.listening) return;                       // Settings is waiting for a key
    const a = INPUT.keyAction(e.code);
    if (a === "pause" && (G.mode === "play" || G.mode === "pause")) {
      e.preventDefault(); if (G.subMenu) return;   // Settings / report open over the pause menu: Esc goes back there
      G.mode === "play" ? G.pause() : G.resume(); return;
    }
    if (a && G.mode === "play") { e.preventDefault(); if (!e.repeat) G.press(flipVertical(a)); }
  });
  INPUT.onAction = a => { // controller during a run
    if (a === "pause" && (G.mode === "play" || G.mode === "pause")) { if (!G.subMenu) G.mode === "play" ? G.pause() : G.resume(); return true; }
    if (G.mode === "play") { G.press(flipVertical(a)); return true; }
    return false;
  };
  // Upside down, "away from the floor" is down on screen: swap up/down so the
  // arrow you press matches the direction you move.
  function flipVertical(a) { return a; } // controls stay the same upside down (up = jump, down = roll)
  // swipes on the canvas: up=jump, down=roll, sideways=attack, tap=flip
  let sw = null;
  cv.addEventListener("pointerdown", e => { sw = e.pointerType === "touch" ? { x: e.clientX, y: e.clientY } : null; }); // the mouse does nothing in the game
  cv.addEventListener("pointerup", e => {
    if (!sw || G.mode !== "play") return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
    if (Math.hypot(dx, dy) < 24) return G.press("flip");
    if (Math.abs(dy) > Math.abs(dx)) G.press(flipVertical(dy < 0 ? "jump" : "roll"));
    else G.press("attack");
  });

  // ---------------- Spawning ----------------
  const TOP_AFTER = { crawler: 1200, stalker: 3500 }; // first appear on the street at 120 m / 350 m
  function addOb(type, x, side) {
    const T = TYPES[type]; if (!T) return;
    G.obs.push(Object.assign({ type, x, t: Math.random() * 6, cd: 1.0, dead: false }, T, side == null ? {} : { side }));
  }
  let groupId = 0;
  function bulb(side, x, h, group, idx) {
    const gold = Math.random() < 0.04;
    const [name, col] = gold ? ["gold", "#fff3b0"] : BULBS[Math.floor(Math.random() * BULBS.length)];
    return { side, x, h, kind: "bulb", name, col, gold, group, idx, taken: false, fly: false, vx: 0, vh: 0, ph: Math.random() * 6 };
  }
  // one Christmas light floating at a reachable height
  // a light at a given height (kill drops sit low so you can just run through them)
  function addLight(side, x, h) { G.picks.push(bulb(side, x, h == null ? rand(BAL.lightHeight[0], BAL.lightHeight[1]) : h, null, 0)); }
  // 1-3 lights along the path of a jump that takes off at x (at the current speed),
  // so one well-timed jump collects them all. base = floor or roof height.
  function addLightArc(side, x, n, base = 0, tEnd) {
    const J = (G.stats || SAVE.runStats()).jumpV, T = tEnd || 2 * J / GRAV, v = Math.max(60, G.speed);
    for (let i = 0; i < n; i++) {
      const tt = T * (n === 1 ? 0.5 : (i + 1) / (n + 1));
      G.picks.push(bulb(side, x + v * tt, base + J * tt - GRAV * tt * tt / 2 + 6, null, i));
    }
  }
  function typeFor(side, d) {
    const pool = POOL[side].filter(t => ((side === 0 && TOP_AFTER[t]) || TYPES[t].after || 0) <= G.dist);
    const enemies = pool.filter(t => TYPES[t].enemy), rest = pool.filter(t => !TYPES[t].enemy);
    if (enemies.length && (!rest.length || Math.random() < 0.5 + d * 0.3)) return pick(enemies);
    return pick(rest);
  }
  // ---------------- Street objects you can jump on ----------------
  // Dumpsters, cars, a police car, a van, a pickup and a bus roll by with the
  // street at real size. Their surface follows their shape (hood, roof, trunk),
  // one-way: you land on them from above and run past their front otherwise.
  // Art: plat_<type> and plat_<type>_dark; the surface is read from the art.
  const PLATS = {   // h = tallest point (game px), w = length; prof(t) = surface height at 0..1 along it
    dumpster: { w: 34, h: 18, weight: 3, prof: t => (t < 0.04 || t > 0.96 ? 14 : 18) },
    car:      { w: 62, h: 21, weight: 3, prof: t => t < 0.2 ? 12 : t < 0.33 ? 12 + (t - 0.2) / 0.13 * 9 : t < 0.7 ? 21 : t < 0.8 ? 21 - (t - 0.7) / 0.1 * 8 : 13 },
    cop:      { w: 64, h: 24, weight: 1, prof: t => t < 0.2 ? 12 : t < 0.33 ? 12 + (t - 0.2) / 0.13 * 9 : t < 0.7 ? (t > 0.45 && t < 0.58 ? 24 : 21) : t < 0.8 ? 21 - (t - 0.7) / 0.1 * 8 : 13 },
    van:      { w: 70, h: 27, weight: 2, prof: t => t < 0.12 ? 15 : t < 0.22 ? 15 + (t - 0.12) / 0.1 * 12 : 27 },
    pickup:   { w: 68, h: 23, weight: 2, prof: t => t < 0.22 ? 13 : t < 0.32 ? 13 + (t - 0.22) / 0.1 * 10 : t < 0.55 ? 23 : 14 },
    bus:      { w: 128, h: 33, weight: 1, prof: t => t < 0.04 ? 26 : 33 },
  };
  const profCache = {};
  // surface heights per game pixel, read from the art (top opaque pixel per column, spikes smoothed out)
  function artProfile(img, w, h) {
    const id = img.src + "|" + w + "|" + h;
    if (profCache[id]) return profCache[id];
    let out = null;
    try {
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const x = c.getContext("2d"); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data, raw = [];
      for (let gx = 0; gx < w; gx++) {
        const cx = Math.min(c.width - 1, Math.floor((gx + 0.5) / w * c.width));
        let top = c.height;
        for (let y = 0; y < c.height; y++) if (d[(y * c.width + cx) * 4 + 3] > 120) { top = y; break; }
        raw.push((1 - top / c.height) * h);
      }
      out = raw.map((v, i) => { const win = raw.slice(Math.max(0, i - 2), i + 3).sort((a, b) => a - b); return win[Math.floor(win.length / 2)]; });
    } catch (e) { out = null; }
    return (profCache[id] = out);
  }
  function platKind() { const list = Object.entries(PLATS), tot = list.reduce((a, [, v]) => a + v.weight, 0); let r = Math.random() * tot; for (const [k, v] of list) { r -= v.weight; if (r <= 0) return k; } return "car"; }
  function addPlatform(side, X, kind) {
    const type = kind || platKind(), D = PLATS[type];
    const img = SPR.ART[(side ? "plat_" + type + "_dark" : "plat_" + type)] || SPR.ART["plat_" + type];
    const sz = img && SPR.SIZE[(side ? "plat_" + type + "_dark" : "plat_" + type)];
    const w = sz ? sz[0] : D.w, h = sz ? sz[1] : D.h;
    const prof = (img && artProfile(img, Math.round(w), h)) || Array.from({ length: Math.round(w) }, (_, i) => D.prof(i / w));
    const top = Math.max(...prof);
    const o = { type: "platform", platform: true, kind: type, side, x: X, w, h0: 0, h1: top, top, prof, drawH: h, t: 0, dead: false };
    // what's on it: ONE of a crate, a dice crate, or lights showing a way up / off / over it
    const hi = prof.indexOf(top), J = (G.stats || SAVE.runStats()).jumpV, v = Math.max(60, G.speed);
    let what = pick(["onto", "onto", "off", "off", "over", "crate"]);
    if (what === "over" && w < 60) what = pick(["onto", "off"]);   // only wide ones have room to jump up from
    if (G.crateT <= 0) what = "crate";
    if (G.diceT <= 0 && Math.random() < 0.5) what = "dice";
    if (what === "onto") { // an arc from the street that lands you on its first high part
      const land = Math.min(w - 4, hi + 4), hl = prof[land];
      const tl = (J + Math.sqrt(Math.max(0, J * J - 2 * GRAV * hl))) / GRAV; // time to come down onto it
      const first = o.x + land - v * tl + v * tl / 4;
      if (first < W + 6) o.x += W + 6 - first;                            // never pop in on screen
      addLightArc(side, o.x + land - v * tl, 3, 0, tl);
    } else if (what === "off") { // run along the top and jump off its end
      const e = Math.max(0, w - 8);
      addLightArc(side, o.x + e, pick([2, 3]), prof[e]);
    } else if (what === "over") { // land on top, then jump up again for them
      addLightArc(side, o.x + Math.max(0, hi - 4), pick([2, 3]), top);
    } else if (what === "crate") {
      if (G.crateT <= 0) G.crateT = rand(BAL.crateEvery[0], BAL.crateEvery[1]);
      const cw = 13, cx = o.x + Math.max(2, Math.min(w - cw - 2, hi + 6));
      addOb(side ? "crate_dark" : "crate", cx);
      const c = G.obs[G.obs.length - 1];
      c.tier = pick([3, 5, 5, 10]); if (c.tier >= 5) { c.w = c.tier >= 10 ? 13 : 11; }
      c.h0 = surface(o, cx - o.x, cx - o.x + c.w); c.h1 = c.h0 + c.w; c.onRoof = true;
    } else if (what === "dice") {
      G.diceT = rand(BAL.dice.every[0], BAL.dice.every[1]);
      const dx_ = Math.max(4, Math.min(w - 14, hi + 6));
      G.picks.push({ kind: "dice", side, x: o.x + dx_, h: surface(o, dx_, dx_ + 10) + 6, taken: false, ph: 0, col: "#ff3d57" });
    }
    G.obs.push(o);
    return o;
  }
  // highest surface of a platform between two x offsets (relative to its left edge)
  function surface(o, a, b) {
    let m = -1;
    for (let i = Math.max(0, Math.floor(a)); i <= Math.min(o.prof.length - 1, Math.floor(b)); i++) m = Math.max(m, o.prof[i]);
    return m;
  }

  function spawnChunk() {
    const d = Math.min(1, G.dist / 9000);
    const X = W + 16, r = Math.random();
    const gap = G.speed * rand(0.8, 1.35) * (1 - d * 0.2) + 45; // denser than before: something every ~1 s
    if (false && G.stats.skate && G.skateT <= 0) { // (old) skateboard pickups: the board is now a bought item
      G.skateT = rand(BAL.skate.every[0], BAL.skate.every[1]);
      G.picks.push({ kind: "skate", side: P.side, x: X + 30, h: 12, taken: false, ph: 0, col: "#ff3d57" });
    }
    if (G.platT <= 0 && G.dist > 1200) { // something to jump on, the street around it kept clear
      G.platT = rand(BAL.platformEvery[0], BAL.platformEvery[1]);
      const side = Math.random() < 0.55 ? P.side : 1 - P.side;
      const p = addPlatform(side, X + 30);
      if (Math.random() < 0.4) { const q = addPlatform(side, p.x + p.w + rand(30, 60)); return q.x - X + q.w + G.speed * 0.8; } // a second one to hop to
      return p.x - X + p.w + G.speed * 0.8;
    }
    if (G.diceT <= 0) { // a Dice Crate, more often in the Upside Down; opened after the run
      G.diceT = rand(BAL.dice.every[0], BAL.dice.every[1]);
      G.picks.push({ kind: "dice", side: Math.random() < BAL.dice.down ? 1 : 0, x: X + 20, h: 7, taken: false, ph: 0, col: "#ff3d57" });
      return gap * 0.8;
    }
    if (r < 0.5) {
      const s = Math.random() < 0.5 ? 0 : 1;
      addOb(typeFor(s, d), X, s);
      if (Math.random() < 0.35) addLightArc(Math.random() < BAL.lightsDown ? 1 : 0, X + rand(30, 70), pick([1, 2, 3]));
      return gap;
    }
    if (r < 0.78) {
      addOb(typeFor(0, d), X, 0);
      addOb(typeFor(1, d), X + rand(60, 110), 1);
      return gap + 60;
    }
    const s = Math.random() < 0.5 ? 0 : 1;
    if (G.crateT <= 0) { // a crate every ~20 s: 3, 5 or 10 lights, or a heart
      G.crateT = rand(BAL.crateEvery[0], BAL.crateEvery[1]);
      addOb(s ? "crate_dark" : "crate", X);
      const c = G.obs[G.obs.length - 1];
      c.heart = Math.random() < BAL.heartCrate;
      const p = Math.min(1, G.dist / 10 / 2000);
      let r2 = Math.random() * BAL.crateTiers.reduce((a, t) => a + t[1] * (1 - p) + t[2] * p, 0);
      for (const t of BAL.crateTiers) { r2 -= t[1] * (1 - p) + t[2] * p; if (r2 <= 0) { c.tier = t[0]; break; } }
      c.tier = c.heart ? 5 : (c.tier || 3);
      if (c.tier >= 5) { c.w = c.tier >= 10 ? 13 : 11; c.h1 = c.w; } // bigger crate, bigger haul
    } else addLightArc(Math.random() < BAL.lightsDown ? 1 : 0, X, pick([2, 3]));
    if (G.dist > 400) addOb(typeFor(1 - s, d), X + 50, 1 - s);
    return gap;
  }

  // ---------------- Lifecycle ----------------
  G.start = function () {
    SFX.unlock();
    G.stats = SAVE.runStats();
    const f = FATE[2]; // the start-of-run fate roll is gone: no random head start or handicap
    Object.assign(G, { mode: "play", t: 0, speed: SPEED_START, dist: 0, score: 0, shards: 0, kills: 0, parries: 0, nextAt: 420,
      sc: { dist: 0, combat: 0, lights: 0 }, crateT: rand(8, 12), platT: rand(6, 10), nextMile: BAL.milestoneEvery,
      haul: { dist: 0, combat: 0, lights: 0, n: 0 }, dice: 0, diceT: rand(BAL.dice.first[0], BAL.dice.first[1]), udT: 0, heat: 1, banked: 0, bestHaul: 0, shieldT: 0, skateT: rand(8, 12),   // first skateboard early, so you meet it in every run
      obs: [], picks: [], parts: [], shots: [], pshots: [], pops: [], shake: 0, flash: 0,
      hearts: G.stats.hearts + f.hearts, reviveLeft: G.stats.revive, board: (SAVE.state.items.board || 0) > 0, dread: 0, overT: 0,
      fate: { roll: 0, f, t: 99 } });
    G.scroll0 = G.scroll; SCN.reset(); G.crateHint = false;
    SFX.music.setMode("play");
    resetPlayer();
  };
  G.pause = () => { if (G.mode === "play") { G.mode = "pause"; SFX.music.setMode("pause"); G.onPause && G.onPause(); } };
  // tabbed out / window lost focus: pause
  document.addEventListener("visibilitychange", () => { if (document.hidden) G.pause(); });
  window.addEventListener("blur", () => G.pause());
  G.resume = () => { if (G.mode === "pause") { G.mode = "play"; SFX.music.setMode(P.side ? "down" : "play"); last = performance.now(); G.onResume && G.onResume(); } }; // the UI closes its menus
  G.toHub = () => { if (SFX.music.mode !== "off") SFX.music.setMode("hub"); G.scroll0 = G.scroll; SCN.reset(); G.mode = "attract"; G.obs = []; G.picks = []; G.shots = []; G.pshots = []; G.pops = []; G.dist = 0; G.speed = 0; G.fate = null; resetPlayer(); };

  function gameOver() {
    P.dead = true; G.mode = "dying"; G.overT = 1.3; SFX.over(); SFX.music.setMode("over");
    // death tumble: knocked up and backwards, spinning, then falling off the bottom of the screen
    const top = P.side === 0;
    P.die = { x: PX + 6, y: sy(P.side, P.h) + (top ? -9 : 9), vy: top ? -170 : -40, vx: -38, rot: 0, spin: -11, mir: top ? 1 : -1 };
    if (artFrames("die").length >= 5) { // painted death: knocked forward, hits the ground, slides to a stop
      P.die = { slide: true, h: P.h, vh: 90, t: 0, side: P.side, x: 0, vx: 70 + G.speed * 0.15 }; G.overT = 2.0; // slides forward on screen
    }
    P.skate = 0; P.roll = 0; P.atk = 0; P.flip = 0;
    G.shake = 8; burst(PX + 6, sy(P.side, P.h + 9), "#ff3d57", 22, 90);
    const bonus = Math.floor(G.score / G.stats.bonusDiv);
    const earned = G.shards + bonus;
    const st = SAVE.state, score = Math.floor(G.score);
    const newBest = score > st.best;
    st.shards += earned; st.runs += 1; if (newBest) st.best = score;
    st.dice = (st.dice || 0) + G.dice; SAVE.save();               // Dice Crates wait to be opened
    G.result = { score, shards: G.shards, bonus, earned, kills: G.kills, parries: G.parries,
      pts: { dist: Math.floor(G.sc.dist), combat: Math.floor(G.sc.combat), lights: Math.floor(G.sc.lights) }, bestHaul: Math.floor(G.bestHaul),
      lostHaul: Math.floor(G.haul.dist + G.haul.combat + G.haul.lights), lostLights: G.haul.n,
      dist: Math.floor(G.dist / 10), newBest, dice: G.dice };
  }

  function hurt() {
    if (G.debug.god) { G.flash = 0.1; G.flashCol = "#5fd0c8"; return; }
    if (P.skate > 0) return; // invincible on the skateboard
    if (P.inv > 0 || P.flip > 0 || P.dead) return;
    const pk_ = perk();
    if (pk_.shield && G.shieldT <= 0) { // Fighter: the trash-can lid takes the hit
      G.shieldT = pk_.shield; P.inv = 0.8; SFX.block(); G.shake = 3;
      burst(PX + 10, sy(P.side, P.h + 9), "#c9d1dc", 12, 70); pop(T_("pop.shield"), "#c9d1dc");
      return;
    }
    if (P.side === 1) { G.udT = 0; G.heat = BAL.heat.start; } // a hit cools the Heat back down
    G.hearts -= 1; G.shake = 7; G.flash = 0.25; G.flashCol = "#ff3d57"; SFX.hurt();
    burst(PX + 6, sy(P.side, P.h + 8), "#ff3d57", 14);
    if (G.hearts <= 0) {
      if (G.reviveLeft) {
        G.reviveLeft = false; SAVE.useItem("revive"); G.hearts = 1; P.inv = 2.2; SFX.revive(); G.flash = 0.5; G.flashCol = "#5fd0c8";
        G.obs = G.obs.filter(o => o.x > PX + 140); G.shots = [];
        pop(T_("pop.wind"), "#5fd0c8");
      } else return gameOver();
    }
    P.inv = 1.3;
  }

  // ---------------- Helpers ----------------
  const sy = (side, h) => side === 0 ? FT - h : FB + h; // local height -> screen y
  function burst(x, y, col, n, spd = 60) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = rand(spd * 0.3, spd);
      G.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.3, 0.7), col, s: Math.random() < 0.3 ? 2 : 1 });
    }
  }
  function pop(txt, col, x, y) {
    G.pops.push({ txt, col, x: x == null ? PX + 6 : x, y: y == null ? sy(P.side, P.h + 26) : y, life: 0.9 });
  }
  function startFlip(forced) {
    if (P.side === 1 && G.mode === "play") { bankHaul(forced); G.udT = 0; } // coming up: bank (or lose half)
    if (P.side === 0 && G.mode === "play") { G.udT = 0; G.heat = BAL.heat.start; }
    P.flip = FLIP_T; P.switched = false; P.roll = 0; P.blk = 0; P.bufFlip = 0; P.h = 0; P.vh = 0; P.plat = null;
    if (G.mode === "play") (P.side === 0 ? SFX.flip : SFX.flipUp)();
    burst(PX + 6, FT + 5, P.side === 0 ? "#b0305a" : "#ffd866", 16, 80);
    if (forced) { P.flipLock = 1.4; SFX.dread(); pop(T_("pop.dread"), "#ff3d57", PX + 6, FB + 30); }
  }
  function breakCrate(o, smashed) {
    o.dead = true; G.shake = smashed ? 3 : 1;
    burst(o.x + 7, sy(o.side, 7), "#a8743a", 14, 70);
    if (!smashed) { SFX.thud(); return; }
    SFX.crate(); G.crates = (G.crates || 0) + 1;
    const max = G.stats.hearts;
    if (o.heart && G.hearts < max) { // heal
      G.hearts++; SFX.revive(); pop(T_("pop.heart"), "#ff3d57", o.x + 7, sy(o.side, 26));
      G.onLight && G.onLight("#ff3d57");
      return;
    }
    // lights go straight into your count (a heart crate at full health gives lights too)
    const n = o.tier || 3;
    addLights(n, o.side); addPts("lights", BAL.lightPts * n, o.side); SFX.gold();
    pop(T_("pop.lights", { n }), "#ffd866", o.x + 7, sy(o.side, 26));
    G.onLight && G.onLight("#ffd866");
  }
  // Hit an enemy. Most die at once; tough ones (hp > 1) flinch and get
  // knocked back first. Returns true when the hit landed.
  function addPts(kind, n, side = 0) {
    const v = n * G.fate.f.score;
    if (side === 1 && G.mode === "play") { G.haul[kind] += v * G.heat; return; } // unbanked until you flip up
    G.sc[kind] += v; G.score += v;
  }
  function addLights(n, side = 0) { if (side === 1 && G.mode === "play") G.haul.n += n; else G.shards += n; }
  // flip back up on your own: bank the haul (+25% if the Dread was nearly full);
  // thrown out by the Dread: keep only half
  function bankHaul(forced) {
    const H_ = G.haul, pts = H_.dist + H_.combat + H_.lights;
    if (pts <= 0 && H_.n <= 0) return;
    const edge = !forced && G.dread / G.stats.battery >= BAL.heat.edge;
    const k = forced ? 1 - BAL.heat.ejectLoss : edge ? 1 + BAL.heat.edgeBonus : 1;
    for (const kind of ["dist", "combat", "lights"]) { G.sc[kind] += H_[kind] * k; G.score += H_[kind] * k; }
    const n = Math.round(H_.n * k); G.shards += n;
    G.bestHaul = Math.max(G.bestHaul, pts * k); G.banked += pts * k;
    pop(T_(forced ? "pop.lost" : "pop.bank", { p: Math.round(pts * k), n }), forced ? "#ff6b8f" : "#5fd0c8", W / 2, FT - 52);
    if (edge) pop(T_("pop.edge"), "#ffd866", W / 2, FT - 40);
    if (!forced) { SFX.gold(); G.onLight && G.onLight(edge ? "#ffd866" : "#5fd0c8"); }
    G.haul = { dist: 0, combat: 0, lights: 0, n: 0 };
  }
  // how: "melee" (bat), "ranged" (marble, bolt) or "reflect" (spore shot sent back)
  function damage(o, how, amount = 1) {
    if (o.hitCd > 0) return false;           // one swing = one hit
    const st = G.stats, at = [o.x + o.w / 2, sy(o.side, (o.h0 + o.h1) / 2)];
    const atk = attackCfg();
    if (how === "melee" && atk.crit && Math.random() < atk.crit) { amount *= 2; pop(T_("pop.crit"), "#ffd866", at[0], at[1] - 22); }
    o.hp = (o.hp || 1) - amount;
    if (o.hp > 0.001) {
      o.hitCd = 0.3; o.flash = 0.15; o.x += 14 + G.speed * 0.4; SFX.thud(); G.shake = 2; // room for the 2nd hit at any speed
      burst(at[0], at[1], "#ffffff", 8, 60); pop(T_("pop.tough"), "#ff9fb4", at[0], at[1] - 14);
      return true;
    }
    o.dead = true; G.kills++;
    const pts = BAL.killPts[o.type] || 10;
    addPts("combat", pts, o.side);
    pop("+" + Math.round(pts * (o.side ? G.heat : 1)), o.side ? "#ff9fb4" : "#ffd866", at[0], at[1] - 12);
    SFX.kill(); G.shake = how === "melee" ? 3 : 2;
    burst(at[0], at[1], o.side ? "#b0305a" : "#433a52", 18, 90);
    return true; // enemies drop no lights: kills pay in points
  }
  function parry(o, viaShot) {
    o.dead = true; G.parries++;
    const perfect = !viaShot && P.blkAge < 0.12;
    const pts = (perfect ? 50 : 25);
    G.score += pts * G.fate.f.score; SFX.block(); G.shake = 3;
    burst(o.x + o.w / 2, sy(o.side, (o.h0 + o.h1) / 2), "#5fd0c8", 16, 90);
    pop(perfect ? "PERFECT!" : "PARRY", perfect ? "#ffd866" : "#5fd0c8");
  }

  // ---------------- Update ----------------
  function updatePlayer(dt) {
    const st = G.stats || SAVE.runStats();
    ["bufJump", "bufFlip", "bufRoll", "bufAtk", "bufBlk", "inv", "atkCd", "blkCd", "flipCd", "flipLock"].forEach(k => P[k] = Math.max(0, P[k] - dt));
    P.runT += dt; // run cycle at a steady pace, whatever the speed

    if (P.flip > 0) {
      P.flip -= dt;
      if (!P.switched && P.flip <= FLIP_T / 2) {
        P.switched = true; P.side = 1 - P.side;
        if (G.mode === "play") SFX.music.setMode(P.side ? "down" : "play");
        G.flash = 0.12; G.flashCol = P.side ? "#3a0f26" : "#fff3b0";
      }
      if (P.flip <= 0) { P.flip = 0; P.flipCd = 0.12; P.grounded = true; P.jumps = 0; }
      return;
    }

    if (P.bufFlip > 0 && P.flipCd <= 0 && P.flipLock <= 0) {
      if (P.grounded) startFlip(false);
      else P.vh = Math.min(P.vh, -480); // fast-fall, flip on landing
    }
    if (P.bufJump > 0) {
      if (P.grounded) { P.vh = st.jumpV; P.grounded = false; P.jumps = 1; P.roll = 0; P.bufJump = 0; SFX.jump(); }
      else if (st.djump && P.jumps < 2) { P.vh = st.jumpV * 0.85; P.jumps = 2; P.bufJump = 0; SFX.jump(); burst(PX + 6, sy(P.side, P.h), "#ffffff", 6, 40); }
    }
    if (P.bufRoll > 0) {
      if (P.grounded) { if (P.roll <= 0) SFX.roll(); P.roll = 0.5; P.blk = 0; P.bufRoll = 0; }
      else P.vh = Math.min(P.vh, -480);
    }
    if (P.bufBoard > 0) { // ride the skateboard you bought
      P.bufBoard = 0;
      if (G.board && !(P.skate > 0) && G.mode === "play") {
        G.board = false; SAVE.useItem("board");
        P.skate = st.skate; P.roll = 0; SFX.power(); pop(T_("pop.skate"), "#ffd866"); G.flash = 0.2; G.flashCol = "#ffffff";
      }
    }
    if (P.skate > 0) P.bufAtk = 0; // no attacking while riding the skateboard
    if (P.bufAtk > 0 && P.atkCd <= 0) {
      P.blk = 0; P.bufAtk = 0;
      const atk = attackCfg();
      P.atkCd = atk.cd;
      if (atk.type === "arc" && perk().skipShot && P.roll > 0) { // Ranger perk: roll + attack = low skipping shot
        P.atk = 0.22; SFX.sling();
        G.pshots.push({ kind: "skip", side: P.side, x: PX + 16, h: P.h + 3, x0: PX + 16, vx: BAL.skip.vx, vh: 0, dmg: atk.dmg, dead: false });
      } else if (atk.type === "arc") { // Ranger: a marble lobbed in an arc; reach upgrades throw it further
        P.atk = 0.22; SFX.sling();
        G.pshots.push({ kind: "arc", side: P.side, x: PX + 16, h: P.h + 11, vx: BAL.arc.vx + (st.reach - 16) * BAL.arc.perReach, vh: BAL.arc.vh, dmg: atk.dmg, dead: false });
      } else if (atk.type === "bolt") { // Wizard: straight bolt, half damage
        P.atk = 0.22; SFX.sling();
        G.pshots.push({ kind: "bolt", side: P.side, x: PX + 16, h: P.h + 11, vx: BAL.bolt.vx, vh: 0, dmg: atk.dmg, pierce: perk().pierce || 0, dead: false });
      } else { P.atk = 0.2; SFX.swing(); }
    }
    P.atk = Math.max(0, P.atk - dt);
    if (P.crash > 0) { P.crash -= dt; if (P.crash <= 0) { P.crash = 0; P.roll = 0.45; SFX.roll(); } } // board broke: fall, then roll
    P.roll = Math.max(0, P.roll - dt);
    P.blk = Math.max(0, P.blk - dt); P.blkAge += dt;

    if (!P.grounded) {
      const prev = P.h;
      P.vh -= GRAV * dt; P.h += P.vh * dt;
      if (P.vh < 0) for (const o of G.obs) { // falling onto a car, dumpster... (one-way: only from above)
        if (!o.platform || o.side !== P.side || o.x > PX + 9 || o.x + o.w < PX + 4) continue;
        const top = surface(o, PX + 4 - o.x, PX + 9 - o.x);
        // forgiving: also lands when the edge arrives while you're a few px below its top
        if (top > 0 && prev >= top - 7 && P.h <= top) { P.h = top; P.vh = 0; P.grounded = true; P.jumps = 0; P.plat = o; break; }
      }
      if (P.h <= 0) { P.h = 0; P.vh = 0; P.grounded = true; P.jumps = 0; P.plat = null; }
    } else if (P.plat) { // follow the shape: step down onto the trunk, or drop off the end
      const o = P.plat, top = o.side === P.side ? surface(o, PX + 4 - o.x, PX + 9 - o.x) : -1;
      const slope = Math.max(G.speed, 60) * dt * 2 + 1.5;                  // how much a slope may rise/fall this frame
      if (top <= 0) { P.plat = null; P.grounded = false; P.vh = 0; }
      else if (top < P.h - 0.5) {
        if (P.h - top <= slope) P.h = top;                                  // run down the rear window
        else { P.grounded = false; P.vh = 0; }                              // edge of the roof: fall to the lower part
      }
      else if (top > P.h + 0.5 && top - P.h <= slope + 3) P.h = top;        // run up the windshield onto the roof
    }

    if (G.mode === "play") {
      if (P.side === 1) {
        if (!G.debug.noDread && !(P.skate > 0)) G.dread += dt * G.fate.f.dread * BAL.dreadRate * (perk().dread || 1);
        if (G.dread >= st.battery) { G.dread = st.battery; startFlip(true); }
      } else G.dread = Math.max(0, G.dread - dt * 1.6);
    }
  }

  function update(dt) {
    G.t += dt;
    const playing = G.mode === "play";
    if (G.mode === "dying") {
      G.speed = Math.max(0, G.speed - 400 * dt); G.overT -= dt;
      const d = P.die;
      if (d && d.slide) {
        d.t += dt; d.vh -= GRAV * 0.6 * dt; d.h = Math.max(0, d.h + d.vh * dt); if (d.h === 0) d.vh = 0;
        d.x += d.vx * dt; d.vx = Math.max(0, d.vx - (d.h > 0 ? 20 : 75) * dt); // belly slide: friction on the ground
      }
      else if (d) { d.vy += 560 * dt; d.y += d.vy * dt; d.x += d.vx * dt; d.rot += d.spin * dt; d.spin *= 1 - 0.6 * dt; }
      if (G.overT <= 0) { G.mode = "over"; G.onOver && G.onOver(G.result); }
    } else if (playing) {
      G.speed = Math.min(SPEED_MAX, SPEED_START + G.t * SPEED_GAIN);
      if (G.fate) G.fate.t += dt;
    } else if (G.mode === "attract") G.speed = 0;
    if (G.mode === "over") G.speed = 0;

    const dx = G.speed * dt * (P.skate > 0 ? BAL.skate.speed : 1);
    G.scroll += dx;
    SCN.update((G.scroll - G.scroll0) * SCN.PARALLAX);
    if (G.mode !== "over") updatePlayer(dt);

    if (playing) {
      G.dist += dx;
      addPts("dist", dx / 10 * BAL.metrePts, P.side);
      if (P.side === 1 && P.flip <= 0) { // Heat climbs the longer you stay down
        G.udT += dt * (perk().heatGrowth || 1);
        G.heat = Math.min(G.stats.heatMax, BAL.heat.start + Math.floor(G.udT / BAL.heat.every) * BAL.heat.step);
      }
      if (G.shieldT > 0) { G.shieldT -= dt; if (G.shieldT <= 0) pop(T_("pop.shieldUp"), "#c9d1dc"); }
      G.crateT -= dt;
      G.platT -= dt; G.skateT -= dt; G.diceT -= dt;
      if (P.skate > 0) {
        P.skate -= dt;
        if (Math.random() < 0.5) G.parts.push({ x: PX - 2, y: sy(P.side, P.h + rand(2, 14)), vx: -rand(40, 90), vy: rand(-10, 10), life: 0.35, col: BULBS[Math.floor(Math.random() * 6)][1], s: 1 });
        if (Math.floor(G.t * 8) !== Math.floor((G.t - dt) * 8)) G.onLight && G.onLight(BULBS[Math.floor(G.t * 8) % 6][1]);
        if (P.skate <= 0) { // the board snaps: bits fly, the kid rolls off
          P.skate = 0; P.inv = 1.2; P.atk = 0; SFX.crate(); G.shake = 3;
          if (artFrames("crash").length) P.crash = 0.4; else P.roll = 0.5;
          burst(PX + 4, sy(P.side, P.h + 2), "#ff3d57", 10, 90); burst(PX + 8, sy(P.side, P.h + 2), "#ffd866", 6, 70);
          pop(T_("pop.boardBroke"), "#ff9fb4");
        }
      }
      if (G.dist / 10 >= G.nextMile) { // distance milestone(s): a handful of lights
        let m = 0; while (G.dist / 10 >= G.nextMile) { G.nextMile += BAL.milestoneEvery; m++; }
        const n = BAL.milestoneLights * m;
        G.shards += n; addPts("lights", BAL.lightPts * n);
        pop(T_("pop.mile", { m: G.nextMile - BAL.milestoneEvery, n }), "#ffd866", W / 2, FT - 40);
        SFX.gold(); G.onLight && G.onLight("#ffd866");
      }
      if (G.dist >= G.nextAt) G.nextAt = G.dist + (G.debug.noSpawn ? 200 : spawnChunk());
    } else if (G.mode === "dying") G.dist += dx;

    const ph0 = P.h, ph1 = P.h + (P.roll > 0 ? ROLL_H : STAND_H), px0 = PX + 3, px1 = PX + 10;
    const st = G.stats || SAVE.runStats();
    for (const o of G.obs) {
      o.t += dt; if (o.hitCd > 0) o.hitCd -= dt; if (o.flash > 0) o.flash -= dt;
      o.x -= dx - (o.vx && !o.dead && playing ? o.vx * dt : 0);
      if (o.bob) { o.h0 = TYPES[o.type].h0 + Math.sin(o.t * 4) * 3; o.h1 = o.h0 + 7; }
      if (o.type === "crawler" && playing && !o.dead) { // hounds sometimes pounce: roll under or hit them
        if (!o.leapt && o.x - PX < 78 && o.x > PX + 24) { o.leapt = true; if (Math.random() < 0.5) { o.vx *= 1.8; SFX.spit(); } } // a sudden lunge, always on the ground
        if (o.vh || o.h0 > 0) {
          o.h0 = Math.max(0, o.h0 + o.vh * dt); o.vh -= 720 * dt;
          if (o.h0 === 0 && o.vh < 0) o.vh = 0;
          o.h1 = o.h0 + 10;
        }
      }
      if (o.platform) { o.t += 0; continue; }
      if (o.dead || !playing) continue;
      if (o.shooter) {
        o.cd -= dt;
        if (o.cd <= 0 && o.x < W - 10 && o.x > PX + 50) {
          o.cd = 3.2; o.t = 0; // seconds between spore shots
          G.shots.push({ side: o.side, x: o.x - 3, h: 5, ref: false, dead: false });
          SFX.spit();
        }
      }
      if (o.side !== P.side || P.flip > 0) continue;
      if (P.skate > 0 && o.x < px1 + 4 && o.x + o.w > px0 && o.h0 < ph1 + 4 && o.h1 > ph0) { // skateboard: smash it
        if (o.crate) breakCrate(o, true);
        else if (o.enemy) { o.hitCd = 0; damage(o, "melee", 99); }
        else { o.dead = true; addPts("combat", 5, o.side); SFX.thud(); burst(o.x + o.w / 2, sy(o.side, (o.h0 + Math.min(o.h1, 30)) / 2), "#c9b9a0", 14, 80); }
        continue;
      }
      if (o.crate) { // smash with a hit for lights; running into it just kicks it over
        if (P.atk > 0 && !ranged() && meleeHits(o.x, o.w, o.h0, o.h1 != null ? o.h1 : o.h0 + o.w)) { breakCrate(o, true); continue; }
        if (!G.crateHint && o.x < PX + 70 && o.x > px1) { G.crateHint = true; pop(T_("pop.crate"), "#ffd866", PX + 70, sy(o.side, 30)); }
        continue;
      }
      // bat hit
      if (P.atk > 0 && !ranged() && o.enemy && meleeHits(o.x, o.w, o.h0, o.h1)) {
        if (damage(o, "melee", attackCfg().dmg)) continue;
      }
      if (o.x < px1 && o.x + o.w > px0 && o.h0 < ph1 && o.h1 > ph0) {
        hurt();
      }
    }
    G.obs = G.obs.filter(o => o.x + o.w > -30 && !o.dead);

    // projectiles from pods
    for (const s of G.shots) {
      if (s.ref) {
        s.x += 260 * dt;
        for (const o of G.obs) if (o.enemy && !o.dead && o.side === s.side && s.x + 4 > o.x && s.x < o.x + o.w && 7 > o.h0 && 4 < o.h1) {
          s.dead = true; damage(o, "reflect", 1);
        }
      } else s.x -= dx + 120 * dt;
      if (!playing || s.ref || s.dead || s.side !== P.side || P.flip > 0) continue;
      if (P.skate > 0 && s.x < px1 + 4 && s.x + 4 > px0) { s.dead = true; burst(s.x, sy(s.side, s.h), "#ff6bd0", 6, 40); continue; }
      // a bat swing knocks spore shots back
      if (P.atk > 0 && !ranged() && meleeHits(s.x, 4, s.h, s.h + 4)) {
        s.ref = true; G.parries++; SFX.block(); pop(T_("pop.reflect"), "#5fd0c8"); continue;
      }
      if (s.x < px1 + 2 && s.x + 4 > px0 && s.h < ph1 && s.h + 4 > ph0) { s.dead = true; hurt(); }
    }
    G.shots = G.shots.filter(s => !s.dead && s.x > -10 && s.x < W + 20);

    // the Ranger's marbles: first enemy or crate on that side gets hit
    for (const m of G.pshots) {
      m.x += m.vx * dt;
      if (m.kind === "arc") {
        m.h += m.vh * dt; m.vh -= BAL.arc.g * dt;
        if (m.h <= 0) { m.dead = true; burst(m.x, sy(m.side, 1), "#9fb7ff", 5, 30); continue; } // lands
      }
      if (m.kind === "skip") { // skims along the ground, then rolls to a stop
        if (Math.floor(m.x / 18) % 2) burst(m.x, sy(m.side, 1), "#c9b9a0", 1, 15);
        if (m.x - m.x0 > BAL.skip.range) { m.dead = true; continue; }
      }
      for (const s2 of G.shots) if (!s2.ref && !s2.dead && s2.side === m.side && Math.abs(s2.x - m.x) < 6) { s2.dead = true; m.dead = true; burst(m.x, sy(m.side, s2.h + 2), "#ff6bd0", 8, 50); }
      if (m.dead) continue;
      for (const o of G.obs) {
        if (o.dead || o.side !== m.side || !(o.enemy || o.crate)) continue;
        // the arcing marble hits what it actually touches; the straight bolt covers the runner's lane
        const hitV = m.kind === "arc" ? (o.h0 < m.h + 4 && o.h1 > m.h - 3) : m.kind === "skip" ? (o.h0 < m.h + 6) : (o.h0 < m.h + 10 && o.h1 > m.h - 12);
        if (m.x + 6 > o.x && m.x < o.x + o.w && hitV && !(m.hit && m.hit.includes(o))) {
          if (m.pierce > 0) { m.pierce--; (m.hit = m.hit || []).push(o); } else m.dead = true; // Wizard bolt goes through one
          if (o.crate) breakCrate(o, true);
          else damage(o, "ranged", m.dmg);
          break;
        }
      }
    }
    G.pshots = G.pshots.filter(m => !m.dead && m.x < W + 10);

    // Christmas lights (with magnet)
    for (const k of G.picks) {
      k.x -= dx;
      if (k.fly) { // spilling out of a crate
        k.x += k.vx * dt; k.h += k.vh * dt; k.vh -= 520 * dt;
        if (k.h < 5) { k.h = 5; k.vh = Math.abs(k.vh) * 0.35; k.vx *= 0.5; if (k.vh < 25) k.fly = false; }
      }
      const slid = G.mode === "dying" && P.die && P.die.slide ? P.die : null;
      if (slid && !k.taken && k.side === slid.side && k.kind !== "skate" && Math.abs(k.x - (PX + 8 + slid.x)) < 10 && Math.abs(k.h - (slid.h + 4)) < 10) {
        k.taken = true; // still grabbing lights while sliding to a stop: they go straight into the bank
        const val = k.kind === "dice" ? 0 : (k.gold ? 5 : 1) + (k.side ? st.sporeBonus : 0), r = G.result;
        if (k.kind === "dice") { SAVE.state.dice = (SAVE.state.dice || 0) + 1; G.dice++; if (r) r.dice++; SFX.dice(); }
        else { SAVE.state.shards += val; G.shards += val; if (r) { r.shards += val; r.earned += val; } (k.gold ? SFX.gold : SFX.light)(); pop("+" + val, k.col, k.x, sy(k.side, k.h + 10)); }
        SAVE.save(); burst(k.x, sy(k.side, k.h), k.col, 6, 40); continue;
      }
      if (k.taken || !playing) continue;
      if (k.kind === "skate" && !k.told && k.x < W - 20) { // point it out the first time it rolls into view
        k.told = true; pop(T_("pop.skateAhead"), "#ffd866", k.x + 6, sy(k.side, k.h + 22)); SFX.light();
      }
      const cx = PX + 6, ch = P.h + 8;
      const ddx = k.x - cx, ddh = k.h - ch, dist = Math.hypot(ddx, ddh);
      if (k.side === P.side && P.flip <= 0 && dist < st.magnet + 12) {
        k.x -= ddx * Math.min(1, dt * 10); k.h -= ddh * Math.min(1, dt * 10);
      }
      if (k.side === P.side && P.flip <= 0 && Math.abs(k.x - cx) < 10 && Math.abs(k.h - ch) < 13 && k.kind === "dice") {
        k.taken = true; G.dice++; SFX.dice(); pop(T_("pop.dice"), "#ff6b8f", k.x, sy(k.side, k.h + 14));
        G.onLight && G.onLight("#ff3d57"); burst(k.x, sy(k.side, k.h), "#ff3d57", 10, 50); continue;
      }
      if (k.side === P.side && P.flip <= 0 && Math.abs(k.x - cx) < 9 && Math.abs(k.h - ch) < 12 && k.kind === "skate") {
        k.taken = true; P.skate = st.skate; SFX.power(); pop(T_("pop.skate"), "#ffd866");
        G.flash = 0.2; G.flashCol = "#ffffff"; continue;
      }
      if (k.side === P.side && P.flip <= 0 && Math.abs(k.x - cx) < 9 && Math.abs(k.h - ch) < 12) {
        k.taken = true;
        const val = (k.gold ? 5 : 1) + (k.side ? st.sporeBonus : 0);
        addLights(val, k.side); addPts("lights", BAL.lightPts * val, k.side);
        (k.gold ? SFX.gold : SFX.light)();
        G.onLight && G.onLight(k.col);
        burst(k.x, sy(k.side, k.h), k.col, 6, 40);
        if (val > 1) pop("+" + val, k.col, k.x, sy(k.side, k.h + 10));
      }
    }
    G.picks = G.picks.filter(k => !k.taken && k.x > -20);

    for (const p of G.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 60 * dt; p.life -= dt; }
    G.parts = G.parts.filter(p => p.life > 0);
    for (const p of G.pops) { p.y -= 18 * dt; p.life -= dt; }
    G.pops = G.pops.filter(p => p.life > 0);
    for (const a of AMB) { a.x -= dx * 0.3 + 4 * dt; a.y -= a.v * dt; if (a.y < FB + 1 || a.x < -2) { a.y = H + 2; a.x = rand(0, W + 60); } }
    for (const a of DUST) { a.x -= dx * 0.5 + a.v * dt; if (a.x < -2) { a.x = W + 2; a.y = rand(10, FT - 4); } }
    G.shake = Math.max(0, G.shake - dt * 30);
    G.flash = Math.max(0, G.flash - dt);
    updateWatcher(dt);
    G.boltT -= dt;
    if (G.boltT <= 0) { G.boltT = G.watch ? rand(1.6, 3.2) : rand(2.5, 6); G.bolt = { x: rand(40, W - 40), life: 0.25, seed: Math.random() * 1000 }; }
    if (G.bolt) { G.bolt.life -= dt; if (G.bolt.life <= 0) G.bolt = null; }
  }

  // ---------------- Render ----------------
  function tile(img, off, y, tw, th) {
    const w = Math.round(tw || img.width); let x = -(((off % w) + w) % w);
    for (; x < W; x += w) th ? ctx.drawImage(img, Math.round(x), y, w, th) : ctx.drawImage(img, Math.round(x), y);
  }
  function local(side) {
    ctx.save();
    if (side === 0) { ctx.beginPath(); ctx.rect(0, 0, W, FT); ctx.clip(); ctx.translate(0, FT); }
    else { ctx.beginPath(); ctx.rect(0, FB, W, H - FB); ctx.clip(); ctx.translate(0, FB); ctx.scale(1, -1); }
  }
  const R = (c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  function text(s, x, y, col, align = "left", size = 8) {
    ctx.font = size + "px 'Press Start 2P', monospace"; ctx.textBaseline = "top"; ctx.textAlign = align;
    ctx.fillStyle = "#1a1124"; ctx.fillText(s, x + 1, y + 1);
    ctx.fillStyle = col; ctx.fillText(s, x, y);
  }

  function drawWorld() {
    const s = G.scroll, A = SPR.ART;
    if (A.backdrop_top) tile(A.backdrop_top, s * 0.08, 0, A.backdrop_top.width * FT / A.backdrop_top.height, FT);
    else {
      ctx.drawImage(BG.skyTop, 0, 0, W, FT);
      R("#fff0c8", 300, 62, 14, 14); R("#ffe2a0", 298, 64, 18, 10);
      tile(BG.topFar, s * 0.08, FT - BG.topFar.height);
      tile(BG.topTrees, s * 0.22, FT - BG.topTrees.height);
    }
    ctx.fillStyle = "rgba(255,240,200,.6)";
    for (const d of DUST) ctx.fillRect(Math.round(d.x), Math.round(d.y), 1, 1);
    if (A.backdrop_bottom) { // drawn upright by the artist, flipped here
      ctx.save(); ctx.translate(0, H + FB); ctx.scale(1, -1);
      tile(A.backdrop_bottom, s * 0.08, FB, A.backdrop_bottom.width * (H - FB) / A.backdrop_bottom.height, H - FB);
      ctx.restore();
    } else {
      ctx.drawImage(BG.skyBot, 0, FB, W, H - FB);
      tile(BG.botFar, s * 0.08, FB);
      tile(BG.botTrees, s * 0.22, FB);
    }
    if (G.bolt) {
      const a = G.bolt.life / 0.25;
      ctx.fillStyle = `rgba(255,40,80,${0.18 * a})`; ctx.fillRect(0, FB, W, H - FB);
      let x = G.bolt.x, y = H, sd = G.bolt.seed; ctx.fillStyle = `rgba(255,120,150,${a})`;
      while (y > FB + 6) { sd = (sd * 9301 + 49297) % 233280; x += (sd / 233280 - 0.5) * 8; y -= 3; ctx.fillRect(Math.round(x), y, 2, 3); }
    }
    drawWatcher(); // the giant in the Upside Down sky, lit by the lightning above
    for (const a of AMB) R(a.s > 1 ? "#ff9fb4" : "rgba(230,200,220,.7)", a.x, a.y, a.s, a.s);
    // set pieces (houses, school, ...) then a haze so they sit behind the action
    const layerX = (G.scroll - G.scroll0) * SCN.PARALLAX;
    for (const side of [0, 1]) { local(side); SCN.draw(ctx, side, layerX); ctx.restore(); }
    ctx.fillStyle = "rgba(24,16,40,.22)"; ctx.fillRect(0, 0, W, FT);
    ctx.fillStyle = "rgba(14,4,12,.3)"; ctx.fillRect(0, FB, W, H - FB);
  }

  // The Hellfire Club building, drawn in local coords (y up = negative).
  // dark=true draws its rotten Upside Down twin.
  function d20(x, y, c1, c2) { // small original d20 emblem, 13x13
    const rows = ["....##.....", "...#..#....", "..#....#...", ".#......#..", "#.#....#.#.", "#..#..#..#.", "#...##...#.", "#..####..#.", ".#.#..#.#..", "..##..##...", "...####...."];
    rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === "#") R(c1, x + i, y + j, 1, 1); });
    R(c2, x + 4, y + 5, 2, 2);
  }
  function drawClub(dark) {
    const A = SPR.ART[dark ? "club_dark" : "club"];
    const x = Math.round(CLUB_X - G.dist);
    if (x < -170) return;
    if (A) { // PNG: positioned by its door
      const sz = SPR.SIZE[dark ? "club_dark" : "club"] || [160, 96, -80, 0];
      ctx.drawImage(A, x + 62 + sz[2], -sz[1] + 1, sz[0], sz[1]); return;
    }
    const c = dark
      ? { line: "#0b0610", brick: "#3a1a2c", mortar: "#22101c", roof: "#1a0c16", win: "#9b2335", door: "#120812", glow: "rgba(176,48,90,.25)", sign: "#1a0c16", txt: "#b0305a", trim: "#4a1f36" }
      : { line: "#1a1124", brick: "#8a4434", mortar: "#5e2c24", roof: "#3a2a36", win: "#ffd866", door: "#2a1810", glow: "rgba(255,216,102,.35)", sign: "#1a1124", txt: "#ff3d57", trim: "#c9a46a" };
    const w = 150, h = 80;
    R(c.line, x - 1, -h - 1, w + 2, h + 1);
    R(c.brick, x, -h, w, h);
    for (let yy = -h + 4; yy < 0; yy += 4) {
      R(c.mortar, x, yy, w, 1);
      const off = (yy / 4) & 1 ? 0 : 4;
      for (let xx = off; xx < w; xx += 8) R(c.mortar, x + xx, yy - 3, 1, 3);
    }
    R(c.roof, x - 4, -h - 6, w + 8, 6); R(c.line, x - 4, -h - 7, w + 8, 1);
    // windows
    [[8, -50], [26, -50], [94, -50], [122, -50]].forEach(([wx, wy]) => {
      R(c.line, x + wx - 1, wy - 1, 18, 18); R(c.trim, x + wx, wy, 16, 16);
      R(c.win, x + wx + 1, wy + 1, 14, 14); R(c.trim, x + wx + 7, wy + 1, 2, 14); R(c.trim, x + wx + 1, wy + 7, 14, 2);
      if (!dark && (wx === 26)) { R("#1a1124", x + wx + 3, wy + 9, 3, 6); R("#1a1124", x + wx + 3, wy + 7, 3, 2); } // someone at the table
    });
    // awning + open double door (the run starts here)
    R(c.line, x + 46, -36, 32, 4); R(dark ? "#5b1b3a" : "#c8413b", x + 47, -35, 30, 2);
    R(c.line, x + 49, -31, 26, 31);
    R(c.door, x + 50, -30, 24, 30);
    R(c.glow, x + 52, -28, 20, 28);
    R(dark ? "#2a0f1e" : "#ffd866", x + 54, -26, 16, 2);
    // steps
    R(c.line, x + 44, -2, 36, 2); R(c.mortar, x + 46, -4, 32, 2);
    // poster with emblem
    R(c.line, x + 80, -30, 12, 15); R(dark ? "#2a1020" : "#ece6d6", x + 81, -29, 10, 13);
    d20(x + 80, -28, dark ? "#7a1f3d" : "#c8413b", dark ? "#b0305a" : "#1a1124");
    // sign
    const flick = dark || Math.sin(G.t * 23) > -0.92;
    R(c.line, x + 18, -76, 114, 18); R(c.sign, x + 19, -75, 112, 16);
    R(c.txt, x + 19, -75, 112, 1); R(c.txt, x + 19, -60, 112, 1);
    if (flick) {
      ctx.save();
      if (!dark) { ctx.shadowColor = "#ff3d57"; ctx.shadowBlur = 6; }
      ctx.font = "8px 'Press Start 2P', monospace"; ctx.textBaseline = "top"; ctx.textAlign = "center";
      ctx.fillStyle = c.txt; ctx.fillText("HELLFIRE CLUB", x + 75, -71);
      ctx.restore();
    }
    if (dark) { // vines
      for (let i = 0; i < 9; i++) { const vx = x + 6 + i * 17; for (let yy = -h; yy < -h + 14 + (i % 3) * 10; yy += 2) R("#5b1b3a", vx + Math.round(Math.sin(yy * 0.3 + i) * 1.5), yy, 2, 2); }
    }
  }

  function drawOb(o) {
    const x = Math.round(o.x), t = o.t, img = SPR.ART[o.type];
    if (img && o.crate) { // crate art grows with the tier
      const sz = SPR.SIZE[o.type] || [16, 16, -1, 0], k = o.w / 14; // art is drawn for a 14 px crate
      if (o.tier >= 10) glow("#ffd866", x + o.w / 2, -o.w / 2, o.w, 0.45 + Math.sin(t * 6) * 0.15);
      ctx.drawImage(img, x + sz[2] * k, Math.round(-sz[1] * k + sz[3]), sz[0] * k, sz[1] * k);
      return;
    }
    if (img && !o.enemy) {
      const sz = SPR.SIZE[o.type];
      if (sz && sz.length >= 4) ctx.drawImage(img, x + sz[2], Math.round(-o.h0 - sz[1] + sz[3]), sz[0], sz[1]);
      else if (sz) ctx.drawImage(img, Math.round(x - (sz[0] - o.w) / 2), Math.round(-o.h0 - sz[1]), sz[0], sz[1]);
      else ctx.drawImage(img, x, -o.h1, o.w, o.h1 - o.h0);
      return;
    }
    switch (o.type) {
      case "cone":
        R("#1a1124", x, -11, 9, 11);
        for (let i = 0; i < 10; i++) { const iw = Math.max(1, Math.floor(i * 0.7)); R(i % 4 < 2 ? "#e7743a" : "#f3e9dc", x + 4 - Math.floor(iw / 2), -11 + i, iw + 1, 1); }
        R("#e7743a", x, -2, 9, 2); break;
      case "trash":
        R("#1a1124", x - 1, -17, 13, 17); R("#7d7f8c", x, -15, 11, 15); R("#4c4e5a", x + 2, -14, 1, 13); R("#4c4e5a", x + 6, -14, 1, 13);
        R("#9a9caa", x - 1, -17, 13, 3); R("#1a1124", x + 4, -18, 3, 1); break;
      case "fence":
        for (let i = 0; i < 4; i++) { R("#1a1124", x + i * 5 - 1, -20, 5, 20); R("#ece6d6", x + i * 5, -19, 3, 19); }
        R("#c9bfa8", x, -15, 18, 2); R("#c9bfa8", x, -6, 18, 2); break;
      case "billboard":
        R("#1a1124", x + 5, -108, 2, 70); R("#1a1124", x + 15, -108, 2, 70);
        R("#1a1124", x - 1, -40, 24, 28); R("#c8413b", x, -39, 22, 26); R("#ffd866", x + 2, -36, 18, 3);
        R("#f3e9dc", x + 3, -30, 16, 2); R("#f3e9dc", x + 3, -26, 12, 2); R("#f3e9dc", x + 3, -22, 14, 2); R("#8e2a2d", x, -14, 22, 1);
        break;
      case "crow": draw(ctx, enemyKey(o, "crow", "fly", ["crow1", "crow2"]), x, -o.h0); break;
      case "stump":
        R("#0b0610", x - 1, -13, 14, 13); R("#3a2440", x, -12, 12, 12); R("#7a1f3d", x + 3, -10, 1, 9); R("#7a1f3d", x + 8, -8, 1, 7);
        R("#b0305a", x + 3, -11, 1, 2); R("#3a2440", x - 2, -3, 3, 3); R("#3a2440", x + 11, -2, 3, 2); break;
      case "tendril":
        for (const pass of [0, 1]) for (let i = 0; i < 4; i++) { // pass 0: dark outline, pass 1: the vine
          const bx = x + i * 4, o1 = pass ? 0 : 1;
          for (let y = -107; y < -12; y += 2) R(pass ? (i % 2 ? "#5b1b3a" : "#3a1430") : "#0b0610", bx + Math.round(Math.sin(t * 2 + y * 0.12 + i) * (1 + (y + 107) / 40)) - o1, y - o1, 3 + 2 * o1, 2 + 2 * o1);
          R(pass ? "#b0305a" : "#0b0610", bx + Math.round(Math.sin(t * 2 - 1.4 + i) * 3) - o1, -14 - o1, 2 + 2 * o1, 2 + 2 * o1);
        }
        break;
      case "crawler": draw(ctx, enemyKey(o, "hound", o.h0 > 1 ? "jump" : "run", ["crawl1", "crawl2"]), x, -o.h0); break;
      case "stalker": {
        const f = Math.floor(t * 4) % 2;
        const sk = enemyKey(o, "stalker", "walk", SPR.ART.stalker1 ? ["stalker1", "stalker2"] : null);
        if (sk) { const sz = SPR.SIZE[sk], k = sz ? 44 / sz[1] : 1; ctx.save(); ctx.translate(x, 0); ctx.scale(k, k); draw(ctx, sk, 0, 0); ctx.restore(); break; }
        ctx.save(); ctx.translate(x + 7, 0); ctx.scale(1.57, 1.57); ctx.translate(-x - 7, 0); // placeholder: 28 -> 44 px tall
        // placeholder: a tall hunched shape with long arms and red eyes
        R("#0b0610", x + 2, -25, 11, 19); R("#4a3a52", x + 3, -24, 9, 17);          // body
        R("#0b0610", x, -28, 8, 6); R("#5b4a62", x + 1, -27, 6, 4); R("#ff3b3b", x + 1, -26, 1, 1); R("#ff3b3b", x + 4, -26, 1, 1);
        R("#4a3a52", x - 2, -20 + f, 2, 12); R("#4a3a52", x + 12, -20 - f, 2, 12);  // arms
        R("#2f2236", x + 3, -7, 3, 7 - f); R("#2f2236", x + 9, -7, 3, 7 + f - 1);   // legs
        ctx.restore(); break; }
      case "wisp": draw(ctx, enemyKey(o, "flyer", "fly", ["wisp1", "wisp2"]), x, -o.h0); break;
      case "pod": draw(ctx, enemyKey(o, "pod", "idle", o.t < 0.3 ? ["pod2"] : ["pod1"]), x, 0); break;
      case "crate": case "crate_dark": { // 14 px = 3 lights, 16 px = 5, 18 px (gold glow) = 10
        const dk = o.type === "crate_dark", s = o.w, sl = dk ? "#2f1a26" : "#7a5228";
        if (o.tier >= 10) glow("#ffd866", x + s / 2, -s / 2, s, 0.45 + Math.sin(t * 6) * 0.15);
        const cimg = ART(o.type);
        if (cimg) { // painted crate (14 / 16 / 18 px wide by tier), a heart on heart crates
          const cw = s + 4, ch = cw * cimg.height / cimg.width;
          ctx.drawImage(cimg, x - 2, -ch, cw, ch);
          if (o.heart) heart(x + s / 2 - 4, -ch / 2 - 4, true);
          break;
        }
        R("#1a1124", x - 1, -s - 1, s + 2, s + 1); R(dk ? "#4a2a3a" : "#a8743a", x, -s, s, s);
        R(sl, x, -Math.round(s * 0.7), s, 1); R(sl, x, -Math.round(s * 0.35), s, 1);
        R(sl, x + 3, -s, 1, s); R(sl, x + s - 4, -s, 1, s);
        if (o.tier >= 10) { R("#ffd866", x, -s, s, 1); R("#ffd866", x, -1, s, 1); }
        if (!o.heart) for (let i = 0; i < Math.min(4, Math.ceil((o.tier || 3) / 2.5)); i++)
          R(BULBS[(Math.floor(t * 2) + i * 2) % BULBS.length][1], x + 5 + (i % 2) * (s - 10), -s + 4 + Math.floor(i / 2) * (s / 2 - 1), 2, 2);
        break; }
      case "rift": {
        const p = 0.6 + Math.sin(t * 10) * 0.4;
        R("#0b0610", x - 1, -107, 16, 107); R("#4a0f22", x, -107, 14, 107);
        for (let y = -107; y < 0; y += 3) R(`rgba(255,61,87,${p})`, x + 6 + Math.round(Math.sin(y * 0.3 + t * 3) * 3), y, 2, 3);
        break;
      }
    }
  }

  const ART = k => SPR.ART[k];
  function drawWires(side) { // the cord between bulbs of one string
    ctx.fillStyle = side ? "#2a0f1e" : "#1f2a22";
    const groups = {};
    for (const k of G.picks) if (k.side === side && k.group && !k.fly) (groups[k.group] = groups[k.group] || []).push(k);
    for (const g in groups) {
      const l = groups[g].sort((a, b) => a.idx - b.idx);
      for (let i = 0; i < l.length - 1; i++) {
        const a = l[i], b = l[i + 1]; if (b.idx !== a.idx + 1) continue;
        for (let t = 0; t <= 1; t += 0.1) {
          const x = a.x + (b.x - a.x) * t + 2, h = a.h + (b.h - a.h) * t + 6 - Math.sin(t * Math.PI) * 3;
          ctx.fillRect(Math.round(x), Math.round(-h), 1, 1);
        }
      }
    }
  }
  // Enemy frame: attack frames when close to the runner (or firing, for pods),
  // otherwise the movement state. Falls back to the older two-frame art.
  function enemyKey(o, prefix, state, fallback) {
    const near = o.side === P.side && o.x - PX < (o.type === "stalker" ? 46 : 34) && o.x > PX - 10;
    const atk = o.type === "pod" ? o.t < 0.35 : near && state !== "jump";
    let f = atk ? frames(prefix, "attack") : [];
    if (f.length) return f[Math.min(f.length - 1, Math.floor((o.type === "pod" ? o.t / 0.35 : (34 - (o.x - PX)) / 44) * f.length))] || f[0];
    f = frames(prefix, state);
    if (state === "jump" && f.length) return o.vh > 0 ? f[0] : f[f.length - 1];
    if (!f.length && state === "jump") f = frames(prefix, "run");
    if (f.length) return state === "idle" ? idleCyc(f, o.t, 6) : cyc(f, o.t, f.length > 2 ? 10 : 8);
    if (!fallback) return null;
    return cyc(fallback, o.t, 8);
  }
  // a car / dumpster / bus you can stand on; placeholder shapes until the art arrives
  function drawPlatform(o) {
    const x = Math.round(o.x), key = "plat_" + o.kind, img = SPR.ART[o.side ? key + "_dark" : key] || SPR.ART[key];
    if (img) { ctx.drawImage(img, x, -o.drawH, o.w, o.drawH); }
    else {
      const dk = o.side === 1;
      const body = { dumpster: dk ? "#3a3a2a" : "#3f6b4a", car: dk ? "#4a2a3a" : "#b8463e", cop: dk ? "#2a2a3a" : "#e8e4d8",
        van: dk ? "#3a2440" : "#d9c79a", pickup: dk ? "#3a2a2a" : "#4f6fa8", bus: dk ? "#4a3a1a" : "#e0a62a" }[o.kind];
      ctx.fillStyle = "#1a1124";
      for (let i = 0; i < o.prof.length; i++) ctx.fillRect(x + i, -o.prof[i] - 1, 1, o.prof[i] + 1);
      ctx.fillStyle = body;
      for (let i = 1; i < o.prof.length - 1; i++) ctx.fillRect(x + i, -o.prof[i], 1, Math.max(0, o.prof[i] - 3));
      const glass = dk ? "#5b1b3a" : "#9fc6d6";
      if (o.kind === "car" || o.kind === "cop") { R(glass, x + o.w * 0.36, -o.top + 3, o.w * 0.15, 5); R(glass, x + o.w * 0.53, -o.top + 3, o.w * 0.15, 5); }
      if (o.kind === "cop") { R("#1a1124", x + o.w * 0.45, -o.top - 1, o.w * 0.13, 2); R(Math.floor(G.t * 6) % 2 ? "#ff3d57" : "#4da3ff", x + o.w * 0.46, -o.top, o.w * 0.11, 2); }
      if (o.kind === "van") for (let i = 0.28; i < 0.9; i += 0.2) R(glass, x + o.w * i, -o.top + 4, o.w * 0.14, 6);
      if (o.kind === "pickup") R(glass, x + o.w * 0.34, -o.top + 3, o.w * 0.18, 5);
      if (o.kind === "bus") for (let i = 0.08; i < 0.95; i += 0.1) R(glass, x + o.w * i, -o.top + 5, o.w * 0.07, 8);
      if (o.kind === "dumpster") { R(dk ? "#2a2a1f" : "#2f5238", x + 1, -o.top, o.w - 2, 3); R("#1a1124", x + 4, -o.top + 7, o.w - 8, 1); }
      if (o.kind !== "dumpster") for (const t of [0.18, 0.8]) { R("#1a1124", x + o.w * t - 4, -6, 9, 6); R("#4c4e5a", x + o.w * t - 2, -4, 5, 3); } // wheels
    }
  }
  function drawBoard(x, y, w = 14) { // a skateboard: deck + two wheels
    const img = ART("skate_board");
    if (img) { ctx.drawImage(img, x, y - 1, w + 2, 5); return; }
    R("#1a1124", x, y, w, 3); R("#ff3d57", x + 1, y, w - 2, 2); R("#ffd866", x + 2, y, 2, 1);
    R("#1a1124", x + 2, y + 2, 3, 3); R("#1a1124", x + w - 5, y + 2, 3, 3); R("#ece6d6", x + 3, y + 3, 1, 1); R("#ece6d6", x + w - 4, y + 3, 1, 1);
  }
  function drawDiceCrate(x, y) { // a small wooden crate with a red d20 painted on it
    R("#1a1124", x - 1, y - 1, 12, 12); R("#8a5a30", x, y, 10, 10); R("#6b4222", x, y + 4, 10, 1); R("#a8743a", x, y, 10, 1);
    R("#1a1124", x + 2, y + 2, 6, 6); R("#ff3d57", x + 3, y + 2, 4, 6); R("#ff3d57", x + 2, y + 3, 6, 4); R("#ffd0dc", x + 4, y + 4, 2, 2);
  }
  // Soft round glow (cached radial gradient per colour), centred on cx, cy.
  const GLOWS = {};
  function glow(col, cx, cy, r, a) {
    let g = GLOWS[col];
    if (!g) {
      g = GLOWS[col] = document.createElement("canvas"); g.width = g.height = 64;
      const c = g.getContext("2d"), gr = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, col); gr.addColorStop(0.35, col + "aa"); gr.addColorStop(1, col + "00");
      c.fillStyle = gr; c.fillRect(0, 0, 64, 64);
    }
    const pa = ctx.globalAlpha; ctx.globalAlpha = pa * Math.max(0, Math.min(1, a));
    ctx.drawImage(g, cx - r, cy - r, r * 2, r * 2); ctx.globalAlpha = pa;
  }
  function drawPick(k) {
    if (k.kind === "dice") {
      const x = Math.round(k.x), y = -Math.round(k.h) - 6 + Math.round(Math.sin(G.t * 4) * 1.5), img = ART("pickup_dice");
      glow("#ff3d57", x + 5, y + 5, 11, 0.45 + Math.sin(G.t * 6) * 0.2);
      if (img) ctx.drawImage(img, x - 1, y - 1, 12, 12); else drawDiceCrate(x, y);
      return;
    }
    if (k.kind === "skate") {
      const x = Math.round(k.x), y = -Math.round(k.h) - 4 + Math.round(Math.sin(G.t * 5) * 2), img = ART("pickup_skate");
      glow(BULBS[Math.floor(G.t * 8) % 6][1], x + 7, y + 1, 13, 0.5 + Math.sin(G.t * 8) * 0.2);
      if (img) ctx.drawImage(img, x - 2, y - 4, 18, 10); else drawBoard(x - 1, y);
      return;
    }
    const x = Math.round(k.x), y = -Math.round(k.h) - 4;
    const tw = 0.75 + Math.sin(G.t * 5 + k.ph) * 0.25;
    const img = ART("bulb_" + k.name);
    // glow
    glow(k.col, x + 2, y + 3, k.gold ? 9 : 7, (k.gold ? 0.6 : 0.45) * tw);
    if (img) { ctx.drawImage(img, x - 1, y - 2, 6, 9); return; }
    R("#3b3446", x + 1, y - 2, 3, 2);                  // socket
    R("#1a1124", x, y, 5, 6); R(k.col, x + 1, y, 3, 5); R(k.col, x + 2, y + 5, 1, 1);
    R("#ffffff", x + 1, y + 1, 1, 1);
    if (k.gold && Math.floor(G.t * 8 + k.ph) % 3 === 0) { R("#ffffff", x - 2, y + 2, 1, 1); R("#ffffff", x + 6, y, 1, 1); }
  }
  function drawShot(s) {
    const x = Math.round(s.x), y = -s.h - 4, img = ART("shot_spore");
    if (img && !s.ref) { ctx.drawImage(img, x - 1, y - 1, 6, 6); return; }
    R(s.ref ? "rgba(95,208,200,.4)" : "rgba(255,61,87,.4)", x - 1, y - 1, 6, 6);
    R(s.ref ? "#5fd0c8" : "#ff6b8f", x, y, 4, 4); R("#ffffff", x + 1, y + 1, 1, 1);
  }

  // ---------- animation frames ----------
  // Art for a state is looked up as <prefix>_<state>1, _<state>2, ... (any
  // number of frames), or a single <prefix>_<state>. Returns [] if none.
  function frames(prefix, state) {
    const out = [];
    for (let i = 1; i <= 8; i++) { const k = `${prefix}_${state}${i}`; if (SPR.ART[k]) out.push(k); else break; }
    if (!out.length && SPR.ART[`${prefix}_${state}`]) out.push(`${prefix}_${state}`);
    return out;
  }
  const PLAYER_FALLBACK = { skate: ["run2"], idle: ["run2"], run: ["run1", "run2"], jump: ["jump"], attack: ["attack"], roll: ["roll"], die: ["jump"] };
  // the player's frames for a state: own class art, else the Fighter's, else placeholder
  function pframes(state) {
    const sh = SAVE.state.sheet;
    let f = sh ? frames(sh.cls, state) : [];
    if (!f.length) f = frames("fighter", state);
    if (!f.length && state === "idle") f = pframes("run").slice(-1);
    if (!f.length && state === "die") f = pframes("jump").slice(-1); // tumble pose: the falling jump frame
    if (!f.length && state === "skate") f = pframes("run").slice(-1); // riding pose: a run frame on the board
    return f.length ? f : PLAYER_FALLBACK[state];
  }
  const cyc = (list, time, fps) => list[Math.floor(time * fps) % list.length];
  // painted frames for a state (own class, else the Fighter's), or [] when there is no art for it
  function artFrames(state) { const sh = SAVE.state.sheet, f = sh ? frames(sh.cls, state) : []; return f.length ? f : frames("fighter", state); }
  // idle with a bounce: 3 frames play stand, bounce (knees bent), stand, breathe in
  const idleCyc = (list, time, fps) => list.length === 3 ? list[[0, 1, 0, 2][Math.floor(time * fps) % 4]] : cyc(list, time, fps);

  // player art per class: "ranger_run1" etc., falling back to "run1"
  function pk(frame) {
    const sh = SAVE.state.sheet, k = sh && sh.cls + "_" + frame;
    if (k && SPR.ART[k]) return k;
    return SPR.ART["fighter_" + frame] ? "fighter_" + frame : frame; // class without art yet
  }
  function attackCfg() {
    const sh = SAVE.state.sheet, c = SAVE.CLASSES.find(x => sh && x.id === sh.cls) || SAVE.CLASSES[0];
    return c.attack || { type: "melee", dmg: 1, cd: 0.32 };
  }
  function ranged() { return attackCfg().type !== "melee"; }
  function perk() {
    const sh = SAVE.state.sheet, c = SAVE.CLASSES.find(x => sh && x.id === sh.cls) || SAVE.CLASSES[0];
    return c.perk || {};
  }
  G.perk = perk;
  G.attackCfg = attackCfg; G.BAL = BAL;
  G.pk = pk;
  let lampAt = null;
  function drawPlayer() {
    if (P.die) return; // drawn by drawDeath, over the floor
    if (P.inv > 0 && Math.floor(G.t * 20) % 2) return;
    let h = P.h;
    if (P.flip > 0) { const pr = 1 - P.flip / FLIP_T; h = pr < 0.5 ? -18 * pr * 2 : -18 * (1 - (pr - 0.5) * 2); }
    local(P.side);
    if (P.side === 1) { // the clip lamp on the chest lights the way in the dark
      const ly = -h - (P.roll > 0 && P.flip <= 0 ? 6 : 13) - (P.skate > 0 ? 4 : 0), lx = PX + 9;
      const g = ctx.createRadialGradient(lx + 1, ly, 2, lx + 30, ly, 50);
      g.addColorStop(0, "rgba(255,243,176,.35)"); g.addColorStop(1, "rgba(255,243,176,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(lx, ly - 1); ctx.lineTo(PX + 90, ly - 24); ctx.lineTo(PX + 90, ly + 22); ctx.closePath(); ctx.fill();
      lampAt = [lx, ly];
    } else lampAt = null;
    R("rgba(0,0,0,.3)", PX + 1, -1, 10 - Math.min(6, Math.floor(Math.max(0, h) / 8)), 1);
    const idle = G.mode === "attract";
    if (P.roll > 0 && P.flip <= 0) {
      const rf = pframes("roll");
      ctx.save(); ctx.translate(PX + 6, -h - 6);
      // one roll drawing is spun by the game; several drawings play as frames
      if (rf.length === 1) ctx.rotate(Math.floor(G.t * 16) * Math.PI / 2);
      const rk = rf.length === 1 ? rf[0] : cyc(rf, P.runT, 14), rs = SPR.ART[rk] && SPR.SIZE[rk];
      if (rs) { ctx.translate(0, -1); ctx.drawImage(SPR.ART[rk], -rs[0] / 2, -rs[1] / 2, rs[0], rs[1]); }
      else ctx.drawImage(S.roll, -6, -6, 12, 12);
      ctx.restore();
    } else {
      let key, state;
      if (P.atk > 0) { // attack frames spread over the swing, legs keep running in the art
        state = "attack"; const af = pframes("attack"), dur = ranged() ? 0.22 : 0.2;
        key = af[Math.min(af.length - 1, Math.floor((1 - P.atk / dur) * af.length))];
      } else if (P.crash > 0 && artFrames("crash").length) { // the board snaps under him, he pitches forward
        state = "crash"; const cf = artFrames("crash"); key = cf[Math.min(cf.length - 1, Math.floor((1 - P.crash / 0.4) * cf.length))];
      } else if (P.skate > 0 && !P.grounded && artFrames("kick").length) { // kickflip: pop, flip, catch, land
        state = "kick"; const kf = artFrames("kick"), n = kf.length;
        key = P.vh > 0 ? (P.h < 6 ? kf[0] : kf[Math.min(1, n - 1)]) : P.h > 9 ? kf[Math.min(2, n - 1)] : kf[n - 1];
      } else if (P.skate > 0 && P.grounded) { // ride pose, with a short fist-pump push every 1.5 s
        state = "skate"; const sf = pframes("skate"); key = sf.length > 1 && G.t % 1.5 > 1.05 ? sf[1] : sf[0];
      }
      else if (idle) { state = "idle"; key = idleCyc(pframes("idle"), G.t, 4); }
      else if (!P.grounded && P.flip <= 0) { // jump: first frame rising, last frame falling
        state = "jump"; const jf = pframes("jump"); key = P.vh > 0 ? jf[0] : jf[jf.length - 1];
      } else { state = "run"; key = cyc(pframes("run"), P.runT, pframes("run").length > 2 ? 12 : 8); }
      const onBoard = P.skate > 0;
      if (onBoard) { // rainbow shimmer like a star power-up, riding a board
        ctx.filter = `hue-rotate(${Math.floor(G.t * 900) % 360}deg) saturate(1.6)`;
        if (P.skate < 1 && Math.floor(G.t * 12) % 2) ctx.filter = "none"; // flicker as it runs out
      }
      const boardInArt = onBoard && (state === "kick" || (state === "skate" && artFrames("skate").length > 0));
      draw(ctx, key, PX, -h - (onBoard && !boardInArt ? 4 : 0));
      ctx.filter = "none";
      if (onBoard && !boardInArt) drawBoard(PX - 1, -h - 4);
      if (lampAt && P.roll <= 0 && !SPR.ART[key]) { // the lamp glows on the jacket (painted art has its own)
        ctx.globalAlpha = 0.55 + Math.sin(G.t * 9) * 0.1; R("#fff3b0", lampAt[0] - 1, lampAt[1] - 1, 2, 2); ctx.globalAlpha = 0.25; R("#fff3b0", lampAt[0] - 2, lampAt[1] - 2, 4, 4); ctx.globalAlpha = 1;
      }
      if (P.atk > 0 && !ranged() && !SPR.ART[key]) { // placeholder bat (painted art swings its own)
        const reach = (G.stats || SAVE.runStats()).reach, pr = 1 - P.atk / 0.2, ang = -1.3 + pr * 2.2;
        for (let i = 0; i < reach; i++) R(i < 5 ? "#5a3220" : "#a8743a", PX + 9 + Math.cos(ang) * i, -h - 9 + Math.sin(ang) * i, 2, 2);
      }
    }
    if (!ranged() && G.mode === "play" && P.flip <= 0) drawReach(h);
    ctx.restore();
  }

  // Melee reach: each swing sweeps a bright white crescent at exactly the bat's reach
  // (grows with STR upgrades), like a slash.
  const REACH_A0 = -1.35, REACH_A1 = 1.0;
  // The melee hitbox is the swing arc itself: a box is hit when part of it lies in front of
  // the hero and within the arc's radius of the swing's pivot (same pivot/radius as drawReach).
  function meleeHits(x, w, h0, h1) {
    const r = (G.stats || SAVE.runStats()).reach + 3, cx = PX + 8, cy = P.h + (P.roll > 0 ? 6 : 11);
    if (x + w < PX + 6) return false;                                  // behind the hero
    const nx = Math.max(x, Math.min(cx, x + w)), ny = Math.max(h0, Math.min(cy, h1));
    if (ny < cy - Math.sin(REACH_A1) * r - 1) return false;             // below the arc's low tip
    const dx = nx - cx, dy = ny - cy;
    return dx * dx + dy * dy <= r * r;
  }
  function drawReach(h) {
    const reach = (G.stats || SAVE.runStats()).reach, r = reach + 1;
    const cx = PX + 8, cy = -h - (P.roll > 0 ? 6 : 11);
    const dot = (a, rr, col) => R(col, Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr), 1, 1);
    if (P.atk <= 0) return;
    const pr = 1 - P.atk / 0.2, span = REACH_A1 - REACH_A0;
    const head = REACH_A0 + Math.min(1, pr / 0.6) * span;           // sweeps in the first 60% of the swing
    const fade = pr < 0.6 ? 1 : 1 - (pr - 0.6) / 0.4;               // then fades out
    for (let a = REACH_A0; a <= head; a += 0.03) {
      const u = (a - REACH_A0) / span, k = (a - REACH_A0) / Math.max(0.001, head - REACH_A0);
      const th = Math.max(1, Math.round(Math.sin(Math.PI * u) * 5 * (0.4 + 0.6 * k)));  // fat in the middle, sharp tips
      ctx.globalAlpha = fade * (0.35 + 0.65 * k);
      for (let i = 0; i < th; i++) dot(a, r - i, i === 0 ? "#ffffff" : "#e8f0ff");
    }
    ctx.globalAlpha = 1;
  }

  function drawDeath() {
    const d = P.die;
    if (d.slide) { // frames play once: hit, falling, landing, sliding, lying still
      const f = artFrames("die"), times = [0, 0.2, 0.38, 0.56, 0.76, 0.98, 1.22];
      let i = 0; while (i < f.length - 1 && d.t >= times[i + 1]) i++;
      local(d.side); draw(ctx, f[i], PX + Math.round(d.x || 0), -Math.round(d.h)); ctx.restore();
      return;
    }
    if (d.y > H + 30) return;
    // die frames: 1 = hit, the middle ones tumble, the last one falls limp (once it drops fast)
    const f = pframes("die"), n = f.length, el = 1.3 - G.overT;
    const key = n < 3 ? cyc(f, G.t, 8) : el < 0.15 ? f[0] : n >= 4 && d.vy > 260 ? f[n - 1] : f[1 + Math.floor(el * 8) % (n >= 4 ? n - 2 : n - 1)];
    ctx.save(); ctx.translate(Math.round(d.x), Math.round(d.y)); ctx.rotate(d.rot); ctx.scale(1, d.mir);
    draw(ctx, key, -6, 9);
    ctx.restore();
  }

  function drawFloor() {
    const F = SPR.ART.floor;
    const fh = FB - FT;
    tile(F || BG.floor, G.scroll, FT, (F || BG.floor).width * fh / (F || BG.floor).height, fh);
    const p = 0.35 + Math.sin(G.t * 3) * 0.15;
    ctx.fillStyle = `rgba(255,61,87,${p})`; ctx.fillRect(0, FB - 1, W, 1);
  }

  function heart(x, y, full, col) {
    const img = !col && ART(full ? "hud_heart_full" : "hud_heart_empty");
    if (img) { ctx.drawImage(img, x, y, 9, 8); return; }
    const c = col || (full ? "#ff3d57" : "#3a2550");
    R("#1a1124", x, y + 1, 9, 5); R("#1a1124", x + 1, y, 3, 8); R("#1a1124", x + 5, y, 3, 8); R("#1a1124", x + 3, y + 6, 3, 2);
    R(c, x + 1, y + 1, 3, 4); R(c, x + 5, y + 1, 3, 4); R(c, x + 2, y + 4, 5, 2); R(c, x + 3, y + 6, 3, 1);
    if (full && !col) R("#ffb0bc", x + 2, y + 2, 1, 1);
  }

  function drawFate() {
    const f = G.fate; if (!f || f.t > 2.8) return;
    const rolling = f.t < 0.9;
    const n = rolling ? 1 + Math.floor((G.t * 30) % 20) : f.roll;
    const cx = W / 2, y = 26, a = f.t > 2.4 ? (2.8 - f.t) / 0.4 : 1;
    ctx.globalAlpha = a;
    // pixel d20 badge
    const col = rolling ? "#f3e9dc" : f.f.col;
    if (ART("hud_d20")) ctx.drawImage(ART("hud_d20"), cx - 13, y - 1, 26, 24);
    else {
      R("#1a1124", cx - 13, y - 1, 26, 24);
      R("#2b1a3d", cx - 12, y, 24, 22);
      R(col, cx - 12, y, 24, 1); R(col, cx - 12, y + 21, 24, 1); R(col, cx - 12, y, 1, 22); R(col, cx + 11, y, 1, 22);
    }
    text(String(n), cx, y + 7, col, "center");
    text(T_("hud.fate"), cx, y - 11, "#a998b8", "center");
    if (!rolling) text(T_(f.f.label), cx, y + 27, f.f.col, "center");
    ctx.globalAlpha = 1;
  }

  function drawHud() {
    if (G.mode === "attract") return;
    const st = G.stats;
    for (let i = 0; i < st.hearts; i++) heart(6 + i * 11, 6, i < G.hearts);
    if (P.skate > 0) { // skateboard time left, rainbow bar under the hearts
      const f = P.skate / st.skate;
      R("#1a1124", 5, 19, 52, 4); R(BULBS[Math.floor(G.t * 8) % 6][1], 6, 20, Math.round(50 * f), 2);
    }
    // left to right: hearts, extra life (Second wind), the Fighter's lid. Each has its own slot.
    let hx = 6 + st.hearts * 11 + 2;
    if (G.reviveLeft) { // a small teal heart with a plus
      if (ART("hud_revive")) ctx.drawImage(ART("hud_revive"), hx, 6, 9, 9);
      else { heart(hx, 6, true, "#5fd0c8"); R("#ffffff", hx + 4, 8, 1, 3); R("#ffffff", hx + 3, 9, 3, 1); }
      hx += 13;
    }
    if (perk().shield) { // the Fighter's lid: bright when ready, dim while recharging
      const ok = G.shieldT <= 0;
      const sh = ART("hud_shield");
      if (sh) { // your shield icon: full colour when ready, greyed and dim while recharging
        if (!ok) { ctx.filter = "grayscale(1) brightness(.55)"; ctx.globalAlpha = 0.8; }
        ctx.drawImage(sh, hx - 1, 5, 11, 11); ctx.filter = "none"; ctx.globalAlpha = 1;
      } else { R("#1a1124", hx, 6, 9, 9); R(ok ? "#c9d1dc" : "#4c4e5a", hx + 1, 7, 7, 7); R(ok ? "#9a9caa" : "#3b3446", hx + 3, 9, 3, 3); }
      if (!ok) R("#5fd0c8", hx, 17, Math.round(9 * (1 - G.shieldT / perk().shield)), 1);
    }
    if (perk().shield) hx += 13;
    if (G.board && !(P.skate > 0)) { // the skateboard you bought, with its key
      drawBoard(hx, 9, 12); text(INPUT.label("board"), hx + 15, 6, "#ffd866");
    }
    text(String(Math.floor(G.score)).padStart(6, "0"), W - 6, 6, "#ffd866", "right");
    text(T_("hud.hi") + " " + String(Math.max(SAVE.state.best, Math.floor(G.score))).padStart(6, "0"), W - 64, 6, "#f3e9dc", "right");
    if (ART("hud_light")) ctx.drawImage(ART("hud_light"), W - 47, 16, 7, 10);
    else { R("#3b3446", W - 45, 16, 3, 2); R("#1a1124", W - 46, 18, 5, 7); R(BULBS[Math.floor(G.t * 2) % 6][1], W - 45, 18, 3, 6); }
    text(String(G.shards), W - 6, 18, "#f3e9dc", "right");
    if (G.dice > 0) { // Dice Crates found this run
      if (ART("pickup_dice")) ctx.drawImage(ART("pickup_dice"), W - 48, 29, 9, 9); else { ctx.save(); ctx.translate(W - 48, 29); ctx.scale(0.8, 0.8); drawDiceCrate(0, 0); ctx.restore(); }
      text(String(G.dice), W - 6, 30, "#ff9fb4", "right");
    }

    const bw = 70, f = G.dread / st.battery, DX = Math.round(W / 2 - bw / 2) - 6; // centred, clear of phone buttons
    ctx.save(); ctx.translate(DX, 0);
    if (P.side) { // HEAT x2.5   haul +340  12 lights
      const hp = Math.round(G.haul.dist + G.haul.combat + G.haul.lights);
      text(T_("hud.heat") + " x" + G.heat.toFixed(1), 6, H - 22, G.heat >= 3 ? "#ffd866" : "#ff6b8f");
      text("+" + hp + (G.haul.n ? "  \u2022" + G.haul.n : ""), bw + 12, H - 22, "#5fd0c8");
    } else text(T_("hud.dread"), 6, H - 22, "#a998b8");
    const fr = ART("hud_dread_frame"), fl = ART("hud_dread_fill");
    if (fr) ctx.drawImage(fr, 3, H - 13, bw + 6, 10);
    else { R("#1a1124", 5, H - 11, bw + 2, 6); R("#3a2550", 6, H - 10, bw, 4); }
    if (fl && f > 0) ctx.drawImage(fl, 0, 0, Math.max(1, Math.round(fl.width * f)), fl.height, 6, H - 10, Math.round(bw * f), 4);
    else R(f > 0.7 ? (Math.floor(G.t * 8) % 2 ? "#ff3d57" : "#ffd0dc") : "#b0305a", 6, H - 10, Math.round(bw * f), 4);
    if (fl && f > 0.7 && Math.floor(G.t * 8) % 2) R("rgba(255,255,255,.35)", 6, H - 10, Math.round(bw * f), 4);
    if (P.flipLock > 0) text(T_("hud.locked"), 82, H - 12, "#ff3d57");
    ctx.restore();
    drawFate();
  }

  function render() {
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    ctx.save();
    if (G.shake > 0) ctx.translate(Math.round(rand(-G.shake, G.shake) / 2), Math.round(rand(-G.shake, G.shake) / 2));
    drawWorld();
    for (const side of [0, 1]) {
      local(side);
      drawClub(side === 1);
      for (const o of G.obs) if (o.platform && o.side === side) drawPlatform(o); // rooftops behind everything
      drawWires(side);
      for (const k of G.picks) if (k.side === side) drawPick(k);
      for (const o of G.obs) if (o.side === side && !o.dead && !o.platform) {
        ctx.save(); if (o.onRoof) ctx.translate(0, -o.h0); // crates standing on a roof
        if (o.flash > 0) ctx.filter = "brightness(3)";
        drawOb(o); ctx.filter = "none";
        if (o.heart) { // heart crate: a beating heart on the front, always upright
          ctx.save(); ctx.translate(o.x + o.w / 2, -o.w / 2); if (side) ctx.scale(1, -1);
          glow("#ff3d57", 0, -1, 9, 0.5 + Math.sin(G.t * 6) * 0.2);
          heart(-4.5, -4, true); ctx.restore();
        }
        ctx.restore();
      }
      for (const s of G.shots) if (s.side === side) drawShot(s);
      for (const m of G.pshots) if (m.side === side) {
        const bolt = m.kind === "bolt", img = ART(bolt ? "wizard_d20" : "ranger_shot"), y = Math.round(-m.h - 3) + (m.kind === "skip" ? Math.round(Math.abs(Math.sin(m.x / 9)) * -2) : 0);
        if (img) ctx.drawImage(img, Math.round(m.x) - (bolt ? 8 : 6), y - 1, bolt ? 10 : 12, bolt ? 8 : 6);
        else if (bolt) { R("#3a1a08", m.x - 1, y - 2, 6, 6); R("#ff9a2e", m.x, y - 1, 4, 4); R("#fff3a0", m.x + 2, y, 2, 2); for (let k = 1; k <= 3; k++) R(k % 2 ? "#ffd23a" : "#ff5a3a", m.x - 2 - k * 3, y + ((k * 7 + Math.round(m.x)) % 3) - 1, 2, 1); }
        else { R("#1a1124", m.x - 1, y - 1, 5, 5); R("#4da3ff", m.x, y, 3, 3); R("#ffffff", m.x, y, 1, 1); }
      }
      ctx.restore();
    }
    drawPlayer();
    drawFloor();
    if (P.die) drawDeath();
    for (const o of G.obs) if (o.wall && o.x > W - 4 && Math.floor(G.t * 8) % 2) {
      const y = o.side ? FB + 40 : FT - 50;
      if (ART("hud_warning")) { ctx.drawImage(ART("hud_warning"), W - 13, y - 1, 11, 13); continue; }
      R("#1a1124", W - 12, y - 1, 9, 12); R(o.side ? "#ff3d57" : "#ffd866", W - 11, y, 7, 10); R("#1a1124", W - 8, y + 2, 1, 4); R("#1a1124", W - 8, y + 7, 1, 1);
    }
    for (const p of G.parts) R(p.col, p.x, p.y, p.s, p.s);
    for (const p of G.pops) { ctx.globalAlpha = Math.min(1, p.life * 2); text(p.txt, p.x, p.y, p.col, "center"); ctx.globalAlpha = 1; }
    if (P.side === 1 && G.stats && G.mode !== "attract") {
      const f = G.dread / G.stats.battery;
      if (f > 0.4) {
        const a = (f - 0.4) * 0.8 * (0.7 + Math.sin(G.t * 12) * 0.3);
        const g = ctx.createRadialGradient(W / 2, (FB + H) / 2, 30, W / 2, (FB + H) / 2, 230);
        g.addColorStop(0, "rgba(255,0,40,0)"); g.addColorStop(1, `rgba(255,0,40,${a})`);
        ctx.fillStyle = g; ctx.fillRect(0, FB, W, H - FB);
      }
    }
    if (G.flash > 0) { ctx.globalAlpha = Math.min(0.6, G.flash * 2.5); ctx.fillStyle = G.flashCol; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    drawHud();
    if (G.debug.hitboxes) drawHitboxes();
    ctx.restore();
  }

  // ---------------- The Watcher (Upside Down sky, scenery only) ----------------
  // An original colossal shadow creature that now and then rises in the
  // Upside Down sky. Barely visible; lightning lights it up. It sways its
  // head and bobs while it slowly drifts past. Art: watcher_body + watcher_head.
  G.watchT = rand(15, 30);
  function updateWatcher(dt) {
    if (G.mode === "pause") return;
    if (!G.watch) {
      G.watchT -= dt;
      if (G.watchT <= 0) G.watch = { x: rand(W * 0.45, W * 0.8), t: 0, life: rand(20, 28) };
      return;
    }
    const w = G.watch; w.t += dt; w.x -= (G.speed * 0.03 + 2.5) * dt;
    if (w.t > w.life) { G.watch = null; G.watchT = rand(35, 70); }
  }
  G.summonWatcher = () => { G.watch = { x: W * 0.6, t: 0, life: 25 }; };
  function drawWatcher() {
    const w = G.watch; if (!w) return;
    const fade = Math.min(1, w.t / 3, (w.life - w.t) / 3);
    const flash = G.bolt ? G.bolt.life / 0.25 : 0;
    const alpha = fade * (0.12 + 0.6 * flash);
    if (alpha <= 0.01) return;
    const bob = Math.sin(w.t * 1.3) * 2, sway = Math.sin(w.t * 0.6) * 0.16;
    const lit = flash > 0.05;
    local(1); ctx.globalAlpha = alpha;
    const P1 = SPR.ART.watcher_1, P2 = SPR.ART.watcher_2, B = SPR.ART.watcher_body, Hd = SPR.ART.watcher_head;
    if (P1) { // two poses that slowly breathe into each other, swaying from the base
      const k = P2 ? (Math.sin(w.t * 0.7) + 1) / 2 : 0;
      if (lit) ctx.filter = `brightness(${1 + flash * 1.5}) drop-shadow(2px 0 0 #0b0610) drop-shadow(-2px 0 0 #0b0610) drop-shadow(0 2px 0 #0b0610) drop-shadow(0 -2px 0 #0b0610)`;
      ctx.translate(Math.round(w.x), 0); ctx.rotate(sway * 0.25);
      for (const [img, a] of [[P1, 1 - k], [P2, k]]) {
        if (!img || a <= 0.01) continue;
        const sz = SPR.SIZE[img === P1 ? "watcher_1" : "watcher_2"] || [img.width / 9, img.height / 9];
        ctx.globalAlpha = alpha * a; ctx.drawImage(img, -sz[0] / 2, Math.round(-sz[1] + bob), sz[0], sz[1]);
      }
      ctx.filter = "none";
    } else if (B && Hd) {
      const bs = SPR.SIZE.watcher_body || [80, 70], hs = SPR.SIZE.watcher_head || [40, 34];
      if (lit) ctx.filter = `brightness(${1 + flash * 1.5}) drop-shadow(2px 0 0 #0b0610) drop-shadow(-2px 0 0 #0b0610) drop-shadow(0 2px 0 #0b0610) drop-shadow(0 -2px 0 #0b0610)`;
      ctx.drawImage(B, Math.round(w.x - bs[0] / 2), Math.round(-bs[1] + bob), bs[0], bs[1]);
      ctx.translate(Math.round(w.x), Math.round(-bs[1] + bob + 3)); ctx.rotate(sway);
      ctx.drawImage(Hd, -hs[0] / 2, -hs[1], hs[0], hs[1]);
      ctx.filter = "none";
    } else watcherPlaceholder(w.x, bob, sway, lit, w.t);
    ctx.restore();
  }
  // simple silhouette until the art arrives: a root-and-smoke giant with antlers
  function watcherPlaceholder(x, bob, sway, lit, t) {
    const col = lit ? "#5a0f1e" : "#050104", rim = "#ff5a6e";
    ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - 16, 0); ctx.quadraticCurveTo(x - 6, -30 + bob, x - 5, -58 + bob);
    ctx.lineTo(x + 5, -58 + bob); ctx.quadraticCurveTo(x + 6, -30 + bob, x + 16, 0); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 3;
    for (const d of [-1, 1]) {
      const reach = Math.sin(t * 0.8 + d) * 3;
      ctx.beginPath(); ctx.moveTo(x + d * 4, -52 + bob);
      ctx.quadraticCurveTo(x + d * 26, -66 + bob, x + d * (44 + reach), -40 + bob); ctx.stroke();
      ctx.lineWidth = 1.5;
      for (const f of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(x + d * (44 + reach), -40 + bob); ctx.lineTo(x + d * (49 + reach), -33 + bob + f * 0.5); ctx.stroke(); }
      ctx.lineWidth = 3;
    }
    ctx.save(); ctx.translate(x, -58 + bob); ctx.rotate(sway);
    ctx.beginPath(); ctx.ellipse(0, -9, 6, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 1.5;
    for (const d of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(d * 3, -16); ctx.lineTo(d * 10, -28); ctx.lineTo(d * 18, -34); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d * 10, -28); ctx.lineTo(d * 9, -38); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d * 15, -32); ctx.lineTo(d * 22, -30); ctx.stroke();
    }
    if (lit) { ctx.fillStyle = rim; ctx.fillRect(-3, -11, 1.5, 1.5); ctx.fillRect(2, -11, 1.5, 1.5); }
    ctx.restore();
  }

  // ---------------- Debug: hitboxes ----------------
  function drawHitboxes() {
    const box = (side, x, h0, w, h1, col) => {
      const y0 = side ? FB + h0 : FT - h1, hh = h1 - h0;
      ctx.strokeStyle = col; ctx.lineWidth = 1 / SCALE; ctx.strokeRect(x, y0, w, hh);
    };
    if (!P.dead) {
      box(P.side, PX + 3, P.h, 7, P.h + (P.roll > 0 ? ROLL_H : STAND_H), P.inv > 0 || P.flip > 0 ? "#888" : "#5fd0c8");
      if (P.atk > 0) box(P.side, PX + 6, P.h - 2, 3 + G.stats.reach, P.h + 24, "#ffd866");
      if (P.blk > 0) box(P.side, PX + 10, P.h, 6, P.h + 16, "#4da3ff");
    }
    for (const o of G.obs) if (!o.dead) box(o.side, o.x, o.h0, o.w, Math.min(o.h1, 104), o.crate ? "#a8743a" : o.enemy ? "#ff3d57" : "#ff9a3d");
    for (const sh of G.shots) box(sh.side, sh.x, sh.h, 4, sh.h + 4, "#ff6bd0");
    for (const k of G.picks) box(k.side, k.x - 1, k.h - 4, 6, k.h + 6, "#5fd068");
  }

  // ---------------- Player manual previews ----------------
  // Draws one manual entry (hero, enemy or item) into a small canvas with the
  // same drawing code as the game: 48 x 40 game px, feet on the floor at y 36.
  const PV_W = 48, PV_H = 40, PV_FLOOR = 34;
  const PV_ENEMY = { crow: ["crow", "fly", 15], crawler: ["hound", "run", 0], wisp: ["flyer", "fly", 12], pod: ["pod", "idle", 0], stalker: ["stalker", "walk", 0] };
  // One manual entry (hero, monster or item) with its feet / base at (cx, 0) in the current ctx.
  // scene = the hero bounces on the spot instead of running.
  function drawEntry(kind, what, t, cx, scene) {
    if (kind === "hero") {
      // running along the street, with a swing / shot every 2.6 s
      const run = frames(what, "run"), atk = frames(what, "attack"), at = t % 2.6;
      if (scene && run.length) { // in the street scene: bouncing on the spot, swinging now and then
        const idle = frames(what, "idle"), key = atk.length && at > 2.25 ? atk[Math.min(atk.length - 1, Math.floor((at - 2.25) / 0.35 * atk.length))] : idle.length ? idleCyc(idle, t, 4) : run[0];
        draw(ctx, key, cx - 8, 0);
      } else if (run.length) {
        const key = atk.length && at > 2.25 ? atk[Math.min(atk.length - 1, Math.floor((at - 2.25) / 0.35 * atk.length))] : cyc(run, t, run.length > 2 ? 12 : 8);
        draw(ctx, key, cx - 8, 0);
      } else { // no art yet: a mystery silhouette, bouncing
        let f = frames("fighter", "idle"); if (!f.length) f = PLAYER_FALLBACK.idle;
        ctx.filter = "brightness(0.12)"; draw(ctx, idleCyc(f, t, 4), cx - 7, 0); ctx.filter = "none";
      }
    } else if (kind === "en") {
      if (what === "watcher") {
        const P1 = ART("watcher_1"), P2 = ART("watcher_2"), m = Math.sin(t * 0.7) * 0.5 + 0.5;
        ctx.filter = `brightness(${1.8 + Math.max(0, Math.sin(t * 2.3) - 0.85) * 12}) drop-shadow(2px 0 0 #0b0610) drop-shadow(-2px 0 0 #0b0610) drop-shadow(0 2px 0 #0b0610) drop-shadow(0 -2px 0 #0b0610)`; // lit by lightning now and then
        if (P1) for (const [img, a, key] of [[P1, 1 - m, "watcher_1"], [P2, m, "watcher_2"]]) {
          if (!img) continue; const sz = SPR.SIZE[key] || [img.width / 9, img.height / 9], s = 46 / Math.max(sz[0], 58);
          ctx.globalAlpha = a; ctx.drawImage(img, cx - sz[0] * s / 2, -sz[1] * s + Math.sin(t * 1.3), sz[0] * s, sz[1] * s);
        } else { ctx.save(); ctx.translate(cx, 0); ctx.scale(0.5, 0.5); watcherPlaceholder(0, Math.sin(t * 1.3) * 2, Math.sin(t * 0.6) * 0.16, false, t); ctx.restore(); }
        ctx.globalAlpha = 1; ctx.filter = "none";
      } else {
        const T = TYPES[what] || {}, e = PV_ENEMY[what];
        const o = { type: what, x: 0, t, side: -1, w: T.w || 12, h0: e ? e[2] : T.h0 || 0, h1: T.h1 || 12, enemy: !!T.enemy, vh: 0 };
        if (what === "wisp") o.h0 += Math.round(Math.sin(t * 3) * 2);
        if (what === "pod") o.t = t % 1.6;
        o.x = Math.round(cx - o.w / 2);
        const idle = e && frames(e[0], "idle");
        if (idle && idle.length) draw(ctx, idleCyc(idle, t, 6), o.x, -o.h0);
        else if (what === "stalker") { ctx.save(); ctx.translate(cx, 0); ctx.scale(0.7, 0.7); ctx.translate(-cx, 0); drawOb(o); ctx.restore(); } // 44 px tall: shrunk to fit
        else drawOb(o);
      }
    } else if (kind === "it") {
      if (what === "bulb" || what === "gold") {
        for (let i = 0; i < (what === "gold" ? 1 : 3); i++) {
          const b = what === "gold" ? ["gold", "#ffd866"] : BULBS[i * 2];
          drawPick({ x: what === "gold" ? cx - 2 : cx - 14 + i * 12, h: 10 + (what === "gold" ? 0 : Math.sin(i) * 4), name: b[0], col: b[1], gold: what === "gold", ph: i });
        }
      } else if (what === "dice") drawPick({ kind: "dice", x: cx - 5, h: 8 });
      else if (what === "board") drawPick({ kind: "skate", x: cx - 8, h: 8 });
      else if (what === "revive") { ctx.save(); ctx.translate(cx, -16); ctx.scale(2, 2); heart(-4.5, -4, true, "#5fd0c8"); ctx.restore(); }
      else { // crates
        const tier = what === "crate10" ? 10 : 3, w = tier >= 10 ? 13 : 10;
        drawOb({ type: what === "dark" ? "crate_dark" : "crate", x: Math.round(cx - w / 2), t, w, h0: 0, h1: w, tier, heart: what === "heart", crate: true });
        if (what === "heart") { ctx.save(); ctx.translate(cx, -w / 2); glow("#ff3d57", 0, -1, 9, 0.5 + Math.sin(t * 6) * 0.2); heart(-4.5, -4, true); ctx.restore(); }
      }
    }
  }
  G.preview = function (canvas, id, t) {
    const c2 = canvas.getContext("2d"), main = ctx, gt = G.t, [kind, what] = id.split(":");
    const k = canvas.width / PV_W, dark = canvas.dataset.side === "1";
    c2.setTransform(1, 0, 0, 1, 0, 0); c2.imageSmoothingEnabled = false; c2.clearRect(0, 0, canvas.width, canvas.height);
    ctx = c2; G.t = t;
    try {
      c2.scale(k, k);
      const g = c2.createLinearGradient(0, 0, 0, PV_H);
      g.addColorStop(0, dark ? "#1c0812" : "#1d2540"); g.addColorStop(1, dark ? "#4a1630" : "#4a4466");
      c2.fillStyle = g; c2.fillRect(0, 0, PV_W, PV_H);
      // the street scrolls by: heroes run right (floor moves left), monsters come at you (floor moves right)
      const moving = { crow: -34, crawler: -46, wisp: -26, stalker: -18 }, F = SPR.ART.floor || BG.floor;
      const scroll = kind === "hero" ? t * 52 : kind === "en" ? t * (moving[what] || 0) : 0;
      c2.save();
      if (dark) { c2.translate(0, 2 * PV_FLOOR + 16); c2.scale(1, -1); } // Upside Down: the underside of the street
      tile(F, scroll, PV_FLOOR, F.width * 16 / F.height, 16);
      c2.restore();
      c2.translate(0, PV_FLOOR);
      drawEntry(kind, what, t, PV_W / 2, false);
    } finally { ctx = main; G.t = gt; }
  };
  G.spawn = (type, dx = 0) => addOb(type, W + 10 + dx);
  G.spawnPlatform = (kind, side = P.side, dx = 0) => addPlatform(side, W + 10 + dx, kind);
  G.PLATS = PLATS;
  G.spawnLights = side => addLights(side, W + 10, 5);

  // ---------------- Loop ----------------
  let last = performance.now();
  function loop(now) {
    INPUT.poll();
    const dt = Math.min(0.05, (now - last) / 1000) * G.debug.slow; last = now;
    G.fps = G.fps ? G.fps * 0.95 + (1 / Math.max(0.001, (now - (G._lt || now - 16)) / 1000)) * 0.05 : 60; G._lt = now;
    if (G.mode !== "pause") update(dt);
    render();
    requestAnimationFrame(loop);
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) G.pause(); });
  SPR.ready = SPR.loadOverrides();
  requestAnimationFrame(loop);
  window.GAME = G;
  G._P = P; G._TYPES = TYPES; G._hurt = hurt; G._meleeHits = meleeHits;
})();
