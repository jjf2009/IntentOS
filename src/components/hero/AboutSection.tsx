import Link from "next/link";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full bg-white px-6 py-20 sm:px-10 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-600">
              About IndentOS
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              A Thoughtful Operating System
              <br />
              Built for Focus and Identity
            </h2>

            <p className="text-lg leading-relaxed text-gray-600">
              IndentOS is a modern, identity-first operating system designed to
              reduce cognitive overload and bring intention back to how people
              interact with technology. Every interaction is structured,
              deliberate, and human-centric.
            </p>

            <p className="text-gray-600">
              Unlike traditional systems that prioritize features over clarity,
              IndentOS emphasizes structure, flow, and digital well-being. The
              result is an environment that scales with your thinking, not
              against it.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/learn-more"
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
              >
                Learn More
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Visual Block */}
          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-gray-900" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Identity-First Design
                    </h4>
                    <p className="text-sm text-gray-600">
                      Profiles, workflows, and permissions designed around who
                      you are and how you work.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-gray-900" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Minimal by Default
                    </h4>
                    <p className="text-sm text-gray-600">
                      No noise, no clutter. Every element earns its place.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-gray-900" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Built for the Long Term
                    </h4>
                    <p className="text-sm text-gray-600">
                      Architected to evolve without compromising stability or
                      clarity.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
