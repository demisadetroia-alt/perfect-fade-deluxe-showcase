import { createFileRoute } from "@tanstack/react-router";
import { Scissors, Phone, MapPin, Clock, Star, Instagram, Facebook } from "lucide-react";
import heroImg from "@/assets/hero-barber.jpg";
import cutImg from "@/assets/service-cut.jpg";
import beardImg from "@/assets/service-beard.jpg";
import fadeImg from "@/assets/service-fade.jpg";
import taglio1 from "@/assets/taglio-1.png.asset.json";
import taglio2 from "@/assets/taglio-2.png.asset.json";
import taglio3 from "@/assets/taglio-3.png.asset.json";
import taglio4 from "@/assets/taglio-4.png.asset.json";
import taglio5 from "@/assets/taglio-5.png.asset.json";

const gallery = [
  { src: taglio5.url, label: "Buzz Cut & Fade Alto" },
  { src: taglio1.url, label: "Ricci con Sfumatura" },
  { src: taglio2.url, label: "Side Part Classico" },
  { src: taglio3.url, label: "Pompadour Moderno" },
  { src: taglio4.url, label: "Taper con Design" },
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
  { title: "Sfumatura Deluxe", desc: "Fade all'ultima tendenza, transizioni impeccabili e definizione millimetrica.", img: fadeImg, price: "da €18" },
  { title: "Cura della Barba", desc: "Rifinitura con rasoio, olii e trattamenti dedicati. Senza limite d'età.", img: beardImg, price: "da €12" },
];

const reviews = [
  { name: "Francesco Papa", text: "Trattamento perfetto e completo. Vi consiglio tutti di andare da Marco, sfumatura perfetta." },
  { name: "Matteo Graziano", text: "Un'esperienza davvero eccellente! Personale attento, preciso e professionale. Solo prodotti di altissima qualità." },
  { name: "Giuseppe Pio Iatesta", text: "Marco è altamente qualificato, gentile, serio e sempre a disposizione del cliente. Consigli davvero professionali." },
];

function Index() {
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
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95]">
              Lo stile <br />non è un caso.<br />
              <span className="italic text-gold">È artigianato.</span>
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
            <Stat n="5000+" l="Clienti soddisfatti" />
            <Stat n="5.0★" l="Su Google" />
            <Stat n="10+" l="Anni di passione" />
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {gallery.map((g, i) => (
              <figure key={i} className="group relative overflow-hidden rounded-lg aspect-[4/5] bg-card border border-border">
                <img
                  src={g.src}
                  alt={g.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/95 via-background/60 to-transparent">
                  <span className="text-xs uppercase tracking-widest text-gold">{g.label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

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
            <a href="#" aria-label="Instagram" className="hover:text-gold transition"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gold transition"><Facebook className="w-5 h-5" /></a>
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
