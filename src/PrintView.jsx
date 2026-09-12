import { CARD_W, CARD_H, GEN_LABELS, calcAge } from './data';

const CW = CARD_W;
const CH = CARD_H;

function splitName(name) {
  if (name.length <= 17) return [name];
  const mid = name.lastIndexOf(' ', 17);
  return mid > 0 ? [name.slice(0, mid), name.slice(mid + 1)] : [name.slice(0, 17), name.slice(17)];
}

function CardSVG({ person, pos, templateMode }) {
  const isDead = !!person.died;
  const isMale = person.gender === 'male';
  const fill   = isMale ? '#e8f2fb' : '#fbedf0';
  const stroke = isMale ? '#4a7ba7' : '#b06070';
  const topBar = isMale ? '#2a5a8a' : '#8a3050';
  const { atDeath, current } = calcAge(person);
  const nameParts = splitName(`${person.ln} ${person.fn}`);
  const datesStr  = [person.born ? `* ${person.born}` : '', person.died ? `† ${person.died}` : ''].filter(Boolean).join('   ') || '—';
  const twoLine   = nameParts.length > 1;

  return (
    <g>
      {/* Shadow */}
      <rect x={pos.x + 2} y={pos.y + 2} width={CW} height={CH} rx={9} fill="rgba(0,0,0,.08)" />
      {/* Card bg */}
      <rect x={pos.x} y={pos.y} width={CW} height={CH} rx={9} fill={fill}
        stroke={stroke} strokeWidth={isDead ? 1.5 : 2}
        strokeDasharray={isDead ? '6 3' : 'none'} />
      {/* Self: double outer ring */}
      {person.isSelf && (
        <rect x={pos.x - 3} y={pos.y - 3} width={CW + 6} height={CH + 6} rx={12}
          fill="none" stroke="#c8a96e" strokeWidth={2.5} />
      )}
      {/* Top stripe */}
      <rect x={pos.x} y={pos.y} width={CW} height={5} rx={9} fill={topBar} />
      <rect x={pos.x} y={pos.y + 2} width={CW} height={3} fill={topBar} />

      {templateMode ? (
        <>
          <text x={pos.x + CW / 2} y={pos.y + 20} textAnchor="middle" fontSize={12} fill={stroke} opacity={0.4}>
            {isMale ? '♂' : '♀'}
          </text>
          <text x={pos.x + 8} y={pos.y + 38} fontSize={7.5} fill="#bbb">Név</text>
          <line x1={pos.x + 28} y1={pos.y + 37} x2={pos.x + CW - 7} y2={pos.y + 37} stroke="#bbb" strokeWidth={0.8} />
          <text x={pos.x + 8} y={pos.y + 55} fontSize={7.5} fill="#bbb">* Sz.</text>
          <line x1={pos.x + 30} y1={pos.y + 54} x2={pos.x + CW - 7} y2={pos.y + 54} stroke="#bbb" strokeWidth={0.8} />
          <text x={pos.x + 8} y={pos.y + 72} fontSize={7.5} fill="#bbb">† Hal.</text>
          <line x1={pos.x + 32} y1={pos.y + 71} x2={pos.x + CW - 7} y2={pos.y + 71} stroke="#bbb" strokeWidth={0.8} />
          {person.note && <text x={pos.x + CW / 2} y={pos.y + CH - 5} textAnchor="middle" fontSize={7} fill="#ccc" fontStyle="italic">{person.note}</text>}
        </>
      ) : (
        <>
          <text x={pos.x + CW / 2} y={pos.y + 18} textAnchor="middle" fontSize={11} fill={stroke}>{isMale ? '♂' : '♀'}</text>
          {twoLine ? (
            <>
              <text x={pos.x + CW / 2} y={pos.y + 30} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#111" fontFamily="Georgia,serif">{nameParts[0]}</text>
              <text x={pos.x + CW / 2} y={pos.y + 42} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#111" fontFamily="Georgia,serif">{nameParts[1]}</text>
            </>
          ) : (
            <text x={pos.x + CW / 2} y={pos.y + 34} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#111" fontFamily="Georgia,serif">{nameParts[0]}</text>
          )}
          <text x={pos.x + CW / 2} y={pos.y + (twoLine ? 55 : 50)} textAnchor="middle" fontSize={10} fill="#555" fontFamily="Georgia,serif">{datesStr}</text>
          {isDead && atDeath && (
            <text x={pos.x + CW / 2} y={pos.y + (twoLine ? 68 : 64)} textAnchor="middle" fontSize={9} fill="#888" fontStyle="italic" fontFamily="Georgia,serif">({atDeath} éves korában)</text>
          )}
          {!isDead && current && (
            <text x={pos.x + CW / 2} y={pos.y + (twoLine ? 68 : 64)} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#2e7d32" fontFamily="Georgia,serif">jelenleg {current} éves</text>
          )}
          {person.note && <text x={pos.x + CW / 2} y={pos.y + CH - 5} textAnchor="middle" fontSize={8} fill="#aaa" fontStyle="italic">{person.note}</text>}
          {/* Self badge */}
          {person.isSelf && (
            <>
              <rect x={pos.x + CW - 28} y={pos.y + 7} width={24} height={12} rx={5} fill="#c8a96e" />
              <text x={pos.x + CW - 16} y={pos.y + 16.5} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#fff" fontFamily="Arial,sans-serif">★ Én</text>
            </>
          )}
        </>
      )}
    </g>
  );
}

