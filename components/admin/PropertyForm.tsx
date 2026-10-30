import { AdminForm } from "./client";
import { VariantEditor } from "./VariantEditor";
import { Checkbox, Input, Panel, Select, Textarea } from "./fields";
import { saveProperty } from "@/app/admin/actions";
import { CATEGORIES, LISTING_TYPES, PLACEMENTS, type Placement, type Property } from "@/lib/types";

export function PropertyForm({ p }: { p?: Property }) {
  return (
    <AdminForm action={saveProperty} submitLabel={p ? "Save changes" : "Create property"}>
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="grid min-w-0 gap-6">
          <Panel title="Basics">
            <Input label="Title" name="title" defaultValue={p?.title} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="URL slug" name="slug" defaultValue={p?.slug} hint="Leave empty to generate from the title" />
              <Input label="Developer" name="developer" defaultValue={p?.developer} />
            </div>
            <Textarea label="Short summary" name="summary" rows={2} defaultValue={p?.summary} hint="Shown on listing cards and in search results" />
            <Textarea
              label="Description"
              name="description"
              rows={8}
              defaultValue={p?.description.join("\n\n")}
              hint="Separate paragraphs with an empty line"
            />
          </Panel>

          <Panel title="Location">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Area / locality" name="area" defaultValue={p?.area} />
              <Input label="City" name="city" defaultValue={p?.city ?? "Bhubaneswar"} />
              <Input label="State" name="state" defaultValue={p?.state ?? "Odisha"} />
            </div>
          </Panel>

          <Panel title="Project details">
            <Input label="RERA number" name="rera" defaultValue={p?.rera} />
          </Panel>

          <VariantEditor p={p} />

          <Panel title="Photos" text="The first image is used as the cover photo.">
            <Input label="Upload new photos to Cloudinary" name="uploads" type="file" accept="image/jpeg,image/png,image/webp" multiple hint="JPG, PNG or WebP, up to 3.5 MB total per save. Added after the existing photos." />
            {p && (
              <Textarea
                label="Existing photos"
                name="images"
                rows={5}
                defaultValue={p.images.join("\n")}
                hint="One URL per line. Reorder lines to change the order, or delete a line to remove a photo."
              />
            )}
          </Panel>
        </div>

        <div className="grid content-start gap-6">
          <Panel title="Listing">
            <Select label="Listing type" name="listingType" options={LISTING_TYPES} defaultValue={p?.listingType} />
            <Select label="Category" name="category" options={CATEGORIES} defaultValue={p?.category} />
          </Panel>
          <Panel title="Visibility">
            <Checkbox label="Published on website" name="published" defaultChecked={p?.published ?? true} />
          </Panel>
          <Panel title="Show this property on" text="Published properties always appear on the Properties page. Tick extra sections to promote it.">
            {(Object.entries(PLACEMENTS) as [Placement, (typeof PLACEMENTS)[Placement]][]).map(([key, pl]) => (
              <div key={key}>
                <Checkbox label={pl.label} name="placements" value={key} defaultChecked={p?.placements.includes(key)} />
                <p className="mt-0.5 pl-6.5 text-xs text-muted">{pl.hint}</p>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </AdminForm>
  );
}
