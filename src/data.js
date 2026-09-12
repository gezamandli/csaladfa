export const DEFAULT_PEOPLE = [
  // Gen 0 – Ük-nagyszülők
  { id: 'mandli_lajos',      ln: 'Mándli',    fn: 'Lajos',    gender: 'male',   born: 1858, died: 1926, gen: 0, note: '', isSelf: false },
  { id: 'zold_maria',        ln: 'Zöld',      fn: 'Mária',    gender: 'female', born: 1880, died: 1952, gen: 0, note: '', isSelf: false },
  { id: 'ver_jozsef',        ln: 'Vér',       fn: 'József',   gender: 'male',   born: 1880, died: 1931, gen: 0, note: '', isSelf: false },
  { id: 'meszaros_ida',      ln: 'Mészáros',  fn: 'Ida',      gender: 'female', born: 1891, died: 1975, gen: 0, note: '', isSelf: false },
  { id: 'dorfinger_jozsef',  ln: 'Dorfinger', fn: 'József',   gender: 'male',   born: 1865, died: 1944, gen: 0, note: '', isSelf: false },
  { id: 'szucs_veronika',    ln: 'Szűcs',     fn: 'Veronika', gender: 'female', born: 1872, died: 1957, gen: 0, note: '', isSelf: false },
  { id: 'tar_istvan',        ln: 'Tar',       fn: 'István',   gender: 'male',   born: null, died: 1971, gen: 0, note: '', isSelf: false },
  { id: 'ughy_iren',         ln: 'Ughy',      fn: 'Irén',     gender: 'female', born: null, died: 1951, gen: 0, note: '', isSelf: false },
  // Gen 1 – Dédnagyszülők
  { id: 'mandli_geza_1906',  ln: 'Mándli',    fn: 'Géza',     gender: 'male',   born: 1906, died: 1973, gen: 1, note: '', isSelf: false },
  { id: 'ver_karolina',      ln: 'Vér',       fn: 'Karolina', gender: 'female', born: 1912, died: 1980, gen: 1, note: '', isSelf: false },
  { id: 'dorfinger_ferenc',  ln: 'Dorfinger', fn: 'Ferenc',   gender: 'male',   born: 1904, died: 1999, gen: 1, note: '', isSelf: false },
  { id: 'tar_erzsebet',      ln: 'Tar',       fn: 'Erzsébet', gender: 'female', born: 1911, died: 2002, gen: 1, note: '', isSelf: false },
  // Gen 2 – Nagyszülők
  { id: 'mandli_geza_1938',  ln: 'Mándli',    fn: 'Géza',     gender: 'male',   born: 1938, died: 2014, gen: 2, note: 'Nagypapa', isSelf: false },
  { id: 'dorfinger_marta',   ln: 'Dorfinger', fn: 'Márta',    gender: 'female', born: 1951, died: null, gen: 2, note: 'Nagymama', isSelf: false },
  // Gen 3 – Szülők
  { id: 'mandli_geza_1980',  ln: 'Mándli',    fn: 'Géza',     gender: 'male',   born: 1980, died: null, gen: 3, note: 'Apa', isSelf: false },
  { id: 'puskas_ella',       ln: 'Puskás',    fn: 'Ella',     gender: 'female', born: 1977, died: null, gen: 3, note: 'Anya', isSelf: false },
  // Gen 4 – Gyermekek
  { id: 'mandli_alex',       ln: 'Mándli',    fn: 'Alex',     gender: 'male',   born: 2013, died: null, gen: 4, note: '', isSelf: false },
  { id: 'mandli_krisztian',  ln: 'Mándli',    fn: 'Krisztián',gender: 'male',   born: 2015, died: null, gen: 4, note: '', isSelf: true },
];

export const DEFAULT_COUPLES = [
  { id: 'c0a', p1: 'mandli_lajos',     p2: 'zold_maria' },
  { id: 'c0b', p1: 'ver_jozsef',       p2: 'meszaros_ida' },
  { id: 'c0c', p1: 'dorfinger_jozsef', p2: 'szucs_veronika' },
  { id: 'c0d', p1: 'tar_istvan',       p2: 'ughy_iren' },
  { id: 'c1a', p1: 'mandli_geza_1906', p2: 'ver_karolina' },
  { id: 'c1b', p1: 'dorfinger_ferenc', p2: 'tar_erzsebet' },
  { id: 'c2a', p1: 'mandli_geza_1938', p2: 'dorfinger_marta' },
  { id: 'c3a', p1: 'mandli_geza_1980', p2: 'puskas_ella' },
];

