import type { Metadata } from "next";
import Link from "next/link";
import { getAllBriefs } from "@/lib/load-briefs";
import BriefRenderer from "@/components/BriefRenderer";
import BriefArchive from "@/components/BriefArchive";

export const metadata: Metadata = {
  title: "Brief — Clockchain Research",
  description:
    "Twice-weekly voice-optimized research briefs on agentic AI and the Clockchain network. Updated Tuesdays and Fridays.",
  openGraph: {
    type: "article",
    title: "Brief — Clockchain Research",
    description:
      "Twice-weekly voice-optimized research briefs on agentic AI and the Clockchain network.",
  },
};

export default function BriefIndexPage() {
  const briefs = getAllBriefs();
  const latest = briefs[0]?.briefAlso ? briefs[1] : briefs[0];
  const archive = briefs.filter((b) => b.briefAlso || b !== latest);

  return (
    <div className="min-h-screen" style={{ background: "var(--md-sys-color-background)" }}>
      <div className="max-w-screen-xl mx-auto px-6 pt-12 pb-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--md-sys-color-primary)", textDecoration: "none" }}
          >
            ← Clockchain Research
          </Link>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 pt-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: "var(--md-sys-color-primary)" }}
          >
            Clockchain Research Brief
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              color: "var(--md-sys-color-on-surface)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Agentic AI x verifiable time
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: "var(--md-sys-color-on-surface-variant)" }}
          >
            Voice-optimized research on agent identity, agent SDKs, the on-chain
            agent economy, attestation, and trust. Published every Tuesday and
            Friday.
          </p>
        </div>
      </div>

      {latest ? (
        <div className="max-w-screen-xl mx-auto px-6 pb-16">
          <BriefRenderer brief={latest} />
        </div>
      ) : (
        <div
          className="max-w-2xl mx-auto px-6 pb-16 text-center"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          <p>No briefs yet. The first one will appear here.</p>
        </div>
      )}

      {archive.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-6 pb-24">
          <BriefArchive briefs={archive} />
        </div>
      )}
    </div>
  );
}
