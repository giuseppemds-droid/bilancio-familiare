export type TipoMovimento = "entrata" | "spesa";

export interface Categoria {
  id: number;
  nome: string;
  tipo: TipoMovimento;
  icona: string;
  colore: string;
}

export interface Transazione {
  id: number;
  categoria_id: number;
  importo: number;
  tipo: TipoMovimento;
  descrizione: string | null;
  data: string; // "YYYY-MM-DD"
  anno: number;
  mese: number;
}

export interface NuovaTransazione {
  categoria_id: number;
  importo: number;
  tipo: TipoMovimento;
  descrizione: string;
  data: string;
}

export interface RiepilogoMensile {
  anno: number;
  mese: number;
  entrate: number;
  spese: number;
  saldo: number;
}

export interface DistribuzioneCategoria {
  categoria: string;
  colore: string;
  totale: number;
}
