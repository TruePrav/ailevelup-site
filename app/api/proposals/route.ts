import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { saveProposal, generateProposalId, listProposals } from "@/lib/proposals";
import { Proposal } from "@/types/proposal";
import { requireAuth, AuthError } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  let auth;
  try {
    auth = await requireAuth("proposals:read");
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  try {
    const proposals = await listProposals();
    const h = await headers();
    const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip");
    await logAudit({
      auth,
      method: "GET",
      path: "/api/proposals",
      status: 200,
      summary: `Listed ${proposals.length} proposals`,
      ip,
    });
    return NextResponse.json({ proposals });
  } catch (err) {
    console.error("[proposals] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let auth;
  try {
    auth = await requireAuth("proposals:write");
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }

  try {
    const body = await req.json();
    const {
      badge, headline, clientName, subtitle, preparedFor, date, preparedBy,
      validUntil, challenge, deliverables, scopeIncluded, scopeExcluded,
      timeline, timelineNote, pricingPhase, pricingSubtitle, pricingAmount,
      pricingCurrency, pricingAmountAlt, pricingCurrencyAlt, pricingNote,
      pricingIncludes, paymentTerms, paymentMethods, whatWeNeed, clientProvides,
      terms, setupFees, managedSetup, ctaSteps, status,
    } = body as Partial<Proposal>;

    if (!clientName) {
      return NextResponse.json({ error: "clientName is required" }, { status: 400 });
    }

    const id = generateProposalId(clientName);
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const validDate = new Date();
    validDate.setMonth(validDate.getMonth() + 1);
    const validUntilStr = validUntil ?? validDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const proposal: Proposal = {
      id,
      badge: badge ?? "Proposal",
      headline: headline ?? "Proposal for",
      clientName,
      subtitle: subtitle ?? "",
      preparedFor: preparedFor ?? clientName,
      date: date ?? today,
      preparedBy: preparedBy ?? "Praveen Mahtani | AILevelUp",
      validUntil: validUntilStr,
      challenge: challenge ?? "",
      deliverables: deliverables ?? [],
      scopeIncluded: scopeIncluded ?? [],
      scopeExcluded: scopeExcluded ?? [],
      timeline: timeline ?? [],
      timelineNote: timelineNote ?? "",
      pricingPhase: pricingPhase ?? "Phase 1",
      pricingSubtitle: pricingSubtitle ?? "",
      pricingAmount: pricingAmount ?? "$0",
      pricingCurrency: pricingCurrency ?? "USD",
      pricingAmountAlt: pricingAmountAlt ?? "",
      pricingCurrencyAlt: pricingCurrencyAlt ?? "",
      pricingNote: pricingNote ?? "",
      pricingIncludes: pricingIncludes ?? [],
      paymentTerms: paymentTerms ?? "",
      paymentMethods: paymentMethods ?? "",
      whatWeNeed: whatWeNeed ?? [],
      clientProvides: clientProvides ?? [],
      terms: terms ?? [],
      setupFees: setupFees ?? [],
      managedSetup: managedSetup ?? false,
      ctaSteps: ctaSteps ?? [],
      status: status ?? "draft",
      createdAt: new Date().toISOString(),
    };

    await saveProposal(proposal);

    const h = await headers();
    const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip");
    await logAudit({
      auth,
      method: "POST",
      path: "/api/proposals",
      status: 201,
      summary: `Created proposal ${id} for ${clientName}`,
      ip,
    });

    return NextResponse.json({ id, message: "Proposal created", proposal }, { status: 201 });
  } catch (err) {
    console.error("[proposals] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
