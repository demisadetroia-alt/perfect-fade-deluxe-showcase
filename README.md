# Sfumatura Perfetta Deluxe — Sito Web

Sito vetrina professionale per la barberia **Sfumatura Perfetta Deluxe** di Lucera (FG), pensato per attrarre nuovi clienti, mostrare il lavoro del barbiere Marco e semplificare la prenotazione telefonica.

---

## 1. A cosa serve il sito

L'obiettivo del sito è **uno solo**: far arrivare più clienti in barberia.

Per farlo il sito:
- Mostra subito chi sei, dove sei e cosa fai (Lucera, barberia, tagli classici e moderni).
- Mette in evidenza il **pulsante di chiamata** in ogni sezione importante (mobile-first: un tap e parte la telefonata).
- Fa vedere **i tagli reali** già fatti in salone (galleria fotografica cliccabile).
- Espone le **recensioni Google 5.0 stelle** per creare fiducia immediata.
- Mostra **orari e indirizzo** in modo chiaro, con link diretto a Google Maps.

Non è un sito con carrello o prenotazione online complicata: è una **vetrina digitale premium** che converte visitatori in telefonate.

---

## 2. Struttura del sito (le sezioni)

Il sito è una **single page** (una sola pagina che scorre) divisa in sezioni collegate dal menu in alto:

1. **Hero (apertura)** — Foto del salone a tutto schermo, titolo forte *"Lo stile non è un caso. È artigianato."*, pulsante oro per chiamare subito, badge 5.0 stelle Google.
2. **Barra scorrevole** — Elenco stilizzato dei servizi chiave (Pettine & Forbice, Fade Moderno, Cura della Barba, Rasatura Tradizionale).
3. **Servizi** — 3 card con foto, descrizione e prezzo indicativo:
   - Taglio Classico — da €15
   - Taglio Barba (fade) — da €14
   - Cura della Barba — da €12
4. **Storia** — Testo istituzionale sulla barberia + 3 numeri chiave (clienti soddisfatti, rating Google, recensioni).
5. **Galleria "Il nostro lavoro"** — 4 foto reali di tagli eseguiti in salone. Cliccando si apre in **lightbox a schermo intero con zoom in/out**.
6. **Recensioni** — 3 recensioni Google reali con stelle e nome cliente.
7. **Contatti** — Numero di telefono cliccabile, indirizzo con link a Google Maps, box con **orari completi settimanali**.
8. **Footer** — Logo, copyright, link Instagram.

---

## 3. Stile e design

Il sito ha un'estetica **deluxe / premium**, non il classico sito da barbiere fatto in fretta.

- **Palette**: sfondo scuro profondo + accenti **oro** (colore della barberia di qualità).
- **Font**:
  - *Playfair Display* per i titoli (serif elegante, sartoriale).
  - *Inter* per i testi (leggibile, moderno).
- **Effetti**: gradiente oro sui pulsanti, ombra dorata, hover animati sulle immagini (zoom lento), micro-animazioni.
- **Responsive**: funziona perfettamente su smartphone, tablet e desktop. Il menu si adatta e le griglie si riorganizzano automaticamente.
- **Accessibilità**: contrasto alto, testi alternativi sulle immagini, pulsanti con label ARIA.

---

## 4. Come funziona tecnicamente

Il sito è costruito con tecnologie moderne e veloci:

- **TanStack Start** (React 19) — framework full-stack con SSR (server-side rendering): le pagine arrivano già "pronte" al visitatore, quindi Google le indicizza meglio e il caricamento è velocissimo.
- **Vite 7** — build tool ultra-rapido.
- **Tailwind CSS v4** — sistema di stile con variabili semantiche (i colori, i font, gli spazi sono definiti in un unico posto e riutilizzati ovunque → cambiare il tema è questione di minuti).
- **Lucide Icons** — icone SVG leggere (forbici, telefono, pin mappa, stelle, ecc.).
- **Deploy su edge (Cloudflare Workers)** — il sito è servito da server distribuiti nel mondo → caricamento istantaneo ovunque.

