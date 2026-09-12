import { useMemo } from 'react';
import { personName, calcAge } from './data';

// Radii for each generation ring: [self_outer, ring1_outer, ...]
const RADII = [46, 100, 170, 254, 364];

// Fan center is at bottom-center of SVG
const W = 920, H = 550;
const CX = W / 2, CY = H - 18;

function pt(r, aDeg) {
  const rad = aDeg * Math.PI / 180;
  return [CX - r * Math.cos(rad), CY - r * Math.sin(rad)];
}

function sectorPath(rIn, rOut, a1Deg, a2Deg) {
  const gap = 0.65;
  const s1 = a1Deg + gap, s2 = a2Deg - gap;
  if (s1 >= s2 || rIn < 1) return '';
  const [x1,y1] = pt(rIn,s1), [x2,y2] = pt(rIn,s2);
  const [x3,y3] = pt(rOut,s2),[x4,y4] = pt(rOut,s1);
  const large = (s2-s1) > 180 ? 1 : 0;
  return `M${x1} ${y1} A${rIn} ${rIn} 0 ${large} 0 ${x2} ${y2} L${x3} ${y3} A${rOut} ${rOut} 0 ${large} 1 ${x4} ${y4}Z`;
}

function buildTree(rootId, people, couples, relations, maxD) {
  const byId = Object.fromEntries(people.map(p => [p.id, p]));
  const pcOf = {};
  relations.forEach(r => { pcOf[r.childId] = r.coupleId; });
  const cById = Object.fromEntries(couples.map(c => [c.id, c]));
  const tree = {};

  function visit(pid, d, pos) {
    if (d > maxD || !pid || !byId[pid]) return;
    (tree[d] = tree[d] || {})[pos] = pid;
    const c = cById[pcOf[pid]];
    if (!c) return;
    const p1 = byId[c.p1];
    const fId = p1?.gender !== 'female' ? c.p1 : c.p2;
    const mId = fId === c.p1 ? c.p2 : c.p1;
    visit(fId, d+1, 2*pos);
    visit(mId, d+1, 2*pos+1);
  }
  visit(rootId, 0, 0);
  return tree;
}

// Per-depth fills (male/female), light-theme optimised
const FM = ['','#c8dff8','#b0ccf0','#98b8e8','#80a4d8'];
const FF = ['','#f8d0e4','#f0b8d4','#e8a0c0','#dc88ac'];
const FE = ['','rgba(200,200,200,.18)','rgba(200,200,200,.13)','rgba(200,200,200,.1)','rgba(200,200,200,.08)'];

function Sector({ d, pos, person, isDark }) {
  const total = Math.pow(2, d);
  const a1 = 180 * pos / total;
  const a2 = 180 * (pos + 1) / total;
  const aMid = (a1 + a2) / 2;
  const rIn  = RADII[d - 1];
  const rOut = RADII[d];
  const [tx, ty] = pt((rIn + rOut) / 2, aMid);

  // text rotation: runs along the arc (tangent direction)
  const rot = aMid - 90;

  const fill = !person
    ? (isDark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.04)')
    : (person.gender === 'male'
        ? (isDark ? 'rgba(80,140,220,.25)' : FM[d])
        : (isDark ? 'rgba(220,80,140,.22)' : FF[d]));

  const opacity = person?.died ? 0.72 : 1;
  const strokeColor = isDark ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.7)';

  const path = sectorPath(rIn, rOut, a1, a2);
  if (!path) return null;

  const fontSize = d === 1 ? 10.5 : d === 2 ? 9 : d === 3 ? 7.5 : 6.2;
  const textFill = isDark ? '#e0e8f0' : '#1a1a1a';
  const subFill  = isDark ? '#a0b0c0' : '#444';

  const name  = person ? personName(person) : '';
  const born  = person?.born;
  const died  = person?.died;
  const dates = [born ? `*${born}` : '', died ? `†${died}` : ''].filter(Boolean).join(' ');

  return (
    <g opacity={opacity}>
      <path d={path} fill={fill} stroke={strokeColor} strokeWidth={0.8} />
      {person && (
        <g transform={`translate(${tx.toFixed(1)},${ty.toFixed(1)}) rotate(${rot.toFixed(1)})`}>
          <text textAnchor="middle" dy={d <= 2 ? '-1' : '0.35em'}
            fontSize={fontSize} fontWeight="bold" fontFamily="Georgia,serif" fill={textFill}>
            {name}
          </text>
          {d <= 2 && dates && (
            <text textAnchor="middle" dy={fontSize + 2} fontSize={fontSize - 1.5}
              fontFamily="Georgia,serif" fill={subFill}>{dates}</text>
          )}
        </g>
      )}
    </g>
  );
}

