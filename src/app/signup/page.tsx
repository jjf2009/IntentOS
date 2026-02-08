import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { signUp } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

function getFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/chat");
  }

  const sp = await (searchParams ?? Promise.resolve<SearchParams>({}));
  const error = getFirst(sp.error);
  const message = getFirst(sp.message);

  return (
<main className="min-h-screen bg-neutral-50 flex flex-col">
  <Navbar />
  <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6">
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-semibold text-neutral-900">Create an account</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Sign up with your name, email, and password.
      </p>
      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {!error && message && (
        <div className="mt-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {message}
        </div>
      )}
      <form action={signUp} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Minimum 8 characters.
          </p>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Create account
        </button>
      </form>
      <p className="mt-6 text-sm text-neutral-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-neutral-900 underline">
          Sign in
        </Link>
      </p>
    </div>
  </div>
  <Footer />
</main>
  );
}
