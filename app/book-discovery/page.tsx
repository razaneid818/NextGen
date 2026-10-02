import Link from "next/link";

export default function BookDiscoveryPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-navy-900">Book a Free Discovery Session</h1>
      <p className="mt-4 text-gray-600">
        In a short, no-cost session, we assess your child's interests, comfort with
        technology, and learning level — then recommend the right tutor and learning path.
      </p>
      <div className="card mt-10 text-left">
        <ol className="list-inside list-decimal space-y-2 text-gray-700">
          <li>Create a free parent account</li>
          <li>Add your child's profile (age group, interests)</li>
          <li>Pick a tutor and request a free discovery session</li>
        </ol>
        <Link href="/signup/parent" className="btn-primary mt-6 w-full">
          Create your parent account
        </Link>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Already have an account? <Link href="/login" className="font-semibold text-indigo">Log in</Link>
      </p>
    </div>
  );
}
