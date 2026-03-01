import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "700", "900"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ailevelup.ca — Your Custom AI Operations Team",
  description:
    "Custom AI agents for small businesses. Customer support, reconciliation, content — all automated. Try them live now.",
  openGraph: {
    title: "Your Custom AI Operations Team",
    description: "Meet Scout, Ledger, and Aria — your AI operations team. Try them live.",
    siteName: "ailevelup.ca",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${dmSans.variable} antialiased`}
        style={{ background: "#0A0A0A", color: "#F5F0E8", fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
