"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { inputClass } from "./ui";
import { submitEnquiry } from "@/app/(site)/actions";
import type { Enquiry } from "@/lib/types";

type Field = { name: string; type?: string; required?: boolean; textarea?: boolean; options?: string[] };

const defaultFields: Field[] = [
  { name: "Full name", required: true },
  { name: "Mobile", type: "tel", required: true },
  { name: "Email", type: "email" },
  { name: "Message", textarea: true },
];

export function EnquiryForm({
  subject,
  type = "contact",
  fields = defaultFields,
  submitLabel = "Send enquiry",
}: {
  subject: string;
  type?: Enquiry["type"];
  fields?: Field[];
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState(submitEnquiry, null);

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-brand-50 p-8 text-center">
        <CheckCircle2 className="size-10 text-brand-600" />
        <p className="text-lg font-semibold text-ink">Thank you!</p>
        <p className="text-sm text-muted">We&apos;ve received your details and an advisor will get in touch shortly.</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="_type" value={type} />
      <input type="hidden" name="_subject" value={subject} />
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {fields.map((f) =>
        f.textarea ? (
          <textarea key={f.name} name={f.name} aria-label={f.name} placeholder={f.name} rows={4} className={inputClass} />
        ) : f.options ? (
          <select key={f.name} name={f.name} aria-label={f.name} required={f.required} className={inputClass} defaultValue="">
            <option value="" disabled>
              {f.name}
              {f.required && " *"}
            </option>
            {f.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            key={f.name}
            name={f.name}
            aria-label={f.name}
            type={f.type ?? "text"}
            required={f.required}
            placeholder={f.name + (f.required ? " *" : "")}
            className={inputClass}
          />
        ),
      )}
      <p className="text-xs text-muted">
        By submitting, you agree to be contacted about our properties and services via call, SMS or WhatsApp.
      </p>
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <button
        disabled={pending}
        className="rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}
