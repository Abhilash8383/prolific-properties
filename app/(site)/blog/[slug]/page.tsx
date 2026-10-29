import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { formatDate } from "@/lib/format";
import { getPost, getPosts } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, seoMetadata } from "@/lib/seo";

export const instant = false;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post ? seoMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, image: post.coverImage || undefined, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt }) : {};
}

// Supports blank-line separated paragraphs, "## " / "### " headings and "- " bullet lists.
function Content({ text }: { text: string }) {
  return (
    <div className="space-y-5 text-[17px] leading-relaxed text-ink/80">
      {text.split(/\n\s*\n/).map((block, i) => {
        const lines = block.trim().split("\n");
        return (
          <div key={i} className="space-y-3">
            {lines.some((l) => l.startsWith("- ")) ? (
              <>
                {lines.filter((l) => !l.startsWith("- ")).map((l) => <Line key={l} line={l} />)}
                <ul className="list-disc space-y-1.5 pl-6">
                  {lines.filter((l) => l.startsWith("- ")).map((l) => (
                    <li key={l}>{l.slice(2)}</li>
                  ))}
                </ul>
              </>
            ) : (
              lines.map((l, j) => <Line key={j} line={l} />)
            )}
          </div>
        );
      })}
    </div>
  );
}

function Line({ line }: { line: string }) {
  if (line.startsWith("### ")) return <h3 className="pt-2 text-xl font-semibold text-ink">{line.slice(4)}</h3>;
  if (line.startsWith("## ")) return <h2 className="pt-4 text-2xl font-bold text-ink">{line.slice(3)}</h2>;
  return <p>{line}</p>;
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const more = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="pb-16 md:pb-24">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "BlogPosting",
            "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage ? absoluteUrl(post.coverImage) : undefined,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { "@type": "Person", name: post.author },
            publisher: { "@id": `${absoluteUrl("/")}#organization` },
            mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          },
          { "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
            { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
          ] },
        ],
      }} />
      <header className="container-x max-w-3xl pt-10 md:pt-16">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-brand-700">
          <ArrowLeft className="size-4" /> All articles
        </Link>
        <p className="mt-6 text-sm font-semibold tracking-widest text-brand-600 uppercase">{post.category}</p>
        <h1 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-ink md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-muted">
          {post.author} · {formatDate(post.publishedAt)}
        </p>
      </header>
      {post.coverImage && (
        <div className="container-x mt-8 max-w-5xl md:mt-10">
          <div className="relative aspect-16/9 overflow-hidden rounded-3xl bg-surface">
            <Image src={post.coverImage} alt={post.title} fill loading="eager" sizes="(min-width:1024px) 1024px, 100vw" className="object-cover" />
          </div>
        </div>
      )}
      <div className="container-x mt-10 max-w-3xl md:mt-14">
        <Content text={post.content} />
      </div>
      {more.length > 0 && (
        <section className="container-x mt-16 md:mt-24">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">More articles</h2>
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-3">
            {more.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
