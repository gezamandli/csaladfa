# 🌳 Mándli Családfa

Interaktív, böngészőalapú családfa-alkalmazás. Minden adat a böngésző `localStorage`-ában tárolódik — nincs szükség szerverre, bejelentkezésre, vagy internetkapcsolatra a használathoz.

## ✨ Funkciók

| Funkció | Leírás |
|---|---|
| Drag & drop | A kártyák egérrel szabadon mozgathatók |
| Személyek kezelése | Hozzáadás, szerkesztés, törlés |
| Párok összekapcsolása | Szülő-gyermek és házastársi kapcsolatok |
| ⚙ Auto-elrendezés | Automatikus hierarchikus elrendezés |
| ★ „Ez vagyok én" | Egy személy arany dupla kerettel kiemelve |
| Szerkeszthető cím | A fejlécre kattintva átnevezhető |
| 🖨️ Nyomtatás | A4 landscape, tele kitöltve, vonalakkal |
| 📋 Sablon nyomtatás | Üres kártyák írható vonalakkal |
| 💾 Mentés / Betöltés | JSON export és import |
| 📊 Excel export | CSV fájl UTF-8 BOM-mal (magyar karakterek) |
| Offline | Szerver nélkül, dupla kattintásra megnyílik |

## 🚀 Gyors kezdés

### Offline használat (legegyszerűbb)

Töltsd le a `dist/index.html` fájlt és nyisd meg böngészővel — kész.

### Fejlesztés

```bash
git clone https://github.com/gezamandli/csaladfa.git
cd csaladfa
npm install
npm run dev        # fejlesztői szerver: http://localhost:5173
npm run build      # dist/index.html generálása (egyetlen önálló fájl)
```

## 📁 Projekt struktúra

```
src/
  App.jsx          – főkomponens, gombok, layout
  data.js          – alapadatok, auto-layout, CSV export
  useTreeStore.js  – állapotkezelés + localStorage
  PersonCard.jsx   – egyéni kártya komponens
  PersonModal.jsx  – szerkesztő modal ablak
  Connections.jsx  – SVG vonalak (házastárs, szülő-gyermek)
  PrintView.jsx    – nyomtatási SVG (A4 landscape, vonalakkal)
  App.css          – stílusok
dist/
  index.html       – önálló, szerver nélkül futtatható build
```

## 🛠 Technológia

- **React 19** + **Vite 8**
- **vite-plugin-singlefile** – minden eszköz egyetlen HTML-be inline-olva
- SVG vonalak (bezier görbék a kapcsolatokhoz)
- `localStorage` perzisztencia

## 📖 Adatstruktúra

A JSON mentési fájl (`💾 Mentés` gomb) tartalmazza:

```json
{
  "title": "Mándli Családfa",
  "people": [{ "id": "...", "ln": "Vezetéknév", "fn": "Keresztnév", "gender": "male|female",
               "born": 1980, "died": null, "gen": 3, "note": "", "isSelf": false }],
  "couples": [{ "id": "c3a", "p1": "person_id_1", "p2": "person_id_2" }],
  "relations": [{ "coupleId": "c3a", "childId": "child_id" }],
  "positions": { "person_id": { "x": 620, "y": 640 } }
}
```

Generációs szintek: `0` = Ük-nagyszülők … `4` = Gyermekek … `7` = Ük-unokák

## 📄 Licenc

MIT — szabad felhasználás, módosítás, megosztás.
