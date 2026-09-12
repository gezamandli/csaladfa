import { useState, useCallback } from 'react';
import {
  DEFAULT_PEOPLE, DEFAULT_COUPLES, DEFAULT_RELATIONS, DEFAULT_POSITIONS,
  autoPos, makeId, computeAutoLayout, importFromCSV,
} from './data';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('csaladfa_v2');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function saveToStorage(state) {
  localStorage.setItem('csaladfa_v2', JSON.stringify(state));
}

export function useTreeStore() {
  const [state, setState] = useState(() => {
    const saved = loadFromStorage();
    return saved || {
      title: 'Mándli Családfa',
      people: DEFAULT_PEOPLE,
      couples: DEFAULT_COUPLES,
      relations: DEFAULT_RELATIONS,
      positions: DEFAULT_POSITIONS,
    };
  });

  const update = useCallback((fn) => {
    setState(prev => {
      const next = fn(prev);
      saveToStorage(next);
      return next;
    });
  }, []);

  // ── Title ─────────────────────────────────────────────────────────────────
  const setTitle = useCallback((title) => {
    update(s => ({ ...s, title }));
  }, [update]);

  // ── Positions ────────────────────────────────────────────────────────────
  const moveCard = useCallback((id, x, y) => {
    update(s => ({ ...s, positions: { ...s.positions, [id]: { x, y } } }));
  }, [update]);

  // ── People ────────────────────────────────────────────────────────────────
  const addPerson = useCallback((fields, spouseId, parentCoupleId) => {
    const id = makeId(fields.ln, fields.fn);
    update(s => {
      const newPeople = [
        ...s.people.map(p => fields.isSelf ? { ...p, isSelf: false } : p),
        { id, ...fields },
      ];
      let newCouples = [...s.couples];
      let newRelations = [...s.relations];
      const newPos = { ...s.positions, [id]: autoPos({ ...fields, id }, newPeople) };

      if (spouseId) {
        newCouples = newCouples.filter(c => c.p1 !== id && c.p2 !== id);
        newCouples.push({ id: `c_${id}_${spouseId}`, p1: id, p2: spouseId });
      }
      if (parentCoupleId) {
        newRelations = newRelations.filter(r => r.childId !== id);
        newRelations.push({ coupleId: parentCoupleId, childId: id });
      }
      return { ...s, people: newPeople, couples: newCouples, relations: newRelations, positions: newPos };
    });
  }, [update]);

  const editPerson = useCallback((id, fields, spouseId, parentCoupleId) => {
    update(s => {
      const newPeople = s.people.map(p => {
        if (p.id === id) return { ...p, ...fields };
        if (fields.isSelf) return { ...p, isSelf: false };
        return p;
      });
      let newCouples = [...s.couples];
      let newRelations = [...s.relations];

      const existingCouple = s.couples.find(c => (c.p1 === id || c.p2 === id));
      const currentSpouseId = existingCouple
        ? (existingCouple.p1 === id ? existingCouple.p2 : existingCouple.p1)
        : null;

      if (spouseId !== currentSpouseId) {
        newCouples = newCouples.filter(c => c.p1 !== id && c.p2 !== id);
        if (spouseId) {
          newCouples.push({ id: `c_${id}_${spouseId}`, p1: id, p2: spouseId });
        }
      }

      const existingRel = s.relations.find(r => r.childId === id);
      const currentParentId = existingRel?.coupleId || null;
      if (parentCoupleId !== currentParentId) {
        newRelations = newRelations.filter(r => r.childId !== id);
        if (parentCoupleId) {
          newRelations.push({ coupleId: parentCoupleId, childId: id });
        }
      }

      return { ...s, people: newPeople, couples: newCouples, relations: newRelations };
    });
  }, [update]);

  const deletePerson = useCallback((id) => {
    update(s => {
      const newPeople = s.people.filter(p => p.id !== id);
      const newCouples = s.couples.filter(c => c.p1 !== id && c.p2 !== id);
      const newRelations = s.relations.filter(r => r.childId !== id);
      const newPos = { ...s.positions };
      delete newPos[id];
      return { ...s, people: newPeople, couples: newCouples, relations: newRelations, positions: newPos };
    });
  }, [update]);

  // ── Couples ───────────────────────────────────────────────────────────────
  const addCouple = useCallback((p1, p2) => {
    update(s => ({
      ...s,
      couples: [...s.couples, { id: `c_${p1}_${p2}`, p1, p2 }],
    }));
  }, [update]);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetLayout = useCallback(() => {
    update(s => {
      const pos = { ...DEFAULT_POSITIONS };
      s.people.forEach(p => { if (!pos[p.id]) pos[p.id] = autoPos(p, s.people); });
      return { ...s, positions: pos };
    });
  }, [update]);

  // ── JSON export/import ────────────────────────────────────────────────────
  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `csaladfa_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }, [state]);

  const importJSON = useCallback((jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      const next = parsed.people ? parsed : { ...parsed };
      setState(next);
      saveToStorage(next);
    } catch (e) {
      alert('Hiba a JSON fájl beolvasásakor: ' + e.message);
    }
  }, []);

  // ── CSV import ────────────────────────────────────────────────────────────
  const importCSV = useCallback((csvText, csvTitle) => {
    const result = importFromCSV(csvText);
    if (!result) { alert('Nem sikerült beolvasni a CSV fájlt. Ellenőrizd, hogy az alkalmazásból lett-e exportálva.'); return; }
    const { people, couples, relations } = result;
    // Auto-compute positions from the reconstructed tree
    const positions = computeAutoLayout(people, couples, relations);
    // Fallback: if any person has no position, use autoPos
    people.forEach(p => { if (!positions[p.id]) positions[p.id] = autoPos(p, people); });
    const next = {
      title: csvTitle || state.title || 'Importált családfa',
      people, couples, relations, positions,
    };
    setState(next);
    saveToStorage(next);
  }, [state.title]);

  // Helper lookups
  const getSpouseId = useCallback((personId) => {
    const c = state.couples.find(c => c.p1 === personId || c.p2 === personId);
    if (!c) return null;
    return c.p1 === personId ? c.p2 : c.p1;
  }, [state.couples]);

  const getParentCoupleId = useCallback((personId) => {
    return state.relations.find(r => r.childId === personId)?.coupleId || null;
  }, [state.relations]);

  return {
    ...state,
    title: state.title ?? 'Mándli Családfa',
    setTitle,
    moveCard,
    addPerson,
    editPerson,
    deletePerson,
    addCouple,
    resetLayout,
    exportJSON,
    importJSON,
    importCSV,
    getSpouseId,
    getParentCoupleId,
  };
}
