// NumZoo — sons (synthétisés, aucun fichier audio) et effets : feux d'artifice, confettis, guirlandes, lumières
const Sound = {
  ctx: null, on: true,
  init() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  tone(freq, dur, type = 'sine', vol = .18, delay = 0, slide) {
    if (!this.on || !this.ctx) return;
    const c = this.ctx, t0 = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + .02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + dur + .05);
  },
  noise(dur = .4, vol = .25, delay = 0) {
    if (!this.on || !this.ctx) return;
    const c = this.ctx, t0 = c.currentTime + delay, n = c.sampleRate * dur, buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    const s = c.createBufferSource(), g = c.createGain(), f = c.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 1800; s.buffer = buf; g.gain.value = vol;
    s.connect(f).connect(g).connect(c.destination); s.start(t0);
  },
  tap() { this.tone(660, .06, 'triangle', .08); },
  good() { this.tone(784, .12, 'sine', .2); this.tone(1175, .22, 'sine', .2, .09); },
  bad() { this.tone(300, .25, 'triangle', .12, 0, 180); },
  streak() { [880, 1047, 1319, 1568].forEach((f, i) => this.tone(f, .14, 'square', .06, i * .07)); },
  whoosh() { this.tone(200, .4, 'sawtooth', .04, 0, 900); },
  chomp() { this.tone(160, .08, 'square', .12); this.tone(120, .1, 'square', .12, .12); this.tone(160, .08, 'square', .1, .24); },
  fanfare() {
    const n = [523, 659, 784, 1047, 784, 1047, 1319];
    n.forEach((f, i) => { this.tone(f, .22, 'triangle', .16, i * .13); this.tone(f / 2, .22, 'sine', .08, i * .13); });
  },
  pop(delay) { this.noise(.35, .2, delay); this.tone(90, .2, 'sine', .15, delay); },
};

// Petites particules au point touché
function burst(x, y, colors = ['#ffd23f', '#ff6b6b', '#06d6a0', '#3a86ff', '#f15bb5'], n = 14) {
  const layer = document.getElementById('fx');
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i'); p.className = 'spark';
    const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 70;
    p.style.left = x + 'px'; p.style.top = y + 'px'; p.style.background = colors[i % colors.length];
    p.style.setProperty('--dx', Math.cos(a) * d + 'px'); p.style.setProperty('--dy', Math.sin(a) * d + 'px');
    layer.appendChild(p); setTimeout(() => p.remove(), 800);
  }
}
function floatText(x, y, txt, cls = '') {
  const el = document.createElement('div'); el.className = 'float-text ' + cls; el.textContent = txt;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  document.getElementById('fx').appendChild(el); setTimeout(() => el.remove(), 1200);
}

// Guirlande lumineuse (SVG) — en haut d'un conteneur
function garlandHTML(n = 18) {
  const cols = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#f15bb5', '#ff924c'];
  let bulbs = '', d = 'M0 6';
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 1000, y = 6 + Math.sin((i / n) * Math.PI * 3) * 4 + (i % 2 ? 26 : 18);
    d += ` Q${x - 1000 / n / 2} ${y + 14} ${x} ${y}`;
    if (i > 0 && i < n) bulbs += `<g transform="translate(${x} ${y})"><rect x="-4" y="0" width="8" height="8" fill="#555" rx="2"/><ellipse class="bulb" style="animation-delay:${(i % 3) * .25}s;--c:${cols[i % cols.length]}" cx="0" cy="18" rx="9" ry="13" fill="${cols[i % cols.length]}"/></g>`;
  }
  return `<svg class="garland" viewBox="0 0 1000 70" preserveAspectRatio="none"><path d="${d}" stroke="#2d6a4f" stroke-width="3" fill="none"/>${bulbs}</svg>`;
}

