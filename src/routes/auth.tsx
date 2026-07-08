import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Scissors, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Accedi · Sfumatura Perfetta Deluxe" },
      { name: "description", content: "Accedi o registrati per prenotare il tuo appuntamento da Marco." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/prenota" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim() || !phone.trim()) {
          toast.error("Inserisci nome e telefono");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name.trim(), phone: phone.trim() },
            emailRedirectTo: `${window.location.origin}/prenota`,
          },
        });
        if (error) throw error;
        toast.success("Registrazione completata!");
        navigate({ to: "/prenota" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bentornato!");
        navigate({ to: "/prenota" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 py-5 border-b border-border">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-4 h-4" /> Torna al sito
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Scissors className="w-8 h-8 text-gold mx-auto mb-4" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              {mode === "signin" ? "Accedi" : "Registrati"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Entra per prenotare il tuo appuntamento."
                : "Crea un account per prenotare il tuo taglio."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-xl p-6">
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Nome e cognome</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Telefono</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={20}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-gold"
                  />
                </div>
              </>
            )}
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:border-gold"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-primary-foreground py-3 rounded-md font-medium shadow-gold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Attendi…" : mode === "signin" ? "Accedi" : "Crea account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-center mt-4 text-sm text-muted-foreground hover:text-gold transition"
          >
            {mode === "signin"
              ? "Non hai un account? Registrati"
              : "Hai già un account? Accedi"}
          </button>
        </div>
      </main>
    </div>
  );
}
