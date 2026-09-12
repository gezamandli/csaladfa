import { useMemo } from 'react';
import { personName, calcAge } from './data';

const RADII = [50, 110, 188, 286, 438];
const W = 900, H = 626;
const CX = W / 2, CY = H - 14;

function pt(r, aDeg) {
  const rad = aDeg * Math.PI / 180;
  return [CX - r * Math.cos(rad), CY - r * Math.sin(rad)];
}

function sectorPath(rIn, rOut, a1Deg, a2Deg) {
  const gap = 0.65;
  const s1 = a1Deg + gap, s2 = a2Deg - gap;
  if (s1 >= s2 || rIn < 1) return '';
  const [x1,y1] = pt(rIn,s1),  [x2,y2] = pt(rIn,s2);
  const [x3,y3] = pt(rOut,s2), [x4,y4] = pt(rOut,s1);
  const large = (s2-s1) > 180 ? 1 : 0;
  return `M${x1} ${y1} A${rIn} ${rIn} 0 ${large} 0 ${x2} ${y2} L${x3} ${y3} A${rOut} ${rOut} 0 ${large} 1 ${x4} ${y4}Z`;
}

function buildTree(rootId, people, couples, relations, maxD) {
  const byId  = Object.fromEntries(people.map(p => [p.id, p]));
  const pcOf  = {};
  relations.forEach(r => { pcOf[r.childId] = r.coupleId; });
  const cById = Object.fromEntries(couples.map(c => [c.id, c]));
  const tree  = {};

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

const FM = ['','#c8dff8','#b0ccf0','#98b8e8','#80a4d8'];
const FF = ['','#f8d0e4','#f0b8d4','#e8a0c0','#dc88ac'];

function Sector({ d, pos, person, isDark, templateMode }) {
  const total  = Math.pow(2, d);
  const a1     = 180 * pos / total;
  const a2     = 180 * (pos + 1) / total;
  const aMid   = (a1 + a2) / 2;
  const rIn    = RADII[d - 1];
  const rOut   = RADII[d];
  const rMid   = (rIn + rOut) / 2;
  const [tx, ty] = pt(rMid, aMid);
  const rot    = aMid - 90;

  // arc length at mid-radius → used for line widths in template mode
  const arcLen = rMid * (a2 - a1) * Math.PI / 180;
  const lineW  = arcLen * 0.72;

  const fill = !person
    ? (isDark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.04)')
    : (person.gender === 'male'
        ? (isDark ? 'rgba(80,140,220,.25)' : FM[d])
        : (isDark ? 'rgba(220,80,140,.22)' : FF[d]));

  const opacity     = !templateMode && person?.died ? 0.72 : 1;
  const strokeColor = isDark ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.7)';
  const path        = sectorPath(rIn, rOut, a1, a2);
  if (!path) return null;

  const fontSize = d === 1 ? 10.5 : d === 2 ? 9 : d === 3 ? 7.5 : 6.2;
  const textFill = isDark ? '#e0e8f0' : '#1a1a1a';
  const subFill  = isDark ? '#a0b0c0' : '#555';
  const lineClr  = isDark ? 'rgba(200,220,255,.35)' : 'rgba(0,0,0,.28)';

  const name  = person ? personName(person) : '';
  const dates = person
    ? [person.born ? `*${person.born}` : '', person.died ? `†${person.died}` : ''].filter(Boolean).join(' ')
    : '';

  return (
    <g opacity={opacity}>
      <path d={path} fill={fill} stroke={strokeColor} strokeWidth={0.8} />

      {templateMode ? (
        /* ── Template: blank writing lines ── */
        <g transform={`translate(${tx.toFixed(1)},${ty.toFixed(1)}) rotate(${rot.toFixed(1)})`}>
          {/* Name line */}
          <line x1={-lineW/2} y1={-2.5} x2={lineW/2} y2={-2.5}
            stroke={lineClr} strokeWidth={0.9} />
          {/* Date line (shorter) */}
          {d <= 3 && (
            <line x1={-lineW * 0.38} y1={fontSize + 1} x2={lineW * 0.38} y2={fontSize + 1}
              stroke={lineClr} strokeWidth={0.8} />
          )}
        </g>
      ) : person ? (
        /* ── Normal: name + dates ── */
        <g transform={`translate(${tx.toFixed(1)},${ty.toFixed(1)}) rotate(${rot.toFixed(1)})`}>
          <text textAnchor="middle" dy={dates ? '-1.5' : '0.35em'}
            fontSize={fontSize} fontWeight="bold" fontFamily="Georgia,serif" fill={textFill}>
            {name}
          </text>
          {dates && (
            <text textAnchor="middle" dy={fontSize + 2} fontSize={fontSize * 0.82}
              fontFamily="Georgia,serif" fill={subFill}>
              {dates}
            </text>
          )}
        </g>
      ) : null}
    </g>
  );
}

