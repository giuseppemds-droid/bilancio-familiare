import type { Categoria, Transazione } from "../lib/types";

interface Props {
  transazioni: Transazione[];
  categorie: Categoria[];
  onModifica: (t: Transazione) => void;
  onElimina: (id: number) => void;
}

const formatEuro = (n: number) =>
  n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

const formatData = (iso: string) => {
  const [anno, mese, giorno] = iso.split("-");
  return `${giorno}/${mese}/${anno}`;
};

export default function ListaTransazioni({ transazioni, categorie, onModifica, onElimina }: Props) {
  const getCategoria = (id: number) => categorie.find((c) => c.id === id);

  if (transazioni.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400 animate-fade-in">
        Nessuna voce registrata per questo mese.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in">
      <div className="divide-y divide-gray-100">
        {transazioni.map((t) => {
          const categoria = getCategoria(t.categoria_id);
          return (
            <div
              key={t.id}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: categoria?.colore ?? "#9ca3af" }}
                />
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {categoria?.nome ?? "Categoria sconosciuta"}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {t.descrizione || formatData(t.data)}
                    {t.descrizione ? ` · ${formatData(t.data)}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`font-semibold ${
                    t.tipo === "entrata" ? "text-income" : "text-expense"
                  }`}
                >
                  {t.tipo === "entrata" ? "+" : "-"}
                  {formatEuro(t.importo)}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => onModifica(t)}
                    className="text-xs px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-200"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => onElimina(t.id)}
                    className="text-xs px-2 py-1 rounded-lg text-expense hover:bg-red-50"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
