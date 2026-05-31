import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllResearch, getResearchDoc } from "@/lib/load-research";

export function generateStaticParams() {
  return getAllResearch().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getResearchDoc(slug);
  if (!d) return { title: "Not found" };
  return { title: `${d.title} — Clockchain Research`, description: d.dek };
}

export default async function ResearchDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getResearchDoc(slug);
  if (!d) notFound();

  return (
    <article
      className="max-w-3xl mx-auto px-6 py-12"
      style={{ color: "var(--md-sys-color-on-surface)" }}
    >
      <Link
        href="/research"
        className="text-xs font-medium uppercase tracking-widest mb-6 inline-block"
        style={{ color: "var(--md-sys-color-primary)" }}
      >
        ← Research Library
      </Link>

      <header
        className="mb-8 pb-6"
        style={{ borderBottom: "1px solid var(--md-sys-color-outline)" }}
      >
        <p
          className="text-xs font-medium uppercase tracking-widest mb-2"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          {d.category}
          {d.date ? ` · ${d.date}` : ""}
        </p>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          {d.dek}
        </p>
      </header>

      <div className="prose-paper">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{d.content}</ReactMarkdown>
      </div>

      <style>{`
        .prose-paper h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; margin: 0 0 1rem 0; }
        .prose-paper h2 { font-size: 1.4rem; font-weight: 600; margin: 2.25rem 0 0.75rem 0; padding-top: 1rem; border-top: 1px solid var(--md-sys-color-outline); }
        .prose-paper h3 { font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem 0; }
        .prose-paper h4 { font-size: 1rem; font-weight: 600; margin: 1rem 0 0.4rem 0; }
        .prose-paper p { font-size: 1rem; line-height: 1.75; margin: 0 0 1rem 0; }
        .prose-paper em { color: var(--md-sys-color-on-surface-variant); }
        .prose-paper blockquote { border-left: 3px solid var(--md-sys-color-primary); padding-left: 1rem; margin: 1rem 0; font-style: italic; color: var(--md-sys-color-on-surface-variant); }
        .prose-paper ul, .prose-paper ol { margin: 0 0 1rem 1.5rem; line-height: 1.75; }
        .prose-paper li { margin-bottom: 0.35rem; }
        .prose-paper code { background: var(--md-sys-color-surface-container); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.85em; word-break: break-word; }
        .prose-paper pre { background: var(--md-sys-color-surface-container); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
        .prose-paper pre code { background: none; padding: 0; }
        .prose-paper table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.85rem; display: block; overflow-x: auto; }
        .prose-paper th, .prose-paper td { border: 1px solid var(--md-sys-color-outline); padding: 0.5rem 0.6rem; text-align: left; vertical-align: top; }
        .prose-paper th { background: var(--md-sys-color-surface-container); font-weight: 600; }
        .prose-paper hr { border: 0; border-top: 1px solid var(--md-sys-color-outline); margin: 2rem 0; }
        .prose-paper a { color: var(--md-sys-color-primary); text-decoration: underline; word-break: break-word; }
      `}</style>
    </article>
  );
}
