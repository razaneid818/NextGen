"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TutorSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    subjects: "",
    hourlyRateUSD: "",
    littleCoders: false,
    youngCoders: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const ageGroups = [
      form.littleCoders && "LITTLE_4_7",
      form.youngCoders && "YOUNG_7_12",
    ].filter(Boolean);

    const res = await fetch("/api/signup/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        bio: form.bio,
        subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        ageGroups,
        hourlyRateUSD: Number(form.hourlyRateUSD),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Could not submit application.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-navy-900">Application submitted</h1>
        <p className="mt-4 text-gray-600">
          Thanks for applying to teach with NextGen. Our team reviews every application —
          we'll email you once it's been reviewed. You can log in any time to check your
          status.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold text-navy-900">Apply to teach with NextGen</h1>
      <p className="mt-2 text-gray-600">
        Every tutor is personally reviewed and approved before appearing in the marketplace.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-semibold">Full name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold">Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold">Bio (teaching background, experience)</label>
          <textarea required minLength={20} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" rows={4} />
        </div>
        <div>
          <label className="text-sm font-semibold">Subjects (comma-separated, e.g. Scratch, Python, Roblox Studio)</label>
          <input required value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold">Hourly rate (USD)</label>
          <input type="number" min={1} step="0.01" required value={form.hourlyRateUSD} onChange={(e) => setForm({ ...form, hourlyRateUSD: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.littleCoders} onChange={(e) => setForm({ ...form, littleCoders: e.target.checked })} /> Little Coders (4–7)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.youngCoders} onChange={(e) => setForm({ ...form, youngCoders: e.target.checked })} /> Young Coders (7–12)
          </label>
        </div>
        {error && <p className="text-sm text-coral-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
}
