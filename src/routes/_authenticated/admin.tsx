import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Scissors, ArrowLeft, LogOut, Calendar, Users, CalendarX,
  Phone, Trash2, Plus, ShieldAlert,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Pannello Admin · Sfumatura Perfetta Deluxe" },
    ],
  }),
  component: AdminPage,
});

type Booking = {
  id: string;
  service: string;
  start_time: string;
  user_id: string;
};

type Profile = { id: string; name: string; phone: string };
type ClosedDay = { id: string; day: string; reason: string };

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmtDate(d: Date) {
  return d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function fmtTime(d: Date) { return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [closedDays, setClosedDays] = useState<ClosedDay[]>([]);
  const [newDay, setNewDay] = useState("");
  const [newReason, setNewReason] = useState("");

  const load = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { navigate({ to: "/auth" }); return; }

    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", userData.user.id);
    const admin = !!roles?.some((r) => r.role === "admin");
    setIsAdmin(admin);
    setChecking(false);
    if (!admin) return;

    const [{ data: b }, { data: p }, { data: c }] = await Promise.all([
      supabase.from("bookings").select("id, service, start_time, user_id").order("start_time"),
      supabase.from("profiles").select("id, name, phone"),
      supabase.from("closed_days").select("id, day, reason").order("day"),
    ]);
    setBookings(b ?? []);
    const map: Record<string, Profile> = {};
    (p ?? []).forEach((pr) => (map[pr.id] = pr));
    setProfiles(map);
    setClosedDays(c ?? []);
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const upcoming = useMemo(
    () => bookings.filter((b) => new Date(b.start_time).getTime() >= Date.now() - 3600_000),
    [bookings]
  );
  const past = useMemo(
    () => bookings.filter((b) => new Date(b.start_time).getTime() < Date.now() - 3600_000).reverse(),
    [bookings]
  );

  // Group upcoming by day
  const groupedUpcoming = useMemo(() => {
    const g: Record<string, Booking[]> = {};
    upcoming.forEach((b) => {
      const d = new Date(b.start_time);
      const key = d.toISOString().slice(0, 10);
      (g[key] ||= []).push(b);
    });
    return Object.entries(g).sort(([a], [z]) => a.localeCompare(z));
  }, [upcoming]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  async function deleteBooking(id: string) {
    if (!confirm("Eliminare questa prenotazione? Il cliente non riceverà notifica automatica.")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Prenotazione eliminata"); load(); }
  }

  async function addClosedDay(e: React.FormEvent) {
    e.preventDefault();
    if (!newDay) return;
    const { error } = await supabase.from("closed_days").insert({
      day: newDay, reason: newReason.trim(),
    });
    if (error) {
      if (error.code === "23505") toast.error("Giorno già presente");
      else toast.error(error.message);
      return;
    }
    toast.success("Giorno di chiusura aggiunto");
    setNewDay(""); setNewReason("");
    load();
  }

  async function removeClosedDay(id: string) {
    if (!confirm("Rimuovere questo giorno di chiusura?")) return;
    const { error } = await supabase.from("closed_days").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Giorno rimosso"); load(); }
  }

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Verifico permessi…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-border px-6 py-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <ShieldAlert className="w-10 h-10 text-gold mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold mb-2">Accesso riservato</h1>
            <p className="text-muted-foreground">Questa pagina è riservata a Marco. Se sei tu, accedi con l'account admin.</p>
            <Link to="/prenota" className="inline-block mt-6 text-gold hover:text-gold-soft">Vai alla prenotazione →</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/prenota" className="text-sm text-muted-foreground hover:text-gold transition">Vista cliente</Link>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition">
              <LogOut className="w-4 h-4" /> Esci
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10 flex items-center gap-3">
          <Scissors className="w-6 h-6 text-gold" />
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em]">Pannello Admin</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Le tue prenotazioni</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={<Calendar className="w-5 h-5" />} label="Prenotazioni future" value={upcoming.length} />
          <StatCard icon={<Users className="w-5 h-5" />} label="Clienti totali" value={Object.keys(profiles).length} />
          <StatCard icon={<CalendarX className="w-5 h-5" />} label="Giorni di chiusura" value={closedDays.length} />
        </div>

        {/* Upcoming bookings grouped by day */}
        <section className="mb-14">
          <h2 className="font-display text-2xl mb-4">Agenda prossimi giorni</h2>
          {groupedUpcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm bg-card border border-border rounded-lg p-6">Nessuna prenotazione in programma.</p>
          ) : (
            <div className="space-y-6">
              {groupedUpcoming.map(([day, items]) => (
                <div key={day} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-secondary/40 px-5 py-3 border-b border-border capitalize font-medium">
                    {fmtDate(new Date(day + "T12:00:00"))} · <span className="text-muted-foreground text-sm">{items.length} appuntamenti</span>
                  </div>
                  <div className="divide-y divide-border">
                    {items.map((b) => {
                      const p = profiles[b.user_id];
                      const d = new Date(b.start_time);
                      return (
                        <div key={b.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
                          <div className="w-16 text-gold font-medium">{fmtTime(d)}</div>
                          <div className="flex-1 min-w-[180px]">
                            <div className="font-medium">{p?.name || "Cliente"}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                              <span>{b.service}</span>
                              {p?.phone && (
                                <a href={`tel:${p.phone}`} className="inline-flex items-center gap-1 hover:text-gold">
                                  <Phone className="w-3 h-3" /> {p.phone}
                                </a>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                            title="Elimina prenotazione"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Closed days */}
        <section className="mb-14">
          <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
            <CalendarX className="w-5 h-5 text-gold" /> Giorni di chiusura
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Aggiungi qui i giorni in cui il salone rimane chiuso (ferie, festivi extra…). I clienti non potranno prenotare in quelle date.
          </p>

          <form onSubmit={addClosedDay} className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3 items-end mb-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Data</label>
              <input
                type="date"
                required
                value={newDay}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setNewDay(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-gold"
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs text-muted-foreground block mb-1">Motivo (facoltativo)</label>
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Es. Ferie estive"
                maxLength={80}
                className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-gold"
              />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2 rounded-md font-medium shadow-gold hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Aggiungi
            </button>
          </form>

          {closedDays.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nessun giorno di chiusura extra configurato.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {closedDays.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">{fmtDate(new Date(c.day + "T12:00:00"))}</div>
                    {c.reason && <div className="text-xs text-muted-foreground mt-0.5">{c.reason}</div>}
                  </div>
                  <button onClick={() => removeClosedDay(c.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past bookings */}
        {past.length > 0 && (
          <section>
            <h2 className="font-display text-2xl mb-4">Storico</h2>
            <div className="bg-card border border-border rounded-xl divide-y divide-border max-h-96 overflow-y-auto">
              {past.slice(0, 100).map((b) => {
                const p = profiles[b.user_id];
                const d = new Date(b.start_time);
                return (
                  <div key={b.id} className="px-5 py-2.5 text-sm flex flex-wrap gap-3 items-center">
                    <span className="text-muted-foreground w-40 capitalize">{fmtDate(d)}</span>
                    <span className="text-gold w-14">{fmtTime(d)}</span>
                    <span className="flex-1">{p?.name || "Cliente"} · {b.service}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        <span className="text-gold">{icon}</span> {label}
      </div>
      <div className="font-display text-3xl font-bold">{value}</div>
    </div>
  );
}