export default function PrintView({ people, couples, relations, positions, templateMode, title }) {
  let maxX = 400, maxY = 400;
  Object.values(positions).forEach(p => {
    maxX = Math.max(maxX, p.x + CW + 50);
    maxY = Math.max(maxY, p.y + CH + 50);
  });

  // ── Connections ───────────────────────────────────────────────────────────
  const connLines = [];

  couples.forEach(c => {
    const p1 = positions[c.p1], p2 = positions[c.p2];
    if (!p1 || !p2) return;
    const leftX  = Math.min(p1.x + CW, p2.x + CW);
    const rightX = Math.max(p1.x, p2.x);
    const midY   = (p1.y + p2.y) / 2 + CH / 2;
    const midX   = (leftX + rightX) / 2;
    connLines.push(
      <g key={`sp-${c.id}`}>
        <line x1={leftX} y1={midY} x2={rightX} y2={midY} stroke="#9a7030" strokeWidth={2.5} strokeDasharray="7 4" />
        <circle cx={midX} cy={midY} r={8} fill="#fff9ee" stroke="#9a7030" strokeWidth={1.5} />
        <text x={midX} y={midY + 4.5} textAnchor="middle" fontSize={10} fill="#9a7030">♥</text>
      </g>
    );
  });

  relations.forEach(rel => {
    const couple = couples.find(c => c.id === rel.coupleId);
    if (!couple) return;
    const p1 = positions[couple.p1], p2 = positions[couple.p2], ch = positions[rel.childId];
    if (!p1 || !p2 || !ch) return;
    const fromX = (p1.x + p2.x + CW) / 2;
    const fromY = Math.max(p1.y, p2.y) + CH;
    const toX   = ch.x + CW / 2;
    const toY   = ch.y;
    const cp1Y  = fromY + (toY - fromY) * 0.4;
    const cp2Y  = toY   - (toY - fromY) * 0.4;
    connLines.push(
      <path key={`rel-${rel.coupleId}-${rel.childId}`}
        d={`M ${fromX} ${fromY} C ${fromX} ${cp1Y}, ${toX} ${cp2Y}, ${toX} ${toY}`}
        stroke="#5a2800" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    );
  });

  // ── Gen labels ─────────────────────────────────────────────────────────────
  const genLabels = [...new Set(people.map(p => p.gen))].sort().map(g => {
    const yMin = people.filter(p => p.gen === g)
      .reduce((mn, p) => { const pos = positions[p.id]; return pos ? Math.min(mn, pos.y) : mn; }, 9999);
    return (
      <text key={g} x={5} y={yMin + CH / 2 + 4} fontSize={9} fill="#c8b890" fontStyle="italic" fontFamily="Georgia,serif">
        {GEN_LABELS[g] ?? `Gen ${g}`}
      </text>
    );
  });

  return (
    <div className="print-view">
      <svg
        viewBox={`0 0 ${maxX} ${maxY}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <rect x={0} y={0} width={maxX} height={maxY} fill="white" />
        {title && (
          <text x={maxX / 2} y={22} textAnchor="middle" fontSize={16} fontWeight="bold"
            fill="#4a2f1a" fontFamily="Georgia,serif" fontStyle="italic">{title}</text>
        )}
        {genLabels}
        {connLines}
        {people.map(p => {
          const pos = positions[p.id];
          if (!pos) return null;
          return <CardSVG key={p.id} person={p} pos={pos} templateMode={templateMode} />;
        })}
      </svg>
    </div>
  );
}
