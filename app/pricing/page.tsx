import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-navy-900">Pricing</h1>
      <p className="mt-4 text-gray-600">
        Every learning journey starts with a free discovery session. After that, choose a
        monthly plan of one or two 1-on-1 lessons per week, matched to your child's age and
        goals. Final pricing depends on the tutor you choose.
      </p>
      <Link href="/book-discovery" className="btn-primary mt-8 inline-block">
        Book a Free Discovery Session
      </Link>
    </div>
  );
}
