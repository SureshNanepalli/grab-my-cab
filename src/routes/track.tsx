import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Header, Footer } from "@/components/Header";
import { IndiaMap } from "@/components/IndiaMap";
import { formatINR, loadBookings, updateBooking, type Booking } from "@/lib/ucab-data";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track Ride — Ucab" }, { name: "description", content: "Live-track your Ucab ride." }] }),
  validateSearch: (s: Record<string, unknown>) => ({ id: (s.id as string) || "" }),
  component: Track,
});

const STAGES = ["Driver assigned", "Driver arriving", "Ride started", "Reaching destination", "Completed"];

function Track() {
  const { id } = useSearch({ from: "/track" });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const b = loadBookings().find(x => x.id === id) || loadBookings()[0] || null;
    setBooking(b);
  }, [id]);

  useEffect(() => {
    if (!booking) return;
    const t = setInterval(() => setStage(s => Math.min(s + 1, STAGES.length - 1)), 3500);
    return () => clearInterval(t);
  }, [booking]);

  useEffect(() => {
    if (booking && stage === STAGES.length - 1) {
      updateBooking(booking.id, { status: "completed" });
    }
  }, [stage, booking]);

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-3xl">No active ride</h1>
          <p className="mt-2 text-muted-foreground">Book a ride to see live tracking.</p>
          <Link to="/book" className="mt-6 inline-flex rounded-lg bg-secondary px-5 py-3 font-bold text-secondary-foreground">Book a Ride</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Booking</div>
            <h1 className="text-3xl">#{booking.id}</h1>
          </div>
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">{STAGES[stage]}</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="h-[440px]">
            <IndiaMap from={booking.from} to={booking.to} animate />
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl text-secondary-foreground">{booking.cab.emoji}</div>
                <div>
                  <div className="font-bold">{booking.cab.name} · TS 09 AB 1234</div>
                  <div className="text-sm text-muted-foreground">Ravi Kumar · ⭐ 4.9</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-muted-foreground">Fare</div>
                  <div className="text-lg font-extrabold">{formatINR(booking.fare)}</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-lg border border-secondary py-2 text-sm font-semibold text-secondary">📞 Call</button>
                <button className="flex-1 rounded-lg border border-secondary py-2 text-sm font-semibold text-secondary">💬 Message</button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Trip</div>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                  <div><div className="font-semibold">{booking.from.name}</div><div className="text-muted-foreground">{booking.from.area}, {booking.from.city}</div></div>
                </div>
                <div className="ml-1 h-6 border-l-2 border-dashed border-muted-foreground/40" />
                <div className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  <div><div className="font-semibold">{booking.to.name}</div><div className="text-muted-foreground">{booking.to.area}, {booking.to.city}</div></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progress</div>
              <ol className="mt-3 space-y-2">
                {STAGES.map((s, i) => (
                  <li key={s} className={`flex items-center gap-2 text-sm ${i <= stage ? "font-semibold" : "text-muted-foreground"}`}>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${i <= stage ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{i <= stage ? "✓" : i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
