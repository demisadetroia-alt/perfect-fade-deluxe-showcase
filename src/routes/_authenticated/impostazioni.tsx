import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, User, Phone, Mail, Lock, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/impostazioni")({
  head: () => ({
    meta: [
      { title: "Impostazioni account · Sfumatura Perfetta Deluxe" },
      { name: "description", content: "Modifica nome, telefono, email e password del tuo account." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      if (!sessionData.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUserId(sessionData.user.id);
      setCurrentEmail(sessionData.user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, phone")
        .eq("id", sessionData.user.id)
        .maybeSingle();
      if (profile) {
        setName(profile.name ?? "");
        setPhone(profile.phone ?? "");
      }
      setLoading(false);
    })();
  }, [navigate]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: name.trim(), phone: phone.trim() })
      .eq("id", userId);
    setSavingProfile(false);
    if (error) toast.error("Errore: " + error.message);
    else toast.success("Dati aggiornati");
  }

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim() || newEmail.trim() === currentEmail) {
      toast.error("Inserisci una nuova email diversa da quella attuale");
      return;
    }
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setSavingEmail(false);
    if (error) toast.error("Errore: " + error.message);
    else {
      toast.success("Ti abbiamo inviato un'email di conferma al nuovo indirizzo. Clicca il link per confermare il cambio.");
      setNewEmail("");
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd.length < 6) {
      toast.error("La password deve avere almeno 6 caratteri");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("Le password non corrispondono");
      return;
    }
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setSavingPwd(false);
    if (error) toast.error("Errore: " + error.message);
    else {
      toast.success("Password aggiornata");
      setNewPwd("");
      setConfirmPwd("");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Caricamento…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/prenota" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> Torna a Prenota
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-gold" />
            <span className="text-gold text-xs uppercase tracking-[0.3em]">Impostazioni</span>
          </div>
          <h1 className="font-display text-4xl font-bold">Il tuo account</h1>
          <p className="mt-2 text-muted-foreground">Aggiorna i dati personali, la mail o la password.</p>
        </div>

        {/* Dati personali */}
        <form onSubmit={saveProfile} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-gold" />
            <h2 className="font-display text-xl">Dati personali</h2>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Nome e cognome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Numero di telefono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
              className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-md font-medium shadow-gold hover:opacity-90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {savingProfile ? "Salvo…" : "Salva modifiche"}
          </button>
        </form>

        {/* Email */}
        <form onSubmit={saveEmail} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-gold" />
            <h2 className="font-display text-xl">Cambio email</h2>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Email attuale</label>
            <input
              type="email"
              value={currentEmail}
              disabled
              className="w-full bg-secondary/40 border border-border rounded-md px-3 py-2 text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Nuova email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nuova@email.com"
              className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-gold"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ti invieremo un link di conferma al nuovo indirizzo. Il cambio è effettivo solo dopo aver confermato.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingEmail}
            className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-md font-medium shadow-gold hover:opacity-90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {savingEmail ? "Invio…" : "Aggiorna email"}
          </button>
        </form>

        {/* Password */}
        <form onSubmit={savePassword} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-gold" />
            <h2 className="font-display text-xl">Cambio password</h2>
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Nuova password</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              minLength={6}
              className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">Conferma nuova password</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              minLength={6}
              className="w-full bg-background border border-border rounded-md px-3 py-2 focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            disabled={savingPwd}
            className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-md font-medium shadow-gold hover:opacity-90 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {savingPwd ? "Salvo…" : "Cambia password"}
          </button>
        </form>
      </main>
    </div>
  );
}
