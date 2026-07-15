import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer } from "@/components/Header";
import { formatINR, loadBookings, type Booking } from "@/lib/ucab-data";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Ride History — Ucab" }, { name: "description", content: "See all your Ucab rides, receipts, and fares in INR." }] }),
  component: History,
});

function History() {
  const [items, setItems] = useState<Booking[]>([]);
  useEffect(() => { setItems(loadBookings()); }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl md:text-4xl">Ride history</h1>
        <p className="mt-1 text-muted-foreground">All rides across Hyderabad, Bhimavaram, and intercity.</p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
            <div className="text-5xl">🚕</div>
            <div className="mt-3 font-bold">No rides yet</div>
            <p className="text-sm text-muted-foreground">Your booked rides will appear here.</p>
            <Link to="/book" className="mt-5 inline-flex rounded-lg bg-secondary px-4 py-2 font-semibold text-secondary-foreground">Book your first ride</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {items.map(b => (
              <div key={b.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{b.cab.emoji}</div>
                    <div>
                      <div className="font-bold">{b.from.name} → {b.to.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(b.createdAt).toLocaleString("en-IN")} · {b.cab.name} · {b.distanceKm} km
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold">{formatINR(b.fare)}</div>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${b.status === "completed" ? "bg-accent/50" : "bg-primary/40"}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
