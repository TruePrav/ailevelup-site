"use client";

import { useRef, useState } from "react";
import { Proposal } from "@/types/proposal";

const today = new Date().toLocaleDateString("en-US", {
  month: "long", day: "numeric", year: "numeric",
});

function buildProposalHTML(
  proposal: Proposal,
  sigDataUrl: string,
  preparerSig: string | null,
) {
  const isSigned = proposal.status === "signed" && !!proposal.signatureDataUrl;
  const signedImg = proposal.signatureDataUrl ?? sigDataUrl ?? "";
  const signedDate = proposal.submittedAt
    ? new Date(proposal.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : proposal.date;
  const signedEmail = proposal.signedByEmail ?? "";
  const deliverablesRows = proposal.deliverables?.map(d =>
    `<tr><td><strong>${d.deliverable}</strong></td><td>${d.details}</td></tr>`
  ).join("") ?? "";

  const includedItems = proposal.scopeIncluded?.map(i => `<li>${i}</li>`).join("") ?? "";
  const excludedItems = proposal.scopeExcluded?.map(i => `<li>${i}</li>`).join("") ?? "";

  const timelineItems = proposal.timeline?.map(t =>
    `<div class="timeline-item"><div class="week">${t.week}</div><div class="title">${t.title}</div><div class="desc">${t.description}</div></div>`
  ).join("") ?? "";

  const pricingItems = proposal.pricingIncludes?.map(i => `<li>${i}</li>`).join("") ?? "";

  const needItems = proposal.whatWeNeed?.map(i => `<li>${i}</li>`).join("") ?? "";
  const provideItems = proposal.clientProvides?.map(i => `<li>${i}</li>`).join("") ?? "";

  const termRows = proposal.terms?.map(t =>
    `<span class="term-label">${t.label}</span><span class="term-value">${t.value}</span>`
  ).join("") ?? "";

  const setupFeeRows = proposal.setupFees?.filter(f => f.item).map(f =>
    `<tr><td>${f.item}</td><td style="text-align:right;font-weight:600;color:var(--brand-primary)">${f.amount}</td></tr>`
  ).join("") ?? "";

  const hasSetupFees = (proposal.setupFees ?? []).some(f => f.item);

  const ctaSteps = proposal.ctaSteps?.map((s) =>
    `<li>${s}</li>`
  ).join("") ?? "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${proposal.badge} - ${proposal.clientName} | ailevelup.ca</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
  :root {
    --brand-dark: #0f172a; --brand-primary: #2563eb; --brand-primary-light: #dbeafe;
    --brand-accent: #10b981; --brand-accent-light: #d1fae5;
    --text-primary: #1e293b; --text-secondary: #64748b; --text-muted: #94a3b8;
    --border: #e2e8f0; --bg-light: #f8fafc; --bg-white: #ffffff;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { size: A4; margin: 0; }
  body { font-family: 'Inter', sans-serif; color: var(--text-primary); line-height: 1.6; font-size: 14px; background: var(--bg-white); }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 48px 56px; position: relative; }
  .page:not(:last-of-type) { page-break-after: always; break-after: page; }
  .page.page-signatures { min-height: 297mm; height: auto; padding-bottom: 96px; }
  .page.page-signatures:last-of-type { page-break-after: auto; break-after: auto; }
  @media print { body { background: white; } .page { width: 100%; padding: 48px 56px; margin: 0; } .no-print { display: none; } }
  @media screen { body { background: #e2e8f0; padding: 40px 0; } .page { background: white; box-shadow: 0 4px 24px rgba(0,0,0,0.12); margin-bottom: 40px; } }
  .cover { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; min-height: calc(297mm - 96px); }
  .cover-badge { display: inline-block; background: var(--brand-primary-light); color: var(--brand-primary); font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; margin-bottom: 32px; }
  .cover h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; line-height: 1.15; color: var(--brand-dark); margin-bottom: 16px; }
  .cover h1 span { color: var(--brand-primary); }
  .cover-subtitle { font-size: 18px; color: var(--text-secondary); margin-bottom: 48px; max-width: 460px; }
  .cover-meta { border-top: 2px solid var(--border); padding-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 480px; }
  .cover-meta-item label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 4px; }
  .cover-meta-item span { font-size: 14px; font-weight: 500; color: var(--text-primary); }
  .cover-logo { position: absolute; bottom: 48px; right: 56px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 16px; color: var(--brand-dark); }
  .cover-logo span { color: var(--brand-primary); }
  .section-num { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--brand-primary); margin-bottom: 6px; }
  h2 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: var(--brand-dark); margin-bottom: 20px; line-height: 1.3; }
  h3 { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; color: var(--brand-dark); margin-bottom: 12px; margin-top: 16px; }
  p { margin-bottom: 14px; color: var(--text-primary); }
  .section { margin-bottom: 24px; break-inside: avoid; page-break-inside: avoid; }
  .highlight-box { background: var(--bg-light); border-left: 4px solid var(--brand-primary); padding: 20px 24px; border-radius: 0 8px 8px 0; margin: 20px 0; }
  .highlight-box p { margin-bottom: 0; color: var(--text-secondary); }
  table { width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; font-size: 13px; }
  thead th { background: var(--brand-dark); color: white; font-weight: 600; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
  thead th:first-child { border-radius: 8px 0 0 0; } thead th:last-child { border-radius: 0 8px 0 0; }
  tbody td { padding: 12px 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
  tbody tr:last-child td { border-bottom: none; } tbody tr:nth-child(even) { background: var(--bg-light); }
  .pricing-grid { display: flex; justify-content: center; gap: 20px; margin: 24px 0; }
  .pricing-card { border: 2px solid var(--border); border-radius: 12px; padding: 28px 24px; position: relative; max-width: 400px; width: 100%; }
  .pricing-card.recommended { border-color: var(--brand-primary); box-shadow: 0 4px 16px rgba(37,99,235,0.12); }
  .pricing-card.recommended::before { content: 'INCLUDED IN BUILD'; position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: var(--brand-primary); color: white; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; padding: 3px 14px; border-radius: 10px; }
  .pricing-card h4 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: var(--brand-dark); margin-bottom: 4px; }
  .pricing-card .subtitle { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }
  .pricing-card .price { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: var(--brand-primary); margin-bottom: 4px; }
  .pricing-card .price-label { font-size: 12px; color: var(--text-muted); margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .pricing-card ul { list-style: none; padding: 0; }
  .pricing-card ul li { font-size: 13px; color: var(--text-secondary); padding: 5px 0; padding-left: 20px; position: relative; }
  .pricing-card ul li::before { content: '✓'; position: absolute; left: 0; color: var(--brand-accent); font-weight: 700; }
  .scope-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 8px 0; }
  .scope-col h4 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
  .scope-col.included h4 { color: var(--brand-accent); }
  .scope-col.excluded h4 { color: var(--text-muted); }
  .scope-col ul { list-style: none; padding: 0; }
  .scope-col ul li { font-size: 12px; padding: 3px 0; padding-left: 20px; position: relative; color: var(--text-secondary); }
  .scope-col.included ul li::before { content: '✓'; position: absolute; left: 0; color: var(--brand-accent); font-weight: 700; }
  .scope-col.excluded ul li::before { content: '-'; position: absolute; left: 0; color: var(--text-muted); font-weight: 700; }
  .timeline { position: relative; padding-left: 32px; margin: 24px 0; }
  .timeline::before { content: ''; position: absolute; left: 8px; top: 4px; bottom: 4px; width: 2px; background: var(--border); }
  .timeline-item { position: relative; margin-bottom: 16px; }
  .timeline-item::before { content: ''; position: absolute; left: -28px; top: 4px; width: 14px; height: 14px; border-radius: 50%; background: var(--brand-primary); border: 3px solid var(--brand-primary-light); }
  .timeline-item .week { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--brand-primary); margin-bottom: 4px; }
  .timeline-item .title { font-weight: 600; color: var(--brand-dark); margin-bottom: 4px; }
  .timeline-item .desc { font-size: 12px; color: var(--text-secondary); }
  .terms-grid { display: grid; grid-template-columns: 140px 1fr; gap: 8px 16px; font-size: 13px; margin: 16px 0; }
  .terms-grid .term-label { font-weight: 600; color: var(--text-primary); }
  .terms-grid .term-value { color: var(--text-secondary); }
  .cta-box { background: var(--brand-dark); color: white; border-radius: 12px; padding: 32px; margin: 32px 0; }
  .cta-box h2 { color: white; margin-bottom: 16px; }
  .cta-steps { list-style: none; padding: 0; counter-reset: step; }
  .cta-steps li { counter-increment: step; padding: 8px 0; padding-left: 36px; position: relative; color: #cbd5e1; font-size: 14px; }
  .cta-steps li::before { content: counter(step); position: absolute; left: 0; top: 7px; width: 24px; height: 24px; background: var(--brand-primary); color: white; font-size: 12px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .footer { position: absolute; bottom: 32px; left: 56px; right: 56px; display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text-muted); }
  .footer a { color: var(--brand-primary); text-decoration: none; }
  .signature-block { margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border); page-break-inside: avoid; }
  .cta-box { page-break-inside: avoid; }
  .signature-block h3 { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 24px; margin-top: 0; }
  .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 24px; }
  .signature-item .name { font-weight: 600; color: var(--brand-dark); margin-bottom: 4px; }
  .signature-item .role { font-size: 13px; color: var(--text-secondary); margin-bottom: 32px; }
  .signature-line { border-bottom: 1px solid var(--text-primary); margin-bottom: 6px; height: 36px; }
  .signature-item .date-label { font-size: 12px; color: var(--text-muted); }
  .sig-pad-wrap { border: 2px dashed var(--brand-primary); border-radius: 8px; background: #f8fafc; margin-bottom: 8px; position: relative; overflow: hidden; }
  .sig-pad-wrap canvas { display: block; width: 100%; height: 140px; cursor: crosshair; }
  .sig-pad-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #94a3b8; pointer-events: none; }
  .sig-pad-wrap.signed .sig-pad-label { display: none; }
  .sig-btn { display: inline-block; padding: 6px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.15s; }
  .sig-btn-clear { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; margin-right: 8px; }
  .sig-btn-clear:hover { opacity: 0.7; }
  .sig-submit { background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; border: none; cursor: pointer; width: 100%; margin-top: 16px; transition: opacity 0.15s; }
  .sig-submit:disabled { opacity: 0.4; cursor: not-allowed; }
  .sig-submit:not(:disabled):hover { opacity: 0.85; }
  .sig-success { display: none; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 24px; }
  .sig-success.show { display: flex; }
  .sig-success-icon { width: 64px; height: 64px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 16px; color: #10b981; }
  .sig-success h2 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
  .sig-success p { font-size: 13px; color: #64748b; margin: 0; }
  @media print { .sig-pad-wrap, .sig-submit, .sig-btn, .sig-success { display: none !important; } }
  .floating-download { position: fixed; bottom: 24px; right: 24px; z-index: 9999; background: var(--brand-primary); color: white; border: none; border-radius: 50%; width: 56px; height: 56px; cursor: pointer; box-shadow: 0 4px 16px rgba(37,99,235,0.35); display: flex; align-items: center; justify-content: center; transition: transform 0.15s, opacity 0.15s; text-decoration: none; }
  .floating-download:hover { transform: scale(1.08); opacity: 0.9; }
  .floating-download svg { width: 22px; height: 22px; }
  .floating-download-tooltip { position: absolute; bottom: 64px; right: 0; background: var(--brand-dark); color: white; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 6px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.15s; }
  .floating-download:hover .floating-download-tooltip { opacity: 1; }
  @media print { .floating-download { display: none !important; } }
  /* Signed state — geometry mirrors the preparer block so the two underlines line up */
  .signed-image-wrap { margin-top: 4px; height: 72px; border-bottom: 1px solid var(--text-primary); display: flex; align-items: flex-end; justify-content: flex-start; margin-bottom: 6px; }
  .signed-image-wrap img { max-width: 260px; max-height: 70px; display: block; margin-bottom: -1px; filter: brightness(0); }
  .signed-banner { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 28px 24px; margin-top: 24px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; }
  .signed-banner-icon { width: 52px; height: 52px; background: #d1fae5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 12px; }
  .signed-banner h3 { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 700; color: #065f46; margin: 0 0 6px; }
  .signed-banner p { font-size: 13px; color: #047857; margin: 0 0 16px; }
  .signed-download { display: inline-flex; align-items: center; gap: 8px; background: var(--brand-primary); color: white; font-weight: 700; font-size: 14px; padding: 12px 22px; border-radius: 8px; text-decoration: none; border: none; cursor: pointer; transition: opacity 0.15s; }
  .signed-download:hover { opacity: 0.9; }
  .signed-download svg { width: 16px; height: 16px; }
  @media print { .signed-banner { display: none !important; } .signed-image-wrap { border-bottom: 1px solid #0f172a; } }
</style>
</head>
<body>

${isSigned ? "" : `<a class="floating-download no-print" href="javascript:window.print()" title="Download PDF">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
  <span class="floating-download-tooltip">Download PDF</span>
</a>`}

<!-- PAGE 1 - COVER -->
<div class="page">
  <div class="cover">
    <div class="cover-badge">${proposal.badge}</div>
    <h1>${proposal.headline ?? "Proposal for"}<br><span>${proposal.clientName}</span></h1>
    <p class="cover-subtitle">${proposal.subtitle}</p>
    <div class="cover-meta">
      <div class="cover-meta-item"><label>Prepared For</label><span>${proposal.preparedFor}</span></div>
      <div class="cover-meta-item"><label>Date</label><span>${proposal.date}</span></div>
      <div class="cover-meta-item"><label>Prepared By</label><span>${proposal.preparedBy}</span></div>
      <div class="cover-meta-item"><label>Valid Until</label><span>${proposal.validUntil}</span></div>
    </div>
  </div>
  <div class="cover-logo">ai<span>levelup</span>.ca</div>
</div>

<!-- PAGE 2 - CHALLENGE + DELIVERABLES -->
<div class="page">
  <div class="section">
    <div class="section-num">01</div>
    <h2>The Challenge</h2>
    <div class="highlight-box"><p>${proposal.challenge}</p></div>
  </div>
  <div class="section">
    <div class="section-num">02</div>
    <h2>What We'll Build</h2>
    <table>
      <thead><tr><th style="width:35%">Deliverable</th><th style="width:65%">Details</th></tr></thead>
      <tbody>${deliverablesRows}</tbody>
    </table>
  </div>
  <div class="footer"><span>Confidential - Prepared for ${proposal.preparedFor}</span><a href="https://ailevelup.ca">ailevelup.ca</a></div>
</div>

<!-- PAGE 3 - SCOPE + TIMELINE -->
<div class="page">
  <div class="section">
    <div class="section-num">04</div>
    <h2>Scope of Work</h2>
    <div class="scope-grid">
      <div class="scope-col included"><h4>✓ Included</h4><ul>${includedItems}</ul></div>
      <div class="scope-col excluded"><h4>- Not Included</h4><ul>${excludedItems}</ul></div>
    </div>
  </div>
  <div class="section">
    <div class="section-num">05</div>
    <h2>Implementation Timeline</h2>
    <div class="timeline">${timelineItems}</div>
    <p style="font-size:13px;color:var(--text-muted);margin-top:8px;">${proposal.timelineNote ?? ""}</p>
  </div>
  <div class="footer"><span>Confidential - Prepared for ${proposal.preparedFor}</span><a href="https://ailevelup.ca">ailevelup.ca</a></div>
</div>

<!-- PAGE 4 - INVESTMENT + WHAT WE NEED -->
<div class="page">
  <div class="section">
    <div class="section-num">06</div>
    <h2>Investment</h2>
    <div class="pricing-grid">
      <div class="pricing-card recommended">
        <h4>${proposal.pricingPhase}</h4>
        <div class="subtitle">${proposal.pricingSubtitle}</div>
        <div class="price">${proposal.pricingAmount} <span style="font-size:16px;color:var(--text-muted)">${proposal.pricingCurrency}</span></div>
        ${proposal.pricingAmountAlt ? `<div style="font-size:13px;color:var(--text-muted);margin-top:-4px;margin-bottom:8px;">≈ ${proposal.pricingAmountAlt} ${proposal.pricingCurrencyAlt ?? ""} <span style="font-size:11px;opacity:0.7;">at current exchange rate</span></div>` : ""}
        <div class="price-label">${proposal.pricingNote}</div>
        <ul>${pricingItems}</ul>
      </div>
    </div>
    <p style="font-size:13px;color:var(--text-muted);margin-top:12px;">Payment: ${proposal.paymentTerms}. Methods: ${proposal.paymentMethods}.</p>
  </div>
  ${hasSetupFees ? `
  <div class="section">
    <div class="section-num">06b</div>
    <h2>Optional Add-Ons</h2>
    <table>
      <thead><tr><th>Service</th><th style="text-align:right">Fee</th></tr></thead>
      <tbody>${setupFeeRows}</tbody>
    </table>
    <p style="font-size:12px;color:var(--text-muted);margin-top:-12px;">Add-ons are optional and billed separately if requested.</p>
  </div>` : ""}

  <div class="section">
    <div class="section-num">07</div>
    <h2>What We Need From ${(proposal.clientName || "").split(' ')[0]}</h2>
    <div class="scope-grid">
      <div class="scope-col included"><h4>✓ To get started</h4><ul>${needItems}</ul></div>
      <div class="scope-col excluded">
        <h4>- Client provides</h4>
        <ul>${provideItems}</ul>
        ${proposal.managedSetup ? `<div style="margin-top:12px;padding:10px 12px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;font-size:11px;color:#1E40AF;line-height:1.5;">
          <strong>Prefer we handle it?</strong><br/>
          We can manage domain purchase &amp; email setup for <strong>$100 CAD + cost of domain &amp; email service</strong>. Just let us know when signing.
        </div>` : ""}
      </div>
    </div>
  </div>
  <div class="footer"><span>Confidential - Prepared for ${proposal.preparedFor}</span><a href="https://ailevelup.ca">ailevelup.ca</a></div>
</div>

<!-- PAGE 5 - TERMS -->
<div class="page">
  <div class="section">
    <div class="section-num">08</div>
    <h2>Terms</h2>
    <div class="terms-grid">${termRows}</div>
  </div>
  <div class="footer"><span>Confidential - Prepared for ${proposal.preparedFor}</span><a href="https://ailevelup.ca">ailevelup.ca</a></div>
</div>

<!-- PAGE 6 - CTA + SIGNATURES -->
<div class="page page-signatures" style="page-break-before: always;">
  <div class="cta-box">
    <h2>Ready to Get Started?</h2>
    <ol class="cta-steps">${ctaSteps}</ol>
    <p style="margin-top:20px;color:#94a3b8;font-size:13px;"><strong style="color:white;">${((proposal.preparedBy ?? "Praveen Mahtani") + "").split('|')[0].trim()}</strong> · AILevelUp<br>ailevelup.ca · praveen@ailevelup.ca</p>
  </div>

  <div class="signature-block">
    <h3>Signatures</h3>
    <div class="signature-grid">
      <div class="signature-item">
        <div class="name">${proposal.clientName}</div>
        <div class="role">Client</div>
        ${isSigned ? `
          <div class="signed-image-wrap">
            <img src="${signedImg}" alt="Signed by ${proposal.clientName}" />
          </div>
          <div class="date-label"><span>${signedDate}${signedEmail ? ` · ${signedEmail}` : ""}</span></div>
        ` : `
          <div style="margin:10px 0 12px;">
            <input type="email" id="sigEmail" placeholder="Your email address" required style="width:100%;padding:10px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;font-family:inherit;background:#f8fafc;color:#0f172a;" />
          </div>
          <div class="sig-pad-wrap" id="sigWrap">
            <canvas id="sigPad" width="600" height="140"></canvas>
            <div class="sig-pad-label" id="sigLabel">Draw your signature here</div>
          </div>
          <div style="margin-top:8px;display:flex;align-items:center;gap:8px;">
            <button type="button" class="sig-btn sig-btn-clear" id="sigClear">Clear</button>
            <span id="sigDate" style="font-size:12px;color:#94a3b8;"></span>
          </div>
        `}
      </div>
      <div class="signature-item">
        <div class="name">${((proposal.preparedBy ?? "Praveen Mahtani") + "").split('|')[0].trim()}</div>
        <div class="role">AILevelUp</div>
        <div style="margin-top:4px;height:72px;border-bottom:1px solid var(--text-primary);display:flex;align-items:flex-end;justify-content:flex-start;margin-bottom:6px;">
          ${preparerSig ? `<img src="${preparerSig}" alt="signature" style="max-width:260px;max-height:70px;filter:brightness(0);display:block;margin-bottom:-1px;" />` : ""}
        </div>
        <div class="date-label"><span>${proposal.date}</span></div>
      </div>
    </div>

    ${isSigned ? `
      <div class="signed-banner no-print">
        <div class="signed-banner-icon">✓</div>
        <h3>Proposal Signed!</h3>
        <p>Thank you${proposal.clientName ? `, ${proposal.clientName.split(" ")[0]}` : ""}. A copy has been sent to your email${signedEmail ? ` at <strong>${signedEmail}</strong>` : ""}. You can also download it below — we'll be in touch within 24 hours.</p>
        <button type="button" class="signed-download" onclick="window.print()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Signed Copy
        </button>
      </div>
    ` : ""}
  </div>

  <div class="footer"><span>Confidential - Prepared for ${proposal.preparedFor}</span><a href="https://ailevelup.ca">ailevelup.ca</a></div>
</div>

<script>
(function() {
  var IS_SIGNED = ${isSigned ? "true" : "false"};
  if (IS_SIGNED) return; // no sig-pad wiring on signed proposals

  var canvas = document.getElementById('sigPad');
  var wrap = document.getElementById('sigWrap');
  var clearBtn = document.getElementById('sigClear');
  var sigDate = document.getElementById('sigDate');
  var sigEmail = document.getElementById('sigEmail');
  if (!canvas || !wrap || !clearBtn || !sigDate || !sigEmail) return;
  var ctx = canvas.getContext('2d');
  var drawing = false, lastX = 0, lastY = 0;
  var submitBtn = null;

  sigDate.textContent = new Date().toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'});

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var cx = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
    var cy = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
    return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
  }
  function startDraw(e) { e.preventDefault(); drawing = true; var p = getPos(e); lastX = p.x; lastY = p.y; }
  function doDraw(e) { e.preventDefault(); if (!drawing) return; var p = getPos(e); ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(p.x,p.y); ctx.strokeStyle='#0f172a'; ctx.lineWidth=2; ctx.lineCap='round'; ctx.stroke(); lastX=p.x; lastY=p.y; wrap.classList.add('signed'); if(submitBtn) submitBtn.disabled=false; }
  function stopDraw() { drawing = false; }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', doDraw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);
  canvas.addEventListener('touchstart', startDraw, {passive:false});
  canvas.addEventListener('touchmove', doDraw, {passive:false});
  canvas.addEventListener('touchend', stopDraw);

  clearBtn.addEventListener('click', function() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    wrap.classList.remove('signed');
    if(submitBtn) submitBtn.disabled = true;
  });

  submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'sig-submit';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Accept & Sign Proposal - ${proposal.pricingAmount} ${proposal.pricingCurrency}';
  submitBtn.addEventListener('click', async function() {
    var email = (sigEmail.value || '').trim();
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { sigEmail.style.borderColor='#ef4444'; sigEmail.focus(); alert('Please enter a valid email.'); return; }
    sigEmail.style.borderColor='#cbd5e1';
    var img = canvas.toDataURL();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    try {
      var fd = new FormData();
      fd.append('name', '${proposal.clientName}');
      fd.append('email', email);
      fd.append('date', sigDate.textContent);
      fd.append('proposal_slug', '${proposal.id}');
      fd.append('signature', img);
      var res = await fetch('/api/proposal-signature', { method: 'POST', body: fd });
      var data = await res.json().catch(function(){ return {}; });
      if (!res.ok || !data.success) {
        console.error('[sign] failed', res.status, data);
        alert('Sorry — there was a problem saving your signature: ' + (data.error || res.status) + '. Please try again or contact praveen@ailevelup.ca.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Accept & Sign Proposal - ${proposal.pricingAmount} ${proposal.pricingCurrency}';
        return;
      }
      console.log('[sign] saved', data);
    } catch(e) {
      console.error('[sign] exception', e);
      alert('Sorry — there was a network error saving your signature. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Accept & Sign Proposal - ${proposal.pricingAmount} ${proposal.pricingCurrency}';
      return;
    }
    // Reload so the server-rendered "signed" variant takes over (with
    // the saved signature embedded and the Download Signed Copy button)
    window.location.reload();
  });
  sigDate.parentElement.parentElement.appendChild(submitBtn);
})();
</script>

</body>
</html>`;
}

export default function ProposalClient({
  proposal,
  preparerSignature,
}: {
  proposal: Proposal;
  preparerSignature?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sigDataUrl] = useState("");

  const html = buildProposalHTML(
    proposal,
    sigDataUrl,
    preparerSignature ?? null,
  );

  return (
    <div ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
