import { NextRequest, NextResponse } from "next/server";
import { saveProposal, generateProposalId } from "@/lib/proposals";
import { Proposal } from "@/types/proposal";
import { isAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      badge, headline, clientName, subtitle, preparedFor, date, preparedBy,
      validUntil, challenge, deliverables, scopeIncluded, scopeExcluded,
      timeline, timelineNote, pricingPhase, pricingSubtitle, pricingAmount,
      pricingCurrency, pricingNote, pricingIncludes, paymentTerms,
      paymentMethods, whatWeNeed, clientProvides, terms, ctaSteps,
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
      pricingNote: pricingNote ?? "",
      pricingIncludes: pricingIncludes ?? [],
      paymentTerms: paymentTerms ?? "",
      paymentMethods: paymentMethods ?? "",
      whatWeNeed: whatWeNeed ?? [],
      clientProvides: clientProvides ?? [],
      terms: terms ?? [],
      ctaSteps: ctaSteps ?? [],
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    await saveProposal(proposal);

    return NextResponse.json({ id, message: "Proposal created" }, { status: 201 });
  } catch (err) {
    console.error("[proposals] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
