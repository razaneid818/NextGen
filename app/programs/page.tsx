import Link from "next/link";

export default function ProgramsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Programs</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="card">
          <h2 className="text-xl font-bold text-indigo">Little Coders — Ages 4–7</h2>
          <p className="mt-3 text-gray-600">
            A playful introduction to coding: logic, sequencing, patterns, digital creativity,
            stories, animations, and beginner game concepts, in short, highly interactive
            lessons.
          </p>
          <Link href="/programs/little-coders" className="mt-4 inline-block font-semibold text-indigo">
            Learn more →
          </Link>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold text-indigo">Young Coders — Ages 7–12</h2>
          <p className="mt-3 text-gray-600">
            Real digital projects: Scratch, Roblox Studio, beginner Python, game development,
            websites, coding logic, and introductory AI concepts.
          </p>
          <Link href="/programs/young-coders" className="mt-4 inline-block font-semibold text-indigo">
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}
