import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { PostCard } from "@/components/PostCard";
import { getPosts } from "@/lib/data";
import { img } from "@/lib/site";
import { seoMetadata } from "@/lib/seo";

export const metadata: Metadata = seoMetadata({ title: "Bhubaneswar Real Estate Insights", description: "Read local guides and updates on buying property, home loans, neighbourhoods and real estate in Bhubaneswar and Odisha.", path: "/blog" });

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero title="Blog" text="Guides, market insights and tips for buying, selling and investing in property." image={img("1449844908441-8829872d2607")} />
      <section className="container-x py-12 md:py-20">
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-muted">No articles yet. Check back soon.</p>
        )}
      </section>
    </>
  );
}
