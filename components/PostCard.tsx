import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10">
      <div className="relative aspect-16/10 overflow-hidden bg-surface">
        {post.coverImage && (
          <Image src={post.coverImage} alt={post.title} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-700">{post.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-muted">{formatDate(post.publishedAt)}</p>
        <h3 className="mt-2 text-lg leading-snug font-semibold text-ink group-hover:text-brand-700">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
