# YouTubeExpertSearch - 4-Pontos Megvalósítási Terv

Ez a dokumentum a **YouTubeExpertSearch** projekt 4 fő fejlesztési pillérét és lépéseit tartalmazza. Ezt a tervet használjuk kiindulási alapként a finomításhoz ("gyurmázáshoz").

---

## 1. Pont: Keresési & Szűrési Logika (Search & Filtering Core)
- **YouTube Data API v3 Integráció**: Kulcsszavas keresés, videó metaadatok (cím, leírás, nézettség, feltöltési idő, csatorna) lekérése.
- **Szakértői Szűrők**:
  - Csatorna szerinti szűrés / fehérlista (hiteles szakértők beállítása).
  - Videó hossz, feltöltési dátum és relevancia szerinti precíz rendezés.
- **API Kulcs Kezelés**: Biztonságos környezeti változó (`.env`) és kliensoldali tesztkulcs támogatás.

---

## 2. Pont: Átirat & Tartalom Elemzés (Transcript & Content Analysis)
- **Videó Transzkript Lekérés**: Feliratok és átiratok kinyerése a kiválasztott videókból.
- **AI Tartalmi Elemzés**:
  - Lényegi összefoglalók generálása a szakértői megszólalásokról.
  - Témák és kulcskifejezések automatikus kinyerése.
  - Időbélyeges (Timestamp) kiemelések a legfontosabb válaszokhoz.

---

## 3. Pont: Felhasználói Felület & Élmény (UI / UX Interface)
- **Modern Keresőfelület**: Tisztán strukturált keresősáv, reszponzív találati kártyák.
- **Beágyazott Lejátszó**: Videók azonnali megtekintése az alkalmazáson belül a megadott időkódoknál.
- **Interaktív Elemek**: Szakértői profilok, címkék (tags) és szűrőpanelek átlátható megjelenítése.

---

## 4. Pont: Adatkezelés, Mentés & Export (Data Persistence & Export)
- **Kedvencek & Gyűjtemények**: Releváns szakértői videók és idézetek elmentése helyi vagy adatbázis tárhelyre.
- **Exportálási Lehetőségek**: Kigyűjtött jegyzetek, átirat-részletek és linkek exportálása (Markdown / JSON / PDF).
- **Rendszer Beállítások**: Felhasználói preferenciák és szűrési sablonok elmentése.

---

## Következő lépések
- [ ] Terv finomítása és véglegesítése
- [ ] Architektúra és technológiai stak felállítása
- [ ] Első prototípus fejlesztésének megkezdése
