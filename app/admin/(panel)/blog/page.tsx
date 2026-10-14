import Link from "next/link";
import { Plus } from "lucide-react";
import { ConfirmButton } from "@/components/admin/client";
import { PageHeader, primaryButton } from "@/components/admin/fields";
import { adminPosts } from "@/lib/admin-data";
import { formatDate } from "@/lib/format";
import { deletePost } from "../../actions";

export const instant = false;

export default async function AdminBlog() {
  const posts = await adminPosts();
  return (
    <>
      <PageHeader
        title="Blog posts"
        text={`${posts.length} posts`}
        action={
          <Link href="/admin/blog/new" className={primaryButton}>
            <Plus className="size-4" /> New post
          </Link>
        }
      />
      <div className="divide-y divide-line rounded-2xl border border-line bg-white">
        {posts.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
            <div className="min-w-0">
              <Link href={`/admin/blog/${p.id}`} className="font-semibold text-ink hover:text-brand-700">
                {p.title}
              </Link>
              <p className="text-sm text-muted">
                {p.category} · {formatDate(p.publishedAt)} ·{" "}
                <span className={p.published ? "text-emerald-600" : "text-amber-600"}>{p.published ? "Published" : "Draft"}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              {p.published && (
                <Link href={`/blog/${p.slug}`} target="_blank" className="text-sm font-medium text-muted hover:text-ink">
                  View
                </Link>
              )}
              <Link href={`/admin/blog/${p.id}`} className="text-sm font-medium text-brand-700 hover:underline">
                Edit
              </Link>
              <ConfirmButton action={deletePost.bind(null, p.id)} confirm={`Delete "${p.title}"?`}>
                Delete
              </ConfirmButton>
            </div>
          </div>
        ))}
        {!posts.length && <p className="p-8 text-center text-muted">No posts yet.</p>}
      </div>
    </>
  );
}
