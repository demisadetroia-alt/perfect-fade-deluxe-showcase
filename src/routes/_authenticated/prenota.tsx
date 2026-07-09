import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Scissors, ArrowLeft, LogOut, Calendar, Clock, AlertTriangle, Trash2, CheckCircle2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


export const Route = createFileRoute("/_authenticated/prenota")({
  head: () => ({
    meta: [
      { title: "Prenota · Sfumatura Perfetta Deluxe" },
      { name: "description", content: "Prenota il tuo taglio o servizio da Marco. Slot da 30 minuti." },
    ],
  }),
  component: PrenotaPage,
});

// ─── Config ─────────────────────────────────────────────────────────
const SERVICES = [
  { key: "Taglio Classico", price: "€15" },
  { key: "Taglio Barba", price: "€14" },
  { key: "Cura della Barba", price: "€12" },
];

// getDay(): 0=Sun..6=Sat
const OPEN_HOURS: Record<number, [string, string][]> = {
  0: [], // Domenica chiuso
  1: [["16:00", "21:00"]],
  2: [["10:00", "13:00"], ["16:00", "21:00"]],
  3: [["16:00", "21:00"]],
  4: [["16:00", "21:00"]],
  5: [["09:30", "13:00"], ["16:00", "21:00"]],
  6: [["09:30", "13:00"], ["16:00", "21:00"]],
};

const SLOT_MIN = 30;
const CANCEL_LIMIT_HOURS = 48;

