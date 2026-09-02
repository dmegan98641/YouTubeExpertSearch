# YouTubeExpertSearch - Megvalósítási Terv & Koncepció

## 1. Üzleti Koncepció (SaaS / API Reselling)
A végfelhasználók nem saját Google API kulcsot használnak, hanem tőled vásárolnak keresési krediteket/előfizetést (pl. Stripe-on keresztül), és a kiterjesztés a te szolgáltatásodat használja.

---

## 2. Pontos Fejlesztési Terv

### A. Kiterjesztés UI (Amit most csinálunk)
- **Kredit / Kvóta számláló**: A toolbaron megjelenítünk egy kvóta jelzőt (pl. *Kreditek: 15 / 20 ingyenes keresés maradt*).
- **Prémium / Kvóta vásárlása Modal**: Amikor a kredit eléri a 0-t, egy elegáns "Prémium előfizetés / Kvóta vásárlása" felugró ablak jelenik meg, ami a fizetési oldaladra irányítja a felhasználót.

### B. Backend Gateway (Kiszolgáló szerver)
- **Könnyű Express / Cloud Function szerver**: Itt van biztonságban a te Google API kulcsod (nem kerül ki a kliensoldalra).
- **Kvóta & Fizetéskezelés**: Számon tartja az egyes felhasználók napi/havi kvótáját és kezeli a fizetéseket (pl. Stripe integráció).

### C. Több Szolgáltatás Bevezetése
- Nemcsak YouTube keresőt, hanem **Google Maps térképes keresést**, cégkeresést vagy akár **AI összefoglalót** is be tudsz kapcsolni a toolbarba – és mindegyik fogyaszthatja a tőled vásárolt krediteket.
