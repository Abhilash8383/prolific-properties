import { AdminForm } from "./client";
import { Checkbox, Input, Panel, Textarea } from "./fields";
import { savePost } from "@/app/admin/actions";
import type { Post } from "@/lib/types";

export function PostForm({ post }: { post?: Post }) {
  return (
    <AdminForm action={savePost} submitLabel={post ? "Save changes" : "Create post"}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="grid min-w-0 gap-6">
          <Panel title="Content">
            <Input label="Title" name="title" defaultValue={post?.title} required />
            <Textarea label="Excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} hint="Short summary shown on blog cards" />
            <Textarea
              label="Article"
              name="content"
              rows={20}
              defaultValue={post?.content}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 font-mono text-sm text-ink outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              hint='Separate paragraphs with an empty line. Start a line with "## " for a heading and "- " for a bullet point.'
            />
          </Panel>
        </div>
        <div className="grid content-start gap-6">
          <Panel title="Publishing">
            <Checkbox label="Published" name="published" defaultChecked={post?.published ?? true} />
            <Input label="Publish date" name="publishedAt" type="date" defaultValue={post?.publishedAt.slice(0, 10)} />
            <Input label="URL slug" name="slug" defaultValue={post?.slug} hint="Leave empty to generate from the title" />
            <Input label="Category" name="category" defaultValue={post?.category} placeholder="e.g. Buying guide" />
            <Input label="Author" name="author" defaultValue={post?.author ?? "Prolific Properties Team"} />
          </Panel>
          <Panel title="Cover image">
            <Input label="Upload to Cloudinary" name="coverUpload" type="file" accept="image/jpeg,image/png,image/webp" hint="JPG, PNG or WebP up to 3.5 MB. Replaces the existing cover image." />
            {post && <Input label="Existing image URL" name="coverImage" defaultValue={post.coverImage} />}
          </Panel>
        </div>
      </div>
    </AdminForm>
  );
}
