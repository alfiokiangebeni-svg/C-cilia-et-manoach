// NumZoo — illustrations vectorielles originales (avatars, Glouton, avion, bateau, animaux à colorier)

const AVATARS = [
  { id: 'amani', name: 'Amani', skin: '#7a4a2e', hair: 'puffs', hc: '#1e1410', shirt: '#ff9f1c', pants: '#2b59c3', acc: 'band', accC: '#ffd23f' },
  { id: 'kito',  name: 'Kito',  skin: '#a86b45', hair: 'cap',   hc: '#2a1a12', shirt: '#2ec4b6', pants: '#3d405b', acc: 'none', accC: '#e63946' },
  { id: 'lila',  name: 'Lila',  skin: '#f6d3b8', hair: 'bun',   hc: '#d9622b', shirt: '#9b5de5', pants: '#00bbf9', acc: 'star', accC: '#fee440' },
  { id: 'mei',   name: 'Mei',   skin: '#f1c9a0', hair: 'bob',   hc: '#22201f', shirt: '#f15bb5', pants: '#3a86ff', acc: 'clip', accC: '#00f5d4' },
  { id: 'malik', name: 'Malik', skin: '#5c3a24', hair: 'curly', hc: '#120c08', shirt: '#06d6a0', pants: '#ef476f', acc: 'glasses', accC: '#264653' },
  { id: 'nia',   name: 'Nia',   skin: '#8d5634', hair: 'braids',hc: '#1b120d', shirt: '#ff6b6b', pants: '#4361ee', acc: 'beads', accC: '#ffd166' },
];
const SHIRTS = ['#ff9f1c', '#2ec4b6', '#9b5de5', '#f15bb5', '#06d6a0', '#ff6b6b', '#3a86ff', '#ffd23f'];

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  r = Math.max(0, Math.min(255, Math.round(r * f))); g = Math.max(0, Math.min(255, Math.round(g * f))); b = Math.max(0, Math.min(255, Math.round(b * f)));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Retourne le contenu SVG (sans balise <svg>) d'un avatar dans un repère 120 x 160
function avatarInner(p, mood) {
  const sk = p.skin, skD = shade(p.skin, 0.85), hc = p.hc, hcL = shade(p.hc, 1.6);
  let back = '', front = '', acc = '';
  switch (p.hair) {
    case 'puffs':
      back = `<circle cx="20" cy="30" r="20" fill="${hc}"/><circle cx="100" cy="30" r="20" fill="${hc}"/>
              <circle cx="15" cy="24" r="6" fill="${hcL}" opacity=".35"/><circle cx="95" cy="24" r="6" fill="${hcL}" opacity=".35"/>`;
      front = `<path d="M22 58 Q20 20 60 19 Q100 20 98 58 Q90 38 60 36 Q30 38 22 58Z" fill="${hc}"/>`;
      break;
    case 'braids':
      back = `<path d="M22 50 Q14 90 20 122" stroke="${hc}" stroke-width="13" fill="none" stroke-linecap="round"/>
              <path d="M98 50 Q106 90 100 122" stroke="${hc}" stroke-width="13" fill="none" stroke-linecap="round"/>`;
      front = `<path d="M21 60 Q18 18 60 18 Q102 18 99 60 Q95 34 72 32 L60 40 L48 32 Q25 34 21 60Z" fill="${hc}"/>
               <path d="M60 20 L60 40" stroke="${hcL}" stroke-width="2" opacity=".4"/>`;
      break;
    case 'bun':
      back = `<circle cx="60" cy="13" r="15" fill="${hc}"/><circle cx="55" cy="9" r="5" fill="${hcL}" opacity=".35"/>`;
      front = `<path d="M21 62 Q18 20 60 20 Q102 20 99 62 Q96 42 80 36 Q70 46 50 38 Q30 42 21 62Z" fill="${hc}"/>`;
      break;
    case 'bob':
      back = `<path d="M18 60 Q14 18 60 16 Q106 18 102 60 L104 86 Q96 92 88 86 L32 86 Q24 92 16 86Z" fill="${hc}"/>`;
      front = `<path d="M22 58 Q22 22 60 21 Q98 22 98 58 L96 50 Q60 48 30 44 Z" fill="${hc}"/>
               <path d="M24 48 Q60 40 96 50" stroke="${hc}" stroke-width="10" fill="none"/>`;
      break;
    case 'curly': {
      let c = '';
      for (let i = 0; i < 11; i++) { const a = Math.PI + (i / 10) * Math.PI; c += `<circle cx="${60 + Math.cos(a) * 38}" cy="${54 + Math.sin(a) * 34}" r="11" fill="${hc}"/>`; }
      front = c + `<ellipse cx="60" cy="30" rx="30" ry="14" fill="${hc}"/>`;
      break;
    }
    case 'cap':
      front = `<path d="M22 60 Q20 30 40 30 L80 30 Q100 30 98 60 Q90 46 60 46 Q30 46 22 60Z" fill="${hc}"/>
               <path d="M20 42 Q22 12 60 12 Q98 12 100 42 Z" fill="${p.accC}"/>
               <path d="M60 42 L112 44 Q116 50 104 52 L60 50Z" fill="${shade(p.accC, 0.8)}"/>
               <circle cx="60" cy="14" r="4" fill="#fff" opacity=".8"/>
               <path d="M38 24 Q50 18 62 20" stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
      break;
  }
  if (p.acc === 'band') acc = `<path d="M22 44 Q60 22 98 44" stroke="${p.accC}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if (p.acc === 'star') acc = `<path transform="translate(84 28) scale(.9)" d="M0-10 L3-3 L10-3 L4 2 L6 10 L0 5 L-6 10 L-4 2 L-10-3 L-3-3Z" fill="${p.accC}" stroke="#e0a800" stroke-width="1.5"/>`;
  if (p.acc === 'clip') acc = `<rect x="78" y="36" width="16" height="7" rx="3.5" transform="rotate(-20 86 40)" fill="${p.accC}"/>`;
  if (p.acc === 'beads') acc = `<circle cx="20" cy="104" r="5" fill="${p.accC}"/><circle cx="100" cy="104" r="5" fill="${p.accC}"/><circle cx="20" cy="118" r="5" fill="#ef476f"/><circle cx="100" cy="118" r="5" fill="#ef476f"/>`;
  if (p.acc === 'glasses') acc = `<g stroke="${p.accC}" stroke-width="3" fill="rgba(255,255,255,.15)"><circle cx="44" cy="64" r="11"/><circle cx="76" cy="64" r="11"/><path d="M55 64 L65 64"/></g>`;

  const happy = mood !== 'sad';
  const eyes = mood === 'wink'
    ? `<path d="M37 64 Q44 58 51 64" stroke="#2a1d17" stroke-width="3.5" fill="none" stroke-linecap="round"/>
       <ellipse cx="76" cy="64" rx="7" ry="9" fill="#2a1d17"/><circle cx="78.5" cy="60.5" r="3" fill="#fff"/>`
    : `<ellipse cx="44" cy="64" rx="7" ry="9" fill="#2a1d17"/><ellipse cx="76" cy="64" rx="7" ry="9" fill="#2a1d17"/>
       <circle cx="46.5" cy="60.5" r="3" fill="#fff"/><circle cx="78.5" cy="60.5" r="3" fill="#fff"/>
       <circle cx="42" cy="67" r="1.4" fill="#fff"/><circle cx="74" cy="67" r="1.4" fill="#fff"/>`;
  const mouth = happy
    ? `<path d="M50 78 Q60 90 70 78 Q60 82 50 78Z" fill="#c2405a"/><path d="M53 80 Q60 84 67 80" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>`
    : `<path d="M52 84 Q60 78 68 84" stroke="#2a1d17" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  return `
  <g class="av-body">
    <ellipse cx="60" cy="156" rx="30" ry="4" fill="rgba(0,0,0,.15)"/>
    <rect x="44" y="132" width="11" height="20" rx="5" fill="${sk}"/><rect x="65" y="132" width="11" height="20" rx="5" fill="${sk}"/>
    <ellipse cx="49" cy="152" rx="10" ry="5" fill="#fff"/><ellipse cx="71" cy="152" rx="10" ry="5" fill="#fff"/>
    <ellipse cx="49" cy="150" rx="10" ry="3" fill="${p.shirt}"/><ellipse cx="71" cy="150" rx="10" ry="3" fill="${p.shirt}"/>
    <path d="M38 122 L82 122 L84 138 L36 138Z" fill="${p.pants}"/>
    <g class="av-arm-l"><rect x="22" y="98" width="12" height="28" rx="6" fill="${sk}" transform="rotate(18 28 100)"/></g>
    <g class="av-arm-r"><rect x="86" y="98" width="12" height="28" rx="6" fill="${sk}" transform="rotate(-18 92 100)"/></g>
    <path d="M36 98 Q60 88 84 98 L86 126 Q60 130 34 126Z" fill="${p.shirt}"/>
    <path d="M30 100 L38 96 L40 112 L28 112Z" fill="${p.shirt}"/><path d="M90 100 L82 96 L80 112 L92 112Z" fill="${p.shirt}"/>
    <circle cx="60" cy="112" r="6" fill="#fff" opacity=".85"/><path d="M57 112 L59.5 114.5 L63.5 109.5" stroke="${p.shirt}" stroke-width="2" fill="none"/>
  </g>
  <g class="av-head">
    ${back}
    <circle cx="20" cy="66" r="8" fill="${skD}"/><circle cx="100" cy="66" r="8" fill="${skD}"/>
    <ellipse cx="60" cy="60" rx="40" ry="37" fill="${sk}"/>
    ${front}
    <ellipse cx="34" cy="76" rx="7" ry="4.5" fill="#ff7b8a" opacity=".55"/><ellipse cx="86" cy="76" rx="7" ry="4.5" fill="#ff7b8a" opacity=".55"/>
    ${eyes}
    <ellipse cx="60" cy="73" rx="2.5" ry="1.8" fill="${skD}"/>
    ${mouth}
    ${acc}
  </g>`;
}
function avatarSVG(p, cls = '', mood) {
  return `<svg class="avatar ${cls}" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">${avatarInner(p, mood)}</svg>`;
}
function avatarHeadSVG(p, cls = '') {
  return `<svg class="${cls}" viewBox="0 6 120 100" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 0)">${avatarInner(p).replace(/<g class="av-body">[\s\S]*?<\/g>\s*<g class="av-head">/, '<g class="av-head">')}</g></svg>`;
}

// Glouton : petit monstre original (blob turquoise à cornes)
function monsterSVG(state) {
  const open = state === 'open', chew = state === 'chew', sad = state === 'sad';
  const mouth = open
    ? `<ellipse cx="100" cy="128" rx="42" ry="30" fill="#5a1430"/><ellipse cx="100" cy="142" rx="22" ry="10" fill="#ff6f91"/>
       <path d="M66 112 L74 124 L82 112 L90 124 L98 112 L106 124 L114 112 L122 124 L130 112" fill="#fff"/>`
    : chew ? `<path d="M68 124 Q84 140 100 126 Q116 140 132 124" stroke="#5a1430" stroke-width="7" fill="none" stroke-linecap="round"/>`
    : sad ? `<path d="M74 134 Q100 116 126 134" stroke="#5a1430" stroke-width="7" fill="none" stroke-linecap="round"/>`
    : `<path d="M70 122 Q100 150 130 122 Z" fill="#5a1430"/><path d="M84 124 L90 132 L96 124Z M104 124 L110 132 L116 124Z" fill="#fff"/>`;
  return `<svg viewBox="0 0 200 200" class="monster ${state || ''}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="190" rx="70" ry="8" fill="rgba(0,0,0,.15)"/>
    <path d="M58 52 L46 12 L78 40Z" fill="#ffb703"/><path d="M142 52 L154 12 L122 40Z" fill="#ffb703"/>
    <path d="M30 120 Q24 40 100 38 Q176 40 170 120 Q174 186 140 186 L60 186 Q26 186 30 120Z" fill="#20c5b0"/>
    <path d="M44 100 Q50 54 100 50" stroke="#7af0dd" stroke-width="10" fill="none" stroke-linecap="round" opacity=".6"/>
    <circle cx="60" cy="160" r="9" fill="#17a493"/><circle cx="146" cy="150" r="6" fill="#17a493"/><circle cx="130" cy="170" r="4" fill="#17a493"/>
    <ellipse cx="100" cy="84" rx="30" ry="28" fill="#fff"/>
    <circle cx="${sad ? 100 : 104}" cy="${sad ? 92 : 86}" r="15" fill="#3a0ca3"/><circle cx="${sad ? 105 : 110}" cy="${sad ? 86 : 80}" r="5" fill="#fff"/>
    ${sad ? '<path d="M70 62 Q100 74 130 62" stroke="#0e6f63" stroke-width="5" fill="none" stroke-linecap="round"/>' : ''}
    ${mouth}
    <ellipse cx="22" cy="124" rx="12" ry="18" fill="#20c5b0" transform="rotate(-20 22 124)"/>
    <ellipse cx="178" cy="124" rx="12" ry="18" fill="#20c5b0" transform="rotate(20 178 124)"/>
  </svg>`;
}

function planeSVG(av) {
  return `<svg viewBox="0 0 220 120" class="plane" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 70 L4 40 L24 40 L52 62Z" fill="#3a86ff"/>
    <ellipse cx="110" cy="74" rx="88" ry="30" fill="#ffbe0b"/>
    <path d="M30 80 Q110 104 196 78 Q190 98 110 104 Q40 100 30 80Z" fill="#fb8500"/>
    <path d="M80 80 L130 80 L104 118 L70 118Z" fill="#3a86ff"/>
    <ellipse cx="196" cy="72" rx="12" ry="16" fill="#ff006e"/>
    <g class="prop"><ellipse cx="210" cy="72" rx="4" ry="28" fill="#fff" opacity=".85"/></g>
    <circle cx="150" cy="68" r="8" fill="#a2d2ff"/><circle cx="172" cy="68" r="7" fill="#a2d2ff"/>
    <foreignObject x="72" y="4" width="64" height="58"><div xmlns="http://www.w3.org/1999/xhtml" style="width:64px;height:58px">${avatarHeadSVG(av, 'pilot')}</div></foreignObject>
    <path d="M70 58 Q104 40 140 58 Z" fill="#8ecae6" opacity=".55"/>
  </svg>`;
}

function boatSVG(av) {
  return `<svg viewBox="0 0 220 170" class="boat" xmlns="http://www.w3.org/2000/svg">
    <path d="M110 10 L110 110" stroke="#6d4c41" stroke-width="6"/>
    <path d="M114 16 Q170 60 116 100Z" fill="#fff"/><path d="M106 26 Q66 70 106 100Z" fill="#ffd166"/>
    <path d="M114 16 L140 10 L114 26Z" fill="#ef476f"/>
    <foreignObject x="40" y="56" width="62" height="56"><div xmlns="http://www.w3.org/1999/xhtml" style="width:62px;height:56px">${avatarHeadSVG(av, 'pilot')}</div></foreignObject>
    <path d="M14 108 L206 108 Q190 150 150 154 L66 154 Q30 150 14 108Z" fill="#e85d04"/>
    <path d="M18 116 L202 116" stroke="#ffba08" stroke-width="6"/>
    <circle cx="70" cy="132" r="7" fill="#ffd8a8"/><circle cx="110" cy="132" r="7" fill="#ffd8a8"/><circle cx="150" cy="132" r="7" fill="#ffd8a8"/>
    <path d="M190 104 L214 40" stroke="#4e342e" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

function fishSVG(color, label) {
  return `<svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg">
    <path d="M110 45 L138 18 L136 72Z" fill="${shade(color, .8)}"/>
    <ellipse cx="66" cy="45" rx="56" ry="36" fill="${color}"/>
    <path d="M60 12 Q74 0 88 14" fill="${shade(color, .8)}"/>
    <circle cx="30" cy="38" r="9" fill="#fff"/><circle cx="28" cy="38" r="5" fill="#222"/>
    <path d="M14 54 Q20 60 26 54" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="72" y="58" text-anchor="middle" class="fish-num">${label}</text>
  </svg>`;
}

// ---------- Animaux à colorier : chaque zone = { d | shape, c: index couleur cible, lx, ly } ----------
function flowerPath(cx, cy, r, bump, n) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (i === 0) { d += `M${x.toFixed(1)} ${y.toFixed(1)}`; continue; }
    const am = ((i - .5) / n) * Math.PI * 2, xm = cx + Math.cos(am) * (r + bump), ym = cy + Math.sin(am) * (r + bump);
    d += ` Q${xm.toFixed(1)} ${ym.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + 'Z';
}

const COLOR_PAGES = [
  { // Niveau 1 : le lion
    id: 'lion', emoji: '🦁',
    colors: ['#ff8c1a', '#ffd23f', '#fff3d6', '#8b4a2b'],
    zones: [
      { d: flowerPath(150, 150, 104, 26, 14), c: 0, lx: 150, ly: 36, w: 70 },
      { shape: '<circle cx="96" cy="88" r="24"/>', c: 3, lx: 96, ly: 92, w: 42 },
      { shape: '<circle cx="204" cy="88" r="24"/>', c: 3, lx: 204, ly: 92, w: 42 },
      { shape: '<circle cx="150" cy="150" r="72"/>', c: 1, lx: 150, ly: 114, w: 70 },
      { shape: '<ellipse cx="150" cy="188" rx="44" ry="30"/>', c: 2, lx: 150, ly: 212, w: 66 },
      { d: 'M130 164 Q150 152 170 164 Q162 184 150 188 Q138 184 130 164Z', c: 3, lx: 150, ly: 177, w: 34 },
    ],
    decor: `<circle cx="124" cy="138" r="8" fill="#222"/><circle cx="176" cy="138" r="8" fill="#222"/>
            <circle cx="127" cy="135" r="3" fill="#fff"/><circle cx="179" cy="135" r="3" fill="#fff"/>
            <path d="M150 188 L150 192 M140 192 Q145 198 150 192 Q155 198 160 192" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  { // Niveau 2 : la tortue
    id: 'turtle', emoji: '🐢',
    colors: ['#2a9d8f', '#8ac926', '#1d6f63', '#ffca3a'],
    zones: [
      { shape: '<ellipse cx="66" cy="226" rx="26" ry="22"/>', c: 1, lx: 66, ly: 240, w: 44 },
      { shape: '<ellipse cx="226" cy="226" rx="26" ry="22"/>', c: 1, lx: 226, ly: 240, w: 44 },
      { shape: '<circle cx="264" cy="160" r="30"/>', c: 1, lx: 262, ly: 164, w: 34 },
      { d: 'M36 200 Q40 86 146 80 Q246 86 250 200Z', c: 0, lx: 146, ly: 104, w: 110 },
      { d: 'M110 130 L146 112 L182 130 L182 168 L146 186 L110 168Z', c: 2, lx: 146, ly: 156, w: 66 },
      { shape: '<circle cx="78" cy="170" r="22"/>', c: 2, lx: 78, ly: 176, w: 36 },
      { shape: '<circle cx="214" cy="170" r="22"/>', c: 2, lx: 214, ly: 176, w: 36 },
      { d: 'M30 196 L262 196 Q262 220 246 220 L46 220 Q30 220 30 196Z', c: 3, lx: 146, ly: 214, w: 110 },
    ],
    decor: `<path d="M32 198 L12 208 L36 210Z" fill="#8ac926" stroke="#333" stroke-width="2.5"/>
            <circle cx="281" cy="146" r="5" fill="#222"/><circle cx="282.5" cy="144.5" r="1.8" fill="#fff"/>
            <path d="M280 176 Q286 180 292 172" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  { // Niveau 3 : le papillon
    id: 'butterfly', emoji: '🦋',
    colors: ['#9b5de5', '#f15bb5', '#fee440', '#3d2c5a'],
    zones: [
      { d: 'M144 140 Q60 14 26 66 Q6 130 144 152Z', c: 0, lx: 104, ly: 126, w: 60 },
      { d: 'M156 140 Q240 14 274 66 Q294 130 156 152Z', c: 0, lx: 196, ly: 126, w: 60 },
      { d: 'M144 158 Q36 160 56 234 Q100 276 144 172Z', c: 1, lx: 116, ly: 192, w: 50 },
      { d: 'M156 158 Q264 160 244 234 Q200 276 156 172Z', c: 1, lx: 184, ly: 192, w: 50 },
      { shape: '<circle cx="58" cy="80" r="21"/>', c: 2, lx: 58, ly: 86, w: 38 },
      { shape: '<circle cx="242" cy="80" r="21"/>', c: 2, lx: 242, ly: 86, w: 38 },
      { shape: '<circle cx="82" cy="228" r="19"/>', c: 2, lx: 82, ly: 234, w: 34 },
      { shape: '<circle cx="218" cy="228" r="19"/>', c: 2, lx: 218, ly: 234, w: 34 },
      { shape: '<ellipse cx="150" cy="160" rx="15" ry="66"/>', c: 3, lx: 150, ly: 166, w: 60, rot: true },
    ],
    decor: `<path d="M146 98 Q130 56 112 46 M154 98 Q170 56 188 46" stroke="#3d2c5a" stroke-width="4" fill="none" stroke-linecap="round"/>
            <circle cx="112" cy="46" r="6" fill="#3d2c5a"/><circle cx="188" cy="46" r="6" fill="#3d2c5a"/>`,
  },
];

const FREE_PALETTE = ['#ff595e', '#ff924c', '#ffca3a', '#c5ca30', '#8ac926', '#2a9d8f', '#1982c4', '#4267ac', '#6a4c93', '#f15bb5', '#8b4a2b', '#fff3d6', '#222222', '#ffffff'];

const ZOO_ANIMALS = ['🦁', '🐘', '🦒', '🦓', '🐒', '🦛', '🐊', '🦜', '🐢', '🐠', '🐬', '🐙', '🦋', '🐞', '🦉', '🐼', '🐨', '🐧', '🦩', '🐆', '🐳'];
