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
          The agent notary layer.
        </h1>
        <p
          className="text-lg leading-relaxed mb-10"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          Court-grade identity and receipts for autonomous AI. Research and
          product thinking on Agent Notarized Identity, Agent Notarized
          Receipts, and the regulatory clock that makes both inevitable.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
            style={{
              background: "var(--md-sys-color-primary)",
              color: "var(--md-sys-color-on-primary)",
              textDecoration: "none",
            }}
          >
            Read the product paper
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/brief"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
            style={{
              background: "var(--md-sys-color-surface-container)",
              color: "var(--md-sys-color-on-surface)",
              textDecoration: "none",
              border: "1px solid var(--md-sys-color-outline)",
            }}
          >
            Latest brief
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
            style={{
              background: "var(--md-sys-color-surface-container)",
              color: "var(--md-sys-color-on-surface)",
              textDecoration: "none",
              border: "1px solid var(--md-sys-color-outline)",
            }}
          >
            Research library
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold transition-all hover:shadow-md"
            style={{
              background: "var(--md-sys-color-surface-container)",
              color: "var(--md-sys-color-on-surface)",
              textDecoration: "none",
              border: "1px solid var(--md-sys-color-outline)",
            }}
          >
            Manifestos
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
