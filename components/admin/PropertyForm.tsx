"use client";

import { useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminForm } from "./client";
import { VariantEditor } from "./VariantEditor";
import { Checkbox, Input, OptionalGroup, Panel, Select, Textarea, secondaryButton } from "./fields";
import { saveProperty } from "@/app/admin/actions";
import { CATEGORIES, LISTING_TYPES, PLACEMENTS, type Placement, type Property } from "@/lib/types";

const PLACEMENT_COPY: Record<Placement, { label: string; hint: string }> = {
  spotlight: { label: "Hero slideshow on the home page", hint: "Big rotating photos at the top of the home page" },
  homeFeatured: { label: "Featured on the home page", hint: "Shown in the Featured properties section" },
  footer: { label: "Featured in the footer", hint: "Up to 3 properties appear in the site footer" },
  pinned: { label: "Pin to the top of Properties", hint: "Stays near the top of the Properties list" },
};

const STEPS = [
  { title: "Property details", short: "Details", text: "Name, type and description" },
  { title: "Location & RERA", short: "Location", text: "Where buyers can find it" },
  { title: "Home types & prices", short: "Homes", text: "Sizes, prices and availability" },
  { title: "Photos", short: "Photos", text: "Images buyers will see" },
  { title: "Publish & promote", short: "Publish", text: "Review where it appears" },
] as const;

export function PropertyForm({ p }: { p?: Property }) {
  const [step, setStep] = useState(0);

  function showStep(index: number) {
    setStep(index);
    requestAnimationFrame(() => document.getElementById("property-step-heading")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function validateStep(form: HTMLFormElement, index: number) {
    const section = form.querySelector<HTMLElement>(`[data-property-step="${index}"]`);
    const fields = section?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
    const invalid = Array.from(fields ?? []).find((field) => !field.checkValidity());
    if (!invalid) return true;
    setStep(index);
    requestAnimationFrame(() => {
      for (let details = invalid.closest("details"); details; details = details.parentElement?.closest("details") ?? null) details.open = true;
      invalid.reportValidity();
      invalid.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return false;
  }

  function continueFrom(form: HTMLFormElement) {
    if (validateStep(form, step)) showStep(step + 1);
  }

  function beforeSubmit(event: FormEvent<HTMLFormElement>) {
    if (!p && step < STEPS.length - 1) {
      event.preventDefault();
      continueFrom(event.currentTarget);
      return;
    }
    for (let index = 0; index < STEPS.length; index++) {
      if (!validateStep(event.currentTarget, index)) {
        event.preventDefault();
        return;
      }
    }
  }

  return (
    <AdminForm
      action={saveProperty}
      submitLabel={p ? "Save changes" : "Create property"}
      noValidate
      onBeforeSubmit={beforeSubmit}
      showSubmit={Boolean(p) || step === STEPS.length - 1}
      footerActions={
        <div className="flex flex-wrap items-center gap-2">
          {step > 0 && (
            <button type="button" className={secondaryButton} onClick={() => showStep(step - 1)}>
              <ChevronLeft className="size-4" /> Back
            </button>
          )}
          {step < STEPS.length - 1 && (
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700" onClick={(event) => continueFrom(event.currentTarget.form!)}>
              Continue <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      }
    >
      {p && <input type="hidden" name="id" value={p.id} />}

      <div id="property-step-heading" className="scroll-mt-20 rounded-2xl border border-line bg-white p-4 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">Step {step + 1} of {STEPS.length}</p>
            <h2 className="mt-1 text-xl font-bold text-ink">{STEPS[step].title}</h2>
            <p className="mt-1 text-sm text-muted">{STEPS[step].text}</p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface" aria-hidden="true">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <nav aria-label="Property form steps" className="mt-5 grid grid-cols-5 gap-1.5">
          {STEPS.map((item, index) => (
            <button
              key={item.short}
              type="button"
              aria-current={index === step ? "step" : undefined}
              onClick={() => showStep(index)}
              className={`rounded-xl px-1 py-2 text-center text-xs font-medium transition sm:px-2 sm:text-sm ${index === step ? "bg-brand-600 text-white" : index < step ? "bg-brand-50 text-brand-700 hover:bg-brand-100" : "bg-surface text-muted hover:text-ink"}`}
            >
              <span className="block text-[10px] opacity-75">{index + 1}</span>
              <span>{item.short}</span>
            </button>
          ))}
        </nav>
      </div>

      <div key={p?.updatedAt ?? "new"}>
        <div data-property-step="0" className={step === 0 ? "grid gap-6" : "hidden"}>
        <Panel title="Property details" text="Start with what buyers need to recognize this property.">
          <Input label="Property name" name="title" defaultValue={p?.title} required placeholder="e.g. Skyline Ariana Residences" />
          <Input
            label="Total units available in this property"
            name="units"
            type="number"
            min={0}
            step={1}
            defaultValue={p?.units ?? ""}
            placeholder="e.g. 75"
            hint="One total across all home types. Leave blank if unknown; enter 0 if the property is sold out."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="For sale or rent?" name="listingType" options={LISTING_TYPES} defaultValue={p?.listingType} />
            <Select label="Property type" name="category" options={CATEGORIES} defaultValue={p?.category} />
          </div>
          <Textarea
            label="Short summary"
            name="summary"
            rows={2}
            defaultValue={p?.summary}
            hint="One or two lines on listing cards and in Google search"
            placeholder="Premium ready-to-move apartments in Kalinga Nagar"
          />
          <OptionalGroup title="More property details" text="Builder, custom web address and full description. Add these when you have them.">
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
              label="Full description"
              name="description"
              rows={8}
              defaultValue={p?.description.join("\n\n")}
              hint="Write the full story. Put a blank line between paragraphs."
            />
          </OptionalGroup>
        </Panel>
        </div>

        <div data-property-step="1" className={step === 1 ? "grid gap-6" : "hidden"}>
        <Panel title="Location & RERA" text="Where the property is, and its registration number.">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Area / locality" name="area" defaultValue={p?.area} placeholder="e.g. Kalinga Nagar" />
            <Input label="City" name="city" defaultValue={p?.city ?? "Bhubaneswar"} />
            <Input label="State" name="state" defaultValue={p?.state ?? "Odisha"} />
          </div>
          <Input label="RERA number" name="rera" defaultValue={p?.rera} placeholder="e.g. RP/19/2024/01234" hint="Shown on the property page for buyers" />
        </Panel>
        </div>

        <div data-property-step="2" className={step === 2 ? "grid gap-6" : "hidden"}>
        <Panel
          title="Home types & prices"
          text="Add one type at a time. Start with its name, price and size; open the extra sections only when you need them."
        >
          <VariantEditor key={p?.updatedAt ?? "new"} p={p} />
        </Panel>
        </div>

        <div data-property-step="3" className={step === 3 ? "grid gap-6" : "hidden"}>
        <Panel title="Photos" text="The first photo is the cover on cards and Google results.">
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
        </div>

        <div data-property-step="4" className={step === 4 ? "grid gap-6" : "hidden"}>
        <Panel title="Publish & promote" text="Control whether it is live, and where else it should appear.">
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
      </div>
    </AdminForm>
  );
}
