"use client";

import { useState } from "react";
import { ChevronDown, Copy, Plus, Trash2 } from "lucide-react";
import { Checkbox, FieldGroup, Input, OptionalGroup, Select, Textarea, secondaryButton } from "./fields";
import { FEATURE_GROUPS, STATUSES, type Property, type PropertyVariant } from "@/lib/types";
import { formatSizeRange } from "@/lib/variants";

type Draft = Omit<PropertyVariant, "features" | "floorPlans"> & {
  sizeMode: "single" | "range";
  features: Record<(typeof FEATURE_GROUPS)[number], string>;
  floorPlans: { id: number; name: string; sqft: number; sqftMax: number; price: string }[];
};
type Row = { id: number; value: Draft };

function draft(v?: PropertyVariant): Draft {
  return {
    name: v?.name ?? "",
    basePrice: v?.basePrice ?? "",
    price: v?.price ?? "",
    units: v?.units ?? null,
    soldOut: v?.soldOut ?? v?.units === 0,
    bedrooms: v?.bedrooms ?? 0,
    bathrooms: v?.bathrooms ?? 0,
    sqft: v?.sqft ?? 0,
    sqftMax: v?.sqftMax ?? v?.sqft ?? 0,
    sizeMode: (v?.sqftMax ?? v?.sqft ?? 0) > (v?.sqft ?? 0) ? "range" : "single",
    floorPlans: v?.floorPlans?.map((plan, id) => ({ id, ...plan, sqftMax: plan.sqftMax ?? plan.sqft })) ?? [],
    parking: v?.parking ?? 0,
    status: v?.status ?? STATUSES[0],
    availableFrom: v?.availableFrom ?? "",
    description: v?.description ?? "",
    features: Object.fromEntries(FEATURE_GROUPS.map((g) => [g, v?.features?.[g]?.join(", ") ?? ""])) as Draft["features"],
  };
}

function initial(p?: Property): Row[] {
  if (p?.variants?.length) return p.variants.map((v, id) => ({ id, value: draft(v) }));
  const legacy = p && {
    name: p.floorPlans?.[0]?.name || p.configurations || "",
    basePrice: "",
    price: p.price,
    units: p.units,
    soldOut: p.units === 0,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
    parking: p.parking,
    status: p.status,
    availableFrom: p.availableFrom,
    description: "",
    features: p.features,
  };
  if (p?.floorPlans?.length) {
    return p.floorPlans.map((plan, id) => ({
      id,
      value: draft({ ...legacy!, name: plan.name, sqft: plan.sqft, sqftMax: plan.sqftMax ?? plan.sqft, price: String(plan.price || p.price) }),
    }));
  }
  return [{ id: 0, value: draft(legacy || undefined) }];
}

