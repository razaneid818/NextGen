"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ParentSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/signup/parent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : "Could not create account.");
      return;
    }
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold text-navy-900">Create a parent account</h1>
      <p className="mt-2 text-gray-600">Book 1-on-1 coding lessons for your child.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {(
          [
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["password", "Password (min 8 characters)", "password"],
            ["phone", "Phone (optional)", "tel"],
          ] as const
        ).map(([key, label, type]) => (
          <div key={key}>
            <label className="text-sm font-semibold">{label}</label>
            <input
              type={type}
              required={key !== "phone"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
            />
          </div>
        ))}
        {error && <p className="text-sm text-coral-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
