# YouTubeExpertSearch

A **YouTubeExpertSearch** egy célzott kereső és elemző alkalmazási ökoszisztéma, amely segít YouTube videók és szakértői tartalmak hatékony keresésében, szűrésében és feldolgozásában.

## 📂 Projekt Mappaszerkezet

```
YouTubeExpertSearch/
├── .env                # Közös környezeti változók (pl. YOUTUBE_API_KEY)
├── .env.example        # Mintafájl a környezeti változókhoz
├── README.md           # Fő dokumentáció
├── PLAN.md             # 4-pontos részletes megvalósítási terv
├── package.json        # Gyökér szintű futtatási scriptek
├── uitest/             # UI prototípus és teszt alkalmazás (Vite + React)
├── backend/            # Backend szolgáltatás és API (fejlesztés alatt)
└── extension/          # Chrome bővítmény (Manifest V3 - fejlesztés alatt)
```

## 🚀 Futtatás

- **UI Test alkalmazás indítása:** `npm run dev:uitest` (vagy lépj be a `uitest` mappába és futtasd az `npm run dev` parancsot).

Részletes megvalósítási terv: [`PLAN.md`](PLAN.md)