// ─── Helpers ────────────────────────────────────────────────────────
function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatSlotTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateHeading(d: Date) {
  return d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

function formatFullDate(d: Date) {
  return d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function buildSlotsForDate(date: Date): Date[] {
  const ranges = OPEN_HOURS[date.getDay()] ?? [];
  const slots: Date[] = [];
  const now = new Date();
  for (const [start, end] of ranges) {
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    for (let m = startMin; m + SLOT_MIN <= endMin; m += SLOT_MIN) {
      const d = new Date(date);
      d.setHours(Math.floor(m / 60), m % 60, 0, 0);
      if (d.getTime() > now.getTime()) slots.push(d);
    }
  }
  return slots;
}

function nextDates(count: number): Date[] {
  const out: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}

type Booking = {
  id: string;
  service: string;
  start_time: string;
  user_id: string;
};

// ─── Component ──────────────────────────────────────────────────────
function PrenotaPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [closedDays, setClosedDays] = useState<Set<string>>(new Set());
  const [closedInfo, setClosedInfo] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(SERVICES[0].key);
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dates = useMemo(() => nextDates(14), []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate({ to: "/auth" });
      return;
    }
    setUserId(userData.user.id);

    const [{ data: profileData }, { data: bookingsData, error }, { data: closedData }, { data: rolesData }] = await Promise.all([
      supabase.from("profiles").select("name").eq("id", userData.user.id).maybeSingle(),
      supabase.from("bookings").select("id, service, start_time, user_id").order("start_time"),
      supabase.from("closed_days").select("day, reason"),
      supabase.from("user_roles").select("role").eq("user_id", userData.user.id),
    ]);

    if (profileData?.name) setUserName(profileData.name);
    if (error) toast.error("Impossibile caricare le prenotazioni");
    else setBookings(bookingsData ?? []);

    const set = new Set<string>();
    const info: Record<string, string> = {};
    (closedData ?? []).forEach((c) => { set.add(c.day); info[c.day] = c.reason; });
    setClosedDays(set);
    setClosedInfo(info);
    setIsAdmin(!!rolesData?.some((r) => r.role === "admin"));

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const takenSet = useMemo(() => new Set(bookings.map((b) => new Date(b.start_time).getTime())), [bookings]);

  const myBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.user_id === userId && new Date(b.start_time).getTime() > Date.now())
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [bookings, userId]
  );

  const selectedDate = dates[selectedDateIdx];
  const selectedDateKey = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;
  const selectedDateClosed = closedDays.has(selectedDateKey);
  const slots = useMemo(
    () => (selectedDateClosed ? [] : buildSlotsForDate(selectedDate)),
    [selectedDate, selectedDateClosed]
  );


  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  function openConfirm(slot: Date) {
    setSelectedSlot(slot);
    setConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!selectedSlot || !userId) return;
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: userId,
      service: selectedService,
      start_time: selectedSlot.toISOString(),
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") toast.error("Slot appena occupato. Scegline un altro.");
      else toast.error(error.message);
      return;
    }
    toast.success("Prenotazione confermata!");
    setConfirmOpen(false);
    setSelectedSlot(null);
    loadData();
  }

  async function handleCancel(b: Booking) {
    const startTime = new Date(b.start_time).getTime();
    const hoursUntil = (startTime - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < CANCEL_LIMIT_HOURS) {
      toast.error("Non puoi disdire: mancano meno di 2 giorni all'appuntamento. Chiama Marco.");
      return;
    }
    if (!confirm("Confermi la disdetta della prenotazione?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", b.id);
    if (error) toast.error("Impossibile disdire. Riprova.");
    else {
      toast.success("Prenotazione disdetta");
      loadData();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Caricamento…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-4">
            {userName && <span className="text-sm text-muted-foreground hidden sm:inline">Ciao, {userName}</span>}
            {isAdmin && (
              <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-soft transition">
                <ShieldCheck className="w-4 h-4" /> Admin
              </Link>
            )}
            <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition">
              <LogOut className="w-4 h-4" /> Esci
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Scissors className="w-5 h-5 text-gold" />
            <span className="text-gold text-xs uppercase tracking-[0.3em]">Prenota</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">Prenota il tuo appuntamento</h1>
          <p className="mt-3 text-muted-foreground">Ogni seduta dura 30 minuti. Scegli servizio, giorno e orario.</p>
        </div>

        {/* Avviso disdetta */}
        <div className="mb-8 border border-gold/40 bg-gold/5 rounded-xl p-5 flex gap-4">
          <AlertTriangle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Politica di disdetta</p>
            <p className="text-muted-foreground mt-1">
              L'appuntamento può essere disdetto <span className="text-gold font-medium">al massimo 2 giorni prima</span> della data prenotata.
              Dopo questo termine non è più possibile annullarlo online: contatta direttamente Marco al 393 202 0143.
            </p>
          </div>
        </div>

        {/* Prenotazioni attive */}
        {myBookings.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl mb-4">Le tue prenotazioni</h2>
            <div className="space-y-3">
              {myBookings.map((b) => {
                const d = new Date(b.start_time);
                const hoursUntil = (d.getTime() - Date.now()) / (1000 * 60 * 60);
                const canCancel = hoursUntil >= CANCEL_LIMIT_HOURS;
                return (
                  <div key={b.id} className="bg-card border border-border rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-gold" /> {b.service}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 capitalize">
                        {formatFullDate(d)} · {formatSlotTime(d)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancel(b)}
                      disabled={!canCancel}
                      title={canCancel ? "Disdici" : "Meno di 2 giorni: chiama Marco"}
                      className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-border hover:border-destructive hover:text-destructive transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-muted-foreground"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Disdici
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Servizio */}
        <section className="mb-8">
          <h2 className="font-display text-2xl mb-4">1. Scegli il servizio</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {SERVICES.map((s) => (
              <button
                key={s.key}
                onClick={() => setSelectedService(s.key)}
                className={`text-left p-4 rounded-lg border transition ${
                  selectedService === s.key
                    ? "border-gold bg-gold/10"
                    : "border-border bg-card hover:border-gold/50"
                }`}
              >
                <div className="font-medium">{s.key}</div>
                <div className="text-sm text-gold mt-1">{s.price}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Data */}
        <section className="mb-8">
          <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" /> 2. Scegli il giorno
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
            {dates.map((d, i) => {
              const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
              const isWeeklyClosed = OPEN_HOURS[d.getDay()].length === 0;
              const isCustomClosed = closedDays.has(key);
              const isClosed = isWeeklyClosed || isCustomClosed;
              const isSelected = i === selectedDateIdx;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDateIdx(i);
                    setSelectedSlot(null);
                  }}
                  disabled={isClosed}
                  title={isCustomClosed ? `Chiuso: ${closedInfo[key] || "giorno di chiusura"}` : undefined}
                  className={`shrink-0 w-20 py-3 rounded-lg border text-center transition ${
                    isSelected
                      ? "border-gold bg-gold/10"
                      : "border-border bg-card hover:border-gold/50"
                  } ${isClosed ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <div className="text-xs uppercase text-muted-foreground">
                    {d.toLocaleDateString("it-IT", { weekday: "short" })}
                  </div>
                  <div className="text-lg font-medium">{d.getDate()}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.toLocaleDateString("it-IT", { month: "short" })}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Slot */}
        <section className="mb-8">
          <h2 className="font-display text-2xl mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" /> 3. Scegli l'orario
          </h2>
          <p className="text-sm text-muted-foreground mb-4 capitalize">
            {formatDateHeading(selectedDate)}
          </p>
          {selectedDateClosed ? (
            <p className="text-muted-foreground text-sm bg-card border border-border rounded-lg p-4">
              Salone chiuso in questa data{closedInfo[selectedDateKey] ? ` — ${closedInfo[selectedDateKey]}` : ""}.
            </p>
          ) : slots.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nessuno slot disponibile per questa giornata.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((slot) => {
                const taken = takenSet.has(slot.getTime());
                return (
                  <button
                    key={slot.getTime()}
                    disabled={taken}
                    onClick={() => openConfirm(slot)}
                    className={`py-2.5 rounded-md border text-sm transition ${
                      taken
                        ? "border-border bg-secondary/40 text-muted-foreground line-through cursor-not-allowed"
                        : "border-border bg-card hover:border-gold hover:bg-gold/10"
                    }`}
                  >
                    {formatSlotTime(slot)}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Modal conferma */}
      {confirmOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4" onClick={() => setConfirmOpen(false)}>
          <div className="bg-card border border-border rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl mb-3">Conferma prenotazione</h3>
            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between"><span className="text-muted-foreground">Servizio</span><span className="font-medium">{selectedService}</span></div>
              <div className="flex justify-between capitalize"><span className="text-muted-foreground">Giorno</span><span className="font-medium">{formatFullDate(selectedSlot)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Orario</span><span className="font-medium">{formatSlotTime(selectedSlot)} (30 min)</span></div>
            </div>
            <div className="bg-gold/5 border border-gold/30 rounded-md p-3 text-xs text-muted-foreground mb-5 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <p>
                Confermando accetti la politica di disdetta: potrai annullare la prenotazione fino a
                <span className="text-gold font-medium"> 2 giorni prima </span>
                dell'appuntamento. Dopo, dovrai contattare direttamente Marco.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-md border border-border text-sm hover:bg-secondary transition"
              >
                Annulla
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-md gradient-gold text-primary-foreground text-sm font-medium shadow-gold hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? "Prenoto…" : "Conferma"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
