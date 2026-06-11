import { useState, useEffect, useCallback } from "react";
import {
  getCategorie,
  getTransazioni,
  aggiungiTransazione,
  modificaTransazione,
  eliminaTransazione,
  getRiepilogoMensile,
  getRiepilogoAnnuale,
  getDistribuzioneSpese,
  getAnniDisponibili,
} from "./lib/database";
import type {
  Categoria,
  Transazione,
  NuovaTransazione,
  RiepilogoMensile,
  DistribuzioneCategoria,
} from "./lib/types";
import SelettorePeriodo from "./components/SelettorePeriodo";
import CardRiepilogo from "./components/CardRiepilogo";
import FormTransazione from "./components/FormTransazione";
import ListaTransazioni from "./components/ListaTransazioni";
import GraficoDistribuzione from "./components/GraficoDistribuzione";
import GraficoAnnuale from "./components/GraficoAnnuale";

const oggi = new Date();

export default function App() {
  const [anno, setAnno] = useState(oggi.getFullYear());
  const [mese, setMese] = useState(oggi.getMonth() + 1);

  const [categorie, setCategorie] = useState<Categoria[]>([]);
  const [transazioni, setTransazioni] = useState<Transazione[]>([]);
  const [riepilogoMese, setRiepilogoMese] = useState<RiepilogoMensile | null>(null);
  const [riepilogoAnno, setRiepilogoAnno] = useState<RiepilogoMensile[]>([]);
  const [distribuzione, setDistribuzione] = useState<DistribuzioneCategoria[]>([]);
  const [anniDisponibili, setAnniDisponibili] = useState<number[]>([oggi.getFullYear()]);

  const [showForm, setShowForm] = useState(false);
  const [transazioneInModifica, setTransazioneInModifica] = useState<Transazione | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  const [erroreGenerale, setErroreGenerale] = useState<string | null>(null);

  const ricaricaDati = useCallback(async () => {
    try {
      const [cats, trans, riepM, riepA, dist, anni] = await Promise.all([
        getCategorie(),
        getTransazioni(anno, mese),
        getRiepilogoMensile(anno, mese),
        getRiepilogoAnnuale(anno),
        getDistribuzioneSpese(anno, mese),
        getAnniDisponibili(),
      ]);
      setCategorie(cats);
      setTransazioni(trans);
      setRiepilogoMese(riepM);
      setRiepilogoAnno(riepA);
      setDistribuzione(dist);
      setAnniDisponibili(anni);
    } catch (err) {
      console.error(err);
      setErroreGenerale(
        "Impossibile caricare i dati dal database locale. Verifica che l'app sia eseguita tramite Tauri."
      );
    } finally {
      setCaricamento(false);
    }
  }, [anno, mese]);

  useEffect(() => {
    ricaricaDati();
  }, [ricaricaDati]);

  const handleCambioPeriodo = (nuovoAnno: number, nuovoMese: number) => {
    setAnno(nuovoAnno);
    setMese(nuovoMese);
  };

  const handleSalvaTransazione = async (t: NuovaTransazione) => {
    if (transazioneInModifica) {
      await modificaTransazione(transazioneInModifica.id, t);
    } else {
      await aggiungiTransazione(t);
    }
    setShowForm(false);
    setTransazioneInModifica(null);
    await ricaricaDati();
  };

  const handleModifica = (t: Transazione) => {
    setTransazioneInModifica(t);
    setShowForm(true);
  };

  const handleElimina = async (id: number) => {
    if (!confirm("Eliminare questa voce?")) return;
    await eliminaTransazione(id);
    await ricaricaDati();
  };

  const handleNuovaVoce = () => {
    setTransazioneInModifica(null);
    setShowForm(true);
  };

  if (erroreGenerale) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
          <p className="text-expense font-semibold mb-2">Errore</p>
          <p className="text-gray-600 text-sm">{erroreGenerale}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bilancio Familiare</h1>
          <p className="text-gray-400 text-sm">Gestisci le finanze di casa, mese per mese</p>
        </div>
        <SelettorePeriodo
          anno={anno}
          mese={mese}
          anniDisponibili={anniDisponibili}
          onChange={handleCambioPeriodo}
        />
      </header>

      {caricamento ? (
        <div className="text-center text-gray-400 py-20">Caricamento...</div>
      ) : (
        <div className="space-y-6">
          {riepilogoMese && <CardRiepilogo riepilogo={riepilogoMese} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraficoDistribuzione dati={distribuzione} />
            <GraficoAnnuale dati={riepilogoAnno} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Movimenti del mese</h2>
                <button
                  onClick={handleNuovaVoce}
                  className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  + Nuova voce
                </button>
              </div>
              <ListaTransazioni
                transazioni={transazioni}
                categorie={categorie}
                onModifica={handleModifica}
                onElimina={handleElimina}
              />
            </div>

            <div>
              {showForm && (
                <FormTransazione
                  categorie={categorie}
                  transazioneIniziale={transazioneInModifica}
                  onSalva={handleSalvaTransazione}
                  onAnnulla={() => {
                    setShowForm(false);
                    setTransazioneInModifica(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
