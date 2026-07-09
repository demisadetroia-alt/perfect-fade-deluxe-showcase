import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Scissors, ArrowLeft, Mail } from "lucide-react";
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

type Step = "credentials" | "otp";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/prenota" });
    });
  }, [navigate]);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim() || !phone.trim()) {
          toast.error("Inserisci nome e telefono");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name.trim(), phone: phone.trim() },
          },
        });
        if (error) throw error;
        toast.success("Codice inviato via email. Controlla la tua casella.");
        setStep("otp");
      } else {
        // Login: verify password, then require email OTP as 2nd factor
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Sign out immediately and send an email code to verify
        await supabase.auth.signOut();
        const { error: otpErr } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: false },
        });
        if (otpErr) throw otpErr;
        toast.success("Password OK. Ti abbiamo inviato un codice via email.");
        setStep("otp");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = otp.trim();
      if (token.length < 6) {
        toast.error("Inserisci il codice a 6 cifre");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });
      if (error) throw error;
      toast.success(mode === "signup" ? "Account verificato!" : "Accesso effettuato!");
      navigate({ to: "/prenota" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Codice non valido");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
      if (error) throw error;
      toast.success("Nuovo codice inviato");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore invio codice");
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
              {step === "otp"
                ? "Verifica email"
                : mode === "signin"
                ? "Accedi"
                : "Registrati"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "otp"
                ? `Abbiamo inviato un codice a ${email}. Inseriscilo qui sotto per continuare.`
                : mode === "signin"
                ? "Entra per prenotare il tuo appuntamento."
                : "Crea un account per prenotare il tuo taglio."}
            </p>
          </div>

          {step === "credentials" ? (
            <form onSubmit={handleCredentials} className="space-y-4 bg-card border border-border rounded-xl p-6">
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
                {loading ? "Attendi…" : mode === "signin" ? "Continua" : "Invia codice"}
              </button>
              <p className="text-xs text-muted-foreground text-center pt-2 flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Ti invieremo un codice via email per verificare la tua identità.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 bg-card border border-border rounded-xl p-6">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Codice a 6 cifre</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="w-full bg-background border border-border rounded-md px-3 py-3 text-foreground text-center text-2xl tracking-widest focus:outline-none focus:border-gold"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full gradient-gold text-primary-foreground py-3 rounded-md font-medium shadow-gold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Verifico…" : "Verifica codice"}
              </button>
              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => { setStep("credentials"); setOtp(""); }} className="text-muted-foreground hover:text-foreground transition">
                  ← Indietro
                </button>
                <button type="button" onClick={resendCode} disabled={loading} className="text-gold hover:text-gold-soft transition disabled:opacity-50">
                  Reinvia codice
                </button>
              </div>
            </form>
          )}

          {step === "credentials" && (
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="w-full text-center mt-4 text-sm text-muted-foreground hover:text-gold transition"
            >
              {mode === "signin"
                ? "Non hai un account? Registrati"
                : "Hai già un account? Accedi"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