export const DEFAULT_RELATIONS = [
  { coupleId: 'c0a', childId: 'mandli_geza_1906' },
  { coupleId: 'c0b', childId: 'ver_karolina' },
  { coupleId: 'c0c', childId: 'dorfinger_ferenc' },
  { coupleId: 'c0d', childId: 'tar_erzsebet' },
  { coupleId: 'c1a', childId: 'mandli_geza_1938' },
  { coupleId: 'c1b', childId: 'dorfinger_marta' },
  { coupleId: 'c2a', childId: 'mandli_geza_1980' },
  { coupleId: 'c3a', childId: 'mandli_alex' },
  { coupleId: 'c3a', childId: 'mandli_krisztian' },
];

export const DEFAULT_POSITIONS = {
  'mandli_lajos':     { x: 50,   y: 40 },
  'zold_maria':       { x: 215,  y: 40 },
  'ver_jozsef':       { x: 405,  y: 40 },
  'meszaros_ida':     { x: 570,  y: 40 },
  'dorfinger_jozsef': { x: 930,  y: 40 },
  'szucs_veronika':   { x: 1095, y: 40 },
  'tar_istvan':       { x: 1285, y: 40 },
  'ughy_iren':        { x: 1450, y: 40 },
  'mandli_geza_1906': { x: 228,  y: 240 },
  'ver_karolina':     { x: 393,  y: 240 },
  'dorfinger_ferenc': { x: 1110, y: 240 },
  'tar_erzsebet':     { x: 1275, y: 240 },
  'mandli_geza_1938': { x: 620,  y: 440 },
  'dorfinger_marta':  { x: 785,  y: 440 },
  'mandli_geza_1980': { x: 620,  y: 640 },
  'puskas_ella':      { x: 785,  y: 640 },
  'mandli_alex':      { x: 660,  y: 840 },
  'mandli_krisztian': { x: 825,  y: 840 },
};

export const GEN_LABELS = [
  'Ük-nagyszülők',
  'Dédnagyszülők',
  'Nagyszülők',
  'Szülők',
  'Gyermekek',
  'Unokák',
  'Dédunokák',
  'Ük-unokák',
];

export const CARD_W = 155;
export const CARD_H = 96;

export function personName(p) {
  return `${p.ln} ${p.fn}`;
}

export function calcAge(p) {
  if (p.died && p.born) return { atDeath: p.died - p.born, current: null };
  if (!p.died && p.born) return { atDeath: null, current: new Date().getFullYear() - p.born };
  return { atDeath: null, current: null };
}

export function autoPos(person, allPeople) {
  const sameGen = allPeople.filter(q => q.gen === person.gen);
  const idx = sameGen.findIndex(q => q.id === person.id);
  return { x: 50 + idx * (CARD_W + 20), y: 40 + person.gen * 200 };
}

export function makeId(ln, fn) {
  const normalize = s => s.toLowerCase()
    .replace(/[áàâä]/g, 'a').replace(/[éèê]/g, 'e').replace(/[íì]/g, 'i')
    .replace(/[óöőô]/g, 'o').replace(/[úüűù]/g, 'u').replace(/[^a-z0-9]/g, '_');
  return `${normalize(ln)}_${normalize(fn)}_${Date.now()}`;
}

