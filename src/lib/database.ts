import Database from "@tauri-apps/plugin-sql";
import type {
  Categoria,
  Transazione,
  NuovaTransazione,
  RiepilogoMensile,
  DistribuzioneCategoria,
} from "./types";

let dbInstance: Database | null = null;

/**
 * Apre (o riutilizza) la connessione al database SQLite locale.
 * Il file viene salvato nella cartella dati dell'app gestita da Tauri
 * (es. su macOS: ~/Library/Application Support/<app>/bilancio.db,
 *      su Windows: %APPDATA%/<app>/bilancio.db)
 */
export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:bilancio.db");
    await runMigrations(dbInstance);
  }
  return dbInstance;
}

async function runMigrations(db: Database) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categorie (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      tipo TEXT CHECK(tipo IN ('entrata','spesa')) NOT NULL,
      icona TEXT NOT NULL DEFAULT 'tag',
      colore TEXT NOT NULL DEFAULT '#6366f1'
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS transazioni (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria_id INTEGER NOT NULL,
      importo REAL NOT NULL,
      tipo TEXT CHECK(tipo IN ('entrata','spesa')) NOT NULL,
      descrizione TEXT,
      data TEXT NOT NULL,
      anno INTEGER GENERATED ALWAYS AS (CAST(strftime('%Y', data) AS INTEGER)) STORED,
      mese INTEGER GENERATED ALWAYS AS (CAST(strftime('%m', data) AS INTEGER)) STORED,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES categorie(id) ON DELETE CASCADE
    );
  `);

  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_trans_anno_mese ON transazioni(anno, mese);`
  );
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_trans_categoria ON transazioni(categoria_id);`
  );

  // Pre-caricamento categorie comuni (solo se la tabella è vuota)
  const result = await db.select<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM categorie`
  );
  if (result[0]?.count === 0) {
    const categorieIniziali: Omit<Categoria, "id">[] = [
      { nome: "Stipendio", tipo: "entrata", icona: "wallet", colore: "#10b981" },
      { nome: "Altre Entrate", tipo: "entrata", icona: "plus-circle", colore: "#34d399" },
      { nome: "Affitto/Mutuo", tipo: "spesa", icona: "home", colore: "#ef4444" },
      { nome: "Spesa Alimentare", tipo: "spesa", icona: "shopping-cart", colore: "#f97316" },
      { nome: "Bollette", tipo: "spesa", icona: "zap", colore: "#3b82f6" },
      { nome: "Trasporti", tipo: "spesa", icona: "car", colore: "#8b5cf6" },
      { nome: "Svago", tipo: "spesa", icona: "film", colore: "#06b6d4" },
      { nome: "Salute", tipo: "spesa", icona: "heart", colore: "#ec4899" },
      { nome: "Istruzione", tipo: "spesa", icona: "book", colore: "#14b8a6" },
      { nome: "Altro", tipo: "spesa", icona: "more-horizontal", colore: "#6b7280" },
    ];

    for (const cat of categorieIniziali) {
      await db.execute(
        `INSERT INTO categorie (nome, tipo, icona, colore) VALUES ($1, $2, $3, $4)`,
        [cat.nome, cat.tipo, cat.icona, cat.colore]
      );
    }
  }
}

// ---------------------- CATEGORIE ----------------------

export async function getCategorie(): Promise<Categoria[]> {
  const db = await getDb();
  return db.select<Categoria[]>(`SELECT * FROM categorie ORDER BY tipo, nome`);
}

export async function aggiungiCategoria(
  cat: Omit<Categoria, "id">
): Promise<number> {
  const db = await getDb();
  const result = await db.execute(
    `INSERT INTO categorie (nome, tipo, icona, colore) VALUES ($1, $2, $3, $4)`,
    [cat.nome, cat.tipo, cat.icona, cat.colore]
  );
  return result.lastInsertId ?? 0;
}

export async function eliminaCategoria(id: number): Promise<void> {
  const db = await getDb();
  await db.execute(`DELETE FROM categorie WHERE id = $1`, [id]);
}

