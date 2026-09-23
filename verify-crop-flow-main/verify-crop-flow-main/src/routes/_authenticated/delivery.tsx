import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  FileCheck,
  Loader2,
  Lock,
  Pause,
  Play,
  QrCode,
  Scale,
  Search,
  ShieldCheck,
  Square,
  User,
  Volume2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/agri/AppShell";
import { ApprovalCodeInput } from "@/components/agri/ApprovalCodeInput";
import { AuditCamera } from "@/components/agri/AuditCamera";
import { GradeChip } from "@/components/agri/StatusPill";
import { NumericKeypad } from "@/components/agri/NumericKeypad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgri } from "@/context/AgriProvider";
import {
  CROP_TYPES,
  GRADES,
  formatKg,
  formatTime,
  formatWeight,
  maskPhone,
  newApprovalCode,
  newTransactionId,
  validateWeight,
  type Farmer,
  type Grade,
  type Transaction,
} from "@/lib/agri";
import { auditEvent, simulateFarmerApproval } from "@/lib/demo";
import type { ProcessedPhoto } from "@/lib/photo";
import {
  confirmationScript,
  pauseSpeech,
  resumeSpeech,
  speak,
  speechSupported,
  stopSpeech,
  VOICE_LANGS,
  type VoiceLang,
} from "@/lib/speech";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/delivery")({
  head: () => ({
    meta: [
      { title: "New Delivery · AgriTrust" },
      {
        name: "description",
        content:
          "Identify the farmer, record weight and grade, photograph the scale evidence and capture the farmer's approval in four steps.",
      },
      { property: "og:title", content: "New Delivery · AgriTrust" },
      {
        property: "og:description",
        content: "Four-step verified collection: identify, weigh, photograph, approve.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeliveryFlow,
});

const TITLES = ["Identify farmer", "Weight & grade", "Visual audit", "Farmer approval"];

function DeliveryFlow() {
  const { farmers, farmersLoading, operator, connection, commit, refreshTransactions } = useAgri();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [weight, setWeight] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [crop, setCrop] = useState<string>(CROP_TYPES[0]);
  const [photo, setPhoto] = useState<ProcessedPhoto | null>(null);
  const [txn, setTxn] = useState<Transaction | null>(null);
  const [done, setDone] = useState<Transaction | null>(null);

  const weightError = weight ? validateWeight(weight).message : undefined;

  /* ---------- step 04: create the pending transaction once ---------- */
  const startApproval = useCallback(async () => {
    if (!farmer || !grade || !photo) {
      console.warn("Cannot start approval without farmer, grade, and audit photo");
      return;
    }
    const op = operator || {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Rahul",
      operator_code: "OP-2048",
      role: "Collection Operator",
      collection_center: "Nashik",
      email: "rahul.nashik@agritrust.in",
      phone: null,
      language: "en",
      voice_enabled: true,
    };

    const online = connection.browserOnline;
    const id = newTransactionId(online);
    const code = newApprovalCode();
    const now = new Date().toISOString();

    const pending: Transaction = {
      transaction_id: id,
      farmer_id: farmer.id,
      farmer_name: farmer.name,
      farmer_fpo_id: farmer.fpo_id,
      operator_id: op.id,
      operator_name: op.name,
      weight: Number(weight),
      grade,
      crop_type: crop,
      audit_photo_path: `local:${id}`,
      status: "PENDING_APPROVAL",
      approval_code: code,
      approval_method: null,
      sync_status: online ? "SYNCING" : "SYNC_PENDING",
      offline_created: !online,
      created_at: now,
      updated_at: now,
    };

    setTxn(pending);
    setStep(3);

    try {
      await commit({
        transaction: pending,
        photo: { full: photo.full, thumb: photo.thumb },
        events: [
          auditEvent(id, "TRANSACTION_CREATED", "OPERATOR", { offline: !online }, op.name),
          auditEvent(id, "FARMER_SELECTED", "OPERATOR", { fpo_id: farmer.fpo_id }, op.name),
          auditEvent(id, "WEIGHT_ENTERED", "OPERATOR", { weight: Number(weight) }, op.name),
          auditEvent(id, "GRADE_SELECTED", "OPERATOR", { grade }, op.name),
          auditEvent(id, "AUDIT_PHOTO_CAPTURED", "OPERATOR", {}, op.name),
          auditEvent(id, "OTP_GENERATED", "SYSTEM", {}, null),
          auditEvent(id, "APPROVAL_REQUESTED", "OPERATOR", {}, op.name),
        ],
      });
    } catch (e) {
      console.warn("Background commit error:", e);
    }
  }, [farmer, grade, photo, operator, weight, crop, connection.browserOnline, commit]);

  function reset() {
    setStep(0);
    setFarmer(null);
    setWeight("");
    setGrade(null);
    setPhoto(null);
    setTxn(null);
    setDone(null);
  }

  /* ---------- success screen ---------- */
  if (done) {
    return (
      <AppShell>
        <SuccessScreen
          txn={done}
          onNext={reset}
          onView={() =>
            void router.navigate({
              to: "/transactions/$id",
              params: { id: done.transaction_id },
            })
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell workflowStep={step} workflowTitle={TITLES[step]}>
      <div className="space-y-6">
        <header className="hidden lg:block">
          <h1 className="text-2xl font-bold tracking-tight">{TITLES[step]}</h1>
        </header>

        {step === 0 ? (
          <FarmerStep
            farmers={farmers}
            loading={farmersLoading}
            selected={farmer}
            onSelect={setFarmer}
            onContinue={() => setStep(1)}
          />
        ) : null}

        {step === 1 ? (
          <WeighStep
            farmer={farmer!}
            weight={weight}
            setWeight={setWeight}
            error={weightError}
            grade={grade}
            setGrade={setGrade}
            crop={crop}
            setCrop={setCrop}
            onContinue={() => setStep(2)}
          />
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <div className="surface-card p-4">
              <p className="label-meta">Capture the crop, scale and grade card in one image</p>
              <p className="mt-1 text-sm font-semibold">
                {farmer?.name} · {formatWeight(Number(weight))} kg · Grade {grade}
              </p>
            </div>
            <AuditCamera photo={photo} onCaptured={setPhoto} onCleared={() => setPhoto(null)} />
            <ContinueBar
              disabled={!photo}
              hint={photo ? "Audit photo attached" : "A photo of the physical evidence is required"}
              label="Continue to approval"
              onClick={() => void startApproval()}
            />
          </div>
        ) : null}

        {step === 3 && txn ? (
          <ApprovalStep
            txn={txn}
            farmer={farmer!}
            photoUrl={photo?.previewUrl ?? null}
            onVerified={(locked) => {
              refreshTransactions();
              setDone(locked);
            }}
          />
        ) : null}
      </div>
    </AppShell>
  );
}

/* ================= step 01 ================= */

function FarmerStep({
  farmers,
  loading,
  selected,
  onSelect,
  onContinue,
}: {
  farmers: Farmer[];
  loading: boolean;
  selected: Farmer | null;
  onSelect: (f: Farmer | null) => void;
  onContinue: () => void;
}) {
  const [raw, setRaw] = useState("");
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  // debounce so low-end devices are not re-filtering on every keystroke
  useEffect(() => {
    const t = window.setTimeout(() => setQuery(raw.trim().toLowerCase()), 220);
    return () => window.clearTimeout(t);
  }, [raw]);

  const results = useMemo(() => {
    if (!query) return farmers.slice(0, 6);
    return farmers
      .filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.phone.includes(query) ||
          f.fpo_id.toLowerCase().includes(query) ||
          f.qr_identifier.toLowerCase().includes(query),
      )
      .slice(0, 12);
  }, [farmers, query]);

  function resolveScanned(value: string) {
    const v = value.trim().toLowerCase();
    const match = farmers.find(
      (f) =>
        f.qr_identifier.toLowerCase() === v ||
        f.fpo_id.toLowerCase() === v ||
        f.id.toLowerCase() === v,
    );
    if (!match) {
      setScanError("That card doesn't match any farmer registered at this centre.");
      return;
    }
    onSelect(match);
    setScanning(false);
    setScanError(null);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm font-medium text-muted-foreground">
        Search the farmer or scan their collection card.
      </p>

      <div className="relative">
        <Search
          className="absolute inset-y-0 left-4 my-auto size-5 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Phone, FPO ID or farmer name"
          aria-label="Search farmer by phone, FPO ID or name"
          className="h-14 rounded-2xl pl-12 text-base"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-14 w-full rounded-2xl text-base"
        onClick={() => {
          setScanning(true);
          setScanError(null);
        }}
      >
        <QrCode className="size-5" aria-hidden="true" />
        Scan farmer QR
      </Button>

      {scanning ? (
        <QrScanner
          onResult={resolveScanned}
          onClose={() => setScanning(false)}
          error={scanError}
        />
      ) : null}

      {/* extra bottom room so the sticky action bar never sits on top of a farmer row */}
      <div className="space-y-3 pb-28 md:pb-4">
        {loading ? (
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-3xl" />)
        ) : results.length === 0 ? (
          <div className="surface-card space-y-2 p-6 text-center">
            <AlertTriangle className="mx-auto size-7 text-pending-foreground" aria-hidden="true" />
            <p className="text-base font-semibold">Farmer not found.</p>
            <p className="text-sm text-muted-foreground">
              Check the phone number or FPO ID, or scan the farmer's collection card instead.
            </p>
          </div>
        ) : (
          results.map((f) => {
            const active = selected?.id === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelect(f)}
                aria-pressed={active}
                className={cn(
                  "surface-card flex w-full items-center gap-3 p-4 text-left transition-colors",
                  active && "border-primary bg-secondary",
                )}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <User className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-semibold">{f.name}</span>
                  <span className="label-meta block">
                    {f.fpo_id} · {maskPhone(f.phone)}
                    {f.village ? ` · ${f.village}` : ""}
                  </span>
                  {active ? (
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-success">
                      <ShieldCheck className="size-3.5" aria-hidden="true" />
                      Farmer identity verified
                    </span>
                  ) : null}
                </span>
                {active ? (
                  <span className="grid size-7 place-items-center rounded-full bg-success text-white">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
              </button>
            );
          })
        )}
      </div>

      <ContinueBar
        disabled={!selected}
        hint={selected ? `${selected.name} selected` : "Select a farmer to continue"}
        label="Continue"
        onClick={onContinue}
      />
    </div>
  );
}

/** Camera QR reader with a manual fallback for devices without BarcodeDetector. */
function QrScanner({
  onResult,
  onClose,
  error,
}: {
  onResult: (value: string) => void;
  onClose: () => void;
  error: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<"starting" | "scanning" | "manual" | "denied">("starting");
  const [manual, setManual] = useState("");

  useEffect(() => {
    let raf = 0;
    let cancelled = false;

    async function run() {
      const Detector = (
        window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => {
          detect: (s: CanvasImageSource) => Promise<Array<{ rawValue: string }>>;
        } }
      ).BarcodeDetector;

      if (!navigator.mediaDevices?.getUserMedia || !Detector) {
        setState("manual");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setState("scanning");
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const detector = new Detector({ formats: ["qr_code"] });
        const tick = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes[0]?.rawValue) {
              onResult(codes[0].rawValue);
              return;
            }
          } catch {
            /* keep scanning */
          }
          raf = requestAnimationFrame(() => void tick());
        };
        raf = requestAnimationFrame(() => void tick());
      } catch (err) {
        const name = err instanceof DOMException ? err.name : "";
        setState(name === "NotAllowedError" ? "denied" : "manual");
      }
    }

    void run();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [onResult]);

  return (
    <div className="surface-card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Scan the farmer's collection card</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close QR scanner"
          className="grid size-9 place-items-center rounded-xl border border-border"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {state === "scanning" || state === "starting" ? (
        <div className="relative overflow-hidden rounded-2xl bg-primary/90">
          <video
            ref={videoRef}
            playsInline
            muted
            aria-label="QR scanner camera preview"
            className="aspect-square w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-10 rounded-2xl border-2 border-white/80" />
          <p className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl glass-dark px-3 py-2 text-center text-xs font-semibold text-white">
            {state === "starting" ? "Starting the camera…" : "Hold the QR code inside the square"}
          </p>
        </div>
      ) : null}

      {state === "denied" ? (
        <p className="rounded-2xl border border-destructive/30 bg-danger-surface p-3 text-sm font-medium text-destructive">
          Camera permission was denied. Allow camera access, or type the farmer ID below.
        </p>
      ) : null}

      {state === "manual" || state === "denied" ? (
        <div className="flex gap-2">
          <Input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Farmer ID or FPO ID"
            aria-label="Enter farmer ID from the collection card"
            className="h-12 rounded-2xl"
          />
          <Button
            type="button"
            className="h-12 rounded-2xl"
            onClick={() => onResult(manual)}
            disabled={!manual.trim()}
          >
            Find
          </Button>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ================= step 02 ================= */

function WeighStep({
  farmer,
  weight,
  setWeight,
  error,
  grade,
  setGrade,
  crop,
  setCrop,
  onContinue,
}: {
  farmer: Farmer;
  weight: string;
  setWeight: (v: string) => void;
  error: string | undefined;
  grade: Grade | null;
  setGrade: (g: Grade) => void;
  crop: string;
  setCrop: (c: string) => void;
  onContinue: () => void;
}) {
  const valid = validateWeight(weight).ok;

  return (
    <div className="space-y-5">
      <div className="surface-card flex items-center gap-3 p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
          <User className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-base font-semibold">{farmer.name}</span>
          <span className="label-meta block">
            {farmer.fpo_id} · {maskPhone(farmer.phone)}
          </span>
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-success">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Verified
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="surface-card p-5 text-center">
            <p className="label-meta">Weight on the scale</p>
            <p className="numeric-xl mt-1" aria-live="polite">
              {weight === "" ? "0.00" : weight}
              <span className="ml-2 text-lg font-semibold text-muted-foreground">kg</span>
            </p>
            {error ? (
              <p role="alert" className="mt-2 text-sm font-semibold text-destructive">
                {error}
              </p>
            ) : null}
          </div>
          <NumericKeypad value={weight} onChange={setWeight} />
        </section>

        <section className="space-y-4">
          <div>
            <p className="label-meta mb-2">Crop</p>
            <div className="flex flex-wrap gap-2">
              {CROP_TYPES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={crop === c}
                  onClick={() => setCrop(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold",
                    crop === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="label-meta mb-2">Grade</p>
            <div className="space-y-3">
              {GRADES.map((g) => {
                const active = grade === g.grade;
                return (
                  <button
                    key={g.grade}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setGrade(g.grade)}
                    className={cn(
                      "surface-card flex w-full items-center gap-3 p-4 text-left",
                      active && "border-primary bg-secondary",
                    )}
                  >
                    <GradeChip grade={g.grade} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold">{g.label}</span>
                      <span className="block text-xs text-muted-foreground">{g.description}</span>
                    </span>
                    {active ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-success">
                        <Check className="size-4" aria-hidden="true" />
                        Selected
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <ContinueBar
        disabled={!valid || !grade}
        hint={
          !valid
            ? "Enter the weight shown on the scale"
            : !grade
              ? "Select the grade of this lot"
              : `${formatWeight(Number(weight))} kg · Grade ${grade}`
        }
        label="Continue to audit photo"
        onClick={onContinue}
      />
    </div>
  );
}

/* ================= step 04 ================= */

function ApprovalStep({
  txn,
  farmer,
  photoUrl,
  onVerified,
}: {
  txn: Transaction;
  farmer: Farmer;
  photoUrl: string | null;
  onVerified: (locked: Transaction) => void;
}) {
  const { transactions, connection, operator } = useAgri();
  const [otp, setOtp] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [lang, setLang] = useState<VoiceLang>((operator?.language ?? "en") as VoiceLang);
  const [speaking, setSpeaking] = useState(false);
  const spokenFor = useRef<string | null>(null);

  const script = confirmationScript(
    lang,
    farmer.name,
    formatWeight(txn.weight),
    txn.grade,
  );

  /* voice plays once per transaction, never on every render */
  useEffect(() => {
    if (!operator?.voice_enabled || spokenFor.current === txn.transaction_id) return;
    spokenFor.current = txn.transaction_id;
    if (speak(script, lang, () => setSpeaking(false))) setSpeaking(true);
    return () => stopSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txn.transaction_id]);

  /* realtime: the farmer confirms from their own portal */
  const remote = transactions.find((t) => t.transaction_id === txn.transaction_id);
  useEffect(() => {
    if (remote?.status === "VERIFIED_LOCKED") {
      stopSpeech();
      onVerified(remote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote?.status]);

  async function approve(method: "FARMER_PORTAL" | "OTP") {
    setWorking(true);
    try {
      const locked = await simulateFarmerApproval(txn, method, connection.browserOnline);
      stopSpeech();
      onVerified(locked);
    } catch {
      setOtpError("We couldn't record the approval right now. Please try again in a moment.");
    } finally {
      setWorking(false);
    }
  }

  function submitOtp() {
    if (attempts >= 4) {
      setOtpError("Too many attempts. Ask the farmer to confirm from their portal instead.");
      return;
    }
    if (otp === txn.approval_code) {
      setOtpError(null);
      void approve("OTP");
      return;
    }
    setAttempts((a) => a + 1);
    setOtp("");
    setOtpError("Incorrect approval code. Please try again.");
  }

  return (
    <div className="space-y-5">
      {/* summary */}
      <section className="surface-card space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-bold">{farmer.name}</p>
            <p className="label-meta">
              {farmer.fpo_id} · {txn.transaction_id}
            </p>
          </div>
          <GradeChip grade={txn.grade} />
        </div>
        <p className="numeric-lg inline-flex items-center gap-2">
          <Scale className="size-5 text-muted-foreground" aria-hidden="true" />
          {formatKg(txn.weight)}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Audit photo attached to this delivery"
              className="size-16 rounded-2xl object-cover"
            />
          ) : null}
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success">
            <Check className="size-4" aria-hidden="true" />
            Audit photo attached
          </span>
        </div>
      </section>

      {/* voice confirmation */}
      {speechSupported() ? (
        <section className="surface-card space-y-3 p-5">
          <div className="flex items-center gap-2">
            <Volume2 className="size-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold">Read the delivery aloud to the farmer</p>
          </div>
          <p className="text-sm text-muted-foreground">{script}</p>
          <div className="flex flex-wrap gap-2">
            {VOICE_LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                aria-pressed={lang === l.code}
                onClick={() => setLang(l.code)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                  lang === l.code
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-2xl"
              onClick={() => {
                if (speak(script, lang, () => setSpeaking(false))) setSpeaking(true);
              }}
            >
              <Play className="size-4" aria-hidden="true" />
              Replay
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-2xl"
              onClick={() => (speaking ? (pauseSpeech(), setSpeaking(false)) : (resumeSpeech(), setSpeaking(true)))}
            >
              <Pause className="size-4" aria-hidden="true" />
              {speaking ? "Pause" : "Resume"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 rounded-2xl"
              onClick={() => {
                stopSpeech();
                setSpeaking(false);
              }}
            >
              <Square className="size-4" aria-hidden="true" />
              Stop
            </Button>
          </div>
        </section>
      ) : null}

      {/* approval code */}
      <section className="space-y-4 rounded-3xl border border-primary/25 bg-primary p-6 text-primary-foreground">
        <p className="text-xs font-bold tracking-[0.18em] uppercase opacity-80">
          Farmer approval code
        </p>
        <p className="text-5xl font-bold tracking-[0.3em] tabular sm:text-6xl">
          {txn.approval_code}
        </p>
        <p className="text-sm opacity-90">Ask the farmer to confirm this delivery.</p>
        <div className="flex items-center gap-2 rounded-2xl glass px-3 py-2.5 text-sm font-semibold">
          <Clock className="size-4 animate-pulse" aria-hidden="true" />
          <span aria-live="polite">
            Waiting for farmer approval… Listening for confirmation from the farmer portal.
          </span>
        </div>
      </section>

      {/* OTP entry */}
      <section className="surface-card space-y-4 p-5">
        <p className="text-sm font-semibold">Enter farmer OTP</p>
        <ApprovalCodeInput
          value={otp}
          onChange={setOtp}
          disabled={working}
          invalid={!!otpError}
        />
        {otpError ? (
          <p role="alert" className="text-sm font-semibold text-destructive">
            {otpError}
          </p>
        ) : null}
        <Button
          type="button"
          onClick={submitOtp}
          disabled={otp.length !== 4 || working}
          className="h-13 w-full rounded-2xl text-base"
        >
          {working ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
          Verify approval code
        </Button>
      </section>

      {/* demo control: the farmer confirms from their own portal */}
      <Button
        type="button"
        variant="outline"
        className="h-13 w-full rounded-2xl border-dashed text-base"
        onClick={() => void approve("FARMER_PORTAL")}
        disabled={working}
      >
        <CheckCircle2 className="size-5" aria-hidden="true" />
        Simulate farmer approval (demo)
      </Button>
    </div>
  );
}

/* ================= success ================= */

function SuccessScreen({
  txn,
  onNext,
  onView,
}: {
  txn: Transaction;
  onNext: () => void;
  onView: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <span className="mx-auto grid size-20 place-items-center rounded-full bg-success text-white animate-[check-pop_420ms_ease-out]">
        <Check className="size-10" strokeWidth={3} aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Transaction verified</h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          This transaction is permanently locked.
        </p>
      </div>

      <section className="surface-card space-y-3 p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="label-meta">Receipt</span>
          <span className="text-sm font-bold">{txn.transaction_id}</span>
        </div>
        <dl className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div className="col-span-2">
            <dt className="label-meta">Farmer</dt>
            <dd className="text-base font-semibold">{txn.farmer_name}</dd>
          </div>
          <div>
            <dt className="label-meta">Weight</dt>
            <dd className="text-lg font-bold tabular">{formatKg(txn.weight)}</dd>
          </div>
          <div>
            <dt className="label-meta">Grade</dt>
            <dd className="mt-1">
              <GradeChip grade={txn.grade} />
            </dd>
          </div>
          <div>
            <dt className="label-meta">Time</dt>
            <dd className="text-sm font-semibold tabular">
              {formatTime(txn.verified_at ?? txn.created_at)}
            </dd>
          </div>
          <div>
            <dt className="label-meta">Status</dt>
            <dd className="text-sm font-semibold text-success">Verified &amp; Locked</dd>
          </div>
        </dl>
        <ul className="space-y-2 border-t border-border pt-3 text-sm font-medium">
          {[
            { icon: CheckCircle2, text: "Farmer approved" },
            { icon: Camera, text: "Audit photo attached" },
            { icon: FileCheck, text: "Audit trail created" },
            { icon: Lock, text: "Transaction locked" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="size-4 text-success" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" onClick={onNext} className="h-14 rounded-2xl text-base">
          Start next delivery
          <ArrowRight className="size-5" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onView}
          className="h-14 rounded-2xl text-base"
        >
          View transaction
        </Button>
      </div>

      <Link to="/dashboard" className="block text-sm font-semibold text-muted-foreground">
        Back to dashboard
      </Link>
    </div>
  );
}

/* ================= shared ================= */

function ContinueBar({
  disabled,
  hint,
  label,
  onClick,
}: {
  disabled: boolean;
  hint: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="sticky bottom-20 z-10 space-y-2 lg:bottom-4">
      <p className="text-center text-xs font-semibold text-muted-foreground">{hint}</p>
      <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="h-14 w-full rounded-2xl text-base shadow-lift"
      >
        {label}
        <ArrowRight className="size-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
