import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Bell, CloudOff, Database, LogOut, MapPin, ShieldCheck, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/agri/AppShell";
import { ConnectionPill } from "@/components/agri/StatusPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useAgri } from "@/context/AgriProvider";
import { formatTime } from "@/lib/agri";
import { storageUsage } from "@/lib/offline-store";
import { VOICE_LANGS, speechSupported, type VoiceLang } from "@/lib/speech";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Operator Profile · AgriTrust" },
      {
        name: "description",
        content:
          "Operator identity, collection centre, offline storage usage, voice confirmation language and notifications.",
      },
      { property: "og:title", content: "Operator Profile · AgriTrust" },
      { property: "og:description", content: "Operator settings, storage and voice options." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { operator, connection, lastSyncAt, updateOperator } = useAgri();
  const router = useRouter();
  const [storage, setStorage] = useState({ usedMb: 0, quotaMb: 50 });
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    void storageUsage().then(setStorage);
  }, []);

  const voiceOn = operator?.voice_enabled ?? true;
  const lang = (operator?.language ?? "en") as VoiceLang;

  return (
    <AppShell>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>

        <section className="surface-card flex flex-wrap items-center gap-4 p-5">
          <span className="grid size-16 place-items-center rounded-3xl bg-primary text-2xl font-bold text-primary-foreground">
            {(operator?.name ?? "O").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-xl font-bold tracking-tight">{operator?.name ?? "Operator"}</p>
            <p className="text-sm font-medium text-muted-foreground">
              {operator?.role ?? "Collection Operator"} · {operator?.operator_code ?? "OP-2048"}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              Collection Center • {operator?.collection_center ?? "Nashik"}
            </p>
          </div>
          <ConnectionPill
            state={connection.state}
            label={connection.label}
            className="sm:ml-auto"
          />
        </section>

        <section className="surface-card space-y-4 p-5">
          <h2 className="text-base font-semibold">Device &amp; sync</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="label-meta">Last sync</dt>
              <dd className="mt-1 text-base font-bold tabular">
                {lastSyncAt ? formatTime(lastSyncAt) : "Not yet"}
              </dd>
            </div>
            <div>
              <dt className="label-meta">Offline storage</dt>
              <dd className="mt-1 text-base font-bold tabular">
                {storage.usedMb.toFixed(1)} MB / {storage.quotaMb.toFixed(0)} MB
              </dd>
            </div>
          </dl>
          <Progress
            value={Math.min(100, (storage.usedMb / Math.max(1, storage.quotaMb)) * 100)}
            aria-label="Offline storage used"
          />
          <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Database className="size-4" aria-hidden="true" />
            Transactions and audit photos are stored on this device until they upload.
          </p>
        </section>

        <section className="surface-card divide-y divide-border">
          <div className="flex items-center gap-3 p-5">
            <Volume2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Voice confirmation</p>
              <p className="text-xs text-muted-foreground">
                {speechSupported()
                  ? "Read the weight and grade aloud to the farmer."
                  : "This device's browser does not support voice playback."}
              </p>
            </div>
            <Switch
              checked={voiceOn}
              disabled={!speechSupported()}
              aria-label="Voice confirmation"
              onCheckedChange={(v) => void updateOperator({ voice_enabled: v })}
            />
          </div>

          <div className="space-y-3 p-5">
            <p className="text-sm font-semibold">Voice language</p>
            <div className="flex flex-wrap gap-2">
              {VOICE_LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  aria-pressed={lang === l.code}
                  onClick={() => void updateOperator({ language: l.code })}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold",
                    lang === l.code
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-5">
            <Bell className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-muted-foreground">
                Alert me when a farmer approves or an admin replies to a dispute.
              </p>
            </div>
            <Switch
              checked={notifications}
              aria-label="Notifications"
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center gap-3 p-5">
            <CloudOff className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Work offline (demo)</p>
              <p className="text-xs text-muted-foreground">
                Pretend the connection has dropped, so you can show collecting without a network and
                the automatic upload afterwards.
              </p>
            </div>
            <Switch
              checked={connection.simulatedOffline}
              aria-label="Work offline (demo)"
              onCheckedChange={connection.setSimulatedOffline}
            />
          </div>



          <div className="flex items-center gap-3 p-5 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
            Audit photos are kept in private storage. Only your collection centre and the admin can
            review them.
          </div>
        </section>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-13 w-full rounded-2xl text-base"
          onClick={async () => {
            await supabase.auth.signOut();
            await router.navigate({ to: "/auth" });
          }}
        >
          <LogOut className="size-5" aria-hidden="true" />
          Logout
        </Button>
      </div>
    </AppShell>
  );
}
