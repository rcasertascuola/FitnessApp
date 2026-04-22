# FitnessApp

Webapp locale per la visualizzazione e gestione delle schede di allenamento. Permette di inserire i propri esercizi e di tenere traccia dei progressi.

## Struttura del Progetto

```
FitnessApp/
├── index.html                 # Pagina principale con elenco schede
├── schede.html                # Pagina di gestione/creazione schede
├── js/
│   ├── main.js                # Logica principale e gestione schede
│   └── esercizio.js           # Funzioni correlate agli esercizi
└── img/                       # Immagini (attualmente una sola placeholder)
```

## Come Eseguire

1.  Aprire `index.html` con un browser web moderno.
2.  Per salvare nuove schede, sarà necessario un server locale con supporto API. Per un test immediato, assicurati di avere i file in una cartella locale (es. `FitnessApp/`).

## Funzionalità

- Visualizzazione delle schede salvate
- Creazione/modifica schede con nome e descrizione
- Aggiunta di esercizi con nome, serie, ripetizioni e peso
- Salvataggio e recupero dati (attualmente in `localStorage`)

## Sviluppi Futuri

Il progetto è in fase di sviluppo attivo. Le funzionalità previste includono:

- Interfaccia migliorata e responsive
- Salvataggio/caricamento da API (con API_URL) o file JSON
- Funzionalità di eliminazione schede e esercizi
- Possibilità di segnare serie come completate
- Miglior gestione e validazione degli input

## Note di Sviluppo

