import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header, Footer } from "@/components/Header";
import { IndiaMap } from "@/components/IndiaMap";
import { CAB_TYPES, PLACES, estimateDistanceKm, formatINR, saveBooking, type Place, type CabType } from "@/lib/ucab-data";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [{ title: "Book a Ride — Ucab" }, { name: "description", content: "Book a cab in Hyderabad, Bhimavaram, or intercity. INR fares, instant confirmation." }] }),
  component: Book,
});

function Book() {
  const nav = useNavigate();
  const [from, setFrom] = useState<Place | null>(PLACES[1]);
  const [to, setTo] = useState<Place | null>(PLACES[0]);
  const [cab, setCab] = useState<CabType>(CAB_TYPES[1]);
  const [promo, setPromo] = useState("");

  const distance = useMemo(() => (from && to && from.id !== to.id ? estimateDistanceKm(from, to) : 0), [from, to]);
  const baseFare = cab.base + cab.perKm * distance;
  const discount = promo.trim().toUpperCase() === "UCAB10" ? Math.round(baseFare * 0.1) : 0;
  const tax = Math.round((baseFare - discount) * 0.05);
  const total = Math.max(0, Math.round(baseFare - discount + tax));

  const confirm = () => {
    if (!from || !to || from.id === to.id) return;
    const id = "UC" + Date.now().toString().slice(-6);
    saveBooking({
      id, from, to, cab, distanceKm: distance, fare: total,
      createdAt: new Date().toISOString(), status: "ongoing",
    });
    nav({ to: "/track", search: { id } as any });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl md:text-4xl">Book a ride</h1>
        <p className="mt-1 text-muted-foreground">Pickups in Hyderabad & Bhimavaram. Intercity available.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Route</div>
              <div className="mt-4 space-y-3">
                <PlaceSelect label="Pickup" value={from} onChange={setFrom} accent="accent" />
                <PlaceSelect label="Drop-off" value={to} onChange={setTo} accent="primary" />
              </div>
              {from && to && from.id === to.id && (
                <p className="mt-3 text-sm text-destructive">Pickup and drop-off must differ.</p>
              )}
              {distance > 0 && (
                <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                  Estimated distance: <span className="font-bold">{distance} km</span>
                  {from!.city !== to!.city && <span className="ml-2 rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">Intercity</span>}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Choose cab</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {CAB_TYPES.map(c => {
                  const fare = c.base + c.perKm * (distance || 5);
                  const active = cab.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCab(c)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${active ? "border-secondary bg-secondary text-secondary-foreground" : "border-border hover:border-secondary"}`}
                    >
                      <div className="text-3xl">{c.emoji}</div>
                      <div className="flex-1">
                        <div className="font-bold">{c.name}</div>
                        <div className={`text-xs ${active ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>{c.seats} seats · ETA {c.eta}</div>
                      </div>
                      <div className="font-extrabold">{formatINR(fare)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Promo & Extras</div>
              <input
                value={promo}
                onChange={e => setPromo(e.target.value)}
                placeholder="Try UCAB10 for 10% off"
                className="mt-3 w-full rounded-lg border border-input bg-transparent px-3 py-2.5 outline-none"
              />
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-accent/40 px-3 py-1 font-semibold">🥤 Add refreshments</span>
                <span className="rounded-full bg-primary/30 px-3 py-1 font-semibold">❤️ Donate ₹5 to cause</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-[380px]">
              <IndiaMap from={from} to={to} animate />
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fare breakdown</div>
              <dl className="mt-4 space-y-2 text-sm">
                <Row k={`Base (${cab.name})`} v={formatINR(cab.base)} />
                <Row k={`Distance (${distance || 0} km × ${formatINR(cab.perKm)})`} v={formatINR(cab.perKm * distance)} />
                {discount > 0 && <Row k="Promo UCAB10" v={"−" + formatINR(discount)} />}
                <Row k="GST (5%)" v={formatINR(tax)} />
                <div className="my-2 border-t border-border" />
                <div className="flex justify-between text-lg font-extrabold">
                  <span>Total</span><span>{formatINR(total)}</span>
                </div>
              </dl>
              <button
                onClick={confirm}
                disabled={!from || !to || from.id === to.id || distance === 0}
                className="mt-5 w-full rounded-lg bg-primary py-3 font-extrabold text-primary-foreground shadow-md hover:opacity-90 disabled:opacity-50"
              >
                Confirm Booking · {formatINR(total)}
              </button>
              <p className="mt-2 text-center text-xs text-muted-foreground">Payment via UPI / Cards / Wallet · All fares in ₹ INR</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{k}</span><span className="font-semibold text-foreground">{v}</span>
    </div>
  );
}

function PlaceSelect({ label, value, onChange, accent }: { label: string; value: Place | null; onChange: (p: Place) => void; accent: "accent" | "primary" }) {
  const dot = accent === "accent" ? "bg-accent" : "bg-primary";
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} /> {label}
      </div>
      <select
        value={value?.id ?? ""}
        onChange={e => {
          const p = PLACES.find(x => x.id === e.target.value);
          if (p) onChange(p);
        }}
        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none"
      >
        <optgroup label="Hyderabad">
          {PLACES.filter(p => p.city === "Hyderabad").map(p => (
            <option key={p.id} value={p.id}>{p.name} — {p.area}</option>
          ))}
        </optgroup>
        <optgroup label="Bhimavaram">
          {PLACES.filter(p => p.city === "Bhimavaram").map(p => (
            <option key={p.id} value={p.id}>{p.name} — {p.area}</option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}
