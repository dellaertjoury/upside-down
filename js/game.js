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
    killPts: { crow: 25, crawler: 40, wisp: 40, pod: 60, stalker: 120 },
    meleeBonus: 1.5,             // close-range kills are riskier: worth more
    comboWindow: 5,              // seconds to land the next kill and keep the combo
    comboStep: 0.5, comboMax: 3, // x1, x1.5, x2, x2.5, x3
    // lights economy
    crateEvery: [16, 24],        // seconds between crates
    crateTiers: [[3, 0.6, 0.3], [5, 0.3, 0.4], [10, 0.1, 0.3]], // [lights, chance at the start, chance from 2000 m]
    heartCrate: 0.25,            // share of crates holding a heart instead
    killDrop: 0.2,               // chance an enemy drops a light (the stalker always drops 3)
    milestoneEvery: 500, milestoneLights: 10, // every 500 m: +10 lights
    // ranged attacks
    arc: { vx: 200, perReach: 5, vh: 90, g: 380 }, // Ranger marble (reach upgrades add speed = range)
    bolt: { vx: 300 },                             // Wizard bolt
  };

  // Run speed: starts gentle and builds up slowly (game px per second)
  const SPEED_START = 70, SPEED_GAIN = 1.2, SPEED_MAX = 320;
  const GRAV = 980, FLIP_T = 0.26, STAND_H = 15, ROLL_H = 9;
  const CLUB_X = 10;       // Hellfire Club building: left edge at run start

  const cv = document.getElementById("game");
  cv.width = W * SCALE; cv.height = H * SCALE;
  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const { S, BG, draw } = window.SPR;

  const rand = (a, b) => a + Math.random() * (b - a);
  const T_ = (k, v) => I18N.t(k, v);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // ---------------- Obstacle catalogue ----------------
  // h0..h1 = vertical extent measured AWAY from the floor surface.
  const TYPES = {
    // normal world
    crow:      { side: 0, w: 12, h0: 9,  h1: 17, enemy: true, vx: -45, after: 250 }, // head height: roll under, jump over or hit
    // upside down
    stump:     { side: 1, w: 12, h0: 0,  h1: 12 },
    tendril:   { side: 1, w: 14, h0: 12, h1: 107, after: 500 },
    crawler:   { side: 1, w: 16, h0: 0,  h1: 10, enemy: true, vx: -60, after: 250 },
    wisp:      { side: 1, w: 10, h0: 14, h1: 21, enemy: true, vx: -25, bob: true, after: 700 },
    pod:       { side: 1, w: 12, h0: 0,  h1: 12, enemy: true, shooter: true, after: 600 },
    stalker:   { side: 1, w: 14, h0: 0,  h1: 24, enemy: true, hp: 2, vx: -25, after: 1500 }, // tall, takes 2 hits
    // light crates: smash with a hit to spill Christmas lights
    crate:      { side: 0, w: 14, h0: 0, h1: 14, crate: true },
    crate_dark: { side: 1, w: 14, h0: 0, h1: 14, crate: true },
  };
  // Christmas-light colours (the run currency). Gold is rare and worth 5.
  const BULBS = [["red", "#ff3d57"], ["green", "#5fd068"], ["blue", "#4da3ff"], ["yellow", "#ffd866"], ["orange", "#ff9a3d"], ["pink", "#ff6bd0"]];
  const POOL = [
    ["crow"],
    ["stump", "tendril", "crawler", "wisp", "pod", "stalker"],
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
      bufJump: 0, bufFlip: 0, bufRoll: 0, bufAtk: 0, bufBlk: 0, dead: false });
  }
  resetPlayer();

  const AMB = Array.from({ length: 46 }, () => ({ x: rand(0, W), y: rand(FB, H), v: rand(3, 10), s: Math.random() < 0.2 ? 2 : 1 }));
  const DUST = Array.from({ length: 14 }, () => ({ x: rand(0, W), y: rand(10, FT - 4), v: rand(2, 6) }));

  // ---------------- Input ----------------
  const ACT = { jump: "bufJump", flip: "bufFlip", roll: "bufRoll", attack: "bufAtk" };
  G.press = function (a) {
    SFX.unlock();
    if (G.mode !== "play" || P.dead) return;
    if (ACT[a]) P[ACT[a]] = a === "flip" ? 0.3 : 0.15;
  };
  // Keys and controller buttons are rebindable (Settings); see js/input.js.
  window.addEventListener("keydown", e => {
    if (e.target && e.target.tagName === "INPUT") return;
    if (INPUT.listening) return;                       // Settings is waiting for a key
    const a = INPUT.keyAction(e.code);
    if (a === "pause" && (G.mode === "play" || G.mode === "pause")) {
      G.mode === "play" ? G.pause() : G.resume(); e.preventDefault(); return;
    }
    if (a && G.mode === "play") { e.preventDefault(); if (!e.repeat) G.press(flipVertical(a)); }
  });
  INPUT.onAction = a => { // controller during a run
    if (a === "pause" && (G.mode === "play" || G.mode === "pause")) { G.mode === "play" ? G.pause() : G.resume(); return true; }
    if (G.mode === "play") { G.press(flipVertical(a)); return true; }
    return false;
  };
  // Upside down, "away from the floor" is down on screen: swap up/down so the
  // arrow you press matches the direction you move.
  function flipVertical(a) {
    if (P.side !== 1) return a;
    return a === "jump" ? "roll" : a === "roll" ? "jump" : a;
  }
  // swipes on the canvas: up=jump, down=roll, sideways=attack, tap=flip
  let sw = null;
  cv.addEventListener("pointerdown", e => { sw = { x: e.clientX, y: e.clientY }; });
  cv.addEventListener("pointerup", e => {
    if (!sw || G.mode !== "play") return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
    if (Math.hypot(dx, dy) < 24) return G.press("flip");
    if (Math.abs(dy) > Math.abs(dx)) G.press(flipVertical(dy < 0 ? "jump" : "roll"));
    else G.press("attack");
  });

  // ---------------- Spawning ----------------
  function addOb(type, x) {
    const T = TYPES[type];
    G.obs.push(Object.assign({ type, x, t: Math.random() * 6, cd: 1.0, dead: false }, T));
  }
  let groupId = 0;
  function bulb(side, x, h, group, idx) {
    const gold = Math.random() < 0.04;
    const [name, col] = gold ? ["gold", "#fff3b0"] : BULBS[Math.floor(Math.random() * BULBS.length)];
    return { side, x, h, kind: "bulb", name, col, gold, group, idx, taken: false, fly: false, vx: 0, vh: 0, ph: Math.random() * 6 };
  }
  // one Christmas light floating at a reachable height
  function addLight(side, x) { G.picks.push(bulb(side, x, rand(6, 24), null, 0)); }
  function typeFor(side, d) {
    const pool = POOL[side].filter(t => (TYPES[t].after || 0) <= G.dist);
    const enemies = pool.filter(t => TYPES[t].enemy), rest = pool.filter(t => !TYPES[t].enemy);
    if (enemies.length && Math.random() < 0.25 + d * 0.25) return pick(enemies);
    return pick(rest);
  }
  function spawnChunk() {
    const d = Math.min(1, G.dist / 9000);
    const X = W + 16, r = Math.random();
    const gap = G.speed * rand(0.95, 1.6) * (1 - d * 0.2) + 50;
    if (r < 0.5) {
      const s = Math.random() < 0.5 ? 0 : 1;
      addOb(typeFor(s, d), X);
      if (Math.random() < 0.35) addLight(Math.random() < 0.5 ? s : 1 - s, X + rand(-40, 40));
      return gap;
    }
    if (r < 0.78) {
      addOb(typeFor(0, d), X);
      addOb(typeFor(1, d), X + rand(60, 110));
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
      if (c.tier >= 5) { c.w = c.tier >= 10 ? 18 : 16; c.h1 = c.w; } // bigger crate, bigger haul
    } else addLight(s, X);
    if (G.dist > 400) addOb(typeFor(1 - s, d), X + 50);
    return gap;
  }

  // ---------------- Lifecycle ----------------
  G.start = function () {
    SFX.unlock();
    G.stats = SAVE.runStats();
    const roll = 1 + Math.floor(Math.random() * 20);
    const f = FATE.find(x => roll >= x.min);
    Object.assign(G, { mode: "play", t: 0, speed: SPEED_START, dist: 0, score: 0, shards: 0, kills: 0, parries: 0, nextAt: 420,
      sc: { dist: 0, combat: 0, lights: 0 }, combo: 0, comboT: 0, bestCombo: 0, crateT: rand(8, 12), nextMile: BAL.milestoneEvery,
      obs: [], picks: [], parts: [], shots: [], pshots: [], pops: [], shake: 0, flash: 0,
      hearts: G.stats.hearts + f.hearts, reviveLeft: G.stats.revive, dread: 0, overT: 0,
      fate: { roll, f, t: 0 } });
    G.stats.hearts += f.hearts;
    G.scroll0 = G.scroll; SCN.reset(); G.crateHint = false;
    SFX.music.setMode("play");
    resetPlayer();
    SFX.dice();
  };
  G.pause = () => { if (G.mode === "play") { G.mode = "pause"; SFX.music.setMode("pause"); G.onPause && G.onPause(); } };
  G.resume = () => { if (G.mode === "pause") { G.mode = "play"; SFX.music.setMode(P.side ? "down" : "play"); last = performance.now(); } };
  G.toHub = () => { if (SFX.music.mode !== "off") SFX.music.setMode("hub"); G.scroll0 = G.scroll; SCN.reset(); G.mode = "attract"; G.obs = []; G.picks = []; G.shots = []; G.pshots = []; G.pops = []; G.dist = 0; G.speed = 0; G.fate = null; resetPlayer(); };

  function gameOver() {
    P.dead = true; G.mode = "dying"; G.overT = 0.9; SFX.over(); SFX.music.setMode("over");
    const bonus = Math.floor(G.score / G.stats.bonusDiv);
    const earned = G.shards + bonus;
    const st = SAVE.state, score = Math.floor(G.score);
    const newBest = score > st.best;
    st.shards += earned; st.runs += 1; if (newBest) st.best = score; SAVE.save();
    G.result = { score, shards: G.shards, bonus, earned, kills: G.kills, parries: G.parries,
      pts: { dist: Math.floor(G.sc.dist), combat: Math.floor(G.sc.combat), lights: Math.floor(G.sc.lights) }, bestCombo: G.bestCombo,
      dist: Math.floor(G.dist / 10), newBest, fate: G.fate ? G.fate.roll : 0 };
  }

  function hurt() {
    if (G.debug.god) { G.flash = 0.1; G.flashCol = "#5fd0c8"; return; }
    if (P.inv > 0 || P.flip > 0 || P.dead) return;
    G.hearts -= 1; G.shake = 7; G.flash = 0.25; G.flashCol = "#ff3d57"; SFX.hurt();
    G.combo = 0; G.comboT = 0; // getting hit breaks the combo
    burst(PX + 6, sy(P.side, P.h + 8), "#ff3d57", 14);
    if (G.hearts <= 0) {
      if (G.reviveLeft) {
        G.reviveLeft = false; G.hearts = 1; P.inv = 2.2; SFX.revive(); G.flash = 0.5; G.flashCol = "#5fd0c8";
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
    P.flip = FLIP_T; P.switched = false; P.roll = 0; P.blk = 0; P.bufFlip = 0; P.h = 0; P.vh = 0;
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
    const n = (o.tier || 3) * (o.side ? 2 : 1);
    G.shards += n; addPts("lights", BAL.lightPts * n); SFX.gold();
    pop(T_("pop.lights", { n }), "#ffd866", o.x + 7, sy(o.side, 26));
    G.onLight && G.onLight("#ffd866");
  }
  // Hit an enemy. Most die at once; tough ones (hp > 1) flinch and get
  // knocked back first. Returns true when the hit landed.
  function addPts(kind, n) { const v = n * G.fate.f.score; G.sc[kind] += v; G.score += v; }
  // how: "melee" (bat), "ranged" (marble, bolt) or "reflect" (spore shot sent back)
  function damage(o, how, amount = 1) {
    if (o.hitCd > 0) return false;           // one swing = one hit
    const st = G.stats, at = [o.x + o.w / 2, sy(o.side, (o.h0 + o.h1) / 2)];
    const atk = attackCfg();
    if (how === "melee" && atk.crit && Math.random() < atk.crit) { amount *= 2; pop(T_("pop.crit"), "#ffd866", at[0], at[1] - 22); }
    o.hp = (o.hp || 1) - amount;
    if (o.hp > 0.001) {
      o.hitCd = 0.3; o.flash = 0.15; o.x += 14; SFX.thud(); G.shake = 2;
      burst(at[0], at[1], "#ffffff", 8, 60); pop(T_("pop.tough"), "#ff9fb4", at[0], at[1] - 14);
      return true;
    }
    o.dead = true; G.kills++;
    // combo: every kill within the window raises the multiplier
    G.combo = G.comboT > 0 ? G.combo + 1 : 1; G.comboT = BAL.comboWindow; G.bestCombo = Math.max(G.bestCombo, G.combo);
    const mult = Math.min(BAL.comboMax, 1 + (G.combo - 1) * BAL.comboStep);
    const pts = Math.round((BAL.killPts[o.type] || 30) * mult * (how === "melee" ? BAL.meleeBonus : 1) * (o.side ? st.udMult : 1));
    addPts("combat", pts);
    pop("+" + pts, "#ffd866", at[0], at[1] - 12);
    if (G.combo >= 2) pop(T_("pop.combo", { n: mult.toFixed(1) }), "#5fd0c8", at[0], at[1] - 24);
    SFX.kill(); G.shake = how === "melee" ? 3 : 2;
    burst(at[0], at[1], o.side ? "#b0305a" : "#433a52", 18, 90);
    // loot: sometimes a light, the stalker always leaves three
    const drops = o.type === "stalker" ? 3 : Math.random() < BAL.killDrop ? 1 : 0;
    for (let i = 0; i < drops; i++) addLight(o.side, Math.max(PX + 14, o.x + i * 9));
    return true;
  }
  function parry(o, viaShot) {
    o.dead = true; G.parries++;
    const perfect = !viaShot && P.blkAge < 0.12;
    const pts = (perfect ? 50 : 25) * (P.side ? G.stats.udMult : 1);
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
    if (P.bufAtk > 0 && P.atkCd <= 0) {
      P.blk = 0; P.bufAtk = 0;
      const atk = attackCfg();
      P.atkCd = atk.cd;
      if (atk.type === "arc") { // Ranger: a marble lobbed in an arc; reach upgrades throw it further
        P.atk = 0.22; SFX.sling();
        G.pshots.push({ kind: "arc", side: P.side, x: PX + 16, h: P.h + 11, vx: BAL.arc.vx + (st.reach - 16) * BAL.arc.perReach, vh: BAL.arc.vh, dmg: atk.dmg, dead: false });
      } else if (atk.type === "bolt") { // Wizard: straight bolt, half damage
        P.atk = 0.22; SFX.sling();
        G.pshots.push({ kind: "bolt", side: P.side, x: PX + 16, h: P.h + 11, vx: BAL.bolt.vx, vh: 0, dmg: atk.dmg, dead: false });
      } else { P.atk = 0.2; SFX.swing(); }
    }
    P.atk = Math.max(0, P.atk - dt);
    P.roll = Math.max(0, P.roll - dt);
    P.blk = Math.max(0, P.blk - dt); P.blkAge += dt;

    if (!P.grounded) {
      P.vh -= GRAV * dt; P.h += P.vh * dt;
      if (P.h <= 0) { P.h = 0; P.vh = 0; P.grounded = true; P.jumps = 0; }
    }

    if (G.mode === "play") {
      if (P.side === 1) {
        if (!G.debug.noDread) G.dread += dt * G.fate.f.dread;
        if (G.dread >= st.battery) { G.dread = st.battery; startFlip(true); }
      } else G.dread = Math.max(0, G.dread - dt * 1.6);
    }
  }

  function update(dt) {
    G.t += dt;
    const playing = G.mode === "play";
    if (G.mode === "dying") {
      G.speed = Math.max(0, G.speed - 400 * dt); G.overT -= dt;
      if (G.overT <= 0) { G.mode = "over"; G.onOver && G.onOver(G.result); }
    } else if (playing) {
      G.speed = Math.min(SPEED_MAX, SPEED_START + G.t * SPEED_GAIN);
      if (G.fate) G.fate.t += dt;
    } else if (G.mode === "attract") G.speed = 0;
    if (G.mode === "over") G.speed = 0;

    const dx = G.speed * dt;
    G.scroll += dx;
    SCN.update((G.scroll - G.scroll0) * SCN.PARALLAX);
    if (G.mode !== "over") updatePlayer(dt);

    if (playing) {
      G.dist += dx;
      addPts("dist", dx / 10 * BAL.metrePts * (P.side === 1 ? G.stats.udMult : 1));
      G.crateT -= dt;
      if (G.comboT > 0) { G.comboT -= dt; if (G.comboT <= 0) G.combo = 0; }
      if (G.dist / 10 >= G.nextMile) { // distance milestone: a handful of lights
        G.shards += BAL.milestoneLights; addPts("lights", BAL.lightPts * BAL.milestoneLights);
        pop(T_("pop.mile", { m: G.nextMile, n: BAL.milestoneLights }), "#ffd866", W / 2, FT - 40);
        SFX.gold(); G.onLight && G.onLight("#ffd866");
        G.nextMile += BAL.milestoneEvery;
      }
      if (G.dist >= G.nextAt) G.nextAt = G.dist + (G.debug.noSpawn ? 200 : spawnChunk());
    } else if (G.mode === "dying") G.dist += dx;

    const ph0 = P.h, ph1 = P.h + (P.roll > 0 ? ROLL_H : STAND_H), px0 = PX + 3, px1 = PX + 10;
    const st = G.stats || SAVE.runStats();
    for (const o of G.obs) {
      o.t += dt; if (o.hitCd > 0) o.hitCd -= dt; if (o.flash > 0) o.flash -= dt;
      o.x -= dx - (o.vx && !o.dead && playing ? o.vx * dt : 0);
      if (o.bob) { o.h0 = TYPES[o.type].h0 + Math.sin(o.t * 4) * 6; o.h1 = o.h0 + 7; }
      if (o.type === "crawler" && playing && !o.dead) { // hounds sometimes pounce: roll under or hit them
        if (!o.leapt && o.x - PX < 78 && o.x > PX + 24) { o.leapt = true; if (Math.random() < 0.5) { o.vh = 175; SFX.spit(); } }
        if (o.vh || o.h0 > 0) {
          o.h0 = Math.max(0, o.h0 + o.vh * dt); o.vh -= 720 * dt;
          if (o.h0 === 0 && o.vh < 0) o.vh = 0;
          o.h1 = o.h0 + 10;
        }
      }
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
      if (o.crate) { // smash with a hit for lights; running into it just kicks it over
        if (P.atk > 0 && !ranged() && o.x < PX + 9 + st.reach && o.x + o.w > PX + 6 && P.h < 18) { breakCrate(o, true); continue; }
        if (o.x < px1 && o.x + o.w > px0 && o.h1 > ph0) breakCrate(o, false);
        else if (!G.crateHint && o.x < PX + 70) { G.crateHint = true; pop(T_("pop.crate"), "#ffd866", PX + 70, sy(o.side, 30)); }
        continue;
      }
      // bat hit
      if (P.atk > 0 && !ranged() && o.enemy && o.x < PX + 9 + st.reach && o.x + o.w > PX + 6 && o.h0 < P.h + 24 && o.h1 > P.h - 2) {
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
      // a bat swing knocks spore shots back
      if (P.atk > 0 && !ranged() && s.x < PX + 9 + st.reach && s.x + 4 > PX + 6 && s.h < P.h + 24) {
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
      for (const s2 of G.shots) if (!s2.ref && !s2.dead && s2.side === m.side && Math.abs(s2.x - m.x) < 6) { s2.dead = true; m.dead = true; burst(m.x, sy(m.side, s2.h + 2), "#ff6bd0", 8, 50); }
      if (m.dead) continue;
      for (const o of G.obs) {
        if (o.dead || o.side !== m.side || !(o.enemy || o.crate)) continue;
        // the arcing marble hits what it actually touches; the straight bolt covers the runner's lane
        const hitV = m.kind === "arc" ? (o.h0 < m.h + 4 && o.h1 > m.h - 3) : (o.h0 < m.h + 10 && o.h1 > m.h - 12);
        if (m.x + 6 > o.x && m.x < o.x + o.w && hitV) {
          m.dead = true;
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
      if (k.taken || !playing) continue;
      const cx = PX + 6, ch = P.h + 8;
      const ddx = k.x - cx, ddh = k.h - ch, dist = Math.hypot(ddx, ddh);
      if (k.side === P.side && P.flip <= 0 && dist < st.magnet + 12) {
        k.x -= ddx * Math.min(1, dt * 10); k.h -= ddh * Math.min(1, dt * 10);
      }
      if (k.side === P.side && P.flip <= 0 && Math.abs(k.x - cx) < 9 && Math.abs(k.h - ch) < 12) {
        k.taken = true;
        const val = (k.gold ? 5 : 1) * (k.side ? 2 : 1) + (k.side ? st.sporeBonus : 0);
        G.shards += val; addPts("lights", BAL.lightPts * val);
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
      const sz = SPR.SIZE[o.type] || [16, 16, -1, 0], k = o.w / 14;
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
        for (let i = 0; i < 4; i++) {
          const bx = x + i * 4;
          for (let y = -107; y < -12; y += 2) R(i % 2 ? "#5b1b3a" : "#3a1430", bx + Math.round(Math.sin(t * 2 + y * 0.12 + i) * (1 + (y + 107) / 40)), y, 3, 2);
          R("#b0305a", bx + Math.round(Math.sin(t * 2 - 1.4 + i) * 3), -14, 2, 2);
        }
        break;
      case "crawler": draw(ctx, enemyKey(o, "hound", o.h0 > 1 ? "jump" : "run", ["crawl1", "crawl2"]), x, -o.h0); break;
      case "stalker": {
        const f = Math.floor(t * 4) % 2;
        const sk = enemyKey(o, "stalker", "walk", SPR.ART.stalker1 ? ["stalker1", "stalker2"] : null);
        if (sk) { draw(ctx, sk, x, 0); break; }
        // placeholder: a tall hunched shape with long arms and red eyes
        R("#0b0610", x + 2, -25, 11, 19); R("#4a3a52", x + 3, -24, 9, 17);          // body
        R("#0b0610", x, -28, 8, 6); R("#5b4a62", x + 1, -27, 6, 4); R("#ff3b3b", x + 1, -26, 1, 1); R("#ff3b3b", x + 4, -26, 1, 1);
        R("#4a3a52", x - 2, -20 + f, 2, 12); R("#4a3a52", x + 12, -20 - f, 2, 12);  // arms
        R("#2f2236", x + 3, -7, 3, 7 - f); R("#2f2236", x + 9, -7, 3, 7 + f - 1);   // legs
        break; }
      case "wisp": draw(ctx, enemyKey(o, "flyer", "fly", ["wisp1", "wisp2"]), x, -o.h0); break;
      case "pod": draw(ctx, enemyKey(o, "pod", "idle", o.t < 0.3 ? ["pod2"] : ["pod1"]), x, 0); break;
      case "crate": case "crate_dark": { // 14 px = 3 lights, 16 px = 5, 18 px (gold glow) = 10
        const dk = o.type === "crate_dark", s = o.w, sl = dk ? "#2f1a26" : "#7a5228";
        if (o.tier >= 10) { ctx.globalAlpha = 0.35 + Math.sin(t * 6) * 0.15; R("#ffd866", x - 3, -s - 3, s + 6, s + 3); ctx.globalAlpha = 1; }
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
    if (f.length) return cyc(f, o.t, f.length > 2 ? 10 : 8);
    if (!fallback) return null;
    return cyc(fallback, o.t, 8);
  }
  function drawPick(k) {
    const x = Math.round(k.x), y = -Math.round(k.h) - 4;
    const tw = 0.75 + Math.sin(G.t * 5 + k.ph) * 0.25;
    const img = ART("bulb_" + k.name);
    // glow
    ctx.globalAlpha = 0.28 * tw; R(k.col, x - 2, y - 2, 9, 11); ctx.globalAlpha = 1;
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
  const PLAYER_FALLBACK = { idle: ["run2"], run: ["run1", "run2"], jump: ["jump"], attack: ["attack"], roll: ["roll"] };
  // the player's frames for a state: own class art, else the Fighter's, else placeholder
  function pframes(state) {
    const sh = SAVE.state.sheet;
    let f = sh ? frames(sh.cls, state) : [];
    if (!f.length) f = frames("fighter", state);
    if (!f.length && state === "idle") f = pframes("run").slice(-1);
    return f.length ? f : PLAYER_FALLBACK[state];
  }
  const cyc = (list, time, fps) => list[Math.floor(time * fps) % list.length];

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
  G.attackCfg = attackCfg; G.BAL = BAL;
  G.pk = pk;
  function drawPlayer() {
    if (P.dead && Math.floor(G.t * 16) % 2) return;
    if (P.inv > 0 && Math.floor(G.t * 20) % 2) return;
    let h = P.h;
    if (P.flip > 0) { const pr = 1 - P.flip / FLIP_T; h = pr < 0.5 ? -18 * pr * 2 : -18 * (1 - (pr - 0.5) * 2); }
    local(P.side);
    if (P.side === 1) { // flashlight cone in the dark
      const g = ctx.createRadialGradient(PX + 12, -h - 9, 2, PX + 40, -h - 9, 50);
      g.addColorStop(0, "rgba(255,243,176,.35)"); g.addColorStop(1, "rgba(255,243,176,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(PX + 11, -h - 10); ctx.lineTo(PX + 90, -h - 34); ctx.lineTo(PX + 90, -h + 12); ctx.closePath(); ctx.fill();
    }
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
      } else if (idle) { state = "idle"; key = cyc(pframes("idle"), G.t, 3); }
      else if (!P.grounded && P.flip <= 0) { // jump: first frame rising, last frame falling
        state = "jump"; const jf = pframes("jump"); key = P.vh > 0 ? jf[0] : jf[jf.length - 1];
      } else { state = "run"; key = cyc(pframes("run"), P.runT, pframes("run").length > 2 ? 12 : 8); }
      draw(ctx, key, PX, -h);
      if (P.atk > 0 && !ranged() && !SPR.ART[key]) {
        const reach = (G.stats || SAVE.runStats()).reach, pr = 1 - P.atk / 0.2, ang = -1.3 + pr * 2.2;
        for (let i = 0; i < reach; i++) R(i < 5 ? "#5a3220" : "#a8743a", PX + 9 + Math.cos(ang) * i, -h - 9 + Math.sin(ang) * i, 2, 2);
        ctx.fillStyle = "rgba(255,255,255,.5)";
        for (let a = -1.3; a < ang; a += 0.12) ctx.fillRect(Math.round(PX + 9 + Math.cos(a) * reach), Math.round(-h - 9 + Math.sin(a) * reach), 2, 2);
      }
    }
    ctx.restore();
  }

  function drawFloor() {
    const F = SPR.ART.floor;
    const fh = FB - FT;
    tile(F || BG.floor, G.scroll, FT, (F || BG.floor).width * fh / (F || BG.floor).height, fh);
    const p = 0.35 + Math.sin(G.t * 3) * 0.15;
    ctx.fillStyle = `rgba(255,61,87,${p})`; ctx.fillRect(0, FB - 1, W, 1);
  }

  function heart(x, y, full) {
    const img = ART(full ? "hud_heart_full" : "hud_heart_empty");
    if (img) { ctx.drawImage(img, x, y, 9, 8); return; }
    const c = full ? "#ff3d57" : "#3a2550";
    R("#1a1124", x, y + 1, 9, 5); R("#1a1124", x + 1, y, 3, 8); R("#1a1124", x + 5, y, 3, 8); R("#1a1124", x + 3, y + 6, 3, 2);
    R(c, x + 1, y + 1, 3, 4); R(c, x + 5, y + 1, 3, 4); R(c, x + 2, y + 4, 5, 2); R(c, x + 3, y + 6, 3, 1);
    if (full) R("#ffb0bc", x + 2, y + 2, 1, 1);
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
    if (G.reviveLeft) { if (ART("hud_revive")) ctx.drawImage(ART("hud_revive"), 8 + st.hearts * 11, 6, 9, 9); else text("+1", 8 + st.hearts * 11, 7, "#5fd0c8"); }
    text(String(Math.floor(G.score)).padStart(6, "0"), W - 6, 6, "#ffd866", "right");
    text(T_("hud.hi") + " " + String(Math.max(SAVE.state.best, Math.floor(G.score))).padStart(6, "0"), W - 64, 6, "#f3e9dc", "right");
    if (ART("hud_light")) ctx.drawImage(ART("hud_light"), W - 47, 16, 7, 10);
    else { R("#3b3446", W - 45, 16, 3, 2); R("#1a1124", W - 46, 18, 5, 7); R(BULBS[Math.floor(G.t * 2) % 6][1], W - 45, 18, 3, 6); }
    text(String(G.shards), W - 6, 18, "#f3e9dc", "right");
    if (G.combo >= 2 && G.comboT > 0) { // combo meter under the light count
      const m = Math.min(BAL.comboMax, 1 + (G.combo - 1) * BAL.comboStep);
      text(T_("hud.combo") + " x" + m.toFixed(1), W - 6, 30, "#5fd0c8", "right");
      R("#1a1124", W - 61, 40, 56, 3); R("#5fd0c8", W - 60, 41, Math.round(54 * G.comboT / BAL.comboWindow), 1);
    }
    const bw = 70, f = G.dread / st.battery, DX = Math.round(W / 2 - bw / 2) - 6; // centred, clear of phone buttons
    ctx.save(); ctx.translate(DX, 0);
    text(P.side ? "x" + (st.udMult * G.fate.f.score).toFixed(1) : T_("hud.dread"), 6, H - 22, P.side ? "#ff6b8f" : "#a998b8");
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
      drawWires(side);
      for (const k of G.picks) if (k.side === side) drawPick(k);
      for (const o of G.obs) if (o.side === side && !o.dead) {
        if (o.flash > 0) ctx.filter = "brightness(3)";
        drawOb(o); ctx.filter = "none";
        if (o.heart) { // heart crate: a beating heart on the front, always upright
          ctx.save(); ctx.translate(o.x + o.w / 2, -o.w / 2); if (side) ctx.scale(1, -1);
          ctx.globalAlpha = 0.3 + Math.sin(G.t * 6) * 0.15; R("#ff3d57", -6, -6, 12, 11); ctx.globalAlpha = 1;
          heart(-4.5, -4, true); ctx.restore();
        }
      }
      for (const s of G.shots) if (s.side === side) drawShot(s);
      for (const m of G.pshots) if (m.side === side) {
        const bolt = m.kind === "bolt", img = ART(bolt ? "wizard_d20" : "ranger_shot"), y = Math.round(-m.h - 3);
        if (img) ctx.drawImage(img, Math.round(m.x) - (bolt ? 8 : 6), y - 1, bolt ? 10 : 12, bolt ? 8 : 6);
        else if (bolt) { R("#1a1124", m.x - 1, y - 2, 6, 6); R("#a46bff", m.x, y - 1, 4, 4); R("#ffffff", m.x + 1, y, 1, 1); }
        else { R("#1a1124", m.x - 1, y - 1, 5, 5); R("#4da3ff", m.x, y, 3, 3); R("#ffffff", m.x, y, 1, 1); }
      }
      ctx.restore();
    }
    drawPlayer();
    drawFloor();
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
    const B = SPR.ART.watcher_body, Hd = SPR.ART.watcher_head;
    if (B && Hd) {
      const bs = SPR.SIZE.watcher_body || [80, 70], hs = SPR.SIZE.watcher_head || [40, 34];
      if (lit) ctx.filter = `brightness(${1 + flash * 1.5}) drop-shadow(0 0 2px #ff3d57)`;
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
  G.spawn = (type, dx = 0) => addOb(type, W + 10 + dx);
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
  G._P = P; G._TYPES = TYPES;
})();
