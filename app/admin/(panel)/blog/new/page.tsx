import { PageHeader } from "@/components/admin/fields";
import { PostForm } from "@/components/admin/PostForm";

export const instant = false;

export default function NewPost() {
  return (
    <>
      <PageHeader title="New blog post" />
      <PostForm />
    </>
  );
}
