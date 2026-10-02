import Link from "next/link";

export default function YoungCodersPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Young Coders — Ages 7–12</h1>
      <p className="mt-4 text-gray-600">
        Kids build real digital projects while learning concepts that transfer to any future
        technical path — not just following tutorials, but creating their own games,
        animations, and websites.
      </p>
      <ul className="mt-6 space-y-2 text-gray-700">
        <li>• Scratch and Roblox Studio game development</li>
        <li>• Beginner Python programming</li>
        <li>• Building simple websites (HTML/CSS)</li>
        <li>• Coding logic and introductory AI concepts</li>
      </ul>
      <Link href="/book-discovery" className="btn-primary mt-8 inline-block">
        Book a Free Discovery Session
      </Link>
    </div>
  );
}
