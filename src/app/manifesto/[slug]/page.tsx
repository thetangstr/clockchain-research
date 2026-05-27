import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadManifesto, loadManifestos } from "@/lib/load-manifestos";

export function generateStaticParams() {
  return loadManifestos().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = loadManifesto(slug);
  if (!m) return { title: "Manifesto not found" };
  return { title: `${m.title} — Clockchain Research`, description: m.dek };
}

export default async function ManifestoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = loadManifesto(slug);
  if (!m) notFound();

  return (
    <article
      className="max-w-3xl mx-auto px-6 py-12"
      style={{ color: "var(--md-sys-color-on-surface)" }}
    >
      <Link
        href="/"
        className="text-xs font-medium uppercase tracking-widest mb-6 inline-block"
        style={{ color: "var(--md-sys-color-primary)" }}
      >
        ← Clockchain Research
      </Link>

      <header
        className="mb-8 pb-6"
        style={{ borderBottom: "1px solid var(--md-sys-color-outline)" }}
      >
        <p
          className="text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          Manifesto · {m.version} · {m.date}
        </p>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          {m.dek}
        </p>
      </header>

      <div className="prose-manifesto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
      </div>

      <style>{`
        .prose-manifesto h1 {
          font-size: 2rem; font-weight: 700; letter-spacing: -0.02em;
          line-height: 1.2; margin: 0 0 1rem 0;
        }
        .prose-manifesto h2 {
          font-size: 1.4rem; font-weight: 600; margin: 2rem 0 0.75rem 0;
          color: var(--md-sys-color-on-surface);
        }
        .prose-manifesto h3 {
          font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem 0;
        }
        .prose-manifesto p {
          font-size: 1rem; line-height: 1.75; margin: 0 0 1rem 0;
        }
        .prose-manifesto blockquote {
          border-left: 3px solid var(--md-sys-color-primary);
          padding-left: 1rem; margin: 1rem 0;
          font-style: italic; color: var(--md-sys-color-on-surface-variant);
        }
        .prose-manifesto ul, .prose-manifesto ol {
          margin: 0 0 1rem 1.5rem; line-height: 1.75;
        }
        .prose-manifesto li { margin-bottom: 0.25rem; }
        .prose-manifesto code {
          background: var(--md-sys-color-surface-container);
          padding: 0.125rem 0.375rem; border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .prose-manifesto a {
          color: var(--md-sys-color-primary); text-decoration: underline;
        }
        .prose-manifesto hr {
          border: 0; border-top: 1px solid var(--md-sys-color-outline);
          margin: 2rem 0;
        }
      `}</style>
    </article>
  );
}
