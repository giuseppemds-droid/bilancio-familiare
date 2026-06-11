# Come ottenere l'installer (.dmg / .exe) senza compilare nulla

Questa guida ti permette di ottenere i file installabili dell'app **senza usare il
terminale e senza installare Rust o Node.js sul tuo computer**. Tutto il lavoro
pesante lo fa GitHub gratuitamente.

---

## Passo 1 — Crea un nuovo repository

1. Vai su https://github.com e accedi
2. Clicca sul "+" in alto a destra → **New repository**
3. Nome: `bilancio-familiare`
4. Lascialo **Private** (consigliato, dati personali) o Public, come preferisci
5. NON spuntare "Add a README" (lo abbiamo già)
6. Clicca **Create repository**

---

## Passo 2 — Carica i file del progetto

Nella pagina del repository appena creato:

1. Clicca **uploading an existing file** (link nella pagina vuota del repo)
2. Trascina dentro **tutti i file e cartelle** dello zip che hai estratto
   (inclusa la cartella nascosta `.github` — se il tuo file manager non la
   mostra, vedi nota in fondo)
3. Scrivi un messaggio tipo "Primo caricamento progetto"
4. Clicca **Commit changes**

> ⚠️ **Nota sulla cartella `.github`**: alcuni file manager nascondono le
> cartelle che iniziano con il punto. Su macOS, nel Finder premi
> `Cmd + Shift + .` per mostrarle. Su Windows, in Esplora File vai su
> "Visualizza" → spunta "Elementi nascosti". Questa cartella è essenziale:
> contiene le istruzioni per la build automatica.

---

## Passo 3 — Avvia la build

Le build partono automaticamente quando crei un **tag di versione**. Dalla
pagina web di GitHub:

1. Vai sulla tab **Code** del repository
2. Clicca sul menu a tendina dei branch (di solito scritto "main") e poi sulla
   tab **Tags**
3. In alternativa, più semplice: vai su **Releases** (nella sidebar destra
   della pagina principale del repo) → **Create a new release**
4. In "Choose a tag" scrivi `v1.0.0` e clicca **Create new tag: v1.0.0 on publish**
5. Titolo release: `Versione 1.0.0`
6. Clicca **Publish release**

Questo fa partire automaticamente 3 build in parallelo (macOS Apple Silicon,
macOS Intel, Windows). Ci vogliono circa **10-15 minuti**.

---

## Passo 4 — Scarica l'installer

1. Vai sulla tab **Actions** del repository per vedere l'avanzamento (pallino
   giallo = in corso, verde = completato, rosso = errore)
2. Quando tutte le build sono verdi, vai sulla tab **Releases**
3. Apri la release `v1.0.0` appena creata
4. Nella sezione **Assets** in fondo trovi i file pronti:
   - `Bilancio.Familiare_1.0.0_aarch64.dmg` → **Mac con chip Apple (M1/M2/M3/M4)**
   - `Bilancio.Familiare_1.0.0_x64.dmg` → **Mac con processore Intel**
   - `Bilancio.Familiare_1.0.0_x64-setup.exe` o `.msi` → **Windows**
5. Scarica quello giusto per il tuo computer e installalo con doppio click
   come qualsiasi altro programma

---

## Aggiornamenti futuri

Quando vuoi modificare l'app (es. nuove funzionalità che ti preparo io):

1. Carico io i file aggiornati, oppure te li do e li ricarichi su GitHub
   (Passo 2, sovrascrivendo i file)
2. Crei una nuova release con un tag diverso, es. `v1.0.1` (Passo 3)
3. Scarichi il nuovo installer (Passo 4)

---

## Problemi comuni

- **Build "rossa" (fallita)**: clicca sulla build fallita nella tab Actions,
  apri i dettagli e copiami il messaggio di errore — te lo risolvo.
- **App Mac bloccata da Gatekeeper ("non può essere aperta perché proviene da
  uno sviluppatore non identificato")**: l'app non è firmata con un certificato
  Apple a pagamento. Per aprirla comunque: tasto destro sull'app →
  **Apri** → conferma "Apri" nel popup di avviso (va fatto solo la prima volta).
- **Windows SmartScreen blocca l'exe**: clicca "Ulteriori informazioni" →
  "Esegui comunque" (stesso motivo: nessun certificato a pagamento).
