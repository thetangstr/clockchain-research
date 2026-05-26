import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--md-sys-color-background)" }}>
      <div className="max-w-screen-md mx-auto px-6 pt-24 pb-24">
        <p
          className="text-xs font-medium uppercase tracking-widest mb-6"
          style={{ color: "var(--md-sys-color-primary)" }}
        >
          Clockchain Research
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold mb-5"
          style={{
            color: "var(--md-sys-color-on-surface)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Agentic AI meets verifiable time.
        </h1>
        <p
          className="text-lg leading-relaxed mb-10"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          Twice-weekly voice-optimized research briefs on agent identity, agent
          SDKs, the on-chain agent economy, blockchain time and attestation, and
          agent trust. Written to be read aloud on a phone or in a car.
        </p>
        <Link
          href="/brief"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
          style={{
            background: "var(--md-sys-color-primary)",
            color: "var(--md-sys-color-on-primary)",
            textDecoration: "none",
          }}
        >
          Read the latest brief
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
