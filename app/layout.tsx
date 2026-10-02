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
        <header className="border-b border-gray-100">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-heading text-xl font-bold text-indigo">
              Next<span className="text-coral">Gen</span>
            </Link>
            <div className="hidden items-center gap-8 md:flex">
              <Link href="/programs" className="hover:text-indigo">Programs</Link>
              <Link href="/tutors" className="hover:text-indigo">Tutors</Link>
              <Link href="/pricing" className="hover:text-indigo">Pricing</Link>
              <Link href="/about" className="hover:text-indigo">About</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold hover:text-indigo">
                Log in
              </Link>
              <Link href="/book-discovery" className="btn-primary text-sm">
                Free Discovery Session
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-gray-100 bg-navy-900 py-12 text-gray-300">
          <div className="mx-auto max-w-6xl px-6">
            <p className="font-heading text-lg font-bold text-white">
              Next<span className="text-coral">Gen</span>
            </p>
            <p className="mt-2 max-w-md text-sm">
              Turn Screen Time Into Skill Time. One child. One tutor. One personalized
              learning journey.
            </p>
            <p className="mt-8 text-xs text-gray-500">
              &copy; {new Date().getFullYear()} NextGen. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
