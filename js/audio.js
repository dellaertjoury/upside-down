// Tiny chiptune sound effects with WebAudio (no files needed).
(function () {
  let ac = null, muted = false, master = null, sfxVol = 0.8, musicVol = 0.8;
  function ctx() {
    if (!ac) {
      try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        master = ac.createGain(); master.gain.value = 0.22 * sfxVol; master.connect(ac.destination);
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
    sling: () => { tone("triangle", 220, 880, 0.08, 0.5); noise(0.04, 0.25); },
    power: () => [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone("square", f, f, 0.07, 0.45, i * 0.045)),
    click: () => tone("square", 440, 440, 0.04, 0.3),
    setMuted(m) { muted = m; MUSIC.refresh(); },
    setVolumes(music, sfx) {
      musicVol = music; sfxVol = sfx;
      if (master) master.gain.setTargetAtTime(0.22 * sfxVol, ac.currentTime, 0.05);
      MUSIC.refresh();
    },
    get muted() { return muted; },
  };

  // ------------------------------------------------------------------
  // Background music: an original 8-bit synth score in an 80s horror
  // style (pulsing arpeggios, driving bass, a lonely lead), composed for
  // this game. It is scheduled live with WebAudio, no files.
  //   hub  - arpeggio + soft pad, no drums (outside the Hellfire Club)
  //   play - full band: arp, bass, drums, lead every other loop
  //   down - the same song, muffled and detuned, with a low drone
  //   over - fades to the drone
  // ------------------------------------------------------------------
  const BPM = 108, STEP = 60 / BPM / 4;            // 16th notes
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  // A minor, i - VI - iv - V (Am, F, Dm, E): the E major gives the eerie pull back
  const CHORDS = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]];
  const ARP = [0, 1, 2, 4, 3, 2, 1, 2, 0, 1, 2, 5, 4, 2, 1, 2]; // indexes into chord tones over 2 octaves
  // lead melody: [step, midi, length in steps], one bar per chord
  const LEAD = [
    [[0, 69, 4], [4, 72, 2], [6, 76, 2], [8, 74, 4], [12, 72, 4]],
    [[0, 72, 4], [4, 69, 2], [6, 72, 2], [8, 77, 6], [14, 76, 2]],
    [[0, 74, 4], [4, 77, 2], [6, 81, 2], [8, 79, 4], [12, 77, 4]],
    [[0, 76, 6], [6, 80, 2], [8, 83, 4], [12, 80, 2], [14, 76, 2]],
  ];
  const MUSIC = {
    on: true, mode: "off", step: 0, next: 0, timer: null, bus: null, filter: null, drone: null, playT: 0,
    init() {
      const a = ctx(); if (!a || this.bus) return a;
      this.filter = a.createBiquadFilter(); this.filter.type = "lowpass"; this.filter.frequency.value = 9000; this.filter.Q.value = 2;
      this.bus = a.createGain(); this.bus.gain.value = 0;
      // a short echo for that 80s space
      const dl = a.createDelay(); dl.delayTime.value = STEP * 3; const fb = a.createGain(); fb.gain.value = 0.28;
      this.filter.connect(this.bus); this.filter.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(this.bus);
      this.bus.connect(a.destination);
      return a;
    },
    level() {
      if (muted || !this.on || this.mode === "off") return 0;
      return musicVol * 1.25 * (this.mode === "over" ? 0.05 : this.mode === "pause" ? 0.03 : this.mode === "hub" ? 0.12 : 0.08);
    },
    refresh() {
      if (!this.bus) return;
      const a = ac, t = a.currentTime;
      this.bus.gain.cancelScheduledValues(t); this.bus.gain.setTargetAtTime(this.level(), t, 0.4);
      const dark = this.mode === "down" || this.mode === "over";
      this.filter.frequency.cancelScheduledValues(t);
      this.filter.frequency.setTargetAtTime(dark ? 650 : this.mode === "hub" ? 2600 : 9000, t, 0.25);
      if (dark && !this.drone) { // low detuned drone under the Upside Down
        const g = a.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.13, t, 0.6);
        const o1 = a.createOscillator(), o2 = a.createOscillator();
        o1.type = "sawtooth"; o2.type = "sawtooth"; o1.frequency.value = mtof(33); o2.frequency.value = mtof(33) * 1.012;
        o1.connect(g); o2.connect(g); g.connect(this.filter); o1.start(); o2.start();
        this.drone = { g, o1, o2 };
      } else if (!dark && this.drone) {
        const d = this.drone; this.drone = null;
        d.g.gain.setTargetAtTime(0, t, 0.3); d.o1.stop(t + 1.5); d.o2.stop(t + 1.5);
      }
    },
    setMode(m) {
      if (m === this.mode) return;
      if (m === "play" && this.mode !== "down" && this.mode !== "pause") this.playT = 0;
      this.mode = m;
      const a = this.init(); if (!a) return;
      if (!this.timer) { this.next = a.currentTime + 0.1; this.step = 0; this.timer = setInterval(() => this.tick(), 25); }
      this.refresh();
    },
    setOn(v) { this.on = v; this.refresh(); },
    note(type, midi, t, dur, vol, detune = 0) {
      const a = ac, o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.value = mtof(midi); o.detune.value = detune;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(this.filter); o.start(t); o.stop(t + dur + 0.02);
    },
    drum(kind, t, vol) {
      const a = ac;
      if (kind === "kick") {
        const o = a.createOscillator(), g = a.createGain();
        o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.14);
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.connect(g); g.connect(this.bus); o.start(t); o.stop(t + 0.2); return;
      }
      const len = kind === "snare" ? 0.12 : 0.03, buf = a.createBuffer(1, Math.floor(a.sampleRate * len), a.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
      f.type = kind === "snare" ? "bandpass" : "highpass"; f.frequency.value = kind === "snare" ? 1800 : 7000;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + len);
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(this.filter); src.start(t);
    },
    tick() {
      if (!ac || this.mode === "off") return;
      while (this.next < ac.currentTime + 0.12) { this.play(this.step, this.next); this.step++; this.next += STEP; }
    },
    play(step, t) {
      if (this.level() === 0) return;
      const s = step % 16, bar = Math.floor(step / 16) % 4, loop = Math.floor(step / 64);
      const ch = CHORDS[bar], tones = [ch[0], ch[1], ch[2], ch[0] + 12, ch[1] + 12, ch[2] + 12];
      const m = this.mode, full = m === "play" || m === "down";
      if (m === "pause") return;
      if (full) this.playT += STEP;
      const dark = m === "down" || m === "over";
      // arpeggio (half speed in the hub, wobbly in the Upside Down)
      if (m !== "over" && (full || s % 2 === 0))
        this.note("square", tones[ARP[s]] + 12, t, STEP * 1.6, 0.16, dark ? Math.sin(step * 0.7) * 25 : 0);
      // pad on every chord change
      if (s === 0) { for (const n of ch) this.note("triangle", n, t, STEP * 15, m === "over" ? 0.06 : 0.09, dark ? 14 : 0); }
      if (!full) return;
      // bass: pulsing 8ths on the root
      if (s % 2 === 0) this.note(dark ? "sawtooth" : "triangle", ch[0] - 12, t, STEP * 1.8, dark ? 0.16 : 0.3);
      // drums come in after a few seconds of running
      if (this.playT > 6) {
        if (s === 0 || s === 8 || s === 10) this.drum("kick", t, dark ? 0.5 : 0.7);
        if (s === 4 || s === 12) this.drum("snare", t, dark ? 0.12 : 0.22);
        if (s % 2 === 1) this.drum("hat", t, 0.06);
      }
      // lead on every second loop, an octave lower and slower in the dark
      if (this.playT > 12 && loop % 2 === 1) for (const [st, n, len] of LEAD[bar])
        if (st === s) this.note(dark ? "triangle" : "square", dark ? n - 12 : n, t, STEP * len * 0.95, dark ? 0.12 : 0.1, dark ? -18 : 0);
    },
  };
  SFX.music = MUSIC;
  window.SFX = SFX;
})();
