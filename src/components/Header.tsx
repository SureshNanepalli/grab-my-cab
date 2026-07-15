import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
            <span className="text-lg font-extrabold">U</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight">Ucab</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          <Link to="/book" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Book a Ride</Link>
          <Link to="/track" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Track</Link>
          <Link to="/history" className="hover:text-primary" activeProps={{ className: "text-primary" }}>History</Link>
          <Link to="/profile" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Profile</Link>
        </nav>
        <Link to="/login" className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:opacity-90">
          Login
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <div className="text-lg font-extrabold">Ucab</div>
            <p className="mt-1 text-secondary-foreground/70">Rides across India, from Hyderabad to Bhimavaram.</p>
          </div>
          <div className="text-secondary-foreground/60">© {new Date().getFullYear()} Ucab India Pvt. Ltd. All rides in ₹ INR.</div>
        </div>
      </div>
    </footer>
  );
}
