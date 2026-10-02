import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-14 md:pt-20">
        <div
          className="drift pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF6B6B 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="drift pointer-events-none absolute -left-32 top-40 h-[360px] w-[360px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #4F39A7 0%, transparent 70%)", animationDelay: "-4s" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="rise-in text-[2.75rem] leading-[1.05] md:text-[3.75rem]">
              Turn screen time into
              <br />
              <span className="underline-mark">
                skill time.
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M2 14 C 60 4, 120 18, 180 10 S 260 4, 298 12"
                    fill="none"
                    stroke="#FF6B6B"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="rise-in mt-7 max-w-md text-lg leading-relaxed text-indigo-900/70" style={{ animationDelay: "0.1s" }}>
              Private, 1-on-1 online coding lessons for kids ages 4–12 in Lebanon.
              One child. One tutor. One personalized learning journey.
            </p>
            <div className="rise-in mt-9 flex flex-wrap gap-4" style={{ animationDelay: "0.2s" }}>
              <Link href="/book-discovery" className="btn-primary">
                Book a free discovery session
              </Link>
              <Link href="/programs" className="btn-secondary">
                See the programs
              </Link>
            </div>
          </div>

          <div className="rise-in" style={{ animationDelay: "0.15s" }}>
            <BlockToGame />
          </div>
        </div>
      </section>

      {/* Programs — asymmetric, not matched cards */}
      <section className="border-y border-indigo-900/10 bg-sand py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-[2.25rem]">Two paths, matched to how kids actually learn at that age</h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-indigo-900/10 md:grid-cols-5">
            <div className="group col-span-3 bg-cream p-10 transition-colors duration-500" style={{ transitionTimingFunction: "var(--ease-out-expo)" }}>
              <p className="text-sm font-semibold text-coral-600">Ages 4–7</p>
              <h3 className="mt-2 text-2xl">Little Coders</h3>
              <p className="mt-4 max-w-md leading-relaxed text-indigo-900/70">
                No reading required to get started. Lessons are short, playful, and built
                around sequencing, patterns, and stories — the same logic as real code,
                taught through games a four-year-old already loves.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-indigo-900/70">
                <li>Sequencing &amp; patterns through play</li>
                <li>Beginner block-based coding</li>
                <li>Simple animations &amp; interactive stories</li>
              </ul>
              <Link
                href="/programs/little-coders"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-900 underline decoration-coral decoration-2 underline-offset-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                Explore Little Coders
              </Link>
            </div>
            <div className="group col-span-2 bg-indigo-900 p-10 text-cream transition-colors duration-500" style={{ transitionTimingFunction: "var(--ease-out-expo)" }}>
              <p className="text-sm font-semibold text-coral">Ages 7–12</p>
              <h3 className="mt-2 text-2xl">Young Coders</h3>
              <p className="mt-4 leading-relaxed text-cream/70">
                Real projects: Scratch, Roblox Studio, beginner Python, websites, and
                introductory AI — built one-on-one, at their pace.
              </p>
              <Link
                href="/programs/young-coders"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-cream underline decoration-coral decoration-2 underline-offset-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                Explore Young Coders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — a real sequence, so numbering earns its place */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-lg text-3xl md:text-[2.25rem]">From first session to finished project</h2>
        <div className="mt-14 grid gap-10 md:grid-cols-4">
          {[
            ["01", "Free discovery session", "We assess your child's interests, comfort with tech, and learning level — no cost, no pressure."],
            ["02", "Matched with a tutor", "Choose from vetted, personally approved coding tutors suited to your child's age and goals."],
            ["03", "Weekly 1-on-1 lessons", "Live, personalized lessons that adapt to your child's pace — not a fixed curriculum."],
            ["04", "Progress you can see", "Clear updates on skills learned, projects finished, and what's next."],
          ].map(([num, title, body]) => (
            <div key={num} className="border-t-2 border-indigo-900/15 pt-5">
              <span className="font-mono text-sm text-coral-600">{num}</span>
              <h3 className="mt-3 text-lg font-semibold text-indigo-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-indigo-900/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-indigo-900 py-24 text-cream">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-lg text-3xl text-cream md:text-[2.25rem]">
            Coding is the medium. The real lesson is bigger.
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
            {[
              "Problem-solving",
              "Logical thinking",
              "Creativity",
              "Confidence",
              "Patience",
              "Digital literacy",
              "Independent thinking",
              "Future-ready skills",
            ].map((o) => (
              <p key={o} className="border-l-2 border-coral pl-4 text-sm text-cream/80">
                {o}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** A concrete illustration of the subject: snap-together blocks assembling into a tiny game. */
function BlockToGame() {
  return (
    <div
      className="relative rounded-3xl bg-indigo-900 p-8 text-cream shadow-[0_30px_60px_-20px_rgba(32,21,72,0.5)] transition-transform duration-500"
      style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
    >
      <p className="font-mono text-xs text-cream/50">today's lesson</p>
      <div className="mt-4 space-y-2">
        {[
          ["#6C5CE7", "when ⚑ clicked"],
          ["#FF6B6B", "move 10 steps"],
          ["#2ECC71", "if on edge, bounce"],
        ].map(([color, text], i) => (
          <div
            key={text}
            className="rise-in rounded-lg px-4 py-2.5 font-mono text-sm text-white shadow-sm"
            style={{ backgroundColor: color, animationDelay: `${0.4 + i * 0.1}s` }}
          >
            {text}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 text-cream/40">
        <span className="h-px flex-1 bg-cream/15" />
        <span className="text-xs">becomes</span>
        <span className="h-px flex-1 bg-cream/15" />
      </div>

      <div className="relative mt-6 h-32 overflow-hidden rounded-xl bg-indigo-700/60">
        <svg viewBox="0 0 280 110" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d="M20 90 Q 100 20, 180 55 T 260 25" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeDasharray="4 6" opacity="0.6" />
          <circle cx="260" cy="25" r="7" fill="#FF6B6B">
            <animateMotion
              dur="3.5s"
              repeatCount="indefinite"
              path="M20 90 Q 100 20, 180 55 T 260 25 Q 180 55, 100 20 T 20 90"
            />
          </circle>
        </svg>
        <p className="absolute bottom-3 left-4 font-mono text-[11px] text-cream/50">sprite_bounce.sb3</p>
      </div>
    </div>
  );
}
