// THE UPSIDE DOWN: endless runner on a floor you can flip through.
// Top half = the normal town. Bottom half = the Upside Down.
(function () {
  const W = 400, H = 225;
  const FT = 105;          // y of the top surface (normal world floor)
  const FB = 121;          // y of the bottom surface (Upside Down "floor")
  const SCALE = 3;         // canvas = 3 device pixels per game pixel (crisp art)
  const PX = 64;           // player's fixed screen x
  // Run speed: starts gentle and builds up slowly (game px per second)
  const SPEED_START = 95, SPEED_GAIN = 1.8, SPEED_MAX = 360;
  const GRAV = 980, FLIP_T = 0.26, STAND_H = 15, ROLL_H = 9;
  const CLUB_X = 10;       // Hellfire Club building: left edge at run start

  const cv = document.getElementById("game");
  cv.width = W * SCALE; cv.height = H * SCALE;
  const ctx = cv.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const { S, BG, draw } = window.SPR;

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // ---------------- Obstacle catalogue ----------------
  // h0..h1 = vertical extent measured AWAY from the floor surface.
  const TYPES = {
    // normal world
    cone:      { side: 0, w: 9,  h0: 0,  h1: 11 },
    trash:     { side: 0, w: 11, h0: 0,  h1: 16 },
    fence:     { side: 0, w: 18, h0: 0,  h1: 19, after: 400 },
    billboard: { side: 0, w: 22, h0: 12, h1: 108, after: 500 },
    crow:      { side: 0, w: 12, h0: 15, h1: 22, enemy: true, vx: -45, after: 250 },
    // upside down
    stump:     { side: 1, w: 12, h0: 0,  h1: 12 },
    tendril:   { side: 1, w: 14, h0: 12, h1: 107, after: 500 },
    crawler:   { side: 1, w: 16, h0: 0,  h1: 10, enemy: true, vx: -60, after: 250 },
    wisp:      { side: 1, w: 10, h0: 14, h1: 21, enemy: true, vx: -25, bob: true, after: 700 },
    pod:       { side: 1, w: 12, h0: 0,  h1: 12, enemy: true, shooter: true, after: 600 },
    rift:      { side: 1, w: 14, h0: 0,  h1: 107, wall: true },
    // light crates: smash with a hit to spill Christmas lights
    crate:      { side: 0, w: 14, h0: 0, h1: 14, crate: true },
    crate_dark: { side: 1, w: 14, h0: 0, h1: 14, crate: true },
  };
  // Christmas-light colours (the run currency). Gold is rare and worth 5.
  const BULBS = [["red", "#ff3d57"], ["green", "#5fd068"], ["blue", "#4da3ff"], ["yellow", "#ffd866"], ["orange", "#ff9a3d"], ["pink", "#ff6bd0"]];
  const POOL = [
    ["trash", "fence", "billboard", "crow"],
    ["stump", "tendril", "crawler", "wisp", "pod"],
  ];

  // d20 fate roll at the start of every run
  const FATE = [
    { min: 20, label: "NAT 20! +1 HEART", col: "#5fd0c8", hearts: 1, score: 1, dread: 1 },
    { min: 15, label: "BLESSED +20% SCORE", col: "#ffd866", hearts: 0, score: 1.2, dread: 1 },
    { min: 6,  label: "FATE IS QUIET", col: "#f3e9dc", hearts: 0, score: 1, dread: 1 },
    { min: 2,  label: "UNEASY: DREAD +15%", col: "#ff9fb4", hearts: 0, score: 1, dread: 1.15 },
    { min: 1,  label: "CRIT FAIL: DREAD +30%", col: "#ff3d57", hearts: 0, score: 1, dread: 1.3 },
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
  const ACT = { jump: "bufJump", flip: "bufFlip", roll: "bufRoll", attack: "bufAtk", block: "bufBlk" };
  G.press = function (a) {
    SFX.unlock();
    if (G.mode !== "play" || P.dead) return;
    if (ACT[a]) P[ACT[a]] = a === "flip" ? 0.3 : 0.15;
  };
  // Arrows + Space (WASD as alternates)
  const KEYS = {
    ArrowUp: "jump", KeyW: "jump",
    ArrowDown: "roll", KeyS: "roll",
    ArrowRight: "attack", KeyD: "attack",
    ArrowLeft: "block", KeyA: "block",
    Space: "flip",
  };
  window.addEventListener("keydown", e => {
    if (e.target && e.target.tagName === "INPUT") return;
    if ((e.code === "KeyP" || e.code === "Escape") && (G.mode === "play" || G.mode === "pause")) {
      G.mode === "play" ? G.pause() : G.resume(); e.preventDefault(); return;
    }
    const a = KEYS[e.code];
    if (a && G.mode === "play") { e.preventDefault(); if (!e.repeat) G.press(flipVertical(a)); }
  });
  // Upside down, "away from the floor" is down on screen: swap up/down so the
  // arrow you press matches the direction you move.
  function flipVertical(a) {
    if (P.side !== 1) return a;
    return a === "jump" ? "roll" : a === "roll" ? "jump" : a;
  }
  // swipes on the canvas: up=jump, down=roll, left=block, right=attack, tap=flip
  let sw = null;
  cv.addEventListener("pointerdown", e => { sw = { x: e.clientX, y: e.clientY }; });
  cv.addEventListener("pointerup", e => {
    if (!sw || G.mode !== "play") return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
    if (Math.hypot(dx, dy) < 24) return G.press("flip");
    if (Math.abs(dy) > Math.abs(dx)) G.press(flipVertical(dy < 0 ? "jump" : "roll"));
    else G.press(dx < 0 ? "block" : "attack");
  });

  // ---------------- Spawning ----------------
  function addOb(type, x) {
    const T = TYPES[type];
    G.obs.push(Object.assign({ type, x, t: Math.random() * 6, cd: 0.4, dead: false }, T));
  }
  let groupId = 0;
  function bulb(side, x, h, group, idx) {
    const gold = Math.random() < 0.04;
    const [name, col] = gold ? ["gold", "#fff3b0"] : BULBS[Math.floor(Math.random() * BULBS.length)];
    return { side, x, h, kind: "bulb", name, col, gold, group, idx, taken: false, fly: false, vx: 0, vh: 0, ph: Math.random() * 6 };
  }
  // a short string of lights hanging in a gentle curve
  function addLights(side, x, n) {
    const g = ++groupId;
    for (let i = 0; i < n; i++) {
      const k = n > 1 ? i / (n - 1) : 0.5;
      G.picks.push(bulb(side, x + i * 12, 10 + Math.sin(k * Math.PI) * 14 + (i % 2) * 2, g, i));
    }
  }
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
    if (G.dist > 900 && r < 0.12 + d * 0.12) {   // wall: flip to get past
      const s = 1; // walls only appear in the Upside Down
      addOb("rift", X + 90);
      if (Math.random() < 0.5) addLights(1 - s, X + 60, 5);
      return gap + 140;
    }
    if (r < 0.5) {
      const s = Math.random() < 0.5 ? 0 : 1;
      addOb(typeFor(s, d), X);
      if (Math.random() < 0.22) addLights(Math.random() < 0.5 ? s : 1 - s, X - 6, 3 + Math.floor(Math.random() * 3));
      return gap;
    }
    if (r < 0.78) {
      addOb(typeFor(0, d), X);
      addOb(typeFor(1, d), X + rand(60, 110));
      return gap + 60;
    }
    const s = Math.random() < 0.5 ? 0 : 1;
    if (Math.random() < 0.45) addOb(s ? "crate_dark" : "crate", X);      // crate full of lights
    else addLights(s, X, 4 + Math.floor(Math.random() * 3));
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
      dist: Math.floor(G.dist / 10), newBest, fate: G.fate ? G.fate.roll : 0 };
  }

  function hurt() {
    if (G.debug.god) { G.flash = 0.1; G.flashCol = "#5fd0c8"; return; }
    if (P.inv > 0 || P.flip > 0 || P.dead) return;
    G.hearts -= 1; G.shake = 7; G.flash = 0.25; G.flashCol = "#ff3d57"; SFX.hurt();
    burst(PX + 6, sy(P.side, P.h + 8), "#ff3d57", 14);
    if (G.hearts <= 0) {
      if (G.reviveLeft) {
        G.reviveLeft = false; G.hearts = 1; P.inv = 2.2; SFX.revive(); G.flash = 0.5; G.flashCol = "#5fd0c8";
        G.obs = G.obs.filter(o => o.x > PX + 140); G.shots = [];
        pop("SECOND WIND", "#5fd0c8");
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
    if (forced) { P.flipLock = 1.4; SFX.dread(); pop("THE DREAD!", "#ff3d57", PX + 6, FB + 30); }
  }
  function breakCrate(o, smashed) {
    o.dead = true; G.shake = smashed ? 3 : 1;
    burst(o.x + 7, sy(o.side, 7), "#a8743a", 14, 70);
    if (!smashed) { SFX.thud(); return; }
    SFX.crate(); G.crates = (G.crates || 0) + 1;
    const n = 6 + Math.floor(Math.random() * 4), g = ++groupId;
    for (let i = 0; i < n; i++) {
      const b = bulb(o.side, o.x + 7, 8, null, i);
      b.fly = true; b.vx = rand(50, 150); b.vh = rand(120, 200);
      G.picks.push(b);
    }
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
    P.runT += dt * Math.max(G.speed, 0) / 150;

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
      if (ranged()) { // Ranger: fire a marble across the screen
        P.atk = 0.22; P.atkCd = 0.42; SFX.sling();
        G.pshots.push({ side: P.side, x: PX + 16, h: P.h + 11, dead: false });
      } else { P.atk = 0.2; P.atkCd = 0.32; SFX.swing(); }
    }
    if (P.bufBlk > 0 && P.blkCd <= 0 && P.atk <= 0) { P.blk = st.block; P.blkAge = 0; P.blkCd = st.block + 0.25; P.roll = 0; P.bufBlk = 0; SFX.lid(); }
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
      G.score += dx / 8 * (P.side === 1 ? G.stats.udMult : 1) * G.fate.f.score;
      if (G.dist >= G.nextAt) G.nextAt = G.dist + (G.debug.noSpawn ? 200 : spawnChunk());
    } else if (G.mode === "dying") G.dist += dx;

    const ph0 = P.h, ph1 = P.h + (P.roll > 0 ? ROLL_H : STAND_H), px0 = PX + 3, px1 = PX + 10;
    const st = G.stats || SAVE.runStats();
    for (const o of G.obs) {
      o.t += dt;
      o.x -= dx - (o.vx && !o.dead && playing ? o.vx * dt : 0);
      if (o.bob) { o.h0 = TYPES[o.type].h0 + Math.sin(o.t * 4) * 6; o.h1 = o.h0 + 7; }
      if (o.dead || !playing) continue;
      if (o.shooter) {
        o.cd -= dt;
        if (o.cd <= 0 && o.x < W - 10 && o.x > PX + 50) {
          o.cd = 1.7; o.t = 0;
          G.shots.push({ side: o.side, x: o.x - 3, h: 5, ref: false, dead: false });
          SFX.spit();
        }
      }
      if (o.side !== P.side || P.flip > 0) continue;
      if (o.crate) { // smash with a hit for lights; running into it just kicks it over
        if (P.atk > 0 && !ranged() && o.x < PX + 9 + st.reach && o.x + o.w > PX + 6 && P.h < 18) { breakCrate(o, true); continue; }
        if (o.x < px1 && o.x + o.w > px0 && o.h1 > ph0) breakCrate(o, false);
        else if (!G.crateHint && o.x < PX + 70) { G.crateHint = true; pop("HIT THE CRATE!", "#ffd866", PX + 70, sy(o.side, 30)); }
        continue;
      }
      // bat hit
      if (P.atk > 0 && !ranged() && o.enemy && o.x < PX + 9 + st.reach && o.x + o.w > PX + 6 && o.h0 < P.h + 24 && o.h1 > P.h - 2) {
        o.dead = true; G.kills++; G.score += 30 * (P.side ? st.udMult : 1) * G.fate.f.score; SFX.kill(); G.shake = 3;
        burst(o.x + o.w / 2, sy(o.side, (o.h0 + o.h1) / 2), o.side ? "#b0305a" : "#433a52", 18, 90);
        continue;
      }
      if (o.x < px1 && o.x + o.w > px0 && o.h0 < ph1 && o.h1 > ph0) {
        if (o.enemy && P.blk > 0) parry(o, false);
        else hurt();
      }
    }
    G.obs = G.obs.filter(o => o.x + o.w > -30 && !o.dead);

    // projectiles from pods
    for (const s of G.shots) {
      if (s.ref) {
        s.x += 260 * dt;
        for (const o of G.obs) if (o.enemy && !o.dead && o.side === s.side && s.x + 4 > o.x && s.x < o.x + o.w && 7 > o.h0 && 4 < o.h1) {
          o.dead = true; s.dead = true; G.kills++; SFX.kill(); G.score += 40 * G.fate.f.score;
          burst(o.x + o.w / 2, sy(o.side, 6), "#b0305a", 16, 80); pop("REFLECT +40", "#5fd0c8", o.x, sy(o.side, 26));
        }
      } else s.x -= dx + 120 * dt;
      if (!playing || s.ref || s.dead || s.side !== P.side || P.flip > 0) continue;
      if (s.x < px1 + 2 && s.x + 4 > px0 && s.h < ph1 && s.h + 4 > ph0) {
        if (P.blk > 0) { s.ref = true; G.parries++; SFX.block(); pop("REFLECT", "#5fd0c8"); }
        else { s.dead = true; hurt(); }
      }
    }
    G.shots = G.shots.filter(s => !s.dead && s.x > -10 && s.x < W + 20);

    // the Ranger's marbles: first enemy or crate on that side gets hit
    for (const m of G.pshots) {
      m.x += 330 * dt;
      for (const o of G.obs) {
        if (o.dead || o.side !== m.side || !(o.enemy || o.crate)) continue;
        if (m.x + 6 > o.x && m.x < o.x + o.w && o.h0 < m.h + 10 && o.h1 > m.h - 12) { // same lane as the runner
          m.dead = true;
          if (o.crate) breakCrate(o, true);
          else {
            o.dead = true; G.kills++; G.score += 30 * (o.side ? st.udMult : 1) * G.fate.f.score; SFX.kill(); G.shake = 2;
            burst(o.x + o.w / 2, sy(o.side, (o.h0 + o.h1) / 2), o.side ? "#b0305a" : "#433a52", 18, 90);
          }
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
        G.shards += val; G.score += 10 * val * G.fate.f.score;
        (k.gold ? SFX.gold : SFX.light)();
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
    G.boltT -= dt;
    if (G.boltT <= 0) { G.boltT = rand(2.5, 6); G.bolt = { x: rand(40, W - 40), life: 0.25, seed: Math.random() * 1000 }; }
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
      case "crow": draw(ctx, Math.floor(t * 8) % 2 ? "crow1" : "crow2", x, -o.h0); break;
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
      case "crawler": draw(ctx, Math.floor(t * 10) % 2 ? "crawl1" : "crawl2", x, -o.h0); break;
      case "wisp": draw(ctx, Math.floor(t * 8) % 2 ? "wisp1" : "wisp2", x, -o.h0); break;
      case "pod": draw(ctx, o.t < 0.25 ? "pod2" : "pod1", x, 0); break;
      case "crate": case "crate_dark": {
        const dk = o.type === "crate_dark";
        R("#1a1124", x - 1, -15, 16, 15); R(dk ? "#4a2a3a" : "#a8743a", x, -14, 14, 14);
        R(dk ? "#2f1a26" : "#7a5228", x, -10, 14, 1); R(dk ? "#2f1a26" : "#7a5228", x, -5, 14, 1);
        R(dk ? "#2f1a26" : "#7a5228", x + 3, -14, 1, 14); R(dk ? "#2f1a26" : "#7a5228", x + 10, -14, 1, 14);
        const c = BULBS[Math.floor(t * 2) % BULBS.length][1];
        R(c, x + 5, -9, 2, 2); R(BULBS[(Math.floor(t * 2) + 3) % BULBS.length][1], x + 7, -4, 2, 2);
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

  // player art per class: "ranger_run1" etc., falling back to "run1"
  function pk(frame) {
    const sh = SAVE.state.sheet, k = sh && sh.cls + "_" + frame;
    if (k && SPR.ART[k]) return k;
    return SPR.ART["fighter_" + frame] ? "fighter_" + frame : frame; // class without art yet
  }
  function ranged() { const sh = SAVE.state.sheet; return !!sh && SAVE.CLASSES.some(c => c.id === sh.cls && c.ranged); }
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
      ctx.save(); ctx.translate(PX + 6, -h - 6); ctx.rotate(Math.floor(G.t * 16) * Math.PI / 2);
      const rk = pk("roll"), rs = SPR.ART[rk] && SPR.SIZE[rk];
      if (rs) { ctx.translate(0, -1); ctx.drawImage(SPR.ART[rk], -rs[0] / 2, -rs[1] / 2, rs[0], rs[1]); }
      else ctx.drawImage(S.roll, -6, -6, 12, 12);
      ctx.restore();
    } else if (P.blk > 0 && P.flip <= 0) {
      draw(ctx, pk("block"), PX, -h);
      if (!SPR.ART[pk("block")]) { // trash-can lid shield
        const fresh = P.blkAge < 0.12;
        R("#1a1124", PX + 11, -h - 15, 5, 13); R(fresh ? "#ffffff" : "#9a9caa", PX + 12, -h - 14, 3, 11);
        R("#7d7f8c", PX + 13, -h - 12, 1, 7); R("#1a1124", PX + 15, -h - 10, 1, 3);
      }
    } else {
      const fr = P.atk > 0 ? "attack" : idle ? (SPR.ART[pk("idle")] ? "idle" : "run2") : !P.grounded && P.flip <= 0 ? "jump" : Math.floor(P.runT * 10) % 2 ? "run1" : "run2";
      const key = pk(fr);
      draw(ctx, key, PX, -h - (idle && fr !== "idle" && Math.floor(G.t * 2) % 2 ? 1 : 0));
      if (P.atk > 0 && !ranged() && !SPR.ART[pk("attack")]) {
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
    text("D20 FATE", cx, y - 11, "#a998b8", "center");
    if (!rolling) text(f.f.label, cx, y + 27, f.f.col, "center");
    ctx.globalAlpha = 1;
  }

  function drawHud() {
    if (G.mode === "attract") return;
    const st = G.stats;
    for (let i = 0; i < st.hearts; i++) heart(6 + i * 11, 6, i < G.hearts);
    if (G.reviveLeft) { if (ART("hud_revive")) ctx.drawImage(ART("hud_revive"), 8 + st.hearts * 11, 6, 9, 9); else text("+1", 8 + st.hearts * 11, 7, "#5fd0c8"); }
    text(String(Math.floor(G.score)).padStart(6, "0"), W - 6, 6, "#ffd866", "right");
    text("HI " + String(Math.max(SAVE.state.best, Math.floor(G.score))).padStart(6, "0"), W - 64, 6, "#f3e9dc", "right");
    if (ART("hud_light")) ctx.drawImage(ART("hud_light"), W - 47, 16, 7, 10);
    else { R("#3b3446", W - 45, 16, 3, 2); R("#1a1124", W - 46, 18, 5, 7); R(BULBS[Math.floor(G.t * 2) % 6][1], W - 45, 18, 3, 6); }
    text(String(G.shards), W - 6, 18, "#f3e9dc", "right");
    const bw = 70, f = G.dread / st.battery, DX = Math.round(W / 2 - bw / 2) - 6; // centred, clear of phone buttons
    ctx.save(); ctx.translate(DX, 0);
    text(P.side ? "x" + (st.udMult * G.fate.f.score).toFixed(1) : "DREAD", 6, H - 22, P.side ? "#ff6b8f" : "#a998b8");
    const fr = ART("hud_dread_frame"), fl = ART("hud_dread_fill");
    if (fr) ctx.drawImage(fr, 3, H - 13, bw + 6, 10);
    else { R("#1a1124", 5, H - 11, bw + 2, 6); R("#3a2550", 6, H - 10, bw, 4); }
    if (fl && f > 0) ctx.drawImage(fl, 0, 0, Math.max(1, Math.round(fl.width * f)), fl.height, 6, H - 10, Math.round(bw * f), 4);
    else R(f > 0.7 ? (Math.floor(G.t * 8) % 2 ? "#ff3d57" : "#ffd0dc") : "#b0305a", 6, H - 10, Math.round(bw * f), 4);
    if (fl && f > 0.7 && Math.floor(G.t * 8) % 2) R("rgba(255,255,255,.35)", 6, H - 10, Math.round(bw * f), 4);
    if (P.flipLock > 0) text("LOCKED", 82, H - 12, "#ff3d57");
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
      for (const o of G.obs) if (o.side === side && !o.dead) drawOb(o);
      for (const s of G.shots) if (s.side === side) drawShot(s);
      for (const m of G.pshots) if (m.side === side) {
        const img = ART("ranger_shot"), y = -m.h - 3;
        if (img) ctx.drawImage(img, Math.round(m.x) - 6, y - 1, 12, 6);
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
