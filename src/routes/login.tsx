import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header, Footer } from "@/components/Header";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Ucab" }, { name: "description", content: "Login to Ucab to book cabs across India." }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) { setOtpSent(true); return; }
    if (otp.length >= 4) {
      localStorage.setItem("ucab_user", JSON.stringify({ phone, name: "Guest Rider" }));
      nav({ to: "/book" });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-md flex-col justify-center px-6 py-20">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <h1 className="text-3xl">Welcome to Ucab</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with your mobile number to book rides in India.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">Mobile number</label>
              <div className="mt-1 flex overflow-hidden rounded-lg border border-input">
                <span className="flex items-center bg-muted px-3 text-sm font-semibold">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  disabled={otpSent}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-transparent px-3 py-2.5 outline-none"
                  placeholder="98765 43210"
                />
              </div>
            </div>
            {otpSent && (
              <div>
                <label className="text-sm font-semibold">OTP</label>
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="mt-1 w-full rounded-lg border border-input bg-transparent px-3 py-2.5 outline-none"
                  placeholder="Enter 4-digit OTP (demo: 1234)"
                />
                <p className="mt-1 text-xs text-muted-foreground">Demo mode — any 4+ digits works.</p>
              </div>
            )}
            <button className="w-full rounded-lg bg-secondary py-3 font-bold text-secondary-foreground hover:opacity-90">
              {otpSent ? "Verify & Continue" : "Send OTP"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
