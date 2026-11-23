// Persistent progress (this browser): character sheet, upgrades, shards.
(function () {
  const KEY = "upsidedown.save.v1";
  const ABIL = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
  const ABIL_INFO = {
    STR: "Bat reach",
    DEX: "Jump height",
    CON: "Extra hearts",
    INT: "Bigger light bonus after a run",
    WIS: "Longer in the Upside Down",
    CHA: "Light magnet range",
  };

  const CLASSES = [
    // attack: melee = bat range, 1 hit kills, +50% kill points (risky);
    //         arc   = slingshot marble with gravity, reaches about half the screen;
    //         bolt  = straight across the screen, but half damage (2 hits per enemy)
    { id: "fighter", name: "Fighter", desc: "Swings a dented bat.", bonus: { STR: 2, CON: 1 }, locked: false,
      attack: { type: "melee", dmg: 1, cd: 0.32 }, perk: { shield: 18 } },   // trash-can lid absorbs a hit, recharges in 18 s
    { id: "ranger",  name: "Ranger",  desc: "Shoots slingshot marbles straight ahead.", bonus: { DEX: 2, WIS: 1 }, locked: false, ranged: true,
      attack: { type: "arc", dmg: 1, cd: 0.45 }, perk: { skipShot: true, magnet: 1.5 } }, // roll + attack = low skipping shot
    { id: "rogue",   name: "Rogue",   desc: "Fast jabs, sneaky crits.", bonus: { DEX: 2, CHA: 1 }, locked: true,
      attack: { type: "melee", dmg: 1, cd: 0.24, crit: 0.25 }, perk: { heatGrowth: 1.5 } },
    { id: "wizard",  name: "Wizard",  desc: "Straight fireworks, half damage.", bonus: { INT: 2, WIS: 1 }, locked: true, ranged: true,
      attack: { type: "bolt", dmg: 0.5, cd: 0.55 }, perk: { pierce: 1, dread: 0.75 } },
  ];

  const LOOKS = {
    hair: [
      { id: "brown", c: ["#5a3220", "#3b2016"] }, { id: "black", c: ["#2a2230", "#16111c"] },
      { id: "blond", c: ["#d9b04c", "#a87f2a"] }, { id: "ginger", c: ["#c0532c", "#7d2a18"] },
      { id: "blue", c: ["#4d6fc0", "#2f4583"] },
    ],
    jacket: [
      { id: "red", c: ["#c8413b", "#8e2a2d"] }, { id: "green", c: ["#4f8a4a", "#356030"] },
      { id: "yellow", c: ["#d9a83a", "#a07524"] }, { id: "purple", c: ["#7a4c9a", "#55336e"] },
      { id: "black", c: ["#4a4250", "#2a2430"] },
    ],
  };

  const UPGRADES = [
    { id: "heart",   name: "Extra heart",        desc: "Take one more hit per run.",                         costs: [40, 120, 300] },
    { id: "reach",   name: "Longer bat",         desc: "Your melee hit reaches further.",                    costs: [30, 80, 180] },
    { id: "battery", name: "Flashlight battery", desc: "Stay in the Upside Down 2s longer.",                 costs: [25, 60, 140, 300] },
    { id: "magnet",  name: "Light magnet",       desc: "Pull Christmas lights in from further away.",                  costs: [35, 90, 200] },
    { id: "greed",   name: "Dark greed",         desc: "+0.5x score while upside down, +1 per Upside Down light.", costs: [60, 150, 350] },
    { id: "skate",   name: "Better board",       desc: "Skateboard rides last longer: 6 / 8 / 10 s.", costs: [80, 180, 350] },
    { id: "djump",   name: "Double jump",        desc: "Jump again in mid-air.",                             costs: [150] },
  ];

  // Abilities are no longer rolled: everyone starts at 10 (+ class bonus) and
  // each upgrade level raises its ability by 2, like levelling up in D&D.
  const ABIL_UP = { STR: ["reach"], DEX: ["djump", "skate"], CON: ["heart"], INT: ["greed"], WIS: ["battery"], CHA: ["magnet"] };

  // ---- Dice Crates: found in runs, opened after. The d20 sets the odds of something rare. ----
  const LOOT = [ // tier, colour, lights range
    { id: "common",    col: "#c9d1dc", lights: [5, 10] },
    { id: "uncommon",  col: "#5fd0c8", lights: [15, 25] },
    { id: "rare",      col: "#ffd866", lights: [40, 60] },
    { id: "legendary", col: "#ff6b8f", lights: [0, 0] },   // a free upgrade level (or 150 lights when all are maxed)
  ];
  // chances (0..1) for a given d20 roll
  function diceOdds(roll) {
    const leg = roll === 20 ? 1 : Math.max(0, roll - 15) * 0.03;     // 16: 3% … 19: 12%, natural 20: guaranteed
    const rare = roll === 20 ? 0 : Math.min(1 - leg, roll * 0.025);  // 1: 2.5% … 19: 47.5%
    const unc = roll === 20 ? 0 : Math.min(1 - leg - rare, 0.4);
    return { legendary: leg, rare, uncommon: unc, common: Math.max(0, 1 - leg - rare - unc) };
  }
  // open one crate: roll, pick the tier, pay out into the save
  function openDice() {
    if (!(state.dice > 0)) return null;
    state.dice -= 1;
    const roll = 1 + Math.floor(Math.random() * 20), odds = diceOdds(roll);
    let u = Math.random(), tier = "common";
    for (const k of ["legendary", "rare", "uncommon", "common"]) { if (u < odds[k]) { tier = k; break; } u -= odds[k]; }
    const T = LOOT.find(l => l.id === tier), out = { roll, odds, tier, col: T.col, lights: 0, upgrade: null };
    if (tier === "legendary") {
      const open = UPGRADES.filter(x => lvl(x.id) < x.costs.length);
      if (open.length) { const u2 = open[Math.floor(Math.random() * open.length)]; state.up[u2.id] = lvl(u2.id) + 1; out.upgrade = u2.id; }
      else out.lights = 150;
    } else out.lights = T.lights[0] + Math.floor(Math.random() * (T.lights[1] - T.lights[0] + 1));
    state.shards += out.lights;
    save();
    return out;
  }

  // Items: bought in the shop for the next run, one of each at a time, used up when used
  const ITEMS = [
    { id: "revive", cost: 60 },   // Second wind: survive one fatal hit
    { id: "board",  cost: 30 },   // Skateboard: ride on a key press, breaks afterwards
  ];
  const fresh = () => ({ shards: 0, best: 0, runs: 0, dice: 0, muted: false, music: true, up: {}, items: {}, sheet: null });
  function load() {
    try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return fresh(); }
  }
  const state = load();
  // block was removed: refund the old "Sturdier lid" upgrade
  if (state.up.lid) { state.shards += [40, 110].slice(0, state.up.lid).reduce((a, b) => a + b, 0); delete state.up.lid; }
  if (!state.items) state.items = {};
  // Second wind used to be an upgrade: refund it and hand out one free Second wind item
  if (state.up.revive) { state.shards += 400; delete state.up.revive; state.items.revive = 1; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  const lvl = id => state.up[id] || 0;
  const mod = score => Math.floor((score - 10) / 2);

  function newSheet() { return { name: "", cls: "fighter", hair: "brown", jacket: "red" }; }
  // old saves: forget the rolled scores
  if (state.sheet) { delete state.sheet.scores; delete state.sheet.dice; delete state.sheet.rerolls; }
  // Dice Crates are gone (now: d20 pieces in runs): unopened crates are paid out as 15 lights each
  if (state.dice > 0) { state.shards += state.dice * 15; state.dice = 0; }
  // only unlocked classes can be played (fighter for now)
  if (state.sheet && (CLASSES.find(c => c.id === state.sheet.cls) || {}).locked !== false) state.sheet.cls = "fighter";

  const clsOf = sheet => CLASSES.find(c => c.id === sheet.cls) || CLASSES[0];
  // Ability score shown on the sheet: 10 + class bonus + 2 per upgrade level
  function score(sheet, a) {
    return 10 + (clsOf(sheet).bonus[a] || 0) + 2 * ABIL_UP[a].reduce((n, id) => n + lvl(id), 0);
  }
  const fromUpgrades = (a) => 2 * ABIL_UP[a].reduce((n, id) => n + lvl(id), 0);

  // Final stats for a run = the same base for everyone + class bonus + upgrades
  function runStats(sheet) {
    sheet = sheet || state.sheet || newSheet();
    const m = a => mod(10 + (clsOf(sheet).bonus[a] || 0)); // upgrades are added below, not twice
    return {
      hearts: 2 + Math.max(0, Math.floor(m("CON") / 2)) + lvl("heart"), // everyone starts with 2
      reach: Math.max(10, 16 + m("STR") * 2) + lvl("reach") * 6,
      jumpV: 320 * (1 + m("DEX") * 0.03),
      block: 0.32 + Math.max(0, m("DEX")) * 0.03 + lvl("lid") * 0.12,
      battery: Math.max(3, 5 + m("WIS") * 0.5) + lvl("battery") * 2,
      bonusDiv: Math.max(120, 250 - m("INT") * 25),
      magnet: Math.round((Math.max(6, 10 + m("CHA") * 4) + lvl("magnet") * 14) * (((CLASSES.find(c => c.id === sheet.cls) || {}).perk || {}).magnet || 1)),
      heatMax: 4 + lvl("greed") * 0.5,          // top Heat multiplier in the Upside Down
      sporeBonus: lvl("greed"),
      djump: lvl("djump") > 0,
      skate: 4 + lvl("skate") * 2,                       // seconds per skateboard ride: 4 / 6 / 8 / 10
      revive: (state.items.revive || 0) > 0,
    };
  }

  function buy(id) {
    const u = UPGRADES.find(x => x.id === id); const l = lvl(id);
    if (!u || l >= u.costs.length) return false;
    const cost = u.costs[l];
    if (state.shards < cost) return false;
    state.shards -= cost; state.up[id] = l + 1; save(); return true;
  }

  function buyItem(id) {
    const it = ITEMS.find(x => x.id === id);
    if (!it || (state.items[id] || 0) >= 1 || state.shards < it.cost) return false;
    state.shards -= it.cost; state.items[id] = 1; save(); return true;
  }
  function useItem(id) { if ((state.items[id] || 0) > 0) { state.items[id] = 0; save(); return true; } return false; }

  window.SAVE = { ITEMS, buyItem, useItem, state, save, lvl, buy, runStats, mod, score, newSheet, fromUpgrades, ABIL_UP,
    openDice, diceOdds, LOOT, UPGRADES, CLASSES, LOOKS, ABIL, ABIL_INFO };
})();
