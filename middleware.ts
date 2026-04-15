import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

function requiresAuth(pathname: string): boolean {
  if (pathname === "/admin/login") return false;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  if (pathname === "/proposals/new") return true;
  if (pathname.startsWith("/proposals/") && pathname.endsWith("/edit")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  // Always run updateSession so the Supabase token is refreshed for every
  // matched request — including API routes that call isAdmin().
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Only redirect page routes — API routes return JSON errors from the handler.
  if (requiresAuth(pathname) && !user && !pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/proposals/new",
    "/proposals/:id/edit",
    "/api/proposals/:path*",
    "/api/admin/:path*",
  ],
};
