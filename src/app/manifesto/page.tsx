import Link from "next/link";
import { loadManifestos } from "@/lib/load-manifestos";

export const metadata = {
  title: "Manifestos — Clockchain Research",
  description:
    "Category-defining manifestos for Clockchain's agent products.",
};

export default function ManifestoIndexPage() {
  const manifestos = loadManifestos();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-xs font-medium uppercase tracking-widest mb-6 inline-block"
        style={{ color: "var(--md-sys-color-primary)" }}
      >
        ← Clockchain Research
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold mb-5">Manifestos</h1>
      <p
        className="text-lg leading-relaxed mb-10"
        style={{ color: "var(--md-sys-color-on-surface-variant)" }}
      >
        Category-defining artifacts for Clockchain&apos;s agent products. The
        language we want the industry to use, written down once.
      </p>

      <ul className="space-y-6">
        {manifestos.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/manifesto/${m.slug}`}
              className="block p-6 rounded-lg transition-colors"
              style={{
                background: "var(--md-sys-color-surface-container)",
                color: "var(--md-sys-color-on-surface)",
                textDecoration: "none",
              }}
            >
              <p
                className="text-xs font-medium uppercase tracking-widest mb-2"
                style={{ color: "var(--md-sys-color-primary)" }}
              >
                {m.version} · {m.date}
              </p>
              <h2 className="text-xl font-semibold mb-2">{m.title}</h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--md-sys-color-on-surface-variant)" }}
              >
                {m.dek}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
