import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Scissors, Phone, MapPin, Clock, Star, Instagram,
  ZoomIn, ZoomOut, X, Award, Gem, Sparkles, Navigation, Menu, CalendarCheck,
} from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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
const WHATSAPP_LINK = "https://wa.me/393932020143?text=Ciao%20Marco%2C%20vorrei%20prenotare%20un%20appuntamento";
const ADDRESS = "Via Giovanni Bovio, 31 · 71036 Lucera FG";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Sfumatura+Perfetta+Deluxe+Via+Giovanni+Bovio+31+Lucera";

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
  {
    title: "Taglio Classico",
    desc: "Pettine e forbice, la tradizione italiana con mano ferma e occhio sartoriale.",
    img: cutImg,
    price: "da €15",
  },
  {
    title: "Taglio Barba",
    desc: "Fade all'ultima tendenza, transizioni impeccabili e definizione millimetrica.",
    img: fadeImg,
    price: "da €14",
  },
  {
    title: "Cura della Barba",
    desc: "Rifinitura con rasoio, olii e trattamenti dedicati. Senza limite d'età.",
    img: beardImg,
    price: "da €12",
  },
];

const whyUs = [
  {
    icon: <Award className="w-8 h-8 text-gold" />,
    title: "Esperienza",
    desc: "Anni di pratica su tagli classici e fade moderni. Ogni cliente riceve un taglio calibrato sulla sua testa, non su un modello.",
  },
  {
    icon: <Gem className="w-8 h-8 text-gold" />,
    title: "Qualità",
    desc: "Solo prodotti selezionati per barba e capelli. Nessun compromesso sui materiali, nessun compromesso sul risultato.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-gold" />,
    title: "Ambiente",
    desc: "Un salone moderno e accogliente nel cuore di Lucera. Vieni come cliente, esci come ti sentivi al meglio.",
  },
];

const reviews = [
  {
    name: "Francesco Papa",
    text: "Trattamento perfetto e completo. Vi consiglio tutti di andare da Marco, sfumatura perfetta.",
  },
  {
    name: "Matteo Graziano",
    text: "Un'esperienza davvero eccellente! Personale attento, preciso e professionale. Solo prodotti di altissima qualità.",
  },
  {
    name: "Giuseppe Pio Iatesta",
    text: "Marco è altamente qualificato, gentile, serio e sempre a disposizione del cliente. Consigli davvero professionali.",
  },
];

