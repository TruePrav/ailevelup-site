import { NextResponse } from "next/server";

// This route has been replaced by Supabase Auth.
// Login at /admin/login

export async function GET() {
  return NextResponse.redirect(new URL("/admin/login", "https://ailevelup.ca"));
}
