import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-semibold text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-slate-ink">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn-gold mt-6">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to home
      </Link>
    </div>
  );
}
