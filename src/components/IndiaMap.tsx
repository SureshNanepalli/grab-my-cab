import type { Place } from "@/lib/ucab-data";

type Props = {
  from?: Place | null;
  to?: Place | null;
  animate?: boolean;
};

// Stylized illustrative map showing Hyderabad + Bhimavaram (Andhra/Telangana region)
export function IndiaMap({ from, to, animate }: Props) {
  // Coord ranges roughly covering AP/TS
  const minLat = 16.3, maxLat = 17.6, minLng = 78.2, maxLng = 81.7;
  const project = (p: Place) => {
    const x = ((p.lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((p.lat - minLat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const hyd = { x: ((78.42 - minLng) / (maxLng - minLng)) * 100, y: 100 - ((17.4 - minLat) / (maxLat - minLat)) * 100 };
  const bvrm = { x: ((81.52 - minLng) / (maxLng - minLng)) * 100, y: 100 - ((16.55 - minLat) / (maxLat - minLat)) * 100 };

  const a = from ? project(from) : null;
  const b = to ? project(to) : null;

  return (
    <div className="map-grid relative h-full w-full overflow-hidden rounded-xl border border-border">
      {/* Region silhouette */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M5,20 Q15,10 30,15 T60,20 Q80,18 92,30 Q95,50 88,70 Q75,90 55,88 Q30,92 15,80 Q3,60 5,20 Z"
          fill="oklch(0.94 0.06 145 / 0.55)"
          stroke="oklch(0.55 0.1 145 / 0.5)"
          strokeWidth="0.4"
        />
        {/* Krishna/Godavari-ish rivers */}
        <path d="M20,30 Q40,45 65,55 T95,70" fill="none" stroke="oklch(0.7 0.12 230 / 0.7)" strokeWidth="0.6" />
        <path d="M15,55 Q35,65 60,72 T90,85" fill="none" stroke="oklch(0.7 0.12 230 / 0.5)" strokeWidth="0.5" />

        {/* Route line */}
        {a && b && (
          <line
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="oklch(0.5 0.2 60)"
            strokeWidth="0.7"
            strokeDasharray="1.5 1"
            className={animate ? "animate-pulse" : ""}
          />
        )}
      </svg>

      {/* City labels */}
      <MapDot x={hyd.x} y={hyd.y} label="Hyderabad" muted />
      <MapDot x={bvrm.x} y={bvrm.y} label="Bhimavaram" muted />

      {a && <MapDot x={a.x} y={a.y} label={from!.name} kind="from" />}
      {b && <MapDot x={b.x} y={b.y} label={to!.name} kind="to" />}
    </div>
  );
}

function MapDot({ x, y, label, kind, muted }: { x: number; y: number; label: string; kind?: "from" | "to"; muted?: boolean }) {
  const color = kind === "from" ? "bg-accent" : kind === "to" ? "bg-primary" : "bg-secondary/40";
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className={`h-3 w-3 rounded-full ring-2 ring-white ${color}`} />
      <div className={`mt-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${muted ? "bg-white/70 text-secondary/70" : "bg-secondary text-secondary-foreground"}`}>
        {label}
      </div>
    </div>
  );
}