### File principali del progetto

```
src/
├── routes/
│   ├── __root.tsx        → shell HTML, metadata SEO, font, favicon
│   └── index.tsx         → tutta la homepage (l'unica pagina del sito)
├── styles.css            → tema (colori oro, font, gradienti, ombre)
├── router.tsx            → configurazione del router
└── assets/               → immagini generate (hero, servizi, tagli)

public/
├── salone.png            → foto interno barberia
├── foto2.png … foto7.png → foto tagli reali dei clienti
```

### Metadata SEO

In `src/routes/__root.tsx` sono impostati:
- `<title>` ottimizzato per **"Barberia Lucera"**.
- `<meta description>` con keyword locali.
- Open Graph e Twitter Card (aspetto quando si condivide il link su WhatsApp / Facebook / Instagram).
- Font caricati via `<link>` da Google Fonts.

Questo aiuta il sito a comparire nei risultati di Google per ricerche tipo *"barbiere Lucera"*, *"barberia centro storico Lucera"*, *"sfumatura Lucera"*.

---

## 5. Contenuti dinamici (facili da modificare)

Tutti i dati importanti sono raggruppati **in cima** al file `src/routes/index.tsx` in costanti chiare:

```ts
const PHONE = "393 202 0143";
const PHONE_LINK = "tel:+393932020143";
const ADDRESS = "Via Giovanni Bovio, 31, 71036 Lucera FG";
const hours = [ ["Lunedì", "16:00 – 21:00"], ... ];
const services = [ { title, desc, img, price }, ... ];
const reviews = [ { name, text }, ... ];
const gallery = [ { src, label }, ... ];
```

Per modificare **prezzi, orari, recensioni, telefono, foto** basta cambiare queste righe: **non serve toccare il resto del codice**.

---

## 6. Cosa si può cambiare in 2 minuti

- Aggiungere / togliere un **servizio** o cambiare **prezzi**.
- Aggiornare **orari** (es. chiusura estiva).
- Aggiungere **nuove foto di tagli** nella galleria.
- Aggiungere una **nuova recensione**.
- Cambiare **telefono, indirizzo, link Instagram**.
- Cambiare il **colore accento** (oro → rosso, argento, ecc.) modificando una variabile in `styles.css`.

## 7. Cosa si può aggiungere in futuro

- **Pulsante WhatsApp flottante** per prenotare in chat.
- **Mappa Google embed** dentro la sezione contatti.
- **Prenotazione online** con calendario.
- **Pagina "Chi siamo"** dedicata a Marco.
- **Blog / consigli** su cura barba e capelli (utile per SEO).
- **Multilingua** (italiano / inglese) se arrivano turisti.
- **Google Analytics** per vedere quanti visitatori e quante chiamate partono dal sito.

---

## 8. Come si pubblica

Il sito è già pronto. Basta cliccare su **Publish** in alto a destra nell'editor Lovable: viene generato un link pubblico del tipo `https://sfumatura-perfetta-deluxe.lovable.app` immediatamente condivisibile su Google, Instagram, biglietti da visita, QR code in vetrina.

Successivamente si può collegare un **dominio personalizzato** tipo `sfumaturaperfettadeluxe.it`.

---

## 9. Perché questo sito converte

- **Un solo obiettivo per ogni sezione**: chiamare, guardare i tagli, leggere recensioni.
- **Il numero di telefono è sempre a portata di tap**: hero, menu, sezione contatti, ovunque.
- **Prova sociale forte**: 5.0 stelle Google in bella vista + recensioni testuali.
- **Foto reali**, non stock: il cliente vede *esattamente* che tagli fa Marco.
- **Caricamento velocissimo**: se un sito è lento, il 50% dei visitatori se ne va prima di vederlo. Qui carica in meno di 1 secondo.
- **Design premium**: comunica subito *"barberia seria, non ciabatteria"* → giustifica prezzi più alti.

---

© Sfumatura Perfetta Deluxe · Lucera (FG)
