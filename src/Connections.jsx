import { CARD_W, CARD_H } from './data';

export default function Connections({ couples, relations, positions }) {
  const lines = [];

  // Spouse lines
  couples.forEach(c => {
    const p1 = positions[c.p1];
    const p2 = positions[c.p2];
    if (!p1 || !p2) return;

    const leftX  = Math.min(p1.x + CARD_W, p2.x + CARD_W);
    const rightX = Math.max(p1.x, p2.x);
    const midY   = (p1.y + p2.y) / 2 + CARD_H / 2;
    const midX   = (leftX + rightX) / 2;

    lines.push(
      <g key={`sp-${c.id}`}>
        <line x1={leftX} y1={midY} x2={rightX} y2={midY}
          stroke="#9a7030" strokeWidth={2.5} strokeDasharray="7 4" />
        <circle cx={midX} cy={midY} r={9}
          fill="#fdf4e0" stroke="#9a7030" strokeWidth={2} />
        <text x={midX} y={midY + 5} textAnchor="middle" fontSize={11} fill="#9a7030">♥</text>
      </g>
    );
  });

  // Parent → child curves
  relations.forEach(rel => {
    const couple = couples.find(c => c.id === rel.coupleId);
    if (!couple) return;
    const p1 = positions[couple.p1];
    const p2 = positions[couple.p2];
    const ch  = positions[rel.childId];
    if (!p1 || !p2 || !ch) return;

    const fromX = (p1.x + p2.x + CARD_W) / 2;
    const fromY = Math.max(p1.y, p2.y) + CARD_H;
    const toX   = ch.x + CARD_W / 2;
    const toY   = ch.y;
    const cp1Y  = fromY + (toY - fromY) * 0.42;
    const cp2Y  = toY   - (toY - fromY) * 0.42;

    lines.push(
      <path
        key={`rel-${rel.coupleId}-${rel.childId}`}
        d={`M ${fromX} ${fromY} C ${fromX} ${cp1Y}, ${toX} ${cp2Y}, ${toX} ${toY}`}
        stroke="#5a2800"
        strokeWidth={2.2}
        fill="none"
        strokeLinecap="round"
      />
    );
  });

  return <>{lines}</>;
}
