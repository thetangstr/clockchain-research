import Link from "next/link";
import type { Brief } from "@/types";

interface Props {
  briefs: Brief[];
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

export default function BriefArchive({ briefs }: Props) {
  if (briefs.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="pt-10"
        style={{ borderTop: "1px solid var(--md-sys-color-outline)" }}
      >
        <h2
          className="text-sm font-semibold uppercase tracking-wide mb-5"
          style={{ color: "var(--md-sys-color-on-surface-muted)" }}
        >
          Archive
        </h2>
        <ul className="space-y-4">
          {briefs.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/brief/${b.slug}`}
                className="block p-4 rounded-lg transition-all hover:shadow-md"
                style={{
                  background: "#fff",
                  border: "1px solid var(--md-sys-color-outline)",
                  textDecoration: "none",
                }}
              >
                <time
                  dateTime={b.date}
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "var(--md-sys-color-primary)" }}
                >
                  {formatDate(b.date)}
                </time>
                <h3
                  className="font-semibold text-base mt-1 mb-1"
                  style={{ color: "var(--md-sys-color-on-surface)" }}
                >
                  {b.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                >
                  {b.dek}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
