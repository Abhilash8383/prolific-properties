import Link from "next/link";
import { AdminForm, ConfirmButton } from "@/components/admin/client";
import { Input, PageHeader, Panel, Textarea } from "@/components/admin/fields";
import { adminTestimonials } from "@/lib/admin-data";
import { deleteTestimonial, saveTestimonial } from "../../actions";

export const instant = false;

export default async function AdminTestimonials({ searchParams }: PageProps<"/admin/testimonials">) {
  const { edit } = await searchParams;
  const items = await adminTestimonials();
  const editing = items.find((t) => t.id === edit);

  return (
    <>
      <PageHeader title="Testimonials" text="Shown on the home page, in the order below." />
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="grid content-start gap-4">
          {items.map((t) => (
            <div key={t.id} className={`rounded-2xl border bg-white p-5 ${t.id === edit ? "border-brand-500" : "border-line"}`}>
              <p className="text-ink/80">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm">
                  <span className="font-semibold text-ink">{t.name}</span> <span className="text-muted">· {t.role}</span>
                </p>
                <div className="flex gap-4">
                  <Link href={`?edit=${t.id}`} className="text-sm font-medium text-brand-700 hover:underline">
                    Edit
                  </Link>
                  <ConfirmButton action={deleteTestimonial.bind(null, t.id)} confirm={`Delete testimonial from ${t.name}?`}>
                    Delete
                  </ConfirmButton>
                </div>
              </div>
            </div>
          ))}
          {!items.length && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">No testimonials yet.</p>}
        </div>
        <AdminForm key={editing?.id ?? "new"} action={saveTestimonial} submitLabel={editing ? "Save changes" : "Add testimonial"} className="grid content-start gap-4">
          <Panel title={editing ? "Edit testimonial" : "Add testimonial"}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Input label="Name" name="name" defaultValue={editing?.name} required />
            <Input label="Role / description" name="role" defaultValue={editing?.role} placeholder="e.g. Home Owner" />
            <Textarea label="Testimonial" name="text" rows={5} defaultValue={editing?.text} required />
            <Input label="Display order" name="order" type="number" min={0} defaultValue={editing?.order ?? items.length} />
            {editing && (
              <Link href="/admin/testimonials" className="text-sm text-muted hover:text-ink">
                Cancel editing
              </Link>
            )}
          </Panel>
        </AdminForm>
      </div>
    </>
  );
}