export default function FanView({ people, couples, relations, title, isDark }) {
  const selfPerson = useMemo(() =>
    people.find(p => p.isSelf)
    ?? [...people].sort((a,b)=>(b.born??0)-(a.born??0))[0]
  , [people]);

  const tree = useMemo(() =>
    selfPerson ? buildTree(selfPerson.id, people, couples, relations, 4) : {}
  , [selfPerson, people, couples, relations]);

  if (!selfPerson) return null;

  const { current: selfAge } = calcAge(selfPerson);
  const bgFill = isDark ? '#04040e' : '#faf4e8';
  const selfFill = selfPerson.gender === 'female'
    ? (isDark ? '#5a2030' : '#f4c0d0')
    : (isDark ? '#0a2040' : '#b8d8f0');
  const genLabels = ['Szülők','Nagyszülők','Dédszülők','Ük-szülők'];

  // Build all sectors including empty slots
  const sectorEls = [];
  for (let d = 1; d <= 4; d++) {
    const total = Math.pow(2, d);
    for (let pos = 0; pos < total; pos++) {
      const pid = tree[d]?.[pos];
      const person = pid ? people.find(p => p.id === pid) : null;
      sectorEls.push(
        <Sector key={`${d}-${pos}`} d={d} pos={pos} person={person} isDark={isDark} />
      );
    }
  }

  return (
    <div className="fan-wrap">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
        style={{ display:'block', maxHeight:'calc(100vh - 128px)', background: bgFill }}>

        {/* Ring separator arcs */}
        {RADII.map((r, i) => {
          const [lx,ly] = pt(r, 0), [rx,ry] = pt(r, 180);
          return (
            <path key={i} d={`M${lx} ${ly} A${r} ${r} 0 0 0 ${rx} ${ry}`}
              fill="none" stroke={isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)'}
              strokeWidth={1} />
          );
        })}

        {/* Spoke separator lines */}
        {[1,2,3,4].map(d => {
          const total = Math.pow(2, d);
          return Array.from({length: total + 1}, (_, i) => {
            const aDeg = 180 * i / total;
            const [ox,oy] = pt(RADII[d-1], aDeg);
            const [ix,iy] = pt(RADII[d],   aDeg);
            return (
              <line key={`${d}-${i}`} x1={ox} y1={oy} x2={ix} y2={iy}
                stroke={isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)'}
                strokeWidth={0.6} />
            );
          });
        })}

        {/* Sectors */}
        {sectorEls}

        {/* Self center circle */}
        <circle cx={CX} cy={CY} r={RADII[0] - 1}
          fill={selfFill} stroke="#c8a96e" strokeWidth={2.5} />
        {selfPerson.isSelf && (
          <circle cx={CX} cy={CY} r={RADII[0] + 5}
            fill="none" stroke="#c8a96e" strokeWidth={1.8} strokeDasharray="5 3" opacity={0.55}/>
        )}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize={10.5} fontWeight="bold"
          fontFamily="Georgia,serif" fill={isDark ? '#e8f0f8' : '#1a1a1a'}>
          {personName(selfPerson)}
        </text>
        <text x={CX} y={CY + 8} textAnchor="middle" fontSize={8.5}
          fontFamily="Georgia,serif" fill={isDark ? '#a0b8cc' : '#444'}>
          {selfPerson.born ?? '?'}
          {!selfPerson.died && selfAge ? ` (${selfAge} é.)` : selfPerson.died ? `–${selfPerson.died}` : ''}
        </text>

        {/* Generation ring labels at top */}
        {[1,2,3,4].map(d => {
          if (!tree[d] || !Object.keys(tree[d]).length) return null;
          const [lx,ly] = pt((RADII[d-1] + RADII[d]) / 2, 90);
          return (
            <text key={d} x={lx} y={ly + 3} textAnchor="middle" fontSize={7}
              fontFamily="Georgia,serif"
              fill={isDark ? 'rgba(200,200,200,.3)' : 'rgba(0,0,0,.2)'}
              fontStyle="italic">{genLabels[d-1]}</text>
          );
        })}

        {/* Decorative tree at base */}
        <g transform={`translate(${CX},${CY})`} opacity={isDark ? 0.12 : 0.15}>
          <rect x="-3" y="2" width="6" height="20" rx="2" fill="#5a3010"/>
          <line x1="0" y1="8" x2="-16" y2="-2" stroke="#5a3010" strokeWidth="2.5"/>
          <line x1="0" y1="8" x2="16" y2="-2" stroke="#5a3010" strokeWidth="2.5"/>
          <circle cx="0" cy="-10" r="16" fill="#2a6018"/>
          <circle cx="-11" cy="-5" r="12" fill="#387025"/>
          <circle cx="11" cy="-5" r="12" fill="#387025"/>
          <circle cx="0" cy="-22" r="11" fill="#387025"/>
        </g>

        {/* Title */}
        <text x={CX} y={20} textAnchor="middle" fontSize={12} fontWeight="bold"
          fontFamily="Georgia,serif" fontStyle="italic"
          fill={isDark ? 'rgba(200,168,80,.5)' : 'rgba(100,60,20,.4)'}>
          {title ?? 'Legyező'}
        </text>
      </svg>
    </div>
  );
}
