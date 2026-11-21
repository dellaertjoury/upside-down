// Persistent progress (this browser): character sheet, upgrades, shards.
(function () {
  const KEY = "upsidedown.save.v1";
  const ABIL = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
  const ABIL_INFO = {
    STR: "Bat reach",
    DEX: "Jump height & block window",
    CON: "Extra hearts",
    INT: "Bigger light bonus after a run",
    WIS: "Longer in the Upside Down",
    CHA: "Light magnet range",
  };

  const CLASSES = [
    { id: "fighter", name: "Fighter", desc: "Swings a dented bat, blocks with a trash-can lid.", bonus: { STR: 2, CON: 1 }, locked: false },
    { id: "ranger",  name: "Ranger",  desc: "Slingshot from range.", bonus: { DEX: 2, WIS: 1 }, locked: true },
    { id: "rogue",   name: "Rogue",   desc: "Faster rolls, sneaky crits.", bonus: { DEX: 2, CHA: 1 }, locked: true },
    { id: "wizard",  name: "Wizard",  desc: "Bends the Dread meter.", bonus: { INT: 2, WIS: 1 }, locked: true },
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
    { id: "lid",     name: "Sturdier lid",       desc: "Hold your block longer.",                            costs: [40, 110] },
    { id: "djump",   name: "Double jump",        desc: "Jump again in mid-air.",                             costs: [150] },
    { id: "revive",  name: "Second wind",        desc: "Once per run, survive a fatal hit.",                 costs: [400] },
  ];

  const FREE_REROLLS = 3, REROLL_COST = 10;

  const fresh = () => ({ shards: 0, best: 0, runs: 0, muted: false, up: {}, sheet: null });
  function load() {
    try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return fresh(); }
  }
  const state = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  const lvl = id => state.up[id] || 0;
  const mod = score => Math.floor((score - 10) / 2);

  // 4d6, drop the lowest
  function rollAbility() {
    const d = [1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 6));
    const sorted = d.slice().sort((a, b) => a - b);
    return { dice: d, drop: sorted[0], total: sorted[1] + sorted[2] + sorted[3] };
  }
  function rollAll() {
    const out = {}; ABIL.forEach(a => out[a] = rollAbility()); return out;
  }

  function newSheet() {
    const r = rollAll(), scores = {}, dice = {};
    ABIL.forEach(a => { scores[a] = r[a].total; dice[a] = r[a].dice; });
    return { name: "", cls: "fighter", hair: "brown", jacket: "red", scores, dice, rerolls: 0 };
  }

  // Ability score including the class bonus
  function score(sheet, a) {
    const cls = CLASSES.find(c => c.id === sheet.cls) || CLASSES[0];
    return sheet.scores[a] + (cls.bonus[a] || 0);
  }

  // Final stats for a run = rolled abilities + class + upgrades
  function runStats(sheet) {
    sheet = sheet || state.sheet || newSheet();
    const m = a => mod(score(sheet, a));
    return {
      hearts: 1 + Math.max(0, Math.floor(m("CON") / 2)) + lvl("heart"),
      reach: Math.max(10, 16 + m("STR") * 2) + lvl("reach") * 6,
      jumpV: 320 * (1 + m("DEX") * 0.03),
      block: 0.32 + Math.max(0, m("DEX")) * 0.03 + lvl("lid") * 0.12,
      battery: Math.max(3, 5 + m("WIS") * 0.5) + lvl("battery") * 2,
      bonusDiv: Math.max(120, 250 - m("INT") * 25),
      magnet: Math.max(6, 10 + m("CHA") * 4) + lvl("magnet") * 14,
      udMult: 2 + lvl("greed") * 0.5,
      sporeBonus: lvl("greed"),
      djump: lvl("djump") > 0,
      revive: lvl("revive") > 0,
    };
  }

  function buy(id) {
    const u = UPGRADES.find(x => x.id === id); const l = lvl(id);
    if (!u || l >= u.costs.length) return false;
    const cost = u.costs[l];
    if (state.shards < cost) return false;
    state.shards -= cost; state.up[id] = l + 1; save(); return true;
  }

  window.SAVE = { state, save, lvl, buy, runStats, mod, score, rollAll, newSheet,
    UPGRADES, CLASSES, LOOKS, ABIL, ABIL_INFO, FREE_REROLLS, REROLL_COST };
})();
