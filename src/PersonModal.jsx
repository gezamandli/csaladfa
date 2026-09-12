import { useState, useEffect } from 'react';
import { personName } from './data';

const GEN_OPTIONS = [
  { value: 0, label: '0 – Ük-nagyszülők (legrégebbi ismert ősök)' },
  { value: 1, label: '1 – Dédnagyszülők' },
  { value: 2, label: '2 – Nagyszülők' },
  { value: 3, label: '3 – Szülők' },
  { value: 4, label: '4 – Gyermekek' },
  { value: 5, label: '5 – Unokák' },
  { value: 6, label: '6 – Dédunokák' },
];

export default function PersonModal({ person, people, couples, relations, onSave, onDelete, onClose }) {
  const isEdit = !!person;
  const [ln, setLn] = useState('');
  const [fn, setFn] = useState('');
  const [gender, setGender] = useState('male');
  const [born, setBorn] = useState('');
  const [died, setDied] = useState('');
  const [gen, setGen] = useState(4);
  const [note, setNote] = useState('');
  const [isSelf, setIsSelf] = useState(false);
  const [spouseId, setSpouseId] = useState('');
  const [parentCoupleId, setParentCoupleId] = useState('');

  useEffect(() => {
    if (person) {
      setLn(person.ln); setFn(person.fn); setGender(person.gender);
      setBorn(person.born ?? ''); setDied(person.died ?? '');
      setGen(person.gen); setNote(person.note ?? '');
      setIsSelf(!!person.isSelf);

      const c = couples.find(c => c.p1 === person.id || c.p2 === person.id);
      setSpouseId(c ? (c.p1 === person.id ? c.p2 : c.p1) : '');

      const rel = relations.find(r => r.childId === person.id);
      setParentCoupleId(rel?.coupleId ?? '');
    }
  }, [person]);

  const handleSave = () => {
    if (!ln.trim() && !fn.trim()) { alert('Kérjük adj meg nevet!'); return; }
    onSave(
      { ln: ln.trim(), fn: fn.trim(), gender, born: parseInt(born) || null, died: parseInt(died) || null, gen: parseInt(gen), note: note.trim(), isSelf },
      spouseId || null,
      parentCoupleId || null,
    );
  };

  const otherPeople = people.filter(p => !person || p.id !== person.id);

  const coupleLabel = (c) => {
    const a = people.find(p => p.id === c.p1);
    const b = people.find(p => p.id === c.p2);
    if (!a || !b) return c.id;
    return `${personName(a)} + ${personName(b)}`;
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{isEdit ? 'Személy szerkesztése' : 'Új személy hozzáadása'}</h2>

        <div className="form-row">
          <div className="fg">
            <label>Vezetéknév</label>
            <input value={ln} onChange={e => setLn(e.target.value)} placeholder="pl. Mándli" />
          </div>
          <div className="fg">
            <label>Keresztnév</label>
            <input value={fn} onChange={e => setFn(e.target.value)} placeholder="pl. Géza" />
          </div>
        </div>

        <div className="form-row">
          <div className="fg">
            <label>Nem</label>
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="male">Férfi</option>
              <option value="female">Nő</option>
            </select>
          </div>
          <div className="fg">
            <label>Születési év</label>
            <input type="number" value={born} onChange={e => setBorn(e.target.value)} placeholder="pl. 1980" />
          </div>
          <div className="fg">
            <label>Halálozási év</label>
            <input type="number" value={died} onChange={e => setDied(e.target.value)} placeholder="üresen = él" />
          </div>
        </div>

        <div className="fg">
          <label>Generáció szintje</label>
          <select value={gen} onChange={e => setGen(e.target.value)}>
            {GEN_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="fg">
          <label>Megjegyzés <span className="hint-inline">(opcionális – pl. Apa, Nagymama)</span></label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="pl. Nagypapa" />
        </div>

        <div className="fg self-check-row">
          <label className="self-check-label">
            <input type="checkbox" checked={isSelf} onChange={e => setIsSelf(e.target.checked)} />
            <span>★ Ez vagyok én</span>
            <span className="hint-inline"> — dupla arany keret jelöli a fán</span>
          </label>
        </div>

        <div className="fg">
          <label>Házastárs / Pár</label>
          <select value={spouseId} onChange={e => setSpouseId(e.target.value)}>
            <option value="">— nincs / nem ismert —</option>
            {otherPeople.map(p => (
              <option key={p.id} value={p.id}>{personName(p)}{p.born ? ` (${p.born})` : ''}</option>
            ))}
          </select>
        </div>

        <div className="fg">
          <label>Szülők párosa</label>
          <select value={parentCoupleId} onChange={e => setParentCoupleId(e.target.value)}>
            <option value="">— ismeretlen szülők —</option>
            {couples.map(c => <option key={c.id} value={c.id}>{coupleLabel(c)}</option>)}
          </select>
        </div>

        <div className="modal-footer">
          {isEdit && (
            <button className="btn-danger" onClick={() => {
              if (confirm(`Biztosan törlöd: ${personName(person)}?`)) onDelete(person.id);
            }}>Törlés</button>
          )}
          <button className="btn-secondary" onClick={onClose}>Mégse</button>
          <button className="btn-primary" onClick={handleSave}>Mentés</button>
        </div>
      </div>
    </div>
  );
}
