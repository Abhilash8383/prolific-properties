"use client";

import { useState } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";
import { Checkbox, FieldGroup, Input, Select, Textarea, secondaryButton } from "./fields";
import { FEATURE_GROUPS, STATUSES, type Property, type PropertyVariant } from "@/lib/types";

type Draft = Omit<PropertyVariant, "features" | "floorPlans"> & {
  features: Record<(typeof FEATURE_GROUPS)[number], string>;
  floorPlans: { id: number; name: string; sqft: number; price: string }[];
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
    floorPlans: v?.floorPlans?.map((plan, id) => ({ id, ...plan })) ?? [],
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
      value: draft({ ...legacy!, name: plan.name, sqft: plan.sqft, price: String(plan.price || p.price) }),
    }));
  }
  return [{ id: 0, value: draft(legacy || undefined) }];
}

export function VariantEditor({ p }: { p?: Property }) {
  const [rows, setRows] = useState<Row[]>(() => initial(p));
  const [nextId, setNextId] = useState(() => Math.max(0, ...initial(p).map((r) => r.id)) + 1);

  function change(id: number, patch: Partial<Draft>) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, value: { ...row.value, ...patch } } : row));
  }

  function add(source?: Draft) {
    setRows((current) => [...current, { id: nextId, value: source ? { ...source, features: { ...source.features }, floorPlans: source.floorPlans.map((plan) => ({ ...plan })) } : draft() }]);
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
      {rows.map(({ id, value: v }, index) => {
        const key = `variants.${index}`;
        const label = v.name.trim() || `Home type ${index + 1}`;
        return (
          <section key={id} className="rounded-xl border border-line bg-white p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
                  Home type {index + 1}
                  {index === 0 ? " · starts the listing price" : ""}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{label}</h3>
                <p className="mt-1 text-xs text-muted">
                  {index === 0
                    ? "Buyers see this price first on cards and search results."
                    : "Same as above — only change what is different for this home type."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={secondaryButton} onClick={() => add(v)}>
                  <Copy className="size-4" /> Copy
                </button>
                {rows.length > 1 && (
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() => setRows((current) => current.filter((row) => row.id !== id))}
                    aria-label={`Remove ${label}`}
                  >
                    <Trash2 className="size-4" /> Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <FieldGroup title="Name & price" text="What buyers call this home, and what it costs.">
                <Input
                  label="Home type name"
                  name={`${key}.name`}
                  value={v.name}
                  onChange={(e) => change(id, { name: e.target.value })}
                  placeholder="e.g. 2 BHK"
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Starting price"
                    name={`${key}.price`}
                    value={v.price}
                    onChange={(e) => change(id, { price: e.target.value })}
                    placeholder="e.g. 85 Lakhs"
                    hint="The price shown to buyers"
                    required
                  />
                  <Input
                    label="Base rate (optional)"
                    name={`${key}.basePrice`}
                    value={v.basePrice}
                    onChange={(e) => change(id, { basePrice: e.target.value })}
                    placeholder="e.g. 75 Lakhs"
                    hint="Only if you also show a lower base rate"
                  />
                </div>
              </FieldGroup>

              <FieldGroup title="Rooms & size" text="Beds, baths, parking, and size range for this home type.">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {(["bedrooms", "bathrooms", "parking"] as const).map((field) => (
                    <Input
                      key={field}
                      label={{ bedrooms: "Bedrooms", bathrooms: "Bathrooms", parking: "Parking" }[field]}
                      name={`${key}.${field}`}
                      type="number"
                      min={0}
                      value={v[field]}
                      onChange={(e) => change(id, { [field]: e.target.value === "" ? 0 : Number(e.target.value) })}
                    />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Minimum size (ft²)"
                    name={`${key}.sqft`}
                    type="number"
                    min={0}
                    value={v.sqft}
                    onChange={(e) => {
                      const sqft = Number(e.target.value) || 0;
                      change(id, { sqft, ...(v.sqftMax === v.sqft && { sqftMax: sqft }) });
                    }}
                  />
                  <Input
                    label="Maximum size (ft²)"
                    name={`${key}.sqftMax`}
                    type="number"
                    min={0}
                    value={v.sqftMax ?? 0}
                    onChange={(e) => change(id, { sqftMax: Number(e.target.value) || 0 })}
                    hint="Same as minimum if there is only one size"
                  />
                </div>
              </FieldGroup>

              <FieldGroup
                title="Floor plan options (optional)"
                text="Only if this home type has more than one exact plan with its own size and price."
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted">
                    {v.floorPlans.length
                      ? `${v.floorPlans.length} plan${v.floorPlans.length === 1 ? "" : "s"} added`
                      : "No extra plans yet — skip this if one size/price is enough."}
                  </p>
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() =>
                      change(id, {
                        floorPlans: [
                          ...v.floorPlans,
                          { id: Math.max(-1, ...v.floorPlans.map((plan) => plan.id)) + 1, name: "", sqft: v.sqft, price: v.price },
                        ],
                      })
                    }
                  >
                    <Plus className="size-4" /> Add floor plan
                  </button>
                </div>
                <input type="hidden" name={`${key}.planCount`} value={v.floorPlans.length} />
                {v.floorPlans.length > 0 && (
                  <div className="grid gap-3">
                    {v.floorPlans.map((plan, planIndex) => (
                      <div
                        key={plan.id}
                        className="grid items-end gap-3 rounded-xl border border-line bg-white p-3 sm:grid-cols-[1fr_8rem_10rem_auto]"
                      >
                        <Input
                          label="Plan name"
                          name={`${key}.plans.${planIndex}.name`}
                          value={plan.name}
                          onChange={(e) => changePlan(id, plan.id, { name: e.target.value })}
                          placeholder="e.g. Type A"
                          required
                        />
                        <Input
                          label="Size (ft²)"
                          name={`${key}.plans.${planIndex}.sqft`}
                          type="number"
                          min={0}
                          value={plan.sqft}
                          onChange={(e) => changePlan(id, plan.id, { sqft: Number(e.target.value) || 0 })}
                          required
                        />
                        <Input
                          label="Exact price"
                          name={`${key}.plans.${planIndex}.price`}
                          value={plan.price}
                          onChange={(e) => changePlan(id, plan.id, { price: e.target.value })}
                          placeholder="e.g. 95 Lakhs"
                          required
                        />
                        <button
                          type="button"
                          className={`${secondaryButton} h-10`}
                          onClick={() => change(id, { floorPlans: v.floorPlans.filter((item) => item.id !== plan.id) })}
                          aria-label={`Remove floor plan ${planIndex + 1}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </FieldGroup>

              <FieldGroup title="Availability" text="Ready now, under construction, or how many units left.">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Select
                    label="Construction status"
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
                <div className="rounded-xl border border-line bg-surface px-4 py-3">
                  <Checkbox
                    label="Sold out"
                    name={`${key}.soldOut`}
                    checked={Boolean(v.soldOut) || v.units === 0}
                    onChange={(e) => change(id, { soldOut: e.target.checked, ...(e.target.checked ? {} : v.units === 0 ? { units: null } : {}) })}
                  />
                  <p className="mt-1 pl-6.5 text-xs text-muted">Buyers can still find this home type, but it will be marked sold out. Entering 0 units also marks it sold out.</p>
                </div>
              </FieldGroup>

              <FieldGroup title="Notes for this home type" text="Optional. Layout, finishes, or anything specific to this type.">
                <Textarea
                  label="Unit description / layout"
                  name={`${key}.description`}
                  rows={3}
                  value={v.description}
                  onChange={(e) => change(id, { description: e.target.value })}
                  placeholder="e.g. Corner unit with east-facing living room"
                />
              </FieldGroup>

              <FieldGroup title="Amenities & features" text="Comma-separated lists. Shown on the public property page.">
                <div className="grid gap-4 sm:grid-cols-2">
                  {FEATURE_GROUPS.map((group) => (
                    <Input
                      key={group}
                      label={group}
                      name={`${key}.features.${group}`}
                      value={v.features[group]}
                      onChange={(e) => change(id, { features: { ...v.features, [group]: e.target.value } })}
                      hint="e.g. Gym, Clubhouse, Indoor Games"
                      placeholder={
                        group === "Interior"
                          ? "Clubhouse, Gym"
                          : group === "Outdoor"
                            ? "Swimming Pool, Jogging Track"
                            : group === "Utilities"
                              ? "Power Backup, Water Treatment"
                              : "Elevator, Gated Community"
                      }
                    />
                  ))}
                </div>
              </FieldGroup>
            </div>
          </section>
        );
      })}
      <button type="button" className={`${secondaryButton} justify-self-start`} onClick={() => add(rows.at(-1)?.value)}>
        <Plus className="size-4" /> Add another home type
      </button>
    </div>
  );
}
