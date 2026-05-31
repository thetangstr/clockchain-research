import Link from "next/link";
import { getAllWeekly } from "@/lib/load-weekly";

export const metadata = {
  title: "Weekly — Clockchain Research",
  description:
    "The weekly Clockchain product + go-to-market digest. Plain-English, cross-checked, published every Monday.",
};

export default function WeeklyIndexPage() {
  const digests = getAllWeekly();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-xs font-medium uppercase tracking-widest mb-6 inline-block"
        style={{ color: "var(--md-sys-color-primary)" }}
      >
        ← Clockchain Research
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold mb-5">Weekly</h1>
      <p
        className="text-lg leading-relaxed mb-10"
        style={{ color: "var(--md-sys-color-on-surface-variant)" }}
      >
        The Monday digest — what we learned this week and what it means for the
        product and go-to-market. Plain English, cross-checked, and honest about
        what didn&apos;t move.
      </p>

      {digests.length === 0 ? (
        <p style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
          No digests yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {digests.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/weekly/${d.slug}`}
                className="block p-5 rounded-lg transition-colors"
                style={{
                  background: "var(--md-sys-color-surface-container)",
                  color: "var(--md-sys-color-on-surface)",
                  textDecoration: "none",
                }}
              >
                <h3 className="text-lg font-semibold mb-1">{d.title}</h3>
                {d.dek ? (
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                  >
                    {d.dek}
                  </p>
                ) : null}
                <p
                  className="text-xs mt-2"
                  style={{ color: "var(--md-sys-color-on-surface-muted)" }}
                >
                  {d.date}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
