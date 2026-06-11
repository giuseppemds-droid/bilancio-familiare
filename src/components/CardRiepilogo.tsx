import type { RiepilogoMensile } from "../lib/types";

const formatEuro = (n: number) =>
  n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

export default function CardRiepilogo({ riepilogo }: { riepilogo: RiepilogoMensile }) {
  const cards = [
    {
      label: "Entrate",
      valore: riepilogo.entrate,
      colore: "text-income",
      sfondo: "bg-emerald-50",
    },
    {
      label: "Uscite",
      valore: riepilogo.spese,
      colore: "text-expense",
      sfondo: "bg-red-50",
    },
    {
      label: "Saldo",
      valore: riepilogo.saldo,
      colore: riepilogo.saldo >= 0 ? "text-income" : "text-expense",
      sfondo: riepilogo.saldo >= 0 ? "bg-emerald-50" : "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`${c.sfondo} rounded-2xl p-5 shadow-sm animate-fade-in transition-transform hover:scale-[1.02]`}
        >
          <p className="text-sm font-medium text-gray-500 mb-1">{c.label}</p>
          <p className={`text-2xl font-bold ${c.colore}`}>{formatEuro(c.valore)}</p>
        </div>
      ))}
    </div>
  );
}
