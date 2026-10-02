import Link from "next/link";

const outcomes = [
  "Problem-solving skills",
  "Logical thinking",
  "Creativity",
  "Confidence",
  "Patience",
  "Digital literacy",
  "Independent thinking",
  "Future-ready tech skills",
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-navy-900 md:text-5xl">
              Turn Screen Time Into <span className="text-coral">Skill Time.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Personalized 1-on-1 online coding lessons for kids ages 4–12 in Lebanon.
              One child. One tutor. One personalized learning journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book-discovery" className="btn-primary">
                Book a Free Discovery Session
              </Link>
              <Link href="/programs" className="btn-secondary">
                Explore Programs
              </Link>
            </div>
          </div>
          <div className="card bg-indigo-50">
            <h3 className="text-xl font-bold text-indigo">What your child gains</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
              {outcomes.map((o) => (
                <li key={o} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-coral" /> {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-navy-900">
            Two learning paths, one personalized journey
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="card">
              <h3 className="text-xl font-bold text-indigo">Little Coders — Ages 4–7</h3>
              <p className="mt-3 text-gray-600">
                A playful introduction to coding: logic, sequencing, patterns, digital
                creativity, stories, animations, and beginner game concepts — in short,
                highly interactive lessons built for young attention spans.
              </p>
              <Link href="/programs/little-coders" className="mt-4 inline-block font-semibold text-indigo">
                Learn more →
              </Link>
            </div>
            <div className="card">
              <h3 className="text-xl font-bold text-indigo">Young Coders — Ages 7–12</h3>
              <p className="mt-3 text-gray-600">
                Real digital projects: Scratch, Roblox Studio, beginner Python, game
                development, websites, coding logic, and introductory AI concepts.
              </p>
              <Link href="/programs/young-coders" className="mt-4 inline-block font-semibold text-indigo">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-navy-900">How it works</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-4">
          {[
            ["1", "Free Discovery Session", "We assess your child's interests, comfort with tech, and learning level."],
            ["2", "Matched with a Tutor", "Choose from our vetted, admin-approved coding tutors."],
            ["3", "1-on-1 Live Lessons", "Weekly personalized lessons, fully adapted to your child's pace."],
            ["4", "Progress You Can See", "Clear updates on skills learned and projects completed."],
          ].map(([num, title, body]) => (
            <div key={num}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral font-heading text-xl font-bold text-white">
                {num}
              </div>
              <h3 className="mt-4 font-heading font-bold">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