// ─── Animazione comparsa al scroll ───────────────────────────────────────────
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────
function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openLightbox = useCallback((i: number) => {
    setLightbox(i);
    setZoom(1);
  }, []);
  const closeLightbox = useCallback(() => {
    setLightbox(null);
    setZoom(1);
  }, []);
  const zoomIn = useCallback(
    (e: { stopPropagation(): void }) => {
      e.stopPropagation();
      setZoom((z) => Math.min(z + 0.25, 3));
    },
    []
  );
  const zoomOut = useCallback(
    (e: { stopPropagation(): void }) => {
      e.stopPropagation();
      setZoom((z) => Math.max(z - 0.25, 0.5));
    },
    []
  );

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Header fisso ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm"
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-gold" />
            <span className="font-display text-lg tracking-wide">
              Sfumatura Perfetta <span className="text-gold">Deluxe</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#perche-noi" className="hover:text-foreground transition">Perché Noi</a>
            <a href="#servizi" className="hover:text-foreground transition">Servizi</a>
            <a href="#galleria" className="hover:text-foreground transition">Galleria</a>
            <a href="#recensioni" className="hover:text-foreground transition">Recensioni</a>
            <a href="#dove-siamo" className="hover:text-foreground transition">Dove Siamo</a>
            <Link to="/prenota" className="inline-flex items-center gap-1.5 text-gold hover:text-gold-soft transition font-medium">
              <CalendarCheck className="w-4 h-4" /> Prenota
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <a href="#top">
              <img src="/logo.jpeg" alt="Sfumatura Perfetta Deluxe" className="h-10 w-10 rounded-full object-cover" />
            </a>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden bg-background/98 backdrop-blur-sm border-t border-border px-6 py-4 flex flex-col gap-4 text-sm">
            {[
              ["#perche-noi", "Perché Noi"],
              ["#servizi", "Servizi"],
              ["#galleria", "Galleria"],
              ["#recensioni", "Recensioni"],
              ["#orari", "Orari"],
              ["#dove-siamo", "Dove Siamo"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="py-2 border-b border-border/50 text-muted-foreground hover:text-gold transition"
              >
                {label}
              </a>
            ))}
            <Link
              to="/prenota"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-3 rounded-full font-medium w-fit shadow-gold"
            >
              <CalendarCheck className="w-5 h-5" /> Prenota online
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Interno della barberia Sfumatura Perfetta Deluxe"
          width={1600}
          height={1200}
          className="absolute inset-0 w-full h-full object-cover"
        />
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
              Nel cuore del centro storico di Lucera, Marco firma tagli classici
              pettine e forbice e sfumature all'ultima tendenza. Un'esperienza
              senza limite d'età.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/prenota"
                className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-8 py-4 rounded-full font-medium shadow-gold hover:opacity-90 transition"
              >
                <CalendarCheck className="w-5 h-5" /> Prenota online
              </Link>
              <a
                href="#servizi"
                className="inline-flex items-center gap-2 border border-gold/40 text-gold px-8 py-4 rounded-full font-medium hover:bg-gold/10 transition"
              >
                Scopri i servizi
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                5.0 · 16 recensioni Google
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tagline Banner ── */}
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

      {/* ── Perché scegliere noi ── */}
      <section id="perche-noi" className="py-28 px-6 bg-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.3em]">Perché scegliere noi</span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-tight">
              Esperienza. Qualità.<br />Ambiente.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto text-lg">
              Tre motivi per cui i clienti tornano sempre da Marco.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {whyUs.map((w, i) => (
              <FadeIn key={w.title} delay={i * 120}>
                <div className="bg-card border border-border rounded-xl p-8 h-full flex flex-col">
                  <div className="mb-5 p-3 rounded-lg bg-gold/10 w-fit">{w.icon}</div>
                  <h3 className="font-display text-2xl mb-3">{w.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-1">{w.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={200} className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            <Stat n="100+" l="Clienti soddisfatti" />
            <Stat n="5.0★" l="Su Google" />
            <Stat n="16" l="Recensioni verificate" />
          </FadeIn>
        </div>
      </section>

      {/* ── Servizi ── */}
      <section id="servizi" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-gold text-xs uppercase tracking-[0.3em]">I nostri servizi</span>
                <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold max-w-xl leading-tight">
                  Ogni dettaglio,<br />al posto giusto.
                </h2>
              </div>
              <p className="text-muted-foreground max-w-md">
                Tre servizi, un solo standard: quello di Marco. Perché la
                differenza tra un buon taglio e un taglio perfetto è nei
                millimetri.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 120}>
                <article className="group relative overflow-hidden rounded-xl bg-card border border-border h-full flex flex-col">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      width={1000}
                      height={1200}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-baseline justify-between gap-4 mb-3">
                      <h3 className="font-display text-2xl">{s.title}</h3>
                      <span className="text-gold font-medium text-sm whitespace-nowrap">{s.price}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galleria ── */}
      <section id="galleria" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-gold text-xs uppercase tracking-[0.3em]">Il nostro lavoro</span>
                <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold max-w-xl leading-tight">
                  Tagli veri,<br />clienti veri.
                </h2>
              </div>
              <p className="text-muted-foreground max-w-md">
                Una selezione dei lavori fatti in salone. Ogni cliente, un
                progetto unico.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gallery.map((g, i) => (
              <FadeIn key={i} delay={i * 90}>
                <figure
                  className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-card border border-border cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={g.src}
                    alt={g.label}
                    loading="lazy"
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />

                  <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/95 via-background/60 to-transparent">
                    <span className="text-sm uppercase tracking-widest text-gold font-medium">
                      {g.label}
                    </span>
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div
            className="relative flex items-center justify-center w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[lightbox].src}
              alt={gallery[lightbox].label}
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.2s ease",
                maxHeight: "90vh",
                maxWidth: "90vw",
                objectFit: "contain",
              }}
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 rounded-full px-6 py-3">
            <button
              onClick={zoomOut}
              className="text-white hover:text-gold transition"
              aria-label="Riduci zoom"
            >
              <ZoomOut className="w-6 h-6" />
            </button>
            <span className="text-white text-sm w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="text-white hover:text-gold transition"
              aria-label="Aumenta zoom"
            >
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

      {/* ── Recensioni ── */}
      <section id="recensioni" className="py-28 px-6 bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.3em]">Cosa dicono di noi</span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold">
              Le parole dei nostri clienti.
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <FadeIn key={r.name} delay={i * 120}>
                <blockquote className="bg-card border border-border rounded-xl p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-foreground/90 leading-relaxed italic flex-1">
                    "{r.text}"
                  </p>
                  <footer className="mt-6 pt-6 border-t border-border text-sm">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Recensione Google
                    </div>
                  </footer>
                </blockquote>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Orari di apertura ── */}
      <section id="orari" className="py-28 px-6">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-gold text-xs uppercase tracking-[0.3em]">Quando veniamo</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold">
                Orari di apertura.
              </h2>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-8 py-5 border-b border-border bg-secondary/30">
                <Clock className="w-5 h-5 text-gold" />
                <span className="font-medium">Salone disponibile</span>
              </div>
              <ul className="divide-y divide-border px-8">
                {hours.map(([day, time]) => (
                  <li key={day} className="flex justify-between py-4 text-sm">
                    <span className="font-medium">{day}</span>
                    <span
                      className={`text-right ${
                        time === "Chiuso"
                          ? "text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Dove siamo ── */}
      <section id="dove-siamo" className="py-28 px-6 bg-secondary/30 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center">
            <span className="text-gold text-xs uppercase tracking-[0.3em]">Dove siamo</span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-tight">
              Vieni a trovarci.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">{ADDRESS}</p>
          </FadeIn>

          <FadeIn delay={150} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={MAPS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 gradient-gold text-primary-foreground px-8 py-4 rounded-full font-medium shadow-gold hover:opacity-90 transition"
            >
              <Navigation className="w-5 h-5" /> Apri su Google Maps
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-background border border-gold/40 text-gold px-8 py-4 rounded-full font-medium hover:bg-gold hover:text-primary-foreground transition"
            >
              <WhatsAppIcon className="w-5 h-5" /> Scrivi su WhatsApp
            </a>
          </FadeIn>

          <FadeIn delay={250} className="mt-14 grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <InfoRow
              icon={<MapPin className="w-5 h-5 text-gold" />}
              title="Indirizzo"
            >
              <a
                href={MAPS}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold transition"
              >
                {ADDRESS}
              </a>
            </InfoRow>
            <InfoRow
              icon={<WhatsAppIcon className="w-5 h-5 text-gold" />}
              title="WhatsApp"
            >
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="hover:text-gold transition">
                {PHONE}
              </a>
            </InfoRow>
          </FadeIn>
        </div>
      </section>

      {/* Pulsante WhatsApp flottante rimosso — resta solo la CTA finale */}


      {/* ── Footer ── */}
      <footer className="border-t border-border py-10 px-6 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-gold" />
              <span className="font-display">
                Sfumatura Perfetta <span className="text-gold">Deluxe</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Sfumatura Perfetta Deluxe · Lucera (FG)
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a
                href="https://www.instagram.com/sfumaturaperfetta_deluxe/?hl=it"
                aria-label="Instagram"
                className="hover:text-gold transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
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
      <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
        {l}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          {title}
        </div>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
