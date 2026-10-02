"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddChildForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [ageGroup, setAgeGroup] = useState<"LITTLE_4_7" | "YOUNG_7_12">("YOUNG_7_12");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, ageGroup }),
    });
    setLoading(false);
    setFirstName("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-3">
      <div>
        <label className="text-sm font-semibold">First name</label>
        <input
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block rounded-lg border border-gray-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="text-sm font-semibold">Age group</label>
        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value as "LITTLE_4_7" | "YOUNG_7_12")}
          className="mt-1 block rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="LITTLE_4_7">Little Coders (4–7)</option>
          <option value="YOUNG_7_12">Young Coders (7–12)</option>
        </select>
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Adding…" : "Add child"}
      </button>
    </form>
  );
}
