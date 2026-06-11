# Bilancio Familiare

App desktop cross-platform (macOS / Windows / Linux) per la gestione del bilancio familiare.
Stack: **Tauri 2 + React + TypeScript + Tailwind CSS + SQLite (locale)**.

---

## 1. Prerequisiti

Installa sul tuo computer (una sola volta):

1. **Node.js** (versione 18 o superiore) → https://nodejs.org
2. **Rust** → https://www.rust-lang.org/tools/install
   - macOS: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - Windows: scarica `rustup-init.exe` dal sito e segui la procedura (richiede anche "Microsoft C++ Build Tools", proposto automaticamente dall'installer)
3. **Tauri CLI** (verrà usata tramite `npm`, non serve installarla globalmente)

### Dipendenze di sistema aggiuntive

- **macOS**: Xcode Command Line Tools → `xcode-select --install`
- **Windows**: WebView2 (già preinstallato su Windows 10/11 aggiornati)
- **Linux**: vedi https://v2.tauri.app/start/prerequisites/ (pacchetti `webkit2gtk`, `libssl-dev`, ecc.)

---

## 2. Setup del progetto

Estrai questa cartella in `Documenti/bilancio-familiare`, poi apri un terminale al suo interno:

```bash
cd bilancio-familiare
npm install
```

---

## 3. Avvio in modalità sviluppo

```bash
npm run tauri dev
```

La prima volta Cargo (Rust) scaricherà e compilerà le dipendenze: può richiedere alcuni minuti.
Si aprirà una finestra desktop nativa con l'app.

---

## 4. Creare l'eseguibile finale (build di produzione)

```bash
npm run tauri build
```

Il pacchetto installabile verrà generato in:

- **macOS**: `src-tauri/target/release/bundle/dmg/` (.dmg) e `/macos/` (.app)
- **Windows**: `src-tauri/target/release/bundle/msi/` (.msi) e `/nsis/` (.exe)

---

## 5. Dove vengono salvati i dati

Il database SQLite (`bilancio.db`) viene creato automaticamente al primo avvio nella cartella dati dell'app:

- **macOS**: `~/Library/Application Support/com.peppe.bilanciofamiliare/`
- **Windows**: `%APPDATA%\com.peppe.bilanciofamiliare\`

Tutti i dati restano **esclusivamente in locale** sul tuo computer.

---

## 6. Struttura del progetto

```
bilancio-familiare/
├── src/                    # Frontend React/TypeScript
│   ├── components/         # Componenti UI (form, grafici, liste)
│   ├── lib/
│   │   ├── database.ts     # Funzioni di accesso al database (CRUD + aggregazioni)
│   │   └── types.ts         # Tipi TypeScript condivisi
│   ├── App.tsx              # Componente principale / dashboard
│   └── main.tsx             # Entry point React
├── src-tauri/               # Backend Rust / configurazione Tauri
│   ├── migrations/          # Schema SQL e categorie precaricate
│   ├── src/
│   │   ├── lib.rs            # Setup plugin SQL + migrazioni
│   │   └── main.rs
│   ├── capabilities/         # Permessi Tauri 2
│   └── tauri.conf.json       # Configurazione app (finestra, bundle, icone)
└── package.json
```

---

## 7. Funzionalità incluse (MVP)

- ✅ CRUD completo voci di entrata/spesa
- ✅ 10 categorie precaricate (Stipendio, Affitto/Mutuo, Spesa Alimentare, Bollette, Trasporti, Svago, Salute, Istruzione, ecc.)
- ✅ Dashboard con saldo mensile (entrate, uscite, saldo)
- ✅ Navigazione per anno/mese
- ✅ Grafico a torta: distribuzione spese per categoria (mese corrente)
- ✅ Grafico a barre: confronto entrate/uscite per tutti i mesi dell'anno
- ✅ Persistenza locale SQLite

## 8. Prossimi sviluppi suggeriti (vedi piano fasi)

- Transazioni ricorrenti automatiche
- Categorie personalizzabili dall'utente (interfaccia di gestione)
- Esportazione CSV/PDF
- Crittografia database (SQLCipher) con passphrase
- Tema scuro
- Icone personalizzate dell'app (cartella `src-tauri/icons/` — generabili con `npm run tauri icon path/to/logo.png`)

---

## 9. Note

- L'icona dell'applicazione non è inclusa: prima della build finale genera le icone con
  ```bash
  npx tauri icon path/to/tuo-logo.png
  ```
  (richiede un'immagine sorgente quadrata almeno 1024x1024px)
