import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  LogOut,
  Package,
  RefreshCw,
  User,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "./Logo";
import { ConnectionPill } from "./StatusPill";
import { Stepper } from "./Stepper";
import { useAgri } from "@/context/AgriProvider";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/delivery", label: "New Delivery", icon: Package },
  { to: "/transactions", label: "Transactions", icon: Wallet },
  { to: "/sync", label: "Sync Center", icon: RefreshCw },
  { to: "/disputes", label: "Disputes", icon: AlertTriangle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

const MOBILE_NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/transactions", label: "Ledger", icon: Wallet },
  { to: "/sync", label: "Sync", icon: RefreshCw },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({
  children,
  /** Set during the delivery workflow: hides nav chrome, shows back + progress. */
  workflowStep,
  workflowTitle,
}: {
  children: ReactNode;
  workflowStep?: number | undefined;
  workflowTitle?: string | undefined;
}) {
  const { operator, connection, pendingCount } = useAgri();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inWorkflow = workflowStep !== undefined;

  async function signOut() {
    await supabase.auth.signOut();
    await router.navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- desktop sidebar ---------- */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-border bg-card px-5 py-6 lg:flex">
        <Link to="/dashboard" aria-label="AgriTrust Operator Portal home">
          <Logo />
        </Link>

        <nav className="mt-8 flex-1 space-y-1" aria-label="Main navigation">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                <span className="truncate">{label}</span>
                {to === "/sync" && pendingCount > 0 ? (
                  <span className="ml-auto rounded-full bg-pending-surface px-2 py-0.5 text-[11px] font-bold text-pending-foreground tabular">
                    {pendingCount}
                  </span>
                ) : null}
                {active ? (
                  <span
                    className="ml-auto size-1.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-border pt-4">
          <ConnectionPill state={connection.state} label={connection.label} />
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {(operator?.name ?? "O").slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {operator?.name ?? "Operator"}
              </span>
              <span className="label-meta block">{operator?.operator_code ?? "OP-2048"}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <LogOut className="size-[18px]" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* ---------- mobile header ---------- */}
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm lg:hidden">
        {inWorkflow ? (
          <div className="space-y-3 px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.history.back()}
                aria-label="Go back"
                className="grid size-10 place-items-center rounded-2xl border border-border bg-card"
              >
                <ArrowLeft className="size-5" aria-hidden="true" />
              </button>
              <p className="truncate text-base font-semibold">{workflowTitle ?? "New delivery"}</p>
              <ConnectionPill
                state={connection.state}
                label={connection.state === "online" ? "Online" : connection.label}
                className="ml-auto"
              />
            </div>
            <Stepper current={workflowStep} />
          </div>
        ) : (
          <div className="flex items-center gap-3 px-4 py-3">
            <Link to="/dashboard" aria-label="AgriTrust home">
              <Logo subtitle={null} />
            </Link>
            <ConnectionPill
              state={connection.state}
              label={connection.state === "online" ? "Online" : connection.label}
              className="ml-auto"
            />
          </div>
        )}
      </header>

      {/* ---------- content ---------- */}
      <div className="lg:pl-[264px]">
        {inWorkflow ? (
          <div className="mx-auto hidden max-w-3xl px-8 pt-8 lg:block">
            <Stepper current={workflowStep} />
          </div>
        ) : null}
        <main
          className={cn(
            "mx-auto w-full px-4 py-5 sm:px-6 lg:px-8 lg:py-8",
            inWorkflow ? "max-w-3xl" : "max-w-6xl",
            "pb-28 lg:pb-12",
          )}
        >
          {children}
        </main>
      </div>

      {/* ---------- mobile bottom nav ---------- */}
      {inWorkflow ? null : (
        <nav
          aria-label="Primary"
          className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-around rounded-3xl border border-border bg-card/95 p-1.5 shadow-lift backdrop-blur-md lg:hidden"
        >
          {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-w-0 flex-1 touch-target flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold",
                  active ? "bg-secondary text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
                {to === "/sync" && pendingCount > 0 ? (
                  <span className="absolute top-1 right-3 size-2 rounded-full bg-pending" aria-hidden="true" />
                ) : null}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
