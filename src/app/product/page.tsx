import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function loadProductPaper() {
  const fullPath = path.join(process.cwd(), "docs", "product", "product-paper.md");
  if (!fs.existsSync(fullPath)) return null;
  const parsed = matter(fs.readFileSync(fullPath, "utf-8"));
  return {
    title: String(parsed.data.title ?? "Product Paper"),
    dek: String(parsed.data.dek ?? ""),
    version: String(parsed.data.version ?? "v0.1"),
    date: String(parsed.data.date ?? ""),
    maintainer: String(parsed.data.maintainer ?? ""),
    content: parsed.content,
  };
}

export function generateMetadata() {
  const p = loadProductPaper();
  return {
    title: p ? `${p.title} — Clockchain Research` : "Product Paper",
    description: p?.dek ?? "",
  };
}

export default function ProductPaperPage() {
  const p = loadProductPaper();
  if (!p) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p>Product paper not found.</p>
      </div>
    );
  }
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
          Living product paper · {p.version} · {p.date}
          {p.maintainer ? ` · ${p.maintainer}` : ""}
        </p>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
        >
          {p.dek}
        </p>
      </header>

      <div className="prose-paper">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown>
      </div>

      <style>{`
        .prose-paper h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; margin: 0 0 1rem 0; }
        .prose-paper h2 { font-size: 1.4rem; font-weight: 600; margin: 2.25rem 0 0.75rem 0; padding-top: 1rem; border-top: 1px solid var(--md-sys-color-outline); }
        .prose-paper h3 { font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem 0; }
        .prose-paper p { font-size: 1rem; line-height: 1.75; margin: 0 0 1rem 0; }
        .prose-paper em { color: var(--md-sys-color-on-surface-variant); }
        .prose-paper ul, .prose-paper ol { margin: 0 0 1rem 1.5rem; line-height: 1.75; }
        .prose-paper li { margin-bottom: 0.35rem; }
        .prose-paper code { background: var(--md-sys-color-surface-container); padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.85em; }
        .prose-paper table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
        .prose-paper th, .prose-paper td { border: 1px solid var(--md-sys-color-outline); padding: 0.5rem 0.75rem; text-align: left; }
        .prose-paper th { background: var(--md-sys-color-surface-container); font-weight: 600; }
        .prose-paper hr { border: 0; border-top: 1px solid var(--md-sys-color-outline); margin: 2rem 0; }
        .prose-paper a { color: var(--md-sys-color-primary); text-decoration: underline; }
      `}</style>
    </article>
  );
}
