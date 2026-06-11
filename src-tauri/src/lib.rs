use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Migrazioni dello schema database. Le tabelle vengono create al primo
    // avvio; le query CRUD/aggregazioni sono gestite lato frontend (TypeScript)
    // tramite il plugin @tauri-apps/plugin-sql.
    let migrations = vec![Migration {
        version: 1,
        description: "schema_iniziale_bilancio",
        sql: include_str!("../migrations/001_schema_iniziale.sql"),
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:bilancio.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("errore durante l'avvio dell'applicazione Tauri");
}
