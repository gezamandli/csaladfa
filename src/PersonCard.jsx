import { useRef } from 'react';
import { CARD_W, personName, calcAge } from './data';

function TemplateContent({ gender }) {
  const icon = gender === 'male' ? '♂' : '♀';
  return (
    <div className="tpl-body">
      <div className="tpl-gender">{icon}</div>
      <div className="tpl-row">
        <span className="tpl-label">Név</span>
        <div className="tpl-line" />
      </div>
      <div className="tpl-row">
        <span className="tpl-label">* Születés</span>
        <div className="tpl-line short" />
      </div>
      <div className="tpl-row">
        <span className="tpl-label">† Halál</span>
        <div className="tpl-line short" />
      </div>
    </div>
  );
}

export default function PersonCard({ person, position, onMove, onEdit, templateMode }) {
  const { atDeath, current } = calcAge(person);
  const isDead = !!person.died;
  const genderIcon = person.gender === 'male' ? '♂' : '♀';

  const handleMouseDown = (e) => {
    if (templateMode) return;
    if (e.target.closest('.card-actions')) return;
    e.preventDefault();
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;
    const move = (mv) => onMove(person.id, mv.clientX - startX, mv.clientY - startY);
    const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={[
        'card',
        person.gender,
        isDead ? 'deceased' : '',
        templateMode ? 'template-mode' : '',
        person.isSelf ? 'self-card' : '',
      ].filter(Boolean).join(' ')}
      style={{ left: position.x, top: position.y, width: CARD_W }}
    >
      {person.isSelf && !templateMode && (
        <div className="self-badge">★ Én</div>
      )}
      {templateMode ? (
        <TemplateContent gender={person.gender} />
      ) : (
        <>
          <div className="card-gender">{genderIcon}</div>
          <div className="card-name">{personName(person)}</div>
          <div className="card-dates">
            {person.born  ? `* ${person.born}`  : ''}
            {person.born && person.died ? '  ' : ''}
            {person.died  ? `† ${person.died}`  : ''}
            {!person.born && !person.died ? '—' : ''}
          </div>
          {isDead && atDeath && <div className="card-age">({atDeath} éves korában)</div>}
          {!isDead && current && <div className="card-age card-age--live">jelenleg {current} éves</div>}
          {person.note && <div className="card-note">{person.note}</div>}
          <div className="card-actions">
            <button onClick={() => onEdit(person.id)}>✏️ szerkesztés</button>
          </div>
        </>
      )}
    </div>
  );
}