// ── Auto-layout algorithm ─────────────────────────────────────────────────
export function computeAutoLayout(people, couples, relations) {
  const CW = 155, CGAP = 22, UGAP = 50, VG = 185, Y0 = 50;
  const CW2 = CW * 2 + CGAP;

  const pos = {};

  const parentCoupleOf = {};
  relations.forEach(r => { parentCoupleOf[r.childId] = r.coupleId; });

  const coupleCenterX = (cId) => {
    const c = couples.find(c => c.id === cId);
    if (!c || !pos[c.p1] || !pos[c.p2]) return null;
    return (pos[c.p1].x + pos[c.p2].x + CW) / 2;
  };

  const gens = [...new Set(people.map(p => p.gen))].sort((a, b) => a - b);
  const seenIds = new Set();
  const unitsByGen = {};

  gens.forEach(g => {
    const genPpl = people.filter(p => p.gen === g);
    const units = [];
    genPpl.forEach(p => {
      if (seenIds.has(p.id)) return;
      const c = couples.find(c => c.p1 === p.id || c.p2 === p.id);
      if (c) {
        const other = c.p1 === p.id ? c.p2 : c.p1;
        if (genPpl.find(q => q.id === other) && !seenIds.has(other)) {
          units.push({ cId: c.id, ids: [p.id, other] });
          seenIds.add(p.id); seenIds.add(other);
          return;
        }
      }
      units.push({ cId: null, ids: [p.id] });
      seenIds.add(p.id);
    });
    unitsByGen[g] = units;
  });

  gens.forEach(g => {
    const units = unitsByGen[g];
    const y = Y0 + g * VG;
    const widths = units.map(u => u.ids.length === 2 ? CW2 : CW);

    const ideals = units.map(u => {
      const parentXs = u.ids
        .map(id => parentCoupleOf[id])
        .filter(Boolean)
        .map(pcId => coupleCenterX(pcId))
        .filter(x => x !== null);
      if (!parentXs.length) return null;
      return parentXs.reduce((a, b) => a + b, 0) / parentXs.length;
    });

    if (ideals.every(x => x === null)) {
      let x = 60;
      units.forEach((u, i) => {
        const w = widths[i];
        if (u.ids.length === 2) {
          pos[u.ids[0]] = { x, y };
          pos[u.ids[1]] = { x: x + CW + CGAP, y };
        } else {
          pos[u.ids[0]] = { x, y };
        }
        x += w + UGAP;
      });
      return;
    }

    const items = units.map((u, i) => ({ u, ideal: ideals[i], w: widths[i] }))
      .sort((a, b) => {
        if (a.ideal === null && b.ideal === null) return 0;
        if (a.ideal === null) return 1;
        if (b.ideal === null) return -1;
        return a.ideal - b.ideal;
      });

    const groups = [];
    let gi = 0;
    while (gi < items.length) {
      let gj = gi;
      while (gj + 1 < items.length &&
             items[gj + 1].ideal !== null &&
             Math.abs(items[gj + 1].ideal - items[gi].ideal) < 5) gj++;
      const grp = items.slice(gi, gj + 1);
      const grpW = grp.reduce((s, it) => s + it.w, 0) + (grp.length - 1) * UGAP;
      groups.push({ grp, grpW, ideal: grp[0].ideal });
      gi = gj + 1;
    }

    let cursor = null;
    groups.forEach(({ grp, grpW, ideal }) => {
      const wantLeft = ideal !== null ? ideal - grpW / 2 : (cursor ?? 60);
      const startX = cursor !== null ? Math.max(wantLeft, cursor) : Math.max(wantLeft, 60);
      let x = startX;
      grp.forEach(({ u }) => {
        const w = u.ids.length === 2 ? CW2 : CW;
        if (u.ids.length === 2) {
          pos[u.ids[0]] = { x, y };
          pos[u.ids[1]] = { x: x + CW + CGAP, y };
        } else {
          pos[u.ids[0]] = { x, y };
        }
        x += w + UGAP;
      });
      cursor = startX + grpW + UGAP;
    });
  });

  const allX = Object.values(pos).map(p => p.x);
  const minX = Math.min(...allX);
  if (minX < 60) {
    const d = 60 - minX;
    Object.keys(pos).forEach(id => pos[id] = { ...pos[id], x: pos[id].x + d });
  }

  return pos;
}

// ── CSV export ────────────────────────────────────────────────────────────
export function exportToCSV(people, couples, relations) {
  const GEN_NAMES = ['Ük-nagyszülők','Dédnagyszülők','Nagyszülők','Szülők','Gyermekek','Unokák','Dédunokák','Ük-unokák'];
  const memberOf = {};
  couples.forEach(c => { memberOf[c.p1] = c.id; memberOf[c.p2] = c.id; });
  const parentCoupleOf = {};
  relations.forEach(r => { parentCoupleOf[r.childId] = r.coupleId; });

  const headers = ['Vezetéknév','Keresztnév','Nem','Születési év','Halálozási év',
    'Elhunytkor','Jelenlegi kor','Generáció szint','Generáció neve',
    'Házastárs','Szülők','Megjegyzés','Én vagyok'];

  const rows = people.map(p => {
    const atDeath = p.born && p.died ? p.died - p.born : '';
    const currentAge = !p.died && p.born ? new Date().getFullYear() - p.born : '';
    const cId = memberOf[p.id];
    const couple = cId ? couples.find(c => c.id === cId) : null;
    const spouseId = couple ? (couple.p1 === p.id ? couple.p2 : couple.p1) : null;
    const spouse = spouseId ? people.find(q => q.id === spouseId) : null;
    const spouseName = spouse ? `${spouse.ln} ${spouse.fn}` : '';
    const pcId = parentCoupleOf[p.id];
    const pc = pcId ? couples.find(c => c.id === pcId) : null;
    const pa = pc ? people.find(q => q.id === pc.p1) : null;
    const pb = pc ? people.find(q => q.id === pc.p2) : null;
    const parents = pa && pb ? `${pa.ln} ${pa.fn} + ${pb.ln} ${pb.fn}` : '';
    return [p.ln, p.fn, p.gender==='male'?'Férfi':'Nő', p.born??'', p.died??'',
            atDeath, currentAge, p.gen, GEN_NAMES[p.gen]??'', spouseName, parents, p.note??'', p.isSelf ? 'Igen' : ''];
  });

  const csv = [headers, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `csaladfa_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}
