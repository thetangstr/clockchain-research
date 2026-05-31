import Link from "next/link";
import { getAllResearch, RESEARCH_CATEGORIES } from "@/lib/load-research";

export const metadata = {
  title: "Research Library — Clockchain Research",
  description:
    "The full research library: thesis, decisions, the industry rubric, inflection points, deep research, vertical deep-dives, and specs.",
};

export default function ResearchIndexPage() {
  const docs = getAllResearch();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-xs font-medium uppercase tracking-widest mb-6 inline-block"
        style={{ color: "var(--md-sys-color-primary)" }}
      >
        ← Clockchain Research
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold mb-5">Research Library</h1>
      <p
        className="text-lg leading-relaxed mb-10"
        style={{ color: "var(--md-sys-color-on-surface-variant)" }}
      >
        Everything the research has produced — the thesis and decisions, the
        scoring rubric, the strategic forks we&apos;re watching, the deep
        research, the vertical deep-dives, and the product specs. Cross-checked
        by multiple agents; research-stage unless noted.
      </p>

      {RESEARCH_CATEGORIES.map((cat) => {
        const inCat = docs.filter((d) => d.category === cat);
        if (inCat.length === 0) return null;
        return (
          <section key={cat} className="mb-10">
            <h2
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--md-sys-color-primary)" }}
            >
              {cat}
            </h2>
            <ul className="space-y-4">
              {inCat.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/research/${d.slug}`}
                    className="block p-5 rounded-lg transition-colors"
                    style={{
                      background: "var(--md-sys-color-surface-container)",
                      color: "var(--md-sys-color-on-surface)",
                      textDecoration: "none",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-1">{d.title}</h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                    >
                      {d.dek}
                    </p>
                    {d.date ? (
                      <p
                        className="text-xs mt-2"
                        style={{ color: "var(--md-sys-color-on-surface-muted)" }}
                      >
                        {d.date}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
