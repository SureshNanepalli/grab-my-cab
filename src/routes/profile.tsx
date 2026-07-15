import { createFileRoute } from "@tanstack/react-router";
import { Header, Footer } from "@/components/Header";
import { formatINR, loadBookings } from "@/lib/ucab-data";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Ucab" }, { name: "description", content: "Manage your Ucab profile, saved places, and payment methods." }] }),
  component: Profile,
});

function Profile() {
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [totals, setTotals] = useState({ trips: 0, spent: 0 });

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem("ucab_user") || "null")); } catch {}
    const bs = loadBookings();
    setTotals({ trips: bs.length, spent: bs.reduce((a, b) => a + b.fare, 0) });
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-3xl font-extrabold text-primary">
              {(user?.name?.[0] ?? "G").toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl">{user?.name ?? "Guest Rider"}</h1>
              <p className="text-muted-foreground">{user?.phone ? `+91 ${user.phone}` : "Not logged in"}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card k="Total trips" v={String(totals.trips)} />
            <Card k="Total spent" v={formatINR(totals.spent)} />
            <Card k="Home city" v="Hyderabad" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Panel title="Saved places">
            <Place label="🏠 Home" value="Banjara Hills, Hyderabad" />
            <Place label="🏢 Work" value="HITEC City, Madhapur" />
            <Place label="🎓 College" value="SRKR College, Bhimavaram" />
          </Panel>
          <Panel title="Payment methods">
            <Place label="💳 UPI" value="rider@upi (Primary)" />
            <Place label="💳 HDFC Card" value="•••• 4521" />
            <Place label="👛 Ucab Wallet" value={formatINR(250) + " balance"} />
          </Panel>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Card({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4">
      <div className="text-xs font-bold uppercase text-muted-foreground">{k}</div>
      <div className="mt-1 text-2xl font-extrabold">{v}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Place({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm">
      <span className="font-semibold">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}
