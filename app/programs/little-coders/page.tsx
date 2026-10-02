import Link from "next/link";

export default function LittleCodersPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Little Coders — Ages 4–7</h1>
      <p className="mt-4 text-gray-600">
        Short, highly interactive 1-on-1 lessons built around how young children actually
        learn: play, patterns, stories, and visual logic. No reading required to get started.
      </p>
      <ul className="mt-6 space-y-2 text-gray-700">
        <li>• Sequencing &amp; patterns through games and stories</li>
        <li>• Beginner block-based coding (ScratchJr-style)</li>
        <li>• Digital creativity: simple animations and interactive stories</li>
        <li>• Early logical thinking and problem-solving</li>
      </ul>
      <Link href="/book-discovery" className="btn-primary mt-8 inline-block">
        Book a Free Discovery Session
      </Link>
    </div>
  );
}
