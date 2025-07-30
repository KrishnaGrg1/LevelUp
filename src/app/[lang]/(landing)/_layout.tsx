import React from "react";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-400`}
    >
      <header className="flex items-center justify-between px-8 py-6 bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
        <Link href="/" className="text-3xl font-bold text-white tracking-wide">
          LevelUp
        </Link>
        <nav className="space-x-6">
          <Link
            href="/features"
            className="text-white hover:text-yellow-300 font-medium transition"
          >
            Features
          </Link>
          <Link
            href="/leaderboard"
            className="text-white hover:text-yellow-300 font-medium transition"
          >
            Leaderboard
          </Link>
          <Link
            href="/login"
            className="bg-yellow-400 text-indigo-900 px-4 py-2 rounded-lg font-semibold shadow hover:bg-yellow-300 transition"
          >
            Login
          </Link>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <section className="max-w-2xl w-full bg-white bg-opacity-80 rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
            Gamify Your Growth
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            LevelUp transforms your learning and productivity into a fun,
            rewarding experience. Earn points, unlock achievements, and climb
            the leaderboard!
          </p>
          <Link
            href="/signup"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </section>
        {children}
      </main>
      <footer className="text-center py-6 text-white bg-opacity-10">
        © {new Date().getFullYear()} LevelUp. All rights reserved.
      </footer>
    </div>
  );
}
