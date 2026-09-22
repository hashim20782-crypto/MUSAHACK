import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Database,
  Lock,
  QrCode,
  Scale,
  ShieldCheck,
  Sprout,
  UserCheck,
} from "lucide-react";

import heroImage from "@/assets/hero-collection.jpg";
import produceImage from "@/assets/produce.jpg";
import { Logo } from "@/components/agri/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriTrust — Every Crop. Every Grade. Verified." },
      {
        name: "description",
        content:
          "AgriTrust creates a transparent digital record for agricultural collection, grading and farmer approval at rural collection centres.",
      },
      { property: "og:title", content: "AgriTrust — Every Crop. Every Grade. Verified." },
      {
        property: "og:description",
        content:
          "Transparent, evidence-backed crop collection: identify, weigh, grade, photograph, approve and lock.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  {
    icon: UserCheck,
    title: "Verify",
    text: "Visual farmer identification and evidence attached to every transaction.",
  },
  {
    icon: Camera,
    title: "Prove",
    text: "A live photograph of the scale reading and the physical grading record.",
  },
  {
    icon: Lock,
    title: "Lock",
    text: "Farmer approval permanently locks the transaction — nobody can edit it later.",
  },
];

const PROCESS = [
  { n: "01", title: "Identify", text: "Phone number, FPO ID or the farmer's QR collection card.", icon: QrCode },
  { n: "02", title: "Weigh", text: "Weight is entered on a purpose-built field keypad.", icon: Scale },
  { n: "03", title: "Grade", text: "Grade A, B or C recorded against the lot.", icon: ShieldCheck },
  { n: "04", title: "Capture", text: "Photograph the crop, the scale and the grade card together.", icon: Camera },
  { n: "05", title: "Approve", text: "The farmer independently confirms weight and grade.", icon: UserCheck },
  { n: "06", title: "Lock", text: "The verified record becomes immutable and auditable.", icon: Lock },
];

const FRAUD_FLOW = [
  { text: "Operator records", icon: Sprout },
  { text: "Camera captures evidence", icon: Camera },
  { text: "Backend stores evidence", icon: Database },
  { text: "Farmer verifies", icon: UserCheck },
  { text: "Transaction locks", icon: Lock },
  { text: "Admin can audit", icon: CheckCircle2 },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* hero */}
      <section className="relative isolate">
        <img
          src={heroImage}
          alt="Rural collection centre with weighing scale and fresh produce at golden hour"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/78" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col px-5 py-8 sm:px-8">
          <header className="flex items-center justify-between gap-3">
            <Logo tone="dark" subtitle={null} />
            <Link
              to="/auth"
              className="rounded-2xl glass px-4 py-2.5 text-sm font-semibold text-white"
            >
              Operator sign in
            </Link>
          </header>

          <div className="mt-auto max-w-2xl space-y-6 py-14">
            <p className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-white uppercase">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Collection · Grading · Farmer approval
            </p>
            <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-6xl">
              Every Crop. Every Grade. Verified.
            </h1>
            <p className="max-w-xl text-base text-white/85 sm:text-lg">
              AgriTrust creates a transparent digital record for agricultural collection, grading
              and farmer approval.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex touch-target items-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-bold text-primary shadow-lift"
              >
                Enter Operator Portal
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex touch-target items-center gap-2 rounded-2xl glass px-6 py-4 text-base font-semibold text-white"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* pillars */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="surface-card space-y-3 p-6">
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-bold tracking-[0.12em] uppercase">{title}</h2>
              <p className="text-sm text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* process */}
      <section id="how-it-works" className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How it works</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Six steps at the scale, under a minute per delivery — designed for rural connectivity
            and one-handed use.
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map(({ n, title, text, icon: Icon }) => (
              <li key={n} className="surface-card space-y-3 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary tabular">{n}</span>
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold tracking-wide uppercase">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* fraud prevention flow */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-3xl border border-border">
            <img
              src={produceImage}
              alt="Graded produce in jute sacks beside a weighing scale"
              loading="lazy"
              className="h-72 w-full object-cover lg:h-96"
            />
          </div>
          <div className="space-y-5">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Grading fraud has nowhere to hide
            </h2>
            <p className="text-sm text-muted-foreground">
              Every record carries its own proof: who weighed it, what the scale showed, what the
              grade card said, and the farmer's own confirmation.
            </p>
            <ol className="space-y-3">
              {FRAUD_FLOW.map(({ text, icon: Icon }, i) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex flex-col items-center">
                    <span className="grid size-9 place-items-center rounded-2xl bg-success-surface text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    {i < FRAUD_FLOW.length - 1 ? (
                      <span className="mt-1 h-4 w-0.5 bg-success/50" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="text-sm font-semibold">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="border-t border-border bg-card py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-5 sm:px-8">
          <Logo />
          <h2 className="text-2xl font-bold tracking-tight">
            Ready at the scale, even without a signal.
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Operators keep collecting offline; transactions, audit photos and approvals upload
            automatically the moment the network returns.
          </p>
          <Link
            to="/auth"
            className="inline-flex touch-target items-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground"
          >
            Enter Operator Portal
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
          <p className="text-xs text-muted-foreground">
            AgriTrust · Operator Portal for agricultural collection centres
          </p>
        </div>
      </section>
    </div>
  );
}
