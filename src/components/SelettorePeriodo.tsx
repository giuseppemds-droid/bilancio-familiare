interface Props {
  anno: number;
  mese: number;
  anniDisponibili: number[];
  onChange: (anno: number, mese: number) => void;
}

const NOMI_MESI = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

export default function SelettorePeriodo({ anno, mese, anniDisponibili, onChange }: Props) {
  const meseAvanti = () => {
    if (mese === 12) onChange(anno + 1, 1);
    else onChange(anno, mese + 1);
  };

  const meseIndietro = () => {
    if (mese === 1) onChange(anno - 1, 12);
    else onChange(anno, mese - 1);
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-4 py-3">
      <button
        onClick={meseIndietro}
        className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
        aria-label="Mese precedente"
      >
        ‹
      </button>

      <div className="flex items-center gap-2">
        <select
          value={mese}
          onChange={(e) => onChange(anno, Number(e.target.value))}
          className="font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer text-lg"
        >
          {NOMI_MESI.map((nome, i) => (
            <option key={i} value={i + 1}>{nome}</option>
          ))}
        </select>
        <select
          value={anno}
          onChange={(e) => onChange(Number(e.target.value), mese)}
          className="font-semibold text-gray-500 bg-transparent border-none outline-none cursor-pointer text-lg"
        >
          {anniDisponibili.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <button
        onClick={meseAvanti}
        className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
        aria-label="Mese successivo"
      >
        ›
      </button>
    </div>
  );
}

export { NOMI_MESI };
