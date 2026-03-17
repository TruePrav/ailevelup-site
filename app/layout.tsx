import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "ailevelup.ca — Your Custom AI Operations Team",
  description:
    "Custom AI agents for every business function — support, finance, sales, operations, marketing and more. Fully trained to your business. Try them live now.",
  openGraph: {
    title: "Your Custom AI Operations Team",
    description: "AI agents for every business function. Fully trained to your business. Try them live.",
    siteName: "ailevelup.ca",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
