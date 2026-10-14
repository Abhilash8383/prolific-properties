import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/fields";
import { PostForm } from "@/components/admin/PostForm";
import { adminPost } from "@/lib/admin-data";

export const instant = false;

export default async function EditPost({ params }: PageProps<"/admin/blog/[id]">) {
  const post = await adminPost((await params).id);
  if (!post) notFound();
  return (
    <>
      <PageHeader title="Edit post" text={post.title} />
      <PostForm post={post} />
    </>
  );
}
