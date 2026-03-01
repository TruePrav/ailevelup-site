import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased`} style={{ background: "#FFFFFF" }}>
        {children}
      </body>
    </html>
  );
}
