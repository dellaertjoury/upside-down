// Tiny chiptune sound effects with WebAudio (no files needed).
(function () {
  let ac = null, muted = false, master = null;
  function ctx() {
    if (!ac) {
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        master = ac.createGain(); master.gain.value = 0.18; master.connect(ac.destination);
      } catch (e) { return null; }
    }
    if (ac.state === "suspended") ac.resume().catch(() => {});
    return ac;
  }
  function tone(type, f0, f1, dur, vol = 1, delay = 0) {
    if (muted) return; const a = ctx(); if (!a) return;
    const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol = 1) {
    if (muted) return; const a = ctx(); if (!a) return;
    const len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = a.createBufferSource(), g = a.createGain(); g.gain.value = vol;
    s.buffer = buf; s.connect(g); g.connect(master); s.start();
  }
  const SFX = {
    unlock: () => ctx(),
    jump: () => tone("square", 330, 660, 0.12, 0.6),
    flip: () => { tone("sawtooth", 520, 90, 0.25, 0.5); tone("sine", 60, 40, 0.3, 0.8); },
    flipUp: () => tone("triangle", 120, 700, 0.22, 0.6),
    roll: () => noise(0.12, 0.4),
    swing: () => { noise(0.07, 0.35); tone("square", 200, 120, 0.06, 0.3); },
    kill: () => { tone("square", 180, 60, 0.18, 0.7); noise(0.15, 0.5); },
    shard: () => { tone("square", 988, 988, 0.05, 0.4); tone("square", 1319, 1319, 0.08, 0.4, 0.05); },
    spore: () => { tone("triangle", 660, 990, 0.1, 0.5); },
    hurt: () => { tone("sawtooth", 220, 55, 0.35, 0.8); noise(0.25, 0.6); },
    dread: () => tone("sine", 70, 50, 0.6, 0.9),
    revive: () => [523, 659, 784, 1047].forEach((f, i) => tone("square", f, f, 0.1, 0.5, i * 0.08)),
    over: () => [392, 330, 262, 196].forEach((f, i) => tone("triangle", f, f * 0.98, 0.22, 0.7, i * 0.16)),
    buy: () => [660, 880, 1320].forEach((f, i) => tone("square", f, f, 0.07, 0.4, i * 0.06)),
    dice: () => { for (let i = 0; i < 7; i++) tone("square", 300 + Math.random() * 500, 200, 0.03, 0.25, i * 0.11); tone("square", 880, 1320, 0.12, 0.4, 0.85); },
    lid: () => tone("square", 160, 140, 0.05, 0.25),
    block: () => { tone("square", 1200, 900, 0.08, 0.5); tone("triangle", 2400, 1800, 0.12, 0.3); noise(0.05, 0.3); },
    spit: () => tone("sawtooth", 260, 120, 0.12, 0.35),
    roll20: () => { for (let i = 0; i < 6; i++) tone("square", 400 + Math.random() * 600, 300, 0.025, 0.2, i * 0.06); },
    light: () => { const f = [1047, 1175, 1319, 1568][Math.floor(Math.random() * 4)]; tone("triangle", f, f, 0.06, 0.4); tone("sine", f * 2, f * 2, 0.09, 0.2, 0.03); },
    gold: () => [1319, 1568, 2093].forEach((f, i) => tone("triangle", f, f, 0.08, 0.45, i * 0.05)),
    crate: () => { noise(0.18, 0.6); tone("square", 140, 60, 0.15, 0.5); [988, 1319, 1568].forEach((f, i) => tone("triangle", f, f, 0.06, 0.3, 0.08 + i * 0.05)); },
    thud: () => { noise(0.1, 0.5); tone("sine", 90, 50, 0.12, 0.6); },
    click: () => tone("square", 440, 440, 0.04, 0.3),
    setMuted(m) { muted = m; },
    get muted() { return muted; },
  };
  window.SFX = SFX;
})();
