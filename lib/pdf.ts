import chromium from "@sparticuz/chromium";
import puppeteer, { Browser } from "puppeteer-core";

/**
 * Render a public page (like a proposal) to a PDF buffer.
 *
 * Uses @sparticuz/chromium so it works inside Vercel's serverless functions.
 * Expects the route that calls this to set:
 *
 *   export const maxDuration = 60;   // seconds
 *
 * and (in Vercel dashboard) function memory of at least 1024 MB.
 */
export async function renderPageToPdf(url: string): Promise<Buffer> {
  let browser: Browser | null = null;
  try {
    browser = (await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 2 },
      executablePath: await chromium.executablePath(),
      headless: true,
    })) as unknown as Browser;

    const page = await browser.newPage();

    // Pretend to be a desktop so CSS @page rules apply nicely
    await page.emulateMediaType("print");

    await page.goto(url, { waitUntil: "networkidle0", timeout: 45_000 });

    // Give webfonts a beat to settle
    await page.evaluateHandle("document.fonts.ready");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });

    return Buffer.from(pdf);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (err) {
        console.warn("[pdf] browser close failed:", err);
      }
    }
  }
}

export async function renderProposalPdf(
  proposalId: string,
  baseUrl?: string
): Promise<Buffer> {
  const base =
    baseUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://www.ailevelup.ca";
  const url = `${base.replace(/\/$/, "")}/proposals/${proposalId}`;
  return renderPageToPdf(url);
}