export function VariantEditor({ p }: { p?: Property }) {
  const [rows, setRows] = useState<Row[]>(() => initial(p));
  const [nextId, setNextId] = useState(() => Math.max(0, ...initial(p).map((r) => r.id)) + 1);
  const [activeId, setActiveId] = useState(() => initial(p)[0]?.id ?? -1);

  function change(id: number, patch: Partial<Draft>) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, value: { ...row.value, ...patch } } : row));
  }

  function add(source?: Draft) {
    setRows((current) => [...current, { id: nextId, value: source ? { ...source, features: { ...source.features }, floorPlans: source.floorPlans.map((plan) => ({ ...plan })) } : draft() }]);
    setActiveId(nextId);
    setNextId((id) => id + 1);
  }

  function changePlan(id: number, planId: number, patch: Partial<Draft["floorPlans"][number]>) {
    setRows((current) => current.map((row) => row.id === id ? {
      ...row, value: { ...row.value, floorPlans: row.value.floorPlans.map((plan) => plan.id === planId ? { ...plan, ...patch } : plan) },
    } : row));
  }

  return (
    <div className="grid gap-5">
      <input type="hidden" name="variantCount" value={rows.length} />
      <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-4 text-sm text-ink">
        <p className="font-semibold text-brand-700">Start with one home type</p>
        <p className="mt-1 text-muted">A home type is a priced option, such as “2 BHK”, “3 BHK” or “Office suite”. Add another type for a different option. Named layouts belong inside that type as floor plans.</p>
      </div>
      {rows.map(({ id, value: v }, index) => {
        const key = `variants.${index}`;
        const label = v.name.trim() || `Home type ${index + 1}`;
        return (
          <details
            key={id}
            open={id === activeId}
            onToggle={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.currentTarget.open) setActiveId(id);
              else if (activeId === id) setActiveId(-1);
            }}
            className="group rounded-xl border border-line bg-white p-4 md:p-5"
          >
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <div>
                <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
                  Home type {index + 1}
                  {index === 0 ? " · appears first on the listing" : ""}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{label}</h3>
              </div>
              <span className="flex items-center gap-2 text-sm font-medium text-muted">
                <span className="text-right">
                  <span className="block">{v.price || "Price not set"}</span>
                  {v.sqft > 0 && <span className="block text-xs font-normal">{formatSizeRange(v.sqft, v.sqftMax ?? v.sqft)}</span>}
                </span>
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </span>
            </summary>
            <div className="my-4 flex flex-wrap justify-end gap-2 border-y border-line py-3">
              <div className="flex flex-wrap gap-2">
                <button type="button" className={secondaryButton} onClick={() => add(v)}>
                  <Copy className="size-4" /> Duplicate this type
                </button>
                {rows.length > 1 && (
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() => {
                      if (activeId === id) setActiveId(rows.find((row) => row.id !== id)?.id ?? -1);
                      setRows((current) => current.filter((row) => row.id !== id));
                    }}
                    aria-label={`Remove ${label}`}
                  >
                    <Trash2 className="size-4" /> Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <FieldGroup title="1. Name and price" text="Give this home type a name and the price buyers should see.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Home type"
                    name={`${key}.name`}
                    value={v.name}
                    onChange={(e) => change(id, { name: e.target.value })}
                    placeholder="e.g. 2 BHK"
                    hint="For example: 2 BHK, 3 BHK, Plot A or Office suite"
                    required
                  />
                  <Input
                    label="Price from"
                    name={`${key}.price`}
                    value={v.price}
                    onChange={(e) => change(id, { price: e.target.value })}
                    placeholder="e.g. 85 Lakhs"
                    hint="The starting price shown to buyers"
                    required
                  />
                </div>
              </FieldGroup>

              <FieldGroup title="2. Size" text="Enter one size. Turn on the range only when homes of this type vary in size.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label={v.sizeMode === "range" ? "Smallest size (ft²)" : "Size (ft²)"}
                    name={`${key}.sqft`}
                    type="number"
                    min={0}
                    value={v.sqft || ""}
                    placeholder="e.g. 1249"
                    onChange={(e) => {
                      const sqft = Number(e.target.value) || 0;
                      change(id, { sqft, ...(v.sizeMode === "single" && { sqftMax: sqft }) });
                    }}
                  />
                  {v.sizeMode === "range" ? (
                    <Input
                      label="Largest size (ft²)"
                      name={`${key}.sqftMax`}
                      type="number"
                      min={v.sqft}
                      value={v.sqftMax || ""}
                      placeholder="e.g. 1400"
                      onChange={(e) => change(id, { sqftMax: Number(e.target.value) || 0 })}
                    />
                  ) : <input type="hidden" name={`${key}.sqftMax`} value={v.sqft} />}
                </div>
                <Checkbox
                  label="This home type has a size range"
                  checked={v.sizeMode === "range"}
                  onChange={(e) => change(id, { sizeMode: e.target.checked ? "range" : "single", sqftMax: e.target.checked ? Math.max(v.sqftMax ?? 0, v.sqft) : v.sqft })}
                />
                {v.floorPlans.some((plan) => plan.sqft < v.sqft || plan.sqftMax > (v.sqftMax ?? v.sqft)) && (
                  <p role="alert" className="text-xs font-medium text-amber-700">A floor plan is outside this home type&apos;s size range. Adjust the size here or in that floor plan before saving.</p>
                )}
              </FieldGroup>

              <OptionalGroup
                title="Rooms & parking"
                text={v.bedrooms || v.bathrooms || v.parking
                  ? `${v.bedrooms} bedrooms · ${v.bathrooms} bathrooms · ${v.parking} parking spaces`
                  : "Add bedrooms, bathrooms and parking spaces if they apply."}
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {(["bedrooms", "bathrooms", "parking"] as const).map((field) => (
                    <Input
                      key={field}
                      label={{ bedrooms: "Bedrooms", bathrooms: "Bathrooms", parking: "Parking spaces" }[field]}
                      name={`${key}.${field}`}
                      type="number"
                      min={0}
                      value={v[field] || ""}
                      placeholder="0"
                      onChange={(e) => change(id, { [field]: e.target.value === "" ? 0 : Number(e.target.value) })}
                    />
                  ))}
                </div>
              </OptionalGroup>

              <OptionalGroup
                title={`Named floor plans · ${v.floorPlans.length} added`}
                text="Optional. Use these for layouts such as Type A or Type B. If sizes vary, turn on the size range above first."
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted">
                    {v.floorPlans.length
                      ? "Each plan's sizes should fit within the home type size above."
                      : "Skip this if there are no named layouts. No drawing is needed."}
                  </p>
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() =>
                      change(id, {
                        floorPlans: [
                          ...v.floorPlans,
                          { id: Math.max(-1, ...v.floorPlans.map((plan) => plan.id)) + 1, name: "", sqft: v.sqft, sqftMax: v.sqftMax ?? v.sqft, price: v.price },
                        ],
                      })
                    }
                  >
                    <Plus className="size-4" /> Add a floor plan
                  </button>
                </div>
                <input type="hidden" name={`${key}.planCount`} value={v.floorPlans.length} />
                {v.floorPlans.length > 0 && (
                  <div className="grid gap-3">
                    {v.floorPlans.map((plan, planIndex) => (
                      <div key={plan.id} className="rounded-xl border border-line bg-white p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-ink">Plan {planIndex + 1}</p>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                            onClick={() => change(id, { floorPlans: v.floorPlans.filter((item) => item.id !== plan.id) })}
                            aria-label={`Remove floor plan ${planIndex + 1}`}
                          >
                            <Trash2 className="size-3.5" /> Remove
                          </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <Input
                            label="Layout name"
                            name={`${key}.plans.${planIndex}.name`}
                            value={plan.name}
                            onChange={(e) => changePlan(id, plan.id, { name: e.target.value })}
                            placeholder="e.g. Type A"
                            required
                          />
                          <Input
                            label="Smallest size (ft²)"
                            name={`${key}.plans.${planIndex}.sqft`}
                            type="number"
                            min={Math.max(1, v.sqft)}
                            max={v.sqftMax}
                            value={plan.sqft || ""}
                            onChange={(e) => {
                              const sqft = Number(e.target.value) || 0;
                              changePlan(id, plan.id, { sqft, ...(plan.sqftMax === plan.sqft && { sqftMax: sqft }) });
                            }}
                            required
                          />
                          <Input
                            label="Largest size (ft²)"
                            name={`${key}.plans.${planIndex}.sqftMax`}
                            type="number"
                            min={Math.max(1, plan.sqft)}
                            max={v.sqftMax}
                            value={plan.sqftMax || ""}
                            onChange={(e) => changePlan(id, plan.id, { sqftMax: Number(e.target.value) || 0 })}
                            hint="Use the same size if it does not vary"
                            required
                          />
                          <Input
                            label="Price shown"
                            name={`${key}.plans.${planIndex}.price`}
                            value={plan.price}
                            onChange={(e) => changePlan(id, plan.id, { price: e.target.value })}
                            placeholder="e.g. 95 Lakhs"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </OptionalGroup>

              <OptionalGroup title="Availability & other price details" text={`${v.status}${v.units === null ? " · units unknown" : ` · ${v.units} units available`}${v.basePrice ? " · base rate set" : ""}. Edit only if needed.`}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Select
                    label="Building stage"
                    name={`${key}.status`}
                    options={STATUSES}
                    value={v.status}
                    onChange={(e) => change(id, { status: e.target.value as PropertyVariant["status"] })}
                  />
                  <Input
                    label="Available from"
                    name={`${key}.availableFrom`}
                    value={v.availableFrom}
                    onChange={(e) => change(id, { availableFrom: e.target.value })}
                    placeholder="e.g. March 2027 or Immediate"
                  />
                  <Input
                    label="Units available"
                    name={`${key}.units`}
                    type="number"
                    min={0}
                    step={1}
                    value={v.units ?? ""}
                    onChange={(e) => change(id, { units: e.target.value === "" ? null : Number(e.target.value) })}
                    hint="Leave blank if you do not know"
                  />
                </div>
                <Input
                  label="Base rate (optional)"
                  name={`${key}.basePrice`}
                  value={v.basePrice}
                  onChange={(e) => change(id, { basePrice: e.target.value })}
                  placeholder="e.g. 75 Lakhs"
                  hint="Shown below the main price on the website. Leave blank unless you advertise a separate base rate."
                />
                <div className="rounded-xl border border-line bg-surface px-4 py-3">
                  <Checkbox
                    label="Sold out"
                    name={`${key}.soldOut`}
                    checked={Boolean(v.soldOut) || v.units === 0}
                    onChange={(e) => change(id, { soldOut: e.target.checked, ...(e.target.checked ? {} : v.units === 0 ? { units: null } : {}) })}
                  />
                  <p className="mt-1 pl-6.5 text-xs text-muted">Buyers can still find this home type, but it will be marked sold out. Entering 0 units also marks it sold out.</p>
                </div>
              </OptionalGroup>

              <OptionalGroup title="Description for this home type" text={v.description.trim() ? "Description added. Open to edit it." : "Optional. Add layout, finishes or other details that are specific to this type."}>
                <Textarea
                  label="Unit description / layout"
                  name={`${key}.description`}
                  rows={3}
                  value={v.description}
                  onChange={(e) => change(id, { description: e.target.value })}
                  placeholder="e.g. Corner unit with east-facing living room"
                />
              </OptionalGroup>

              <OptionalGroup title="Amenities & features" text={FEATURE_GROUPS.some((group) => v.features[group].trim()) ? "Features added. Open to edit them." : "Optional. Separate items with commas; buyers will see these on the property page."}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {FEATURE_GROUPS.map((group) => (
                    <Input
                      key={group}
                      label={group}
                      name={`${key}.features.${group}`}
                      value={v.features[group]}
                      onChange={(e) => change(id, { features: { ...v.features, [group]: e.target.value } })}
                      placeholder={
                        group === "Interior"
                          ? "Modular kitchen, Balcony"
                          : group === "Outdoor"
                            ? "Swimming pool, Garden"
                            : group === "Utilities"
                              ? "Power backup, Water supply"
                              : "Lift, Security"
                      }
                    />
                  ))}
                </div>
              </OptionalGroup>
            </div>
          </details>
        );
      })}
      <button type="button" className={`${secondaryButton} justify-self-start`} onClick={() => add()}>
        <Plus className="size-4" /> Add a different home type
      </button>
    </div>
  );
}
