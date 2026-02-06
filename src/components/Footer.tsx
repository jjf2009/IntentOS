"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        {/* Left: Product Identity */}
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white text-[10px] font-semibold">
            IO
          </div>
          <span>
            IntentOS · Intent-native generative UI system
          </span>
        </div>

        {/* Center: Architecture Signal */}
        <div className="text-xs text-neutral-500 text-center md:text-left">
          Powered by Gemini 3 reasoning · Rendered with Tambo
        </div>

        {/* Right: Meta */}
        <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 md:justify-end">
          <span>Built for Hackathons</span>
          <span className="hidden sm:inline">·</span>
          <span>No static screens</span>
        </div>
      </div>
    </footer>
  );
}
