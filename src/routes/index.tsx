import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Scissors, Phone, MapPin, Clock, Star, Instagram, ZoomIn, ZoomOut, X } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const heroImg = "/salone.png";
const cutImg = "/foto2.png";
const beardImg = "/foto4.png";
const fadeImg = "/foto3.jpg";

const gallery = [
  { src: "/foto2.png", label: "Buzz Cut & Fade Alto" },
  { src: "/foto5.png", label: "Ricci con Sfumatura" },
  { src: "/foto6.png", label: "Side Part Classico" },
  { src: "/foto7.png", label: "Taper con Design" },
];

export const Route = createFileRoute("/")({
  component: Index,
});

const PHONE = "393 202 0143";
const PHONE_LINK = "tel:+393932020143";
const ADDRESS = "Via Giovanni Bovio, 31, 71036 Lucera FG";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Sfumatura+Perfetta+Deluxe+Lucera";

const hours = [
  ["Lunedì", "16:00 – 21:00"],
  ["Martedì", "10:00 – 13:00 · 16:00 – 21:00"],
  ["Mercoledì", "16:00 – 21:00"],
  ["Giovedì", "16:00 – 21:00"],
  ["Venerdì", "09:30 – 13:00 · 16:00 – 21:00"],
  ["Sabato", "09:30 – 13:00 · 16:00 – 21:00"],
  ["Domenica", "Chiuso"],
];

const services = [
  { title: "Taglio Classico", desc: "Pettine e forbice, la tradizione italiana con mano ferma e occhio sartoriale.", img: cutImg, price: "da €15" },
  { title: "Taglio Barba", desc: "Fade all'ultima tendenza, transizioni impeccabili e definizione millimetrica.", img: fadeImg, price: "da €14" },
  { title: "Cura della Barba", desc: "Rifinitura con rasoio, olii e trattamenti dedicati. Senza limite d'età.", img: beardImg, price: "da €12" },
];

const reviews = [
  { name: "Francesco Papa", text: "Trattamento perfetto e completo. Vi consiglio tutti di andare da Marco, sfumatura perfetta." },
  { name: "Matteo Graziano", text: "Un'esperienza davvero eccellente! Personale attento, preciso e professionale. Solo prodotti di altissima qualità." },
  { name: "Giuseppe Pio Iatesta", text: "Marco è altamente qualificato, gentile, serio e sempre a disposizione del cliente. Consigli davvero professionali." },
];

