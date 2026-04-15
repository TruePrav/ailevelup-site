import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getProposal, saveProposal } from "@/lib/proposals";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = (formData.get("name") as string) || "";
    const email = (formData.get("email") as string) || "";
    const date = (formData.get("date") as string) || "";
    const proposalSlug = (formData.get("proposal_slug") as string) || "";
    const signature = (formData.get("signature") as string) || "";

    if (!proposalSlug) {
      return NextResponse.json({ error: "proposal_slug required" }, { status: 400, headers: corsHeaders });
    }

    // Update the proposal record with the signature
    const proposal = await getProposal(proposalSlug);
    if (proposal) {
      proposal.signatureDataUrl = signature;
      proposal.submittedAt = new Date().toISOString();
      proposal.status = "signed";
      await saveProposal(proposal);
    }

    // Best-effort: upload PNG to Supabase storage for audit trail
    let signatureImageUrl: string | null = null;
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      if (signature && signature.startsWith("data:image")) {
        const base64Data = signature.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${proposalSlug}-${timestamp}.png`;

        const { error: uploadError } = await supabase.storage
          .from("proposal_signatures")
          .upload(fileName, buffer, { contentType: "image/png", upsert: false });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("proposal-signatures").getPublicUrl(fileName);
          signatureImageUrl = urlData.publicUrl;
        }
      }

      // Insert audit record
      await supabase.from("proposal_signatures").insert({
        proposal_id: proposalSlug,
        name,
        email,
        date,
        submitted_at: new Date().toISOString(),
        signature_image_url: signatureImageUrl,
      });
    } catch (e) {
      console.warn("[proposal-signature] Supabase audit failed (non-fatal):", e);
    }

    return NextResponse.json(
      { success: true, signature_url: signatureImageUrl },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[proposal-signature] FATAL:", error);
    return NextResponse.json(
      { error: "Failed to save", details: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