export default function FanView({ people, couples, relations, title, isDark, templateMode }) {
  const selfPerson = useMemo(() =>
    people.find(p => p.isSelf)
    ?? [...people].sort((a,b) => (b.born??0) - (a.born??0))[0]
  , [people]);

  const tree = useMemo(() =>
    selfPerson ? buildTree(selfPerson.id, people, couples, relations, 4) : {}
  , [selfPerson, people, couples, relations]);

  if (!selfPerson) return null;

  const { current: selfAge } = calcAge(selfPerson);
  const bgFill   = isDark ? '#04040e' : '#faf4e8';
  const selfFill = selfPerson.gender === 'female'
    ? (isDark ? '#5a2030' : '#f4c0d0')
    : (isDark ? '#0a2040' : '#b8d8f0');
  const genLabels = ['Szülők','Nagyszülők','Dédszülők','Ük-szülők'];

  const sectorEls = [];
  for (let d = 1; d <= 4; d++) {
    const total = Math.pow(2, d);
    for (let pos = 0; pos < total; pos++) {
      const pid    = tree[d]?.[pos];
      const person = pid ? people.find(p => p.id === pid) : null;
      // In template mode, render ALL slots (even empty ones) so they all have lines
      if (!templateMode && !person) {
        // empty: faint shell only
        const path = sectorPath(RADII[d-1], RADII[d], 180*pos/total, 180*(pos+1)/total);
        if (path) sectorEls.push(
          <path key={`e-${d}-${pos}`} d={path}
            fill={isDark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.03)'}
            stroke={isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'} strokeWidth={0.7} />
        );
        continue;
      }
      sectorEls.push(
        <Sector key={`s-${d}-${pos}`} d={d} pos={pos}
          person={person} isDark={isDark} templateMode={templateMode} />
      );
    }
  }

  return (
    <div className="fan-wrap">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        style={{ display:'block', maxHeight:'calc(100vh - 128px)', background: bgFill }}>

        {/* Ring arcs */}
        {RADII.map((r, i) => {
          const [lx,ly] = pt(r, 0), [rx,ry] = pt(r, 180);
          return (
            <path key={i} d={`M${lx} ${ly} A${r} ${r} 0 0 0 ${rx} ${ry}`}
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.09)'}
              strokeWidth={1} />
          );
        })}

        {/* Spoke lines */}
        {[1,2,3,4].map(d =>
          Array.from({length: Math.pow(2,d) + 1}, (_,i) => {
            const aDeg = 180 * i / Math.pow(2, d);
            const [ox,oy] = pt(RADII[d-1], aDeg);
            const [ix,iy] = pt(RADII[d],   aDeg);
            return (
              <line key={`${d}-${i}`} x1={ox} y1={oy} x2={ix} y2={iy}
                stroke={isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)'}
                strokeWidth={0.6} />
            );
          })
        )}

        {sectorEls}

        {/* Self center circle */}
        <circle cx={CX} cy={CY} r={RADII[0] - 1}
          fill={selfFill} stroke="#c8a96e" strokeWidth={2.5} />
        {selfPerson.isSelf && !templateMode && (
          <circle cx={CX} cy={CY} r={RADII[0] + 5}
            fill="none" stroke="#c8a96e" strokeWidth={1.8} strokeDasharray="5 3" opacity={0.55}/>
        )}
        {templateMode ? (
          <>
            <line x1={CX - 28} y1={CY - 5} x2={CX + 28} y2={CY - 5}
              stroke={isDark ? 'rgba(200,220,255,.4)' : 'rgba(0,0,0,.3)'} strokeWidth={1}/>
            <line x1={CX - 18} y1={CY + 8} x2={CX + 18} y2={CY + 8}
              stroke={isDark ? 'rgba(200,220,255,.3)' : 'rgba(0,0,0,.25)'} strokeWidth={0.8}/>
          </>
        ) : (
          <>
            <text x={CX} y={CY - 6} textAnchor="middle" fontSize={10.5} fontWeight="bold"
              fontFamily="Georgia,serif" fill={isDark ? '#e8f0f8' : '#1a1a1a'}>
              {personName(selfPerson)}
            </text>
            <text x={CX} y={CY + 8} textAnchor="middle" fontSize={8.5}
              fontFamily="Georgia,serif" fill={isDark ? '#a0b8cc' : '#444'}>
              {selfPerson.born ?? '?'}
              {!selfPerson.died && selfAge ? ` (${selfAge} é.)` : selfPerson.died ? `–${selfPerson.died}` : ''}
            </text>
          </>
        )}

        {/* Gen labels at top of each ring */}
        {[1,2,3,4].map(d => {
          const [lx,ly] = pt((RADII[d-1] + RADII[d]) / 2, 90);
          return (
            <text key={d} x={lx} y={ly+3} textAnchor="middle" fontSize={7}
              fontFamily="Georgia,serif"
              fill={isDark ? 'rgba(200,200,200,.28)' : 'rgba(0,0,0,.2)'}
              fontStyle="italic">{genLabels[d-1]}</text>
          );
        })}

        {/* Decorative tree */}
        <g transform={`translate(${CX},${CY})`} opacity={isDark ? 0.1 : 0.14}>
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
          fill={isDark ? 'rgba(200,168,80,.45)' : 'rgba(100,60,20,.35)'}>
          {title ?? 'Legyező'}
        </text>
      </svg>
    </div>
  );
}
