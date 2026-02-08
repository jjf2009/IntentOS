"use server";

import { createSupabaseServerActionClient } from "@/app/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

function encodeRedirectParam(value: string) {
  const maxLength = 200;
  const truncated = value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
  return encodeURIComponent(truncated);
}

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid sign up input";
    redirect(`/signup?error=${encodeRedirectParam(message)}`);
  }

  const supabase = await createSupabaseServerActionClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeRedirectParam(error.message)}`);
  }

  if (data.session) {
    redirect("/chat");
  }

  redirect(
    `/login?message=${encodeRedirectParam(
      "Check your email to confirm your account, then sign in.",
    )}`,
  );
}

export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid sign in input";
    redirect(`/login?error=${encodeRedirectParam(message)}`);
  }

  const supabase = await createSupabaseServerActionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirect(`/login?error=${encodeRedirectParam(error.message)}`);
  }

  redirect("/chat");
}

export async function signOut() {
  const supabase = await createSupabaseServerActionClient();
  await supabase.auth.signOut();
  redirect("/");
}