function Index() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  useReveal();

  const openLightbox = useCallback((i: number) => { setLightbox(i); setZoom(1); }, []);
  const closeLightbox = useCallback(() => { setLightbox(null); setZoom(1); }, []);
  const zoomIn = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setZoom((z) => Math.min(z + 0.25, 3)); }, []);
  const zoomOut = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setZoom((z) => Math.max(z - 0.25, 0.5)); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-gold" />
            <span className="font-display text-lg tracking-wide">Sfumatura Perfetta <span className="text-gold">Deluxe</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#servizi" className="hover:text-foreground transition">Servizi</a>
            <a href="#galleria" className="hover:text-foreground transition">Galleria</a>
            <a href="#storia" className="hover:text-foreground transition">Storia</a>
            <a href="#recensioni" className="hover:text-foreground transition">Recensioni</a>
            <a href="#contatti" className="hover:text-foreground transition">Contatti</a>
          </nav>
          <a href={PHONE_LINK} className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold/40 text-gold px-4 py-2 text-sm hover:bg-gold hover:text-primary-foreground transition">
            <Phone className="w-4 h-4" /> Prenota
          </a>
        </div>
      </header>

      <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
        <img src={heroImg} alt="Interno della barberia Sfumatura Perfetta Deluxe" width={1600} height={1200} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs uppercase tracking-[0.3em]">Barberia · Lucera</span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-center">
              Lo stile<br />non è un caso.<br />
              <span className="italic text-gold block mt-4">È artigianato.</span>
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Nel cuore del centro storico di Lucera, Marco firma tagli classici pettine e forbice e sfumature all'ultima tendenza. Un'esperienza senza limite d'età.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={PHONE_LINK} className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-8 py-4 rounded-full font-medium shadow-gold hover:opacity-90 transition">
                <Phone className="w-4 h-4" /> Chiama 393 202 0143
              </a>
              <a href="#servizi" className="inline-flex items-center gap-2 border border-border px-8 py-4 rounded-full font-medium hover:border-gold hover:text-gold transition">
                Scopri i servizi
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">5.0 · 16 recensioni Google</span>
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-border bg-secondary/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm text-muted-foreground uppercase tracking-[0.25em]">
          <span>Pettine & Forbice</span>
          <span className="text-gold">◆</span>
          <span>Fade Moderno</span>
          <span className="text-gold">◆</span>
          <span>Cura della Barba</span>
          <span className="text-gold">◆</span>
          <span>Rasatura Tradizionale</span>
        </div>
      </div>

      <section id="servizi" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.3em]">I nostri servizi</span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold max-w-xl leading-tight">
                Ogni dettaglio,<br />al posto giusto.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Tre servizi, un solo standard: quello di Marco. Perché la differenza tra un buon taglio e un taglio perfetto è nei millimetri.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s) => (
              <article key={s.title} className="group relative overflow-hidden rounded-lg bg-card border border-border">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={s.img} alt={s.title} width={1000} height={1200} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="font-display text-2xl">{s.title}</h3>
                    <span className="text-gold text-sm">{s.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="storia" className="py-28 px-6 bg-secondary/30 border-y border-border">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-gold text-xs uppercase tracking-[0.3em]">La nostra storia</span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-tight">
            Una barberia nel cuore di Lucera.
          </h2>
          <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Siamo specializzati sia nei tagli classici <em className="text-foreground">"pettine e forbice"</em> che nei tagli moderni con sfumature all'ultima tendenza. Amanti della cura della barba, offriamo un'esperienza senza limite d'età, dove tradizione e stile contemporaneo si incontrano su ogni poltrona.
          </p>
          <div className="mt-14 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Stat n="100+" l="Clienti soddisfatti" />
            <Stat n="5.0★" l="Su Google" />
            <Stat n="16" l="Recensioni verificate" />
          </div>
        </div>
      </section>

      {/* Galleria tagli reali */}
      <section id="galleria" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.3em]">Il nostro lavoro</span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold max-w-xl leading-tight">
                Tagli veri,<br />clienti veri.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Una selezione dei lavori fatti in salone. Ogni cliente, un progetto unico.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gallery.map((g, i) => (
              <figure
                key={i}
                className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-card border border-border cursor-zoom-in"
                onClick={() => openLightbox(i)}
              >
                <img
                  src={g.src}
                  alt={g.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                  <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition duration-300 drop-shadow-lg" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/95 via-background/60 to-transparent">
                  <span className="text-sm uppercase tracking-widest text-gold font-medium">{g.label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[lightbox].src}
              alt={gallery[lightbox].label}
              style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease", maxHeight: "90vh", maxWidth: "90vw", objectFit: "contain" }}
            />
          </div>
          {/* Controlli */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 rounded-full px-6 py-3">
            <button onClick={zoomOut} className="text-white hover:text-gold transition" aria-label="Riduci zoom">
              <ZoomOut className="w-6 h-6" />
            </button>
            <span className="text-white text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} className="text-white hover:text-gold transition" aria-label="Aumenta zoom">
              <ZoomIn className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gold transition bg-black/40 rounded-full p-2"
            aria-label="Chiudi"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-gold">
            {gallery[lightbox].label}
          </div>
        </div>
      )}

      <section id="recensioni" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.3em]">Cosa dicono di noi</span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold">Le parole dei nostri clienti.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <blockquote key={r.name} className="bg-card border border-border rounded-lg p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed italic">"{r.text}"</p>
                <footer className="mt-6 pt-6 border-t border-border text-sm">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-muted-foreground text-xs mt-1">Recensione Google</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="contatti" className="py-28 px-6 bg-secondary/30 border-t border-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em]">Prenota il tuo posto</span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-tight">
              La tua poltrona<br />ti sta aspettando.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              Chiama Marco per fissare il tuo appuntamento. Ti consigliamo di prenotare in anticipo, soprattutto nel weekend.
            </p>
            <a href={PHONE_LINK} className="mt-8 inline-flex items-center gap-3 gradient-gold text-primary-foreground px-8 py-4 rounded-full font-medium shadow-gold hover:opacity-90 transition">
              <Phone className="w-5 h-5" /> {PHONE}
            </a>
            <div className="mt-10 space-y-5">
              <InfoRow icon={<MapPin className="w-5 h-5 text-gold" />} title="Indirizzo">
                <a href={MAPS} target="_blank" rel="noreferrer" className="hover:text-gold transition">{ADDRESS}</a>
              </InfoRow>
              <InfoRow icon={<Phone className="w-5 h-5 text-gold" />} title="Telefono">
                <a href={PHONE_LINK} className="hover:text-gold transition">{PHONE}</a>
              </InfoRow>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-gold" />
              <h3 className="font-display text-2xl">Orari di apertura</h3>
            </div>
            <ul className="divide-y divide-border">
              {hours.map(([day, time]) => (
                <li key={day} className="flex justify-between py-3 text-sm">
                  <span className="font-medium">{day}</span>
                  <span className="text-muted-foreground text-right">{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-gold" />
            <span className="font-display">Sfumatura Perfetta <span className="text-gold">Deluxe</span></span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Sfumatura Perfetta Deluxe · Lucera (FG)</p>
          <div className="flex gap-4 text-muted-foreground">
            <a href="https://www.instagram.com/sfumaturaperfetta_deluxe/?hl=it" aria-label="Instagram" className="hover:text-gold transition"><Instagram className="w-5 h-5" /></a>
            
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl text-gold">{n}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2">{l}</div>
    </div>
  );
}

function InfoRow({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
