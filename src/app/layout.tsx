import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clockchain Research — Agentic AI x Verifiable Time",
  description:
    "Twice-weekly voice-optimized research briefs on the intersection of agentic AI and the Clockchain network. Agent identity, SDKs, the on-chain agent economy, attestation, and trust.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
