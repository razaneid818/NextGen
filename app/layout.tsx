import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NextGen — Turn Screen Time Into Skill Time",
  description:
    "Personalized 1-on-1 online coding lessons for kids ages 4–12 in Lebanon. One child. One tutor. One personalized learning journey.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/" className="font-heading text-xl font-bold text-indigo-900">
              NextGen
            </Link>
            <div className="hidden items-center gap-9 text-[15px] md:flex">
              <Link href="/programs" className="text-indigo-900/70 hover:text-indigo-900">Programs</Link>
              <Link href="/tutors" className="text-indigo-900/70 hover:text-indigo-900">Tutors</Link>
              <Link href="/pricing" className="text-indigo-900/70 hover:text-indigo-900">Pricing</Link>
              <Link href="/about" className="text-indigo-900/70 hover:text-indigo-900">About</Link>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/login" className="hidden text-[15px] font-medium text-indigo-900/70 hover:text-indigo-900 md:block">
                Log in
              </Link>
              <Link href="/book-discovery" className="btn-primary px-5 py-2.5 text-sm">
                Free discovery session
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="mt-32 border-t border-indigo-900/10 bg-indigo-900 py-16 text-cream/70">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <p className="font-heading text-lg font-bold text-cream">NextGen</p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed">
                  Turn screen time into skill time. One child, one tutor, one personalized
                  learning journey — built for Lebanon's families.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-cream">Programs</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li><Link href="/programs/little-coders" className="hover:text-cream">Little Coders (4–7)</Link></li>
                  <li><Link href="/programs/young-coders" className="hover:text-cream">Young Coders (7–12)</Link></li>
                  <li><Link href="/tutors" className="hover:text-cream">Our tutors</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-cream">NextGen</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li><Link href="/about" className="hover:text-cream">About</Link></li>
                  <li><Link href="/pricing" className="hover:text-cream">Pricing</Link></li>
                  <li><Link href="/contact" className="hover:text-cream">Contact</Link></li>
                </ul>
              </div>
            </div>
            <p className="mt-14 text-xs text-cream/40">
              &copy; {new Date().getFullYear()} NextGen. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
