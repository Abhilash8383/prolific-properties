import { AdminForm } from "./client";
import { VariantEditor } from "./VariantEditor";
import { Checkbox, Input, Panel, Select, Textarea } from "./fields";
import { saveProperty } from "@/app/admin/actions";
import { CATEGORIES, LISTING_TYPES, PLACEMENTS, type Placement, type Property } from "@/lib/types";

const PLACEMENT_COPY: Record<Placement, { label: string; hint: string }> = {
  spotlight: { label: "Hero slideshow on the home page", hint: "Big rotating photos at the top of the home page" },
  homeFeatured: { label: "Featured on the home page", hint: "Shown in the Featured properties section" },
  footer: { label: "Featured in the footer", hint: "Up to 3 properties appear in the site footer" },
  pinned: { label: "Pin to the top of Properties", hint: "Stays near the top of the Properties list" },
};

export function PropertyForm({ p }: { p?: Property }) {
  return (
    <AdminForm action={saveProperty} submitLabel={p ? "Save changes" : "Create property"}>
      {p && <input type="hidden" name="id" value={p.id} />}

      <div className="rounded-2xl border border-brand-200 bg-brand-50/70 px-4 py-3 text-sm text-ink md:px-5">
        <p className="font-semibold text-brand-700">How to list a property</p>
        <ol className="mt-1.5 list-decimal space-y-0.5 pl-5 text-muted">
          <li>Fill in the property name and where it is</li>
          <li>Add each home type (2 BHK, 3 BHK…) with price and size</li>
          <li>Add photos, then publish when it looks right</li>
        </ol>
      </div>

      <div key={p?.updatedAt ?? "new"} className="grid gap-6">
        <Panel step={1} title="Property details" text="The name and story buyers see first.">
          <Input label="Property name" name="title" defaultValue={p?.title} required placeholder="e.g. Skyline Ariana Residences" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="For sale or rent?" name="listingType" options={LISTING_TYPES} defaultValue={p?.listingType} />
            <Select label="Property type" name="category" options={CATEGORIES} defaultValue={p?.category} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Developer / builder" name="developer" defaultValue={p?.developer} placeholder="e.g. Tata Housing" />
            <Input
              label="Web address (optional)"
              name="slug"
              defaultValue={p?.slug}
              hint="Leave blank and we create one from the property name"
              placeholder="skyline-ariana-residences"
            />
          </div>
          <Textarea
            label="Short summary"
            name="summary"
            rows={2}
            defaultValue={p?.summary}
            hint="One or two lines on listing cards and in Google search"
            placeholder="Premium ready-to-move apartments in Kalinga Nagar"
          />
          <Textarea
            label="Full description"
            name="description"
            rows={8}
            defaultValue={p?.description.join("\n\n")}
            hint="Write the full story. Put a blank line between paragraphs."
          />
        </Panel>

        <Panel step={2} title="Location & RERA" text="Where the property is, and its registration number.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Area / locality" name="area" defaultValue={p?.area} placeholder="e.g. Kalinga Nagar" />
            <Input label="City" name="city" defaultValue={p?.city ?? "Bhubaneswar"} />
            <Input label="State" name="state" defaultValue={p?.state ?? "Odisha"} />
          </div>
          <Input label="RERA number" name="rera" defaultValue={p?.rera} placeholder="e.g. RP/19/2024/01234" hint="Shown on the property page for buyers" />
        </Panel>

        <Panel
          step={3}
          title="Home types & prices"
          text="Add one block per home type (for example 2 BHK and 3 BHK). The first one sets the starting price on cards."
        >
          <VariantEditor key={p?.updatedAt ?? "new"} p={p} />
        </Panel>

        <Panel step={4} title="Photos" text="The first photo is the cover on cards and Google results.">
          <Input
            label="Upload new photos"
            name="uploads"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hint="JPG, PNG or WebP. Up to 3.5 MB total per save. New photos are added after the ones below."
          />
          {p && (
            <Textarea
              label="Photo list"
              name="images"
              rows={5}
              defaultValue={p.images.join("\n")}
              hint="One photo link per line. Move a line up to change the cover. Delete a line to remove a photo."
            />
          )}
        </Panel>

        <Panel step={5} title="Publish & promote" text="Control whether it is live, and where else it should appear.">
          <Checkbox label="Published on the website" name="published" defaultChecked={p?.published ?? true} />
          <div className="rounded-xl border border-line bg-surface/60 p-4">
            <p className="text-sm font-semibold text-ink">Also show this property on</p>
            <p className="mt-1 text-xs text-muted">
              Every published property already appears on the Properties page. Tick extras only if you want to promote it.
            </p>
            <div className="mt-4 grid gap-3">
              {(Object.keys(PLACEMENTS) as Placement[]).map((key) => (
                <div key={key}>
                  <Checkbox
                    label={PLACEMENT_COPY[key].label}
                    name="placements"
                    value={key}
                    defaultChecked={p?.placements.includes(key)}
                  />
                  <p className="mt-0.5 pl-6.5 text-xs text-muted">{PLACEMENT_COPY[key].hint}</p>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </AdminForm>
  );
}
