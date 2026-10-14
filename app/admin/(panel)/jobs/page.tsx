import Link from "next/link";
import { AdminForm, ConfirmButton } from "@/components/admin/client";
import { Checkbox, Input, PageHeader, Panel, Textarea } from "@/components/admin/fields";
import { adminJobs } from "@/lib/admin-data";
import { deleteJob, saveJob } from "../../actions";

export const instant = false;

export default async function AdminJobs({ searchParams }: PageProps<"/admin/jobs">) {
  const { edit } = await searchParams;
  const jobs = await adminJobs();
  const editing = jobs.find((j) => j.id === edit);

  return (
    <>
      <PageHeader title="Job openings" text="Open positions are listed on the Career page." />
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="grid content-start gap-4">
          {jobs.map((j) => (
            <div key={j.id} className={`rounded-2xl border bg-white p-5 ${j.id === edit ? "border-brand-500" : "border-line"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-ink">{j.title}</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${j.open ? "bg-emerald-50 text-emerald-700" : "bg-surface text-muted"}`}>
                  {j.open ? "Open" : "Closed"}
                </span>
              </div>
              <p className="text-sm text-muted">
                {j.type} · {j.location}
              </p>
              <p className="mt-2 text-sm text-ink/80">{j.text}</p>
              <div className="mt-3 flex gap-4">
                <Link href={`?edit=${j.id}`} className="text-sm font-medium text-brand-700 hover:underline">
                  Edit
                </Link>
                <ConfirmButton action={deleteJob.bind(null, j.id)} confirm={`Delete "${j.title}"?`}>
                  Delete
                </ConfirmButton>
              </div>
            </div>
          ))}
          {!jobs.length && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">No job openings yet.</p>}
        </div>
        <AdminForm key={editing?.id ?? "new"} action={saveJob} submitLabel={editing ? "Save changes" : "Add opening"} className="grid content-start gap-4">
          <Panel title={editing ? "Edit opening" : "Add opening"}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Input label="Job title" name="title" defaultValue={editing?.title} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Type" name="type" defaultValue={editing?.type ?? "Full-time"} />
              <Input label="Location" name="location" defaultValue={editing?.location ?? "Bhubaneswar"} />
            </div>
            <Textarea label="Description" name="text" rows={4} defaultValue={editing?.text} />
            <Checkbox label="Accepting applications" name="open" defaultChecked={editing?.open ?? true} />
            {editing && (
              <Link href="/admin/jobs" className="text-sm text-muted hover:text-ink">
                Cancel editing
              </Link>
            )}
          </Panel>
        </AdminForm>
      </div>
    </>
  );
}
