import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import type { RiepilogoMensile } from "../lib/types";
import { NOMI_MESI } from "./SelettorePeriodo";

const formatEuro = (n: number) =>
  n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });

export default function GraficoAnnuale({ dati }: { dati: RiepilogoMensile[] }) {
  const datiGrafico = dati.map((d) => ({
    mese: NOMI_MESI[d.mese - 1].slice(0, 3),
    Entrate: d.entrate,
    Uscite: d.spese,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Entrate vs Uscite — confronto mensile
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datiGrafico}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mese" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => formatEuro(value)} />
          <Legend />
          <Bar
            dataKey="Entrate"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={700}
          />
          <Bar
            dataKey="Uscite"
            fill="#ef4444"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