// Feux d'artifice + confettis sur canvas plein écran
const Fireworks = {
  cv: null, cx: null, parts: [], rockets: [], confetti: [], until: 0, raf: 0,
  start(ms = 4500, withConfetti = true) {
    this.cv = document.getElementById('fw'); this.cx = this.cv.getContext('2d');
    this.resize(); this.cv.classList.add('on');
    this.until = performance.now() + ms; this.parts = []; this.rockets = []; this.confetti = [];
    if (withConfetti) for (let i = 0; i < 120; i++) this.confetti.push(this.makeConf(true));
    let launches = 0;
    const launch = () => {
      if (performance.now() > this.until - 1200) return;
      const W = this.cv.width;
      this.rockets.push({ x: W * (.15 + Math.random() * .7), y: this.cv.height, vx: (Math.random() - .5) * 2, vy: -(this.cv.height / 60) * (.9 + Math.random() * .35), hue: Math.random() * 360 });
      Sound.pop(.55); launches++;
      setTimeout(launch, launches < 3 ? 250 : 420 + Math.random() * 300);
    };
    launch();
    cancelAnimationFrame(this.raf); this.loop();
  },
  makeConf(top) {
    const W = this.cv.width, H = this.cv.height;
    return { x: Math.random() * W, y: top ? -Math.random() * H : -20, w: 6 + Math.random() * 8, h: 10 + Math.random() * 10, vy: 1.5 + Math.random() * 2.5, vx: (Math.random() - .5) * 1.5, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#f15bb5', '#fff'][Math.floor(Math.random() * 6)] };
  },
  resize() { const dpr = Math.min(window.devicePixelRatio || 1, 2); this.cv.width = innerWidth * dpr; this.cv.height = innerHeight * dpr; this.dpr = dpr; },
  explode(r) {
    const n = 70, s = this.dpr || 1;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, sp = (2 + Math.random() * 4) * s;
      this.parts.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, hue: r.hue + Math.random() * 40 - 20 });
    }
  },
  loop() {
    const c = this.cx, W = this.cv.width, H = this.cv.height, now = performance.now();
    c.globalCompositeOperation = 'destination-out'; c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'lighter';
    this.rockets = this.rockets.filter(r => {
      r.x += r.vx; r.y += r.vy; r.vy += .12 * (this.dpr || 1);
      c.fillStyle = `hsl(${r.hue},100%,70%)`; c.beginPath(); c.arc(r.x, r.y, 3 * (this.dpr || 1), 0, 7); c.fill();
      if (r.vy >= -1) { this.explode(r); return false; } return true;
    });
    this.parts = this.parts.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .06 * (this.dpr || 1); p.vx *= .985; p.life -= .013;
      c.fillStyle = `hsla(${p.hue},100%,62%,${p.life})`; c.beginPath(); c.arc(p.x, p.y, 2.6 * (this.dpr || 1), 0, 7); c.fill();
      return p.life > 0;
    });
    c.globalCompositeOperation = 'source-over';
    const s = this.dpr || 1;
    this.confetti.forEach(f => {
      f.y += f.vy * s; f.x += f.vx * s + Math.sin(f.y / 30); f.r += f.vr;
      c.save(); c.translate(f.x, f.y); c.rotate(f.r); c.fillStyle = f.c; c.fillRect(-f.w * s / 2, -f.h * s / 2, f.w * s, f.h * s * Math.abs(Math.cos(f.r))); c.restore();
    });
    if (now < this.until - 1500) this.confetti.forEach((f, i) => { if (f.y > H + 20) this.confetti[i] = this.makeConf(false); });
    if (now < this.until || this.parts.length || this.confetti.some(f => f.y < H + 20)) this.raf = requestAnimationFrame(() => this.loop());
    else { c.clearRect(0, 0, W, H); this.cv.classList.remove('on'); }
  },
  stop() { cancelAnimationFrame(this.raf); if (this.cx) this.cx.clearRect(0, 0, this.cv.width, this.cv.height); if (this.cv) this.cv.classList.remove('on'); },
};
