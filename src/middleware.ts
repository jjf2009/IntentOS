import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSupabaseEnvOptional } from "@/app/supabase/env";

export async function middleware(request: NextRequest) {
  const env = getSupabaseEnvOptional();
  if (!env) return NextResponse.next();

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: any) {
        cookiesToSet.forEach(({ name, value, options }: any) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/login", "/signup", "/chat/:path*", "/api/tambo/:path*"],
};
