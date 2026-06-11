-- Schema iniziale del database Bilancio Familiare

CREATE TABLE IF NOT EXISTS categorie (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  tipo TEXT CHECK(tipo IN ('entrata','spesa')) NOT NULL,
  icona TEXT NOT NULL DEFAULT 'tag',
  colore TEXT NOT NULL DEFAULT '#6366f1'
);

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

CREATE INDEX IF NOT EXISTS idx_trans_anno_mese ON transazioni(anno, mese);
CREATE INDEX IF NOT EXISTS idx_trans_categoria ON transazioni(categoria_id);

-- Categorie comuni precaricate
INSERT OR IGNORE INTO categorie (nome, tipo, icona, colore) VALUES
  ('Stipendio', 'entrata', 'wallet', '#10b981'),
  ('Altre Entrate', 'entrata', 'plus-circle', '#34d399'),
  ('Affitto/Mutuo', 'spesa', 'home', '#ef4444'),
  ('Spesa Alimentare', 'spesa', 'shopping-cart', '#f97316'),
  ('Bollette', 'spesa', 'zap', '#3b82f6'),
  ('Trasporti', 'spesa', 'car', '#8b5cf6'),
  ('Svago', 'spesa', 'film', '#06b6d4'),
  ('Salute', 'spesa', 'heart', '#ec4899'),
  ('Istruzione', 'spesa', 'book', '#14b8a6'),
  ('Altro', 'spesa', 'more-horizontal', '#6b7280');
