"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ChildOption {
  id: string;
  firstName: string;
}

export default function BookSessionForm({
  tutorId,
  hourlyRateUSD,
}: {
  tutorId: string;
  hourlyRateUSD: number;
}) {
  const router = useRouter();
  const [children, setChildren] = useState<ChildOption[]>([]);
  const [childId, setChildId] = useState("");
  const [type, setType] = useState<"DISCOVERY" | "PAID">("DISCOVERY");
  const [start, setStart] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/children")
      .then((r) => (r.ok ? r.json() : { children: [] }))
      .then((d) => {
        setChildren(d.children ?? []);
        if (d.children?.[0]) setChildId(d.children[0].id);
      })
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!childId || !start) {
      setError("Please add a child and pick a start time first.");
      return;
    }
    setLoading(true);

    const scheduledStart = new Date(start);
    const scheduledEnd = new Date(scheduledStart.getTime() + 60 * 60 * 1000); // 1 hour

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        tutorId,
        type,
        scheduledStart: scheduledStart.toISOString(),
        scheduledEnd: scheduledEnd.toISOString(),
      }),
    });

    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not create booking.");
      return;
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }

    setMessage("Discovery session booked! View it from your bookings page.");
    router.push("/parent/bookings");
  }

  if (children.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-600">
        Add a child to your account first — go to{" "}
        <a href="/parent/children" className="font-semibold text-indigo">
          Your children
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <div>
        <label className="text-sm font-semibold">Child</label>
        <select value={childId} onChange={(e) => setChildId(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2">
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold">Session type</label>
        <select value={type} onChange={(e) => setType(e.target.value as "DISCOVERY" | "PAID")} className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2">
          <option value="DISCOVERY">Free discovery session</option>
          <option value="PAID">Paid session (${hourlyRateUSD}/hr)</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold">Start time</label>
        <input
          type="datetime-local"
          required
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      {error && <p className="text-sm text-coral-600">{error}</p>}
      {message && <p className="text-sm text-indigo">{message}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Booking…" : type === "PAID" ? "Book & pay" : "Book free session"}
      </button>
    </form>
  );
}
