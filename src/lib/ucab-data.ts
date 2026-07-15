export type CabType = {
  id: string;
  name: string;
  desc: string;
  seats: number;
  perKm: number;
  base: number;
  eta: string;
  emoji: string;
};

export const CAB_TYPES: CabType[] = [
  { id: "mini", name: "Ucab Mini", desc: "Compact, budget-friendly", seats: 4, perKm: 12, base: 40, eta: "3 min", emoji: "🚗" },
  { id: "sedan", name: "Ucab Sedan", desc: "Comfortable AC sedan", seats: 4, perKm: 16, base: 60, eta: "5 min", emoji: "🚙" },
  { id: "suv", name: "Ucab SUV", desc: "Spacious for groups", seats: 6, perKm: 22, base: 90, eta: "7 min", emoji: "🚐" },
  { id: "auto", name: "Ucab Auto", desc: "Quick short rides", seats: 3, perKm: 10, base: 30, eta: "2 min", emoji: "🛺" },
];

export type Place = { id: string; name: string; area: string; city: string; lat: number; lng: number };

export const PLACES: Place[] = [
  // Hyderabad
  { id: "hyd-airport", name: "Rajiv Gandhi Intl. Airport", area: "Shamshabad", city: "Hyderabad", lat: 17.24, lng: 78.43 },
  { id: "hyd-hitec", name: "HITEC City", area: "Madhapur", city: "Hyderabad", lat: 17.44, lng: 78.38 },
  { id: "hyd-charminar", name: "Charminar", area: "Old City", city: "Hyderabad", lat: 17.36, lng: 78.47 },
  { id: "hyd-secunderabad", name: "Secunderabad Rly Stn", area: "Secunderabad", city: "Hyderabad", lat: 17.43, lng: 78.50 },
  { id: "hyd-banjara", name: "Banjara Hills", area: "Road No. 12", city: "Hyderabad", lat: 17.41, lng: 78.44 },
  { id: "hyd-gachibowli", name: "Gachibowli Stadium", area: "Gachibowli", city: "Hyderabad", lat: 17.44, lng: 78.34 },
  // Bhimavaram
  { id: "bvrm-station", name: "Bhimavaram Town Rly Stn", area: "Bhimavaram", city: "Bhimavaram", lat: 16.54, lng: 81.52 },
  { id: "bvrm-svbc", name: "SRKR Engineering College", area: "China Amiram", city: "Bhimavaram", lat: 16.55, lng: 81.51 },
  { id: "bvrm-mavullamma", name: "Mavullamma Temple", area: "Juvvalapalem Rd", city: "Bhimavaram", lat: 16.55, lng: 81.53 },
  { id: "bvrm-busstand", name: "Bhimavaram Bus Stand", area: "Main Rd", city: "Bhimavaram", lat: 16.55, lng: 81.52 },
  { id: "bvrm-market", name: "Gunupudi Market", area: "Gunupudi", city: "Bhimavaram", lat: 16.54, lng: 81.51 },
];

export function estimateDistanceKm(from: Place, to: Place): number {
  if (from.city !== to.city) return 380; // Hyderabad ↔ Bhimavaram approx
  const dLat = (to.lat - from.lat);
  const dLng = (to.lng - from.lng);
  const km = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
  return Math.max(2, Math.round(km * 10) / 10);
}

export function formatINR(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export type Booking = {
  id: string;
  from: Place;
  to: Place;
  cab: CabType;
  distanceKm: number;
  fare: number;
  createdAt: string;
  status: "ongoing" | "completed";
};

const KEY = "ucab_bookings";

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveBooking(b: Booking) {
  const all = loadBookings();
  all.unshift(b);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function updateBooking(id: string, patch: Partial<Booking>) {
  const all = loadBookings().map(b => b.id === id ? { ...b, ...patch } : b);
  localStorage.setItem(KEY, JSON.stringify(all));
}
