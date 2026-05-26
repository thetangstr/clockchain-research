import type { Brief, BriefSection } from "@/types";

interface Props {
  brief: Brief;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function sectionHeading(s: BriefSection): string {
  return s.heading ?? s.title ?? "";
}

function sectionBody(s: BriefSection): string {
  return s.body ?? s.content ?? "";
}

/**
 * Voice-friendly brief renderer. Prose-first layout: title
 * block, TL;DR, prose sections (the LAST section is the mandatory tie-back to
 * our agent products), follow-up questions, sources.
 */
export default function BriefRenderer({ brief }: Props) {
  return (
    <article
      className="max-w-3xl mx-auto"
      style={{ color: "var(--md-sys-color-on-surface)" }}
    >
      <header
        className="mb-8 pb-6"
        style={{ borderBottom: "1px solid var(--md-sys-color-outline)" }}
      >
        <time
          dateTime={brief.date}
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--md-sys-color-primary)" }}
        >
          {formatDate(brief.date)} · {brief.readTimeMinutes} min read
        </time>
        <h1
          className="text-3xl sm:text-4xl font-bold mt-3 mb-3"
          style={{ letterSpacing: "-0.02em", lineHeight: 1.2 }}
        >
          {brief.title}
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          {brief.dek}
        </p>
      </header>

      <section className="mb-10">
        <h2
          className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--md-sys-color-on-surface-muted)" }}
        >
          TL;DR
        </h2>
        <p className="text-base leading-8">{brief.tldr}</p>
      </section>

      {brief.keyPoints && brief.keyPoints.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-medium uppercase tracking-widest mb-3"
            style={{ color: "var(--md-sys-color-on-surface-muted)" }}
          >
            Key points
          </h2>
          <ul className="space-y-3">
            {brief.keyPoints.map((kp, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: "var(--md-sys-color-primary)",
                    marginTop: "9px",
                  }}
                />
                <span className="text-base leading-7">{kp}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {brief.sections.map((s, i) => (
        <section key={i} className="mb-10">
          <h2 className="text-xl font-semibold mb-3">{sectionHeading(s)}</h2>
          <p className="text-base leading-8 whitespace-pre-line">
            {sectionBody(s)}
          </p>
        </section>
      ))}

      {brief.nextUp.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm font-semibold uppercase tracking-wide mb-3"
            style={{ color: "var(--md-sys-color-on-surface-muted)" }}
          >
            Ask me next
          </h2>
          <ul
            className="space-y-2 text-base leading-7 italic"
            style={{ color: "var(--md-sys-color-on-surface-variant)" }}
          >
            {brief.nextUp.map((q, i) => (
              <li key={i}>&ldquo;{q}&rdquo;</li>
            ))}
          </ul>
        </section>
      )}

      {brief.sources.length > 0 && (
        <section className="mb-12">
          <h2
            className="text-sm font-semibold uppercase tracking-wide mb-3"
            style={{ color: "var(--md-sys-color-on-surface-muted)" }}
          >
            Sources
          </h2>
          <ul className="space-y-1.5 text-sm">
            {brief.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--md-sys-color-primary)",
                    textDecoration: "underline",
                  }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
