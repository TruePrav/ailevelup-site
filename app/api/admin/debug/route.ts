import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const supabaseCookies = allCookies.filter((c) => c.name.startsWith("sb-"));

    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    return NextResponse.json({
      supabaseCookieCount: supabaseCookies.length,
      supabaseCookieNames: supabaseCookies.map((c) => c.name),
      hasSession: !!sessionData?.session,
      sessionExpiry: sessionData?.session?.expires_at ?? null,
      user: userData?.user?.email ?? null,
      userError: userError?.message ?? null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
