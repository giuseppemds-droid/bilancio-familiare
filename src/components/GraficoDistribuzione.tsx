import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { DistribuzioneCategoria } from "../lib/types";

const formatEuro = (n: number) =>
  n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

export default function GraficoDistribuzione({ dati }: { dati: DistribuzioneCategoria[] }) {
  if (dati.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 h-80 flex items-center justify-center text-gray-400 animate-fade-in">
        Nessuna spesa registrata in questo mese.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuzione spese</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={dati}
            dataKey="totale"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
            label={(entry) => `${entry.categoria}`}
          >
            {dati.map((d, i) => (
              <Cell key={i} fill={d.colore} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatEuro(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
