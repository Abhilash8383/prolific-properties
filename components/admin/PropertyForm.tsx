import { AdminForm } from "./client";
import { Checkbox, Input, Panel, Select, Textarea } from "./fields";
import { saveProperty } from "@/app/admin/actions";
import { CATEGORIES, FEATURE_GROUPS, LISTING_TYPES, STATUSES, type Property } from "@/lib/types";

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

          <Panel title="Size & specifications">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Input label="Bedrooms" name="bedrooms" type="number" min={0} defaultValue={p?.bedrooms ?? 0} />
              <Input label="Bathrooms" name="bathrooms" type="number" min={0} defaultValue={p?.bathrooms ?? 0} />
              <Input label="Size (ft²)" name="sqft" type="number" min={0} defaultValue={p?.sqft ?? 0} />
              <Input label="Parking" name="parking" type="number" min={0} defaultValue={p?.parking ?? 0} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Configurations" name="configurations" defaultValue={p?.configurations} placeholder="e.g. 2 & 3 BHK" />
              <Input label="Available from" name="availableFrom" defaultValue={p?.availableFrom} placeholder="e.g. March 2027" />
              <Input label="RERA number" name="rera" defaultValue={p?.rera} />
            </div>
            <Textarea
              label="Floor plans & pricing"
              name="floorPlans"
              rows={3}
              defaultValue={p?.floorPlans.map((f) => `${f.name} | ${f.sqft} | ${f.price}`).join("\n")}
              hint="One per line: Unit name | size in ft² | price in ₹ (e.g. 3 BHK | 1600 | 15000000)"
            />
          </Panel>

          <Panel title="Features & amenities" text="Comma separated, e.g. Gym, Clubhouse, Swimming Pool">
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURE_GROUPS.map((g) => (
                <Input key={g} label={g} name={`features.${g}`} defaultValue={p?.features[g]?.join(", ")} />
              ))}
            </div>
          </Panel>

          <Panel title="Photos" text="The first image is used as the cover photo.">
            <Textarea
              label="Image URLs"
              name="images"
              rows={5}
              defaultValue={p?.images.join("\n")}
              hint="One per line. Reorder lines to change the order, delete a line to remove a photo."
            />
            <Input label="Upload new photos" name="uploads" type="file" accept="image/*" multiple hint="JPG, PNG or WebP up to 8 MB each. Added after the existing photos." />
          </Panel>
        </div>

        <div className="grid content-start gap-6">
          <Panel title="Listing">
            <Select label="Listing type" name="listingType" options={LISTING_TYPES} defaultValue={p?.listingType} />
            <Select label="Category" name="category" options={CATEGORIES} defaultValue={p?.category} />
            <Select label="Status" name="status" options={STATUSES} defaultValue={p?.status} />
            <Input label="Price (₹)" name="price" type="number" min={0} defaultValue={p?.price ?? 0} hint="Starting price, or monthly rent for rentals" required />
          </Panel>
          <Panel title="Visibility">
            <Checkbox label="Published on website" name="published" defaultChecked={p?.published ?? true} />
            <Checkbox label="Featured on home page" name="featured" defaultChecked={p?.featured} />
          </Panel>
        </div>
      </div>
    </AdminForm>
  );
}
