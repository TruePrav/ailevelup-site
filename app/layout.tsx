import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ailevelup.ca — Chat with your new 24/7 AI team",
  description:
    "Custom AI agents for Caribbean businesses. Customer support, reconciliation, content — all automated. Try them live now.",
  openGraph: {
    title: "Chat with your new 24/7 AI team now",
    description: "Meet Scout, Ledger, and Aria — your AI operations team. Try them live.",
    siteName: "ailevelup.ca",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050810] antialiased`}>{children}</body>
    </html>
  );
}
