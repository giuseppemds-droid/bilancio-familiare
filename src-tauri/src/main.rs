// Punto d'ingresso dell'eseguibile (richiesto su Windows per evitare la console)
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    bilancio_familiare_lib::run();
}
