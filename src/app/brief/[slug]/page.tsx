import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBriefs, getBriefBySlug } from "@/lib/load-briefs";
import BriefRenderer from "@/components/BriefRenderer";

export async function generateStaticParams() {
  return getAllBriefs().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) return { title: "Brief not found" };
  return {
    title: `${brief.title} — Clockchain Research Brief`,
    description: brief.dek,
    openGraph: {
      type: "article",
      title: brief.title,
      description: brief.dek,
      publishedTime: brief.date,
    },
    twitter: {
      card: "summary_large_image",
      title: brief.title,
      description: brief.dek,
    },
  };
}

export default async function BriefDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) notFound();

  return (
    <div className="min-h-screen" style={{ background: "var(--md-sys-color-background)" }}>
      <div className="max-w-screen-xl mx-auto px-6 pt-10 pb-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/brief"
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--md-sys-color-primary)", textDecoration: "none" }}
          >
            ← All briefs
          </Link>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 pb-20">
        <BriefRenderer brief={brief} />
      </div>
    </div>
  );
}
