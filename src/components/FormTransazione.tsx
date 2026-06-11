import { useState, useEffect } from "react";
import type { Categoria, NuovaTransazione, TipoMovimento, Transazione } from "../lib/types";

interface Props {
  categorie: Categoria[];
  transazioneIniziale?: Transazione | null;
  onSalva: (t: NuovaTransazione) => Promise<void>;
  onAnnulla: () => void;
}

const oggi = () => new Date().toISOString().slice(0, 10);

export default function FormTransazione({
  categorie,
  transazioneIniziale,
  onSalva,
  onAnnulla,
}: Props) {
  const [tipo, setTipo] = useState<TipoMovimento>(transazioneIniziale?.tipo ?? "spesa");
  const [categoriaId, setCategoriaId] = useState<number>(
    transazioneIniziale?.categoria_id ?? 0
  );
  const [importo, setImporto] = useState<string>(
    transazioneIniziale ? String(transazioneIniziale.importo) : ""
  );
  const [descrizione, setDescrizione] = useState(transazioneIniziale?.descrizione ?? "");
  const [data, setData] = useState(transazioneIniziale?.data ?? oggi());
  const [errore, setErrore] = useState<string | null>(null);
  const [salvataggioInCorso, setSalvataggioInCorso] = useState(false);

  const categorieFiltrate = categorie.filter((c) => c.tipo === tipo);

  // Imposta categoria di default quando cambia il tipo
  useEffect(() => {
    if (!categorieFiltrate.find((c) => c.id === categoriaId)) {
      setCategoriaId(categorieFiltrate[0]?.id ?? 0);
    }
  }, [tipo, categorie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore(null);

    const importoNum = parseFloat(importo.replace(",", "."));
    if (isNaN(importoNum) || importoNum <= 0) {
      setErrore("Inserisci un importo valido maggiore di zero.");
      return;
    }
    if (!categoriaId) {
      setErrore("Seleziona una categoria.");
      return;
    }
    if (!data) {
      setErrore("Seleziona una data.");
      return;
    }

    setSalvataggioInCorso(true);
    try {
      await onSalva({
        categoria_id: categoriaId,
        importo: importoNum,
        tipo,
        descrizione: descrizione.trim(),
        data,
      });
    } catch (err) {
      setErrore("Errore durante il salvataggio. Riprova.");
      console.error(err);
    } finally {
      setSalvataggioInCorso(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm p-6 space-y-4 animate-fade-in"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        {transazioneIniziale ? "Modifica voce" : "Nuova voce"}
      </h3>

      {/* Toggle Entrata / Spesa */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        <button
          type="button"
          onClick={() => setTipo("entrata")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            tipo === "entrata"
              ? "bg-emerald-500 text-white"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          Entrata
        </button>
        <button
          type="button"
          onClick={() => setTipo("spesa")}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            tipo === "spesa"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          Spesa
        </button>
      </div>

      {/* Importo */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Importo (€)</label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={importo}
          onChange={(e) => setImporto(e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Categoria</label>
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
        >
          {categorieFiltrate.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      {/* Data */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Descrizione */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Descrizione (opzionale)
        </label>
        <input
          type="text"
          placeholder="Es. Spesa al supermercato"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {errore && <p className="text-sm text-expense">{errore}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onAnnulla}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={salvataggioInCorso}
          className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {salvataggioInCorso ? "Salvataggio..." : "Salva"}
        </button>
      </div>
    </form>
  );
}