// ---------------------- TRANSAZIONI ----------------------

export async function getTransazioni(
  anno: number,
  mese: number
): Promise<Transazione[]> {
  const db = await getDb();
  return db.select<Transazione[]>(
    `SELECT * FROM transazioni WHERE anno = $1 AND mese = $2 ORDER BY data DESC, id DESC`,
    [anno, mese]
  );
}

export async function aggiungiTransazione(t: NuovaTransazione): Promise<number> {
  const db = await getDb();
  const result = await db.execute(
    `INSERT INTO transazioni (categoria_id, importo, tipo, descrizione, data)
     VALUES ($1, $2, $3, $4, $5)`,
    [t.categoria_id, t.importo, t.tipo, t.descrizione || null, t.data]
  );
  return result.lastInsertId ?? 0;
}

export async function modificaTransazione(
  id: number,
  t: NuovaTransazione
): Promise<void> {
  const db = await getDb();
  await db.execute(
    `UPDATE transazioni
     SET categoria_id = $1, importo = $2, tipo = $3, descrizione = $4, data = $5
     WHERE id = $6`,
    [t.categoria_id, t.importo, t.tipo, t.descrizione || null, t.data, id]
  );
}

export async function eliminaTransazione(id: number): Promise<void> {
  const db = await getDb();
  await db.execute(`DELETE FROM transazioni WHERE id = $1`, [id]);
}

// ---------------------- AGGREGAZIONI / DASHBOARD ----------------------

export async function getRiepilogoMensile(
  anno: number,
  mese: number
): Promise<RiepilogoMensile> {
  const db = await getDb();
  const rows = await db.select<{ tipo: string; totale: number }[]>(
    `SELECT tipo, COALESCE(SUM(importo), 0) as totale
     FROM transazioni WHERE anno = $1 AND mese = $2 GROUP BY tipo`,
    [anno, mese]
  );

  const entrate = rows.find((r) => r.tipo === "entrata")?.totale ?? 0;
  const spese = rows.find((r) => r.tipo === "spesa")?.totale ?? 0;

  return { anno, mese, entrate, spese, saldo: entrate - spese };
}

export async function getRiepilogoAnnuale(
  anno: number
): Promise<RiepilogoMensile[]> {
  const db = await getDb();
  const rows = await db.select<
    { mese: number; tipo: string; totale: number }[]
  >(
    `SELECT mese, tipo, COALESCE(SUM(importo), 0) as totale
     FROM transazioni WHERE anno = $1 GROUP BY mese, tipo`,
    [anno]
  );

  const riepilogo: RiepilogoMensile[] = [];
  for (let mese = 1; mese <= 12; mese++) {
    const entrate = rows.find((r) => r.mese === mese && r.tipo === "entrata")?.totale ?? 0;
    const spese = rows.find((r) => r.mese === mese && r.tipo === "spesa")?.totale ?? 0;
    riepilogo.push({ anno, mese, entrate, spese, saldo: entrate - spese });
  }
  return riepilogo;
}

export async function getDistribuzioneSpese(
  anno: number,
  mese: number
): Promise<DistribuzioneCategoria[]> {
  const db = await getDb();
  return db.select<DistribuzioneCategoria[]>(
    `SELECT c.nome as categoria, c.colore as colore, COALESCE(SUM(t.importo), 0) as totale
     FROM transazioni t
     JOIN categorie c ON c.id = t.categoria_id
     WHERE t.anno = $1 AND t.mese = $2 AND t.tipo = 'spesa'
     GROUP BY c.id
     HAVING totale > 0
     ORDER BY totale DESC`,
    [anno, mese]
  );
}

export async function getAnniDisponibili(): Promise<number[]> {
  const db = await getDb();
  const rows = await db.select<{ anno: number }[]>(
    `SELECT DISTINCT anno FROM transazioni ORDER BY anno DESC`
  );
  const anni = rows.map((r) => r.anno);
  const annoCorrente = new Date().getFullYear();
  if (!anni.includes(annoCorrente)) anni.unshift(annoCorrente);
  return anni;
}
