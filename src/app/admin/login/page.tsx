"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-ink px-5 py-16">
      <Image src="/ventures/serenity-heights.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-[0.32] [filter:saturate(1.15)_contrast(1.05)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/92 via-ink/78 to-[#12233a]/95" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" aria-hidden />
      <div className="absolute inset-0 plot-grid opacity-50" aria-hidden />
      <div className="absolute -right-24 top-1/5 h-80 w-80 rounded-full bg-gold/15 blur-3xl" aria-hidden />
      <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#1f4a7a]/25 blur-3xl" aria-hidden />
      <div className="relative w-full max-w-sm rounded-2xl bg-paper p-6 shadow-lift sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-paper">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="eyebrow text-gold-deep">Admin</p>
            <h1 className="font-display text-xl font-semibold text-ink">Sign in</h1>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="you@company.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-ink w-full disabled:opacity-70">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
