import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer } from "@/components/Header";
import { IndiaMap } from "@/components/IndiaMap";
import { CAB_TYPES, formatINR, PLACES } from "@/lib/ucab-data";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div className="flex flex-col justify-center">
              <span className="w-fit rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                Rides across India · Pay in ₹
              </span>
              <h1 className="mt-4 text-5xl leading-tight md:text-6xl">
                Book a cab in <span className="text-primary bg-secondary px-2">Hyderabad</span> or <span className="bg-accent px-2">Bhimavaram</span> in seconds.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                Ucab makes travel simple, reliable, and stress-free — from HITEC City runs to Bhimavaram station pickups. Live tracking, transparent INR fares, saved payments.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/book" className="rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground shadow-lg hover:opacity-90">
                  Book a Ride →
                </Link>
                <Link to="/login" className="rounded-lg border border-secondary px-6 py-3 font-semibold text-secondary hover:bg-secondary hover:text-secondary-foreground">
                  Login
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
                <Stat k="50k+" v="Rides completed" />
                <Stat k="4.8★" v="Avg. rating" />
                <Stat k="24/7" v="Support" />
              </div>
            </div>
            <div className="relative h-[420px] rounded-2xl border border-border shadow-xl">
              <IndiaMap from={PLACES[1]} to={PLACES[6]} animate />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-md backdrop-blur">
                <div className="text-xs text-muted-foreground">Sample route</div>
                <div className="font-semibold">HITEC City → Bhimavaram Rly Stn</div>
                <div className="mt-1 text-sm text-secondary">~380 km · {formatINR(380 * 16 + 60)} in Sedan</div>
              </div>
            </div>
          </div>
        </section>

        {/* Cab types */}
        <section className="bg-muted/40 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl md:text-4xl">Choose your ride</h2>
            <p className="mt-2 text-muted-foreground">Fares shown for a 5 km city ride. All prices in Indian Rupees.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CAB_TYPES.map(c => (
                <div key={c.id} className="rounded-xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="text-4xl">{c.emoji}</div>
                  <div className="mt-3 text-lg font-bold">{c.name}</div>
                  <div className="text-sm text-muted-foreground">{c.desc}</div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-extrabold text-secondary">{formatINR(c.base + c.perKm * 5)}</div>
                      <div className="text-xs text-muted-foreground">{c.seats} seats · ETA {c.eta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl md:text-4xl">Why Ucab?</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <Feature emoji="📍" title="Live tracking" desc="Follow your cab in real time from pickup to drop-off." />
              <Feature emoji="💳" title="Instant INR payments" desc="UPI, cards, wallets — saved for one-tap checkout." />
              <Feature emoji="🎁" title="Discounts & donations" desc="Ride offers plus optional donations to local causes." />
              <Feature emoji="🥤" title="Order refreshments" desc="Grab a chai or water bottle during long rides." />
              <Feature emoji="🛡️" title="Verified drivers" desc="Every partner is background-verified and rated." />
              <Feature emoji="📜" title="Complete history" desc="Every trip, receipt, and route in one place." />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary py-16 text-secondary-foreground">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl md:text-4xl">Your ride is one tap away.</h2>
              <p className="mt-2 text-secondary-foreground/70">From Charminar to SRKR College — Ucab has you covered.</p>
            </div>
            <Link to="/book" className="rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg hover:opacity-90">
              Book now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-2xl font-extrabold text-secondary">{k}</div>
      <div className="text-xs text-muted-foreground">{v}</div>
    </div>
  );
}

function Feature({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="text-3xl">{emoji}</div>
      <div className="mt-3 text-lg font-bold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
