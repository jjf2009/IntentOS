"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="mb-4 text-sm font-medium text-neutral-500">
            Intent-native productivity system
          </p>

          {/* Title */}
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Stop managing tools.
            <br />
            <span className="text-neutral-600">
              Start executing intent.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-relaxed text-neutral-600">
            IntentOS transforms natural language goals into interactive,
            adaptive workflows. No static screens. No manual orchestration.
            Just intent → execution.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Get started
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
