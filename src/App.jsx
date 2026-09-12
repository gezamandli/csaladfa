import { useState, useCallback } from 'react';
import { GEN_LABELS, CARD_W, CARD_H, computeAutoLayout, exportToCSV } from './data';
import { useTreeStore } from './useTreeStore';
import PersonCard from './PersonCard';
import Connections from './Connections';
import PersonModal from './PersonModal';
import PrintView from './PrintView';
import { useRef } from 'react';

export default function App() {
  const store = useTreeStore();
  const [modalPersonId, setModalPersonId] = useState(null);
  const [showCoupleModal, setShowCoupleModal] = useState(false);
  const [cpP1, setCpP1] = useState('');
  const [cpP2, setCpP2] = useState('');
  const [templateMode, setTemplateMode] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const fileInputRef = useRef(null);
  const csvInputRef  = useRef(null);

  const printNormal = () => {
    setTemplateMode(false);
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  };

  const printTemplate = () => {
    setTemplateMode(true);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.print();
      setTimeout(() => setTemplateMode(false), 800);
    }));
  };

  const handleAutoLayout = () => {
    const newPos = computeAutoLayout(store.people, store.couples, store.relations);
    Object.entries(newPos).forEach(([id, pos]) => store.moveCard(id, pos.x, pos.y));
  };

  const handleMove = useCallback((id, x, y) => {
    store.moveCard(id, Math.max(0, x), Math.max(0, y));
  }, [store]);

  const handleModalSave = (fields, spouseId, parentCoupleId) => {
    if (modalPersonId === 'new') store.addPerson(fields, spouseId, parentCoupleId);
    else store.editPerson(modalPersonId, fields, spouseId, parentCoupleId);
    setModalPersonId(null);
  };

  const handleDelete = (id) => { store.deletePerson(id); setModalPersonId(null); };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => store.importJSON(ev.target.result);
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const title = file.name.replace(/\.csv$/i, '').replace(/_/g, ' ') || null;
    const reader = new FileReader();
    reader.onload = ev => store.importCSV(ev.target.result, title);
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const handleAddCouple = () => {
    if (!cpP1 || !cpP2 || cpP1 === cpP2) { alert('Válassz ki két különböző személyt!'); return; }
    if (store.couples.find(c => (c.p1===cpP1&&c.p2===cpP2)||(c.p1===cpP2&&c.p2===cpP1))) {
      alert('Ez a párosítás már létezik.'); return;
    }
    store.addCouple(cpP1, cpP2);
    setShowCoupleModal(false); setCpP1(''); setCpP2('');
  };

  const startTitleEdit = () => {
    setTitleDraft(store.title);
    setEditingTitle(true);
  };
  const saveTitleEdit = () => {
    const t = titleDraft.trim();
    if (t) store.setTitle(t);
    setEditingTitle(false);
  };

  const editingPerson = modalPersonId && modalPersonId !== 'new'
    ? store.people.find(p => p.id === modalPersonId) : null;

  const genRows = [...new Set(store.people.map(p => p.gen))].sort();

  let maxX = 400, maxY = 400;
  Object.values(store.positions).forEach(p => {
    maxX = Math.max(maxX, p.x + CARD_W + 60);
    maxY = Math.max(maxY, p.y + CARD_H + 60);
  });

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="site-header no-print">
        <div className="header-left">
          <span className="header-crest">🌳</span>
          <div>
            {editingTitle ? (
              <div className="title-edit-row">
                <input
                  className="title-input"
                  value={titleDraft}
                  onChange={e => setTitleDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveTitleEdit(); if (e.key === 'Escape') setEditingTitle(false); }}
                  autoFocus
                />
                <button className="title-save-btn" onClick={saveTitleEdit}>✓</button>
                <button className="title-cancel-btn" onClick={() => setEditingTitle(false)}>✕</button>
              </div>
            ) : (
              <h1 className="header-title" onClick={startTitleEdit} title="Kattints a cím szerkesztéséhez">
                {store.title} <span className="title-edit-hint">✎</span>
              </h1>
            )}
            <span className="header-sub">Generációk a múltból a jelenig</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-gold"   onClick={() => setModalPersonId('new')}>+ Személy</button>
          <button className="btn btn-gold"   onClick={() => setShowCoupleModal(true)}>♥ Pár</button>
          <button className="btn btn-cyan"   onClick={handleAutoLayout}>⚙ Auto-elrendezés</button>
          <button className="btn btn-green"  onClick={store.exportJSON}>💾 Mentés</button>
          <button className="btn btn-blue"   onClick={() => fileInputRef.current.click()}>📂 Betöltés</button>
          <button className="btn btn-blue"   onClick={() => csvInputRef.current.click()}>📥 CSV</button>
          <button className="btn btn-excel"  onClick={() => exportToCSV(store.people, store.couples, store.relations)}>📊 Excel</button>
          <button className="btn btn-purple" onClick={printNormal}>🖨️ Nyomtatás</button>
          <button className="btn btn-teal"   onClick={printTemplate}>📋 Sablon</button>
          <button className="btn btn-gray"   onClick={() => { if(confirm('Visszaállítod az eredeti elrendezést?')) store.resetLayout(); }}>↺ Eredeti</button>
          <input ref={fileInputRef} type="file" accept=".json" style={{ display:'none' }} onChange={handleImport} />
          <input ref={csvInputRef}  type="file" accept=".csv"  style={{ display:'none' }} onChange={handleImportCSV} />
        </div>
      </header>

      {/* ── Legend ── */}
      <div className="legend no-print">
        <div className="leg"><div className="legbox male-box" />♂ Férfi</div>
        <div className="leg"><div className="legbox female-box" />♀ Nő</div>
        <div className="leg"><div className="legbox dead-box" />Elhunyt (szaggatott)</div>
        <div className="leg" style={{color:'#2e7d32',fontWeight:600}}>● Él = zöld kor</div>
        <div className="leg self-leg">★ Én = arany dupla keret</div>
        <span className="leg-tip">Húzd a kártyákat · ✏️ szerkesztés · kattints a címre a módosításhoz</span>
      </div>

      {/* ── Interactive tree (screen only) ── */}
      <div className="tree-wrap no-print">
        <div className="tree-canvas" style={{ width: maxX, height: maxY }}>
          {genRows.map(g => {
            const yMin = store.people.filter(p => p.gen === g)
              .reduce((mn, p) => { const pos = store.positions[p.id]; return pos ? Math.min(mn, pos.y) : mn; }, 9999);
            return (
              <div key={g} className="gen-label" style={{ top: yMin + CARD_H / 2 - 8 }}>
                {GEN_LABELS[g] ?? `Gen ${g}`}
              </div>
            );
          })}
          <svg className="svg-layer" width={maxX} height={maxY}>
            <Connections couples={store.couples} relations={store.relations} positions={store.positions} />
          </svg>
          {store.people.map(p => {
            const pos = store.positions[p.id];
            if (!pos) return null;
            return <PersonCard key={p.id} person={p} position={pos} onMove={handleMove} onEdit={(id) => setModalPersonId(id)} templateMode={false} />;
          })}
        </div>
      </div>

      {/* ── Print view (SVG – print only) ── */}
      <PrintView
        people={store.people}
        couples={store.couples}
        relations={store.relations}
        positions={store.positions}
        templateMode={templateMode}
        title={store.title}
      />

      {/* ── Modals ── */}
      {modalPersonId !== null && (
        <PersonModal person={editingPerson} people={store.people}
          couples={store.couples} relations={store.relations}
          onSave={handleModalSave} onDelete={handleDelete}
          onClose={() => setModalPersonId(null)} />
      )}

      {showCoupleModal && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowCoupleModal(false)}>
          <div className="modal">
            <h2>♥ Pár összekapcsolása</h2>
            <p className="modal-desc">Kapcsolj össze két meglévő személyt párként.</p>
            <div className="fg">
              <label>1. személy</label>
              <select value={cpP1} onChange={e => setCpP1(e.target.value)}>
                <option value="">— válassz —</option>
                {store.people.map(p => <option key={p.id} value={p.id}>{p.ln} {p.fn}{p.born ? ` (${p.born})` : ''}</option>)}
              </select>
            </div>
            <div className="fg">
              <label>2. személy</label>
              <select value={cpP2} onChange={e => setCpP2(e.target.value)}>
                <option value="">— válassz —</option>
                {store.people.map(p => <option key={p.id} value={p.id}>{p.ln} {p.fn}{p.born ? ` (${p.born})` : ''}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCoupleModal(false)}>Mégse</button>
              <button className="btn-primary" onClick={handleAddCouple}>Összekapcsol</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
