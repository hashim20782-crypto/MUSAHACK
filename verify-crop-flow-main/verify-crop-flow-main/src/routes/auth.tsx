import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import authField from "@/assets/auth-field.jpg";
import { Logo } from "@/components/agri/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Operator Sign In · AgriTrust" },
      {
        name: "description",
        content:
          "Sign in to the AgriTrust Operator Portal to record verified crop collection, grading and farmer approvals.",
      },
      { property: "og:title", content: "Operator Sign In · AgriTrust" },
      {
        property: "og:description",
        content: "Secure operator access for agricultural collection centres.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const DEMO_EMAIL = "rahul.nashik@agritrust.in";
const DEMO_PASSWORD = "AgriTrust@2026";

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [name, setName] = useState("Rahul");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void router.navigate({ to: "/dashboard" });
    });
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Try signing in first
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If user does not exist in new project, auto-register them
      if (signInError && (signInError.message.includes("Invalid login credentials") || signInError.message.includes("Email not confirmed"))) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name || "Rahul Patil", role: "operator" },
            emailRedirectTo: ${window.location.origin}/dashboard,
          },
        });

        if (!signUpError) {
          const secondAttempt = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          signInError = secondAttempt.error;
        }
      }

      if (signInError) throw signInError;
      await router.navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        /invalid login/i.test(message)
          ? "Invalid email or password. You can also switch to 'Create operator access' below."
          : /already registered/i.test(message)
            ? "This operator already has an account. Switch to Sign in."
            : message || "We couldn't sign you in right now. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-background lg:grid lg:grid-cols-2">
      {/* visual panel */}
      <div className="absolute inset-0 lg:relative lg:inset-auto">
        <img
          src={authField}
          alt="Rice paddy field at sunrise in rural India"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 lg:bg-primary/55" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
          <Logo tone="dark" subtitle="Operator Portal" />
          <div className="hidden max-w-md space-y-4 lg:block">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Transparent collection. Verified transactions.
            </h1>
            <p className="text-base text-white/85">
              Digital verification for modern agricultural collection centres.
            </p>
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* form panel */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create operator access"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to your Operator Portal."
              : "Register this device for your collection centre."}
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            {mode === "signup" ? (
              <div className="space-y-2">
                <Label htmlFor="name">Operator name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="h-12 rounded-2xl"
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Phone or Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="h-12 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  className="h-12 rounded-2xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="h-12 w-full rounded-2xl text-base font-semibold"
            >
              {busy ? <Loader2 className="size-5 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-semibold text-primary hover:underline"
              >
                New operator? Create operator access
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-semibold text-primary hover:underline"
              >
                Already registered? Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
