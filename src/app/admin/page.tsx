import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { queryLeads } from "@/lib/leads";
import { LEAD_STATUS_STYLES } from "@/lib/leadStatus";
import {
  getDashboardStats,
  getLeadTrend,
  getMonthlyEnquiries,
  getRecentActivity,
} from "@/lib/dashboard";
import AreaChart from "@/components/admin/AreaChart";
import BarChart from "@/components/admin/BarChart";
import {
  Lock,
  Users2,
  Building2,
  Images,
  FileDown,
  MessageSquareQuote,
  Clock,
  Settings,
  Library,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin · Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) +
    ", " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return fmtDate(iso);
}

const card = "rounded-xl border border-line bg-white p-5 shadow-card";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const [stats, trend, monthly, activity, recent] = await Promise.all([
    getDashboardStats(),
    getLeadTrend(30),
    getMonthlyEnquiries(6),
    getRecentActivity(8),
    queryLeads({ sort: "newest", limit: 8 }),
  ]);
  const recentLeads = recent.leads;

  const cards = [
    { label: "Total leads", value: stats.leads, icon: Users2, href: "/admin/leads" },
    { label: "Ventures", value: stats.ventures, icon: Building2, href: "/admin/ventures" },
    { label: "Gallery images", value: stats.media, icon: Images, href: "/admin/media" },
    { label: "Downloads", value: stats.downloads, icon: FileDown, href: "/admin/downloads" },
    { label: "Testimonials", value: stats.testimonials, icon: MessageSquareQuote, href: "/admin/testimonials" },
  ];

  return (
    <div className="wrap py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-paper">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.email && (
            <span className="hidden text-sm text-slate sm:inline">{session.user.email}</span>
          )}
          <Link href="/admin/library" className="btn-ghost text-sm">
            <Library className="h-4 w-4" aria-hidden /> Library
          </Link>
          <Link href="/admin/settings" className="btn-ghost text-sm">
            <Settings className="h-4 w-4" aria-hidden /> Settings
          </Link>
          <SignOutButton />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <p className="font-display text-3xl font-semibold text-ink">{c.value}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/12 text-gold-deep">
                  <c.icon className="h-4 w-4" aria-hidden />
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate">{c.label}</p>
            </>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className={`${card} block transition hover:border-gold/50 hover:shadow-lift`}>
              {inner}
            </Link>
          ) : (
            <div key={c.label} className={card}>
              {inner}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className={card}>
          <p className="text-sm font-semibold text-ink">Lead trend</p>
          <p className="text-xs text-slate">Enquiries per day · last 30 days</p>
          <div className="mt-3">
            <AreaChart data={trend} />
          </div>
        </div>
        <div className={card}>
          <p className="text-sm font-semibold text-ink">Monthly enquiries</p>
          <p className="text-xs text-slate">Last 6 months</p>
          <div className="mt-3">
            <BarChart data={monthly} />
          </div>
        </div>
      </div>

      {/* Recent leads + activity */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Recent leads</p>
            <Link href="/admin/leads" className="text-xs font-medium text-gold-deep hover:underline">
              Manage all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="mt-4 text-sm text-slate">No leads yet.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-slate">
                    <th className="pb-2 pr-3 font-medium">Name</th>
                    <th className="pb-2 pr-3 font-medium">Phone</th>
                    <th className="pb-2 pr-3 font-medium">Venture</th>
                    <th className="pb-2 pr-3 font-medium">Status</th>
                    <th className="pb-2 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((l) => (
                    <tr key={l.id} className="border-b border-line/60 last:border-0">
                      <td className="py-2.5 pr-3 font-medium text-ink">{l.name}</td>
                      <td className="py-2.5 pr-3 text-slate-ink">{l.phone}</td>
                      <td className="py-2.5 pr-3 text-slate-ink">{l.project ?? "—"}</td>
                      <td className="py-2.5 pr-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            LEAD_STATUS_STYLES[l.status] ?? "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-xs text-slate">{fmtDate(l.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={card}>
          <p className="text-sm font-semibold text-ink">Recent activity</p>
          {activity.length === 0 ? (
            <p className="mt-4 text-sm text-slate">No recent activity.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {activity.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gold/12 text-gold-deep">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{a.title}</p>
                    {a.detail && <p className="truncate text-xs text-slate">{a.detail}</p>}
                    <p className="text-[11px] text-slate">{timeAgo(a.at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
