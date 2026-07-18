"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import { site, whatsappLink, telLink } from "@/data/site";
import { leadSchema } from "@/lib/leadSchema";

type FieldKey = "name" | "phone" | "email" | "venture" | "budget" | "message";
type FieldErrors = Partial<Record<FieldKey, string>>;

const budgets = [
  "Under ₹25 Lakhs",
  "₹25 – 50 Lakhs",
  "₹50 Lakhs – ₹1 Cr",
  "₹1 – 2 Cr",
  "₹2 Cr+",
];

const trust = [
  { value: "HMDA / DTCP", label: "approved layouts" },
  { value: "100%", label: "clear titles" },
  { value: "ORR", label: "growth corridor" },
  { value: "24×7", label: "gated security" },
];

const inputBase =
  "peer h-12 w-full rounded-lg border border-line bg-white px-3.5 pt-4 pb-1 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 aria-[invalid=true]:border-red-400";

const floatLabel =
  "pointer-events-none absolute left-3.5 top-2 text-[11px] text-slate transition-all " +
  "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm " +
  "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-gold-deep";

function TextField(props: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email";
  error?: string;
}) {
  const { id, label, value, onChange, type = "text", autoComplete, inputMode, error } = props;
  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={!!error}
          className={inputBase}
        />
        <label htmlFor={id} className={floatLabel}>
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface VentureOption {
  slug: string;
  name: string;
}

export default function HeroEnquiry({
  hero,
  ventures,
}: {
  hero: { title: string; subtitle: string; image: string };
  ventures: VentureOption[];
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    venture: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const set =
    (k: FieldKey) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const v = e.target.value;
      setForm((f) => ({ ...f, [k]: v }));
      setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
    };

  function reset() {
    setStatus("idle");
    setForm({ name: "", phone: "", email: "", venture: "", budget: "", message: "" });
    setErrors({});
    setServerError("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldKey | undefined;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, source: "Home Page" }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
    } catch {
      setStatus("error");
      setServerError("Something went wrong. Please call or WhatsApp us instead.");
    }
  }

  const firstName = form.name.trim().split(" ")[0];
  const [titleLead, ...titleRestParts] = hero.title.split(",");
  const titleRest = titleRestParts.join(",").trim();

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
     <Image
  src={hero.image || "/ventures/sree-city.jpg"}
  alt="Sharanya Properties Hero"
  fill
  priority
  sizes="100vw"
  className="
    object-cover
    object-center
    opacity-100
    brightness-105
    contrast-105
    saturate-110
  "
/>

{/* Main Overlay */}
<div
  className="absolute inset-0 bg-gradient-to-r
  from-black/45
  via-black/18
  to-transparent"
  aria-hidden
/>

{/* Bottom fade for smooth transition */}
<div
  className="absolute inset-0 bg-gradient-to-t
  from-black/25
  via-transparent
  to-transparent"
  aria-hidden
/>

{/* Grid */}
<div
  className="absolute inset-0 plot-grid opacity-15"
  aria-hidden
/>

{/* Warm glow */}
<div
  className="absolute -right-32 top-1/4
  h-[26rem]
  w-[26rem]
  rounded-full
  bg-gold/10
  blur-3xl"
  aria-hidden
/>

{/* Soft blue glow */}
<div
  className="absolute -left-24 bottom-0
  h-[20rem]
  w-[20rem]
  rounded-full
  bg-sky-700/10
  blur-3xl"
  aria-hidden
/>
      <div className="wrap relative py-14 md:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          {/* ── Left: proposition ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" aria-hidden />
              <span className="eyebrow text-gold-soft">Plotted developments · {site.city}</span>
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              {titleLead}
              {titleRest ? "," : ""}
              {titleRest && (
                <>
                  <br />
                  <span className="text-gold-soft">{titleRest}</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/70">
              {hero.subtitle}
            </p>

            <ul className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {trust.map((t) => (
                <li key={t.label} className="flex items-center gap-2 text-paper/80">
                  <ShieldCheck className="h-4 w-4 flex-none text-gold-soft" aria-hidden />
                  <span>
                    <span className="font-semibold text-paper">{t.value}</span> {t.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-light"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp now
              </a>
              <a href={telLink()} className="btn-ghost-light">
                <Phone className="h-4 w-4" aria-hidden /> Call {site.phoneDisplay}
              </a>
            </div>
          </motion.div>

          {/* ── Right: enquiry form ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-paper p-5 shadow-lift sm:p-6"
          >
            <span className="eyebrow text-gold-deep">Enquire now</span>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink">Request a callback</h2>
            <p className="mt-1 text-sm text-slate-ink">
              Share a few details and our team will call you shortly.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-5 space-y-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <TextField
                  id="he-name"
                  label="Full name"
                  value={form.name}
                  onChange={set("name")}
                  autoComplete="name"
                  error={errors.name}
                />
                <TextField
                  id="he-phone"
                  label="Mobile number"
                  value={form.phone}
                  onChange={set("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  error={errors.phone}
                />
              </div>

              <TextField
                id="he-email"
                label="Email address (optional)"
                value={form.email}
                onChange={set("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                error={errors.email}
              />

              <div className="grid gap-3.5 sm:grid-cols-2">
                {/* Preferred venture */}
                <div>
                  <div className="relative">
                    <select
                      id="he-venture"
                      value={form.venture}
                      onChange={set("venture")}
                      className={`h-12 w-full appearance-none rounded-lg border border-line bg-white px-3.5 pt-4 pb-1 pr-9 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 ${
                        form.venture ? "text-ink" : "text-slate"
                      }`}
                    >
                      <option value="">Select a venture</option>
                      {ventures.map((v) => (
                        <option key={v.slug} value={v.name} className="text-ink">
                          {v.name}
                        </option>
                      ))}
                      <option value="Not sure yet" className="text-ink">
                        Not sure yet
                      </option>
                    </select>
                    <label htmlFor="he-venture" className="pointer-events-none absolute left-3.5 top-2 text-[11px] text-slate">
                      Preferred venture
                    </label>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
                      aria-hidden
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <div className="relative">
                    <select
                      id="he-budget"
                      value={form.budget}
                      onChange={set("budget")}
                      className={`h-12 w-full appearance-none rounded-lg border border-line bg-white px-3.5 pt-4 pb-1 pr-9 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 ${
                        form.budget ? "text-ink" : "text-slate"
                      }`}
                    >
                      <option value="">Select a budget</option>
                      {budgets.map((b) => (
                        <option key={b} value={b} className="text-ink">
                          {b}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="he-budget" className="pointer-events-none absolute left-3.5 top-2 text-[11px] text-slate">
                      Budget
                    </label>
                    <ChevronDown
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="relative">
                  <textarea
                    id="he-message"
                    value={form.message}
                    onChange={set("message")}
                    rows={3}
                    placeholder=" "
                    className="peer w-full resize-none rounded-lg border border-line bg-white px-3.5 pb-2 pt-5 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
                  />
                  <label
                    htmlFor="he-message"
                    className="pointer-events-none absolute left-3.5 top-2 text-[11px] text-slate transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-gold-deep"
                  >
                    Message (optional)
                  </label>
                </div>
              </div>

              {serverError && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-gold w-full disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
                  </>
                ) : (
                  <>
                    Get a callback <ArrowRight className="h-4 w-4" aria-hidden />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate">
                By submitting, you agree to be contacted about your enquiry. We never share your
                details.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* ── Success popup ───────────────────────────────── */}
      <AnimatePresence>
        {status === "done" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={reset} aria-hidden />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="he-success-title"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-sm rounded-2xl bg-paper p-6 text-center shadow-lift"
            >
              <button
                onClick={reset}
                aria-label="Close"
                className="absolute right-3 top-3 rounded-full p-1.5 text-slate transition hover:bg-line/60 hover:text-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink">
                <Check className="h-6 w-6" aria-hidden />
              </div>
              <h3 id="he-success-title" className="mt-4 font-display text-xl font-semibold text-ink">
                Enquiry received
              </h3>
              <p className="mt-2 text-sm text-slate-ink">
                Thanks{firstName ? `, ${firstName}` : ""}. Our team will call you shortly. For a
                faster reply, message us on WhatsApp.
              </p>
              <a
                href={whatsappLink(
                  `Hi, I just enquired${form.venture ? ` about ${form.venture}` : ""}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-4 w-full"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> Continue on WhatsApp
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
