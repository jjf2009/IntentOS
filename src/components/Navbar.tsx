"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white text-sm font-semibold">
            IO
          </div>
          <span className="text-sm font-semibold text-neutral-900">
            IntentOS
          </span>
        </div>

        {/* Center: System State (future-proof) */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          System ready · Awaiting intent
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/"
            target="_blank"
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition"
          >
            GitHub
          </Link>

          <button
            type="button"
            className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 transition"
          >
            New Intent
          </button>
        </div>
      </div>
    </nav>
  );
}
